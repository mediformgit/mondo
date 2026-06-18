import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "プライバシーと免責",
  description:
    "問道のプライバシー方針と免責事項。クッキーなし・登録なし・広告なし。APIキーはブラウザ内のみ。AIの出力は誤りうることへの注意。",
};

export default function PrivacyPage() {
  return (
    <div className="wrap max-w-3xl pt-28 pb-10 md:pt-36">
      <Reveal>
        <div className="kicker mb-4">Privacy & Disclaimer</div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
          プライバシーと免責
        </h1>
        <p className="mt-4 text-sm text-paper-faint">最終更新：2026年6月18日</p>
      </Reveal>

      <div className="prose-mondo mt-12 text-[1.02rem]">
        <Reveal delay={0.05}>
          <p>
            問道（MONDŌ）は、<strong>あなたを商品にしない</strong>という原則
            （<Link href="/about">思想</Link>）の上に作られています。だからこのページは短く、約束は具体的です。
          </p>

          <h2>集めないもの</h2>
          <ul>
            <li><strong>アカウントを作らせません。</strong>氏名・メールアドレス・ログイン情報を一切持ちません。</li>
            <li><strong>クッキーを使いません。</strong>トラッキング目的のクッキーはゼロです。</li>
            <li><strong>広告を載せません。</strong>第三者の広告タグ・追跡ピクセルはありません。</li>
            <li><strong>あなたのデータを売りません。</strong>第三者への販売・提供は行いません。</li>
          </ul>

          <h2>集める最小限のもの（アクセス解析）</h2>
          <p>
            サイト改善のため、<strong>Vercel Web Analytics</strong>（クッキー不要・個人を特定しない集計）を使います。
            ページの閲覧数や参照元などの<strong>匿名の統計</strong>のみで、個人の特定はしません。あわせて、改善判断のための
            最小限のイベントを記録します——どの講が修了されたか（<code>lesson_complete</code>）、道場の利用状況
            （<code>playground_send</code>：デモ/自分の鍵の別とモデル名）。
            <strong>あなたが入力した文章（プロンプト）は、これらの記録に一切含めません。</strong>
          </p>

          <h2>APIキー（自分の鍵モード）の扱い</h2>
          <p>
            道場で「自分の鍵モード」を使う場合、あなたの Anthropic APIキーは：
          </p>
          <ul>
            <li><strong>あなたのブラウザ内だけ</strong>に保存されます（保存方法は「端末に保存／このタブだけ／保存しない」から選べます）。</li>
            <li>通信は<strong>あなたのブラウザから Anthropic へ直接</strong>送られます。問道のサーバーは鍵もメッセージも受け取りません。</li>
            <li>ブラウザの仕組み（Content-Security-Policy）で、<strong>Anthropic 以外への送信を物理的に遮断</strong>しています。</li>
          </ul>
          <p>
            これは DevTools の Network タブで誰でも確認できます。詳しくは道場内の「鍵の扱い・安全性」をご覧ください。
            なりすまし防止のため、<strong>APIキーは公式サイト以外では入力しないでください</strong>。
          </p>

          <h2>免責（とても大切）</h2>
          <p>
            問道は、生成AIの<strong>使い方を学ぶ</strong>ための教育サイトです。AIの出力は便利ですが、
            <strong>事実と異なること（幻覚）や、古い情報を含むことがあります</strong>（このことは講義でも扱っています）。
          </p>
          <ul>
            <li>重要な判断・専門的判断（医療・法律・金融など）に用いる前に、<strong>必ず一次情報で裏を取って</strong>ください。</li>
            <li>本サイトの内容、AIの出力、外部リンク先について、<strong>その正確性・完全性を保証せず、結果について責任を負いません</strong>。ご利用は自己責任でお願いします。</li>
            <li>「自分の鍵モード」での Anthropic API の<strong>利用料金は、ご自身の負担</strong>となります（問道は費用を負担しません）。</li>
          </ul>

          <h2>使っている外部サービス</h2>
          <ul>
            <li><strong>Anthropic（Claude API）</strong> — 自分の鍵モードでブラウザから直接呼び出します。</li>
            <li><strong>Vercel</strong> — ホスティングと匿名アクセス解析。</li>
          </ul>
          <p>各社のプライバシー方針もあわせてご確認ください。</p>

          <h2>このページの変更</h2>
          <p>
            内容を更新した場合は、上部の「最終更新」を改めます。変更履歴はリポジトリの公開ログで追えます。
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/playground" className="btn btn-primary">
            道場をひらく →
          </Link>
          <Link href="/about" className="btn btn-ghost">
            思想を読む
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
