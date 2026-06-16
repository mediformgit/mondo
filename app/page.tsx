import Link from "next/link";
import { Enso } from "@/components/enso";
import { Reveal } from "@/components/reveal";
import { ResumeBanner } from "@/components/progress";
import { tracks, trackMeta, lessonsByTrack } from "@/lib/lessons";
import { patterns } from "@/lib/patterns";

const marquee = [
  "社会学レポートの骨子を作る",
  "値づけの考え方を場合分けする",
  "複利を中学生にもわかるように",
  "この企画を全力で潰してほしい",
  "卒論の論理の飛躍だけ指摘して",
  "専門用語なしで、200字で",
  "私の考えの浅い所を質問で気づかせて",
  "自分専用の家庭教師になって",
];

export default function Home() {
  return (
    <>
      {/* ── hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pt-36 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-44 md:pb-28">
          <div>
            <Reveal>
              <div className="kicker mb-6">生成AIを、使われる側で終わらせない</div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display text-[3.4rem] font-bold leading-[1.05] tracking-tight text-paper md:text-[5rem]">
                問いを、
                <br />
                <span className="relative inline-block text-shu">
                  力に。
                  <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-shu/40" aria-hidden />
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-paper-dim">
                Claudeを題材にした、生成AIの教科書であり、道場。
                文系も理系も、初心者から本質まで。覚えるのは“呪文”ではなく、
                一生もののスキル——<strong className="text-paper">問いを立てる力</strong>。
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/playground" className="btn btn-primary">
                  道場ではじめる
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/learn" className="btn btn-ghost">
                  カリキュラムを見る
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-paper-mute">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-shu" /> 永久に無料
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-shu" /> 登録不要
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-shu" /> 広告なし
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-shu" /> ブラウザで動く
                </span>
              </div>
            </Reveal>

            <ResumeBanner />
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center md:flex">
            <Enso className="h-[88%] w-[88%]" />
            <span
              className="vertical absolute right-2 top-1/2 hidden -translate-y-1/2 text-sm text-paper-faint lg:block"
              aria-hidden
            >
              円相 ・ 問いの中にこそ、道がある
            </span>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-y border-line bg-ink-850/40 py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap pr-10">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-10 font-mono text-sm text-paper-mute">
                <span className="text-shu">問</span>
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── manifesto ────────────────────────────────────── */}
      <section className="wrap py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <div className="kicker mb-4">なぜ、これを無料で</div>
              <h2 className="font-display text-3xl font-semibold leading-tight text-paper md:text-[2.6rem]">
                教育の値段が、
                <br />
                学びの上限を
                <br />
                決める時代を終わらせる。
              </h2>
            </div>
          </Reveal>
          <div className="space-y-7">
            {[
              {
                n: "01",
                h: "「わかるまで教える」の限界費用が、ゼロになった",
                p: "良質な個別指導は、長く、限られた人のものだった。生成AIは、忍耐強い家庭教師を誰の手にも置く。住む場所も、家庭の経済力も問わずに。",
              },
              {
                n: "02",
                h: "使いこなす力に、格差が生まれてはいけない",
                p: "道具が無料でも、使い方を知る人だけが得をするなら、新しい格差が生まれる。だから、使いこなす教育こそ無料で、誰にでも開かれているべきだ。",
              },
              {
                n: "03",
                h: "覚えるのは“呪文”ではなく、“問いを立てる力”",
                p: "コピペできるテンプレートは、いずれ陳腐になる。前提を疑い、条件を切り分け、求める形を言葉にする力は、文系も理系も、一生を支える。",
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.08}>
                <div className="flex gap-5 border-b border-line pb-7">
                  <span className="font-mono text-sm text-shu">{item.n}</span>
                  <div>
                    <h3 className="font-display text-xl text-paper">{item.h}</h3>
                    <p className="mt-2 text-pretty leading-relaxed text-paper-mute">{item.p}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <Link href="/about" className="ulink inline-block text-shu">
                この思想の全文を読む →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── three paths ──────────────────────────────────── */}
      <section className="wrap py-12">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="kicker mb-3">三つの道</div>
              <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
                入門から、本質へ。
              </h2>
            </div>
            <p className="max-w-sm text-sm text-paper-mute">
              前提知識ゼロの「入門」から、AIを思考と学びのパートナーにする「探究」まで。
              あなたの今いる場所から始められる。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {tracks.map((track, i) => {
            const ls = lessonsByTrack(track);
            return (
              <Reveal key={track} delay={i * 0.1}>
                <Link
                  href={`/learn#${trackMeta[track].en.toLowerCase()}`}
                  className="card group flex h-full flex-col p-7"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-display text-5xl text-paper transition-colors group-hover:text-shu">
                      {track}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-paper-faint">
                      {trackMeta[track].en.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-paper-mute">
                    {trackMeta[track].blurb}
                  </p>
                  <ul className="mt-auto space-y-2 border-t border-line pt-5">
                    {ls.map((l) => (
                      <li key={l.slug} className="flex items-baseline gap-2 text-sm text-paper-dim">
                        <span className="font-mono text-[10px] text-shu">
                          {String(l.num).padStart(2, "0")}
                        </span>
                        <span className="truncate">{l.title}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── patterns preview ─────────────────────────────── */}
      <section className="wrap py-24 md:py-32">
        <Reveal>
          <div className="mb-12 text-center">
            <div className="kicker mb-3 flex justify-center">型 · Patterns</div>
            <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
              達人の動きには、型がある。
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-paper-mute">
              暗記する必要はない。困ったら辞書のように引ける、再現性のある問いの構え方。
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
          {patterns.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <Link
                href={`/patterns#${p.id}`}
                className="card group flex aspect-square flex-col items-center justify-center gap-2 p-2 text-center"
                title={p.name}
              >
                <span className="seal h-11 w-11 text-2xl transition-transform duration-500 group-hover:-rotate-6">
                  {p.kanji}
                </span>
                <span className="text-[11px] leading-tight text-paper-mute">{p.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/patterns" className="btn btn-ghost">
            型ライブラリをすべて見る
          </Link>
        </div>
      </section>

      {/* ── humanities × sciences ────────────────────────── */}
      <section className="wrap py-12">
        <Reveal>
          <div className="mb-10 text-center">
            <div className="kicker mb-3 flex justify-center">文理を、問わない</div>
            <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
              同じ筋肉を、別の言葉で。
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card grain-card h-full p-8">
              <h3 className="font-display text-2xl text-paper">
                文 <span className="text-base text-paper-faint">Humanities</span>
              </h3>
              <ul className="prose-mondo mt-5">
                <li>白紙のレポートに、10通りの切り口を並べる</li>
                <li>自分の文体を保ったまま、論理の飛躍を点検する</li>
                <li>賛成・反対、両方の最強の主張を組み立てる</li>
                <li>歴史や思想を、自分のレベルに合わせて学び直す</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card grain-card h-full p-8">
              <h3 className="font-display text-2xl text-paper">
                理 <span className="text-base text-paper-faint">Sciences</span>
              </h3>
              <ul className="prose-mondo mt-5">
                <li>答えの前に、考え方の方針と前提を出させる</li>
                <li>結論が変わる条件を、漏れなく場合分けする</li>
                <li>コードを“書かせる”より“説明させて”理解する</li>
                <li>難しい概念を、たとえ話で腹落ちさせる</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── final CTA ────────────────────────────────────── */}
      <section className="wrap py-24 md:py-32">
        <Reveal>
          <div className="card grain-card relative overflow-hidden p-10 text-center md:p-16">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-shu/15 blur-3xl"
              aria-hidden
            />
            <div className="kicker mb-4 flex justify-center">はじめよう</div>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight text-paper md:text-5xl">
              最初の問いを、立ててみる。
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-paper-mute">
              読むより、やってみるのが速い。鍵がなくても、いますぐ道場で体験できる。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/playground" className="btn btn-primary">
                道場をひらく →
              </Link>
              <Link href="/learn/what-is-asking-ai" className="btn btn-ghost">
                第一講から読む
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
