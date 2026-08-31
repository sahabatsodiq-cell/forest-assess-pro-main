import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getEnrollmentsFn,
  enrollParticipantFn,
  deleteEnrollmentFn,
  bulkDeleteEnrollmentsFn,
  getExamsFn,
  getUsersFn,
  getExamRegistrationRequestsFn,
  approveExamRequestFn,
  rejectExamRequestFn,
} from "@/lib/services/adminService";
import { UserCheck, Plus, Trash2, Search, Inbox, Check, X, Clock, Loader2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/DataTablePagination";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/enrollments")({
  component: AdminEnrollmentsPage,
});

function AdminEnrollmentsPage() {
  const [activeTab, setActiveTab] = useState<"enrolled" | "requests">("enrolled");
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Form State
  const [examId, setExamId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [eData, exData, uData, rData] = await Promise.all([
        getEnrollmentsFn({ data: { token } }),
        getExamsFn({ data: { token } }),
        getUsersFn({ data: { token } }),
        getExamRegistrationRequestsFn({ data: { token, status: "ALL" } }),
      ]);
      setEnrollments(eData);
      setExams(exData);
      setUsers(uData.filter((u: any) => u.role === "PESERTA"));
      setRequests(rData);
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
        toast.success("Peserta berhasil didaftarkan.");
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
      toast.success("Pendaftaran dihapus.");
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await bulkDeleteEnrollmentsFn({
        data: { token, ids: selectedIds },
      });

      if (res.success) {
        toast.success(`Berhasil menghapus ${res.count} pendaftaran.`);
        setBulkDeleteOpen(false);
        setSelectedIds([]);
        loadData();
      } else {
        toast.error(res.error || "Gagal menghapus pendaftaran terpilih.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat hapus massal.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleApproveRequest = async (requestId: number) => {
    setActionLoadingId(requestId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await approveExamRequestFn({ data: { token, request_id: requestId } });
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.error || "Gagal menyetujui pengajuan.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    const notes = prompt("Alasan penolakan (opsional):");
    if (notes === null) return; // user cancelled prompt

    setActionLoadingId(requestId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await rejectExamRequestFn({ data: { token, request_id: requestId, notes: notes || undefined } });
      if (res.success) {
        toast.success("Pengajuan berhasil ditolak.");
        loadData();
      } else {
        toast.error(res.error || "Gagal menolak pengajuan.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === "PENDING").length;

  const filteredEnrollments = enrollments.filter((e) => {
    const s = search.toLowerCase();
    return (
      (e.user_name || "").toLowerCase().includes(s) ||
      (e.participant_number || "").toLowerCase().includes(s) ||
      (e.user_email || "").toLowerCase().includes(s) ||
      (e.exam_name || "").toLowerCase().includes(s) ||
      (e.exam_code || "").toLowerCase().includes(s)
    );
  });

  const filteredRequests = requests.filter((r) => {
    const s = search.toLowerCase();
    return (
      (r.user_name || "").toLowerCase().includes(s) ||
      (r.user_email || "").toLowerCase().includes(s) ||
      (r.participant_number || "").toLowerCase().includes(s) ||
      (r.qualification_code || "").toLowerCase().includes(s) ||
      (r.qualification_name || "").toLowerCase().includes(s)
    );
  });

  const currentList = activeTab === "enrolled" ? filteredEnrollments : filteredRequests;
  const paginated = currentList.slice((page - 1) * pageSize, page * pageSize);

  const isAllPaginatedSelected =
    activeTab === "enrolled" &&
    paginated.length > 0 &&
    paginated.every((item) => selectedIds.includes(item.id));

  const handleSelectAllPaginated = () => {
    if (activeTab !== "enrolled") return;
    if (isAllPaginatedSelected) {
      const pageIds = paginated.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginated.map((item) => item.id);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Pendaftaran Ujian</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola pendaftaran peserta dan persetujuan pengajuan pendaftaran mandiri.
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

      {/* Bulk Action Toolbar Bar */}
      {activeTab === "enrolled" && selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50/90 p-3.5 px-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-red-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span>pendaftaran terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-black/5"
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60">
        <button
          onClick={() => { setActiveTab("enrolled"); setPage(1); setSelectedIds([]); }}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 text-xs font-bold transition-all ${
            activeTab === "enrolled"
              ? "border-forest-900 text-forest-900"
              : "border-transparent text-muted-foreground hover:text-charcoal"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Pendaftaran Terdaftar ({enrollments.length})
        </button>
        <button
          onClick={() => { setActiveTab("requests"); setPage(1); setSelectedIds([]); }}
          className={`flex items-center gap-2 pb-3 px-1 border-b-2 text-xs font-bold transition-all ${
            activeTab === "requests"
              ? "border-forest-900 text-forest-900"
              : "border-transparent text-muted-foreground hover:text-charcoal"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Pengajuan Masuk
          {pendingRequestsCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black text-white">
              {pendingRequestsCount} MENUNGGU
            </span>
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "enrolled"
                ? "Cari nama peserta, nomor registrasi, email, atau nama ujian..."
                : "Cari nama peserta, kualifikasi, atau email..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data...</div>
        ) : activeTab === "enrolled" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                    <th className="px-6 py-3.5">Nama Peserta</th>
                    <th className="px-4 py-3.5">No. Registrasi / Email</th>
                    <th className="px-4 py-3.5">Paket Ujian</th>
                    <th className="px-4 py-3.5">Tanggal Terdaftar</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada pendaftaran peserta.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((e) => {
                      const isSelected = selectedIds.includes(e.id);
                      return (
                        <tr
                          key={e.id}
                          className={`hover:bg-forest-50/10 transition-colors ${
                            isSelected ? "bg-red-50/30" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(e.id)}
                              className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                            />
                          </td>
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <DataTablePagination
              currentPage={page}
              pageSize={pageSize}
              totalItems={filteredEnrollments.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="pendaftaran"
            />
          </>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3.5">Peserta</th>
                    <th className="px-4 py-3.5">Kualifikasi Diminta</th>
                    <th className="px-4 py-3.5">Catatan Peserta</th>
                    <th className="px-4 py-3.5">Tanggal Pengajuan</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada pengajuan pendaftaran mandiri dari peserta.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => (
                      <tr key={r.id} className="hover:bg-forest-50/10 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-charcoal">{r.user_name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {r.participant_number || r.user_email}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100 mb-0.5">
                            {r.qualification_code}
                          </span>
                          <div className="font-semibold text-charcoal">{r.qualification_name}</div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground italic">
                          {r.notes || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              r.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : r.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {r.status === "PENDING" && <Clock className="h-3 w-3" />}
                            {r.status === "APPROVED" && <Check className="h-3 w-3" />}
                            {r.status === "REJECTED" && <X className="h-3 w-3" />}
                            {r.status === "PENDING" ? "MENUNGGU" : r.status === "APPROVED" ? "DISETUJUI" : "DITOLAK"}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          {r.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleApproveRequest(r.id)}
                                disabled={actionLoadingId === r.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                {actionLoadingId === r.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                Setujui
                              </button>
                              <button
                                onClick={() => handleRejectRequest(r.id)}
                                disabled={actionLoadingId === r.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                              >
                                <X className="h-3 w-3" />
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              Diproses{r.reviewed_by_name ? ` oleh ${r.reviewed_by_name}` : ""}
                            </span>
                          )}
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
              totalItems={filteredRequests.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="pengajuan"
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
            Apakah Anda yakin ingin menghapus <strong className="text-red-600 font-bold">{selectedIds.length}</strong> pendaftaran peserta terpilih secara permanen?
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
