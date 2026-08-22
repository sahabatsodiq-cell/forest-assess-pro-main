import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getBlueprintsFn, createBlueprintFn, getQualificationsFn, getSubjectsFn } from "@/lib/services/adminService";
import { Layers, Plus, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/blueprints")({
  component: AdminBlueprintsPage,
});

function AdminBlueprintsPage() {
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Form State
  const [qualificationId, setQualificationId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Array<{ subject_id: number; difficulty: "EASY" | "MEDIUM" | "HARD"; question_count: number }>>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [bData, qData, sData] = await Promise.all([
        getBlueprintsFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
        getSubjectsFn({ data: { token } }),
      ]);
      setBlueprints(bData);
      setQualifications(qData);
      setSubjects(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableSubjects = subjects.filter((s) => !qualificationId || s.qualification_id === Number(qualificationId));

  const handleAddItem = () => {
    if (availableSubjects.length === 0) return;
    setItems([
      ...items,
      { subject_id: availableSubjects[0]!.id, difficulty: "MEDIUM", question_count: 5 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const next = [...items];
    next[index] = { ...next[index]!, [field]: value };
    setItems(next);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualificationId) {
      setFormError("Pilih kualifikasi terlebih dahulu.");
      return;
    }
    if (items.length === 0) {
      setFormError("Tambahkan minimal 1 komposisi materi untuk blueprint.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createBlueprintFn({
        data: {
          token,
          qualification_id: Number(qualificationId),
          name,
          description,
          items,
        },
      });

      if (res.success) {
        setOpen(false);
        setName("");
        setDescription("");
        setItems([]);
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat blueprint.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Exam Blueprint Builder</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Atur matriks komposisi materi dan tingkat kesulitan untuk menjamin validitas paket ujian.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Buat Blueprint
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Buat Blueprint Ujian Baru
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
                    setItems([]);
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
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Blueprint</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Blueprint Ujian Standar CANHUT 50 Soal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                />
              </div>

              {/* Composition Items Builder */}
              <div className="space-y-3 border-t border-border/40 pt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-charcoal">Alokasi Komposisi Soal</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!qualificationId}
                    className="text-xs font-semibold text-forest-700 hover:underline disabled:opacity-50"
                  >
                    + Tambah Baris Materi
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Klik "+ Tambah Baris Materi" untuk menentukan komposisi jumlah soal.
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-border p-3 bg-forest-50/10">
                      <div className="flex-1">
                        <select
                          value={item.subject_id}
                          onChange={(e) => handleUpdateItem(idx, "subject_id", Number(e.target.value))}
                          className="w-full text-xs rounded border border-border bg-white p-1"
                        >
                          {availableSubjects.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-28">
                        <select
                          value={item.difficulty}
                          onChange={(e) => handleUpdateItem(idx, "difficulty", e.target.value)}
                          className="w-full text-xs rounded border border-border bg-white p-1"
                        >
                          <option value="EASY">EASY</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HARD">HARD</option>
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={item.question_count}
                          onChange={(e) => handleUpdateItem(idx, "question_count", Number(e.target.value))}
                          className="w-full text-xs rounded border border-border bg-white p-1"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {formLoading ? "Validasi & Menyimpan..." : "Validasi & Simpan Blueprint"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blueprint list */}
      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Memuat blueprint...</div>
        ) : blueprints.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Belum ada blueprint ujian.</div>
        ) : (
          blueprints.map((b) => (
            <div key={b.id} className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100">
                  {b.qualification_code}
                </span>
                <span className="font-display text-sm font-extrabold text-forest-900">
                  {b.total_questions} Total Soal
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-charcoal">{b.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.description || "Tanpa deskripsi."}</p>
              </div>

              <div className="space-y-1.5 border-t border-border/20 pt-3 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Komposisi Alokasi:</div>
                {b.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-muted-foreground">
                    <span>{item.subject_name} ({item.difficulty})</span>
                    <span className="font-bold text-charcoal">{item.question_count} Soal</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
