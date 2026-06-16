import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { patterns } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "型 — プロンプトのパターン・ライブラリ",
  description:
    "役割・例示・段階思考・出力形式・制約・自己検証・視点転換・分割・反復。再現性のある9つの型を、テンプレートと実例つきで。困ったら辞書のように引ける。",
};

const levelColor: Record<string, string> = {
  基本: "text-shu border-shu/40",
  応用: "text-ai border-ai/40",
  達人: "text-kin border-kin/40",
};

export default function PatternsPage() {
  return (
    <div className="wrap pt-28 pb-10 md:pt-36">
      <header className="mb-14 max-w-3xl">
        <div className="kicker mb-4">型 · Patterns</div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-paper md:text-6xl">
          再現性は、
          <br />
          型から生まれる。
        </h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-paper-dim">
          達人の動きには型がある。AI活用も同じ。暗記する必要はない——困ったとき、
          ここを辞書のように引けばいい。それぞれに<strong className="text-paper">テンプレート</strong>と
          <strong className="text-paper">実例</strong>、そして道場で試すボタンを添えた。
        </p>
      </header>

      {/* index */}
      <Reveal>
        <div className="mb-14 flex flex-wrap gap-2">
          {patterns.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-paper-dim transition-colors hover:border-shu/50 hover:text-paper"
            >
              <span className="font-display text-shu">{p.kanji}</span>
              {p.name}
            </a>
          ))}
        </div>
      </Reveal>

      <div className="space-y-6">
        {patterns.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.05}>
            <section id={p.id} className="card grain-card scroll-mt-28 p-7 md:p-9">
              <div className="grid gap-7 md:grid-cols-[180px_1fr]">
                <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
                  <span className="seal h-16 w-16 text-4xl">{p.kanji}</span>
                  <div>
                    <h2 className="font-display text-2xl text-paper">{p.name}</h2>
                    <div className="font-mono text-[11px] tracking-widest text-paper-faint">
                      {p.en.toUpperCase()}
                    </div>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[11px] ${levelColor[p.level]}`}
                    >
                      {p.level}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-paper-dim">
                    <span className="text-shu">いつ：</span>
                    {p.when}
                  </p>
                  <p className="mt-3 text-pretty leading-relaxed text-paper-mute">{p.idea}</p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="kicker mb-2">テンプレート</div>
                      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-line bg-ink-900 p-4 font-mono text-[13px] leading-relaxed text-paper-dim">
                        {p.template}
                      </pre>
                    </div>
                    <div>
                      <div className="kicker mb-2">実例</div>
                      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-shu/20 bg-shu/5 p-4 font-mono text-[13px] leading-relaxed text-paper">
                        {p.example}
                      </pre>
                    </div>
                  </div>

                  {p.preset && (
                    <Link
                      href={`/playground?preset=${p.preset}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-shu/40 bg-shu/10 px-4 py-2 text-sm text-paper transition-colors hover:bg-shu/15"
                    >
                      <span className="seal h-6 w-6 text-xs">試</span>
                      この型を道場で試す →
                    </Link>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
