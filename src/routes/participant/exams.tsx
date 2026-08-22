import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getParticipantDashboardFn, startExamAttemptFn } from "@/lib/services/examEngineService";
import { GraduationCap, Play, Clock, Award, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/exams")({
  component: ParticipantExamsPage,
});

function ParticipantExamsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const handleStartExam = async (examId: number) => {
    setActionLoading(examId);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await startExamAttemptFn({ data: { token, exam_id: examId } });
      if (res.success && res.attemptId) {
        navigate({ to: `/exam/${res.attemptId}` as any });
      } else {
        toast.error(res.error || "Gagal memulai sesi ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-muted-foreground">Memuat daftar ujian...</div>;
  }

  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Ujian Saya
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Daftar paket ujian asesmen kompetensi Tenaga Teknis Kehutanan yang terdaftar untuk Anda.
        </p>
      </div>

      {enrolledExams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground dark:border-charcoal/60 dark:bg-charcoal/40">
          <GraduationCap className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Belum Ada Ujian Terdaftar</h3>
          <p className="mt-1 text-xs">Anda belum didaftarkan pada paket ujian kompetensi apapun. Silakan hubungi pengelola asesmen/admin.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {enrolledExams.map((exam: any) => {
            const isSubmitted = exam.attempt_status === "SUBMITTED" || exam.attempt_status === "AUTO_SUBMITTED";
            const isInProgress = exam.attempt_status === "IN_PROGRESS";

            return (
              <div
                key={exam.id}
                className="rounded-xl border border-border/60 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 dark:bg-charcoal dark:border-charcoal/60"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                      {exam.qualification_code}
                    </span>
                    {isSubmitted ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[9px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                        SELESAI
                      </span>
                    ) : isInProgress ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[9px] font-bold text-amber-700 animate-pulse dark:bg-amber-950/40 dark:text-amber-300">
                        BERLANGSUNG
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        SIAP DIMULAI
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-charcoal dark:text-forest-100">{exam.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">{exam.instructions || "Ikuti petunjuk pengerjaan dengan teliti."}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs dark:bg-charcoal/60 dark:border-charcoal/60">
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">DURASI</div>
                    <div className="font-bold text-charcoal dark:text-forest-100">{exam.duration_minutes} Menit</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">SOAL</div>
                    <div className="font-bold text-charcoal dark:text-forest-100">{exam.total_questions} Soal</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">PASSING GRADE</div>
                    <div className="font-bold text-forest-900 dark:text-forest-300">{exam.passing_grade}%</div>
                  </div>
                </div>

                <div className="border-t border-border/20 pt-3 flex items-center justify-between dark:border-charcoal/60">
                  {isSubmitted ? (
                    <Link
                      to={`/results/${exam.attempt_id}` as any}
                      className="w-full text-center rounded-lg border border-forest-900 bg-white py-2 text-xs font-semibold text-forest-900 hover:bg-forest-50 transition-colors dark:bg-charcoal dark:border-forest-700 dark:text-forest-100 dark:hover:bg-charcoal/60"
                    >
                      Lihat Hasil Ujian (Skor: {exam.attempt_score})
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      disabled={actionLoading === exam.id}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
                    >
                      <Play className="h-4 w-4" />
                      {actionLoading === exam.id ? "Menyiapkan Ujian..." : isInProgress ? "Lanjutkan Ujian" : "Mulai Ujian"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
