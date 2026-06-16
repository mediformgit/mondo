"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useCallback, useEffect, useState } from "react";
import { lessons, lessonsByTrack, type Track } from "@/lib/lessons";

const KEY = "mondo_progress";
const EVT = "mondo-progress";
const ordered = [...lessons].sort((a, b) => a.num - b.num);

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(arr: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

/** Reactive view of completed-lesson state, synced across tabs and components. */
export function useProgress() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setDone(new Set(read()));
    sync();
    setMounted(true);
    window.addEventListener("storage", sync);
    window.addEventListener(EVT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVT, sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const arr = read();
    const i = arr.indexOf(slug);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(slug);
    write(arr);
    setDone(new Set(arr));
  }, []);

  const reset = useCallback(() => {
    write([]);
    setDone(new Set());
  }, []);

  return { done, mounted, toggle, reset };
}

/** Overall progress bar + “続きから” resume CTA. Shown atop /learn. */
export function ProgressOverview() {
  const { done, mounted, reset } = useProgress();
  const total = ordered.length;
  const count = mounted ? ordered.filter((l) => done.has(l.slug)).length : 0;
  const pct = Math.round((count / total) * 100);
  const next = ordered.find((l) => !done.has(l.slug));
  const allDone = mounted && count === total;

  return (
    <div className="card grain-card mb-12 p-6 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="kicker mb-2">学びの記録</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-paper">{mounted ? count : "—"}</span>
            <span className="text-paper-mute">/ {total} 講 修了</span>
            {mounted && (
              <button
                onClick={reset}
                className="ml-3 text-xs text-paper-faint underline-offset-2 hover:text-paper-mute hover:underline"
                title="この端末の学習記録を消去します"
              >
                記録をリセット
              </button>
            )}
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-shu transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="shrink-0">
          {allDone ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-kin/40 px-4 py-2 text-sm text-kin">
              <span className="seal h-6 w-6 text-xs" style={{ background: "var(--kin)" }}>
                了
              </span>
              すべて修了
            </span>
          ) : next ? (
            <Link href={`/learn/${next.slug}`} className="btn btn-primary">
              {count > 0 ? "続きから" : "第一講から"} →
            </Link>
          ) : null}
        </div>
      </div>
      <p className="mt-4 border-t border-line pt-4 text-xs text-paper-faint">
        進捗はこの端末（ブラウザ）にのみ保存されます。アカウントもサーバーも使いません。
      </p>
    </div>
  );
}

/** Small “n/m 修了” badge for a track header. */
export function TrackProgress({ track }: { track: Track }) {
  const { done, mounted } = useProgress();
  const ls = lessonsByTrack(track);
  const n = mounted ? ls.filter((l) => done.has(l.slug)).length : 0;
  return (
    <span className="font-mono text-[11px] text-paper-faint">
      {n}/{ls.length}
    </span>
  );
}

/** Per-card status indicator on the /learn list. */
export function LessonStatusDot({ slug }: { slug: string }) {
  const { done, mounted } = useProgress();
  const isDone = mounted && done.has(slug);
  return isDone ? (
    <span
      className="grid h-5 w-5 place-items-center rounded-full bg-shu text-[11px] text-ink-900"
      title="修了済み"
      aria-label="修了済み"
    >
      ✓
    </span>
  ) : (
    <span
      className="h-5 w-5 rounded-full border border-line"
      aria-label="未修了"
      title="未修了"
    />
  );
}

/** Toggle button shown at the end of a lesson. */
export function LessonCompleteButton({ slug }: { slug: string }) {
  const { done, mounted, toggle } = useProgress();
  const isDone = mounted && done.has(slug);
  return (
    <button
      onClick={() => {
        // privacy-safe analytics: lesson slug only, no personal data
        if (!isDone) track("lesson_complete", { slug });
        toggle(slug);
      }}
      aria-pressed={isDone}
      className={`flex w-full items-center justify-center gap-2.5 rounded-xl border px-5 py-4 font-display text-lg transition-colors ${
        isDone
          ? "border-shu/50 bg-shu/10 text-paper"
          : "border-line text-paper-dim hover:border-shu/40 hover:text-paper"
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-sm ${
          isDone ? "bg-shu text-ink-900" : "border border-paper-faint text-transparent"
        }`}
      >
        ✓
      </span>
      {isDone ? "修了済み（クリックで取り消し）" : "この講を修了にする"}
    </button>
  );
}

/**
 * Home-page resume CTA. Renders only when the visitor has started but not
 * finished — first-time visitors and finishers see nothing (no clutter).
 */
export function ResumeBanner() {
  const { done, mounted } = useProgress();
  if (!mounted) return null;
  const count = ordered.filter((l) => done.has(l.slug)).length;
  const next = ordered.find((l) => !done.has(l.slug));
  if (count === 0 || !next) return null;

  return (
    <Link
      href={`/learn/${next.slug}`}
      className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-shu/30 bg-shu/[0.07] px-5 py-4 transition-colors hover:border-shu/50 hover:bg-shu/10"
    >
      <span className="flex items-center gap-4">
        <span className="seal h-10 w-10 shrink-0 text-base">続</span>
        <span className="min-w-0">
          <span className="block font-mono text-[10px] tracking-[0.25em] text-shu">
            学びの続き · {count}/{ordered.length} 修了
          </span>
          <span className="block truncate font-display text-paper">
            第{next.num}講「{next.title}」
          </span>
        </span>
      </span>
      <span className="shrink-0 font-display text-paper transition-transform group-hover:translate-x-1">
        続きから →
      </span>
    </Link>
  );
}
