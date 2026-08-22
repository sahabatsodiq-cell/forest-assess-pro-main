import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-16 text-white md:py-20 lg:py-24" aria-labelledby="final-cta-heading">
      {/* Subtle background texture pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1248px] px-6 text-center lg:px-10">
        <div className="mx-auto max-w-2xl">
          <h2
            id="final-cta-heading"
            className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
          >
            Mulai kelola asesmen tenaga teknis kehutanan secara digital.
          </h2>
          <p className="mt-4 text-sm text-white/80 leading-relaxed md:text-base">
            Bangun proses ujian yang lebih terstruktur, terdokumentasi, dan mudah dikelola dalam satu platform.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-forest-900 transition-colors hover:bg-forest-50"
            >
              Masuk ke Platform
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#cara-kerja"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
