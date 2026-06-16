import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "思想 — なぜ問道をつくるのか",
  description:
    "教育の値段が学びの上限を決める時代を終わらせる。問道のマニフェスト。知は独占されてはならない。",
};

export default function AboutPage() {
  return (
    <div className="wrap max-w-3xl pt-28 pb-10 md:pt-36">
      <Reveal>
        <div className="kicker mb-4">思想 · Manifesto</div>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-paper md:text-6xl">
          知は、独占されては
          <br />
          ならない。
        </h1>
      </Reveal>

      <div className="prose-mondo mt-12 text-[1.05rem]">
        <Reveal delay={0.05}>
          <p>
            日本の教育には、長く一つの不文律があった。
            <strong>良質な学びは、お金で買うもの</strong>だ、と。
            手厚い個別指導、わかるまで付き合ってくれる先生、何度でも質問できる環境——
            それらはいつも、払える人のところに集まってきた。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p>
            生成AIは、その前提を静かに崩しつつある。
            「わかるまで教える」という体験の<strong>限界費用が、ほぼゼロ</strong>になったからだ。
            忍耐強く、決して急かさず、こちらのレベルに合わせて何度でも説明し直す相手が、
            ブラウザの中にいる。住む場所も、家庭の経済力も、もう関係ない。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>けれど、道具があるだけでは足りない</h2>
          <p>
            問題は、ここからだ。道具が無料でも、<strong>使い方を知る人だけが得をする</strong>なら、
            私たちは格差を解消したのではなく、格差の場所を移しただけになる。
            プロンプトの巧拙、問いを立てる力、AIの嘘を見抜く目——
            この“使いこなす力”が、新しい分断線になりかねない。
          </p>
          <p>
            だからこそ、<strong>使いこなすための教育こそ、無料で、誰にでも開かれているべき</strong>だ。
            問道は、その一点のために存在する。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>私たちが教えるのは、呪文ではない</h2>
          <p>
            ネットには「これを貼れば最強」というプロンプト集があふれている。
            だが、他人の呪文は、状況が変わった瞬間に効かなくなる。
            私たちが鍛えたいのは、もっと深いところにある力だ。
          </p>
          <p>
            <strong>前提を疑う。条件を切り分ける。求める形を、言葉にする。</strong>
            これは理系の論理でも、文系の読解でも、まったく同じ筋肉を使う。
            生成AIは、その筋肉を鍛える最高のトレーニング相手であり、
            問道は、文系と理系のあいだに引かれた線を信じない。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>AIは、答える機械ではなく、考える相手</h2>
          <p>
            初心者はAIに答えを求める。熟達者はAIに抵抗を求める。
            自分のアイデアをわざと攻撃させ、浅い考えを質問で暴かせ、見落とした前提を突かせる。
            AIは<strong>鏡であり、砥石</strong>だ。自分の考えを映し、ぶつけることで研ぐ。
          </p>
          <p>
            答えを得る道具としてのAIは、いずれ陳腐になる。
            だが、思考を鍛える相手としてのAIの使い方は、一生もののスキルになる。
            私たちは、後者を教える。
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2>四つの約束</h2>
          <ul>
            <li><strong>永久に無料。</strong>学ぶことに、料金は要らない。</li>
            <li><strong>登録不要・広告なし。</strong>あなたを商品にしない。</li>
            <li><strong>入口をせばめない。</strong>初心者を置き去りにせず、本質まで導く。</li>
            <li><strong>鍵は、あなたの手元に。</strong>道場でAIを動かすとき、あなたのAPIキーはブラウザの外に出ない。</li>
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-paper">
            問いの中に、答えはない。問いの中にこそ、道がある。
            <br />
            さあ、最初の問いを立てよう。
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/learn/what-is-asking-ai" className="btn btn-primary">
            第一講から始める →
          </Link>
          <Link href="/playground" className="btn btn-ghost">
            道場をひらく
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
