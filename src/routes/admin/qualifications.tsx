import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getQualificationsFn, createQualificationFn, updateQualificationFn } from "@/lib/services/adminService";
import { Award, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/qualifications")({
  component: AdminQualificationsPage,
});

function AdminQualificationsPage() {
  const [qualifications, setQualifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const qData = await getQualificationsFn({ data: { token } });
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
    setFormLoading(true);
    setFormError(null);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await createQualificationFn({
        data: { token, code, name, description },
      });

      if (res.success) {
        setOpen(false);
        setCode("");
        setName("");
        setDescription("");
        loadData();
      } else {
        setFormError(res.error || "Gagal membuat kualifikasi.");
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = qualifications.filter(
    (q) => q.code.toLowerCase().includes(search.toLowerCase()) || q.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-charcoal">Master Kualifikasi</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola skema kualifikasi tenaga teknis kehutanan secara dinamis tanpa mengubah source code.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700">
              <Plus className="h-4 w-4" />
              Tambah Kualifikasi
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold text-charcoal">
                Tambah Kualifikasi Baru
              </DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Kode Kualifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: GANHUT-I"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs font-mono focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Nama Kualifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="Nama resmi kualifikasi..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-1.5 text-xs focus:border-forest-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal">Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan cakupan kualifikasi..."
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
                {formLoading ? "Menyimpan..." : "Simpan Kualifikasi"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kode atau nama kualifikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-1.5 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Memuat kualifikasi...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">Tidak ada kualifikasi ditemukan.</div>
        ) : (
          filtered.map((q) => (
            <div key={q.id} className="rounded-xl border border-border/60 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100">
                  {q.code}
                </span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700">
                  {q.status}
                </span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-charcoal">{q.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{q.description || "Tidak ada deskripsi."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
