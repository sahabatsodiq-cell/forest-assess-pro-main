import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminResultsFn } from "@/lib/services/adminService";
import { BarChart3, Check, X, Search } from "lucide-react";
import { DataTablePagination } from "@/components/DataTablePagination";

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
    return (
      (r.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.exam_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.qualification_code || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal">Hasil Evaluasi Asesmen</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Rekapitulasi hasil ujian teori online peserta beserta status kelulusan dan rincian skor.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari peserta, kualifikasi, atau nama ujian..."
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
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat hasil evaluasi...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3.5">Peserta</th>
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
                      const isPassed = r.score >= r.passing_grade;
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
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold ${
                              isPassed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {isPassed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              {isPassed ? 'LULUS' : 'TIDAK LULUS'}
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
