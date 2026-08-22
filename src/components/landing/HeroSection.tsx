import { Clock, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B4332' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Copy side */}
          <div className="flex-1 text-center lg:pt-8 lg:text-left">
            <p className="mb-4 inline-flex items-center rounded-full border border-forest-100 bg-forest-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-forest-900">
              Platform Asesmen Digital
            </p>

            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-charcoal md:text-5xl lg:text-[3.5rem]">
              Platform Asesmen{" "}
              <br className="hidden sm:inline" />
              Kompetensi{" "}
              <span className="text-forest-900">
                Tenaga Teknis Kehutanan
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:max-w-lg">
              Kelola kualifikasi, bank soal, peserta, ujian online, penilaian,
              dan hasil secara lebih terstruktur dalam satu platform.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
              >
                Masuk Platform
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#cara-kerja"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-forest-50 hover:border-forest-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
              >
                Pelajari Cara Kerja
              </a>
            </div>
          </div>

          {/* Exam mockup side */}
          <div className="relative w-full max-w-md flex-shrink-0 lg:max-w-[440px]">
            <ExamMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Exam interface mockup — pure HTML/CSS, no real data                */
/* ------------------------------------------------------------------ */
function ExamMockup() {
  const options = [
    "Mengetahui potensi dan kondisi hutan secara menyeluruh",
    "Menentukan batas kawasan hutan",
    "Mengukur luas lahan pertanian",
    "Menghitung jumlah satwa liar",
  ];

  return (
    <div className="relative" aria-hidden="true">
      {/* Main card */}
      <div className="rounded-2xl border border-border/60 bg-white shadow-xl">
        {/* Header */}
        <div className="rounded-t-2xl bg-forest-900 px-5 py-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
            CANHUT
          </div>
          <div className="mt-0.5 text-sm font-bold text-white">
            Ujian Kompetensi CANHUT
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-2.5 text-xs text-muted-foreground">
          <span>50 Soal</span>
          <span>60 Menit</span>
          <span className="font-semibold text-forest-900">
            Passing Grade: 70
          </span>
        </div>

        {/* Progress + timer */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-forest-100">
              <div
                className="h-full rounded-full bg-forest-700"
                style={{ width: "64%" }}
              />
            </div>
            <span className="text-xs font-semibold text-forest-900">
              32 / 50
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-forest-900">
            <Clock className="h-3.5 w-3.5" />
            28:41
          </div>
        </div>

        {/* Question */}
        <div className="px-5 pt-2 pb-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
            Soal 32
          </div>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-charcoal">
            Inventarisasi hutan merupakan kegiatan yang bertujuan untuk...
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2 px-5 pt-3 pb-5">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${
                i === 0
                  ? "border-forest-700 bg-forest-50"
                  : "border-border/60 bg-white"
              }`}
            >
              <span
                className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  i === 0
                    ? "border-forest-700 bg-forest-900 text-white"
                    : "border-border text-muted-foreground"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-charcoal">{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge — score */}
      <div className="absolute -right-3 top-20 rounded-xl border border-border/50 bg-white px-3.5 py-2 shadow-lg md:-right-6">
        <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Skor
        </div>
        <div className="font-display text-xl font-extrabold text-forest-900">
          84
        </div>
        <div className="text-[9px] font-semibold text-forest-700">LULUS</div>
      </div>

      {/* Floating badge — participant */}
      <div className="absolute -left-2 bottom-28 rounded-xl border border-border/50 bg-white px-3.5 py-2 shadow-lg md:-left-6">
        <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Peserta
        </div>
        <div className="text-xs font-bold text-charcoal">Budi Santoso</div>
      </div>
    </div>
  );
}
