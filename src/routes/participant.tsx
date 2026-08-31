import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck,
  User,
  LogOut,
  Menu,
  Award,
} from "lucide-react";
import { logoutFn } from "@/lib/services/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle, useI18n } from "@/lib/i18n-context";
import { CoffeeDonationModal } from "@/components/CoffeeDonationModal";

export const Route = createFileRoute("/participant")({
  component: ParticipantLayout,
});

const navGroups = [
  {
    title: "PESERTA",
    items: [
      { label: "Dashboard", to: "/participant", icon: LayoutDashboard },
    ],
  },
  {
    title: "UJIAN",
    items: [
      { label: "Ujian Saya", to: "/participant/exams", icon: GraduationCap },
      { label: "Riwayat Ujian", to: "/participant/results", icon: FileCheck },
    ],
  },
  {
    title: "AKUN",
    items: [
      { label: "Profil", to: "/participant/profile", icon: User },
    ],
  },
];

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

  const handleLogout = async () => {
    try {
      await logoutFn();
    } catch {
      // Ignore errors
    }
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
    <div className="flex h-screen overflow-hidden bg-ivory text-charcoal dark:bg-charcoal dark:text-forest-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-forest-900/10 bg-[#0D2818] text-white md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <Link to="/participant/exams" className="flex items-center gap-2.5 overflow-hidden group">
            <img
              src="/assets/logo-askganisph.png"
              alt="Logo AskGanisPH"
              className="h-9 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <div className="font-display text-sm font-black tracking-wide text-white">ASKGANISPH</div>
              <div className="text-[10px] uppercase font-bold text-emerald-400">Portal Peserta</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">
                {group.title}
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to as any}
                  activeProps={{ className: "bg-forest-700/80 font-bold text-white shadow-sm" }}
                  inactiveProps={{ className: "text-gray-300 hover:bg-white/5 hover:text-white" }}
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Navigation Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-white/95 backdrop-blur-sm px-6 dark:bg-charcoal/95 dark:border-charcoal/60">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 text-charcoal md:hidden hover:bg-forest-50 dark:text-forest-100" aria-label="Buka navigasi peserta">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] bg-[#0D2818] text-white p-4">
                <div className="mb-6 flex items-center gap-3">
                  <img
                    src="/assets/logo-askganisph.png"
                    alt="Logo AskGanisPH"
                    className="h-8 w-auto object-contain shrink-0"
                  />
                  <div>
                    <div className="font-display text-sm font-black tracking-wide text-white">ASKGANISPH</div>
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Portal Peserta</div>
                  </div>
                </div>
                <nav className="space-y-6">
                  {navGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">
                        {group.title}
                      </div>
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to as any}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline dark:text-forest-100/70">
              Platform Asesmen & Sertifikasi Tenaga Teknis Kehutanan
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CoffeeDonationModal />
            <LanguageToggle />
            <ThemeToggle />
            <div className="text-right text-xs">
              <div className="font-bold text-charcoal dark:text-forest-100">{user?.name}</div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold dark:text-emerald-400">
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
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-[1248px]">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
