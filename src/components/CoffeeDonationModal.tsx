import { useState, useEffect } from "react";
import { 
  Coffee, Heart, Send, CheckCircle2, ShieldCheck, Sparkles, 
  AlertCircle, ExternalLink, Clock, RefreshCw, ArrowLeft, X 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  createCoffeeDonationInvoiceFn, 
  checkCoffeeDonationStatusFn, 
  confirmCoffeeDonationPaymentFn 
} from "@/lib/services/mayarService";
import { toast } from "sonner";

interface CoffeeDonationModalProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export function CoffeeDonationModal({ triggerClassName, triggerLabel = "Traktir Kopi" }: CoffeeDonationModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(25000);
  const [customAmountStr, setCustomAmountStr] = useState<string>("");

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Status view state: 'form' | 'success' | 'unpaid'
  const [viewState, setViewState] = useState<"form" | "success" | "unpaid">("form");
  const [activeDonation, setActiveDonation] = useState<any>(null);

  // Auto-fill logged in user info if available
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("askganis_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.name && !donorName) setDonorName(u.name);
        if (u.email && !donorEmail) setDonorEmail(u.email);
        if (u.id) setUserId(u.id);
      }
    } catch {
      // Ignore fallback
    }
  }, [open]);

  // Check URL query parameters for donation transaction status redirect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const donationParam = urlParams.get("donation");
    const txRef = urlParams.get("tx");

    if (txRef && donationParam) {
      setOpen(true);
      setVerifying(true);

      const autoConfirm = donationParam === "success";

      checkCoffeeDonationStatusFn({
        data: {
          transactionRef: txRef,
          autoConfirm,
        },
      })
        .then((res) => {
          if (res.success && res.donation) {
            setActiveDonation(res.donation);
            if (res.donation.status === "PAID") {
              setViewState("success");
            } else {
              setViewState("unpaid");
            }
          } else {
            setViewState("unpaid");
          }
        })
        .catch((err) => {
          console.error("Donation check error:", err);
          setViewState("unpaid");
        })
        .finally(() => {
          setVerifying(false);
        });
    }
  }, []);

  // Compute active nominal amount
  const activeAmount = customAmountStr ? Math.max(10000, Number(customAmountStr) || 0) : selectedAmount;

  const handleSelectPreset = (val: number) => {
    setSelectedAmount(val);
    setCustomAmountStr("");
  };

  const handleCustomChange = (valStr: string) => {
    setCustomAmountStr(valStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim()) {
      toast.error("Nama, Email, dan Nomor WhatsApp/HP wajib diisi!");
      return;
    }

    if (activeAmount < 10000) {
      toast.error("Nominal traktiran minimal Rp 10.000!");
      return;
    }

    setLoading(true);

    try {
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/participant/profile";
      const redirectUrl = `${currentOrigin}${currentPath}?donation=verify`;

      const res = await createCoffeeDonationInvoiceFn({
        data: {
          donor_name: donorName.trim(),
          donor_email: donorEmail.trim(),
          donor_phone: donorPhone.trim(),
          amount: activeAmount,
          message: message.trim() || undefined,
          user_id: userId,
          redirect_url: redirectUrl,
        },
      });

      if (res.success && res.paymentUrl) {
        toast.success("Mengarahkan ke pembayaran Mayar.id...", { duration: 3000 });
        
        setActiveDonation({
          id: res.donationId,
          mayar_transaction_id: res.transactionRef,
          payment_url: res.paymentUrl,
          amount: activeAmount,
          donor_name: donorName.trim(),
          donor_email: donorEmail.trim(),
          status: "PENDING",
        });

        // Open payment link in new window/tab
        window.open(res.paymentUrl, "_blank");

        // Switch modal view to unpaid status view with retry option
        setViewState("unpaid");
      } else {
        toast.error("Gagal membuat penagihan pembayaran Mayar.id.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!activeDonation?.mayar_transaction_id) return;
    setLoading(true);

    try {
      const res = await confirmCoffeeDonationPaymentFn({
        data: { transactionRef: activeDonation.mayar_transaction_id },
      });

      if (res.success && res.donation) {
        toast.success("Pembayaran berhasil dikonfirmasi!");
        setActiveDonation(res.donation);
        setViewState("success");
      } else {
        toast.error(res.error || "Gagal mengonfirmasi pembayaran.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearUrlAndClose = () => {
    if (typeof window !== "undefined" && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("donation");
      url.searchParams.delete("tx");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
    setOpen(false);
    setViewState("form");
  };

  const formattedActiveAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(activeAmount);

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) handleClearUrlAndClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={
            triggerClassName ||
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-extrabold text-emerald-900 shadow-xs hover:bg-emerald-100 hover:border-emerald-400 transition-all dark:bg-emerald-950/40 dark:border-emerald-700/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 cursor-pointer"
          }
        >
          <Coffee className="h-4 w-4 text-emerald-700 dark:text-emerald-400 animate-bounce" />
          <span>{triggerLabel}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-[#F4F7F5] p-6 dark:bg-charcoal dark:border-charcoal/60 rounded-2xl shadow-xl">
        
        {/* Loading state during verification */}
        {verifying ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-emerald-700 dark:text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-charcoal dark:text-forest-100">
              Memverifikasi status pembayaran Mayar.id...
            </p>
          </div>
        ) : viewState === "success" ? (
          /* ==================================================================== */
          /* SUCCESS VIEW */
          /* ==================================================================== */
          <div className="space-y-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mx-auto shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50">
                STATUS: LUNAS / PAID
              </span>
              <h3 className="font-display text-lg font-black text-charcoal dark:text-forest-100 mt-2">
                Terima Kasih atas Traktirannya! ☕
              </h3>
              <p className="text-xs text-muted-foreground mt-1 dark:text-forest-100/70">
                Dukunganmu sangat berharga untuk pengembang platform ASKGANISPH.
              </p>
            </div>

            {activeDonation && (
              <div className="rounded-xl border border-border bg-white p-3.5 text-left space-y-2 text-xs dark:bg-charcoal/80 dark:border-charcoal/60">
                <div className="flex justify-between items-center pb-2 border-b border-border/60 dark:border-charcoal/60">
                  <span className="text-muted-foreground">ID Transaksi:</span>
                  <span className="font-mono font-bold text-charcoal dark:text-forest-100">{activeDonation.mayar_transaction_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Donatur:</span>
                  <span className="font-semibold text-charcoal dark:text-forest-100">{activeDonation.donor_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nominal Traktiran:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">
                    Rp {Number(activeDonation.amount || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-emerald-50/80 p-3 text-[11px] text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 text-left flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>Struk pembayaran resmi (e-receipt) telah otomatis dikirimkan ke email Anda.</span>
            </div>

            <button
              type="button"
              onClick={handleClearUrlAndClose}
              className="w-full rounded-xl bg-[#0D4B34] py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-[#083625] transition-all cursor-pointer"
            >
              Selesai & Kembali
            </button>
          </div>
        ) : viewState === "unpaid" ? (
          /* ==================================================================== */
          /* UNPAID / PENDING VIEW */
          /* ==================================================================== */
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mx-auto shadow-md">
                <Clock className="h-7 w-7 animate-pulse" />
              </div>

              <div>
                <span className="inline-block rounded-full bg-amber-100 px-3.5 py-1 text-[11px] font-black text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50">
                  STATUS PEMBAYARAN: BELUM DIBAYAR
                </span>
                <h3 className="font-display text-base font-black text-charcoal dark:text-forest-100 mt-2">
                  Menunggu Pembayaran Traktir Kopi
                </h3>
                <p className="text-xs text-muted-foreground dark:text-forest-100/70">
                  Tagihan traktiran Anda telah dibuat. Silakan selesaikan pembayaran via Mayar.id.
                </p>
              </div>
            </div>

            {activeDonation && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2 text-xs dark:bg-amber-950/30 dark:border-amber-800/40">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID Referensi:</span>
                  <span className="font-mono font-bold text-charcoal dark:text-forest-100">{activeDonation.mayar_transaction_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Tagihan:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">
                    Rp {Number(activeDonation.amount || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {activeDonation?.payment_url && (
                <a
                  href={activeDonation.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D4B34] px-4 py-3 text-xs font-extrabold text-white shadow-md hover:bg-[#083625] transition-all cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Bayar Sekarang via Mayar.id</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleSimulateSuccess}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-all dark:bg-charcoal dark:text-emerald-300 dark:border-emerald-700/60 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Simulasi Konfirmasi Lunas</span>
              </button>

              <button
                type="button"
                onClick={() => setViewState("form")}
                className="w-full inline-flex items-center justify-center gap-1 py-2 text-xs font-bold text-muted-foreground hover:text-charcoal transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Form Traktiran</span>
              </button>
            </div>

            <div className="mt-3 text-center text-[11px] text-muted-foreground dark:text-forest-100/60 flex items-center justify-center gap-1.5 pt-2 border-t border-border/50 dark:border-charcoal/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Pembayaran aman dengan <strong>Mayar.id</strong></span>
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* FORM VIEW */
          /* ==================================================================== */
          <>
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="font-display text-lg font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                Traktir Kopi Kreator
              </DialogTitle>
              <p className="text-xs text-muted-foreground leading-relaxed dark:text-forest-100/70">
                Dukunganmu sangat berarti untuk menjaga server ASKGANISPH tetap menyala dan gratis selamanya.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-3 space-y-4 text-xs">
              {/* Preset Amounts Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/80 dark:text-forest-100/80 mb-2">
                  Pilih Nominal Traktiran
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[10000, 25000, 50000, 100000].map((amt) => {
                    const isSelected = !customAmountStr && selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`rounded-xl py-2.5 px-3 text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0D4B34] text-white shadow-md ring-2 ring-[#0D4B34]"
                            : "bg-white text-charcoal border border-border/80 hover:bg-forest-50 dark:bg-charcoal/80 dark:text-forest-100 dark:border-charcoal/60"
                        }`}
                      >
                        Rp {amt.toLocaleString("id-ID")}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5">
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    placeholder="Nominal Lainnya (Min. 10.000)"
                    value={customAmountStr}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-bold focus:border-[#0D4B34] focus:outline-none dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                  />
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal/80 dark:text-forest-100/80 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Panggilanmu"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:border-[#0D4B34] focus:outline-none dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/80 dark:text-forest-100/80 mb-1">
                    Email (Terima Struk / Bukti Pembayaran)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:border-[#0D4B34] focus:outline-none dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/80 dark:text-forest-100/80 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-mono focus:border-[#0D4B34] focus:outline-none dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/80 dark:text-forest-100/80 mb-1">
                    Pesan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Pesan penyemangat untuk kreator..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs focus:border-[#0D4B34] focus:outline-none dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100"
                  />
                </div>
              </div>

              {/* Dynamic Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || activeAmount < 10000}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D4B34] px-5 py-3 text-xs font-extrabold text-white shadow-lg hover:bg-[#083625] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Coffee className="h-4 w-4" />
                  <span>{loading ? "Menyiapkan Penagihan..." : `Lanjut Bayar ${formattedActiveAmount}`}</span>
                </button>

                <div className="mt-2.5 text-center text-[11px] text-muted-foreground dark:text-forest-100/60 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pembayaran aman dengan <strong>Mayar.id</strong></span>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
