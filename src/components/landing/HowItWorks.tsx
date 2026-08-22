import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "SIAPKAN",
    description: "Kelola kualifikasi, materi, dan bank soal.",
  },
  {
    number: "02",
    title: "SUSUN",
    description: "Buat blueprint dan paket ujian.",
  },
  {
    number: "03",
    title: "DAFTARKAN",
    description: "Daftarkan peserta sesuai kualifikasi.",
  },
  {
    number: "04",
    title: "LAKSANAKAN",
    description: "Peserta mengikuti ujian online dengan timer dan auto-save.",
  },
  {
    number: "05",
    title: "EVALUASI",
    description: "Sistem menghitung nilai dan menghasilkan hasil ujian.",
  },
];

export function HowItWorks() {
  return (
    <section 
      id="cara-kerja" 
      className="bg-white py-16 md:py-20 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Mulai dari pengelolaan soal hingga hasil ujian.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Alur asesmen yang terintegrasi penuh untuk memastikan kredibilitas dan transparansi hasil evaluasi.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-stretch lg:gap-6">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <div className="relative flex flex-1 flex-col rounded-xl border border-border/40 bg-forest-50/10 p-6 transition-all hover:shadow-sm">
                
                {/* Visual Number Anchor */}
                <div className="font-display text-4xl font-black tracking-tight text-forest-900/15">
                  {step.number}
                </div>

                <h3 className="mt-4 text-xs font-black uppercase tracking-wider text-forest-900">
                  {step.title}
                </h3>
                
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:flex shrink-0 items-center justify-center text-forest-700/20" aria-hidden="true">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
