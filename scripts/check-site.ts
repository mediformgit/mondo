/**
 * 問道 site integrity checker.
 *   npm run check              — 内部整合性のみ（高速・ネットワーク無し・PRで実行）
 *   npm run check:external     — 上記＋外部リンクの到達確認（週次で実行）
 *
 * 「内部リンク切れ」を構造的に検出する：try→preset / pattern→preset の参照、
 * slug/id 重複、num の連番・トラック連続性、nav の既知ルート。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { lessons, tracks } from "../lib/lessons";
import { patterns } from "../lib/patterns";
import { presets } from "../lib/presets";
import { nav } from "../lib/site";

const errors: string[] = [];
const warnings: string[] = [];

// lesson renderer がリンク先として特別扱いするキー（preset ではない）
const SPECIAL_TRY = new Set(["open-patterns"]);
const KNOWN_ROUTES = new Set(["/", "/learn", "/patterns", "/playground", "/about"]);

const presetIds = new Set(presets.map((p) => p.id));

// 1. preset id 重複
{
  const seen = new Set<string>();
  for (const p of presets) {
    if (seen.has(p.id)) errors.push(`preset id 重複: ${p.id}`);
    seen.add(p.id);
  }
}

// 2. pattern id 重複 ＋ pattern.preset の参照先が存在するか
{
  const seen = new Set<string>();
  for (const p of patterns) {
    if (seen.has(p.id)) errors.push(`pattern id 重複: ${p.id}`);
    seen.add(p.id);
    if (p.preset && !presetIds.has(p.preset)) {
      errors.push(`pattern "${p.id}" の preset "${p.preset}" が presets.ts に無い（リンク切れ）`);
    }
  }
}

// 3. lesson slug 重複 ／ try preset 参照 ／ goals 個数
{
  const seen = new Set<string>();
  for (const l of lessons) {
    if (seen.has(l.slug)) errors.push(`lesson slug 重複: ${l.slug}`);
    seen.add(l.slug);
    if (l.goals.length < 2 || l.goals.length > 4) {
      warnings.push(`lesson "${l.slug}" の goals が ${l.goals.length} 個（推奨 2〜4）`);
    }
    for (const b of l.body) {
      if (b.t === "try" && !SPECIAL_TRY.has(b.preset) && !presetIds.has(b.preset)) {
        errors.push(`lesson "${l.slug}" の try preset "${b.preset}" が presets.ts に無い（リンク切れ）`);
      }
    }
  }
}

// 4. num が 1..N の連番か ／ トラックが連続ブロックか（前後ナビの前提）
{
  const sorted = [...lessons].sort((a, b) => a.num - b.num);
  sorted.forEach((l, i) => {
    if (l.num !== i + 1) errors.push(`num が連番でない: "${l.slug}" は num=${l.num}（期待 ${i + 1}）`);
  });
  const seenTracks = new Set<string>();
  let prev = "";
  for (const l of sorted) {
    if (l.track !== prev) {
      if (seenTracks.has(l.track)) {
        errors.push(`トラックが連続していない（"${l.track}" が分断）: "${l.slug}" 付近。前後ナビが乱れます`);
      }
      seenTracks.add(l.track);
      prev = l.track;
    }
  }
  // 既知トラックのみか
  for (const l of lessons) {
    if (!(tracks as readonly string[]).includes(l.track)) errors.push(`未知のトラック: "${l.track}"（${l.slug}）`);
  }
}

// 5. nav の href が既知ルートか
for (const n of nav) {
  if (!KNOWN_ROUTES.has(n.href)) warnings.push(`nav href が既知ルートに無い: ${n.href}`);
}

// 6. 外部リンクの到達確認（--external のときだけ・ベストエフォート）
function collectUrls(): Set<string> {
  const urls = new Set<string>();
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      const s = statSync(p);
      if (s.isDirectory()) {
        if (e === "node_modules" || e === ".next" || e === ".git") continue;
        walk(p);
      } else if (/\.(ts|tsx|js|mjs)$/.test(e)) {
        const m = readFileSync(p, "utf8").match(/https?:\/\/[^\s"'`)）」<>]+/g);
        m?.forEach((u) => urls.add(u.replace(/[.,;]+$/, "")));
      }
    }
  };
  ["app", "components", "lib"].forEach(walk);
  return urls;
}

async function checkExternal() {
  const urls = [...collectUrls()];
  console.log(`外部リンク確認: ${urls.length} 件`);
  for (const u of urls) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      let res = await fetch(u, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
      if (res.status === 403 || res.status === 405)
        res = await fetch(u, { method: "GET", redirect: "follow", signal: ctrl.signal });
      clearTimeout(t);
      if (res.status === 404 || res.status === 410) errors.push(`外部リンク切れ(${res.status}): ${u}`);
      else if (!res.ok && res.status !== 429) warnings.push(`外部リンク要確認(${res.status}): ${u}`);
    } catch {
      warnings.push(`外部リンク到達不可（一時的かも・要目視）: ${u}`);
    }
  }
}

async function main() {
  if (process.argv.includes("--external")) await checkExternal();

  if (warnings.length) {
    console.log("\n⚠ 警告:");
    warnings.forEach((w) => console.log("  - " + w));
  }
  if (errors.length) {
    console.error("\n✖ エラー:");
    errors.forEach((e) => console.error("  - " + e));
    console.error(`\n${errors.length} 件の問題が見つかりました。`);
    process.exit(1);
  }
  console.log(`\n✓ 整合性OK（lessons:${lessons.length} / patterns:${patterns.length} / presets:${presets.length}）`);
}

main();
