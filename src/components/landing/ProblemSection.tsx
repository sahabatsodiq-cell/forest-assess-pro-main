import { FileText, ClipboardList, BarChart3, FolderArchive } from "lucide-react";

const problems = [
  {
    icon: FileText,
    title: "Pengelolaan Soal",
    description:
      "Bank soal sulit dikelola jika masih tersebar dalam dokumen dan file yang berbeda.",
  },
  {
    icon: ClipboardList,
    title: "Pelaksanaan",
    description:
      "Proses ujian membutuhkan pengelolaan peserta, jadwal, waktu, dan jawaban yang terstruktur.",
  },
  {
    icon: BarChart3,
    title: "Penilaian",
    description:
      "Rekapitulasi jawaban dan hasil membutuhkan waktu jika dilakukan secara manual.",
  },
  {
    icon: FolderArchive,
    title: "Dokumentasi",
    description:
      "Data hasil asesmen perlu tersimpan secara terstruktur agar mudah ditelusuri dan dilaporkan.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24" aria-labelledby="problem-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="problem-heading"
            className="font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Ketika proses asesmen masih tersebar, pengelolaan menjadi lebih
            sulit.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group rounded-xl border border-border/60 bg-white p-6 transition-all hover:border-forest-100 hover:shadow-md lg:p-8"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-900 transition-colors group-hover:bg-forest-100">
                <problem.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-charcoal">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
