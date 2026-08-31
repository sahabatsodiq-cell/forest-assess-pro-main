import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSubjectsFn, createSubjectFn, updateSubjectFn, getQualificationsFn, getCompetencyUnitsFn } from "@/lib/services/adminService";
import { BookOpen, Plus, Search, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/DataTablePagination";
import { PageHeader } from "@/components/ui/page-header";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/subjects")({
  component: AdminSubjectsPage,
});

function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [competencyUnits, setCompetencyUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create Form State
  const [selectedUnitId, setSelectedUnitId] = useState<number | "">("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Edit Form State
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editLoading, setEditLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const qualIdNum = qualFilter !== "ALL" ? Number(qualFilter) : undefined;
      const [sData, qData, cuData] = await Promise.all([
        getSubjectsFn({
          data: {
            token,
            ...(qualIdNum ? { qualification_id: qualIdNum } : {}),
          },
        }),
        getQualificationsFn({ data: { token } }),
        getCompetencyUnitsFn({ data: { token } }),
      ]);
      setSubjects(Array.isArray(sData) ? sData : []);
      setQualifications(Array.isArray(qData) ? qData : []);
      setCompetencyUnits(Array.isArray(cuData) ? cuData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [qualFilter]);

  const handleUnitSelect = (unitIdVal: number) => {
    setSelectedUnitId(unitIdVal);
    const unit = competencyUnits.find((u) => u.id === unitIdVal);
    if (unit) {
      setCode(unit.subject_code || "");
      setName(unit.title || "");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setFormError("Kode materi dan Materi_Subjek wajib diisi.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createSubjectFn({
        data: {
          token,
          ...(selectedUnitId ? { competency_unit_id: Number(selectedUnitId) } : {}),
          code,
          name,
          description,
        },
      });

      if (res.success) {
        toast.success(`Materi ${code} berhasil ditambahkan!`);
        setCreateOpen(false);
        setSelectedUnitId("");
        setCode("");
        setName("");
        setDescription("");
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat materi.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (s: any) => {
    setEditingSubject(s);
    setEditName(s.name);
    setEditDescription(s.description || "");
    setEditStatus(s.status || "ACTIVE");
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    setEditLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateSubjectFn({
        data: {
          token,
          id: Number(editingSubject.id),
          name: editName,
          description: editDescription,
          status: editStatus,
        },
      });

      if (res.success) {
        toast.success(`Materi ${editingSubject.code} berhasil diperbarui!`);
        setEditOpen(false);
        setEditingSubject(null);
        loadData();
      } else {
        toast.error(res.error || "Gagal memperbarui materi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditLoading(false);
    }
  };

  const filtered = subjects.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase()) ||
      s.competency_unit_code?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Master Materi Ujian</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola bidang studi dan materi kompetensi terhubung dengan Kode Unit Kompetensi & Kode Materi.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-forest-700 focus:ring-2 focus:ring-forest-900/20 active:scale-[0.98] transition-all">
              <Plus className="h-4 w-4" />
              Tambah Materi
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Materi Ujian Baru
              </DialogTitle>
              <DialogDescription className="text-[11px] text-muted-foreground mt-1">
                Lengkapi rincian materi kompetensi kehutanan baru yang akan dikaitkan dengan unit kompetensi.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Pilih Unit Kompetensi (Opsional)</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => handleUnitSelect(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
                >
                  <option value="">Pilih dari Master Unit Kompetensi...</option>
                  {competencyUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.code} — {u.title} ({u.subject_code || "Tanpa Kode Materi"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Kode Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: K3, Org-Job, Ren-Kurpet..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-mono font-medium text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Materi / Subjek</label>
                <input
                  type="text"
                  required
                  placeholder="Nama materi/subjek kompetensi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan ringkas materi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-xs text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-white py-2.5 text-xs font-semibold text-charcoal hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-forest-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-forest-700 focus:ring-2 focus:ring-forest-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {formLoading ? "Menyimpan..." : "Simpan Materi"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal">
              Edit Materi: {editingSubject?.code}
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground mt-1">
              Perbarui nama materi, status aktif, atau deskripsi penjelasan materi kompetensi ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Kode Unit Kompetensi</label>
              <input
                type="text"
                disabled
                value={editingSubject?.competency_unit_code || "-"}
                className="mt-1.5 w-full rounded-lg border border-border bg-gray-100/70 px-3 py-2 text-xs font-mono font-bold text-amber-900 cursor-not-allowed select-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Kode Materi</label>
              <input
                type="text"
                disabled
                value={editingSubject?.code || ""}
                className="mt-1.5 w-full rounded-lg border border-border bg-gray-100/70 px-3 py-2 text-xs font-mono font-bold text-charcoal/70 cursor-not-allowed select-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Materi / Subjek</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/90">Deskripsi</label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-white p-2.5 text-xs text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-lg border border-border bg-white py-2.5 text-xs font-semibold text-charcoal hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 active:scale-[0.98] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 rounded-lg bg-forest-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-forest-700 focus:ring-2 focus:ring-forest-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {editLoading ? "Menyimpan..." : "Perbarui Materi"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode unit, kode materi, atau materi / subjek..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-xs focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200"
          />
        </div>

        <select
          value={qualFilter}
          onChange={(e) => {
            setQualFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none transition-all duration-200 cursor-pointer"
        >
          <option value="ALL">Semua Kualifikasi</option>
          {qualifications.map((q) => (
            <option key={q.id} value={q.id}>
              {q.code} — {q.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects Table */}
      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data materi...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5 w-12 text-center">No</th>
                    <th className="px-4 py-3.5 w-56">Kode Unit Kompetensi</th>
                    <th className="px-6 py-3.5">Materi / Subjek</th>
                    <th className="px-4 py-3.5 w-36">Kode Materi</th>
                    <th className="px-4 py-3.5 w-24 text-center">Status</th>
                    <th className="px-4 py-3.5 w-20 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada materi terdaftar.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-forest-50/10 transition-colors">
                        <td className="px-5 py-3.5 text-center font-mono text-muted-foreground">
                          {(page - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          {s.competency_unit_code ? (
                            <span className="w-fit rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200 cursor-help" title={s.competency_unit_title || ""}>
                              {s.competency_unit_code}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">-</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-charcoal">
                          {s.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold font-mono uppercase text-forest-900 border border-forest-200/60 shadow-2xs">
                            {s.code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${s.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200/50" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => openEditModal(s)}
                            className="inline-flex items-center justify-center p-1.5 rounded text-muted-foreground hover:bg-forest-50 hover:text-forest-900 transition-colors"
                            title="Edit Materi"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
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
              itemLabel="materi"
            />
          </>
        )}
      </div>
    </div>
  );
}
