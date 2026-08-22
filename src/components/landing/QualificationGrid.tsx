import { Plus } from "lucide-react";

const qualifications = [
  { code: "KAW", name: "Pemanfaatan Kawasan" },
  { code: "JASLING-AIR", name: "Pemanfaatan Jasa Lingkungan Air dan Aliran Air" },
  { code: "JASLING-KARBON", name: "Pemanfaatan Jasa Lingkungan Karbon" },
  { code: "PAN-WA", name: "Pemandu Wisata Alam" },
  { code: "CAN-WA", name: "Perencana Wisata Alam" },
  { code: "PAK", name: "Pengujian Arang Kayu" },
  { code: "PKL", name: "Pengujian Kayu Lapis" },
  { code: "PKG", name: "Pengujian Kayu Gergajian" },
  { code: "PKB", name: "Pengujian Kayu Bulat" },
  { code: "HHBK-MINYAK", name: "HHBK Kelompok Minyak" },
  { code: "HHBK-RESIN", name: "HHBK Kelompok Resin" },
  { code: "KURPET", name: "Pengukuran dan Perpetaan Hutan" },
  { code: "HHBK-KULIT", name: "HHBK Kelompok Kulit" },
  { code: "HHBK-BATANG", name: "HHBK Kelompok Batang" },
  { code: "HHBK-GETAH", name: "HHBK Kelompok Getah" },
  { code: "PCHIP", name: "Pengujian Serpih Kayu" },
  { code: "BINHUT", name: "Pembinaan Hutan" },
  { code: "NENHUT", name: "Pemanenan Hutan" },
  { code: "CANHUT", name: "Perencanaan Hutan" },
];

export function QualificationGrid() {
  return (
    <section 
      id="kualifikasi" 
      className="bg-forest-50/20 py-16 md:py-20 lg:py-24 border-y border-border/40 dark:bg-charcoal/40 dark:border-charcoal/60"
      aria-labelledby="qualifications-heading"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="qualifications-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl dark:text-forest-100"
          >
            Mendukung 19 Kualifikasi Resmi Tenaga Teknis Pengelolaan Hutan (GANISPH).
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base dark:text-forest-100/70">
            Platform dirancang penuh untuk mengelola asesmen dan sertifikasi kompetensi seluruh bidang kualifikasi Tenaga Teknis Kehutanan.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {qualifications.map((q) => (
            <div
              key={q.code}
              className="rounded-xl border border-border/50 bg-white p-5 shadow-sm transition-all hover:border-forest-100 hover:shadow-md dark:border-charcoal/60 dark:bg-charcoal dark:hover:border-forest-500/50"
            >
              <span className="inline-block rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-forest-900 border border-forest-100/50 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                {q.code}
              </span>
              <h3 className="mt-3 font-display text-sm font-bold text-charcoal leading-snug dark:text-forest-100">
                {q.name}
              </h3>
            </div>
          ))}

          {/* Add more placeholder */}
          <div className="flex flex-col justify-center rounded-xl border border-dashed border-border bg-transparent p-5 text-center transition-all hover:border-forest-500/50 dark:border-charcoal/60">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-forest-50 text-forest-900 dark:bg-forest-900/40 dark:text-forest-100">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-charcoal dark:text-forest-100">
              + Kualifikasi Kustom
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground dark:text-forest-100/70">
              Skema kualifikasi baru dapat ditambahkan secara dinamis ke dalam database sistem oleh Admin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
