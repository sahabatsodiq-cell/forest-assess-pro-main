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
