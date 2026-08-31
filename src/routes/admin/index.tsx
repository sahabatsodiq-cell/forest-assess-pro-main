import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminStatsFn } from "@/lib/services/adminService";
import { 
  Users, Award, Database, ClipboardList, Play, 
  LayoutDashboard, TrendingUp, ArrowRight, Activity, UserCheck
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardIndex,
});

function AdminDashboardIndex() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem("askganis_token");
      if (!token) return;
      try {
        const res = await getAdminStatsFn({ data: { token } });
        setStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const passRate = stats?.totalAttempts > 0 
    ? Math.round((stats.passedAttempts / stats.totalAttempts) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Dashboard Utama Admin"
        description="Ringkasan data real-time penyelenggaraan asesmen kompetensi tenaga teknis kehutanan (GANISPH)."
        icon={LayoutDashboard}
        breadcrumbs={[{ label: "Overview" }]}
        badgeText="Real-time"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/qualifications">
              <Button variant="default" size="sm" className="btn-executive">
                <span>Kelola Kualifikasi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Peserta</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shadow-2xs">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-3xl font-black text-charcoal dark:text-zinc-100">{stats?.totalUsers || 0}</div>
          )}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Peserta Terdaftar</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Skema Kualifikasi</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-50 text-forest-900 dark:bg-forest-950 dark:text-forest-300 shadow-2xs">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-3xl font-black text-charcoal dark:text-zinc-100">{stats?.totalQuals || 0}</div>
          )}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Skema Standar</span>
            <span className="font-semibold text-forest-900 dark:text-forest-300">19 GANISPH</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bank Soal</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shadow-2xs">
              <Database className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-3xl font-black text-charcoal dark:text-zinc-100">{stats?.totalQuestions || 0}</div>
          )}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Terverifikasi</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">Multiple Choice</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Paket Ujian</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 shadow-2xs">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-3xl font-black text-charcoal dark:text-zinc-100">{stats?.totalExams || 0}</div>
          )}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Diterbitkan</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">{stats?.activeExams || 0} Aktif</span>
          </div>
        </Card>

      </div>

      {/* Attempt Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-100/90 text-forest-900 dark:bg-forest-950 dark:text-forest-300 shadow-2xs">
                <Play className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-charcoal dark:text-zinc-100">
                Sesi Ujian Selesai (Attempts)
              </h3>
            </div>
            <BadgeStatus status="PUBLISHED" label="Selesai" size="sm" />
          </div>

          {loading ? (
            <Skeleton className="h-10 w-32 my-2" />
          ) : (
            <div className="font-display text-4xl font-black text-forest-900 dark:text-forest-100">
              {stats?.totalAttempts || 0}
            </div>
          )}

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Jumlah akumulasi sesi ujian yang berhasil diselesaikan oleh peserta asesmen dan telah dinilai secara otomatis oleh server scoring engine.
          </p>

          <div className="mt-4 pt-4 border-t border-border/50 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Lulus Asesmen:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats?.passedAttempts || 0} Peserta</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="font-display text-sm font-bold text-charcoal dark:text-zinc-100">
                Tingkat Kelulusan (Pass Rate)
              </h3>
            </div>
            <BadgeStatus status="PASSED" label={`${passRate}% Rate`} size="sm" />
          </div>

          {loading ? (
            <Skeleton className="h-10 w-32 my-2" />
          ) : (
            <div className="font-display text-4xl font-black text-emerald-700 dark:text-emerald-400">
              {passRate}%
            </div>
          )}

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Rasio persentase peserta yang berhasil melampaui passing grade kompetensi teori GANISPH dari total attempt yang dikumpulkan.
          </p>

          <div className="mt-4 pt-4 border-t border-border/50 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Batas Kelulusan:</span>
            <span className="font-bold text-charcoal dark:text-zinc-200">Passing Grade 70.0</span>
          </div>
        </Card>

      </div>

      {/* Quick Navigation Cards */}
      <Card className="p-6">
        <h3 className="font-display text-sm font-bold text-charcoal dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-forest-900 dark:text-forest-400" />
          <span>Akses Cepat Pengelolaan Sistem</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/admin/qualifications"
            className="flex items-center gap-3 rounded-lg border border-border/70 p-3 hover:border-forest-700/50 hover:bg-forest-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-100/90 text-forest-900 dark:bg-forest-950 dark:text-forest-300">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal dark:text-zinc-200 group-hover:text-forest-900 dark:group-hover:text-forest-100">Kualifikasi</div>
              <div className="text-[10px] text-muted-foreground">19 Skema Resmi</div>
            </div>
          </Link>

          <Link
            to="/admin/master-ganisph"
            className="flex items-center gap-3 rounded-lg border border-border/70 p-3 hover:border-forest-700/50 hover:bg-forest-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal dark:text-zinc-200 group-hover:text-forest-900 dark:group-hover:text-forest-100">Master GANISPH</div>
              <div className="text-[10px] text-muted-foreground">Registrasi Personel</div>
            </div>
          </Link>

          <Link
            to="/admin/questions"
            className="flex items-center gap-3 rounded-lg border border-border/70 p-3 hover:border-forest-700/50 hover:bg-forest-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal dark:text-zinc-200 group-hover:text-forest-900 dark:group-hover:text-forest-100">Bank Soal</div>
              <div className="text-[10px] text-muted-foreground">Kelola & CSV Import</div>
            </div>
          </Link>

          <Link
            to="/admin/results"
            className="flex items-center gap-3 rounded-lg border border-border/70 p-3 hover:border-forest-700/50 hover:bg-forest-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal dark:text-zinc-200 group-hover:text-forest-900 dark:group-hover:text-forest-100">Hasil & Analitik</div>
              <div className="text-[10px] text-muted-foreground">Skor & Transkrip</div>
            </div>
          </Link>
        </div>
      </Card>

    </div>
  );
}
