import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminStatsFn } from "@/lib/services/adminService";
import { Users, Award, Database, ClipboardList, Play, CheckCircle2 } from "lucide-react";

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

  if (loading) {
    return <div className="text-xs text-muted-foreground">Memuat statistik dashboard...</div>;
  }

  const passRate = stats?.totalAttempts > 0 
    ? Math.round((stats.passedAttempts / stats.totalAttempts) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal">Dashboard Utama Admin</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Ringkasan data real-time penyelenggaraan asesmen kompetensi tenaga teknis kehutanan.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Peserta Terdaftar</span>
            <Users className="h-4 w-4 text-forest-700" />
          </div>
          <div className="mt-3 font-display text-3xl font-extrabold text-charcoal">{stats?.totalUsers || 0}</div>
          <div className="mt-1 text-[10px] text-muted-foreground">Peserta aktif dalam database</div>
        </div>

        <div className="rounded-xl border border-border/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Skema Kualifikasi</span>
            <Award className="h-4 w-4 text-forest-700" />
          </div>
          <div className="mt-3 font-display text-3xl font-extrabold text-charcoal">{stats?.totalQuals || 0}</div>
          <div className="mt-1 text-[10px] text-forest-700 font-semibold">Kualifikasi aktif</div>
        </div>

        <div className="rounded-xl border border-border/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bank Soal Aktif</span>
            <Database className="h-4 w-4 text-forest-700" />
          </div>
          <div className="mt-3 font-display text-3xl font-extrabold text-charcoal">{stats?.totalQuestions || 0}</div>
          <div className="mt-1 text-[10px] text-muted-foreground">Soal multiple choice</div>
        </div>

        <div className="rounded-xl border border-border/50 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Paket Ujian</span>
            <ClipboardList className="h-4 w-4 text-forest-700" />
          </div>
          <div className="mt-3 font-display text-3xl font-extrabold text-charcoal">{stats?.totalExams || 0}</div>
          <div className="mt-1 text-[10px] text-forest-700 font-semibold">{stats?.activeExams || 0} Ujian Dipublikasikan</div>
        </div>
      </div>

      {/* Attempt Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-4 w-4 text-forest-700" />
            <h3 className="font-display text-sm font-bold text-charcoal">Sesi Attempt Dikumpulkan</h3>
          </div>
          <div className="font-display text-4xl font-black text-forest-900">{stats?.totalAttempts || 0}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Jumlah seluruh pengerjaan ujian yang telah dihitung nilainya secara otomatis oleh server scoring engine.
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-forest-700" />
            <h3 className="font-display text-sm font-bold text-charcoal">Tingkat Kelulusan (Pass Rate)</h3>
          </div>
          <div className="font-display text-4xl font-black text-forest-900">{passRate}%</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Persentase peserta yang berhasil melampaui passing grade pada ujian kompetensi teori.
          </p>
        </div>
      </div>
    </div>
  );
}
