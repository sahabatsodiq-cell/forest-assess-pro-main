import {
  Award,
  Database,
  Upload,
  Layers,
  Monitor,
  Timer,
  Shuffle,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Master Kualifikasi",
    description:
      "Kelola berbagai kualifikasi tenaga teknis kehutanan secara dinamis.",
  },
  {
    icon: Database,
    title: "Bank Soal Terstruktur",
    description:
      "Kelola soal berdasarkan kualifikasi, materi, dan tingkat kesulitan.",
  },
  {
    icon: Upload,
    title: "Import Soal",
    description:
      "Masukkan bank soal secara massal tanpa harus membuat soal satu per satu.",
  },
  {
    icon: Layers,
    title: "Blueprint Ujian",
    description:
      "Atur komposisi jumlah soal berdasarkan materi agar ujian tetap terstruktur.",
  },
  {
    icon: Monitor,
    title: "Ujian Online",
    description:
      "Peserta mengerjakan ujian melalui antarmuka yang fokus dan mudah digunakan.",
  },
  {
    icon: Timer,
    title: "Timer & Auto-save",
    description:
      "Waktu ujian dikontrol sistem dan jawaban tersimpan secara otomatis.",
  },
  {
    icon: Shuffle,
    title: "Randomisasi",
    description:
      "Soal dan pilihan jawaban dapat diacak untuk setiap attempt.",
  },
  {
    icon: BarChart3,
    title: "Scoring & Result",
    description:
      "Nilai dihitung otomatis dan hasil ujian tersimpan secara terstruktur.",
  },
];

export function FeatureGrid() {
  return (
    <section
      id="fitur"
      className="py-16 md:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Semua yang dibutuhkan untuk menyelenggarakan ujian teori.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/60 bg-white p-6 transition-all hover:border-forest-100 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-900 transition-colors group-hover:bg-forest-100">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-charcoal">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
