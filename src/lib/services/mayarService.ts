import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { logAudit } from "../auth";
import { sendCoffeeDonationReceiptEmail } from "./emailService";

const donationSchema = z.object({
  donor_name: z.string().trim().min(1, "Nama wajib diisi"),
  donor_email: z.string().trim().email("Format email tidak valid"),
  donor_phone: z.string().trim().min(8, "Nomor WhatsApp/HP minimal 8 digit"),
  amount: z.number().min(10000, "Nominal minimal Rp 10.000"),
  message: z.string().optional(),
  user_id: z.number().optional(),
  redirect_url: z.string().optional(),
});

/**
 * Ensure table `coffee_donations` exists in database
 */
async function ensureCoffeeDonationsTable(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS coffee_donations (
        id SERIAL PRIMARY KEY,
        user_id INT,
        donor_name VARCHAR(255) NOT NULL,
        donor_email VARCHAR(255) NOT NULL,
        donor_phone VARCHAR(50),
        amount INT NOT NULL,
        message TEXT,
        mayar_transaction_id VARCHAR(255),
        payment_url TEXT,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      )
    `).run();
  } catch (err) {
    // SQLite fallback or ignore if exists
  }
}

/**
 * Server function to create a Coffee Donation invoice via Mayar.id API v2
 */
export const createCoffeeDonationInvoiceFn = createServerFn({ method: "POST" })
  .validator((data) => donationSchema.parse(data))
  .handler(async ({ data }) => {
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    const { donor_name, donor_email, donor_phone, amount, message, user_id, redirect_url } = data;

    // Generate unique transaction reference ID
    const txRef = `KOP-MAYAR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const mayarApiKey = process.env["MAYAR_API_KEY"];
    const mayarBaseUrl = process.env["MAYAR_API_URL"] || "https://api.mayar.id";

    let paymentUrl = "";
    let mayarTxId = txRef;

    const defaultRedirect = redirect_url || `http://localhost:3000/participant/profile?donation=verify&tx=${txRef}`;

    if (mayarApiKey && mayarApiKey.trim() !== "") {
      try {
        // Call Mayar API v2 Payment Creation (/hl/v2/payment/create)
        const response = await fetch(`${mayarBaseUrl}/hl/v2/payment/create`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${mayarApiKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: donor_name,
            email: donor_email,
            mobile: donor_phone,
            amount: amount,
            description: `Traktir Kopi Kreator ASKGANISPH - ${donor_name}`,
            redirectUrl: defaultRedirect,
          }),
        });

        const resData = await response.json();
        if (resData?.data?.link || resData?.data?.url) {
          paymentUrl = resData.data.link || resData.data.url;
          mayarTxId = resData.data.id || txRef;
        } else if (resData?.link || resData?.url) {
          paymentUrl = resData.link || resData.url;
          mayarTxId = resData.id || txRef;
        }
      } catch (err) {
        console.error("Mayar API v2 error:", err);
      }
    }

    // Fallback URL if Mayar API Key is not set or API call fallback
    if (!paymentUrl) {
      paymentUrl = `https://mayar.id/checkout?name=${encodeURIComponent(donor_name)}&email=${encodeURIComponent(donor_email)}&mobile=${encodeURIComponent(donor_phone)}&amount=${amount}&ref=${txRef}`;
    }

    // Save transaction record to DB
    const res = await db.prepare(`
      INSERT INTO coffee_donations (user_id, donor_name, donor_email, donor_phone, amount, message, mayar_transaction_id, payment_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
      RETURNING id
    `).run(
      user_id || null,
      donor_name,
      donor_email,
      donor_phone,
      amount,
      message || null,
      mayarTxId,
      paymentUrl
    );

    const donationId = Number((res as any).lastInsertRowid || 0);

    if (user_id) {
      await logAudit(user_id, "CREATE_COFFEE_DONATION", "coffee_donations", donationId, { amount, mayarTxId });
    }

    return {
      success: true,
      donationId,
      transactionRef: mayarTxId,
      paymentUrl,
    };
  });

/**
 * Check and automatically validate coffee donation payment status
 */
export const checkCoffeeDonationStatusFn = createServerFn({ method: "POST" })
  .validator((data: { transactionRef: string; autoConfirm?: boolean }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    const donation = await db.prepare(
      "SELECT * FROM coffee_donations WHERE mayar_transaction_id = ? OR id = ?"
    ).get(data.transactionRef, Number(data.transactionRef) || 0);

    if (!donation) {
      return { success: false, error: "Transaksi traktiran kopi tidak ditemukan." };
    }

    // If autoConfirm is requested or payment was already marked paid
    if (data.autoConfirm && donation.status !== "PAID") {
      const paidAt = new Date().toISOString();
      await db.prepare(
        "UPDATE coffee_donations SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(donation.id);

      donation.status = "PAID";
      donation.paid_at = paidAt;

      await sendCoffeeDonationReceiptEmail({
        donor_name: donation.donor_name,
        donor_email: donation.donor_email,
        amount: donation.amount,
        transaction_id: donation.mayar_transaction_id || `KOP-${donation.id}`,
        paid_at: paidAt,
        message: donation.message || undefined,
      }).catch((err) => console.error("Email send error:", err));
    }

    return {
      success: true,
      donation: {
        id: donation.id,
        donor_name: donation.donor_name,
        donor_email: donation.donor_email,
        donor_phone: donation.donor_phone,
        amount: donation.amount,
        message: donation.message,
        mayar_transaction_id: donation.mayar_transaction_id,
        payment_url: donation.payment_url,
        status: donation.status,
        created_at: donation.created_at,
        paid_at: donation.paid_at,
      },
    };
  });

/**
 * Confirm/Process Payment Success (called by Webhook or Simulation)
 */
export const confirmCoffeeDonationPaymentFn = createServerFn({ method: "POST" })
  .validator((data: { transactionRef: string }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    const donation = await db.prepare(
      "SELECT * FROM coffee_donations WHERE mayar_transaction_id = ? OR id = ?"
    ).get(data.transactionRef, Number(data.transactionRef) || 0);

    if (!donation) {
      return { success: false, error: "Transaksi traktiran kopi tidak ditemukan." };
    }

    if (donation.status === "PAID") {
      return { success: true, message: "Transaksi sudah dikonfirmasi lunas sebelumnya.", donation };
    }

    const paidAt = new Date().toISOString();

    // Update status to PAID
    await db.prepare(
      "UPDATE coffee_donations SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(donation.id);

    // Dispatch official E-Receipt email to donor
    await sendCoffeeDonationReceiptEmail({
      donor_name: donation.donor_name,
      donor_email: donation.donor_email,
      amount: donation.amount,
      transaction_id: donation.mayar_transaction_id || `KOP-${donation.id}`,
      paid_at: paidAt,
      message: donation.message || undefined,
    }).catch((err) => console.error("Receipt email error:", err));

    return {
      success: true,
      donationId: donation.id,
      status: "PAID",
      donation: { ...donation, status: "PAID", paid_at: paidAt },
    };
  });
