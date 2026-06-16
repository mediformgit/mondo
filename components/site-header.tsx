"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-ink-900/70 border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" aria-label="問道 MONDŌ ホーム">
          <span className="seal h-9 w-9 text-[20px] transition-transform duration-500 group-hover:rotate-[6deg]">
            問
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-paper">問道</span>
            <span className="font-mono text-[10px] tracking-[0.4em] text-paper-mute">MONDŌ</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative flex items-baseline gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? "text-paper" : "text-paper-dim hover:text-paper"
                }`}
              >
                <span className="font-display">{l.label}</span>
                <span className="font-mono text-[9px] tracking-widest text-paper-faint">{l.sub}</span>
                {active && (
                  <span className="absolute inset-x-4 -bottom-px h-px bg-shu" aria-hidden />
                )}
              </Link>
            );
          })}
          <Link href="/playground" className="btn btn-primary ml-3 !py-2 !px-5 text-sm">
            道場ではじめる
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="ring-shu relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          aria-label="メニュー"
          aria-expanded={open}
        >
          <div className="flex flex-col gap-[5px]">
            <span className={`h-px w-5 bg-paper transition-all ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-paper transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-5 bg-paper transition-all ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* mobile sheet */}
      <div
        className={`md:hidden overflow-hidden border-t border-line bg-ink-850/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="wrap flex flex-col gap-1 py-4">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-baseline justify-between rounded-lg px-3 py-3 text-paper-dim hover:bg-ink-700 hover:text-paper"
            >
              <span className="font-display text-lg">{l.label}</span>
              <span className="font-mono text-[10px] tracking-widest text-paper-faint">{l.sub}</span>
            </Link>
          ))}
          <Link href="/playground" className="btn btn-primary mt-2 justify-center">
            道場ではじめる
          </Link>
        </nav>
      </div>
    </header>
  );
}
