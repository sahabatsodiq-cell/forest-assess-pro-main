/**
 * WhatsApp Notification Service for Traktir Kopi (ASKGANISPH)
 */

export function formatPhoneToWhatsapp(phone: string): string {
  let cleaned = (phone || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

interface InvoiceNotificationParams {
  donor_name: string;
  donor_phone: string;
  amount: number;
  payment_url: string;
  transaction_id: string;
}

interface ReceiptNotificationParams {
  donor_name: string;
  donor_phone: string;
  amount: number;
  transaction_id: string;
  paid_at: string;
  message?: string;
}

/**
 * Generate WhatsApp URL for sending Invoice / Payment link
 */
export function generateInvoiceWhatsappUrl({
  donor_name,
  donor_phone,
  amount,
  payment_url,
  transaction_id,
}: InvoiceNotificationParams): string {
  const formattedPhone = formatPhoneToWhatsapp(donor_phone);
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const text = 
`☕ *TAGIHAN TRAKTIR KOPI (ASKGANISPH)*
-----------------------------------------
Halo *${donor_name}*,

Terima kasih atas niat baik Anda untuk menraktir kopi Kreator ASKGANISPH!

📌 *Rincian Tagihan:*
• ID Transaksi: *${transaction_id}*
• Total Traktiran: *${formattedAmount}*
• Batas Pembayaran: *1 Jam*

Silakan selesaikan pembayaran melalui tautan aman Mayar.id berikut:
${payment_url}

_Pembayaran dapat dilakukan melalui QRIS, Transfer Bank, E-Wallet, atau Minimarket._
-----------------------------------------
*ASKGANISPH Platform*`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WhatsApp URL for sending E-Receipt / Payment Proof
 */
export function generateReceiptWhatsappUrl({
  donor_name,
  donor_phone,
  amount,
  transaction_id,
  paid_at,
  message,
}: ReceiptNotificationParams): string {
  const formattedPhone = formatPhoneToWhatsapp(donor_phone);
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  const formattedDate = new Date(paid_at).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const text = 
`☕ *BUKTI PEMBAYARAN TRAKTIR KOPI (E-RECEIPT)*
-----------------------------------------
STATUS: *LUNAS / PAID* ✅

Halo *${donor_name}*,
Terima kasih banyak! Pembayaran traktiran kopi Anda telah *BERHASIL DIVERIFIKASI*.

📌 *Rincian Transaksi:*
• ID Transaksi: *${transaction_id}*
• Donatur: *${donor_name}*
• Nominal: *${formattedAmount}*
• Waktu Lunas: *${formattedDate}*
${message ? `• Pesan: "_${message}_"\n` : ""}
Dukungan Anda sangat berharga untuk menjaga server ASKGANISPH tetap gratis dan melayani seluruh tenaga teknis kehutanan Indonesia.

_Diproses secara aman oleh Mayar.id_
-----------------------------------------
*ASKGANISPH Team*`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Send WhatsApp Notification (dispatches WhatsApp Web URL & logs notification)
 */
export async function sendCoffeeDonationWhatsAppReceipt(params: ReceiptNotificationParams) {
  try {
    const waUrl = generateReceiptWhatsappUrl(params);
    console.log(`[WhatsApp Service] E-Receipt notification generated for ${params.donor_phone}:`, waUrl);
    return { success: true, waUrl };
  } catch (err) {
    console.error("[WhatsApp Service] Error generating WhatsApp receipt:", err);
    return { success: false, error: String(err) };
  }
}
