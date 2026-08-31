import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginFn, registerFn, checkFirstUserFn, requestPasswordResetFn } from "@/lib/services/auth";
import { ArrowRight, Lock, Mail, User, Sparkles, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot Password State
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstUser, setIsFirstUser] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkFirst() {
      try {
        const res = await checkFirstUserFn();
        setIsFirstUser(res.isFirstUser);
      } catch (err) {
        console.error(err);
      }
    }
    checkFirst();
  }, [mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginFn({ data: { email, password } });
      if (res.success && res.token && res.user) {
        localStorage.setItem("askganis_token", res.token);
        localStorage.setItem("askganis_user", JSON.stringify(res.user));
        document.cookie = `session_token=${res.token}; path=/; max-age=86400; SameSite=Strict`;

        toast.success(`Selamat datang kembali, ${res.user.name}!`);

        if (res.user.role === "SUPER_ADMIN" || res.user.role === "ADMIN") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/participant/profile" });
        }
      } else {
        setError(res.error || "Login gagal.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await registerFn({ data: { name, email: regEmail, password: regPassword } });
      if (res.success && res.user) {
        if (res.isFirstUser && res.token) {
          localStorage.setItem("askganis_token", res.token);
          localStorage.setItem("askganis_user", JSON.stringify(res.user));
          document.cookie = `session_token=${res.token}; path=/; max-age=86400; SameSite=Strict`;
          toast.success("Pendaftaran berhasil! Akun Anda didaftarkan sebagai ADMIN UTAMA.", { duration: 5000 });
          navigate({ to: "/admin" });
        } else {
          setEmail(regEmail);
          setPassword("");
          setRegPassword("");
          setMode("login");
          toast.success("Pendaftaran berhasil! Akun Anda sedang dalam proses Verifikasi & Validasi oleh Admin. Silakan tunggu hingga akun disetujui.", { duration: 7000 });
        }
      } else {
        setError(res.error || "Pendaftaran gagal.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage(null);
    setForgotError(null);

    try {
      const res = await requestPasswordResetFn({ data: { email: forgotEmail } });
      if (res.success) {
        setForgotMessage(res.message || "Instruksi reset kata sandi telah dikirimkan ke email Anda.");
        toast.success("Instruksi reset kata sandi terkirim ke email!");
      } else {
        setForgotError(res.error || "Gagal mengajukan reset kata sandi.");
      }
    } catch (err: any) {
      setForgotError(err.message || "Terjadi kesalahan.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-ivory py-12 sm:px-6 lg:px-8">
      
      {/* Header logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="font-display text-2xl font-black text-forest-900">
          ASKGANISPH
        </a>
        <h2 className="mt-2 text-center text-xl font-bold tracking-tight text-charcoal">
          {mode === "login" ? "Masuk ke Platform Asesmen" : "Pendaftaran Akun Baru"}
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Kelola & ikuti ujian kompetensi tenaga teknis kehutanan
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border/60 bg-white py-8 px-6 shadow-md sm:px-10">
          
          {/* Mode Switcher Tabs */}
          <div className="mb-6 flex rounded-lg bg-forest-50/50 p-1 border border-forest-100">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                mode === "login"
                  ? "bg-forest-900 text-white shadow-sm"
                  : "text-charcoal/70 hover:text-forest-900"
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${
                mode === "register"
                  ? "bg-forest-900 text-white shadow-sm"
                  : "text-charcoal/70 hover:text-forest-900"
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* First User Notice Banner */}
          {mode === "register" && isFirstUser && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 shadow-sm">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Pendaftaran Pertama Sistem</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                Belum ada pengguna terdaftar. Pendaftar pertama akan **otomatis didaftarkan sebagai ADMIN UTAMA (SUPER ADMIN)** dengan akses penuh!
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotMessage(null);
                      setForgotError(null);
                      setForgotOpen(true);
                    }}
                    className="text-[11px] font-bold text-forest-700 hover:underline"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk Platform"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Nama Lengkap
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : isFirstUser ? "Daftar sebagai Admin Utama" : "Daftar Akun Peserta"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL LUPA KATA SANDI MANDIRI                                      */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md bg-white p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-forest-700" />
              Lupa Kata Sandi Akun
            </DialogTitle>
          </DialogHeader>

          {forgotMessage && (
            <div className="rounded-lg bg-green-50 p-3.5 text-xs font-semibold text-green-800 border border-green-200 leading-relaxed">
              ✅ {forgotMessage}
            </div>
          )}

          {forgotError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
              {forgotError}
            </div>
          )}

          {!forgotMessage && (
            <form onSubmit={handleRequestPasswordReset} className="mt-2 space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Masukkan alamat email terdaftar akun Anda. Kami akan mengirimkan instruksi dan tautan untuk membuat kata sandi baru.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Alamat Email Terdaftar
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading || !forgotEmail}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-forest-700 disabled:opacity-50"
                >
                  {forgotLoading ? "Mengirim..." : "Kirim Instruksi Reset Email"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {forgotMessage && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="rounded-lg bg-forest-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-forest-700"
              >
                Tutup
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
