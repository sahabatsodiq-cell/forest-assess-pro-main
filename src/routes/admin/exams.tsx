import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getExamsFn, createExamFn, publishExamFn, getQualificationsFn, getBlueprintsFn } from "@/lib/services/adminService";
import { Package, Plus, PlayCheck, Clock, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/exams")({
  component: AdminExamsPage,
});

function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Form State
  const [qualificationId, setQualificationId] = useState<number | "">("");
  const [blueprintId, setBlueprintId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [instructions, setInstructions] = useState("Bacalah setiap soal dengan teliti dan pilih satu jawaban yang paling tepat.");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingGrade, setPassingGrade] = useState(70);
  const [startAt, setStartAt] = useState(new Date().toISOString().slice(0, 16));
  const [endAt, setEndAt] = useState(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 16)); // +30 days
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [eData, qData, bData] = await Promise.all([
        getExamsFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
        getBlueprintsFn({ data: { token } }),
      ]);
      setExams(eData);
      setQualifications(qData);
      setBlueprints(bData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableBlueprints = blueprints.filter((b) => !qualificationId || b.qualification_id === Number(qualificationId));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualificationId || !blueprintId) {
      setFormError("Pilih kualifikasi dan blueprint terlebih dahulu.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createExamFn({
        data: {
          token,
          qualification_id: Number(qualificationId),
          blueprint_id: Number(blueprintId),
          name,
          code,
          instructions,
          duration_minutes: Number(durationMinutes),
          passing_grade: Number(passingGrade),
          start_at: new Date(startAt).toISOString(),
          end_at: new Date(endAt).toISOString(),
        },
      });

      if (res.success) {
        toast.success("Paket ujian berhasil dibuat!");
        setOpen(false);
        setName("");
        setCode("");
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat paket ujian.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePublish = async (examId: number) => {
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await publishExamFn({ data: { token, exam_id: examId } });
      if (res.success) {
        toast.success("Paket ujian berhasil dipublikasikan!");
        loadData();
      } else {
        toast.error(res.error || "Gagal mempublikasikan ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Manajemen Paket Ujian</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola paket ujian teori, jadwal pelaksanaan, durasi, dan passing grade.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Buat Paket Ujian
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Buat Paket Ujian Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-2 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Target</label>
                <select
                  required
                  value={qualificationId}
                  onChange={(e) => {
                    setQualificationId(Number(e.target.value));
                    setBlueprintId("");
                  }}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                >
                  <option value="">Pilih Kualifikasi...</option>
                  {qualifications.map((q) => (
                    <option key={q.id} value={q.id}>{q.code} — {q.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Blueprint Ujian</label>
                <select
                  required
                  value={blueprintId}
                  onChange={(e) => setBlueprintId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                >
                  <option value="">Pilih Blueprint...</option>
                  {availableBlueprints.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.total_questions} Soal)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Kode Ujian</label>
                  <input
                    type="text"
                    required
                    placeholder="EXAM-CAN-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Nama Ujian</label>
                  <input
                    type="text"
                    required
                    placeholder="Ujian Teori Utama..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Durasi (Menit)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={300}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Passing Grade (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={passingGrade}
                    onChange={(e) => setPassingGrade(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold text-forest-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Waktu Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Waktu Selesai</label>
                  <input
                    type="datetime-local"
                    required
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Instruksi Ujian</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {formLoading ? "Menyimpan..." : "Simpan Draf Ujian"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Memuat paket ujian...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Belum ada paket ujian.</div>
        ) : (
          exams.map((e) => (
            <div key={e.id} className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100">
                  {e.qualification_code} — {e.code}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                  e.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border border-green-100' :
                  e.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-gray-50 text-gray-700'
                }`}>
                  {e.status}
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-charcoal">{e.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{e.instructions}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30">
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground">DURASI</div>
                  <div className="text-xs font-bold text-charcoal">{e.duration_minutes} Menit</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground">SOAL</div>
                  <div className="text-xs font-bold text-charcoal">{e.total_questions} Soal</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground">PASSING GRADE</div>
                  <div className="text-xs font-bold text-forest-900">{e.passing_grade}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/20 pt-3">
                <div className="text-[10px] text-muted-foreground">
                  <div>Mulai: {new Date(e.start_at).toLocaleDateString("id-ID")}</div>
                  <div>Selesai: {new Date(e.end_at).toLocaleDateString("id-ID")}</div>
                </div>

                {e.status === "DRAFT" && (
                  <button
                    onClick={() => handlePublish(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-700"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Publikasikan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
