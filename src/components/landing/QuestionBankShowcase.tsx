import { Search, Filter, Plus, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export function QuestionBankShowcase() {
  const sampleQuestions = [
    {
      id: 1,
      question: "Inventarisasi hutan merupakan kegiatan yang bertujuan untuk...",
      qualification: "CANHUT",
      topic: "Inventarisasi",
      difficulty: "Medium",
      status: "Active",
    },
    {
      id: 2,
      question: "Pengukuran diameter pohon setinggi dada (DBH) dilakukan pada ketinggian...",
      qualification: "CANHUT",
      topic: "Pengukuran",
      difficulty: "Easy",
      status: "Active",
    },
    {
      id: 3,
      question: "Sistem silvikultur Tebang Pilih Tanam Indonesia (TPTI) mengatur tentang...",
      qualification: "BINHUT",
      topic: "Silvikultur",
      difficulty: "Hard",
      status: "Active",
    },
  ];

  return (
    <section className="bg-forest-50/40 py-16 md:py-20 lg:py-24" aria-labelledby="qbank-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          
          {/* Copy Side */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Manajemen Konten Ujian</p>
            <h2
              id="qbank-heading"
              className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-charcoal md:text-4xl"
            >
              Bank soal yang lebih terstruktur.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              AskGanisPH membantu administrator menyusun bank soal secara sistematis. Kelompokkan soal berdasarkan kualifikasi kompetensi, topik/materi spesifik, dan tingkat kesulitan untuk mempermudah perakitan paket ujian yang valid dan reliabel.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest-700" />
                Dinamis per Kualifikasi
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest-700" />
                Matriks Kesulitan
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest-700" />
                Kategori Berjenjang
              </div>
            </div>
          </div>

          {/* Table Mockup Side */}
          <div className="w-full max-w-2xl flex-shrink-0 lg:w-[540px]" aria-hidden="true">
            <div className="rounded-xl border border-border/60 bg-white shadow-lg overflow-hidden">
              
              {/* Mockup Header Toolbar */}
              <div className="border-b border-border/50 px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
                  <span>Question Bank</span>
                  <span className="rounded-full bg-forest-50 px-2.5 py-0.5 text-[10px] font-semibold text-forest-900 border border-forest-100">
                    240 Soal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-charcoal transition-colors hover:bg-forest-50">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-forest-700" />
                    Import Soal
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-forest-700">
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Soal
                  </button>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="border-b border-border/40 px-5 py-3 flex flex-wrap items-center gap-2 bg-forest-50/20">
                <div className="relative flex-1 min-w-[140px]">
                  <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Cari pertanyaan..." 
                    className="w-full rounded-md border border-border bg-white py-1 pl-7 pr-3 text-[11px] focus:outline-none focus:border-forest-700"
                    disabled
                  />
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  <span>Kualifikasi: </span>
                  <span className="font-bold text-forest-900">CANHUT</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal">
                  <span>Materi: </span>
                  <span className="font-bold text-forest-900">Inventarisasi</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal">
                  <span>Kesulitan: </span>
                  <span className="font-bold text-forest-900">Medium</span>
                </div>
              </div>

              {/* Mockup Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3 w-12 text-center">No</th>
                      <th className="px-4 py-3">Pertanyaan</th>
                      <th className="px-4 py-3 w-24">Kualifikasi</th>
                      <th className="px-4 py-3 w-28">Materi</th>
                      <th className="px-4 py-3 w-20">Kesulitan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-xs">
                    {sampleQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-forest-50/10 transition-colors">
                        <td className="px-5 py-3.5 text-center text-muted-foreground font-mono">{q.id}</td>
                        <td className="px-4 py-3.5 font-medium text-charcoal truncate max-w-[200px]" title={q.question}>
                          {q.question}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100/50">
                            {q.qualification}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground font-medium">{q.topic}</td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            q.difficulty === 'Easy' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            q.difficulty === 'Medium' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                            'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
