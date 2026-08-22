const qualifications = [
  "KAW",
  "JASLING-AIR",
  "JASLING-KARBON",
  "PAN-WA",
  "CAN-WA",
  "PAK",
  "PKL",
  "PKG",
  "PKB",
  "HHBK-MINYAK",
  "HHBK-RESIN",
  "KURPET",
  "HHBK-KULIT",
  "HHBK-BATANG",
  "HHBK-GETAH",
  "PCHIP",
  "BINHUT",
  "NENHUT",
  "CANHUT",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border/50 bg-white py-8 dark:border-charcoal/60 dark:bg-charcoal" aria-label="Kualifikasi yang didukung">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <p className="mb-5 text-center text-sm font-medium text-muted-foreground dark:text-forest-100/70">
          Dirancang untuk kebutuhan asesmen 19 kualifikasi resmi Tenaga Teknis Kehutanan (GANISPH)
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {qualifications.map((q) => (
            <span
              key={q}
              className="rounded-md border border-forest-100 bg-forest-50 px-3 py-1 text-xs font-bold tracking-wider text-forest-900 dark:border-charcoal/60 dark:bg-forest-900/40 dark:text-forest-100"
            >
              {q}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
