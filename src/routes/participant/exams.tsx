import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getParticipantDashboardFn,
  getAvailableExamsFn,
  selfEnrollFn,
  startExamAttemptFn,
  submitExamRequestFn,
  getMyExamRequestsFn,
} from "@/lib/services/examEngineService";
import {
  GraduationCap,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  ListChecks,
  PlusCircle,
  Loader2,
  Send,
  ClipboardList,
  AlertCircle,
  CheckCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/participant/exams")({
  component: ParticipantExamsPage,
});

function ParticipantExamsPage() {
  const [data, setData] = useState<any>(null);
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled");

  // Modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedQualId, setSelectedQualId] = useState<number | null>(null);
  const [requestNotes, setRequestNotes] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const [dashRes, availRes, reqRes] = await Promise.all([
        getParticipantDashboardFn({ data: { token } }),
        getAvailableExamsFn({ data: { token } }),
        getMyExamRequestsFn({ data: { token } }),
      ]);
      setData(dashRes);
      setAvailableExams(availRes);
      setMyRequests(Array.isArray(reqRes) ? reqRes : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartExam = async (examId: number) => {
    setActionLoading(examId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await startExamAttemptFn({ data: { token, exam_id: examId } });
      if (res.success && res.attemptId) {
        navigate({ to: `/exam/${res.attemptId}` as any });
      } else {
        toast.error(res.error || "Gagal memulai sesi ujian.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelfEnroll = async (examId: number) => {
    setEnrollingId(examId);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await selfEnrollFn({ data: { token, exam_id: examId } });
      if (res.success) {
        toast.success("Berhasil mendaftar! Paket ujian kini tersedia di Ujian Saya.");
        await loadData();
        setActiveTab("enrolled");
      } else {
        toast.error(res.error || "Gagal mendaftar.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setEnrollingId(null);
    }
  };

  const openRequestModal = () => {
    const userQuals = data?.userQualifications || [];
    if (userQuals.length === 1) {
      setSelectedQualId(userQuals[0].qualification_id);
    } else {
      setSelectedQualId(null);
    }
    setRequestNotes("");
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedQualId) {
      toast.error("Pilih kualifikasi terlebih dahulu.");
      return;
    }
    setRequestLoading(true);
    const token = localStorage.getItem("askganis_token") || "";
    try {
      const res = await submitExamRequestFn({
        data: { token, qualification_id: selectedQualId, notes: requestNotes || undefined },
      });
      if (res.success) {
        toast.success(res.message || "Pengajuan berhasil dikirim.");
        setRequestModalOpen(false);
        await loadData();
        if (res.enrolled) {
          setActiveTab("enrolled");
        }
      } else {
        toast.error(res.error || "Gagal mengirim pengajuan.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-forest-700" />
        <span className="ml-2 text-xs text-muted-foreground">Memuat daftar ujian...</span>
      </div>
    );
  }

  const enrolledExams = Array.isArray(data?.enrolledExams) ? data.enrolledExams : [];
  const userQualifications = Array.isArray(data?.userQualifications) ? data.userQualifications : [];
  const pendingRequests = myRequests.filter((r: any) => r.status === "PENDING");
  const showDaftarkanSayaBtn = enrolledExams.length === 0 && availableExams.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal dark:text-forest-100 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-forest-700 dark:text-forest-400" />
          Ujian Kompetensi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
          Kelola pendaftaran dan ikuti paket ujian asesmen kompetensi sesuai kualifikasi Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border/50 bg-white p-1 shadow-sm dark:bg-charcoal dark:border-charcoal/60 w-fit">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            activeTab === "enrolled"
              ? "bg-forest-900 text-white shadow-sm dark:bg-forest-700"
              : "text-muted-foreground hover:text-charcoal dark:hover:text-forest-100"
          }`}
        >
          <ListChecks className="h-3.5 w-3.5" />
          Ujian Saya
          {enrolledExams.length > 0 && (
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
              activeTab === "enrolled" ? "bg-white/20 text-white" : "bg-forest-100 text-forest-900"
            }`}>
              {enrolledExams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            activeTab === "available"
              ? "bg-forest-900 text-white shadow-sm dark:bg-forest-700"
              : "text-muted-foreground hover:text-charcoal dark:hover:text-forest-100"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Paket Tersedia
          {availableExams.length > 0 && (
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
              activeTab === "available" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
            }`}>
              {availableExams.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================== */}
      {/* TAB: UJIAN SAYA (Enrolled) */}
      {/* ========================== */}
      {activeTab === "enrolled" && (
        <>
          {enrolledExams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center dark:border-charcoal/60 dark:bg-charcoal/40 space-y-4">
              <GraduationCap className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <div>
                <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Belum Ada Ujian Terdaftar</h3>
                <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/60">
                  Anda belum terdaftar pada paket ujian apapun.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                {availableExams.length > 0 && (
                  <button
                    onClick={() => setActiveTab("available")}
                    className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-700 transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Lihat {availableExams.length} Paket Tersedia
                  </button>
                )}

                {showDaftarkanSayaBtn && pendingRequests.length === 0 && (
                  <button
                    onClick={openRequestModal}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-forest-900 px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-forest-900 hover:text-white transition-all duration-200 dark:border-forest-500 dark:text-forest-300 dark:hover:bg-forest-700 dark:hover:text-white"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Daftarkan Saya
                  </button>
                )}
              </div>

              {/* Status Pengajuan */}
              {myRequests.length > 0 && (
                <div className="mt-2 space-y-2 max-w-md mx-auto text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status Pengajuan Saya</p>
                  {myRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs ${
                        req.status === "PENDING"
                          ? "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/50"
                          : req.status === "APPROVED"
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/50"
                          : "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {req.status === "PENDING" && <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                        {req.status === "APPROVED" && <CheckCheck className="h-3.5 w-3.5 text-green-600 shrink-0" />}
                        {req.status === "REJECTED" && <XCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />}
                        <div>
                          <p className="font-bold text-charcoal dark:text-forest-100">{req.qualification_code} — {req.qualification_name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {req.status === "PENDING" && "Menunggu persetujuan Admin"}
                            {req.status === "APPROVED" && `Disetujui${req.reviewed_by_name ? ` oleh ${req.reviewed_by_name}` : ""}`}
                            {req.status === "REJECTED" && `Ditolak${req.reviewed_by_name ? ` oleh ${req.reviewed_by_name}` : ""}`}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        req.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                        req.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {req.status === "PENDING" ? "MENUNGGU" : req.status === "APPROVED" ? "DISETUJUI" : "DITOLAK"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {enrolledExams.map((exam: any) => {
                const isSubmitted = exam.attempt_status === "SUBMITTED" || exam.attempt_status === "AUTO_SUBMITTED";
                const isInProgress = exam.attempt_status === "IN_PROGRESS";

                return (
                  <div
                    key={exam.id}
                    className="rounded-xl border border-border/60 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 dark:bg-charcoal dark:border-charcoal/60"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                          {exam.qualification_code}
                        </span>
                        {isSubmitted ? (
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[9px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            SELESAI
                          </span>
                        ) : isInProgress ? (
                          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[9px] font-bold text-amber-700 animate-pulse dark:bg-amber-950/40 dark:text-amber-300">
                            BERLANGSUNG
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                            SIAP DIMULAI
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-base font-bold text-charcoal dark:text-forest-100">{exam.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
                        {exam.instructions || "Ikuti petunjuk pengerjaan dengan teliti."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs dark:bg-charcoal/60 dark:border-charcoal/60">
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70 flex items-center justify-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> DURASI
                        </div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.duration_minutes} Mnt</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">SOAL</div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.total_questions}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">NILAI LULUS</div>
                        <div className="font-bold text-forest-900 dark:text-forest-300">{exam.passing_grade}</div>
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-3 dark:border-charcoal/60">
                      {isSubmitted ? (
                        <Link
                          to={`/results/${exam.attempt_id}` as any}
                          className="w-full block text-center rounded-lg border border-forest-900 bg-white py-2 text-xs font-semibold text-forest-900 hover:bg-forest-50 transition-colors dark:bg-charcoal dark:border-forest-700 dark:text-forest-100 dark:hover:bg-charcoal/60"
                        >
                          Lihat Hasil Ujian (Skor: {exam.attempt_score})
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          disabled={actionLoading === exam.id}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 transition-colors dark:bg-forest-700 dark:hover:bg-forest-500"
                        >
                          {actionLoading === exam.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          {actionLoading === exam.id ? "Menyiapkan..." : isInProgress ? "Lanjutkan Ujian" : "Mulai Ujian"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ============================= */}
      {/* TAB: PAKET TERSEDIA (Available) */}
      {/* ============================= */}
      {activeTab === "available" && (
        <>
          {availableExams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center dark:border-charcoal/60 dark:bg-charcoal/40 space-y-4">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <div>
                <h3 className="font-bold text-sm text-charcoal dark:text-forest-100">Tidak Ada Paket Tersedia</h3>
                <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/60">
                  Semua paket ujian yang sesuai kualifikasi Anda sudah terdaftar, atau belum ada paket yang dipublikasikan.
                </p>
              </div>

              {showDaftarkanSayaBtn && pendingRequests.length === 0 && (
                <button
                  onClick={openRequestModal}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-forest-900 px-4 py-2 text-xs font-semibold text-forest-900 hover:bg-forest-900 hover:text-white transition-all duration-200 dark:border-forest-500 dark:text-forest-300 dark:hover:bg-forest-700 dark:hover:text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  Daftarkan Saya
                </button>
              )}

              {pendingRequests.length > 0 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/50 dark:text-amber-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Pengajuan Anda sedang ditinjau oleh Admin
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 flex items-start gap-2 dark:bg-amber-950/20 dark:border-amber-800/50">
                <PlusCircle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0 dark:text-amber-400" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Paket di bawah ini sesuai dengan kualifikasi Anda.</strong> Klik tombol "Daftar Sekarang" untuk mendaftarkan diri dan mulai mengerjakan ujian.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {availableExams.map((exam: any) => (
                  <div
                    key={exam.id}
                    className="rounded-xl border border-border/60 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 dark:bg-charcoal dark:border-charcoal/60"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-100 dark:border-forest-700/50">
                          {exam.qualification_code}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50">
                          TERSEDIA
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-base font-bold text-charcoal dark:text-forest-100">{exam.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground dark:text-forest-100/70">
                        {exam.instructions || "Ikuti petunjuk pengerjaan dengan teliti."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-forest-50/10 p-3 text-center border border-border/30 text-xs dark:bg-charcoal/60 dark:border-charcoal/60">
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70 flex items-center justify-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> DURASI
                        </div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.duration_minutes} Mnt</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">SOAL</div>
                        <div className="font-bold text-charcoal dark:text-forest-100">{exam.total_questions}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-muted-foreground dark:text-forest-100/70">NILAI LULUS</div>
                        <div className="font-bold text-forest-900 dark:text-forest-300">{exam.passing_grade}</div>
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-3 dark:border-charcoal/60">
                      <button
                        onClick={() => handleSelfEnroll(exam.id)}
                        disabled={enrollingId === exam.id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-forest-900 bg-transparent py-2.5 text-xs font-bold text-forest-900 hover:bg-forest-900 hover:text-white disabled:opacity-50 transition-all duration-200 dark:border-forest-500 dark:text-forest-300 dark:hover:bg-forest-700 dark:hover:text-white"
                      >
                        {enrollingId === exam.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mendaftarkan...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4" />
                            Daftar Sekarang
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ============================= */}
      {/* MODAL: DAFTARKAN SAYA        */}
      {/* ============================= */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-charcoal dark:border-charcoal/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-charcoal dark:text-forest-100">
              <ClipboardList className="h-5 w-5 text-forest-700" />
              Ajukan Pendaftaran Ujian
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground dark:text-forest-100/70 leading-relaxed mt-1">
            Pilih kualifikasi yang ingin diujikan. Jika paket ujian belum tersedia, Admin akan meninjau pengajuan Anda dan memproses pendaftaran.
          </p>

          {userQualifications.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/50 dark:text-amber-300">
              Kualifikasi Anda belum terdaftar di sistem. Hubungi Admin untuk memperbarui data.
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pilih Kualifikasi</p>
              {userQualifications.map((uq: any) => {
                const alreadyPending = myRequests.some(
                  (r: any) => r.qualification_id === uq.qualification_id && r.status === "PENDING"
                );
                const alreadyApproved = myRequests.some(
                  (r: any) => r.qualification_id === uq.qualification_id && r.status === "APPROVED"
                );

                return (
                  <label
                    key={uq.qualification_id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                      alreadyPending || alreadyApproved
                        ? "opacity-50 cursor-not-allowed border-border bg-gray-50 dark:bg-charcoal/40"
                        : selectedQualId === uq.qualification_id
                        ? "border-forest-900 bg-forest-50 dark:border-forest-500 dark:bg-forest-900/20"
                        : "border-border hover:border-forest-400 bg-white dark:bg-charcoal dark:border-charcoal/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="qualification"
                      value={uq.qualification_id}
                      disabled={alreadyPending || alreadyApproved}
                      checked={selectedQualId === uq.qualification_id}
                      onChange={() => setSelectedQualId(uq.qualification_id)}
                      className="h-4 w-4 text-forest-900 border-border focus:ring-forest-900"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-charcoal dark:text-forest-100 flex items-center gap-2">
                        <span className="rounded bg-forest-50 px-1.5 py-0.5 text-[10px] font-black text-forest-900 border border-forest-100 dark:bg-forest-900/40 dark:text-forest-200">
                          {uq.code}
                        </span>
                        {uq.name}
                      </p>
                      {(alreadyPending || alreadyApproved) && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                          {alreadyPending ? "Sudah ada pengajuan menunggu" : "Sudah disetujui"}
                        </p>
                      )}
                    </div>
                    {alreadyPending && <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                    {alreadyApproved && <CheckCheck className="h-4 w-4 text-green-500 shrink-0" />}
                  </label>
                );
              })}
            </div>
          )}

          {userQualifications.length > 0 && (
            <div className="mt-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Catatan (Opsional)
              </label>
              <textarea
                rows={2}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Contoh: Mohon dijadwalkan bulan ini..."
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-charcoal focus:border-forest-900 focus:ring-1 focus:ring-forest-900 focus:outline-none resize-none dark:bg-charcoal dark:border-charcoal/60 dark:text-forest-100"
              />
            </div>
          )}

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:text-forest-100 dark:hover:bg-charcoal/60"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmitRequest}
              disabled={requestLoading || !selectedQualId || userQualifications.length === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2 text-xs font-semibold text-white hover:bg-forest-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              {requestLoading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengirim...</>
              ) : (
                <><Send className="h-3.5 w-3.5" /> Kirim Pengajuan</>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
