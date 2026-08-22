import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu AskGanisPH?",
    answer: "AskGanisPH adalah platform digital untuk membantu penyelenggara mengelola asesmen kompetensi tenaga teknis kehutanan, dimulai dari pengelolaan ujian teori secara online.",
  },
  {
    question: "Siapa yang dapat menggunakan AskGanisPH?",
    answer: "Platform ditujukan terutama untuk administrator dan pengelola ujian serta peserta yang mengikuti asesmen.",
  },
  {
    question: "Kualifikasi apa saja yang didukung?",
    answer: "Platform dirancang untuk berbagai kualifikasi seperti CANHUT, NENHUT, BINHUT, PKB, PKG, PKL, PChip, HHBK Kelompok Getah, HHBK Kelompok Batang, dan kualifikasi lainnya.",
  },
  {
    question: "Apakah bank soal dapat diimpor?",
    answer: "Ya. Platform dirancang untuk mendukung pengelolaan dan import bank soal secara massal.",
  },
  {
    question: "Apakah soal dapat diacak?",
    answer: "Ya. Sistem mendukung randomisasi soal dan pilihan jawaban sesuai konfigurasi ujian.",
  },
  {
    question: "Apakah jawaban peserta tersimpan otomatis?",
    answer: "Ya. Jawaban peserta disimpan secara otomatis selama ujian sehingga dapat dipulihkan ketika halaman dimuat kembali.",
  },
  {
    question: "Apakah AskGanisPH sudah mendukung ujian praktik?",
    answer: "Pada tahap awal, fokus platform adalah ujian teori online. Fitur asesmen praktik dan penguji merupakan bagian dari pengembangan tahap berikutnya.",
  },
  {
    question: "Apakah hasil ujian dihitung otomatis?",
    answer: "Ya. Untuk ujian teori MVP, sistem menghitung nilai berdasarkan jawaban peserta dan menentukan status lulus atau tidak lulus berdasarkan passing grade paket ujian.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-forest-50/20 py-16 md:py-20 lg:py-24 border-y border-border/40" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Tanya Jawab</p>
          <h2
            id="faq-heading"
            className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-charcoal md:text-3xl"
          >
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Temukan jawaban atas pertanyaan umum seputar fitur dan penggunaan platform AskGanisPH.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/60">
              <AccordionTrigger className="text-charcoal hover:no-underline font-display text-sm font-bold py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
