/**
 * 問道 セキュリティ不変条件の検証（BYOK の生命線）。
 *   npm run check:security
 * config / playground / 任意のコード変更で、鍵が漏れる経路が増えていないかを機械的に検査する。
 * ゼロ依存（ファイルをテキスト走査するだけ）。
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const errors = [];

// ── 1. CSP / セキュリティヘッダ（next.config.mjs）──────────────
const cfg = readFileSync("next.config.mjs", "utf8");

// connect-src は独立した二重引用符の配列要素。値を丸ごと取り出して厳密に検証する。
const csMatch = cfg.match(/"connect-src ([^"]*)"/);
if (!csMatch) {
  errors.push("next.config.mjs: connect-src ディレクティブが見つからない（CSPの要）");
} else {
  const directive = csMatch[1].trim();
  const tokens = directive.split(/\s+/).filter(Boolean);
  const ALLOWED = new Set(["'self'", "https://api.anthropic.com"]);
  const unexpected = tokens.filter((t) => !ALLOWED.has(t));
  if (unexpected.length) {
    errors.push(
      `CSP connect-src に想定外のトークン: ${unexpected.join(", ")}（許可は 'self' と https://api.anthropic.com のみ — 鍵漏れ経路）`,
    );
  }
  if (!tokens.includes("https://api.anthropic.com")) {
    errors.push("CSP connect-src に https://api.anthropic.com が無い（道場が動かない）");
  }
}

for (const h of ["Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy"]) {
  if (!cfg.includes(h)) errors.push(`next.config.mjs: セキュリティヘッダ ${h} が無い`);
}
if (!/frame-ancestors 'none'/.test(cfg)) errors.push("CSP: frame-ancestors 'none' が無い（クリックジャッキング）");

// ── 1b. 静的ホスト用 public/_headers（存在すれば）も同じ CSP 制約を満たすこと ──
// Cloudflare Pages / Netlify では CSP の配信元が _headers になるため、ここでも検証する。
if (existsSync("public/_headers")) {
  const hdr = readFileSync("public/_headers", "utf8");
  // コメント中の "connect-src" を拾わないよう、実際の CSP ヘッダ行に限定して抽出する。
  const cspLine = (hdr.match(/Content-Security-Policy:\s*([^\n]*)/) || [])[1] || "";
  const m = cspLine.match(/connect-src ([^;]*)/);
  if (!m) {
    errors.push("public/_headers: Content-Security-Policy 行に connect-src が無い（静的ホストで鍵保護が効かない）");
  } else {
    const tokens = m[1].trim().split(/\s+/).filter(Boolean);
    const ALLOWED = new Set(["'self'", "https://api.anthropic.com"]);
    const unexpected = tokens.filter((t) => !ALLOWED.has(t));
    if (unexpected.length) {
      errors.push(`public/_headers: connect-src に想定外のトークン: ${unexpected.join(", ")}（鍵漏れ経路）`);
    }
    if (!tokens.includes("https://api.anthropic.com")) {
      errors.push("public/_headers: connect-src に https://api.anthropic.com が無い（道場が動かない）");
    }
  }
  for (const h of ["Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy"]) {
    if (!hdr.includes(h)) errors.push(`public/_headers: セキュリティヘッダ ${h} が無い`);
  }
  if (!/frame-ancestors 'none'/.test(hdr)) errors.push("public/_headers: frame-ancestors 'none' が無い");
}

// ── ソースを集める ─────────────────────────────────────────
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      if (e === "node_modules" || e === ".next" || e === ".git") continue;
      walk(p);
    } else if (/\.(ts|tsx|js|mjs)$/.test(e)) files.push(p);
  }
};
["app", "components", "lib"].forEach(walk);

const norm = (p) => p.replace(/\\/g, "/");
const ALLOWED_KEY_FILE = "components/playground/playground.tsx";

// ── 2. 鍵の取り扱いは playground.tsx に限定 ──────────────────
const KEY_MARKERS = ["x-api-key", "anthropic-dangerous-direct-browser-access", "mondo_api_key"];
for (const f of files) {
  const txt = readFileSync(f, "utf8");
  for (const marker of KEY_MARKERS) {
    if (txt.includes(marker) && !norm(f).endsWith(ALLOWED_KEY_FILE)) {
      errors.push(`鍵関連の記述 "${marker}" が ${norm(f)} に出現（許可は ${ALLOWED_KEY_FILE} のみ）`);
    }
  }
}

// ── 3. 外部への送信（fetch/sendBeacon/WebSocket）は Anthropic のみ ──
for (const f of files) {
  const txt = readFileSync(f, "utf8");
  const calls = txt.match(/(?:fetch|sendBeacon|WebSocket)\s*\(\s*[`"']https?:\/\/[^`"']+/g) || [];
  for (const c of calls) {
    const url = (c.match(/https?:\/\/[^`"']+/) || [""])[0];
    if (!url.startsWith("https://api.anthropic.com")) {
      errors.push(`外部送信の疑い（${url}）in ${norm(f)} — 鍵漏れ経路になりうる`);
    }
  }
}

if (errors.length) {
  console.error("✖ セキュリティ不変条件 違反:");
  errors.forEach((e) => console.error("  - " + e));
  console.error(`\n${errors.length} 件。CSP/ヘッダ/鍵の取り扱いを PRINCIPLES.md §II に照らして修正してください。`);
  process.exit(1);
}
console.log(
  "✓ セキュリティ不変条件OK（CSP connect-src=Anthropicのみ ／ ヘッダ揃い ／ 鍵は playground に限定 ／ 外部送信なし）",
);
