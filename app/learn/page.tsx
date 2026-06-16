import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProgressOverview, TrackProgress, LessonStatusDot } from "@/components/progress";
import { tracks, trackMeta, lessonsByTrack } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "学ぶ — 生成AI活用のカリキュラム",
  description:
    "入門・実践・探究の3トラック、全9講。前提知識ゼロから、AIを思考と学びのパートナーにするところまで。文系・理系を問わず。",
};

export default function LearnPage() {
  const total = tracks.reduce((n, t) => n + lessonsByTrack(t).length, 0);

  return (
    <div className="wrap pt-28 pb-10 md:pt-36">
      <header className="mb-16 max-w-3xl">
        <div className="kicker mb-4">カリキュラム · Learn</div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-paper md:text-6xl">
          問いを立てる力を、
          <br />
          順を追って。
        </h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-paper-dim">
          全{total}講。各講は5〜12分。読むだけで終わらせず、各講の終わりに
          <Link href="/playground" className="text-shu ulink"> 道場 </Link>
          で手を動かせる。順番でも、気になる講からでも。
        </p>
      </header>

      <ProgressOverview />

      <div className="space-y-20">
        {tracks.map((track) => {
          const ls = lessonsByTrack(track);
          return (
            <section key={track} id={trackMeta[track].en.toLowerCase()} className="scroll-mt-28">
              <Reveal>
                <div className="mb-8 flex items-end gap-5 border-b border-line pb-5">
                  <span className="font-display text-6xl text-paper">{track}</span>
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tracking-[0.3em] text-shu">
                        {trackMeta[track].en.toUpperCase()}
                      </span>
                      <TrackProgress track={track} />
                    </div>
                    <p className="text-sm text-paper-mute">{trackMeta[track].blurb}</p>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-4 md:grid-cols-3">
                {ls.map((l, i) => (
                  <Reveal key={l.slug} delay={i * 0.06}>
                    <Link href={`/learn/${l.slug}`} className="card group flex h-full flex-col p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-xs text-shu">
                          {String(l.num).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-paper-faint">{l.minutes}分</span>
                          <LessonStatusDot slug={l.slug} />
                        </div>
                      </div>
                      <h2 className="font-display text-xl text-paper transition-colors group-hover:text-shu">
                        {l.title}
                      </h2>
                      <p className="mt-1 text-sm text-paper-faint">{l.subtitle}</p>
                      <p className="mt-4 text-sm leading-relaxed text-paper-mute">{l.summary}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm text-paper-dim transition-colors group-hover:text-shu">
                        読む <span aria-hidden>→</span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
