import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAttemptDetailsFn, saveAnswerFn, submitExamAttemptFn, logExamWarningFn } from "@/lib/services/examEngineService";
import { Clock, ChevronLeft, ChevronRight, Check, AlertTriangle, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/exam/$attemptId")({
  component: ExaminationEnginePage,
});

function ExaminationEnginePage() {
  const { attemptId } = useParams({ from: "/exam/$attemptId" });
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  // Server-authoritative timer countdown
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const loadAttempt = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;

    try {
      const res = await getAttemptDetailsFn({ data: { token, attempt_id: Number(attemptId) } });
      if (res.success) {
        if (res.attempt.status === "SUBMITTED" || res.attempt.status === "AUTO_SUBMITTED") {
          navigate({ to: `/results/${attemptId}` as any });
          return;
        }

        setAttempt(res.attempt);
        setQuestions(res.questions);

        // Calculate countdown based on server ended_at and serverNow
        const serverNowMs = new Date(res.serverNow).getTime();
        const endedAtMs = new Date(res.attempt.ended_at).getTime();
        const diffSec = Math.max(0, Math.floor((endedAtMs - serverNowMs) / 1000));
        setRemainingSeconds(diffSec);
      } else {
        toast.error(res.error || "Gagal memuat sesi ujian.");
        navigate({ to: "/participant" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  // Anti-Cheating: Tab-Switching & Window Blur Detection
  useEffect(() => {
    if (!attempt || attempt.status !== "IN_PROGRESS") return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        setWarningCount((prev) => prev + 1);
        toast.error("Peringatan Integritas Ujian! Anda meninggalkan tab/layar ujian.", {
          description: "Aktivitas perpindahan layar ini telah dicatat dalam Audit Log pengawas.",
          duration: 6000,
        });

        const token = localStorage.getItem("askganis_token") || "";
        try {
          await logExamWarningFn({
            data: {
              token,
              attempt_id: Number(attemptId),
              warning_type: "TAB_SWITCH",
              details: `Peserta meninggalkan tab ujian. Total Peringatan: ${warningCount + 1}`,
            },
          });
        } catch (err) {
          console.error("Warning log failed:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attempt, attemptId, warningCount]);

  // Timer Countdown Effect
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const handleAutoSubmit = async () => {
    const token = localStorage.getItem("askganis_token") || "";
    try {
      await submitExamAttemptFn({ data: { token, attempt_id: Number(attemptId) } });
      toast.warning("Waktu ujian telah habis. Jawaban Anda telah dikumpulkan secara otomatis.");
      navigate({ to: `/results/${attemptId}` as any });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAnswer = async (attemptQuestionId: number, answerKey: "A" | "B" | "C" | "D") => {
    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q.attempt_question_id === attemptQuestionId ? { ...q, selected_answer: answerKey } : q))
    );

    setSaving(true);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await saveAnswerFn({
        data: {
          token,
          attempt_id: Number(attemptId),
          attempt_question_id: attemptQuestionId,
          selected_answer: answerKey,
        },
      });

      if (!res.success && res.error) {
        toast.error(res.error);
        if (res.error.includes("habis")) {
          navigate({ to: `/results/${attemptId}` as any });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan jawaban.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await submitExamAttemptFn({ data: { token, attempt_id: Number(attemptId) } });
      if (res.success) {
        toast.success("Ujian berhasil dikumpulkan!");
        navigate({ to: `/results/${attemptId}` as any });
      } else {
        toast.error(res.error || "Gagal mengumpulkan ujian.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan server saat submit.");
    }
  };

  if (loading || !attempt) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivory">
        <div className="text-sm font-semibold text-forest-900">Memuat Sesi Ujian...</div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter((q) => q.selected_answer !== null).length;
  const totalQuestions = questions.length;

  const minutes = Math.floor((remainingSeconds || 0) / 60);
  const seconds = (remainingSeconds || 0) % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-charcoal">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-forest-900 px-6 py-3.5 text-white shadow-md">
        <div className="mx-auto flex max-w-[1248px] items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
              {attempt.qualification_code} — Ujian Teori
            </span>
            <h1 className="text-sm font-bold text-white leading-tight truncate max-w-xs sm:max-w-md">
              {attempt.exam_name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-1.5 font-mono text-sm font-bold ${
              (remainingSeconds || 0) < 300 ? 'text-red-300 animate-pulse' : 'text-white'
            }`}>
              <Clock className="h-4 w-4 text-white/80" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-[1248px] flex-1 flex-col md:flex-row gap-6 p-6 lg:p-8">
        
        {/* Left Column: Question Area */}
        <div className="flex-1 flex flex-col justify-between rounded-xl border border-border/60 bg-white p-6 shadow-sm">
          <div>
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div>
                <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
                  Soal {currentIndex + 1} dari {totalQuestions}
                </span>
                <span className="ml-3 rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100">
                  {currentQ?.subject_name}
                </span>
              </div>

              {saving && <span className="text-[10px] font-semibold text-muted-foreground animate-pulse">Menyimpan...</span>}
            </div>

            {/* Question Text */}
            <div className="mt-6">
              <h2 className="font-display text-base font-bold text-charcoal leading-relaxed">
                {currentQ?.question_text}
              </h2>
            </div>

            {/* Answer Options List */}
            <div className="mt-6 space-y-3">
              {[
                { key: "A", text: currentQ?.option_a },
                { key: "B", text: currentQ?.option_b },
                { key: "C", text: currentQ?.option_c },
                { key: "D", text: currentQ?.option_d },
              ].map((opt) => {
                const isSelected = currentQ?.selected_answer === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.attempt_question_id, opt.key as any)}
                    className={`w-full flex items-start gap-3 rounded-lg border p-4 text-left text-xs leading-relaxed transition-all cursor-pointer ${
                      isSelected
                        ? "border-forest-700 bg-forest-50/50 shadow-sm"
                        : "border-border/60 bg-white hover:bg-forest-50/20"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        isSelected
                          ? "border-forest-700 bg-forest-900 text-white"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {isSelected ? <Check className="h-3 w-3" /> : opt.key}
                    </span>
                    <span className="text-charcoal font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-forest-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>

            {currentIndex === totalQuestions - 1 ? (
              <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-forest-900 px-5 py-2 text-xs font-semibold text-white hover:bg-forest-700">
                    Kumpulkan Ujian
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white p-6">
                  <DialogHeader>
                    <DialogTitle className="font-display text-base font-bold text-charcoal">
                      Konfirmasi Kumpulkan Ujian
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-2 text-xs text-muted-foreground space-y-2">
                    <p>Apakah Anda yakin ingin mengumpulkan ujian ini sekarang?</p>
                    <div className="rounded-lg bg-forest-50 p-3 font-semibold text-forest-900">
                      Progress: {answeredCount} dari {totalQuestions} soal telah dijawab.
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setSubmitOpen(false)}
                      className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700"
                    >
                      Ya, Kumpulkan
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="inline-flex items-center gap-1 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Navigator */}
        <div className="w-full md:w-64 shrink-0 rounded-xl border border-border/60 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-charcoal">Navigasi Soal</h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {answeredCount} dari {totalQuestions} terjawab
            </p>
          </div>

          {/* Grid of numbers */}
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Navigasi Daftar Soal Ujian">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = q.selected_answer !== null;
              
              let statusLabel = `Soal ${idx + 1} — Belum Dijawab`;
              if (isAnswered) statusLabel = `Soal ${idx + 1} — Sudah Dijawab`;
              if (isCurrent) statusLabel += " (Sedang Dibuka)";

              return (
                <button
                  key={q.attempt_question_id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={statusLabel}
                  title={statusLabel}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all border ${
                    isCurrent
                      ? "border-forest-900 bg-white text-forest-900 border-2 shadow-sm"
                      : isAnswered
                      ? "bg-forest-900 text-white border-forest-900"
                      : "bg-white text-charcoal border-border/80 hover:bg-forest-50"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="border-t border-border/30 pt-3 space-y-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-forest-900" />
              <span>Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-white border border-border/80" />
              <span>Belum Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-white border-2 border-forest-900" />
              <span>Soal Aktif</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
