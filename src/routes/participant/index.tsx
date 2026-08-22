import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getParticipantDashboardFn, startExamAttemptFn } from "@/lib/services/examEngineService";
import { Award, Play, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/")({
  component: ParticipantDashboardIndex,
});

function ParticipantDashboardIndex() {
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
    return <div className="text-xs text-muted-foreground">Memuat dashboard peserta...</div>;
  }

  const user = data?.user;
  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];

  return (
    <div className="space-y-8">
      {/* Header Profile Banner */}
      <div className="rounded-xl border border-forest-100 bg-forest-50/40 p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block rounded bg-forest-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Peserta Asesmen
            </span>
            <h1 className="mt-2 font-display text-2xl font-black text-charcoal">
              Selamat Datang, {user?.name}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Nomor Registrasi: <span className="font-mono font-bold text-charcoal">{user?.participant_number || user?.email}</span>
            </p>
          </div>

          {user?.qualification_code && (
            <div className="rounded-lg border border-forest-100 bg-white p-4 text-right">
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Kualifikasi Utama</div>
              <div className="font-display text-lg font-extrabold text-forest-900">{user.qualification_code}</div>
              <div className="text-[10px] text-muted-foreground max-w-[200px] truncate">{user.qualification_name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Exams List */}
      <div>
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">Ujian Terdaftar</h2>

        {enrolledExams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            Anda belum terdaftar dalam paket ujian kompetensi manapun. Silakan hubungi pengelola asesmen.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {enrolledExams.map((exam: any) => {
              const isSubmitted = exam.attempt_status === "SUBMITTED" || exam.attempt_status === "AUTO_SUBMITTED";
              const isInProgress = exam.attempt_status === "IN_PROGRESS";

              return (
                <div key={exam.id} className="rounded-xl border border-border/60 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100">
                        {exam.qualification_code}
                      </span>
                      {isSubmitted ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[9px] font-bold text-green-700">
                          SELESAI
                        </span>
                      ) : isInProgress ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[9px] font-bold text-amber-700 animate-pulse">
                          BERLANGSUNG
                        </span>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-700">
                          SIAP DIMULAI
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold text-charcoal">{exam.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{exam.instructions}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs">
                    <div>
                      <div className="text-[9px] font-bold text-muted-foreground">DURASI</div>
                      <div className="font-bold text-charcoal">{exam.duration_minutes} Menit</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-muted-foreground">SOAL</div>
                      <div className="font-bold text-charcoal">{exam.total_questions} Soal</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-muted-foreground">PASSING GRADE</div>
                      <div className="font-bold text-forest-900">{exam.passing_grade}%</div>
                    </div>
                  </div>

                  <div className="border-t border-border/20 pt-3 flex items-center justify-between">
                    {isSubmitted ? (
                      <Link
                        to={`/results/${exam.attempt_id}` as any}
                        className="w-full text-center rounded-lg border border-forest-900 bg-white py-2 text-xs font-semibold text-forest-900 hover:bg-forest-50 transition-colors"
                      >
                        Lihat Hasil Ujian (Skor: {exam.attempt_score})
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam.id)}
                        disabled={actionLoading === exam.id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 transition-colors"
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
    </div>
  );
}
