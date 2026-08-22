import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAttemptDetailsFn, saveAnswerFn, submitExamAttemptFn, logExamWarningFn } from "@/lib/services/examEngineService";
import { Clock, ChevronLeft, ChevronRight, Check, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ThemeToggle } from "@/lib/theme-context";
import { LanguageToggle } from "@/lib/i18n-context";

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
      } else {
        // Auto-advance to next question if not at the end
        if (currentIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
          }, 250);
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
      <div className="flex h-screen items-center justify-center bg-[#F7F7F2] dark:bg-charcoal">
        <div className="text-sm font-semibold text-forest-900 dark:text-forest-100">Memuat Sesi Ujian Asesmen...</div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter((q) => q.selected_answer !== null).length;
  const totalQuestions = questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const minutes = Math.floor((remainingSeconds || 0) / 60);
  const seconds = (remainingSeconds || 0) % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Option list depending on question type
  const isTrueFalse = currentQ?.question_type === "TRUE_FALSE";
  const options = isTrueFalse
    ? [
        { key: "A", text: currentQ?.option_a || "BENAR" },
        { key: "B", text: currentQ?.option_b || "SALAH" },
      ]
    : [
        { key: "A", text: currentQ?.option_a },
        { key: "B", text: currentQ?.option_b },
        { key: "C", text: currentQ?.option_c },
        { key: "D", text: currentQ?.option_d },
      ].filter((o) => o.text !== null && o.text !== undefined && o.text !== "");

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F2] text-charcoal dark:bg-charcoal dark:text-forest-100 font-sans pb-16">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-white/95 backdrop-blur-md px-6 py-3 shadow-xs dark:bg-charcoal/95 dark:border-charcoal/60">
        <div className="mx-auto flex max-w-[1024px] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded bg-forest-50 px-2.5 py-1 text-[10px] font-black uppercase text-forest-900 border border-forest-200 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700">
              {attempt.qualification_code}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-charcoal truncate max-w-xs sm:max-w-md dark:text-forest-100">
              {attempt.exam_name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {/* Timer Badge */}
            <div className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-mono font-bold shadow-xs ${
              (remainingSeconds || 0) < 300 
                ? 'border-red-300 bg-red-50 text-red-700 animate-pulse dark:bg-red-950/60 dark:text-red-300' 
                : 'border-forest-200 bg-white text-forest-900 dark:bg-charcoal dark:text-forest-100 dark:border-forest-700'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[1024px] flex-1 px-4 py-6 sm:px-6 space-y-6">
        
        {/* Top Info Banner Card */}
        <div className="rounded-xl border border-border/50 bg-white p-5 shadow-xs space-y-3 dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground dark:text-forest-100/70">
            <div className="flex items-center gap-4 font-medium">
              <span>{totalQuestions} Soal</span>
              <span>•</span>
              <span>{attempt.duration_minutes} Menit</span>
              <span>•</span>
              <span>Passing Grade {attempt.passing_grade}%</span>
            </div>
            <div className="font-bold text-charcoal dark:text-forest-100">
              Progres pengerjaan: <span className="font-mono text-sm">{answeredCount} / {totalQuestions}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-forest-800 transition-all duration-300 dark:bg-forest-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Single Question Card */}
        <div className="rounded-xl border border-border/60 bg-white p-6 sm:p-8 shadow-xs space-y-6 dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex items-center justify-between border-b border-border/30 pb-3 dark:border-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300">
              Soal {currentIndex + 1}
            </span>
            {saving ? (
              <span className="text-[10px] font-semibold text-emerald-600 animate-pulse dark:text-emerald-400">
                Menyimpan...
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                Tersimpan Otomatis
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="text-sm sm:text-base font-bold text-charcoal leading-relaxed dark:text-forest-100">
            {currentQ?.question_text}
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {options.map((opt) => {
              const isSelected = currentQ?.selected_answer === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectAnswer(currentQ.attempt_question_id, opt.key as any)}
                  className={`w-full flex items-center gap-3.5 rounded-lg border p-4 text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "border-forest-800 bg-[#E8F0E6] text-forest-950 font-bold shadow-xs dark:bg-forest-900/60 dark:text-white dark:border-forest-500"
                      : "border-gray-200 bg-white text-charcoal hover:bg-gray-50 dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-black transition-colors ${
                      isSelected
                        ? "bg-forest-900 text-white dark:bg-forest-500 dark:text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="flex-1 leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation & Question Grid Card (Sisi Bawah / Kanan) */}
        <div className="rounded-xl border border-border/60 bg-white p-5 shadow-xs space-y-4 dark:bg-charcoal dark:border-charcoal/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Question Numbers Palette */}
            <div className="flex flex-wrap gap-2 max-w-full sm:max-w-xl">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = q.selected_answer !== null;

                // Color Rules:
                // - Active (Current): Dark green border / ring
                // - Answered: Soft green background (bg-[#E8F0E6] text-forest-900 border-forest-300)
                // - Unanswered (Belum Terjawab): Soft red background (bg-red-50 text-red-700 border-red-200)
                let btnStyle = "";
                if (isCurrent) {
                  btnStyle = "ring-2 ring-forest-900 font-black scale-105 shadow-xs";
                }

                if (isAnswered) {
                  btnStyle += " bg-[#E8F0E6] text-forest-900 border-forest-300 font-bold dark:bg-forest-900/50 dark:text-forest-100 dark:border-forest-700";
                } else {
                  // Unanswered: Soft red badge
                  btnStyle += " bg-red-50 text-red-700 border-red-200 font-semibold dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50";
                }

                return (
                  <button
                    key={q.attempt_question_id}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Soal ${idx + 1}: ${isAnswered ? "Sudah Dijawab" : "Belum Dijawab"}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs transition-all border cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="rounded-lg border border-border bg-white px-4 py-2.5 text-xs font-bold text-charcoal hover:bg-gray-50 disabled:opacity-40 transition-colors dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
              >
                Sebelumnya
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                  <DialogTrigger asChild>
                    <button className="rounded-lg bg-forest-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-forest-700 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500">
                      Selesai & Kumpulkan
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
                    <DialogHeader>
                      <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
                        Kumpulkan Ujian Asesmen?
                      </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 text-xs text-muted-foreground space-y-3 dark:text-forest-100/70">
                      <p>Pastikan seluruh jawaban telah Anda periksa sebelum dikumpulkan.</p>
                      <div className="rounded-lg bg-forest-50 p-3 font-semibold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                        Progres: {answeredCount} dari {totalQuestions} soal telah dijawab.
                      </div>
                      {totalQuestions - answeredCount > 0 && (
                        <div className="rounded-lg bg-red-50 p-3 font-semibold text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50">
                          ⚠️ Ada {totalQuestions - answeredCount} soal yang belum Anda jawab!
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setSubmitOpen(false)}
                        className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500"
                      >
                        Ya, Kumpulkan Sekarang
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="rounded-lg bg-forest-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-forest-700 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
                >
                  Berikutnya
                </button>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Footer Status Badges Strip */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/40 bg-white/95 backdrop-blur-md px-6 py-2.5 shadow-xs dark:bg-charcoal/95 dark:border-charcoal/60">
        <div className="mx-auto flex max-w-[1024px] items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-charcoal border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              Kualifikasi <strong className="font-bold">{attempt.qualification_code}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
              Peserta <strong className="font-bold">Sedang mengerjakan</strong>
            </span>
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
              Autosave <strong className="font-bold">Aktif</strong>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
