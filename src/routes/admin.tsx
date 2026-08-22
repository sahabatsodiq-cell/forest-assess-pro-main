import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Users, Award, ListChecks, BookOpen, Database, 
  Layers, Package, UserCheck, BarChart3, History, LogOut, Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle, useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const adminNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Pengguna", to: "/admin/users", icon: Users },
  { label: "Kualifikasi", to: "/admin/qualifications", icon: Award },
  { label: "Unit Kompetensi", to: "/admin/competency-units", icon: ListChecks },
  { label: "Materi", to: "/admin/subjects", icon: BookOpen },
  { label: "Bank Soal", to: "/admin/questions", icon: Database },
  { label: "Blueprint", to: "/admin/blueprints", icon: Layers },
  { label: "Paket Ujian", to: "/admin/exams", icon: Package },
  { label: "Pendaftaran", to: "/admin/enrollments", icon: UserCheck },
  { label: "Hasil Ujian", to: "/admin/results", icon: BarChart3 },
  { label: "Audit Log", to: "/admin/audit-logs", icon: History },
];

function AdminLayout() {
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
      if (parsedUser.role !== "SUPER_ADMIN" && parsedUser.role !== "ADMIN") {
        navigate({ to: "/login" });
        return;
      }
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
      <div className="flex h-screen items-center justify-center bg-ivory">
        <div className="text-sm font-semibold text-forest-900">Memuat Sesi Admin...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ivory text-charcoal">
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-white md:block">
        <div className="flex h-16 items-center border-b border-border/40 px-6">
          <Link to="/" className="font-display text-lg font-black text-forest-900">
            ASKGANISPH <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Admin</span>
          </Link>
        </div>
        
        <nav className="space-y-1 p-4" aria-label="Sidebar Navigasi Admin">
          {adminNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-forest-900 text-white font-bold" }}
              inactiveProps={{ className: "text-charcoal/70 hover:bg-forest-50 hover:text-forest-900 font-medium" }}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-white px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 text-charcoal md:hidden hover:bg-forest-50" aria-label="Buka navigasi admin">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] bg-white p-4">
                <div className="mb-6 font-display text-lg font-black text-forest-900">
                  ASKGANISPH Admin
                </div>
                <nav className="space-y-1">
                  {adminNav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-forest-50 hover:text-forest-900"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
              Platform Asesmen Kompetensi Kehutanan
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <div className="text-right text-xs">
              <div className="font-bold text-charcoal dark:text-forest-100">{user?.name}</div>
              <div className="text-[10px] text-forest-700 font-semibold dark:text-forest-300">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors dark:bg-charcoal dark:text-forest-100 dark:border-charcoal/60 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav_logout")}</span>
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
