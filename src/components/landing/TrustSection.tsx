import { Database, ShieldAlert, CheckSquare, History } from "lucide-react";

const pillars = [
  {
    icon: Database,
    title: "Data Terstruktur",
    description: "Data kualifikasi, materi, soal, peserta, attempt, dan hasil saling terhubung.",
  },
  {
    icon: ShieldAlert,
    title: "Keamanan",
    description: "Peserta hanya dapat mengakses ujian dan hasil yang menjadi haknya.",
  },
  {
    icon: CheckSquare,
    title: "Konsistensi",
    description: "Randomisasi, timer, autosave, dan scoring mengikuti aturan sistem.",
  },
  {
    icon: History,
    title: "Auditability",
    description: "Aktivitas penting dapat ditelusuri melalui audit trail.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-forest-50/20 py-16 md:py-20 lg:py-24 border-y border-border/40" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Kredibilitas Platform</p>
          <h2
            id="trust-heading"
            className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Dibangun dengan prinsip integritas asesmen.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Integritas proses evaluasi adalah komitmen kami untuk menjaga kualitas standardisasi sertifikasi teknis.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border/50 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-900">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-charcoal">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
