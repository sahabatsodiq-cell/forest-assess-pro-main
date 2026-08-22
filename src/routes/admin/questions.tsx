import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getQuestionsFn, createQuestionFn, importQuestionsCsvFn, getQualificationsFn, getSubjectsFn } from "@/lib/services/adminService";
import { Database, Plus, Upload, Filter, Search, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/questions")({
  component: AdminQuestionsPage,
});

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  // Modals State
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // Create Form State
  const [qualificationId, setQualificationId] = useState<number | "">("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<"A" | "B" | "C" | "D">("A");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [explanation, setExplanation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Import Form State
  const [importQualId, setImportQualId] = useState<number | "">("");
  const [importSubId, setImportSubId] = useState<number | "">("");
  const [csvContent, setCsvContent] = useState("");
  const [importResult, setImportResult] = useState<any>(null);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [qData, qualData, subData] = await Promise.all([
        getQuestionsFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
        getSubjectsFn({ data: { token } }),
      ]);
      setQuestions(qData);
      setQualifications(qualData);
      setSubjects(subData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableSubjects = subjects.filter((s) => !qualificationId || s.qualification_id === Number(qualificationId));
  const importAvailableSubjects = subjects.filter((s) => !importQualId || s.qualification_id === Number(importQualId));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualificationId || !subjectId) {
      setFormError("Pilih kualifikasi dan materi terlebih dahulu.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createQuestionFn({
        data: {
          token,
          qualification_id: Number(qualificationId),
          subject_id: Number(subjectId),
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer,
          difficulty,
          explanation,
        },
      });

      if (res.success) {
        setCreateOpen(false);
        setQuestionText("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setExplanation("");
        loadData();
      } else {
        setFormError(res.error || "Gagal menambah soal.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importQualId || !importSubId) {
      setImportResult({ error: "Pilih kualifikasi dan materi target terlebih dahulu." });
      return;
    }

    setFormLoading(true);
    setImportResult(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await importQuestionsCsvFn({
        data: {
          token,
          qualification_id: Number(importQualId),
          subject_id: Number(importSubId),
          csvContent,
        },
      });

      setImportResult(res);
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      setImportResult({ error: err.message || "Gagal mengimpor file." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setCsvContent(evt.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const filtered = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase());
    const matchesQual = qualFilter === "ALL" || String(q.qualification_id) === qualFilter;
    const matchesDiff = difficultyFilter === "ALL" || q.difficulty === difficultyFilter;
    return matchesSearch && matchesQual && matchesDiff;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Bank Soal Terstruktur</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola soal ujian teori berdasarkan kualifikasi, materi, dan matriks tingkat kesulitan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Import CSV Modal */}
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-semibold text-charcoal hover:bg-forest-50">
                <FileSpreadsheet className="h-4 w-4 text-forest-700" />
                Import CSV
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-white p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-base font-bold text-charcoal">
                  Import Bank Soal (CSV Massal)
                </DialogTitle>
              </DialogHeader>

              {importResult && (
                <div className={`rounded-lg p-3 text-xs font-semibold ${
                  importResult.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {importResult.success ? (
                    <div>✓ Berhasil mengimpor {importResult.importedCount} soal.</div>
                  ) : (
                    <div>{importResult.error || "Gagal melakukan impor."}</div>
                  )}
                  {importResult.errors && importResult.errors.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc pl-4 text-[11px] font-normal">
                      {importResult.errors.map((err: string, idx: number) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form onSubmit={handleImport} className="mt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Target Kualifikasi</label>
                    <select
                      required
                      value={importQualId}
                      onChange={(e) => setImportQualId(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Kualifikasi...</option>
                      {qualifications.map((q) => (
                        <option key={q.id} value={q.id}>{q.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Target Materi</label>
                    <select
                      required
                      value={importSubId}
                      onChange={(e) => setImportSubId(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Materi...</option>
                      {importAvailableSubjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Upload File CSV</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-1 block w-full text-xs text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-forest-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-forest-900 hover:file:bg-forest-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Atau Tempel Teks CSV</label>
                  <textarea
                    rows={6}
                    placeholder="question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-xs font-mono"
                  />
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    Format: <code>pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar(A/B/C/D), tingkat(EASY/MEDIUM/HARD), pembahasan</code>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
                >
                  {formLoading ? "Mengimpor..." : "Proses Impor CSV"}
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create Question Modal */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
                <Plus className="h-4 w-4" />
                Tambah Soal
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-base font-bold text-charcoal">
                  Tambah Soal Ujian Baru
                </DialogTitle>
              </DialogHeader>

              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreate} className="mt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi</label>
                    <select
                      required
                      value={qualificationId}
                      onChange={(e) => {
                        setQualificationId(Number(e.target.value));
                        setSubjectId("");
                      }}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Kualifikasi...</option>
                      {qualifications.map((q) => (
                        <option key={q.id} value={q.id}>{q.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Materi / Subjek</label>
                    <select
                      required
                      value={subjectId}
                      onChange={(e) => setSubjectId(Number(e.target.value))}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Materi...</option>
                      {availableSubjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Teks Pertanyaan</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tuliskan pertanyaan soal..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Pilihan A</label>
                    <input type="text" required value={optionA} onChange={(e) => setOptionA(e.target.value)} className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Pilihan B</label>
                    <input type="text" required value={optionB} onChange={(e) => setOptionB(e.target.value)} className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Pilihan C</label>
                    <input type="text" required value={optionC} onChange={(e) => setOptionC(e.target.value)} className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Pilihan D</label>
                    <input type="text" required value={optionD} onChange={(e) => setOptionD(e.target.value)} className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Jawaban Benar</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value as any)}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-bold text-forest-900"
                    >
                      <option value="A">Opsi A</option>
                      <option value="B">Opsi B</option>
                      <option value="C">Opsi C</option>
                      <option value="D">Opsi D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-charcoal">Tingkat Kesulitan</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal">Pembahasan / Penjelasan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan jawaban..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan Soal"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>

        <select
          value={qualFilter}
          onChange={(e) => setQualFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal"
        >
          <option value="ALL">Semua Kualifikasi</option>
          {qualifications.map((q) => (
            <option key={q.id} value={q.id}>{q.code}</option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal"
        >
          <option value="ALL">Semua Tingkat</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
      </div>

      {/* Questions Table */}
      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat bank soal...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3.5 w-12 text-center">No</th>
                  <th className="px-4 py-3.5">Pertanyaan</th>
                  <th className="px-4 py-3.5 w-28">Kualifikasi</th>
                  <th className="px-4 py-3.5 w-32">Materi</th>
                  <th className="px-4 py-3.5 w-24">Kesulitan</th>
                  <th className="px-4 py-3.5 w-20 text-center">Jawaban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Belum ada soal dalam bank soal.
                    </td>
                  </tr>
                ) : (
                  filtered.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-forest-50/10 transition-colors">
                      <td className="px-5 py-3.5 text-center font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3.5 font-medium text-charcoal">
                        <div>{q.question_text}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground space-x-2">
                          <span>A: {q.option_a}</span>
                          <span>B: {q.option_b}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1.5 max-w-[200px]">
                          {/* Qualification Badges */}
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                            {(q.linked_qualification_codes ? q.linked_qualification_codes.split("; ") : [q.qualification_code]).map((code: string) => (
                              <span key={code} className="rounded bg-forest-50 px-1.5 py-0.5 text-[9px] font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                                {code}
                              </span>
                            ))}
                          </div>

                          {/* Unit Code Badge */}
                          {q.competency_unit_code && (
                            <span className="w-fit rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" title={q.competency_unit_title}>
                              {q.competency_unit_code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{q.subject_name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          q.difficulty === 'EASY' ? 'bg-blue-50 text-blue-700' :
                          q.difficulty === 'MEDIUM' ? 'bg-orange-50 text-orange-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-forest-900 font-bold text-white text-[11px]">
                          {q.correct_answer}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
