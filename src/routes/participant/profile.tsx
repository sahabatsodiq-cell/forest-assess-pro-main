import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, ShieldCheck, Mail, Hash, Award, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/participant/profile")({
  component: ParticipantProfilePage,
});

function ParticipantProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [participantNumber, setParticipantNumber] = useState("");
  const [qualificationCode, setQualificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("askganis_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        setParticipantNumber(u.participant_number || "");
        setQualificationCode(u.qualification_code || "");
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name,
        email,
      };
      localStorage.setItem("askganis_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      toast.success("Profil Anda berhasil diperbarui!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <User className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Profil Pengguna
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Kelola informasi identitas akun peserta dan pengubahan kata sandi Anda.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm dark:bg-charcoal dark:border-charcoal/60">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border/40 dark:border-charcoal/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-white font-display text-xl font-bold dark:bg-forest-700">
              {name.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-charcoal dark:text-forest-100">{name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-extrabold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                  PESERTA ASESMEN
                </span>
                {qualificationCode && (
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                    {qualificationCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Nama Lengkap</label>
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
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Alamat Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Nomor Registrasi / NIK (Tetap)</label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  disabled
                  value={participantNumber || email}
                  className="w-full rounded-lg border border-border bg-gray-50 py-2 pl-9 pr-3 text-xs font-mono font-bold text-muted-foreground dark:bg-charcoal/60 dark:border-charcoal/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kualifikasi Utama</label>
              <div className="relative mt-1">
                <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  disabled
                  value={qualificationCode || "Terdaftar Sistem"}
                  className="w-full rounded-lg border border-border bg-gray-50 py-2 pl-9 pr-3 text-xs font-bold text-muted-foreground dark:bg-charcoal/60 dark:border-charcoal/60"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 dark:border-charcoal/60 space-y-4">
            <h3 className="font-display text-sm font-bold text-charcoal dark:text-forest-100 flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-forest-700 dark:text-forest-400" />
              Ubah Kata Sandi (Opsional)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Kata Sandi Baru</label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak diubah"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal/80 dark:text-forest-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal dark:text-forest-100">Konfirmasi Kata Sandi Baru</label>
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
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
            >
              <Save className="h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
