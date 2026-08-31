import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Users, Award, ListChecks, BookOpen, Database, 
  Package, UserCheck, BarChart3, History, LogOut, Menu,
  ChevronLeft, ChevronRight, Search, ShieldCheck, TreePine
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle, useI18n } from "@/lib/i18n-context";
import { BadgeStatus } from "@/components/ui/badge-status";
import { logoutFn } from "@/lib/services/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

interface NavGroup {
  title: string;
  items: {
    label: string;
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const adminNavGroups: NavGroup[] = [
  {
    title: "UTAMA",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "DATA MASTER",
    items: [
      { label: "Kualifikasi", to: "/admin/qualifications", icon: Award },
      { label: "Unit Kompetensi", to: "/admin/competency-units", icon: ListChecks },
      { label: "Master GANISPH", to: "/admin/master-ganisph", icon: UserCheck },
      { label: "Materi & Modul", to: "/admin/subjects", icon: BookOpen },
    ],
  },
  {
    title: "ASESMEN & UJIAN",
    items: [
      { label: "Bank Soal", to: "/admin/questions", icon: Database },
      { label: "Paket Ujian", to: "/admin/exams", icon: Package },
      { label: "Pendaftaran", to: "/admin/enrollments", icon: UserCheck },
      { label: "Hasil & Analitik", to: "/admin/results", icon: BarChart3 },
    ],
  },
  {
    title: "SISTEM",
    items: [
      { label: "Manajemen Pengguna", to: "/admin/users", icon: Users },
      { label: "Audit Log", to: "/admin/audit-logs", icon: History },
    ],
  },
];

function AdminLayout() {
  const { t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
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
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-forest-900 border-t-transparent dark:border-forest-500" />
          <div className="text-xs font-bold tracking-wider uppercase text-forest-900 dark:text-forest-300">
            Memuat Sesi Admin Forest Assess Pro...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ivory dark:bg-zinc-950 text-charcoal dark:text-zinc-100 transition-colors duration-200">
      
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-border/60 bg-white dark:bg-zinc-900/90 backdrop-blur-md md:flex md:flex-col transition-all duration-300 relative ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-900 text-white shadow-md dark:bg-forest-700">
              <TreePine className="h-5 w-5 text-forest-100" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-display text-base font-black tracking-tight text-forest-900 dark:text-forest-100">
                  FOREST ASSESS
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-earth-500 dark:text-earth-400 -mt-0.5">
                  Pro Admin Platform
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-slate-50 text-muted-foreground hover:bg-forest-50 hover:text-forest-900 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors"
            title={collapsed ? "Perluas Sidebar" : "Lipat Sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Nav Links Container */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin" aria-label="Sidebar Navigasi Admin">
          {adminNavGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "bg-forest-900 text-white font-semibold shadow-xs dark:bg-forest-700" }}
                  inactiveProps={{
                    className: "text-charcoal/70 hover:bg-forest-50 hover:text-forest-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-forest-200 font-medium",
                  }}
                  className={`flex items-center gap-3 rounded-lg py-2.5 transition-all text-xs group relative ${
                    collapsed ? "justify-center px-2" : "px-3.5"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="border-t border-border/40 p-3">
          <div className={`flex items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-zinc-800/50 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-900 text-white font-bold text-xs dark:bg-forest-700">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold truncate text-charcoal dark:text-zinc-200">{user?.name}</span>
                <BadgeStatus status={user?.role || "ADMIN"} size="sm" showDot={false} className="w-max mt-0.5" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="rounded-lg border border-border/60 p-2 text-charcoal md:hidden hover:bg-forest-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Buka navigasi admin"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-white dark:bg-zinc-900 p-4 border-r dark:border-zinc-800">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-900 text-white">
                    <TreePine className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-display text-base font-black text-forest-900 dark:text-forest-100">
                      FOREST ASSESS PRO
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground">Admin Portal</div>
                  </div>
                </div>

                <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                  {adminNavGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="px-2 text-[10px] font-bold text-muted-foreground uppercase">{group.title}</div>
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-forest-50 hover:text-forest-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
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

            {/* Quick Search Launcher Button */}
            <div className="relative hidden lg:block w-72">
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-slate-50 dark:bg-zinc-800/60 dark:border-zinc-700 px-3 py-1.5 text-xs text-muted-foreground hover:border-forest-700/50 cursor-pointer transition-colors">
                <Search className="h-3.5 w-3.5" />
                <span>Cari menu, kualifikasi, pengguna...</span>
                <kbd className="ml-auto inline-flex items-center rounded border border-border bg-white dark:bg-zinc-700 dark:border-zinc-600 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Topbar Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            
            <div className="h-4 w-[1px] bg-border/60 dark:bg-zinc-700 hidden sm:block" />

            <div className="hidden sm:flex flex-col text-right text-xs">
              <span className="font-bold text-charcoal dark:text-zinc-100 truncate max-w-[140px]">{user?.name}</span>
              <span className="text-[10px] text-forest-700 font-semibold dark:text-forest-300 truncate max-w-[140px]">
                {user?.email || user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 dark:hover:border-rose-800/50 shadow-xs"
              title="Keluar dari akun admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav_logout")}</span>
            </button>
          </div>
        </header>

        {/* Page Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

