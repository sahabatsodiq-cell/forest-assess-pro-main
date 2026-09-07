import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Coffee, Search, RefreshCw, CheckCircle2, Clock, 
  ExternalLink, Mail, MessageSquare, DollarSign, Filter, Sparkles 
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminDonationsFn, confirmCoffeeDonationPaymentFn } from "@/lib/services/mayarService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/donations")({
  component: AdminDonationsPage,
});

function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const searchTrimmed = search.trim();
      const res = await getAdminDonationsFn({
        data: {
          token,
          ...(searchTrimmed ? { search: searchTrimmed } : {}),
          status: statusFilter,
        },
      });

      if (res.donations) {
        setDonations(res.donations);
        setStats(res.stats);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data traktiran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleConfirmPayment = async (txRef: string) => {
    setActionLoading(true);
    try {
      const res = await confirmCoffeeDonationPaymentFn({
        data: { transactionRef: txRef },
      });

      if (res.success) {
        toast.success("Transaksi berhasil dikonfirmasi LUNAS!");
        loadData();
        if (selectedDonation && selectedDonation.mayar_transaction_id === txRef) {
          setSelectedDonation({ ...selectedDonation, status: "PAID" });
        }
      } else {
        toast.error(res.error || "Gagal mengonfirmasi transaksi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Kelola Traktiran Kopi"
        description="Monitoring dan kelola transaksi donasi traktiran kopi dari peserta via Mayar.id."
        icon={Coffee}
        breadcrumbs={[
          { label: "Sistem" },
          { label: "Kelola Traktiran" },
        ]}
        actions={
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-forest-50 transition-colors cursor-pointer dark:bg-charcoal dark:text-forest-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Terkumpul</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-28 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-emerald-700 dark:text-emerald-400">
              Rp {(stats?.paidAmount || 0).toLocaleString("id-ID")}
            </div>
          )}
          <div className="mt-1 text-[11px] text-muted-foreground">
            Dari <span className="font-bold text-charcoal dark:text-forest-100">{stats?.paidDonations || 0}</span> transaksi lunas
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Donasi Lunas</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-50 text-forest-900 dark:bg-forest-950 dark:text-forest-300 shadow-2xs">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-charcoal dark:text-zinc-100">
              {stats?.paidDonations || 0}
            </div>
          )}
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Status PAID / Verifikasi
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Belum Dibayar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shadow-2xs">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats?.pendingDonations || 0}
            </div>
          )}
          <div className="mt-1 text-[11px] text-muted-foreground">
            Nominal Pending: Rp {(stats?.pendingAmount || 0).toLocaleString("id-ID")}
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pengajuan</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 shadow-2xs">
              <Coffee className="h-4.5 w-4.5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-charcoal dark:text-zinc-100">
              {stats?.totalDonations || 0}
            </div>
          )}
          <div className="mt-1 text-[11px] text-muted-foreground">
            Akumulasi transaksi traktiran
          </div>
        </Card>

      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari donatur, email, HP, atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-white pl-9 pr-3 py-1.5 text-xs text-charcoal focus:border-forest-900 focus:outline-none dark:bg-charcoal dark:border-zinc-800 dark:text-forest-100"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal focus:border-forest-900 focus:outline-none dark:bg-charcoal dark:border-zinc-800 dark:text-forest-100 cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">PAID (Lunas)</option>
              <option value="PENDING">PENDING (Belum Dibayar)</option>
              <option value="EXPIRED">EXPIRED (Dibatalkan)</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-forest-50/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-zinc-900 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3">Donatur</th>
                <th className="px-4 py-3">Nominal Traktiran</th>
                <th className="px-4 py-3">ID Transaksi / Mayar Ref</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 dark:divide-zinc-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Belum ada data transaksi traktiran kopi.
                  </td>
                </tr>
              ) : (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-forest-50/40 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-charcoal dark:text-zinc-100">{item.donor_name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>{item.donor_email}</span>
                        {item.donor_phone && <span>• {item.donor_phone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-black text-emerald-700 dark:text-emerald-400">
                      Rp {Number(item.amount || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-charcoal/80 dark:text-zinc-300">
                      {item.mayar_transaction_id}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50">
                          <CheckCircle2 className="h-3 w-3" />
                          LUNAS
                        </span>
                      ) : item.status === "EXPIRED" || item.status === "CANCELLED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-black text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700/50">
                          <Clock className="h-3 w-3" />
                          DIBATALKAN (EXPIRED)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-700 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50">
                          <Clock className="h-3 w-3" />
                          BELUM DIBAYAR
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDonation(item);
                          setDetailOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-gray-50 transition-colors cursor-pointer dark:bg-charcoal dark:border-zinc-700 dark:text-forest-100"
                      >
                        Detail
                      </button>

                      {item.status !== "PAID" && (
                        <button
                          onClick={() => handleConfirmPayment(item.mayar_transaction_id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Konfirmasi Lunas
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              Rincian Traktiran Kopi
            </DialogTitle>
          </DialogHeader>

          {selectedDonation && (
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-xl border border-border bg-gray-50 p-3 space-y-2 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Referensi:</span>
                  <span className="font-mono font-bold text-charcoal dark:text-forest-100">{selectedDonation.mayar_transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donatur:</span>
                  <span className="font-bold text-charcoal dark:text-forest-100">{selectedDonation.donor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono text-charcoal dark:text-forest-100">{selectedDonation.donor_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. WhatsApp/HP:</span>
                  <span className="font-mono text-charcoal dark:text-forest-100">{selectedDonation.donor_phone || "-"}</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2 dark:border-zinc-800">
                  <span className="text-muted-foreground">Nominal Traktiran:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">
                    Rp {Number(selectedDonation.amount || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Pembayaran:</span>
                  <span className="font-extrabold">{selectedDonation.status}</span>
                </div>
              </div>

              {selectedDonation.message && (
                <div className="rounded-xl border border-border bg-white p-3 space-y-1 dark:bg-zinc-900 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Pesan Donatur:
                  </span>
                  <p className="italic text-charcoal dark:text-forest-100 leading-relaxed">
                    "{selectedDonation.message}"
                  </p>
                </div>
              )}

              {selectedDonation.payment_url && (
                <a
                  href={selectedDonation.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-forest-700 transition-all cursor-pointer dark:bg-forest-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Buka Halaman Pembayaran Mayar.id</span>
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
