// Email Notification Service for ASKGANISPH Platform

export interface PasswordNotificationParams {
  email: string;
  name: string;
  newPassword?: string;
  resetReason?: string;
  resetLink?: string;
}

/**
 * Send password notification email when Admin resets a user's password.
 */
export async function sendPasswordChangeNotificationEmail({
  email,
  name,
  newPassword,
  resetReason = "Reset Password oleh Admin Sistem",
}: PasswordNotificationParams) {
  console.log("=================================================");
  console.log("📧 [EMAIL NOTIFICATION DISPATCHED]");
  console.log(`TO: ${name} <${email}>`);
  console.log(`SUBJECT: [ASKGANISPH] Pemberitahuan Kata Sandi Baru Akun Anda`);
  console.log(`BODY:`);
  console.log(`Halo ${name},`);
  console.log(`Kata sandi akun ASKGANISPH Anda telah diperbarui.`);
  console.log(`Alasan: ${resetReason}`);
  if (newPassword) {
    console.log(`Kata Sandi Baru Anda: ${newPassword}`);
  }
  console.log(`Silakan gunakan kata sandi ini untuk login ke platform: http://localhost:3000/login`);
  console.log(`Demi keamanan, disarankan untuk memperbarui kata sandi Anda setelah login.`);
  console.log("=================================================");

  return { success: true, emailSent: true };
}

/**
 * Send password reset link email for self-service forgot password requests.
 */
export async function sendPasswordResetLinkEmail({
  email,
  name,
  resetLink,
}: PasswordNotificationParams) {
  console.log("=================================================");
  console.log("📧 [EMAIL NOTIFICATION DISPATCHED]");
  console.log(`TO: ${name} <${email}>`);
  console.log(`SUBJECT: [ASKGANISPH] Instruksi Reset Kata Sandi Akun`);
  console.log(`BODY:`);
  console.log(`Halo ${name},`);
  console.log(`Kami menerima permintaan untuk mereset kata sandi akun ASKGANISPH Anda.`);
  console.log(`Silakan klik tautan berikut untuk membuat kata sandi baru (berlaku 1 jam):`);
  console.log(`${resetLink}`);
  console.log(`Jika Anda tidak merasa mengajukan permintaan ini, silakan abaikan email ini.`);
  console.log("=================================================");

  return { success: true, emailSent: true };
}

export interface CoffeeReceiptParams {
  donor_name: string;
  donor_email: string;
  amount: number;
  transaction_id: string;
  paid_at: string;
  message?: string;
}

/**
 * Send official E-Receipt email after successful Coffee Donation via Mayar.id
 */
export async function sendCoffeeDonationReceiptEmail({
  donor_name,
  donor_email,
  amount,
  transaction_id,
  paid_at,
  message,
}: CoffeeReceiptParams) {
  const formattedAmount = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  console.log("=================================================");
  console.log("☕ [E-RECEIPT EMAIL DISPATCHED]");
  console.log(`TO: ${donor_name} <${donor_email}>`);
  console.log(`SUBJECT: [ASKGANISPH] Bukti Pembayaran - Traktir Kopi Kreator (${formattedAmount})`);
  console.log(`BODY:`);
  console.log(`Yth. ${donor_name},`);
  console.log(`Terima kasih banyak atas dukungan Anda untuk platform ASKGANISPH!`);
  console.log(`Dukungan Anda sangat berarti untuk menjaga server ASKGANISPH tetap menyala dan gratis selamanya.`);
  console.log(``);
  console.log(`DETAIL TRANSAKSI PEMBAYARAN:`);
  console.log(`-----------------------------------------------`);
  console.log(`ID Transaksi / Invoice : ${transaction_id}`);
  console.log(`Nominal Traktiran Kopi : ${formattedAmount}`);
  console.log(`Tanggal & Waktu        : ${new Date(paid_at).toLocaleString("id-ID")}`);
  console.log(`Status Pembayaran      : LUNAS / SUCCESS (Powered by Mayar.id)`);
  if (message) {
    console.log(`Pesan Penyemangat      : "${message}"`);
  }
  console.log(`-----------------------------------------------`);
  console.log(`Salam hangat,`);
  console.log(`Tim Kreator ASKGANISPH`);
  console.log("=================================================");

  return { success: true, emailSent: true };
}
