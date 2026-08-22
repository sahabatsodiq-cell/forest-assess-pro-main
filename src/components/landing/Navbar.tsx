import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Fitur", href: "#fitur" },
  { label: "Kualifikasi", href: "#kualifikasi" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/50"
          : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1248px] items-center justify-between px-6 lg:h-[72px] lg:px-10"
        aria-label="Navigasi utama"
      >
        <a
          href="#beranda"
          className="font-display text-lg font-extrabold tracking-tight text-forest-900"
          aria-label="AskGanisPH — Kembali ke beranda"
        >
          ASKGANISPH
        </a>

        <div className="hidden items-center gap-8 lg:flex" role="list">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="listitem"
              className="text-sm font-medium text-charcoal/70 transition-colors hover:text-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#masuk"
            className="hidden rounded-lg bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 lg:inline-flex"
          >
            Masuk Platform
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-charcoal transition-colors hover:bg-forest-50 lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white p-0">
              <nav
                className="flex flex-col px-6 pt-14 pb-6"
                aria-label="Menu navigasi mobile"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border/30 py-4 text-base font-medium text-charcoal transition-colors hover:text-forest-900"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#masuk"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-lg bg-forest-900 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-700"
                >
                  Masuk Platform
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
