import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginFn } from "@/lib/services/auth";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginFn({ data: { email, password } });
      if (res.success && res.token && res.user) {
        // Save session locally
        localStorage.setItem("askganis_token", res.token);
        localStorage.setItem("askganis_user", JSON.stringify(res.user));
        document.cookie = `session_token=${res.token}; path=/; max-age=86400; SameSite=Strict`;

        if (res.user.role === "SUPER_ADMIN" || res.user.role === "ADMIN") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/participant" });
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

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-ivory py-12 sm:px-6 lg:px-8">
      
      {/* Header logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="font-display text-2xl font-black text-forest-900">
          ASKGANISPH
        </a>
        <h2 className="mt-2 text-center text-xl font-bold tracking-tight text-charcoal">
          Masuk ke Platform Asesmen
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Kelola & ikuti ujian kompetensi tenaga teknis kehutanan
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border/60 bg-white py-8 px-6 shadow-md sm:px-10">
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
              {error}
            </div>
          )}

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
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                Password
              </label>
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

          {/* Quick Demo Test Accounts Box */}
          <div className="mt-8 border-t border-border/40 pt-5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-forest-900 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Akun Demo / Development (Seed Credentials)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => fillDemoAccount("superadmin@askganisph.id", "SuperAdmin123!")}
                className="rounded border border-forest-100 bg-forest-50 p-2 text-center font-bold text-forest-900 hover:bg-forest-100"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin@askganisph.id", "Admin123!")}
                className="rounded border border-forest-100 bg-forest-50 p-2 text-center font-bold text-forest-900 hover:bg-forest-100"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("peserta@askganisph.id", "Peserta123!")}
                className="rounded border border-forest-100 bg-forest-50 p-2 text-center font-bold text-forest-900 hover:bg-forest-100"
              >
                Peserta
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
