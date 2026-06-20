import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "つくられ方 — 一つの指示から、問道はどう生まれたか",
  description:
    "問道は、運営者がClaudeに与えた一つのゴールから始まった。でも、一発の魔法ではない。綱領を置き、問いを重ね、選び、捨てた。コードも文章も、全部オープンソース。",
};

// 運営者がClaude Code に与えた最初のゴール。原文ママ（authenticity こそ要点なので、整えない）。
const goalPrompt = [
  "日本の教育業界が真面目にDXしなければ、ビジネスモデルや価格競争で全部ぶっ壊れるような素晴らしい無料の教育サイトを作って。デザインもUI/UXも最高を頼む。文理を問わず、入口をせばめず、陳腐にならないように。",
  "特に生成aiの使い方（クロードの説明書兼使いこなすための教育サイト）に特化した天下無双の、初心者にもはいりやすくそれでいて陳腐でないものを作ってほしい。",
  "playgroundがブラウザ上にもあるといいな。vercelで公開予定。",
];

// この作り方そのものに先例がある。末尾の謝辞からリンクする（敬意と出所の明示）。
const inspirations = {
  fladdict: "https://x.com/fladdict/status/2064904019823448481",
  kmizu: "https://zenn.dev/nextbeat/articles/2026-06-cs-edu-site-fable5",
};

export default function MadePage() {
  return (
    <div className="wrap max-w-3xl pt-28 pb-10 md:pt-36">
      <Reveal>
        <div className="kicker mb-4">つくられ方 · Colophon</div>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-paper md:text-5xl">
          このサイトもまた、
          <br />
          一つの問いから生まれた。
        </h1>
      </Reveal>

      <div className="prose-mondo mt-12 text-[1.05rem]">
        <Reveal delay={0.05}>
          <p>
            問道が教えるのは、<strong>問いを立てる力</strong>だ。
            そして問道そのものが、一つの問い——正確には、一つの指示——から始まった。
            運営者が、AIアシスタント（Claude Code）に与えた、たった一つのゴール。それが出発点だった。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <figure className="card grain-card my-9 overflow-hidden">
            <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line px-5 py-3 font-mono text-xs text-paper-mute">
              <span className="text-shu">/goal</span>
              <span>運営者がClaudeに与えた、最初の指示 — 原文ママ</span>
            </figcaption>
            <blockquote className="px-6 py-6 text-[1.0rem] leading-[1.95] text-paper-dim">
              {goalPrompt.map((line, i) => (
                <p key={i} className={i === 0 ? "" : "mt-3"}>
                  {line}
                </p>
              ))}
            </blockquote>
          </figure>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>でも、正直に言う。一発の魔法ではない。</h2>
          <p>
            この一文を貼っただけで、サイトが完成したわけではない。
            「AIに丸投げしたら、すごいものが出てきた」という話なら、それは半分は嘘だ。
            実際にやったことは、もっと地味で、もっとこのサイトの教えに近い。
          </p>
          <ul>
            <li>
              まず、<strong>綱領（PRINCIPLES）を最上位に置いた。</strong>
              無料・無登録・無広告・無追跡、鍵はユーザーの手元に——譲れない原則を先に決め、すべての判断をそこに従わせた。
            </li>
            <li>
              一つひとつの講義・型・道場の例を、<strong>品質の物差しに照らして書いては直し、保留し、また書いた。</strong>
              凡庸なら、完成させずに捨てた。
            </li>
            <li>
              <strong>検証できない事実は、載せない</strong>を徹底した。AIの幻覚を、AI自身に書かせて見逃すわけにはいかない。
            </li>
          </ul>
          <p>
            つまり——AIに答えを「もらった」のではなく、<strong>問いを重ね、方向づけ、選び、そして捨てた。</strong>
            それは奇しくも、このサイトが第一講から教えていることそのものだ。
            AIは、答える機械ではなく、考える相手。問道は、その使い方で作られた。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>だから、隠さない。全部、開いている。</h2>
          <p>
            「すごいでしょう」と言うのは簡単だ。けれど、知が独占されてはならないと信じるサイトが、
            自分の中身を閉じておくのは筋が通らない。だから問道は、<strong>仕組みごと公開している。</strong>
          </p>
          <ul>
            <li>
              <strong>コードは MIT、文章は CC BY-SA 4.0。</strong>
              読むのも、学ぶのも、フォークして自分の教材を作るのも自由。
            </li>
            <li>
              <strong>広告なし・追跡なし・登録なし。</strong>
              道場でAIを動かすとき、あなたのAPIキーはブラウザの外に出ない——これは祈りではなく、設計（CSP）で構造的に保証している。
            </li>
            <li>
              <strong>「信じてほしい」ではなく、「確かめてほしい」。</strong>
              リポジトリを開けば、綱領も、講義の元データも、この文章自身も、全部そこにある。
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-paper">
            問いの中に、答えはない。問いの中にこそ、道がある。
            <br />
            このサイトが、その証明のひとつであればいい。
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.05}>
        <div className="mt-14 border-t border-line pt-8">
          <h2 className="font-display text-lg font-semibold text-paper">
            先に道を示してくれた人へ
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-paper-mute text-pretty">
            「一つの <span className="font-mono text-shu">/goal</span> から、生成AIに教育サイトを丸ごと作らせる」——この作り方は、私の発明ではない。
            <a href={inspirations.fladdict} target="_blank" rel="noopener noreferrer" className="ulink text-paper-dim hover:text-paper">深津貴之</a>氏、<a href={inspirations.kmizu} target="_blank" rel="noopener noreferrer" className="ulink text-paper-dim hover:text-paper">kmizu</a>氏に強く触発されている。問道は、その方法を生成AIリテラシーという別の領域へ受け継いだものだ。先達に、敬意と感謝を。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={site.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            GitHubで、全部見る ↗
          </a>
          <Link href="/learn/what-is-asking-ai" className="btn btn-ghost">
            第一講から始める
          </Link>
          <Link href="/playground" className="btn btn-ghost">
            道場をひらく
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
