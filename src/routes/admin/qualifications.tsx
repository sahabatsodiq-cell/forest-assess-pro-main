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
  Plus, Pencil, Power, Trash2, AlertTriangle,
  Award, CheckCircle2, XCircle, ListFilter, RefreshCw, Layers
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
        data: { token, code: code.trim().toUpperCase(), name, description },
      });

      if (res.success) {
        toast.success(`✓ Kualifikasi ${code.toUpperCase()} berhasil ditambahkan.`);
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
        toast.success(`✓ Kualifikasi ${editingQual.code} berhasil diperbarui.`);
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
        toast.success(`✓ Status ${q.code} diubah menjadi ${nextStatus === "ACTIVE" ? "Aktif" : "Nonaktif"}.`);
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
        toast.success(`✓ Kualifikasi ${deletingQual.code} berhasil dihapus.`);
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
        toast.success(`✓ Berhasil menghapus ${res.count} kualifikasi.`);
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

  // Compute Metrics from Real Data
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
      
      {/* Golden Reference Page Header */}
      <PageHeader
        title="Kualifikasi GANISPH"
        description="Kelola dan validasi skema kompetensi Tenaga Teknis Kehutanan dalam satu pusat data."
        icon={Award}
        breadcrumbs={[{ label: "Kualifikasi GANISPH" }]}
        badgeText={`${qualifications.length} Skema`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Muat Ulang</span>
            </Button>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="btn-executive">
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kualifikasi</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-zinc-100 flex items-center gap-2">
                    <Award className="h-5 w-5 text-forest-900 dark:text-forest-400" />
                    <span>Tambah Kualifikasi Baru</span>
                  </DialogTitle>
                </DialogHeader>

                {formError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleCreate} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">
                      Kode Kualifikasi <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Contoh: CANHUT, NEHHUT, BINHUT"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="mt-1 font-mono font-bold uppercase"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">Gunakan kode singkatan resmi uppercase.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">
                      Nama Kualifikasi <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Nama resmi skema kualifikasi..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">Deskripsi</label>
                    <textarea
                      rows={3}
                      placeholder="Penjelasan cakupan kompetensi kualifikasi ini..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-slate-50/80 px-3 py-2 text-xs text-charcoal focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateOpen(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      isLoading={formLoading}
                      className="flex-1 btn-executive"
                    >
                      Simpan Kualifikasi
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* KPI Stats Real-Data Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Skema</div>
            <div className="mt-1 font-display text-2xl font-black text-forest-900 dark:text-forest-100">
              {qualifications.length}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Kualifikasi Resmi Terdaftar</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-50 text-forest-900 dark:bg-forest-950 dark:text-forest-300 shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status Aktif</div>
            <div className="mt-1 font-display text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {activeCount}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {qualifications.length ? Math.round((activeCount / qualifications.length) * 100) : 0}% dari total skema
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nonaktif / Draft</div>
            <div className="mt-1 font-display text-2xl font-black text-amber-700 dark:text-amber-400">
              {inactiveCount}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Disembunyikan dari Ujian</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shadow-2xs">
            <XCircle className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/95 p-3.5 px-4 shadow-md dark:border-rose-900/60 dark:bg-rose-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-rose-900 dark:text-rose-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span>kualifikasi terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Batalkan
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus Terpilih ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Controls Bar */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
          placeholder="Cari kode, nama kualifikasi..."
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-slate-50/80 dark:bg-zinc-800/80 dark:border-zinc-700 px-3 py-2 text-xs">
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
      </Card>

      {/* Qualifications Executive Data Table Card */}
      <Card className="overflow-hidden shadow-2xs p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-zinc-800/90 dark:border-zinc-700 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleSelectAllPaginated}
                    className="h-4 w-4 rounded border-gray-300 text-forest-900 focus:ring-forest-500 cursor-pointer"
                    title="Pilih Semua di Halaman Ini"
                  />
                </th>
                <th scope="col" className="px-6 py-3.5 w-36">KODE</th>
                <th scope="col" className="px-6 py-3.5">KUALIFIKASI</th>
                <th scope="col" className="px-6 py-3.5">DESKRIPSI</th>
                <th scope="col" className="px-6 py-3.5 w-32 text-center">STATUS</th>
                <th scope="col" className="px-6 py-3.5 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 dark:divide-zinc-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-4 mx-auto rounded" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-md" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-48 rounded" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-64 rounded" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-7 w-20 mx-auto rounded-md" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <EmptyState
                      title="Tidak ada hasil"
                      description="Tidak ditemukan kualifikasi yang sesuai dengan pencarian Anda."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                            setPage(1);
                          }}
                        >
                          Reset Pencarian
                        </Button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((q) => {
                  const isSelected = selectedIds.includes(q.id);
                  const isQualActive = (q.status || "ACTIVE") === "ACTIVE";

                  return (
                    <tr
                      key={q.id}
                      className={`transition-colors duration-150 hover:bg-forest-50/60 dark:hover:bg-zinc-800/50 ${
                        isSelected ? "bg-rose-50/40 dark:bg-rose-950/25" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(q.id)}
                          className="h-4 w-4 rounded border-gray-300 text-forest-900 focus:ring-forest-500 cursor-pointer"
                        />
                      </td>

                      {/* KODE - Monospace Treatment */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-forest-100/90 px-2.5 py-1 font-mono font-bold text-forest-900 text-xs dark:bg-forest-950 dark:text-forest-200 border border-forest-700/20">
                          {q.code}
                        </span>
                      </td>

                      {/* KUALIFIKASI */}
                      <td className="px-6 py-4 font-bold text-charcoal dark:text-zinc-100">
                        {q.name}
                      </td>

                      {/* DESKRIPSI */}
                      <td className="px-6 py-4 text-muted-foreground dark:text-zinc-400 max-w-xs sm:max-w-sm truncate">
                        {q.description || "-"}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="px-6 py-4 text-center">
                        <BadgeStatus status={isQualActive ? "ACTIVE" : "INACTIVE"} size="sm" />
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Toggle Status */}
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
      </Card>

      {/* EDIT MODAL DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-zinc-100 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-forest-900 dark:text-forest-400" />
              <span>Edit Kualifikasi {editingQual?.code}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">Kode (Tetap)</label>
              <Input
                disabled
                value={editingQual?.code || ""}
                className="mt-1 font-mono font-bold bg-slate-100 text-muted-foreground dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">Nama Kualifikasi</label>
              <Input
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">Deskripsi</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-slate-50/80 px-3 py-2 text-xs text-charcoal focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal dark:text-zinc-200">Status Operasional</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="ACTIVE">Aktif (Tersedia)</option>
                <option value="INACTIVE">Nonaktif (Disembunyikan)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="default"
                isLoading={editLoading}
                className="flex-1 btn-executive"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EXPLICIT DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-bold">Hapus Kualifikasi?</DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-2 space-y-2 text-xs leading-relaxed text-charcoal dark:text-zinc-300">
            <p>
              Apakah Anda yakin ingin menghapus kualifikasi:
            </p>
            <div className="p-3 rounded-lg bg-rose-50/80 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 font-medium text-rose-900 dark:text-rose-200">
              <span className="font-mono font-bold mr-2">{deletingQual?.code}</span>
              <span>— {deletingQual?.name}</span>
            </div>
            <p className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              isLoading={deleteLoading}
              onClick={handleDelete}
              className="flex-1"
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BULK DELETE CONFIRMATION DIALOG */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-bold">Hapus Massal Kualifikasi?</DialogTitle>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-zinc-300">
            Apakah Anda yakin ingin menghapus <strong className="text-rose-600 font-bold">{selectedIds.length}</strong> kualifikasi terpilih secara permanen?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={bulkDeleting}
              onClick={() => setBulkDeleteOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              isLoading={bulkDeleting}
              onClick={handleBulkDelete}
              className="flex-1"
            >
              Hapus {selectedIds.length} Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
