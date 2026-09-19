import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getParticipantDashboardFn, startExamAttemptFn } from "@/lib/services/examEngineService";
import { GraduationCap, Activity, CheckCircle2, ArrowRight, Play, Award, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/participant/")({
  component: ParticipantDashboardIndex,
});

function ParticipantDashboardIndex() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [approvalWarningOpen, setApprovalWarningOpen] = useState(false);
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

  const handleStartExam = async (examId: number, enrollmentStatus?: string) => {
    if (enrollmentStatus !== "APPROVED") {
      setApprovalWarningOpen(true);
      toast.error("Akses ujian ini belum dibuka, silahkan hubungi Admin untuk mendapatkan persetujuan mengikuti Paket Ujian");
      return;
    }

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
    return <div className="p-8 text-xs text-muted-foreground">Memuat dashboard peserta...</div>;
  }

  const user = data?.user;
  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];

  const availableCount = enrolledExams.filter((e: any) => (!e.attempt_status || e.attempt_status === "NOT_STARTED") && e.enrollment_status === "APPROVED").length;
  const inProgressCount = enrolledExams.filter((e: any) => e.attempt_status === "IN_PROGRESS").length;
  const completedCount = enrolledExams.filter((e: any) => e.attempt_status === "SUBMITTED" || e.attempt_status === "AUTO_SUBMITTED").length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6 dark:border-charcoal/60">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
            Hai, {user?.name || "Peserta"} 👋
          </h1>
          <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
            Siap lanjut ujian kompetensi kamu hari ini?
          </p>
        </div>

        <Link
          to="/participant/exams"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-xs font-bold text-white shadow transition-transform hover:scale-105 hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500"
        >
          <span>Lihat Ujian Saya</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Available Exams */}
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-900 dark:bg-forest-900/40 dark:text-forest-100">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="mt-4 font-mono text-3xl font-black text-charcoal dark:text-forest-100">
            {availableCount}
          </div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-forest-100/70">
            UJIAN TERSEDIA
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Activity className="h-5 w-5" />
          </div>
          <div className="mt-4 font-mono text-3xl font-black text-charcoal dark:text-forest-100">
            {inProgressCount}
          </div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-forest-100/70">
            SEDANG BERLANGSUNG
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="mt-4 font-mono text-3xl font-black text-charcoal dark:text-forest-100">
            {completedCount}
          </div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-forest-100/70">
            SELESAI
          </div>
        </div>
      </div>

      {/* Available Exams Section */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-4 dark:bg-charcoal dark:border-charcoal/60">
        <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100">
          Ujian yang bisa kamu kerjakan
        </h2>

        {enrolledExams.length === 0 ? (
          <p className="text-xs text-muted-foreground dark:text-forest-100/70 py-4">
            Belum ada ujian yang tersedia untuk kamu.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolledExams.map((exam: any) => {
              const isSubmitted = exam.attempt_status === "SUBMITTED" || exam.attempt_status === "AUTO_SUBMITTED";
              const isInProgress = exam.attempt_status === "IN_PROGRESS";
              const isApproved = exam.enrollment_status === "APPROVED";

              return (
                <div key={exam.id} className="rounded-xl border border-border/50 bg-forest-50/20 p-5 space-y-3 dark:bg-charcoal/60 dark:border-charcoal/60">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                      {exam.qualification_code}
                    </span>
                    {isSubmitted ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                        SELESAI
                      </span>
                    ) : isInProgress ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 animate-pulse dark:bg-amber-950/40 dark:text-amber-300">
                        BERLANGSUNG
                      </span>
                    ) : !isApproved ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                        MENUNGGU VERIFIKASI ADMIN
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        SIAP
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-sm font-bold text-charcoal dark:text-forest-100">{exam.name}</h3>

                  <div className="pt-2">
                    {isSubmitted ? (
                      <Link
                        to={`/results/${exam.attempt_id}` as any}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:underline dark:text-forest-300"
                      >
                        <span>Lihat Hasil (Skor: {exam.attempt_score})</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam.id, exam.enrollment_status)}
                        disabled={actionLoading === exam.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
                        {actionLoading === exam.id ? "Menyiapkan..." : isInProgress ? "Lanjutkan Ujian" : "Mulai Ujian"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Dialog open={approvalWarningOpen} onOpenChange={setApprovalWarningOpen}>
        <DialogContent className="max-w-md border-amber-200 bg-white p-6 shadow-2xl dark:border-amber-800/50 dark:bg-charcoal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base font-black text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
              Akses Ujian Belum Dibuka
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200">
            Akses ujian ini belum dibuka, silahkan hubungi Admin untuk mendapatkan persetujuan mengikuti Paket Ujian.
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground dark:text-forest-100/70">
            Setelah Admin menyetujui pendaftaran Anda, tombol <strong>Mulai Ujian</strong> akan dapat digunakan untuk masuk ke halaman ujian.
          </p>
          <button
            type="button"
            onClick={() => setApprovalWarningOpen(false)}
            className="mt-2 w-full rounded-lg bg-forest-900 py-2.5 text-xs font-bold text-white transition-colors hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500"
          >
            Saya Mengerti
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
