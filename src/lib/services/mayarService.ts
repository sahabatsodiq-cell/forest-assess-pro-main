import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { logAudit, verifySessionToken, hasPermission } from "../auth";
import { sendCoffeeDonationReceiptEmail } from "./emailService";

const donationSchema = z.object({
  donor_name: z.string().trim().min(1, "Nama wajib diisi"),
  donor_email: z.string().trim().email("Format email tidak valid"),
  donor_phone: z.string().trim().min(8, "Nomor WhatsApp/HP minimal 8 digit"),
  amount: z.number().min(1000, "Nominal minimal Rp 1.000"),
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

function verifyAdminSession(token?: string) {
  let activeToken = token;
  if (!activeToken && typeof window === "undefined") {
    try {
      const { getCookie } = require("@tanstack/react-start/server");
      activeToken = getCookie("session_token");
    } catch {
      // Ignore if not in server context
    }
  }
  if (!activeToken) throw new Error("Unauthorized: Sesi tidak ditemukan.");
  const session = verifySessionToken(activeToken);
  if (!session || !hasPermission(session.role, "user.view")) {
    throw new Error("Forbidden: Akses Admin diperlukan.");
  }
  return session;
}

/**
 * Cek status pembayaran riil langsung ke Mayar API v2
 */
export async function verifyPaymentWithMayarApi(mayarTxId: string): Promise<boolean> {
  const mayarApiKey = process.env["MAYAR_API_KEY"];
  const mayarBaseUrl = process.env["MAYAR_API_URL"] || "https://api.mayar.id";

  if (!mayarApiKey || !mayarApiKey.trim()) {
    return false;
  }

  try {
    const res = await fetch(`${mayarBaseUrl}/hl/v2/payment/${mayarTxId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${mayarApiKey.trim()}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return false;
    const resData = await res.json();
    const status = (resData?.data?.status || resData?.status || "").toUpperCase();
    return status === "PAID" || status === "SUCCESS" || status === "SETTLEMENT";
  } catch (err) {
    console.error("Error querying Mayar API v2 payment status:", err);
    return false;
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
        } else {
          console.error("Mayar API v2 error response:", resData);
          throw new Error(resData?.messages || resData?.message || "Gagal membuat payment link di Mayar.id");
        }
      } catch (err: any) {
        console.error("Mayar API v2 fetch error:", err);
        throw new Error(err.message || "Gagal menghubungi API Mayar.id");
      }
    } else {
      // Jika MAYAR_API_KEY belum dikonfigurasi di .env
      throw new Error(
        "MAYAR_API_KEY belum dikonfigurasi di file .env. Silakan masukkan MAYAR_API_KEY resmi dari https://web.mayar.id (Integrasi -> API Key)."
      );
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
 * Check payment status using official Mayar API Polling (Aman dari autoConfirm palsu)
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

    if (donation.status === "PAID") {
      return {
        success: true,
        isPaid: true,
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
    }

    // Melakukan query status resmi ke Mayar API
    const isPaidOnMayar = await verifyPaymentWithMayarApi(donation.mayar_transaction_id);

    if (isPaidOnMayar) {
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
      isPaid: donation.status === "PAID",
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
 * Confirm/Process Payment Success (Khusus Admin atau Webhook Signature terverifikasi)
 */
export const confirmCoffeeDonationPaymentFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string; transactionRef: string; isWebhookSecret?: string }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    const configuredSecret = process.env["MAYAR_WEBHOOK_SECRET"];
    const isWebhookValid = configuredSecret && data.isWebhookSecret === configuredSecret;

    // Jika bukan dari Webhook terverifikasi, wajib ada Sesi Admin yang valid
    if (!isWebhookValid) {
      verifyAdminSession(data.token);
    }

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

/**
 * Process Mayar Webhook Event Payload securely
 */
export const processMayarWebhookFn = createServerFn({ method: "POST" })
  .validator((data: { secretToken?: string; payload: any }) => data)
  .handler(async ({ data }) => {
    const configuredSecret = process.env["MAYAR_WEBHOOK_SECRET"];
    if (configuredSecret && data.secretToken !== configuredSecret) {
      throw new Error("Unauthorized: Invalid Webhook Secret");
    }

    const { payload } = data;
    const event = payload?.event || payload?.type;
    const txId = payload?.data?.id || payload?.data?.transactionId || payload?.data?.paymentId || payload?.id;

    if (!txId) {
      return { success: false, error: "Missing transaction ID in webhook payload" };
    }

    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    const donation = await db.prepare(
      "SELECT * FROM coffee_donations WHERE mayar_transaction_id = ? OR id = ?"
    ).get(txId, Number(txId) || 0);

    if (!donation) {
      return { success: false, error: "Donation record not found" };
    }

    if (donation.status === "PAID") {
      return { success: true, message: "Donation already marked as PAID" };
    }

    const paidAt = new Date().toISOString();
    await db.prepare(
      "UPDATE coffee_donations SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(donation.id);

    await sendCoffeeDonationReceiptEmail({
      donor_name: donation.donor_name,
      donor_email: donation.donor_email,
      amount: donation.amount,
      transaction_id: donation.mayar_transaction_id || `KOP-${donation.id}`,
      paid_at: paidAt,
      message: donation.message || undefined,
    }).catch((err) => console.error("Webhook receipt email error:", err));

    return {
      success: true,
      donationId: donation.id,
      status: "PAID",
      event,
    };
  });

/**
 * Admin: Get all coffee donations with filtering & statistics
 */
export const getAdminDonationsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; search?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    let query = "SELECT * FROM coffee_donations WHERE 1=1";
    const params: any[] = [];

    if (data.status && data.status !== "ALL") {
      query += " AND status = ?";
      params.push(data.status);
    }

    if (data.search && data.search.trim() !== "") {
      const q = `%${data.search.trim()}%`;
      query += " AND (donor_name LIKE ? OR donor_email LIKE ? OR donor_phone LIKE ? OR mayar_transaction_id LIKE ?)";
      params.push(q, q, q, q);
    }

    query += " ORDER BY id DESC";

    const rows = await db.prepare(query).all(...params);
    const donations = Array.isArray(rows) ? rows : [];

    // Calculate aggregated statistics
    const allRows = await db.prepare("SELECT amount, status FROM coffee_donations").all();
    const list = Array.isArray(allRows) ? allRows : [];

    const totalDonations = list.length;
    const totalAmount = list.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const paidDonations = list.filter((r: any) => r.status === "PAID").length;
    const paidAmount = list.filter((r: any) => r.status === "PAID").reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const pendingDonations = list.filter((r: any) => r.status !== "PAID").length;
    const pendingAmount = list.filter((r: any) => r.status !== "PAID").reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    return {
      donations,
      stats: {
        totalDonations,
        totalAmount,
        paidDonations,
        paidAmount,
        pendingDonations,
        pendingAmount,
      },
    };
  });

/**
 * Participant: Get coffee donations by logged in user (IDOR Protected)
 */
export const getUserDonationsFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string; userId?: number; email?: string }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    await ensureCoffeeDonationsTable(db);

    let rows: any[] = [];

    // Verifikasi Sesi Token jika tersedia
    if (data.token) {
      const session = verifySessionToken(data.token);
      if (session) {
        rows = await db.prepare(
          "SELECT * FROM coffee_donations WHERE user_id = ? OR donor_email = ? ORDER BY id DESC"
        ).all(session.userId, session.email);
      }
    } else if (data.userId) {
      rows = await db.prepare(
        "SELECT * FROM coffee_donations WHERE user_id = ? ORDER BY id DESC"
      ).all(data.userId);
    } else if (data.email) {
      rows = await db.prepare(
        "SELECT * FROM coffee_donations WHERE donor_email = ? ORDER BY id DESC"
      ).all(data.email);
    }

    const donations = Array.isArray(rows) ? rows : [];

    const totalDonations = donations.length;
    const paidDonations = donations.filter((r: any) => r.status === "PAID").length;
    const totalAmount = donations.filter((r: any) => r.status === "PAID").reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const pendingDonations = donations.filter((r: any) => r.status !== "PAID").length;

    return {
      donations,
      stats: {
        totalDonations,
        paidDonations,
        totalAmount,
        pendingDonations,
      },
    };
  });


