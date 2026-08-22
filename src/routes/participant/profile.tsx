import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getParticipantProfileDetailsFn,
  updateParticipantProfileDetailsFn,
  addParticipantQualificationFn,
  updateParticipantQualificationRegNoFn,
  removeParticipantQualificationFn,
} from "@/lib/services/examEngineService";
import { User, Mail, Hash, Award, KeyRound, Save, Plus, Trash2, Check, Edit2, ShieldCheck } from "lucide-react";
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
  const [participantNumber, setParticipantNumber] = useState(""); // NIK / Nomor KTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Add Qualification Modal State
  const [addQualOpen, setAddQualOpen] = useState(false);
  const [selectedQualId, setSelectedQualId] = useState<string>("");
  const [newQualRegNo, setNewQualRegNo] = useState<string>("");
  const [addQualLoading, setAddQualLoading] = useState(false);

  // Edit Qualification Registration Number Modal State
  const [editQualOpen, setEditQualOpen] = useState(false);
  const [editQualItem, setEditQualItem] = useState<any>(null);
  const [editRegNoValue, setEditRegNoValue] = useState("");
  const [editRegNoLoading, setEditRegNoLoading] = useState(false);

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

  // 1. Save Profile Info (Name, NIK / Nomor KTP, Password)
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
        toast.success("Profil & Nomor KTP/NIK Anda berhasil disimpan!");
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
          registration_number: newQualRegNo.trim() ? newQualRegNo.trim() : undefined,
        },
      });

      if (res.success) {
        toast.success("Kualifikasi GANISPH & Nomor Register berhasil ditambahkan!");
        setAddQualOpen(false);
        setSelectedQualId("");
        setNewQualRegNo("");
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

  // 3. Edit Qualification Registration Number Handler
  const openEditRegNoModal = (qItem: any) => {
    setEditQualItem(qItem);
    setEditRegNoValue(qItem.registration_number || "");
    setEditQualOpen(true);
  };

  const handleUpdateQualRegNo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQualItem) return;

    setEditRegNoLoading(true);
    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await updateParticipantQualificationRegNoFn({
        data: {
          token,
          qualification_id: editQualItem.qualification_id,
          registration_number: editRegNoValue,
        },
      });

      if (res.success) {
        toast.success("Nomor Register GANISPH berhasil diperbarui!");
        setEditQualOpen(false);
        setEditQualItem(null);
        loadData();
      } else {
        toast.error("Gagal memperbarui nomor register.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEditRegNoLoading(false);
    }
  };

  // 4. Remove Qualification Handler
  const handleRemoveQualification = async (qualId: number, code: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kualifikasi ${code} dari profil Anda?`)) return;

    const token = localStorage.getItem("askganis_token") || "";

    try {
      const res = await removeParticipantQualificationFn({
        data: { token, qualification_id: qualId },
      });

      if (res.success) {
        toast.success(`Kualifikasi ${code} berhasil dihapus dari profil.`);
        loadData();
      } else {
        toast.error("Gagal menghapus kualifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Memuat data profil peserta...
      </div>
    );
  }

  const userQualifications = profileData?.qualifications || [];
  const allQualifications = profileData?.allQualifications || [];

  // Filter qualifications already added
  const existingQualIds = userQualifications.map((q: any) => q.qualification_id || q.id);
  const availableToSelect = allQualifications.filter(
    (q: any) => !existingQualIds.includes(q.id)
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header Card */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-white font-display text-xl font-bold dark:bg-forest-700">
            {name ? name.charAt(0).toUpperCase() : "P"}
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-charcoal dark:text-forest-100">
              {name || "Peserta Asesmen"}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground dark:text-forest-100/70">
              <span className="rounded bg-forest-50 px-2 py-0.5 text-[11px] font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                PESERTA ASESMEN
              </span>
              {participantNumber && (
                <span className="font-mono font-bold text-charcoal dark:text-forest-100 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                  NIK: {participantNumber}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-6 dark:bg-charcoal dark:border-charcoal/60">
        <div className="border-b border-border/40 pb-4 dark:border-charcoal/60">
          <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
            <User className="h-5 w-5 text-forest-700 dark:text-forest-400" />
            Informasi Diri & Identitas Peserta
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground dark:text-forest-100/70">
            Perbarui data diri, Nomor KTP / NIK, dan kata sandi akun Anda.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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

            {/* Nomor KTP / NIK */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                Nomor KTP / NIK Peserta
              </label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="6371xxxxxxxxxxxx (Nomor KTP / NIK 16 digit)"
                  value={participantNumber}
                  onChange={(e) => setParticipantNumber(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground dark:text-forest-100/70">
                Nomor KTP / NIK ini digunakan sebagai identitas resmi peserta pada dokumen sertifikasi asesmen kompetensi Anda.
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
              {saveLoading ? "Menyimpan..." : "Simpan Profil & NIK"}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Registration Number Modal */}
      <Dialog open={editQualOpen} onOpenChange={setEditQualOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-charcoal dark:text-forest-100">
              Edit Nomor Register GANISPH
            </DialogTitle>
          </DialogHeader>

          {editQualItem && (
            <form onSubmit={handleUpdateQualRegNo} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                  Kualifikasi GANISPH
                </label>
                <div className="mt-1 text-xs font-bold text-forest-900 bg-forest-50 p-2 rounded border border-forest-100">
                  {editQualItem.code} — {editQualItem.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                  Nomor Register GANISPH
                </label>
                <input
                  type="text"
                  required
                  placeholder="04200000783"
                  value={editRegNoValue}
                  onChange={(e) => setEditRegNoValue(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditQualOpen(false)}
                  className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editRegNoLoading}
                  className="flex-1 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 dark:bg-forest-700"
                >
                  {editRegNoLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Kualifikasi GANISPH Dimiliki Section */}
      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm space-y-5 dark:bg-charcoal dark:border-charcoal/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 dark:border-charcoal/60">
          <div>
            <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-forest-700 dark:text-forest-400" />
              Kualifikasi GANISPH Dimiliki
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground dark:text-forest-100/70">
              Daftar kualifikasi Tenaga Teknis Kehutanan dan Nomor Register masing-masing yang terdaftar pada profil Anda.
            </p>
          </div>

          {/* Add Qualification Dialog */}
          <Dialog open={addQualOpen} onOpenChange={setAddQualOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={() => setAddQualOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-forest-700 cursor-pointer dark:bg-forest-700 dark:hover:bg-forest-500"
              >
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
                    className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100 font-bold"
                  >
                    <option value="">-- Pilih Kualifikasi GANISPH --</option>
                    {(availableToSelect.length > 0 ? availableToSelect : allQualifications).map((q: any) => (
                      <option key={q.id} value={q.id}>
                        {q.code} — {q.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">
                    Nomor Register GANISPH
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 04200000783"
                    value={newQualRegNo}
                    onChange={(e) => setNewQualRegNo(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-xs font-mono font-bold focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                  />
                </div>

                <p className="text-[11px] text-muted-foreground dark:text-forest-100/70 leading-relaxed">
                  Pilihlah skema kualifikasi Tenaga Teknis Kehutanan dan sertakan Nomor Register resminya agar sistem mendaftarkan paket ujian yang sesuai.
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
                  <th scope="col" className="px-6 py-3.5 w-16">NO</th>
                  <th scope="col" className="px-6 py-3.5">KUALIFIKASI GANISPH</th>
                  <th scope="col" className="px-6 py-3.5">NOMOR REGISTER GANISPH</th>
                  <th scope="col" className="px-6 py-3.5 text-right w-36">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-charcoal/60">
                {userQualifications.map((q: any, idx: number) => (
                  <tr key={q.qualification_id || q.id} className="transition-colors hover:bg-forest-50/30 dark:hover:bg-charcoal/40">
                    <td className="px-6 py-4 font-mono font-bold text-muted-foreground">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
                        <span className="rounded bg-forest-50 px-2 py-0.5 text-xs font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                          {q.code}
                        </span>
                        <span>{q.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-extrabold text-forest-900 dark:text-forest-400 text-sm">
                      {q.registration_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditRegNoModal(q)}
                          title="Edit Nomor Register"
                          className="inline-flex items-center gap-1 rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-950/40 font-bold"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit No. Reg</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQualification(q.qualification_id || q.id, q.code)}
                          title="Hapus Kualifikasi Dari Profil"
                          className="inline-flex items-center gap-1 rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:bg-red-950/40 font-bold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
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
