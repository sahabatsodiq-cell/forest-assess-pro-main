import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSubjectsFn, createSubjectFn, getQualificationsFn } from "@/lib/services/adminService";
import { BookOpen, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/subjects")({
  component: AdminSubjectsPage,
});

function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [qualFilter, setQualFilter] = useState("ALL");
  const [open, setOpen] = useState(false);

  // Form State
  const [qualificationId, setQualificationId] = useState<number | "">("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState(30);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [sData, qData] = await Promise.all([
        getSubjectsFn({ data: { token } }),
        getQualificationsFn({ data: { token } }),
      ]);
      setSubjects(sData);
      setQualifications(qData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualificationId) {
      setFormError("Pilih kualifikasi terlebih dahulu.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createSubjectFn({
        data: {
          token,
          qualification_id: Number(qualificationId),
          code,
          name,
          description,
          weight: Number(weight),
        },
      });

      if (res.success) {
        setOpen(false);
        setCode("");
        setName("");
        setDescription("");
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat materi.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = subjects.filter((s) => {
    const matchesSearch = s.code.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
    const matchesQual = qualFilter === "ALL" || String(s.qualification_id) === qualFilter;
    return matchesSearch && matchesQual;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Master Materi Ujian</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola bidang studi dan materi kompetensi yang terhubung dengan kualifikasi.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Tambah Materi
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Materi Ujian Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kualifikasi Induk</label>
                <select
                  required
                  value={qualificationId}
                  onChange={(e) => setQualificationId(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                >
                  <option value="">Pilih Kualifikasi...</option>
                  {qualifications.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.code} — {q.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kode Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: CAN-INV"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Nama materi/bidang kompetensi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Bobot Defisiensi (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan ringkas materi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="mt-2 w-full rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50"
              >
                {formLoading ? "Menyimpan..." : "Simpan Materi"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode atau nama materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>

        <select
          value={qualFilter}
          onChange={(e) => setQualFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal focus:outline-none"
        >
          <option value="ALL">Semua Kualifikasi</option>
          {qualifications.map((q) => (
            <option key={q.id} value={q.id}>
              {q.code}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat data materi...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3.5">Kode & Nama Materi</th>
                  <th className="px-4 py-3.5">Kualifikasi</th>
                  <th className="px-4 py-3.5">Bobot</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      Belum ada materi terdaftar.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-forest-50/10 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-charcoal">{s.name}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{s.code}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100">
                          {s.qualification_code}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-charcoal">{s.weight}%</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700">
                          {s.status}
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
