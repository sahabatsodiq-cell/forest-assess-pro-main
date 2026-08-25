import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getParticipantResultDetailFn } from "@/lib/services/examEngineService";
import { ArrowLeft } from "lucide-react";
import { getCompetencyStatus } from "@/lib/utils";

export const Route = createFileRoute("/results/$attemptId")({
  component: ParticipantResultDetailPage,
});

function ParticipantResultDetailPage() {
  const { attemptId } = useParams({ from: "/results/$attemptId" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      const token = localStorage.getItem("askganis_token");
      if (!token) return;
      try {
        const res = await getParticipantResultDetailFn({ data: { token, attempt_id: Number(attemptId) } });
        if (res.success) {
          setResult(res.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivory">
        <div className="text-sm font-semibold text-forest-900">Memuat Hasil Ujian...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="text-lg font-bold text-charcoal">Hasil Tidak Ditemukan</h2>
        <p className="mt-2 text-xs text-muted-foreground">Data hasil ujian tidak tersedia atau Anda tidak memiliki akses.</p>
        <Link to="/participant" className="mt-6 inline-block rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const status = getCompetencyStatus(result.score, result.passing_grade || 61);

  return (
    <div className="mx-auto max-w-2xl py-8 px-4 space-y-8">
      <Link to="/participant" className="inline-flex items-center gap-2 text-xs font-semibold text-forest-700 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard Peserta
      </Link>

      {/* Main Score Result Card */}
      <div className="rounded-xl border border-border/60 bg-white p-8 shadow-lg text-center space-y-6">
        <div>
          <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100">
            {result.qualification_code} — {result.exam_code}
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-charcoal">{result.exam_name}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Peserta: <span className="font-bold text-charcoal">{result.user_name}</span> ({result.participant_number || "Peserta"})
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-extrabold ${status.badgeClass}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${status.dotClass}`} />
            <span>STATUS: {status.label}</span>
          </div>
        </div>


        {/* Big Score Display */}
        <div className="py-4 border-y border-border/30">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skor Akhir Anda</div>
          <div className="mt-1 font-display text-5xl font-black text-forest-900">{result.score}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Passing Grade: <span className="font-bold text-charcoal">{result.passing_grade}%</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-green-50/50 p-3 border border-green-100">
            <div className="text-[10px] font-bold text-green-700 uppercase">Jawaban Benar</div>
            <div className="mt-1 font-display text-lg font-bold text-green-700">{result.correct_count}</div>
          </div>
          <div className="rounded-lg bg-red-50/50 p-3 border border-red-100">
            <div className="text-[10px] font-bold text-red-700 uppercase">Jawaban Salah</div>
            <div className="mt-1 font-display text-lg font-bold text-red-700">{result.incorrect_count}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
            <div className="text-[10px] font-bold text-gray-700 uppercase">Tidak Dijawab</div>
            <div className="mt-1 font-display text-lg font-bold text-gray-700">{result.unanswered_count}</div>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground pt-2">
          Tanggal Penyelesaian: {new Date(result.submitted_at || result.updated_at).toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
