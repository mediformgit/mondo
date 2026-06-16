import { Suspense } from "react";
import type { Metadata } from "next";
import { Playground } from "@/components/playground/playground";

export const metadata: Metadata = {
  title: "道場 — ブラウザで試すAI Playground",
  description:
    "登録不要のデモモードと、自分のAPIキーを使うライブモード。Claudeをブラウザ上で実際に動かしながら、問いの立て方を体で覚える。",
};

export default function PlaygroundPage() {
  return (
    <div className="wrap pt-28 pb-10 md:pt-32">
      <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="kicker mb-3">道場 · Playground</div>
          <h1 className="font-display text-4xl font-semibold text-paper md:text-5xl">
            手を動かす場所
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-paper-mute">
            読むだけでは、問いは立たない。ここで実際にAIと往復しよう。鍵がなくても
            <strong className="text-paper-dim">デモモード</strong>で体験でき、
            自分の鍵を使えば<strong className="text-paper-dim">自由に対話</strong>できる。
          </p>
        </div>
      </header>

      <div className="mb-8 rounded-xl border border-ai/25 bg-ai/5 p-5">
        <div className="font-mono text-[10px] tracking-[0.25em] text-ai">はじめての方へ</div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-paper-dim">
          まずは<strong className="text-paper">鍵不要のデモ</strong>、または普段の
          <strong className="text-paper">Claudeアプリ</strong>でも構いません。チャットは“本番の現場”です。
          道場の<strong className="text-paper">BYOK</strong>は、「なぜこの問いが効くのか」を
          <strong className="text-paper">システムプロンプト・モデル・思考</strong>を見ながら反復する“鏡張りの稽古場”——
          どのAIにも、将来あなたが何かを作る側に回るときにも通じる原理が身につきます。
        </p>
      </div>

      <Suspense fallback={<div className="text-paper-mute">読み込み中…</div>}>
        <Playground />
      </Suspense>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-paper-faint">
        プライバシー：ライブモードでは、入力したAPIキーとメッセージはあなたのブラウザから
        <strong className="text-paper-mute"> 直接Anthropicへ </strong>
        送信されます。問道のサーバーは介在せず、鍵を保存も記録もしません。
      </p>
    </div>
  );
}
