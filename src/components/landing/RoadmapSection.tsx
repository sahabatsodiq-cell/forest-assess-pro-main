import { ArrowRight } from "lucide-react";

const phases = [
  {
    number: "01",
    title: "ONLINE EXAMINATION",
    label: "Fase Saat Ini (MVP)",
    status: "active",
    items: ["Bank Soal", "Sesi Ujian", "Scoring Otomatis", "Hasil Terstruktur"],
  },
  {
    number: "02",
    title: "ASSESSMENT MANAGEMENT",
    label: "Pengembangan Tahap 2",
    status: "future",
    items: ["Profil Kompetensi", "Ujian Praktik Lapangan", "Portal Penguji/Asesor", "Verifikasi Berkas"],
  },
  {
    number: "03",
    title: "CERTIFICATION",
    label: "Pengembangan Tahap 3",
    status: "future",
    items: ["Integrasi Sertifikasi", "Digital Credential", "Verifikasi Publik", "Masa Berlaku"],
  },
  {
    number: "04",
    title: "COMPETENCY INTELLIGENCE",
    label: "Pengembangan Jangka Panjang",
    status: "future",
    items: ["Analisis Kompetensi", "Gap Analysis Wilayah", "Rekomendasi Pelatihan", "Statistik Tenaga Teknis"],
  },
];

export function RoadmapSection() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24" aria-labelledby="roadmap-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Pengembangan Bertahap</p>
          <h2
            id="roadmap-heading"
            className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Lebih dari sekadar ujian online.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            AskGanisPH dirancang dengan visi berkembang dari platform online examination menjadi ekosistem asesmen kompetensi tenaga teknis kehutanan secara menyeluruh.
          </p>
        </div>

        {/* Roadmap timeline layout */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className={`relative rounded-xl border p-6 shadow-sm transition-all ${
                phase.status === "active"
                  ? "border-forest-900 bg-forest-50/10 shadow-md"
                  : "border-border/40 bg-white"
              }`}
            >
              {/* Badge for phase */}
              <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                phase.status === "active"
                  ? "bg-forest-900 text-white"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {phase.label}
              </span>

              <div className="mt-4 font-display text-2xl font-black text-forest-900/10">
                Fase {phase.number}
              </div>

              <h3 className="mt-1 font-display text-sm font-bold text-charcoal tracking-tight">
                {phase.title}
              </h3>

              {/* Items in phase */}
              <ul className="mt-6 space-y-2.5" role="list">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <ArrowRight className="h-3 w-3 text-forest-700/60" aria-hidden="true" />
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
