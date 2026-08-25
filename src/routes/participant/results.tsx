import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getParticipantDashboardFn } from "@/lib/services/examEngineService";
import { FileCheck, ChevronRight, Award } from "lucide-react";
import { getCompetencyStatus } from "@/lib/utils";

export const Route = createFileRoute("/participant/results")({
  component: ParticipantResultsPage,
});

function ParticipantResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const res = await getParticipantDashboardFn({ data: { token } });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-xs text-muted-foreground">Memuat riwayat hasil ujian...</div>;
  }

  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];
  const completedExams = enrolledExams.filter(
    (e: any) => e.attempt_status === "SUBMITTED" || e.attempt_status === "AUTO_SUBMITTED"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Hasil & Riwayat Ujian Saya
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Lihat riwayat skor, hasil penilaian kompetensi, dan detail sertifikasi asesmen Anda.
        </p>
      </div>

      {completedExams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground dark:border-charcoal/60 dark:bg-charcoal/40">
          <Award className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Belum Ada Riwayat Ujian</h3>
          <p className="mt-1 text-xs">Anda belum menyelesaikan sesi ujian kompetensi apapun.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm dark:bg-charcoal dark:border-charcoal/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/50 bg-forest-50/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100/70">
                <tr>
                  <th scope="col" className="px-6 py-3.5">NAMA PAKET UJIAN</th>
                  <th scope="col" className="px-6 py-3.5">KUALIFIKASI</th>
                  <th scope="col" className="px-4 py-3.5 text-center">SKOR</th>
                  <th scope="col" className="px-4 py-3.5 text-center">PASSING GRADE</th>
                  <th scope="col" className="px-4 py-3.5 text-center">STATUS KELULUSAN</th>
                  <th scope="col" className="px-6 py-3.5 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-charcoal/60">
                {completedExams.map((exam: any) => {
                  const score = Number(exam.attempt_score || 0);
                  const passing = Number(exam.passing_grade || 61);
                  const status = getCompetencyStatus(score, passing);

                  return (
                    <tr key={exam.id} className="transition-colors hover:bg-forest-50/30 dark:hover:bg-charcoal/40">
                      <td className="px-6 py-4 font-bold text-charcoal dark:text-forest-100">
                        {exam.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                          {exam.qualification_code}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-black text-sm text-charcoal dark:text-forest-100">
                        {score}
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-muted-foreground">
                        {passing}%
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${status.badgeClass}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/results/${exam.attempt_id}` as any}
                          className="inline-flex items-center gap-1 text-xs font-bold text-forest-900 hover:text-forest-700 dark:text-forest-300 dark:hover:text-forest-100"
                        >
                          <span>Rincian Hasil</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

