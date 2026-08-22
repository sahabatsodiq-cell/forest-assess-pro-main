import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getQualificationsFn,
  createQualificationFn,
  updateQualificationFn,
  deleteQualificationFn,
} from "@/lib/services/adminService";
import { Plus, Search, Pencil, Power, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/qualifications")({
  component: AdminQualificationsPage,
});

function AdminQualificationsPage() {
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      const qData = await getQualificationsFn({ data: { token } });
      setQualifications(Array.isArray(qData) ? qData : []);
    } catch (err) {
      console.error(err);
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

  const filtered = qualifications.filter(
    (q) =>
      q.code?.toLowerCase().includes(search.toLowerCase()) ||
      q.name?.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100">
            Master Data Kualifikasi GANISPH
          </h1>
          <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
            Kelola daftar resmi 19 skema kualifikasi Tenaga Teknis Kehutanan secara terpusat.
          </p>
        </div>

        {/* Add New Qualification Button & Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500">
              <Plus className="h-4 w-4" />
              Tambah Kualifikasi
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
                Tambah Kualifikasi Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode Kualifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KURPET"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Nama Kualifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="Nama resmi kualifikasi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan cakupan kualifikasi..."
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
                {formLoading ? "Menyimpan..." : "Simpan Kualifikasi"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode atau nama kualifikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
          />
        </div>
      </div>

      {/* Qualifications Data Table */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/50 bg-forest-50/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100/70">
              <tr>
                <th scope="col" className="px-6 py-3.5 w-32">KODE</th>
                <th scope="col" className="px-6 py-3.5">NAMA</th>
                <th scope="col" className="px-6 py-3.5">DESKRIPSI</th>
                <th scope="col" className="px-4 py-3.5 text-center w-28">STATUS</th>
                <th scope="col" className="px-6 py-3.5 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-charcoal/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                    Memuat data kualifikasi...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                    Tidak ada kualifikasi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-forest-50/30 dark:hover:bg-charcoal/40">
                    {/* KODE */}
                    <td className="px-6 py-4 font-mono font-black text-charcoal text-sm dark:text-forest-100">
                      {q.code}
                    </td>

                    {/* NAMA */}
                    <td className="px-6 py-4 font-bold text-charcoal dark:text-forest-100">
                      {q.name}
                    </td>

                    {/* DESKRIPSI */}
                    <td className="px-6 py-4 text-muted-foreground dark:text-forest-100/70 max-w-xs truncate">
                      {q.description || "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        q.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800"
                          : "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {q.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(q)}
                          title="Edit Kualifikasi"
                          className="rounded-md p-1.5 text-charcoal hover:bg-forest-50 hover:text-forest-900 transition-colors dark:text-forest-100 dark:hover:bg-charcoal/60"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Power / Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(q)}
                          title={q.status === "ACTIVE" ? "Nonaktifkan Kualifikasi" : "Aktifkan Kualifikasi"}
                          className={`rounded-md p-1.5 transition-colors ${
                            q.status === "ACTIVE"
                              ? "text-charcoal hover:bg-amber-50 hover:text-amber-700 dark:text-forest-100"
                              : "text-gray-400 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(q)}
                          title="Hapus Kualifikasi"
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
      </div>

      {/* EDIT MODAL DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
              Edit Kualifikasi {editingQual?.code}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kode (Tetap)</label>
              <input
                type="text"
                disabled
                value={editingQual?.code || ""}
                className="mt-1 w-full rounded-md border border-border bg-gray-50 px-3 py-1.5 text-xs font-mono font-bold text-muted-foreground dark:bg-charcoal/60 dark:border-charcoal/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Nama Kualifikasi</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Deskripsi</label>
              <textarea
                rows={3}
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
              <span>Konfirmasi Hapus Kualifikasi</span>
            </div>
          </DialogHeader>

          <p className="mt-2 text-xs leading-relaxed text-charcoal dark:text-forest-100">
            Apakah Anda yakin ingin menghapus kualifikasi <strong className="font-mono">{deletingQual?.code} - {deletingQual?.name}</strong>? 
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
