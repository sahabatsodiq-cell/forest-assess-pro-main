import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminResultsFn, deleteAttemptFn, bulkDeleteAttemptsFn } from "@/lib/services/adminService";
import { Award, Search, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/DataTablePagination";
import { getCompetencyStatus } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/results")({
  component: AdminResultsPage,
});

function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const checkUserRole = () => {
    const userStr = localStorage.getItem("askganis_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setIsSuperAdmin(u.role === "SUPER_ADMIN");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const data = await getAdminResultsFn({ data: { token } });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserRole();
    loadData();
  }, []);

  const handleDeleteAttempt = async (attemptId: number, userName: string, examName: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus/reset hasil ujian dari "${userName}" pada paket "${examName}"?\n\nTindakan ini akan menghapus riwayat nilai secara permanen dan peserta dapat kembali mengulang ujian dari awal.`
    );
    if (!confirmDelete) return;

    setDeletingId(attemptId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await deleteAttemptFn({ data: { token, id: attemptId } });
      if (res.success) {
        toast.success("Berhasil menghapus/reset riwayat ujian peserta.");
        setSelectedIds((prev) => prev.filter((id) => id !== attemptId));
        await loadData();
      } else {
        toast.error(res.error || "Gagal menghapus riwayat ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await bulkDeleteAttemptsFn({
        data: { token, ids: selectedIds },
      });

      if (res.success) {
        toast.success(`Berhasil menghapus ${res.count} hasil ujian.`);
        setBulkDeleteOpen(false);
        setSelectedIds([]);
        await loadData();
      } else {
        toast.error(res.error || "Gagal menghapus hasil ujian terpilih.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat hapus massal.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const filtered = results.filter((r) => {
    const s = search.toLowerCase();
    return (
      (r.user_name || "").toLowerCase().includes(s) ||
      (r.participant_number || "").toLowerCase().includes(s) ||
      (r.user_email || "").toLowerCase().includes(s) ||
      (r.exam_name || "").toLowerCase().includes(s) ||
      (r.exam_code || "").toLowerCase().includes(s) ||
      (r.qualification_code || "").toLowerCase().includes(s)
    );
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const isAllPaginatedSelected =
    isSuperAdmin &&
    paginated.length > 0 &&
    paginated.every((r) => selectedIds.includes(r.id));

  const handleSelectAllPaginated = () => {
    if (!isSuperAdmin) return;
    if (isAllPaginatedSelected) {
      const pageIds = paginated.map((r) => r.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginated.map((r) => r.id);
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
          <h1 className="font-display text-2xl font-black text-charcoal flex items-center gap-2">
            <Award className="h-6 w-6 text-forest-700" />
            Hasil & Skor Ujian Peserta
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Pantau hasil penilaian asesmen kompetensi seluruh peserta secara real-time.
          </p>
        </div>
      </div>

      {/* Bulk Action Toolbar Bar */}
      {isSuperAdmin && selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50/90 p-3.5 px-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-red-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span>hasil ujian terpilih</span>
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
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data hasil ujian...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {isSuperAdmin && (
                      <th className="px-4 py-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isAllPaginatedSelected}
                          onChange={handleSelectAllPaginated}
                          className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                          title="Pilih Semua di Halaman Ini"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3.5">Nama Peserta</th>
                    <th className="px-4 py-3.5">Kualifikasi & Ujian</th>
                    <th className="px-4 py-3.5 text-center">Soal (Benar/Salah/Kosong)</th>
                    <th className="px-4 py-3.5 text-center">Skor Akhir</th>
                    <th className="px-4 py-3.5 text-center">Passing Grade</th>
                    <th className="px-6 py-3.5 text-center">Status Kelulusan</th>
                    {isSuperAdmin && <th className="px-6 py-3.5 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={isSuperAdmin ? 8 : 6} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada hasil ujian yang terkumpul.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => {
                      const status = getCompetencyStatus(r.score, r.passing_grade || 61);
                      const isSelected = selectedIds.includes(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-forest-50/10 transition-colors ${
                            isSelected ? "bg-red-50/30" : ""
                          }`}
                        >
                          {isSuperAdmin && (
                            <td className="px-4 py-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(r.id)}
                                className="h-4 w-4 rounded border-gray-300 text-forest-700 focus:ring-forest-500 cursor-pointer"
                              />
                            </td>
                          )}
                          <td className="px-6 py-3.5">
                            <div className="font-bold text-charcoal">{r.user_name}</div>
                            <div className="text-[11px] font-mono text-muted-foreground">{r.participant_number || r.user_email}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-charcoal">{r.exam_name}</div>
                            <div className="text-[10px] text-forest-700 font-mono">{r.qualification_code} — {r.exam_code}</div>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono text-[11px]">
                            <span className="text-green-700 font-bold">{r.correct_count}</span> /{" "}
                            <span className="text-red-600 font-bold">{r.incorrect_count}</span> /{" "}
                            <span className="text-gray-500 font-bold">{r.unanswered_count}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono text-sm font-black text-charcoal">
                            {r.score}
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">
                            {r.passing_grade}
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${status.badgeClass}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                              {status.label}
                            </span>
                          </td>
                          {isSuperAdmin && (
                            <td className="px-6 py-3.5 text-center">
                              <button
                                onClick={() => handleDeleteAttempt(r.id, r.user_name, r.exam_name)}
                                disabled={deletingId === r.id}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                                title="Hapus/Reset Hasil Ujian"
                              >
                                {deletingId === r.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                          )}
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
              itemLabel="hasil ujian"
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
            Apakah Anda yakin ingin menghapus/reset <strong className="text-red-600 font-bold">{selectedIds.length}</strong> hasil ujian peserta terpilih secara permanen?
            Tindakan ini tidak dapat dibatalkan dan peserta dapat mengulang ujian kembali.
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


