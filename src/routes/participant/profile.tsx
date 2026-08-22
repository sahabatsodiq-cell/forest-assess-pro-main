import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getParticipantProfileDetailsFn,
  updateParticipantProfileDetailsFn,
  addParticipantQualificationFn,
  removeParticipantQualificationFn,
} from "@/lib/services/examEngineService";
import { User, Mail, Hash, Award, KeyRound, Save, Plus, Trash2, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/profile")({
  component: ParticipantProfilePage,
});

function ParticipantProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [participantNumber, setParticipantNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Add Qualification Modal State
  const [addQualOpen, setAddQualOpen] = useState(false);
  const [selectedQualId, setSelectedQualId] = useState<string>("");
  const [addQualLoading, setAddQualLoading] = useState(false);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const res = await getParticipantProfileDetailsFn({ data: { token } });
      setProfileData(res);
      if (res?.user) {
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setParticipantNumber(res.user.participant_number || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Save Profile Info (Name, Registration Number, Password)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }

    setSaveLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateParticipantProfileDetailsFn({
        data: {
          token,
          name,
          participant_number: participantNumber,
          password: newPassword ? newPassword : undefined,
        },
      });

      if (res.success) {
        toast.success("Profil & Nomor Registrasi GANISPH Anda berhasil disimpan!");
        setNewPassword("");
        setConfirmPassword("");

        // Update local storage cached user
        const cachedUserStr = localStorage.getItem("askganis_user");
        if (cachedUserStr) {
          const u = JSON.parse(cachedUserStr);
          u.name = name;
          u.participant_number = participantNumber;
          localStorage.setItem("askganis_user", JSON.stringify(u));
        }

        loadData();
      } else {
        toast.error("Gagal memperbarui profil.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setSaveLoading(false);
    }
  };

  // 2. Add Qualification Handler
  const handleAddQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQualId) return;

    setAddQualLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await addParticipantQualificationFn({
        data: {
          token,
          qualification_id: Number(selectedQualId),
        },
      });

      if (res.success) {
        toast.success("Kualifikasi GANISPH baru berhasil ditambahkan!");
        setAddQualOpen(false);
        setSelectedQualId("");
        loadData();
      } else {
        toast.error("Gagal menambahkan kualifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setAddQualLoading(false);
    }
  };

  // 3. Remove Qualification Handler
  const handleRemoveQualification = async (qualId: number, code: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kualifikasi ${code} dari profil Anda?`)) return;

    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await removeParticipantQualificationFn({
        data: { token, qualification_id: qualId },
      });

      if (res.success) {
        toast.success(`Kualifikasi ${code} telah dihapus.`);
        loadData();
      } else {
        toast.error("Gagal menghapus kualifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-muted-foreground">Memuat profil peserta...</div>;
  }

  const user = profileData?.user;
  const userQualifications = Array.isArray(profileData?.qualifications) ? profileData.qualifications : [];
  const allQualifications = Array.isArray(profileData?.allQualifications) ? profileData.allQualifications : [];

  // Filter out qualifications user already owns
  const ownedQualIds = userQualifications.map((q: any) => q.id);
  const availableToSelect = allQualifications.filter((q: any) => !ownedQualIds.includes(q.id));

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header Title */}
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <User className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Profil & Kualifikasi GANISPH Saya
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Kelola data identitas, Nomor Registrasi, dan daftarkan Kualifikasi GANISPH milik Anda untuk asesmen kompetensi.
        </p>
      </div>

      {/* Main Profile Form Card */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar & Header Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-border/40 dark:border-charcoal/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-white font-display text-xl font-bold dark:bg-forest-700">
              {name.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100">{name}</h2>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                  PESERTA ASESMEN
                </span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300">
                  {participantNumber || "Belum Mengisi No. Registrasi"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                Nama Lengkap
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                Alamat Email (Akun Login)
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-lg border border-border bg-gray-50 py-2 pl-9 pr-3 text-xs text-muted-foreground dark:bg-charcoal/60 dark:border-charcoal/60"
                />
              </div>
            </div>

            {/* Nomor Registrasi GANISPH */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                Nomor Registrasi GANISPH / NIK Peserta
              </label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan Nomor Registrasi resmi (Contoh: REG-2026-GANIS-001)"
                  value={participantNumber}
                  onChange={(e) => setParticipantNumber(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground dark:text-forest-100/70">
                Nomor registrasi ini digunakan sebagai identitas dokumen sertifikasi asesmen kompetensi Anda.
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-4 border-t border-border/40 dark:border-charcoal/60 space-y-4">
            <h3 className="font-display text-sm font-bold text-charcoal dark:text-forest-100 flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-forest-700 dark:text-forest-400" />
              Ubah Kata Sandi Akun (Opsional)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak diubah"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-forest-700 disabled:opacity-50 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
            >
              <Save className="h-4 w-4" />
              {saveLoading ? "Menyimpan..." : "Simpan Profil & Nomor Registrasi"}
            </button>
          </div>
        </form>
      </div>

      {/* Kualifikasi GANISPH Dimiliki Section */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-5 dark:bg-charcoal dark:border-charcoal/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 dark:border-charcoal/60">
          <div>
            <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-forest-700 dark:text-forest-400" />
              Kualifikasi GANISPH Dimiliki
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground dark:text-forest-100/70">
              Daftar kualifikasi Tenaga Teknis Kehutanan yang terdaftar pada profil Anda untuk pengerjaan ujian asesmen.
            </p>
          </div>

          {/* Add Qualification Dialog */}
          <Dialog open={addQualOpen} onOpenChange={setAddQualOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-500">
                <Plus className="h-4 w-4" />
                Tambah Kualifikasi GANISPH
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
              <DialogHeader>
                <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
                  Tambah Kualifikasi GANISPH Ke Profil
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddQualification} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                    Pilih Kualifikasi GANISPH
                  </label>
                  <select
                    required
                    value={selectedQualId}
                    onChange={(e) => setSelectedQualId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                  >
                    <option value="">-- Pilih Kualifikasi --</option>
                    {availableToSelect.map((q: any) => (
                      <option key={q.id} value={q.id}>
                        {q.code} — {q.name}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[11px] text-muted-foreground dark:text-forest-100/70 leading-relaxed">
                  Pilihlah skema kualifikasi Tenaga Teknis Kehutanan yang Anda miliki agar sistem dapat mendaftarkan modul dan paket ujian asesmen kompetensi yang sesuai.
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddQualOpen(false)}
                    className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={addQualLoading || !selectedQualId}
                    className="flex-1 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700 dark:hover:bg-forest-500"
                  >
                    {addQualLoading ? "Menambahkan..." : "Tambahkan"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Qualifications List Table */}
        {userQualifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground dark:border-charcoal/60 dark:bg-charcoal/40">
            <Award className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Belum Ada Kualifikasi</h3>
            <p className="mt-1 text-xs">Anda belum menambahkan kualifikasi GANISPH ke profil Anda. Klik tombol <strong>"+ Tambah Kualifikasi GANISPH"</strong> di atas.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-white dark:bg-charcoal dark:border-charcoal/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/50 bg-forest-50/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:bg-charcoal/80 dark:border-charcoal/60 dark:text-forest-100/70">
                <tr>
                  <th scope="col" className="px-6 py-3.5 w-32">KODE</th>
                  <th scope="col" className="px-6 py-3.5">NAMA KUALIFIKASI</th>
                  <th scope="col" className="px-6 py-3.5">DESKRIPSI</th>
                  <th scope="col" className="px-6 py-3.5 text-center w-28">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-charcoal/60">
                {userQualifications.map((q: any) => (
                  <tr key={q.id} className="transition-colors hover:bg-forest-50/30 dark:hover:bg-charcoal/40">
                    <td className="px-6 py-4 font-mono font-black text-charcoal text-sm dark:text-forest-100">
                      <span className="rounded bg-forest-50 px-2 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                        {q.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-charcoal dark:text-forest-100">
                      {q.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground dark:text-forest-100/70 max-w-xs truncate">
                      {q.description || "Skema Sertifikasi Kompetensi GANISPH"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(q.id, q.code)}
                        title="Hapus Kualifikasi Dari Profil"
                        className="inline-flex items-center gap-1 rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-[11px] font-bold">Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
