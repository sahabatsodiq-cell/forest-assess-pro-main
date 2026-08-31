import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getMasterGanisphFn,
  createMasterGanisphFn,
  updateMasterGanisphFn,
  deleteMasterGanisphFn,
  bulkDeleteMasterGanisphFn,
} from "@/lib/services/adminService";
import { UserCheck, Plus, Search, Edit2, Trash2, Building, Award, Calendar, MapPin, Hash, AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/DataTablePagination";
import { PageHeader } from "@/components/ui/page-header";
import { BadgeStatus } from "@/components/ui/badge-status";

export const Route = createFileRoute("/admin/master-ganisph")({
  component: AdminMasterGanisphPage,
});

function AdminMasterGanisphPage() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("ALL");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [assignmentType, setAssignmentType] = useState("");
  const [name, setName] = useState("");
  const [qualName, setQualName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [regActiveEnd, setRegActiveEnd] = useState("");
  const [assignActiveEnd, setAssignActiveEnd] = useState("");
  const [regencyCity, setRegencyCity] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editAssignmentType, setEditAssignmentType] = useState("");
  const [editName, setEditName] = useState("");
  const [editQualName, setEditQualName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRegNo, setEditRegNo] = useState("");
  const [editRegActiveEnd, setEditRegActiveEnd] = useState("");
  const [editAssignActiveEnd, setEditAssignActiveEnd] = useState("");
  const [editRegencyCity, setEditRegencyCity] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;

    try {
      const res = await getMasterGanisphFn({ data: { token } });
      setDataList(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, qualFilter, pageSize]);

  // Handle Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createMasterGanisphFn({
        data: {
          token,
          company_name: companyName || undefined,
          assignment_type: assignmentType || undefined,
          name,
          qualification_name: qualName,
          email: email || undefined,
          registration_number: regNo || undefined,
          register_active_end: regActiveEnd || undefined,
          assignment_active_end: assignActiveEnd || undefined,
          regency_city: regencyCity || undefined,
        },
      });

      if (res.success) {
        toast.success("Data GANISPH berhasil ditambahkan!");
        setCreateOpen(false);
        setCompanyName("");
        setAssignmentType("");
        setName("");
        setQualName("");
        setEmail("");
        setRegNo("");
        setRegActiveEnd("");
        setAssignActiveEnd("");
        setRegencyCity("");
        loadData();
      } else {
        toast.error("Gagal menambahkan data.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: any) => {
    setEditItem(item);
    setEditCompanyName(item.company_name || "");
    setEditAssignmentType(item.assignment_type || "");
    setEditName(item.name || "");
    setEditQualName(item.qualification_name || "");
    setEditEmail(item.email || "");
    setEditRegNo(item.registration_number || "");
    setEditRegActiveEnd(item.register_active_end || "");
    setEditAssignActiveEnd(item.assignment_active_end || "");
    setEditRegencyCity(item.regency_city || "");
    setEditOpen(true);
  };

  // Handle Edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    setEditLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateMasterGanisphFn({
        data: {
          token,
          id: editItem.id,
          company_name: editCompanyName || undefined,
          assignment_type: editAssignmentType || undefined,
          name: editName,
          qualification_name: editQualName,
          email: editEmail || undefined,
          registration_number: editRegNo || undefined,
          register_active_end: editRegActiveEnd || undefined,
          assignment_active_end: editAssignActiveEnd || undefined,
          regency_city: editRegencyCity || undefined,
        },
      });

      if (res.success) {
        toast.success("Data GANISPH berhasil diperbarui!");
        setEditOpen(false);
        setEditItem(null);
        loadData();
      } else {
        toast.error("Gagal memperbarui data.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number, itemName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data GANISPH ${itemName}?`)) return;

    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await deleteMasterGanisphFn({ data: { token, id } });
      if (res.success) {
        toast.success(`Data GANISPH ${itemName} telah dihapus.`);
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        loadData();
      } else {
        toast.error("Gagal menghapus data.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await bulkDeleteMasterGanisphFn({
        data: { token, ids: selectedIds },
      });

      if (res.success) {
        toast.success(`Berhasil menghapus ${res.count} data GANISPH.`);
        setBulkDeleteOpen(false);
        setSelectedIds([]);
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus data terpilih.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat hapus massal.");
    } finally {
      setBulkDeleting(false);
    }
  };

  // Extract unique qualification names from dataList for filter
  const uniqueQualNames = Array.from(new Set(dataList.map((d) => d.qualification_name))).filter(Boolean);

  // Filtered dataset
  const filtered = dataList.filter((item) => {
    const matchSearch =
      (item.company_name && item.company_name.toLowerCase().includes(search.toLowerCase())) ||
      (item.assignment_type && item.assignment_type.toLowerCase().includes(search.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
      (item.qualification_name && item.qualification_name.toLowerCase().includes(search.toLowerCase())) ||
      (item.registration_number && item.registration_number.toLowerCase().includes(search.toLowerCase())) ||
      (item.regency_city && item.regency_city.toLowerCase().includes(search.toLowerCase()));

    const matchQual = qualFilter === "ALL" || item.qualification_name === qualFilter;
    return matchSearch && matchQual;
  });

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const paginatedData = filtered.slice(startIdx, endIdx);

  const isAllPaginatedSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedIds.includes(item.id));

  const handleSelectAllPaginated = () => {
    if (isAllPaginatedSelected) {
      const pageIds = paginatedData.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedData.map((item) => item.id);
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
        title="Master Data GANISPH"
        description="Database terpadu registrasi Tenaga Teknis Pengelolaan Hutan (GANISPH) seluruh Indonesia."
        icon={UserCheck}
        breadcrumbs={[{ label: "Master GANISPH" }]}
        badgeText={`${dataList.length} Personel`}
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500 transition-all">
                <Plus className="h-4 w-4" />
                <span>Tambah Personel GANISPH</span>
              </button>
            </DialogTrigger>
          <DialogContent className="max-w-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Master Data GANISPH
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Perusahaan</label>
                <input
                  type="text"
                  placeholder="CV. Kalaru..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Penugasan</label>
                <input
                  type="text"
                  placeholder="B1 / B2 / B3..."
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama GANISPH *</label>
                <input
                  type="text"
                  required
                  placeholder="Alip Rusdi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi *</label>
                <input
                  type="text"
                  required
                  placeholder="GANISPH PENGUJIAN KAYU BULAT..."
                  value={qualName}
                  onChange={(e) => setQualName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nomor Register</label>
                <input
                  type="text"
                  placeholder="23230006235"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Masa Aktif Register End</label>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={regActiveEnd}
                  onChange={(e) => setRegActiveEnd(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Masa Aktif Penugasan End</label>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={assignActiveEnd}
                  onChange={(e) => setAssignActiveEnd(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kabupaten/Kota</label>
                <input
                  type="text"
                  placeholder="KOTA BANJARMASIN..."
                  value={regencyCity}
                  onChange={(e) => setRegencyCity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-charcoal">Email GANISPH <span className="text-muted-foreground font-normal normal-case">(opsional — untuk sinkronisasi otomatis ke akun peserta)</span></label>
                <input
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex gap-2 pt-2">
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
                  {formLoading ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        }
      />

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal">
              Edit Master Data GANISPH
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Nama Perusahaan</label>
              <input
                type="text"
                value={editCompanyName}
                onChange={(e) => setEditCompanyName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Penugasan</label>
              <input
                type="text"
                value={editAssignmentType}
                onChange={(e) => setEditAssignmentType(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Nama GANISPH *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi *</label>
              <input
                type="text"
                required
                value={editQualName}
                onChange={(e) => setEditQualName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Nomor Register</label>
              <input
                type="text"
                value={editRegNo}
                onChange={(e) => setEditRegNo(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Masa Aktif Register End</label>
              <input
                type="text"
                value={editRegActiveEnd}
                onChange={(e) => setEditRegActiveEnd(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Masa Aktif Penugasan End</label>
              <input
                type="text"
                value={editAssignActiveEnd}
                onChange={(e) => setEditAssignActiveEnd(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Kabupaten/Kota</label>
              <input
                type="text"
                value={editRegencyCity}
                onChange={(e) => setEditRegencyCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-charcoal">Email GANISPH <span className="text-muted-foreground font-normal normal-case">(opsional — untuk sinkronisasi otomatis ke akun peserta)</span></label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex gap-2 pt-2">
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

      {/* Bulk Action Toolbar Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50/90 p-3.5 px-4 shadow-sm dark:border-red-900/50 dark:bg-red-950/40">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-red-900 dark:text-red-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span>data GANISPH terpilih</span>
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus Terpilih ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Perusahaan, Nama GANISPH, No Register, Kab/Kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>

        <select
          value={qualFilter}
          onChange={(e) => setQualFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal focus:outline-none"
        >
          <option value="ALL">Semua Kualifikasi ({dataList.length})</option>
          {uniqueQualNames.map((qn: any) => (
            <option key={qn} value={qn}>{qn}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat database Master GANISPH...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllPaginatedSelected}
                        onChange={handleSelectAllPaginated}
                        className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                        title="Pilih Semua di Halaman Ini"
                      />
                    </th>
                    <th className="px-4 py-3.5 w-12 text-center">NO</th>
                    <th className="px-4 py-3.5">NAMA PERUSAHAAN</th>
                    <th className="px-4 py-3.5 w-24 text-center">PENUGASAN</th>
                    <th className="px-4 py-3.5">NAMA GANISPH</th>
                    <th className="px-4 py-3.5">KUALIFIKASI</th>
                    <th className="px-4 py-3.5 font-mono">NOMOR REGISTER</th>
                    <th className="px-4 py-3.5">MASA AKTIF REGISTER END</th>
                    <th className="px-4 py-3.5">MASA AKTIF PENUGASAN END</th>
                    <th className="px-4 py-3.5">KABUPATEN/KOTA</th>
                    <th className="px-4 py-3.5 text-center w-24">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">
                        Tidak ada data GANISPH yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, idx) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-forest-50/10 transition-colors ${
                            isSelected ? "bg-red-50/30 dark:bg-red-950/20" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(item.id)}
                              className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-muted-foreground">{startIdx + idx + 1}</td>
                          <td className="px-4 py-3 font-semibold text-charcoal">{item.company_name || "-"}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                              {item.assignment_type || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-forest-900">{item.name}</td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-forest-50 px-2 py-0.5 text-[11px] font-bold text-forest-900 border border-forest-100">
                              {item.qualification_name}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-gray-700">
                            {item.registration_number || "-"}
                          </td>
                          <td className="px-4 py-3 font-mono text-muted-foreground">
                            {item.register_active_end || "-"}
                          </td>
                          <td className="px-4 py-3 font-mono text-muted-foreground">
                            {item.assignment_active_end || "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.regency_city || "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModal(item)}
                                className="rounded p-1 text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Data GANISPH"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus Data GANISPH"
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
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemLabel="data"
            />
          </>
        )}
      </div>

      {/* BULK DELETE CONFIRMATION DIALOG */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Massal</span>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-forest-100">
            Apakah Anda yakin ingin menghapus <strong className="text-red-600 font-bold">{selectedIds.length}</strong> data GANISPH terpilih secara permanen?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(false)}
              disabled={bulkDeleting}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Hapus {selectedIds.length} Data
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
