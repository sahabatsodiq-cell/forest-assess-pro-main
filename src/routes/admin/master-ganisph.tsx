import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getMasterGanisphFn,
  createMasterGanisphFn,
  updateMasterGanisphFn,
  deleteMasterGanisphFn,
  getQualificationsFn,
} from "@/lib/services/adminService";
import { UserCheck, Plus, Search, Edit2, Trash2, Mail, Hash, Award, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/master-ganisph")({
  component: AdminMasterGanisphPage,
});

function AdminMasterGanisphPage() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("ALL");

  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [qualName, setQualName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editQualName, setEditQualName] = useState("");
  const [editRegNo, setEditRegNo] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;

    try {
      const [mRes, qRes] = await Promise.all([
        getMasterGanisphFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
      ]);
      setDataList(mRes);
      setQualifications(qRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createMasterGanisphFn({
        data: {
          token,
          name,
          qualification_name: qualName,
          registration_number: regNo || undefined,
          email: email || undefined,
        },
      });

      if (res.success) {
        toast.success("Data GANISPH berhasil ditambahkan!");
        setCreateOpen(false);
        setName("");
        setQualName("");
        setRegNo("");
        setEmail("");
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
    setEditName(item.name || "");
    setEditQualName(item.qualification_name || "");
    setEditRegNo(item.registration_number || "");
    setEditEmail(item.email || "");
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
          name: editName,
          qualification_name: editQualName,
          registration_number: editRegNo || undefined,
          email: editEmail || undefined,
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
        loadData();
      } else {
        toast.error("Gagal menghapus data.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  // Extract unique qualification names from dataList for filter
  const uniqueQualNames = Array.from(new Set(dataList.map((d) => d.qualification_name))).filter(Boolean);

  // Filtered dataset
  const filtered = dataList.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
      (item.registration_number && item.registration_number.toLowerCase().includes(search.toLowerCase())) ||
      (item.qualification_name && item.qualification_name.toLowerCase().includes(search.toLowerCase()));

    const matchQual = qualFilter === "ALL" || item.qualification_name === qualFilter;
    return matchSearch && matchQual;
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-forest-700" />
            Master Data GANISPH (Tenaga Teknis Kehutanan)
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Database utama 949+ Tenaga Teknis Kehutanan terdaftar, Kualifikasi, Nomor Registrasi, dan Email.
          </p>
        </div>

        {/* Create Modal */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Tambah Data GANISPH
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Master Data GANISPH
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Tenaga Teknis..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi GANISPH</label>
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
                <label className="block text-xs font-bold uppercase text-charcoal">Nomor Register GANISPH</label>
                <input
                  type="text"
                  placeholder="04200000783"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Alamat Email</label>
                <input
                  type="email"
                  placeholder="ganisph@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
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
                  {formLoading ? "Menyimpan..." : "Simpan Data"}
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
              Edit Master Data GANISPH
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi GANISPH</label>
              <input
                type="text"
                required
                value={editQualName}
                onChange={(e) => setEditQualName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Nomor Register GANISPH</label>
              <input
                type="text"
                value={editRegNo}
                onChange={(e) => setEditRegNo(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal">Alamat Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
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

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Nama, No. Register, Email, atau Kualifikasi..."
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3.5 w-16">NO</th>
                  <th className="px-6 py-3.5">NAMA LENGKAP</th>
                  <th className="px-6 py-3.5">KUALIFIKASI GANISPH</th>
                  <th className="px-6 py-3.5">NOMOR REGISTER</th>
                  <th className="px-6 py-3.5">EMAIL</th>
                  <th className="px-6 py-3.5 text-right w-28">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Tidak ada data GANISPH yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-forest-50/10 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="px-6 py-3.5 font-bold text-charcoal">{item.name}</td>
                      <td className="px-6 py-3.5">
                        <span className="rounded bg-forest-50 px-2 py-0.5 text-[11px] font-bold text-forest-900 border border-forest-100">
                          {item.qualification_name}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-gray-700">
                        {item.registration_number || "-"}
                      </td>
                      <td className="px-6 py-3.5 text-muted-foreground font-mono">
                        {item.email || "-"}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
