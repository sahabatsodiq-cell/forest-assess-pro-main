import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getExamsFn,
  createExamFn,
  updateExamFn,
  deleteExamFn,
  publishExamFn,
  getQualificationsFn,
  getCompetencyUnitsFn,
} from "@/lib/services/adminService";
import { Package, Plus, Edit2, Trash2, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/admin/exams")({
  component: AdminExamsPage,
});

function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [qualificationId, setQualificationId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [instructions, setInstructions] = useState("Bacalah setiap soal dengan teliti dan pilih satu jawaban yang paling tepat.");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingGrade, setPassingGrade] = useState(70);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [competencyUnits, setCompetencyUnits] = useState<any[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editQualId, setEditQualId] = useState<number | "">("");
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editDurationMinutes, setEditDurationMinutes] = useState(60);
  const [editPassingGrade, setEditPassingGrade] = useState(70);
  const [editStatus, setEditStatus] = useState("PUBLISHED");
  const [editLoading, setEditLoading] = useState(false);
  const [editCompetencyUnits, setEditCompetencyUnits] = useState<any[]>([]);
  const [editSelectedUnits, setEditSelectedUnits] = useState<string[]>([]);

  // Effect to load competency units for creation target qualification
  useEffect(() => {
    if (!qualificationId) {
      setCompetencyUnits([]);
      setSelectedUnits([]);
      return;
    }
    const token = localStorage.getItem("askganis_token") || "";
    getCompetencyUnitsFn({ data: { token, qualification_id: Number(qualificationId) } })
      .then((res) => {
        setCompetencyUnits(Array.isArray(res) ? res : []);
      })
      .catch((err) => console.error(err));
  }, [qualificationId]);

  // Effect to load competency units for editing target qualification
  useEffect(() => {
    if (!editQualId) {
      setEditCompetencyUnits([]);
      return;
    }
    const token = localStorage.getItem("askganis_token") || "";
    getCompetencyUnitsFn({ data: { token, qualification_id: Number(editQualId) } })
      .then((res) => {
        setEditCompetencyUnits(Array.isArray(res) ? res : []);
      })
      .catch((err) => console.error(err));
  }, [editQualId]);

  // Effect to calculate duration for creation modal
  useEffect(() => {
    const calculatedDuration = Math.round((selectedUnits.length * 5 * 100) / 60);
    setDurationMinutes(calculatedDuration || 0);
  }, [selectedUnits]);

  // Effect to calculate duration for editing modal
  useEffect(() => {
    const calculatedDuration = Math.round((editSelectedUnits.length * 5 * 100) / 60);
    setEditDurationMinutes(calculatedDuration || 0);
  }, [editSelectedUnits]);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [eData, qData] = await Promise.all([
        getExamsFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
      ]);
      setExams(eData);
      setQualifications(qData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create Exam
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualificationId) {
      setFormError("Pilih kualifikasi target terlebih dahulu.");
      return;
    }
    if (selectedUnits.length === 0) {
      setFormError("Pilih minimal satu Unit Kompetensi.");
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
          name,
          code: selectedUnits.join("; "),
          instructions,
          duration_minutes: Number(durationMinutes),
          passing_grade: Number(passingGrade),
        },
      });

      if (res.success) {
        toast.success("Paket ujian berhasil dibuat!");
        setCreateOpen(false);
        setName("");
        setCode("");
        setSelectedUnits([]);
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

  // Open Edit Modal
  const openEditModal = (item: any) => {
    setEditItem(item);
    setEditQualId(item.qualification_id);
    setEditName(item.name || "");
    setEditCode(item.code || "");
    const parsedCodes = item.code ? item.code.split("; ") : [];
    setEditSelectedUnits(parsedCodes);
    setEditInstructions(item.instructions || "");
    setEditDurationMinutes(item.duration_minutes || 60);
    setEditPassingGrade(item.passing_grade || 70);
    setEditStatus(item.status || "PUBLISHED");
    setEditOpen(true);
  };

  // Handle Edit Exam
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editQualId) return;

    if (editSelectedUnits.length === 0) {
      toast.error("Pilih minimal satu Unit Kompetensi.");
      return;
    }

    setEditLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateExamFn({
        data: {
          token,
          id: editItem.id,
          qualification_id: Number(editQualId),
          name: editName,
          code: editSelectedUnits.join("; "),
          instructions: editInstructions,
          duration_minutes: Number(editDurationMinutes),
          passing_grade: Number(editPassingGrade),
          status: editStatus,
        },
      });

      if (res.success) {
        toast.success("Paket ujian berhasil diperbarui!");
        setEditOpen(false);
        setEditItem(null);
        loadData();
      } else {
        toast.error(res.error || "Gagal memperbarui paket ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete Exam
  const handleDelete = async (examId: number, examName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus Paket Ujian ${examName}?`)) return;

    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await deleteExamFn({ data: { token, id: examId } });
      if (res.success) {
        toast.success(`Paket Ujian ${examName} berhasil dihapus.`);
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus paket ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  // Handle Publish Exam
  const handlePublish = async (examId: number) => {
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await publishExamFn({ data: { token, exam_id: examId } });
      if (res.success) {
        toast.success("Paket ujian berhasil dipublikasikan & aktif!");
        loadData();
      } else {
        toast.error(res.error || "Gagal mempublikasikan paket ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal flex items-center gap-2">
            <Package className="h-6 w-6 text-forest-700" />
            Manajemen Paket Ujian Asesmen
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola paket ujian teori, status publikasi, durasi, dan passing grade.
          </p>
        </div>

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Buat Paket Ujian
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Buat Paket Ujian Baru
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              {formError && (
                <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Target</label>
                <select
                  required
                  value={qualificationId}
                  onChange={(e) => setQualificationId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold"
                >
                  <option value="">-- Pilih Kualifikasi --</option>
                  {qualifications.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.code} — {q.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kode Unit Kompetensi</label>
                <div className="mt-1 max-h-36 overflow-y-auto rounded-md border border-border p-2 space-y-1.5 bg-gray-50/50">
                  {competencyUnits.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground italic">Pilih kualifikasi target terlebih dahulu</span>
                  ) : (
                    competencyUnits.map((u) => (
                      <label key={u.id} className="flex items-center gap-2 text-xs text-charcoal font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUnits.includes(u.code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUnits([...selectedUnits, u.code]);
                            } else {
                              setSelectedUnits(selectedUnits.filter((code) => code !== u.code));
                            }
                          }}
                          className="rounded border-border text-forest-900 focus:ring-forest-900"
                        />
                        <span className="font-semibold font-mono text-[11px]">{u.code}</span>
                        <span className="text-muted-foreground truncate">— {u.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Ujian</label>
                <input
                  type="text"
                  required
                  placeholder="Pengujian Kayu Bulat Rimba"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Durasi (Menit)</label>
                  <input
                    type="number"
                    readOnly
                    required
                    value={durationMinutes}
                    className="mt-1 w-full rounded-md border border-border bg-gray-50 px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none cursor-not-allowed"
                    title="Dihitung otomatis: jumlah unit kompetensi x 5 x 100 detik"
                  />
                  <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                    (Otomatis: {selectedUnits.length} unit × 5 × 100s)
                  </span>
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

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Instruksi Ujian</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan Paket Ujian"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal">
              Edit Paket Ujian Asesmen
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Target</label>
              <select
                required
                value={editQualId}
                onChange={(e) => setEditQualId(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold"
              >
                <option value="">-- Pilih Kualifikasi --</option>
                {qualifications.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.code} — {q.name}
                  </option>
                ))}
              </select>
            </div>

             <div>
               <label className="block text-xs font-bold uppercase text-charcoal">Kode Unit Kompetensi</label>
               <div className="mt-1 max-h-36 overflow-y-auto rounded-md border border-border p-2 space-y-1.5 bg-gray-50/50">
                 {editCompetencyUnits.length === 0 ? (
                   <span className="text-[11px] text-muted-foreground italic">Pilih kualifikasi target terlebih dahulu</span>
                 ) : (
                   editCompetencyUnits.map((u) => (
                     <label key={u.id} className="flex items-center gap-2 text-xs text-charcoal font-medium cursor-pointer">
                       <input
                         type="checkbox"
                         checked={editSelectedUnits.includes(u.code)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setEditSelectedUnits([...editSelectedUnits, u.code]);
                           } else {
                             setEditSelectedUnits(editSelectedUnits.filter((code) => code !== u.code));
                           }
                         }}
                         className="rounded border-border text-forest-900 focus:ring-forest-900"
                       />
                       <span className="font-semibold font-mono text-[11px]">{u.code}</span>
                       <span className="text-muted-foreground truncate">— {u.title}</span>
                     </label>
                   ))
                 )}
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold uppercase text-charcoal">Nama Ujian</label>
               <input
                 type="text"
                 required
                 value={editName}
                 onChange={(e) => setEditName(e.target.value)}
                 className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
               />
             </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="block text-xs font-bold uppercase text-charcoal">Durasi (Menit)</label>
                 <input
                   type="number"
                   readOnly
                   required
                   value={editDurationMinutes}
                   className="mt-1 w-full rounded-md border border-border bg-gray-50 px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none cursor-not-allowed"
                   title="Dihitung otomatis: jumlah unit kompetensi x 5 x 100 detik"
                 />
                 <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                   (Otomatis: {editSelectedUnits.length} unit × 5 × 100s)
                 </span>
               </div>
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Passing Grade (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={editPassingGrade}
                  onChange={(e) => setEditPassingGrade(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold text-forest-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Status Publikasi</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold"
              >
                <option value="PUBLISHED">PUBLISHED (Tampil Di Akun Peserta)</option>
                <option value="DRAFT">DRAFT (Sembunyikan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Instruksi Ujian</label>
              <textarea
                rows={2}
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                className="mt-1 w-full rounded-md border border-border p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exam Packages Grid */}
      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Memuat paket ujian...</div>
          ) : exams.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Belum ada paket ujian.</div>
          ) : (
            exams.slice((page - 1) * pageSize, page * pageSize).map((e) => (
              <div key={e.id} className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow dark:bg-charcoal dark:border-charcoal/60">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                    {e.qualification_code} — {e.code}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    e.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800' :
                    e.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' :
                    'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {e.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-charcoal dark:text-forest-100">{e.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70 line-clamp-2">{e.instructions}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 dark:border-charcoal/60">
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/60">DURASI</div>
                    <div className="text-xs font-bold text-charcoal dark:text-forest-100">{e.duration_minutes} Menit</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/60">SOAL</div>
                    <div className="text-xs font-bold text-charcoal dark:text-forest-100">{e.total_questions} Soal</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/60">PASSING GRADE</div>
                    <div className="text-xs font-bold text-forest-900 dark:text-forest-300">{e.passing_grade}%</div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center justify-between border-t border-border/20 pt-3 dark:border-charcoal/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(e)}
                      className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      title="Edit Paket Ujian"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id, e.name)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                      title="Hapus Paket Ujian"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>

                  {e.status === "DRAFT" && (
                    <button
                      onClick={() => handlePublish(e.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-3 py-1 text-xs font-semibold text-white hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500"
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

        {exams.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden dark:bg-charcoal dark:border-charcoal/60">
            <DataTablePagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={exams.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="paket ujian"
            />
          </div>
        )}
      </div>
    </div>
  );
}
