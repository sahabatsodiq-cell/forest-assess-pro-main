import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getUsersFn, createUserFn, toggleUserStatusFn, getQualificationsFn } from "@/lib/services/adminService";
import { Users, Plus, Search, UserCheck, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PESERTA");
  const [participantNumber, setParticipantNumber] = useState("");
  const [selectedQualIds, setSelectedQualIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

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
        setOpen(false);
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

  const handleToggleStatus = async (user: any) => {
    const token = localStorage.getItem("askganis_token") || "";
    try {
      await toggleUserStatusFn({
        data: { token, id: user.id, is_active: !user.is_active },
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Manajemen Pengguna</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola data akun pengguna, penetapan peran (RBAC), dan kualifikasi peserta.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
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

      {/* Toolbar filters */}
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
                    <th className="px-6 py-3.5">Nama & Email</th>
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
                    paginated.map((u) => (
                      <tr key={u.id} className="hover:bg-forest-50/10 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-charcoal">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
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
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {u.is_active ? 'AKTIF' : 'NONAKTIF'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`rounded px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                              u.is_active 
                                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
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
              itemLabel="pengguna"
            />
          </>
        )}
      </div>
    </div>
  );
}
