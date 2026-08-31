import { ShieldCheck, Sparkles } from "lucide-react";

const row1 = [
  { code: "KAW", name: "Pemanfaatan Kawasan" },
  { code: "JASLING-AIR", name: "Jasa Lingkungan Air & Aliran Air" },
  { code: "JASLING-KARBON", name: "Jasa Lingkungan Karbon" },
  { code: "PAN-WA", name: "Pemandu Wisata Alam" },
  { code: "CAN-WA", name: "Perencana Wisata Alam" },
  { code: "PAK", name: "Pengujian Arang Kayu" },
  { code: "PKL", name: "Pengujian Kayu Lapis" },
  { code: "PKG", name: "Pengujian Kayu Gergajian" },
  { code: "PKB", name: "Pengujian Kayu Bulat" },
  { code: "HHBK-MINYAK", name: "HHBK Kelompok Minyak" },
];

const row2 = [
  { code: "HHBK-RESIN", name: "HHBK Kelompok Resin" },
  { code: "KURPET", name: "Pengukuran & Perpetaan Hutan" },
  { code: "HHBK-KULIT", name: "HHBK Kelompok Kulit" },
  { code: "HHBK-BATANG", name: "HHBK Kelompok Batang" },
  { code: "HHBK-GETAH", name: "HHBK Kelompok Getah" },
  { code: "PCHIP", name: "Pengujian Serpih Kayu" },
  { code: "BINHUT", name: "Pembinaan Hutan" },
  { code: "NENHUT", name: "Pemanenan Hutan" },
  { code: "CANHUT", name: "Perencanaan Hutan" },
];

export function TrustStrip() {
  return (
    <section 
      className="relative overflow-hidden border-y border-border/50 bg-white/80 py-8 backdrop-blur-xs dark:border-charcoal/60 dark:bg-charcoal/90"
      aria-label="Kualifikasi yang didukung"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-forest-100 bg-forest-50/80 px-3 py-1 text-xs font-semibold text-forest-900 dark:border-forest-800/50 dark:bg-forest-900/40 dark:text-forest-100">
            <Sparkles className="h-3.5 w-3.5 text-forest-700 dark:text-forest-400" />
            <span>Kualifikasi Standar GANISPH</span>
          </div>
          <p className="mt-2.5 text-sm font-semibold text-charcoal/80 md:text-base dark:text-forest-100/80">
            Dirancang untuk kebutuhan asesmen 19 kualifikasi resmi Tenaga Teknis Kehutanan
          </p>
        </div>
      </div>

      {/* Marquee Container with Hover Pause & Side Gradients */}
      <div className="group marquee-pause-hover relative w-full overflow-hidden">
        {/* Left & Right Fade Gradients */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-28 dark:from-charcoal dark:via-charcoal/80" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-28 dark:from-charcoal dark:via-charcoal/80" />

        {/* Row 1: Leftward Infinite Marquee */}
        <div className="animate-marquee-left flex items-center gap-3 py-1">
          {[...row1, ...row1, ...row1].map((q, idx) => (
            <div
              key={`r1-${q.code}-${idx}`}
              className="group/item inline-flex cursor-pointer items-center gap-2 rounded-full border border-forest-100/90 bg-forest-50/80 px-4 py-1.5 text-xs font-semibold text-forest-900 shadow-xs transition-all duration-300 hover:scale-105 hover:border-forest-500 hover:bg-forest-900 hover:text-white dark:border-forest-800/60 dark:bg-forest-900/40 dark:text-forest-100 dark:hover:border-forest-400 dark:hover:bg-forest-500 dark:hover:text-forest-900"
            >
              <span className="rounded-md bg-forest-200/80 px-2 py-0.5 font-mono text-[11px] font-bold text-forest-900 transition-colors group-hover/item:bg-white/20 group-hover/item:text-white dark:bg-forest-800 dark:text-forest-100">
                {q.code}
              </span>
              <span className="whitespace-nowrap">{q.name}</span>
            </div>
          ))}
        </div>

        {/* Row 2: Rightward Infinite Marquee */}
        <div className="animate-marquee-right mt-3 flex items-center gap-3 py-1">
          {[...row2, ...row2, ...row2].map((q, idx) => (
            <div
              key={`r2-${q.code}-${idx}`}
              className="group/item inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-white px-4 py-1.5 text-xs font-semibold text-charcoal shadow-xs transition-all duration-300 hover:scale-105 hover:border-forest-500 hover:bg-forest-900 hover:text-white dark:border-charcoal/70 dark:bg-charcoal/80 dark:text-forest-100 dark:hover:border-forest-400 dark:hover:bg-forest-500 dark:hover:text-forest-900"
            >
              <span className="rounded-md bg-forest-100/70 px-2 py-0.5 font-mono text-[11px] font-bold text-forest-900 transition-colors group-hover/item:bg-white/20 group-hover/item:text-white dark:bg-forest-900/80 dark:text-forest-100">
                {q.code}
              </span>
              <span className="whitespace-nowrap">{q.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
