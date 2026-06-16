import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="seal mb-6 h-16 w-16 text-3xl">問</span>
      <p className="kicker mb-3">404</p>
      <h1 className="font-display text-4xl font-semibold text-paper md:text-5xl">
        その問いの先に、道はない。
      </h1>
      <p className="mt-4 max-w-md text-pretty text-paper-mute">
        ページが見つかりませんでした。別の問いを立て直そう。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn btn-primary">
          入口へ戻る →
        </Link>
        <Link href="/learn" className="btn btn-ghost">
          カリキュラムを見る
        </Link>
      </div>
    </div>
  );
}
