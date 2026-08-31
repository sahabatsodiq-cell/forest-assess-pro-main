import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Users, Award, ListChecks, BookOpen, Database, 
  Package, UserCheck, BarChart3, History, LogOut, Menu,
  ChevronLeft, ChevronRight, Search, ShieldCheck, User, Settings, UserCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle, useI18n } from "@/lib/i18n-context";
import { BadgeStatus } from "@/components/ui/badge-status";
import { logoutFn } from "@/lib/services/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
      { label: "Kualifikasi", to: "/admin/qualifications", icon: Award },
      { label: "Unit Kompetensi", to: "/admin/competency-units", icon: ListChecks },
    ],
  },
  {
    title: "MASTER DATA",
    items: [
      { label: "Master GANISPH", to: "/admin/master-ganisph", icon: UserCheck },
      { label: "Materi & Modul", to: "/admin/subjects", icon: BookOpen },
      { label: "Bank Soal", to: "/admin/questions", icon: Database },
    ],
  },
  {
    title: "ASESMEN",
    items: [
      { label: "Paket Ujian", to: "/admin/exams", icon: Package },
      { label: "Pendaftaran", to: "/admin/enrollments", icon: UserCheck },
      { label: "Hasil Ujian", to: "/admin/results", icon: BarChart3 },
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
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
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
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* Desktop Collapsible Executive Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-border/70 bg-white dark:bg-zinc-900/95 backdrop-blur-md md:flex md:flex-col transition-all duration-300 relative z-20 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Official Brand Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden group">
            <img
              src="/assets/logo-askganisph.png"
              alt="Logo AskGanisPH"
              className="h-9 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-display text-sm font-extrabold tracking-tight text-forest-900 dark:text-forest-100">
                  ASKGANISPH
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-earth-500 dark:text-earth-400 -mt-0.5">
                  Asesmen Kehutanan
                </span>
              </div>
            )}
          </Link>

          {/* Sidebar Collapse Toggle Button */}
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
                <div className="px-3 text-[10px] font-extrabold tracking-wider text-muted-foreground/80 uppercase">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/admin" }}
                  activeProps={{
                    className:
                      "bg-forest-100/90 text-forest-900 font-extrabold dark:bg-forest-950/80 dark:text-emerald-300 shadow-2xs relative border-l-3 border-forest-900 dark:border-emerald-500",
                  }}
                  inactiveProps={{
                    className:
                      "text-charcoal/75 hover:bg-forest-50/70 hover:text-forest-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-emerald-200 font-medium",
                  }}
                  className={`flex items-center gap-3 rounded-lg py-2.5 transition-all duration-200 text-xs group relative active:scale-[0.99] active:translate-y-0.5 ${
                    collapsed ? "justify-center px-2" : "px-3.5"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="border-t border-border/60 p-3">
          <div className={`flex items-center gap-3 rounded-xl p-2 bg-slate-50/80 dark:bg-zinc-800/60 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-900 text-white font-bold text-xs dark:bg-forest-700 shadow-2xs">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold truncate text-charcoal dark:text-zinc-200">{user?.name}</span>
                <BadgeStatus status={user?.role || "ADMIN"} size="sm" showDot={false} className="w-max mt-0.5 text-[9px] py-0 px-1.5" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="rounded-lg border border-border/60 p-2 text-charcoal md:hidden hover:bg-forest-50 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Buka navigasi admin"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-white dark:bg-zinc-900 p-4 border-r dark:border-zinc-800">
                <div className="mb-6 flex items-center gap-2.5">
                  <img
                    src="/assets/logo-askganisph.png"
                    alt="Logo AskGanisPH"
                    className="h-9 w-auto object-contain shrink-0"
                  />
                  <div>
                    <div className="font-display text-sm font-extrabold text-forest-900 dark:text-forest-100">
                      ASKGANISPH PRO
                    </div>
                    <div className="text-[9px] font-bold text-earth-500 dark:text-earth-400 uppercase tracking-wider">
                      Asesmen Kehutanan
                    </div>
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
                          activeOptions={{ exact: item.to === "/admin" }}
                          activeProps={{
                            className: "bg-forest-100 text-forest-900 font-bold dark:bg-forest-950 dark:text-emerald-300",
                          }}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-charcoal hover:bg-forest-50 hover:text-forest-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
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

            {/* Quick Search Launcher Trigger */}
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

          {/* Right Topbar Utilities & Executive Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            
            <div className="h-4 w-[1px] bg-border/60 dark:bg-zinc-700 hidden sm:block" />

            {/* Executive Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-white font-bold text-xs dark:bg-forest-700 shadow-2xs">
                    {user?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
                    <span className="font-bold text-charcoal dark:text-zinc-100 truncate max-w-[120px]">{user?.name}</span>
                    <span className="text-[10px] text-forest-700 font-semibold dark:text-forest-300 truncate">
                      {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-900 border-border dark:border-zinc-800 p-1.5">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold text-charcoal dark:text-zinc-100">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email || "admin@askganisph.id"}</p>
                    <BadgeStatus status={user?.role || "ADMIN"} size="sm" showDot={false} className="w-max mt-1 text-[9px]" />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-800" />
                <DropdownMenuItem className="cursor-pointer text-xs py-2 text-charcoal dark:text-zinc-200 focus:bg-forest-50 dark:focus:bg-zinc-800">
                  <User className="h-4 w-4 mr-2 text-forest-700 dark:text-forest-400" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs py-2 text-charcoal dark:text-zinc-200 focus:bg-forest-50 dark:focus:bg-zinc-800">
                  <Settings className="h-4 w-4 mr-2 text-forest-700 dark:text-forest-400" />
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-xs py-2 text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/40 font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Keluar Akun (Logout)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
