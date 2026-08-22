import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, Award, ClipboardList, CheckCircle2, 
  Search, Plus, Filter, Play, Check, X, AlertCircle
} from "lucide-react";

export function PlatformPreview() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24" aria-labelledby="preview-heading">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-forest-700">Demo Platform</p>
          <h2
            id="preview-heading"
            className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-charcoal md:text-4xl"
          >
            Dirancang untuk bekerja, bukan sekadar terlihat bagus.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Intip bagaimana AskGanisPH mempermudah administrasi asesmen Anda melalui antarmuka modern yang ramah pengguna.
          </p>
        </div>

        {/* Tabs container */}
        <div className="mt-12" aria-hidden="true">
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-forest-50 border border-forest-100 p-1 flex flex-wrap h-auto gap-1">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-forest-900 data-[state=active]:text-white text-charcoal/80 font-semibold text-xs py-2 px-4 rounded-md">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="bank-soal" className="data-[state=active]:bg-forest-900 data-[state=active]:text-white text-charcoal/80 font-semibold text-xs py-2 px-4 rounded-md">
                  Bank Soal
                </TabsTrigger>
                <TabsTrigger value="ujian" className="data-[state=active]:bg-forest-900 data-[state=active]:text-white text-charcoal/80 font-semibold text-xs py-2 px-4 rounded-md">
                  Exam Builder
                </TabsTrigger>
                <TabsTrigger value="peserta" className="data-[state=active]:bg-forest-900 data-[state=active]:text-white text-charcoal/80 font-semibold text-xs py-2 px-4 rounded-md">
                  Peserta
                </TabsTrigger>
                <TabsTrigger value="hasil" className="data-[state=active]:bg-forest-900 data-[state=active]:text-white text-charcoal/80 font-semibold text-xs py-2 px-4 rounded-md">
                  Hasil
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Content Mockup */}
            <TabsContent value="dashboard">
              <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
                <div className="border-b border-border/40 bg-forest-50/10 px-5 py-4">
                  <h4 className="font-display text-sm font-bold text-charcoal">Ringkasan Asesmen</h4>
                </div>
                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-border/40 p-4 bg-white">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Total Peserta</span>
                        <Users className="h-4 w-4 text-forest-700" />
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-charcoal">124</div>
                      <div className="mt-1 text-[9px] text-forest-700 font-semibold">↑ 12 baru minggu ini</div>
                    </div>
                    <div className="rounded-lg border border-border/40 p-4 bg-white">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Kualifikasi Aktif</span>
                        <Award className="h-4 w-4 text-forest-700" />
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-charcoal">9</div>
                      <div className="mt-1 text-[9px] text-muted-foreground font-semibold">Skema kehutanan</div>
                    </div>
                    <div className="rounded-lg border border-border/40 p-4 bg-white">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Paket Ujian</span>
                        <ClipboardList className="h-4 w-4 text-forest-700" />
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-charcoal">18</div>
                      <div className="mt-1 text-[9px] text-forest-700 font-semibold">8 draf aktif</div>
                    </div>
                    <div className="rounded-lg border border-border/40 p-4 bg-white">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Ujian Berlangsung</span>
                        <Play className="h-4 w-4 text-forest-700 animate-pulse" />
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-charcoal">3</div>
                      <div className="mt-1 text-[9px] text-forest-700 font-semibold">42 peserta online</div>
                    </div>
                  </div>

                  {/* Recent activities list */}
                  <div className="mt-6">
                    <h5 className="font-display text-xs font-bold text-charcoal mb-4">Aktivitas Terkini</h5>
                    <div className="space-y-3">
                      {[
                        { time: "10 menit lalu", user: "Budi Santoso", action: "Menyelesaikan ujian CANHUT", score: "Skor: 84 (Lulus)" },
                        { time: "30 menit lalu", user: "Admin", action: "Mengimpor 50 bank soal baru ke skema PKB", score: "" },
                        { time: "1 jam lalu", user: "Siti Rahma", action: "Memulai attempt ujian BINHUT", score: "Status: Berlangsung" },
                      ].map((act, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0 last:pb-0 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-forest-700" />
                            <div>
                              <span className="font-bold text-charcoal">{act.user}</span>
                              <span className="text-muted-foreground"> {act.action}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground block">{act.time}</span>
                            {act.score && <span className="text-[10px] font-bold text-forest-900">{act.score}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Bank Soal Content Mockup */}
            <TabsContent value="bank-soal">
              <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
                <div className="border-b border-border/40 bg-forest-50/10 px-5 py-4 flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-charcoal">Bank Soal Terstruktur</h4>
                  <button className="inline-flex items-center gap-1 bg-forest-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-forest-700">
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Soal
                  </button>
                </div>
                <div className="p-5 border-b border-border/30 bg-forest-50/20 flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Cari bank soal..." className="w-full text-xs rounded-md border border-border bg-white py-1.5 pl-8 pr-3 focus:outline-none" disabled />
                  </div>
                  <button className="inline-flex items-center gap-1 bg-white border border-border text-charcoal text-xs font-semibold py-1.5 px-3 rounded-md">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    Filter: Semua Kualifikasi
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 w-12 text-center">No</th>
                        <th className="px-4 py-3">Pertanyaan</th>
                        <th className="px-4 py-3 w-28">Kualifikasi</th>
                        <th className="px-4 py-3 w-28">Materi</th>
                        <th className="px-4 py-3 w-24">Tingkat Kesulitan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {[
                        { id: 1, text: "Inventarisasi hutan meliputi kegiatan...", code: "CANHUT", topic: "Inventarisasi", level: "Medium" },
                        { id: 2, text: "Pengukuran diameter setinggi dada pohon...", code: "CANHUT", topic: "Pengukuran", level: "Easy" },
                        { id: 3, text: "Aturan keselamatan kerja pemanenan...", code: "NENHUT", topic: "K3", level: "Hard" },
                      ].map((item) => (
                        <tr key={item.id}>
                          <td className="px-5 py-3 text-center text-muted-foreground font-mono">{item.id}</td>
                          <td className="px-4 py-3 font-semibold text-charcoal truncate max-w-[200px]">{item.text}</td>
                          <td className="px-4 py-3"><span className="bg-forest-50 border border-forest-100 text-forest-900 font-bold px-2 py-0.5 rounded text-[10px]">{item.code}</span></td>
                          <td className="px-4 py-3 text-muted-foreground">{item.topic}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.level === 'Easy' ? 'bg-blue-50 text-blue-700' :
                              item.level === 'Medium' ? 'bg-orange-50 text-orange-700' :
                              'bg-red-50 text-red-700'
                            }`}>{item.level}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Exam Builder Content Mockup */}
            <TabsContent value="ujian">
              <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
                <div className="border-b border-border/40 bg-forest-50/10 px-5 py-4">
                  <h4 className="font-display text-sm font-bold text-charcoal">Penyusunan Paket Ujian (Exam Builder)</h4>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nama Paket Ujian</label>
                      <input type="text" value="Ujian Teori Utama CANHUT Semester 2" className="mt-1 w-full text-xs rounded-md border border-border bg-white px-3 py-2 font-medium" disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kualifikasi</label>
                        <select className="mt-1 w-full text-xs rounded-md border border-border bg-white px-3 py-2 font-medium" disabled>
                          <option>CANHUT</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Durasi Ujian</label>
                        <input type="text" value="60 Menit" className="mt-1 w-full text-xs rounded-md border border-border bg-white px-3 py-2 font-medium" disabled />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Passing Grade (%)</label>
                        <input type="text" value="70" className="mt-1 w-full text-xs rounded-md border border-border bg-white px-3 py-2 font-medium" disabled />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Soal</label>
                        <input type="text" value="50 Soal" className="mt-1 w-full text-xs rounded-md border border-border bg-white px-3 py-2 font-medium" disabled />
                      </div>
                    </div>
                  </div>

                  {/* Blueprint Summary */}
                  <div className="rounded-lg border border-border/40 p-4 bg-forest-50/5">
                    <h5 className="font-display text-xs font-bold text-charcoal mb-3">Distribusi Blueprint Soal</h5>
                    <div className="space-y-2 text-xs">
                      {[
                        { topic: "Pengenalan Inventarisasi", count: "15 Soal", percent: "30%" },
                        { topic: "Pengukuran & Pemetaan", count: "20 Soal", percent: "40%" },
                        { topic: "Silvikultur & Pembinaan", count: "10 Soal", percent: "20%" },
                        { topic: "K3 Kehutanan", count: "5 Soal", percent: "10%" },
                      ].map((bp, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">{bp.topic}</span>
                          <span className="font-bold text-forest-900">{bp.count} ({bp.percent})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Peserta Content Mockup */}
            <TabsContent value="peserta">
              <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
                <div className="border-b border-border/40 bg-forest-50/10 px-5 py-4">
                  <h4 className="font-display text-sm font-bold text-charcoal">Manajemen Peserta</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3">Nama</th>
                        <th className="px-4 py-3">No. Registrasi</th>
                        <th className="px-4 py-3">Kualifikasi</th>
                        <th className="px-4 py-3">Sesi Ujian</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {[
                        { name: "Budi Santoso", reg: "REG-2026-001", code: "CANHUT", session: "Sesi Pagi - Ruang 1", status: "Selesai" },
                        { name: "Siti Rahma", reg: "REG-2026-002", code: "BINHUT", session: "Sesi Pagi - Ruang 1", status: "Sedang Ujian" },
                        { name: "Joko Widodo", reg: "REG-2026-003", code: "PKB", session: "Sesi Siang - Ruang 2", status: "Belum Mulai" },
                      ].map((p, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3.5 font-bold text-charcoal">{p.name}</td>
                          <td className="px-4 py-3.5 font-mono text-muted-foreground">{p.reg}</td>
                          <td className="px-4 py-3.5"><span className="bg-forest-50 border border-forest-100 text-forest-900 font-bold px-2 py-0.5 rounded text-[10px]">{p.code}</span></td>
                          <td className="px-4 py-3.5 text-muted-foreground">{p.session}</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              p.status === 'Selesai' ? 'bg-green-50 text-green-700' :
                              p.status === 'Sedang Ujian' ? 'bg-amber-50 text-amber-700 animate-pulse' :
                              'bg-gray-50 text-gray-700'
                            }`}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Hasil Content Mockup */}
            <TabsContent value="hasil">
              <div className="rounded-xl border border-border/60 bg-white shadow-xl overflow-hidden">
                <div className="border-b border-border/40 bg-forest-50/10 px-5 py-4">
                  <h4 className="font-display text-sm font-bold text-charcoal">Hasil Evaluasi & Laporan</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3">Nama Peserta</th>
                        <th className="px-4 py-3">Kualifikasi</th>
                        <th className="px-4 py-3">Jumlah Soal</th>
                        <th className="px-4 py-3">Skor Akhir</th>
                        <th className="px-4 py-3">Kelulusan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {[
                        { name: "Budi Santoso", code: "CANHUT", count: "50 Soal", score: 84, status: "Lulus" },
                        { name: "Siti Rahma", code: "BINHUT", count: "40 Soal", score: 78, status: "Lulus" },
                        { name: "Joko Widodo", code: "PKB", count: "50 Soal", score: 62, status: "Tidak Lulus" },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3.5 font-bold text-charcoal">{r.name}</td>
                          <td className="px-4 py-3.5"><span className="bg-forest-50 border border-forest-100 text-forest-900 font-bold px-2 py-0.5 rounded text-[10px]">{r.code}</span></td>
                          <td className="px-4 py-3.5 text-muted-foreground">{r.count}</td>
                          <td className="px-4 py-3.5 font-mono font-bold text-charcoal">{r.score}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              r.status === 'Lulus' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {r.status === 'Lulus' ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </section>
  );
}
