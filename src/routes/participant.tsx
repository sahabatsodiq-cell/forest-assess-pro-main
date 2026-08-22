import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, UserCheck } from "lucide-react";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle, useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/participant")({
  component: ParticipantLayout,
});

function ParticipantLayout() {
  const { t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("askganis_token");
    const userStr = localStorage.getItem("askganis_user");

    if (!token || !userStr) {
      navigate({ to: "/login" });
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
    } catch {
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("askganis_token");
    localStorage.removeItem("askganis_user");
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivory dark:bg-charcoal">
        <div className="text-sm font-semibold text-forest-900 dark:text-forest-100">Memuat Sesi Peserta...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal dark:bg-charcoal dark:text-forest-100">
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-white/95 backdrop-blur-sm shadow-sm dark:bg-charcoal/95 dark:border-charcoal/60">
        <div className="mx-auto flex h-16 max-w-[1248px] items-center justify-between px-6">
          <Link to="/" className="font-display text-lg font-black text-forest-900 dark:text-forest-100">
            ASKGANISPH <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Peserta</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <div className="text-right text-xs">
              <div className="font-bold text-charcoal dark:text-forest-100">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {user?.participant_number || user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors dark:bg-charcoal/80 dark:text-forest-100 dark:border-charcoal/60 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t("nav_logout")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="mx-auto max-w-[1248px] p-6 lg:p-10">
        <Outlet />
      </main>

    </div>
  );
}
