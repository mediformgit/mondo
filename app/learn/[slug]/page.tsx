import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { LessonCompleteButton } from "@/components/progress";
import { lessons, getLesson, type Block } from "@/lib/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLesson(slug);
  if (!l) return {};
  return {
    title: `${l.title} — ${l.track}${String(l.num).padStart(2, "0")}`,
    description: l.summary,
  };
}

const ordered = [...lessons].sort((a, b) => a.num - b.num);

function Callout({ tone, title, text }: { tone: "tip" | "warn" | "insight"; title: string; text: string }) {
  const map = {
    tip: { c: "var(--shu)", label: "TIP", bg: "rgba(224,83,58,0.07)", bd: "rgba(224,83,58,0.3)" },
    warn: { c: "var(--kin)", label: "注意", bg: "rgba(201,163,90,0.07)", bd: "rgba(201,163,90,0.3)" },
    insight: { c: "var(--ai)", label: "INSIGHT", bg: "rgba(110,162,201,0.07)", bd: "rgba(110,162,201,0.3)" },
  }[tone];
  return (
    <div
      className="my-7 rounded-xl border p-5"
      style={{ background: map.bg, borderColor: map.bd }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: map.c }}>
          {map.label}
        </span>
        <span className="font-display text-base text-paper">{title}</span>
      </div>
      <p className="text-pretty leading-relaxed text-paper-dim">{text}</p>
    </div>
  );
}

function Compare({ bad, good, note }: { bad: string; good: string; note?: string }) {
  return (
    <div className="my-7 overflow-hidden rounded-xl border border-line">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-line p-5 md:border-b-0 md:border-r">
          <div className="mb-2 font-mono text-[10px] tracking-[0.25em] text-paper-faint">BEFORE · 曖昧</div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-paper-mute">{bad}</p>
        </div>
        <div className="bg-shu/5 p-5">
          <div className="mb-2 font-mono text-[10px] tracking-[0.25em] text-shu">AFTER · 設計された問い</div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-paper">{good}</p>
        </div>
      </div>
      {note && (
        <div className="border-t border-line bg-ink-850 px-5 py-3 text-sm text-paper-mute">
          → {note}
        </div>
      )}
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <p className="my-4 text-pretty leading-[1.95] text-paper-dim">{b.text}</p>;
    case "h":
      return <h2 className="mt-12 mb-3 font-display text-2xl text-paper">{b.text}</h2>;
    case "list":
      return (
        <ul className="prose-mondo my-5">
          {b.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout tone={b.tone} title={b.title} text={b.text} />;
    case "compare":
      return <Compare bad={b.bad} good={b.good} note={b.note} />;
    case "try": {
      const href = b.preset === "open-patterns" ? "/patterns" : `/playground?preset=${b.preset}`;
      return (
        <Link
          href={href}
          className="group my-8 flex items-center justify-between gap-4 rounded-xl border border-shu/40 bg-shu/10 px-5 py-4 transition-colors hover:bg-shu/15"
        >
          <span className="flex items-center gap-3">
            <span className="seal h-8 w-8 text-base">試</span>
            <span className="font-display text-paper">{b.label}</span>
          </span>
          <span className="text-shu transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>
      );
    }
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const idx = ordered.findIndex((l) => l.slug === lesson.slug);
  const prev = ordered[idx - 1];
  const next = ordered[idx + 1];

  return (
    <article className="wrap max-w-3xl pt-28 pb-10 md:pt-36">
      <Reveal>
        <Link href="/learn" className="ulink text-sm text-paper-mute hover:text-paper">
          ← カリキュラム
        </Link>
        <div className="mt-6 flex items-center gap-3 font-mono text-xs text-paper-faint">
          <span className="rounded-full border border-line px-2.5 py-1 text-shu">{lesson.track}</span>
          <span>第{lesson.num}講</span>
          <span>·</span>
          <span>{lesson.minutes}分</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-lg text-paper-faint">{lesson.subtitle}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="my-9 rounded-xl border border-line bg-ink-850 p-6">
          <p className="text-pretty leading-relaxed text-paper-dim">{lesson.summary}</p>
          <div className="mt-5 border-t border-line pt-5">
            <div className="kicker mb-3">この講のねらい</div>
            <ul className="space-y-1.5">
              {lesson.goals.map((g, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm text-paper-mute">
                  <span className="text-shu" aria-hidden>
                    ✓
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mt-8">
        {lesson.body.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </div>

      {/* mark complete */}
      <div className="mt-14">
        <LessonCompleteButton slug={lesson.slug} />
      </div>

      {/* prev / next */}
      <nav className="mt-8 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="card group p-5">
            <div className="font-mono text-[10px] tracking-widest text-paper-faint">← 前の講</div>
            <div className="mt-1 font-display text-paper group-hover:text-shu">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="card group p-5 text-right">
            <div className="font-mono text-[10px] tracking-widest text-paper-faint">次の講 →</div>
            <div className="mt-1 font-display text-paper group-hover:text-shu">{next.title}</div>
          </Link>
        ) : (
          <Link href="/playground" className="card group p-5 text-right">
            <div className="font-mono text-[10px] tracking-widest text-paper-faint">修了 →</div>
            <div className="mt-1 font-display text-paper group-hover:text-shu">道場で実践する</div>
          </Link>
        )}
      </nav>
    </article>
  );
}
