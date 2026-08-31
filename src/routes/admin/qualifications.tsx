import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getQualificationsFn,
  createQualificationFn,
  updateQualificationFn,
  deleteQualificationFn,
  bulkDeleteQualificationsFn,
} from "@/lib/services/adminService";
import { 
  Plus, Search, Pencil, Power, Trash2, ShieldCheck, AlertTriangle, Loader2,
  Award, CheckCircle2, XCircle, ListFilter, RefreshCw, Layers
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/DataTablePagination";
import { PageHeader } from "@/components/ui/page-header";
import { BadgeStatus } from "@/components/ui/badge-status";

export const Route = createFileRoute("/admin/qualifications")({
  component: AdminQualificationsPage,
});

function AdminQualificationsPage() {
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingQual, setEditingQual] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingQual, setDeletingQual] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      setLoading(true);
      const qData = await getQualificationsFn({ data: { token } });
      setQualifications(Array.isArray(qData) ? qData : []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data kualifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Create Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createQualificationFn({
        data: { token, code, name, description },
      });

      if (res.success) {
        toast.success(`Kualifikasi ${code.toUpperCase()} berhasil ditambahkan!`);
        setCreateOpen(false);
        setCode("");
        setName("");
        setDescription("");
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat kualifikasi.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  // 2. Edit Handler
  const openEditModal = (q: any) => {
    setEditingQual(q);
    setEditName(q.name);
    setEditDescription(q.description || "");
    setEditStatus(q.status || "ACTIVE");
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQual) return;

    setEditLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateQualificationFn({
        data: {
          token,
          id: editingQual.id,
          name: editName,
          description: editDescription,
          status: editStatus,
        },
      });

      if (res.success) {
        toast.success(`Kualifikasi ${editingQual.code} berhasil diperbarui!`);
        setEditOpen(false);
        setEditingQual(null);
        loadData();
      } else {
        toast.error(res.error || "Gagal memperbarui kualifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditLoading(false);
    }
  };

  // 3. Quick Toggle Status Handler
  const handleToggleStatus = async (q: any) => {
    const token = localStorage.getItem("askganis_token") || "";
    const nextStatus = q.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await updateQualificationFn({
        data: {
          token,
          id: q.id,
          name: q.name,
          description: q.description || "",
          status: nextStatus,
        },
      });

      if (res.success) {
        toast.success(`Status ${q.code} diubah menjadi ${nextStatus === "ACTIVE" ? "Aktif" : "Nonaktif"}.`);
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status.");
    }
  };

  // 4. Delete Handler
  const openDeleteModal = (q: any) => {
    setDeletingQual(q);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingQual) return;
    setDeleteLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await deleteQualificationFn({
        data: { token, id: deletingQual.id },
      });

      if (res.success) {
        toast.success(`Kualifikasi ${deletingQual.code} berhasil dihapus.`);
        setDeleteOpen(false);
        setDeletingQual(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deletingQual.id));
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus kualifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // 5. Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await bulkDeleteQualificationsFn({
        data: { token, ids: selectedIds },
      });

      if (res.success) {
        toast.success(`Berhasil menghapus ${res.count} kualifikasi.`);
        setBulkDeleteOpen(false);
        setSelectedIds([]);
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus kualifikasi terpilih.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat hapus massal.");
    } finally {
      setBulkDeleting(false);
    }
  };

  // Compute Metrics
  const activeCount = qualifications.filter((q) => (q.status || "ACTIVE") === "ACTIVE").length;
  const inactiveCount = qualifications.length - activeCount;

  // Filtering
  const filtered = qualifications.filter((q) => {
    const matchesSearch =
      q.code?.toLowerCase().includes(search.toLowerCase()) ||
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && (q.status || "ACTIVE") === "ACTIVE") ||
      (statusFilter === "INACTIVE" && q.status === "INACTIVE");

    return matchesSearch && statusMatch;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const isAllPaginatedSelected =
    paginated.length > 0 && paginated.every((q) => selectedIds.includes(q.id));

  const handleSelectAllPaginated = () => {
    if (isAllPaginatedSelected) {
      const pageIds = paginated.map((q) => q.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginated.map((q) => q.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Master Data Kualifikasi GANISPH"
        description="Kelola daftar resmi 19 skema kualifikasi Tenaga Teknis Kehutanan secara terpusat untuk sertifikasi dan uji kompetensi."
        icon={Award}
        breadcrumbs={[{ label: "Kualifikasi GANISPH" }]}
        badgeText={`${qualifications.length} Skema`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:bg-forest-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500 transition-all">
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kualifikasi</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-zinc-100 flex items-center gap-2">
                    <Award className="h-5 w-5 text-forest-700 dark:text-forest-400" />
                    <span>Tambah Kualifikasi Baru</span>
                  </DialogTitle>
                </DialogHeader>

                {formError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleCreate} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">
                      Kode Kualifikasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: KURPET"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">Gunakan kode singkatan unik uppercase.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">
                      Nama Kualifikasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama resmi skema kualifikasi..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">Deskripsi</label>
                    <textarea
                      rows={3}
                      placeholder="Penjelasan cakupan kompetensi kualifikasi ini..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCreateOpen(false)}
                      className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500"
                    >
                      {formLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>{formLoading ? "Menyimpan..." : "Simpan Kualifikasi"}</span>
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* KPI Stats Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white p-4 shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Skema</div>
            <div className="mt-1 font-display text-2xl font-black text-forest-900 dark:text-forest-100">
              {qualifications.length}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Kualifikasi Resmi GANISPH</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-900 dark:bg-forest-950 dark:text-forest-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white p-4 shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status Aktif</div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {activeCount}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {qualifications.length ? Math.round((activeCount / qualifications.length) * 100) : 0}% dari total skema
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white p-4 shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nonaktif / Draft</div>
            <div className="mt-1 font-display text-2xl font-black text-amber-700 dark:text-amber-400">
              {inactiveCount}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Tidak Ditampilkan di Ujian</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bulk Action Sticky Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/95 p-3.5 px-4 shadow-md dark:border-rose-900/60 dark:bg-rose-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-rose-900 dark:text-rose-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span>kualifikasi terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus Terpilih ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-xl border border-border/60 bg-white p-4 shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode, nama, atau deskripsi kualifikasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-slate-50 py-2 pl-9 pr-3 text-xs focus:border-forest-700 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700 px-2.5 py-1.5 text-xs">
            <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-charcoal dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Status ({qualifications.length})</option>
              <option value="ACTIVE">Aktif ({activeCount})</option>
              <option value="INACTIVE">Nonaktif ({inactiveCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Qualifications Data Table Card */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleSelectAllPaginated}
                    className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                    title="Pilih Semua di Halaman Ini"
                  />
                </th>
                <th scope="col" className="px-6 py-3.5 w-32">KODE</th>
                <th scope="col" className="px-6 py-3.5">NAMA KUALIFIKASI</th>
                <th scope="col" className="px-6 py-3.5">DESKRIPSI</th>
                <th scope="col" className="px-6 py-3.5 w-32 text-center">STATUS</th>
                <th scope="col" className="px-6 py-3.5 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-forest-700 dark:text-forest-400" />
                      <span>Memuat data kualifikasi...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Award className="h-8 w-8 text-muted-foreground/40" />
                      <span className="font-semibold">Tidak ada kualifikasi yang cocok.</span>
                      <span className="text-[11px]">Coba ubah kata kunci pencarian atau filter status.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((q) => {
                  const isSelected = selectedIds.includes(q.id);
                  const isQualActive = (q.status || "ACTIVE") === "ACTIVE";

                  return (
                    <tr
                      key={q.id}
                      className={`transition-colors hover:bg-forest-50/30 dark:hover:bg-zinc-800/40 ${
                        isSelected ? "bg-rose-50/30 dark:bg-rose-950/20" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(q.id)}
                          className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                        />
                      </td>

                      {/* KODE */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-forest-900/10 px-2.5 py-1 font-mono font-black text-forest-900 text-xs dark:bg-forest-950 dark:text-forest-300 dark:border dark:border-forest-700/40">
                          {q.code}
                        </span>
                      </td>

                      {/* NAMA */}
                      <td className="px-6 py-4 font-bold text-charcoal dark:text-zinc-100">
                        {q.name}
                      </td>

                      {/* DESKRIPSI */}
                      <td className="px-6 py-4 text-muted-foreground dark:text-zinc-400 max-w-sm truncate">
                        {q.description || "-"}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="px-6 py-4 text-center">
                        <BadgeStatus status={isQualActive ? "ACTIVE" : "INACTIVE"} size="sm" />
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Active Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(q)}
                            title={isQualActive ? "Nonaktifkan Kualifikasi" : "Aktifkan Kualifikasi"}
                            className={`rounded-lg p-1.5 transition-colors ${
                              isQualActive
                                ? "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                : "text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50"
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(q)}
                            title="Edit Kualifikasi"
                            className="rounded-lg p-1.5 text-charcoal hover:bg-forest-50 hover:text-forest-900 transition-colors dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => openDeleteModal(q)}
                            title="Hapus Kualifikasi"
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors dark:text-rose-400 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
          itemLabel="kualifikasi"
        />
      </div>

      {/* EDIT MODAL DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-zinc-100 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-forest-700 dark:text-forest-400" />
              <span>Edit Kualifikasi {editingQual?.code}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">Kode (Tetap)</label>
              <input
                type="text"
                disabled
                value={editingQual?.code || ""}
                className="mt-1 w-full rounded-lg border border-border bg-slate-100 px-3 py-2 text-xs font-mono font-bold text-muted-foreground dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">Nama Kualifikasi</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">Deskripsi</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-zinc-200">Status Operasional</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="ACTIVE">Aktif (Tersedia)</option>
                <option value="INACTIVE">Nonaktif (Disembunyikan)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500"
              >
                {editLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{editLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Kualifikasi</span>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-zinc-300">
            Apakah Anda yakin ingin menghapus kualifikasi <strong className="font-mono text-charcoal dark:text-zinc-100">{deletingQual?.code} - {deletingQual?.name}</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{deleteLoading ? "Menghapus..." : "Ya, Hapus"}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BULK DELETE CONFIRMATION DIALOG */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Massal</span>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-zinc-300">
            Apakah Anda yakin ingin menghapus <strong className="text-rose-600 font-bold">{selectedIds.length}</strong> kualifikasi terpilih secara permanen?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(false)}
              disabled={bulkDeleting}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <span>Hapus {selectedIds.length} Data</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
