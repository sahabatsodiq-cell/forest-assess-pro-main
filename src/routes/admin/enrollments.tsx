import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getEnrollmentsFn, enrollParticipantFn, deleteEnrollmentFn, getExamsFn, getUsersFn } from "@/lib/services/adminService";
import { UserCheck, Plus, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/admin/enrollments")({
  component: AdminEnrollmentsPage,
});

function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form State
  const [examId, setExamId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [eData, exData, uData] = await Promise.all([
        getEnrollmentsFn({ data: { token } }),
        getExamsFn({ data: { token } }),
        getUsersFn({ data: { token } }),
      ]);
      setEnrollments(eData);
      setExams(exData);
      setUsers(uData.filter((u: any) => u.role === "PESERTA"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examId || !userId) {
      setFormError("Pilih paket ujian dan peserta.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await enrollParticipantFn({
        data: {
          token,
          exam_id: Number(examId),
          user_id: Number(userId),
        },
      });

      if (res.success) {
        setOpen(false);
        setUserId("");
        loadData();
      } else {
        setFormError(res.error || "Gagal mendaftarkan peserta.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pendaftaran peserta ini?")) return;
    const token = localStorage.getItem("askganis_token") || "";
    try {
      await deleteEnrollmentFn({ data: { token, id } });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = enrollments.filter((e) => {
    const s = search.toLowerCase();
    return (
      (e.user_name || "").toLowerCase().includes(s) ||
      (e.participant_number || "").toLowerCase().includes(s) ||
      (e.user_email || "").toLowerCase().includes(s) ||
      (e.exam_name || "").toLowerCase().includes(s) ||
      (e.exam_code || "").toLowerCase().includes(s)
    );
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Pendaftaran Ujian</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola hak akses dan alokasi peserta ujian pada paket ujian aktif.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Daftarkan Peserta
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Daftarkan Peserta ke Ujian
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleEnroll} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Paket Ujian Target</label>
                <select
                  required
                  value={examId}
                  onChange={(e) => setExamId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold"
                >
                  <option value="">Pilih Ujian...</option>
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      [{e.qualification_code}] {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Peserta Ujian</label>
                <select
                  required
                  value={userId}
                  onChange={(e) => setUserId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                >
                  <option value="">Pilih Peserta...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.participant_number || u.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {formLoading ? "Mendaftarkan..." : "Konfirmasi Pendaftaran"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama peserta, nomor registrasi, email, atau nama ujian..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data pendaftaran...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3.5">Nama Peserta</th>
                    <th className="px-4 py-3.5">No. Registrasi / Email</th>
                    <th className="px-4 py-3.5">Paket Ujian</th>
                    <th className="px-4 py-3.5">Tanggal Terdaftar</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada pendaftaran peserta.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((e) => (
                      <tr key={e.id} className="hover:bg-forest-50/10 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-charcoal">{e.user_name}</td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground">
                          {e.participant_number || e.user_email}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-charcoal">{e.exam_name}</div>
                          <div className="text-[10px] text-forest-700 font-mono">{e.exam_code}</div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {new Date(e.enrolled_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                            title="Hapus pendaftaran"
                          >
                            <Trash2 className="h-4 w-4" />
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
              itemLabel="pendaftaran"
            />
          </>
        )}
      </div>
    </div>
  );
}
