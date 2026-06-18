"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 開発時のみコンソールへ。外部にエラー内容は送らない（プライバシー）。
    console.error(error);
  }, [error]);

  return (
    <div className="wrap flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="seal mb-6 h-16 w-16 text-3xl">問</span>
      <p className="kicker mb-3">何かがつまずきました</p>
      <h1 className="font-display text-4xl font-semibold text-paper md:text-5xl">
        問いは、もう一度立てられる。
      </h1>
      <p className="mt-4 max-w-md text-pretty text-paper-mute">
        予期しないエラーが起きました。多くの場合、もう一度試すと直ります。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn btn-primary">
          もう一度試す
        </button>
        <Link href="/" className="btn btn-ghost">
          入口へ戻る
        </Link>
      </div>
    </div>
  );
}
