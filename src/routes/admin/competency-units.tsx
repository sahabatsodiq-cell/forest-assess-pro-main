import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getCompetencyUnitsFn,
  createCompetencyUnitFn,
  updateCompetencyUnitFn,
  deleteCompetencyUnitFn,
  getQualificationsFn,
} from "@/lib/services/adminService";
import { Plus, Search, Pencil, Power, Trash2, Filter, AlertTriangle, ListChecks } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/admin/competency-units")({
  component: AdminCompetencyUnitsPage,
});

function AdminCompetencyUnitsPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQualId, setSelectedQualId] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [description, setDescription] = useState("");
  const [selectedQualIds, setSelectedQualIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubjectCode, setEditSubjectCode] = useState("");
  const [editQuestionCount, setEditQuestionCount] = useState<number>(5);
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editQualIds, setEditQualIds] = useState<number[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [uData, qData] = await Promise.all([
        getCompetencyUnitsFn({
          data: {
            token,
            ...(selectedQualId !== "ALL" ? { qualification_id: Number(selectedQualId) } : {}),
          },
        }),
        getQualificationsFn({ data: { token } }),
      ]);

      setUnits(Array.isArray(uData) ? uData : []);
      setQualifications(Array.isArray(qData) ? qData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedQualId]);

  // 1. Create Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createCompetencyUnitFn({
        data: {
          token,
          code,
          title,
          subject_code: subjectCode,
          question_count: questionCount,
          description,
          qualification_ids: selectedQualIds,
        },
      });

      if (res.success) {
        toast.success(`Unit Kompetensi ${code} berhasil ditambahkan!`);
        setCreateOpen(false);
        setCode("");
        setTitle("");
        setSubjectCode("");
        setQuestionCount(5);
        setDescription("");
        setSelectedQualIds([]);
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat unit kompetensi.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  // 2. Edit Modal Open & Handler
  const openEditModal = (u: any) => {
    setEditingUnit(u);
    setEditTitle(u.title);
    setEditSubjectCode(u.subject_code || "");
    setEditQuestionCount(u.question_count || 5);
    setEditDescription(u.description || "");
    setEditStatus(u.status || "ACTIVE");
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    setEditLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateCompetencyUnitFn({
        data: {
          token,
          id: Number(editingUnit.id),
          title: editTitle,
          subject_code: editSubjectCode,
          question_count: editQuestionCount,
          description: editDescription,
          status: editStatus,
          ...(editQualIds.length > 0 ? { qualification_ids: editQualIds } : {}),
        },
      });

      if (res.success) {
        toast.success(`Unit Kompetensi ${editingUnit.code} berhasil diperbarui!`);
        setEditOpen(false);
        setEditingUnit(null);
        loadData();
      } else {
        toast.error(res.error || "Gagal memperbarui unit kompetensi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditLoading(false);
    }
  };

  // 3. Quick Toggle Status Handler
  const handleToggleStatus = async (u: any) => {
    const token = localStorage.getItem("askganis_token") || "";
    const nextStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await updateCompetencyUnitFn({
        data: {
          token,
          id: u.id,
          title: u.title,
          subject_code: u.subject_code,
          question_count: u.question_count,
          description: u.description || "",
          status: nextStatus,
        },
      });

      if (res.success) {
        toast.success(`Status ${u.code} diubah menjadi ${nextStatus === "ACTIVE" ? "Aktif" : "Nonaktif"}.`);
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status.");
    }
  };

  // 4. Delete Handler
  const openDeleteModal = (u: any) => {
    setDeletingUnit(u);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingUnit) return;
    setDeleteLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await deleteCompetencyUnitFn({
        data: { token, id: deletingUnit.id },
      });

      if (res.success) {
        toast.success(`Unit Kompetensi ${deletingUnit.code} berhasil dihapus.`);
        setDeleteOpen(false);
        setDeletingUnit(null);
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus unit kompetensi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleQualSelection = (qualId: number, currentList: number[], setList: (val: number[]) => void) => {
    if (currentList.includes(qualId)) {
      setList(currentList.filter((id) => id !== qualId));
    } else {
      setList([...currentList, qualId]);
    }
  };

  const filtered = units.filter(
    (u) =>
      u.code?.toLowerCase().includes(search.toLowerCase()) ||
      u.title?.toLowerCase().includes(search.toLowerCase()) ||
      u.subject_code?.toLowerCase().includes(search.toLowerCase()) ||
      u.qualification_codes?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-forest-700 dark:text-forest-400" />
            Master Unit Kompetensi GANISPH
          </h1>
          <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
            Kelola standar unit kompetensi sebagai acuan utama penyusunan Bank Soal dan Asesmen Kompetensi Kehutanan.
          </p>
        </div>

        {/* Add New Unit Button & Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500">
              <Plus className="h-4 w-4" />
              Tambah Unit Kompetensi
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white p-6 dark:bg-charcoal dark:border-charcoal/60 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
                Tambah Unit Kompetensi Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode Unit (SKKNI/Standar)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: A.02GNS01.001.1"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Judul Unit Kompetensi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Menerapkan Keselamatan, dan Kesehatan Kerja (K3)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode Materi</label>
                  <input
                    type="text"
                    placeholder="Contoh: K3, Kom-Tif, Ren-Kurpet"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Jumlah Soal</label>
                  <input
                    type="number"
                    min={1}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kualifikasi Terkait</label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-md border border-border p-2.5 dark:border-charcoal/60">
                  {qualifications.map((q) => {
                    const isChecked = selectedQualIds.includes(q.id);
                    return (
                      <label key={q.id} className="flex items-center gap-2 text-xs cursor-pointer text-charcoal dark:text-forest-100">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleQualSelection(q.id, selectedQualIds, setSelectedQualIds)}
                          className="rounded border-gray-300 text-forest-700 focus:ring-forest-500"
                        />
                        <span className="font-bold font-mono">{q.code}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Deskripsi / Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan unit kompetensi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="mt-2 w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500"
              >
                {formLoading ? "Menyimpan..." : "Simpan Unit Kompetensi"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode unit, judul kompetensi, kode materi, atau kualifikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
          />
        </div>

        {/* Qualification Filter */}
        <div className="flex items-center gap-2 min-w-[220px]">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedQualId}
            onChange={(e) => setSelectedQualId(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 px-3 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
          >
            <option value="ALL">Semua Kualifikasi ({qualifications.length})</option>
            {qualifications.map((q) => (
              <option key={q.id} value={q.id}>
                {q.code} - {q.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Competency Units Data Table */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/50 bg-forest-50/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100/70">
              <tr>
                <th scope="col" className="px-5 py-3.5 w-40">KODE UNIT</th>
                <th scope="col" className="px-5 py-3.5">JUDUL UNIT KOMPETENSI</th>
                <th scope="col" className="px-4 py-3.5 w-32 text-center">KODE MATERI</th>
                <th scope="col" className="px-5 py-3.5">KUALIFIKASI TERHUBUNG</th>
                <th scope="col" className="px-5 py-3.5 text-center w-32">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-charcoal/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                    Memuat unit kompetensi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                    Tidak ada unit kompetensi ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-forest-50/30 dark:hover:bg-charcoal/40">
                    {/* KODE UNIT */}
                    <td className="px-5 py-4 font-mono font-black text-charcoal text-xs dark:text-forest-100">
                      {u.code}
                    </td>

                    {/* JUDUL UNIT KOMPETENSI */}
                    <td className="px-5 py-4 font-bold text-charcoal dark:text-forest-100 max-w-sm">
                      {u.title}
                    </td>

                    {/* KODE MATERI */}
                    <td className="px-4 py-4 text-center">
                      {u.subject_code ? (
                        <span className="inline-block rounded-md bg-amber-50 px-2 py-1 text-[11px] font-mono font-black text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                          {u.subject_code}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">-</span>
                      )}
                    </td>

                    {/* KUALIFIKASI TERHUBUNG */}
                    <td className="px-5 py-4">
                      {u.qualification_codes ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.qualification_codes.split(", ").map((qc: string) => (
                            <span
                              key={qc}
                              className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50"
                            >
                              {qc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Belum terhubung</span>
                      )}
                    </td>

                    {/* AKSI */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          title="Edit Unit Kompetensi"
                          className="rounded-md p-1.5 text-charcoal hover:bg-forest-50 hover:text-forest-900 transition-colors dark:text-forest-100 dark:hover:bg-charcoal/60"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Power / Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === "ACTIVE" ? "Nonaktifkan Unit Kompetensi" : "Aktifkan Unit Kompetensi"}
                          className={`rounded-md p-1.5 transition-colors ${
                            u.status === "ACTIVE"
                              ? "text-charcoal hover:bg-amber-50 hover:text-amber-700 dark:text-forest-100"
                              : "text-gray-400 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(u)}
                          title="Hapus Unit Kompetensi"
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <DataTablePagination
          currentPage={page}
          pageSize={pageSize}
          totalItems={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="unit kompetensi"
        />
      </div>

      {/* EDIT MODAL DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg bg-white p-6 dark:bg-charcoal dark:border-charcoal/60 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
              Edit Unit Kompetensi {editingUnit?.code}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode Unit (Tetap)</label>
              <input
                type="text"
                disabled
                value={editingUnit?.code || ""}
                className="mt-1 w-full rounded-md border border-border bg-gray-50 px-3 py-1.5 text-xs font-mono font-bold text-muted-foreground dark:bg-charcoal/60 dark:border-charcoal/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Judul Unit Kompetensi</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode Materi</label>
                <input
                  type="text"
                  placeholder="Contoh: K3, Kom-Tif, Ren-Kurpet"
                  value={editSubjectCode}
                  onChange={(e) => setEditSubjectCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Jumlah Soal</label>
                <input
                  type="number"
                  min={1}
                  value={editQuestionCount}
                  onChange={(e) => setEditQuestionCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kualifikasi Terkait</label>
              <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-md border border-border p-2.5 dark:border-charcoal/60">
                {qualifications.map((q) => {
                  const isChecked = editQualIds.includes(q.id);
                  return (
                    <label key={q.id} className="flex items-center gap-2 text-xs cursor-pointer text-charcoal dark:text-forest-100">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleQualSelection(q.id, editQualIds, setEditQualIds)}
                        className="rounded border-gray-300 text-forest-700 focus:ring-forest-500"
                      />
                      <span className="font-bold font-mono">{q.code}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Deskripsi</label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-white px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
              >
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Nonaktif</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500"
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Unit Kompetensi</span>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-forest-100">
            Apakah Anda yakin ingin menghapus unit kompetensi <strong className="font-mono">{deletingUnit?.code} - {deletingUnit?.title}</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoading ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
