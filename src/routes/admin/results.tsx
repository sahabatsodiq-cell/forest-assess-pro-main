import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminResultsFn } from "@/lib/services/adminService";
import { Award, Search } from "lucide-react";
import { DataTablePagination } from "@/components/DataTablePagination";
import { getCompetencyStatus } from "@/lib/utils";

export const Route = createFileRoute("/admin/results")({
  component: AdminResultsPage,
});

function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    loadData();
  }, []);

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
                    <th className="px-6 py-3.5">Nama Peserta</th>
                    <th className="px-4 py-3.5">Kualifikasi & Ujian</th>
                    <th className="px-4 py-3.5 text-center">Soal (Benar/Salah/Kosong)</th>
                    <th className="px-4 py-3.5 text-center">Skor Akhir</th>
                    <th className="px-4 py-3.5 text-center">Passing Grade</th>
                    <th className="px-6 py-3.5 text-center">Status Kelulusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Belum ada hasil ujian yang terkumpul.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r) => {
                      const status = getCompetencyStatus(r.score, r.passing_grade || 61);
                      return (
                        <tr key={r.id} className="hover:bg-forest-50/10 transition-colors">
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
    </div>
  );
}
