export function Footer() {
  return (
    <footer className="bg-charcoal text-white/60 py-12 md:py-16 border-t border-white/5" aria-label="Footer platform">
      <div className="mx-auto max-w-[1248px] px-6 lg:px-10">
        
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5 lg:gap-12">
          
          {/* Brand block */}
          <div className="md:col-span-2">
            <a
              href="#beranda"
              className="font-display text-lg font-extrabold tracking-tight text-white"
            >
              ASKGANISPH
            </a>
            <p className="mt-3 text-xs leading-relaxed max-w-sm text-white/50">
              Platform Asesmen Kompetensi Tenaga Teknis Kehutanan secara digital, modern, terstruktur, dan terdokumentasi.
            </p>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">Navigasi</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#kualifikasi" className="hover:text-white transition-colors">Kualifikasi</a></li>
              <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">Produk</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><span className="text-white/40">Ujian Online</span></li>
              <li><span className="text-white/40">Bank Soal</span></li>
              <li><span className="text-white/40">Paket Ujian</span></li>
              <li><span className="text-white/40">Hasil Evaluasi</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-4">Informasi</h4>
            <ul className="space-y-2 text-xs" role="list">
              <li><span className="text-white/40">Kebijakan Privasi</span></li>
              <li><span className="text-white/40">Ketentuan Penggunaan</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© 2026 AskGanisPH. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Dirancang untuk Kredibilitas Asesmen</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
