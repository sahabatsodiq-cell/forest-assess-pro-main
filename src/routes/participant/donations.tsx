import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Coffee, CheckCircle2, Clock, ExternalLink, RefreshCw, 
  Heart, Sparkles, ShieldCheck 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CoffeeDonationModal } from "@/components/CoffeeDonationModal";
import { getUserDonationsFn, confirmCoffeeDonationPaymentFn } from "@/lib/services/mayarService";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/donations")({
  component: ParticipantDonationsPage,
});

function ParticipantDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("askganis_user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await getUserDonationsFn({
        data: {
          userId: user.id,
          email: user.email,
        },
      });

      if (res.donations) {
        setDonations(res.donations);
        setStats(res.stats);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat riwayat traktiran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulatePayment = async (txRef: string) => {
    setActionLoading(true);
    try {
      const res = await confirmCoffeeDonationPaymentFn({
        data: { transactionRef: txRef },
      });

      if (res.success) {
        toast.success("Pembayaran berhasil dikonfirmasi LUNAS!");
        loadData();
      } else {
        toast.error(res.error || "Gagal mengonfirmasi pembayaran.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-900 via-forest-900 to-emerald-950 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
              <Coffee className="h-3.5 w-3.5 text-emerald-300" />
              <span>Traktiran Kopi Kreator</span>
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight">
              Traktiran Saya
            </h1>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-xl">
              Riwayat dan status pembayaran traktiran kopi yang telah Anda berikan via Mayar.id untuk kelangsungan platform ASKGANISPH.
            </p>
          </div>

          <div>
            <CoffeeDonationModal 
              triggerLabel="Traktir Kopi Lagi ☕"
              triggerClassName="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-emerald-950 shadow-lg hover:bg-emerald-400 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Didonasikan</span>
          {loading ? (
            <Skeleton className="h-8 w-28 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-emerald-700 dark:text-emerald-400">
              Rp {(stats?.totalAmount || 0).toLocaleString("id-ID")}
            </div>
          )}
          <span className="text-[11px] text-muted-foreground">Status Lunas</span>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Traktiran Lunas</span>
          {loading ? (
            <Skeleton className="h-8 w-20 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-charcoal dark:text-forest-100">
              {stats?.paidDonations || 0} Transaksi
            </div>
          )}
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Berhasil Diverifikasi</span>
        </Card>

        <Card className="p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Belum Dibayar</span>
          {loading ? (
            <Skeleton className="h-8 w-20 my-2" />
          ) : (
            <div className="mt-2 font-display text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats?.pendingDonations || 0} Transaksi
            </div>
          )}
          <span className="text-[11px] text-muted-foreground">Menunggu Pembayaran</span>
        </Card>
      </div>

      {/* Donations List / Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-700 dark:text-emerald-400 fill-emerald-100" />
            <span>Riwayat Transaksi Traktiran</span>
          </h2>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-forest-50 transition-colors cursor-pointer dark:bg-charcoal dark:text-forest-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="py-12 text-center space-y-3 border-2 border-dashed border-border/70 rounded-2xl dark:border-charcoal/60">
            <Coffee className="h-10 w-10 text-emerald-700/40 mx-auto" />
            <div>
              <p className="text-xs font-bold text-charcoal dark:text-forest-100">Belum ada riwayat traktiran kopi.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dukungan Anda sangat membantu pengembangan platform ASKGANISPH.
              </p>
            </div>
            <div className="pt-2">
              <CoffeeDonationModal triggerLabel="Traktir Kopi Sekarang ☕" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-emerald-300 transition-all dark:bg-charcoal/80 dark:border-charcoal/60 gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black text-emerald-700 dark:text-emerald-400">
                      Rp {Number(item.amount || 0).toLocaleString("id-ID")}
                    </span>
                    {item.status === "PAID" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50">
                        <CheckCircle2 className="h-3 w-3" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-700 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50">
                        <Clock className="h-3 w-3" />
                        BELUM DIBAYAR
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    ID Ref: {item.mayar_transaction_id} • Donatur: {item.donor_name} ({item.donor_email})
                  </div>
                  {item.message && (
                    <div className="text-[11px] italic text-charcoal/80 dark:text-forest-100/80">
                      "{item.message}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status !== "PAID" ? (
                    <>
                      {item.payment_url && (
                        <a
                          href={item.payment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D4B34] px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-[#083625] transition-all cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Bayar Sekarang</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleSimulatePayment(item.mayar_transaction_id)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-all dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Simulasi Konfirmasi</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      Struk dikirim ke email
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Seluruh transaksi traktiran kopi diproses dengan aman oleh <strong>Mayar.id</strong></span>
      </div>

    </div>
  );
}
