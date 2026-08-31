import { useState, useEffect } from "react";
import { Coffee, Heart, Send, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createCoffeeDonationInvoiceFn } from "@/lib/services/mayarService";
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
      const res = await createCoffeeDonationInvoiceFn({
        data: {
          donor_name: donorName.trim(),
          donor_email: donorEmail.trim(),
          donor_phone: donorPhone.trim(),
          amount: activeAmount,
          message: message.trim() || undefined,
          user_id: userId,
        },
      });

      if (res.success && res.paymentUrl) {
        toast.success("Mengarahkan ke penagihan pembayaran Mayar.id...", { duration: 4000 });
        setOpen(false);
        // Open Mayar.id checkout URL in new tab or direct window redirect
        window.open(res.paymentUrl, "_blank");
      } else {
        toast.error("Gagal membuat penagihan pembayaran.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const formattedActiveAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(activeAmount);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={
            triggerClassName ||
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-extrabold text-emerald-900 shadow-xs hover:bg-emerald-100 hover:border-emerald-400 transition-all dark:bg-emerald-950/40 dark:border-emerald-700/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          }
        >
          <Coffee className="h-4 w-4 text-emerald-700 dark:text-emerald-400 animate-bounce" />
          <span>{triggerLabel}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-[#F4F7F5] p-6 dark:bg-charcoal dark:border-charcoal/60 rounded-2xl shadow-xl">
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
                    className={`rounded-xl py-2.5 px-3 text-xs font-black transition-all ${
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
              <span>Pembayaran aman didukung oleh <strong>Mayar.id</strong></span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
