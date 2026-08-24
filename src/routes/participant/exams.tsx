import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getParticipantDashboardFn,
  getAvailableExamsFn,
  selfEnrollFn,
  startExamAttemptFn,
} from "@/lib/services/examEngineService";
import {
  GraduationCap,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  ListChecks,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/exams")({
  component: ParticipantExamsPage,
});

function ParticipantExamsPage() {
  const [data, setData] = useState<any>(null);
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled");
  const navigate = useNavigate();

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [dashRes, availRes] = await Promise.all([
        getParticipantDashboardFn({ data: { token } }),
        getAvailableExamsFn({ data: { token } }),
      ]);
      setData(dashRes);
      setAvailableExams(availRes);
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

  const handleSelfEnroll = async (examId: number) => {
    setEnrollingId(examId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await selfEnrollFn({ data: { token, exam_id: examId } });
      if (res.success) {
        toast.success("Berhasil mendaftar! Paket ujian kini tersedia di Ujian Saya.");
        await loadData();
        setActiveTab("enrolled");
      } else {
        toast.error(res.error || "Gagal mendaftar.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-forest-700" />
        <span className="ml-2 text-xs text-muted-foreground">Memuat daftar ujian...</span>
      </div>
    );
  }

  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Ujian Kompetensi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Kelola pendaftaran dan ikuti paket ujian asesmen kompetensi sesuai kualifikasi Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border/50 bg-white p-1 shadow-sm dark:bg-charcoal dark:border-charcoal/60 w-fit">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            activeTab === "enrolled"
              ? "bg-forest-900 text-white shadow-sm dark:bg-forest-700"
              : "text-muted-foreground hover:text-charcoal dark:hover:text-forest-100"
          }`}
        >
          <ListChecks className="h-3.5 w-3.5" />
          Ujian Saya
          {enrolledExams.length > 0 && (
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
              activeTab === "enrolled" ? "bg-white/20 text-white" : "bg-forest-100 text-forest-900"
            }`}>
              {enrolledExams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            activeTab === "available"
              ? "bg-forest-900 text-white shadow-sm dark:bg-forest-700"
              : "text-muted-foreground hover:text-charcoal dark:hover:text-forest-100"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Paket Tersedia
          {availableExams.length > 0 && (
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
              activeTab === "available" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
            }`}>
              {availableExams.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================== */}
      {/* TAB: UJIAN SAYA (Enrolled) */}
      {/* ========================== */}
      {activeTab === "enrolled" && (
        <>
          {enrolledExams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center dark:border-charcoal/60 dark:bg-charcoal/40">
              <GraduationCap className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Belum Ada Ujian Terdaftar</h3>
              <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/60">
                Anda belum terdaftar pada paket ujian apapun.
              </p>
              {availableExams.length > 0 && (
                <button
                  onClick={() => setActiveTab("available")}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700 transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Lihat {availableExams.length} Paket Tersedia
                </button>
              )}
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
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[9px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                            <CheckCircle2 className="h-2.5 w-2.5" />
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
                      <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
                        {exam.instructions || "Ikuti petunjuk pengerjaan dengan teliti."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs dark:bg-charcoal/60 dark:border-charcoal/60">
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70 flex items-center justify-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> DURASI
                        </div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.duration_minutes} Mnt</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">SOAL</div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.total_questions}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">NILAI LULUS</div>
                        <div className="font-bold text-forest-900 dark:text-forest-300">{exam.passing_grade}</div>
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-3 dark:border-charcoal/60">
                      {isSubmitted ? (
                        <Link
                          to={`/results/${exam.attempt_id}` as any}
                          className="w-full block text-center rounded-lg border border-forest-900 bg-white py-2 text-xs font-semibold text-forest-900 hover:bg-forest-50 transition-colors dark:bg-charcoal dark:border-forest-700 dark:text-forest-100 dark:hover:bg-charcoal/60"
                        >
                          Lihat Hasil Ujian (Skor: {exam.attempt_score})
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          disabled={actionLoading === exam.id}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
                        >
                          {actionLoading === exam.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          {actionLoading === exam.id ? "Menyiapkan..." : isInProgress ? "Lanjutkan Ujian" : "Mulai Ujian"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ============================= */}
      {/* TAB: PAKET TERSEDIA (Available) */}
      {/* ============================= */}
      {activeTab === "available" && (
        <>
          {availableExams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center dark:border-charcoal/60 dark:bg-charcoal/40">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Tidak Ada Paket Tersedia</h3>
              <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/60">
                Semua paket ujian yang sesuai kualifikasi Anda sudah terdaftar, atau belum ada paket yang dipublikasikan.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 flex items-start gap-2 dark:bg-amber-950/20 dark:border-amber-800/50">
                <PlusCircle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0 dark:text-amber-400" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Paket di bawah ini sesuai dengan kualifikasi Anda.</strong> Klik tombol "Daftar Sekarang" untuk mendaftarkan diri dan mulai mengerjakan ujian.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {availableExams.map((exam: any) => (
                  <div
                    key={exam.id}
                    className="rounded-xl border border-border/60 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 dark:bg-charcoal dark:border-charcoal/60"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                          {exam.qualification_code}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50">
                          TERSEDIA
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-base font-bold text-charcoal dark:text-forest-100">{exam.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
                        {exam.instructions || "Ikuti petunjuk pengerjaan dengan teliti."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs dark:bg-charcoal/60 dark:border-charcoal/60">
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70 flex items-center justify-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> DURASI
                        </div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.duration_minutes} Mnt</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">SOAL</div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.total_questions}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">NILAI LULUS</div>
                        <div className="font-bold text-forest-900 dark:text-forest-300">{exam.passing_grade}</div>
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-3 dark:border-charcoal/60">
                      <button
                        onClick={() => handleSelfEnroll(exam.id)}
                        disabled={enrollingId === exam.id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-forest-900 bg-transparent py-2.5 text-xs font-bold text-forest-900 hover:bg-forest-900 hover:text-white disabled:opacity-50 transition-all duration-200 dark:border-forest-500 dark:text-forest-300 dark:hover:bg-forest-700 dark:hover:text-white"
                      >
                        {enrollingId === exam.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mendaftarkan...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4" />
                            Daftar Sekarang
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
