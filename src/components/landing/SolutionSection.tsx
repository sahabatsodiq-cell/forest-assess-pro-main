import { Fragment } from "react";
import {
  Award,
  BookOpen,
  Database,
  Layers,
  Package,
  Users,
  FileCheck,
  BarChart3,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  { icon: Award, label: "Kualifikasi" },
  { icon: BookOpen, label: "Materi" },
  { icon: Database, label: "Bank Soal" },
  { icon: Layers, label: "Blueprint" },
  { icon: Package, label: "Paket Ujian" },
  { icon: Users, label: "Peserta" },
  { icon: FileCheck, label: "Ujian" },
  { icon: BarChart3, label: "Penilaian" },
  { icon: ClipboardCheck, label: "Hasil" },
];

export function SolutionSection() {
  return (
    <section
      className="border-y border-border/50 bg-white py-16 md:py-20 lg:py-24"
      aria-labelledby="solution-heading"
    >
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="solution-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Satu platform untuk mengelola proses ujian dari awal hingga hasil.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            AskGanisPH menyatukan proses pengelolaan asesmen teori ke dalam satu
            alur digital yang sederhana.
          </p>
        </div>

        {/* Workflow pipeline — the signature element */}
        <div className="mt-14 -mx-6 px-6 overflow-x-auto lg:mx-0 lg:px-0 lg:overflow-visible">
          <div
            className="relative flex items-start gap-0 min-w-max py-4 lg:min-w-0 lg:justify-between"
            role="list"
            aria-label="Alur kerja asesmen"
          >
            {/* Connecting line (behind nodes) */}
            <div
              className="absolute left-[28px] right-[28px] top-[27px] h-px bg-gradient-to-r from-forest-900/10 via-forest-700/25 to-forest-900/10 lg:left-[40px] lg:right-[40px]"
              aria-hidden="true"
            />

            {steps.map((step, i) => (
              <Fragment key={step.label}>
                <div
                  className="relative flex flex-col items-center gap-2.5 px-2 lg:flex-1 lg:px-0"
                  role="listitem"
                >
                  <div className="relative z-10 flex h-[54px] w-[54px] items-center justify-center rounded-xl bg-forest-900 text-white shadow-md transition-transform hover:scale-105">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="whitespace-nowrap text-[11px] font-bold tracking-wide text-forest-900">
                    {step.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className="flex shrink-0 items-center self-center pt-0 lg:hidden"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-forest-700/40" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
