import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="seal h-10 w-10 text-[22px]">問</span>
            <div className="leading-none">
              <div className="font-display text-xl font-semibold text-paper">問道</div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-paper-mute">MONDŌ</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper-mute text-pretty">
            問いを立てる力は、文系・理系を分けない。生成AIを“使われる側”で終わらせないための、
            誰にでも開かれた無料の学び。
          </p>
          <p className="mt-4 font-mono text-xs text-paper-faint">{site.taglineEn}</p>
        </div>

        <div>
          <div className="kicker mb-4">Explore</div>
          <ul className="space-y-2.5">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="ulink text-sm text-paper-dim hover:text-paper">
                  {l.label} <span className="text-paper-faint">{l.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="kicker mb-4">原則</div>
          <ul className="space-y-2.5 text-sm text-paper-dim">
            <li>永久に無料</li>
            <li>登録不要・広告なし</li>
            <li>文理を問わない</li>
            <li>あなたの鍵はあなたの手元に</li>
          </ul>
        </div>
      </div>

      <div className="wrap flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-xs text-paper-faint md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} 問道 MONDŌ — 知は、独占されてはならない。</p>
        <p className="font-mono">made with 問 · for everyone</p>
      </div>
    </footer>
  );
}
