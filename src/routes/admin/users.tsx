import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  getUsersFn, 
  createUserFn, 
  updateUserFn, 
  toggleUserStatusFn, 
  deleteUserFn, 
  verifyUserFn, 
  getQualificationsFn 
} from "@/lib/services/adminService";
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck, 
  Shield, 
  Pencil, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/DataTablePagination";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<any | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // Create Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PESERTA");
  const [participantNumber, setParticipantNumber] = useState("");
  const [selectedQualIds, setSelectedQualIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("PESERTA");
  const [editParticipantNumber, setEditParticipantNumber] = useState("");
  const [editSelectedQualIds, setEditSelectedQualIds] = useState<number[]>([]);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [editFormLoading, setEditFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [uData, qData] = await Promise.all([
        getUsersFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
      ]);
      setUsers(uData);
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

  // ------------------------------------------------------------------
  // CREATE USER
  // ------------------------------------------------------------------
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const token = localStorage.getItem("askganis_token") || "";

    try {
      const reqData: any = {
        token,
        name,
        email,
        password,
        role,
      };
      if (participantNumber) reqData.participant_number = participantNumber;
      if (selectedQualIds.length > 0) reqData.qualification_ids = selectedQualIds;

      const res = await createUserFn({ data: reqData });

      if (res.success) {
        toast.success(`Pengguna ${name} berhasil ditambahkan.`);
        setCreateOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setParticipantNumber("");
        setSelectedQualIds([]);
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat pengguna.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // EDIT USER
  // ------------------------------------------------------------------
  const openEditDialog = (u: any) => {
    setEditTarget(u);
    setEditName(u.name || "");
    setEditEmail(u.email || "");
    setEditPassword("");
    setEditRole(u.role || "PESERTA");
    setEditParticipantNumber(u.participant_number || "");
    setEditFormError(null);

    // Map existing qualification codes to qualification IDs
    if (u.qualification_codes) {
      const codes = u.qualification_codes.split("; ").map((c: string) => c.trim());
      const matchedIds = qualifications
        .filter((q) => codes.includes(q.code))
        .map((q) => q.id);
      setEditSelectedQualIds(matchedIds);
    } else {
      setEditSelectedQualIds([]);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditFormLoading(true);
    setEditFormError(null);

    const token = localStorage.getItem("askganis_token") || "";

    try {
      const reqData: any = {
        token,
        id: editTarget.id,
        name: editName,
        role: editRole,
        participant_number: editParticipantNumber || undefined,
        qualification_ids: editSelectedQualIds,
      };
      if (editPassword.trim()) {
        reqData.password = editPassword.trim();
      }

      const res = await updateUserFn({ data: reqData });

      if (res.success) {
        toast.success(`Data pengguna ${editName} berhasil diperbarui.`);
        setEditTarget(null);
        loadData();
      } else {
        setEditFormError("Gagal memperbarui data pengguna.");
      }
    } catch (err: any) {
      setEditFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setEditFormLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // VERIFY & VALIDATE USER
  // ------------------------------------------------------------------
  const handleApproveVerify = async () => {
    if (!verifyTarget) return;
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await verifyUserFn({ data: { token, id: verifyTarget.id } });
      if (res.success) {
        toast.success(`Akun ${verifyTarget.name} berhasil diverifikasi & diaktifkan.`);
        setVerifyTarget(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memverifikasi pengguna.");
    }
  };

  // ------------------------------------------------------------------
  // TOGGLE STATUS (AKTIF / NONAKTIF)
  // ------------------------------------------------------------------
  const handleToggleStatus = async (user: any) => {
    const token = localStorage.getItem("askganis_token") || "";
    const nextStatus = !user.is_active;
    try {
      await toggleUserStatusFn({
        data: { token, id: user.id, is_active: nextStatus },
      });
      toast.success(`Status ${user.name} diubah menjadi ${nextStatus ? "AKTIF" : "NONAKTIF"}.`);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status pengguna.");
    }
  };

  // ------------------------------------------------------------------
  // DELETE USER
  // ------------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await deleteUserFn({ data: { token, id: deleteTarget.id } });
      if (res.success) {
        toast.success(`Akun ${deleteTarget.name} berhasil dihapus permanen.`);
        setDeleteTarget(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus pengguna.");
    }
  };

  // Filter & Pagination
  const filtered = users.filter((u) => {
    const matchSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.qualification_codes && u.qualification_codes.toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Manajemen Pengguna</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola data akun pengguna, verifikasi & validasi pendaftar baru, penetapan peran (RBAC), dan kualifikasi peserta.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Pengguna Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                  >
                    <option value="PESERTA">PESERTA</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Nomor KTP / NIK</label>
                  <input
                    type="text"
                    value={participantNumber}
                    onChange={(e) => setParticipantNumber(e.target.value)}
                    placeholder="6371xxxxxxxxxxxx"
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              {role === "PESERTA" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Dimiliki (Multi-Select)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto rounded-md border border-border p-2.5">
                    {qualifications.map((q) => {
                      const isChecked = selectedQualIds.includes(q.id);
                      return (
                        <label key={q.id} className="flex items-center gap-2 text-xs cursor-pointer text-charcoal">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedQualIds(selectedQualIds.filter((id) => id !== q.id));
                              } else {
                                setSelectedQualIds([...selectedQualIds, q.id]);
                              }
                            }}
                            className="rounded border-gray-300 text-forest-700 focus:ring-forest-500"
                          />
                          <span className="font-bold font-mono">{q.code}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="mt-2 w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {formLoading ? "Menyimpan..." : "Simpan Pengguna"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama, email, atau kualifikasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal focus:outline-none"
        >
          <option value="ALL">Semua Role</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="PESERTA">PESERTA</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data pengguna...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3.5">NAMA PENGGUNA</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Nomor KTP / NIK</th>
                    <th className="px-4 py-3.5">Kualifikasi Dimiliki</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Tidak ada pengguna yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((u) => {
                      const isPending = !u.is_active && u.role === "PESERTA";
                      return (
                        <tr key={u.id} className="hover:bg-forest-50/10 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="font-bold text-charcoal">{u.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                              u.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                              u.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              'bg-gray-50 text-gray-700 border border-gray-100'
                            }`}>
                              <Shield className="h-3 w-3" />
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-muted-foreground font-bold">
                            {u.participant_number || "-"}
                          </td>
                          <td className="px-4 py-3.5">
                            {u.qualification_codes ? (
                              <div className="flex flex-wrap items-center gap-1">
                                {u.qualification_codes.split("; ").map((qc: string, idx: number, arr: string[]) => (
                                  <span key={qc} className="inline-flex items-center gap-1">
                                    <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-extrabold text-forest-900 border border-forest-100 shadow-xs">
                                      {qc}
                                    </span>
                                    {idx < arr.length - 1 && <span className="text-forest-900 font-extrabold text-xs font-mono mr-0.5">;</span>}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-[11px]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            {u.is_active ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-extrabold text-green-700 border border-green-200">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                AKTIF
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-300 animate-pulse">
                                <Clock className="h-3 w-3 text-amber-600" />
                                MENUNGGU VERIFIKASI
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-extrabold text-red-700 border border-red-200">
                                NONAKTIF
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Verifikasi & Validasi Button for Pending Users */}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => setVerifyTarget(u)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-forest-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-forest-800 transition-colors"
                                  title="Verifikasi & Validasi Akun Peserta"
                                >
                                  <UserCheck className="h-3.5 w-3.5 text-amber-300" />
                                  <span>Verifikasi</span>
                                </button>
                              )}

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => openEditDialog(u)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1 text-[11px] font-semibold text-charcoal hover:bg-gray-100 transition-colors"
                                title="Edit Pengguna"
                              >
                                <Pencil className="h-3.5 w-3.5 text-forest-700" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>

                              {/* Toggle Status Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(u)}
                                className={`rounded-lg px-2 py-1 text-[11px] font-semibold border transition-colors ${
                                  u.is_active 
                                    ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                    : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                                title={u.is_active ? "Nonaktifkan Sesi Akun" : "Aktifkan Akun"}
                              >
                                {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(u)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition-colors"
                                title="Hapus Pengguna Permanen"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                <span className="hidden sm:inline">Hapus</span>
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
              itemLabel="pengguna"
            />
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL VERIFIKASI & VALIDASI AKUN                                  */}
      {/* ------------------------------------------------------------------ */}
      {verifyTarget && (
        <Dialog open={!!verifyTarget} onOpenChange={(val) => !val && setVerifyTarget(null)}>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-forest-700" />
                Verifikasi & Validasi Akun Peserta
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-amber-900">
                <p className="font-bold">Permohonan Registrasi Akun Baru</p>
                <p className="mt-0.5 text-[11px] text-amber-800">
                  Periksa detail identitas pendaftar sebelum menyetujui akses ke platform ujian.
                </p>
              </div>

              <div className="space-y-2 border-t border-border/40 pt-3">
                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="font-bold text-muted-foreground">Nama Lengkap:</span>
                  <span className="font-extrabold text-charcoal">{verifyTarget.name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="font-bold text-muted-foreground">Email:</span>
                  <span className="font-mono text-charcoal">{verifyTarget.email}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="font-bold text-muted-foreground">Nomor NIK / KTP:</span>
                  <span className="font-mono font-bold text-forest-900">
                    {verifyTarget.participant_number || "REG-AutoGenerated"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/20">
                  <span className="font-bold text-muted-foreground">Kualifikasi Dimiliki:</span>
                  <span className="font-bold text-charcoal">
                    {verifyTarget.qualification_codes || "Belum Ditetapkan"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyTarget(null)}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApproveVerify}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-forest-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Setujui & Aktifkan Akun
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL EDIT PENGGUNA                                                */}
      {/* ------------------------------------------------------------------ */}
      {editTarget && (
        <Dialog open={!!editTarget} onOpenChange={(val) => !val && setEditTarget(null)}>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal flex items-center gap-2">
                <Pencil className="h-4 w-4 text-forest-700" />
                Edit Data Pengguna
              </DialogTitle>
            </DialogHeader>

            {editFormError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {editFormError}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="mt-4 space-y-4">
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
                <label className="block text-xs font-bold uppercase text-charcoal">Email</label>
                <input
                  type="email"
                  disabled
                  value={editEmail}
                  className="mt-1 w-full rounded-md border border-border bg-gray-100 px-3 py-1.5 text-xs text-muted-foreground font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">
                  Password Baru <span className="text-[10px] text-muted-foreground font-normal">(Kosongkan jika tidak ingin diubah)</span>
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                  >
                    <option value="PESERTA">PESERTA</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Nomor KTP / NIK</label>
                  <input
                    type="text"
                    value={editParticipantNumber}
                    onChange={(e) => setEditParticipantNumber(e.target.value)}
                    placeholder="6371xxxxxxxxxxxx"
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              {editRole === "PESERTA" && (
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Dimiliki (Multi-Select)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto rounded-md border border-border p-2.5">
                    {qualifications.map((q) => {
                      const isChecked = editSelectedQualIds.includes(q.id);
                      return (
                        <label key={q.id} className="flex items-center gap-2 text-xs cursor-pointer text-charcoal">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setEditSelectedQualIds(editSelectedQualIds.filter((id) => id !== q.id));
                              } else {
                                setEditSelectedQualIds([...editSelectedQualIds, q.id]);
                              }
                            }}
                            className="rounded border-gray-300 text-forest-700 focus:ring-forest-500"
                          />
                          <span className="font-bold font-mono">{q.code}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editFormLoading}
                  className="rounded-lg bg-forest-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-forest-700 disabled:opacity-50"
                >
                  {editFormLoading ? "Simpan..." : "Perbarui Data"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL KONFIRMASI HAPUS PENGGUNA                                    */}
      {/* ------------------------------------------------------------------ */}
      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={(val) => !val && setDeleteTarget(null)}>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Konfirmasi Hapus Akun Pengguna
              </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-3 text-xs">
              <p className="text-charcoal leading-relaxed">
                Apakah Anda yakin ingin menghapus akun pengguna <strong className="text-red-700 font-extrabold">{deleteTarget.name}</strong> ({deleteTarget.email}) secara permanen?
              </p>
              
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-900 text-[11px] leading-relaxed">
                <strong>⚠️ Peringatan:</strong> Tindakan ini akan menghapus seluruh data relasi pengguna (penugasan kualifikasi, pendaftaran ujian, dan riwayat attempt) secara permanen.
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Permanen
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
