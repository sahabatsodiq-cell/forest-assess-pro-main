import { Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";

export function ExamExperience() {
  const navigatorItems = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    status: i + 1 < 12 ? "answered" : i + 1 === 12 ? "current" : "unanswered",
  }));

  const options = [
    "Kegiatan pengumpulan data mengenai kondisi, potensi, dan karakteristik ekosistem hutan untuk perencanaan pengelolaan.",
    "Prosedur penebangan pohon komersial di kawasan hutan produksi secara berkala.",
    "Metode penanaman kembali lahan kritis menggunakan jenis pohon lokal unggulan.",
    "Sertifikasi legalitas kayu hasil hutan hak maupun negara sebelum didistribusikan.",
  ];

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24" aria-labelledby="exam-exp-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row-reverse lg:items-center lg:gap-16">
          
          {/* Copy Side */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Pengalaman Peserta</p>
            <h2
              id="exam-exp-heading"
              className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-charcoal md:text-4xl"
            >
              Fokus pada ujian. Sistem yang menangani sisanya.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              Peserta dapat berkonsentrasi mengerjakan soal sementara sistem menangani timer, penyimpanan jawaban otomatis (auto-save), randomisasi soal, dan perhitungan penilaian instan. Antarmuka dirancang bersih, cepat, minim distraksi, dan konsisten di berbagai perangkat.
            </p>
            
            <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
              <div className="rounded-lg border border-border/40 bg-forest-50/20 p-4">
                <h4 className="font-display text-xs font-bold text-forest-900">Auto-Save Terintegrasi</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Jawaban disimpan otomatis ke server setiap kali dipilih. Bebas khawatir jika terjadi putus koneksi atau refresh halaman.
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-forest-50/20 p-4">
                <h4 className="font-display text-xs font-bold text-forest-900">Navigasi Interaktif</h4>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  Panel navigasi soal memperlihatkan status jawaban secara visual (sudah dijawab, sedang dibuka, atau belum dijawab).
                </p>
              </div>
            </div>
          </div>

          {/* Exam Interface mockup side */}
          <div className="w-full max-w-2xl flex-shrink-0 lg:w-[560px]" aria-hidden="true">
            <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="border-b border-border/50 bg-forest-900 px-5 py-4 flex items-center justify-between text-white">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/60">Ujian Teori Online</div>
                  <div className="mt-0.5 text-xs font-bold">CANHUT — Pengumpulan Data Inventarisasi</div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 font-mono text-xs font-bold">
                  <Clock className="h-3.5 w-3.5 text-white/80" />
                  38:15
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-forest-50/30 px-5 py-2.5 flex items-center justify-between border-b border-border/40">
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <div className="h-1.5 w-full rounded-full bg-forest-100 overflow-hidden">
                    <div className="h-full bg-forest-700 rounded-full" style={{ width: '55%' }} />
                  </div>
                  <span className="text-[10px] font-bold text-forest-900">55%</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Progress: 11 / 20 Terjawab</span>
              </div>

              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/40">
                
                {/* Left Side: Question area */}
                <div className="flex-1 p-5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-forest-700">Pertanyaan 12 dari 20</div>
                  <h3 className="mt-2 text-sm font-bold text-charcoal leading-relaxed">
                    Manakah dari pilihan berikut yang mendefinisikan kegiatan inventarisasi hutan secara komprehensif?
                  </h3>

                  {/* Multiple choice options */}
                  <div className="mt-4 space-y-2.5">
                    {options.map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-lg border p-3 text-xs leading-relaxed transition-colors cursor-pointer ${
                          i === 0
                            ? "border-forest-700 bg-forest-50/50"
                            : "border-border/50 bg-white hover:bg-forest-50/10"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                            i === 0
                              ? "border-forest-700 bg-forest-900 text-white"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {i === 0 ? <Check className="h-2.5 w-2.5" /> : String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-charcoal">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
                    <button className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-charcoal hover:bg-forest-50" disabled>
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Sebelumnya
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md bg-forest-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-forest-700">
                      Berikutnya
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Questions Navigator panel */}
                <div className="w-full md:w-[160px] p-4 bg-forest-50/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Navigasi Soal</div>
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {navigatorItems.map((item) => (
                      <div
                        key={item.number}
                        className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold border transition-colors ${
                          item.status === 'answered' ? 'bg-forest-900 text-white border-forest-900' :
                          item.status === 'current' ? 'bg-white text-forest-900 border-forest-900 border-2' :
                          'bg-white text-charcoal border-border/80'
                        }`}
                      >
                        {item.number}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
