import { Plus } from "lucide-react";

const qualifications = [
  { code: "CANHUT", name: "Tenaga Teknis Perencanaan Hutan" },
  { code: "NENHUT", name: "Tenaga Teknis Pemanenan Hutan" },
  { code: "BINHUT", name: "Tenaga Teknis Pembinaan Hutan" },
  { code: "PKB", name: "Penguji Kayu Bulat" },
  { code: "PKG", name: "Penguji Kayu Gergajian" },
  { code: "PKL", name: "Penguji Kayu Lapis" },
  { code: "PCHIP", name: "Penguji Serpih Kayu (PChip)" },
  { code: "HHBK Getah", name: "Hasil Hutan Bukan Kayu Kelompok Getah" },
  { code: "HHBK Batang", name: "Hasil Hutan Bukan Kayu Kelompok Batang" },
];

export function QualificationGrid() {
  return (
    <section 
      id="kualifikasi" 
      className="bg-forest-50/20 py-16 md:py-20 lg:py-24 border-y border-border/40"
      aria-labelledby="qualifications-heading"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="qualifications-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Dirancang untuk berbagai kualifikasi tenaga teknis kehutanan.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Platform dirancang untuk mendukung berbagai kualifikasi dan dapat dikembangkan sesuai kebutuhan penyelenggara.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {qualifications.map((q) => (
            <div
              key={q.code}
              className="rounded-xl border border-border/50 bg-white p-5 shadow-sm transition-all hover:border-forest-100 hover:shadow-md"
            >
              <span className="inline-block rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold tracking-wider text-forest-900 border border-forest-100/50">
                {q.code}
              </span>
              <h3 className="mt-3 font-display text-sm font-bold text-charcoal leading-snug">
                {q.name}
              </h3>
            </div>
          ))}

          {/* Add more placeholder */}
          <div className="flex flex-col justify-center rounded-xl border border-dashed border-border bg-transparent p-5 text-center transition-all hover:border-forest-500/50">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-forest-50 text-forest-900">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-charcoal">
              + Kualifikasi Lainnya
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Skema kualifikasi baru dapat ditambahkan secara dinamis ke dalam database sistem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
