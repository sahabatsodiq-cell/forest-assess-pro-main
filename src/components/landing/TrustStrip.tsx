const qualifications = [
  "CANHUT",
  "NENHUT",
  "BINHUT",
  "PKB",
  "PKG",
  "PKL",
  "PCHIP",
  "HHBK",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border/50 bg-white py-8" aria-label="Kualifikasi yang didukung">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <p className="mb-5 text-center text-sm font-medium text-muted-foreground">
          Dirancang untuk kebutuhan asesmen tenaga teknis kehutanan
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {qualifications.map((q) => (
            <span
              key={q}
              className="rounded-md border border-forest-100 bg-forest-50 px-4 py-1.5 text-xs font-bold tracking-wider text-forest-900"
            >
              {q}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
