import { CheckCircle2 } from "lucide-react";

const adminBenefits = [
  "Data peserta lebih terstruktur",
  "Bank soal lebih mudah dikelola",
  "Paket ujian lebih mudah disiapkan",
  "Jawaban tersimpan otomatis",
  "Penilaian dilakukan otomatis",
  "Hasil tersimpan secara terpusat",
  "Rekap lebih mudah ditelusuri",
  "Audit trail tersedia",
];

const participantBenefits = [
  "Login dengan mudah",
  "Melihat ujian yang tersedia",
  "Membaca instruksi sebelum memulai",
  "Mengerjakan soal dengan antarmuka sederhana",
  "Mengetahui sisa waktu",
  "Jawaban tersimpan otomatis",
  "Melanjutkan setelah refresh",
  "Melihat hasil setelah ujian",
];

export function BenefitsSection() {
  return (
    <section className="bg-forest-50/20 py-16 md:py-20 lg:py-24 border-y border-border/40" aria-label="Manfaat Platform">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">
          
          {/* Admin Column */}
          <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Untuk Penyelenggara</p>
            <h3 className="mt-2 font-display text-xl font-extrabold text-charcoal md:text-2xl">
              Lebih sedikit pekerjaan administratif. Lebih banyak kontrol.
            </h3>
            
            <ul className="mt-8 space-y-3.5" role="list">
              {adminBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                  <span className="font-medium text-charcoal">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Participant Column */}
          <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Untuk Peserta</p>
            <h3 className="mt-2 font-display text-xl font-extrabold text-charcoal md:text-2xl">
              Pengalaman ujian yang sederhana bagi peserta.
            </h3>
            
            <ul className="mt-8 space-y-3.5" role="list">
              {participantBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                  <span className="font-medium text-charcoal">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
