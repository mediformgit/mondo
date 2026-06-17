/**
 * CHANGELOG.md をローカルで再生成する（🅢 手動）。
 *   npm run changelog
 * git タグ間のコミット件名を、慣習的プレフィックス（feat/fix/...）で分類して整形する。
 * ゼロ依存（git のみ）。GitHub 側の自動生成（.github/release.yml + release.yml）と相補的。
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const CATEGORIES = [
  { key: "added", title: "追加", match: /^feat(\(.+\))?:/ },
  { key: "changed", title: "改善・変更", match: /^(refine|perf|style)(\(.+\))?:/ },
  { key: "fixed", title: "修正", match: /^fix(\(.+\))?:/ },
  { key: "docs", title: "ドキュメント", match: /^docs(\(.+\))?:/ },
  { key: "maint", title: "保守", match: /^(chore|ci|build|deps)(\(.+\))?:/ },
];
const OTHER = { key: "other", title: "その他" };

function classify(subject) {
  for (const c of CATEGORIES) if (c.match.test(subject)) return c;
  return OTHER;
}
function clean(subject) {
  return subject.replace(/^[a-z]+(\(.+?\))?:\s*/, "").trim();
}

function tags() {
  try {
    const out = sh("git tag --sort=creatordate");
    return out ? out.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

function subjects(range) {
  const out = sh(`git log ${range} --no-merges --pretty=format:%s`);
  return out
    ? out
        .split("\n")
        .filter(Boolean)
        .filter((s) => !/CHANGELOG/i.test(s))
    : [];
}

function section(title, range) {
  const subs = subjects(range);
  const groups = new Map();
  for (const s of subs) {
    const c = classify(s);
    if (!groups.has(c.title)) groups.set(c.title, []);
    groups.get(c.title).push(clean(s));
  }
  if (groups.size === 0) return "";
  const order = [...CATEGORIES.map((c) => c.title), OTHER.title];
  let md = `## ${title}\n\n`;
  for (const t of order) {
    const items = groups.get(t);
    if (!items || items.length === 0) continue;
    md += `### ${t}\n`;
    for (const it of items) md += `- ${it}\n`;
    md += "\n";
  }
  return md;
}

function tagDate(tag) {
  try {
    return sh(`git log -1 --format=%ad --date=short ${tag}`);
  } catch {
    return "";
  }
}

const ts = tags();
let body = "";

// 未リリース（最新タグ → HEAD）
const lastTag = ts[ts.length - 1];
const unreleased = section("Unreleased", lastTag ? `${lastTag}..HEAD` : "HEAD");
if (unreleased) body += unreleased;

// 各タグ（新しい順）
for (let i = ts.length - 1; i >= 0; i--) {
  const tag = ts[i];
  const prev = ts[i - 1];
  const date = tagDate(tag);
  const sec = section(`${tag}${date ? ` — ${date}` : ""}`, prev ? `${prev}..${tag}` : tag);
  if (sec) body += sec;
}

const header =
  "# 変更履歴 — Changelog\n\n" +
  "merge されたコミットから自動生成（`npm run changelog`）。GitHub Release の自動ノートと相補的。\n" +
  "形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠。\n\n";

writeFileSync("CHANGELOG.md", header + (body || "_まだ記録はありません。_\n"), "utf8");
console.log("✓ CHANGELOG.md を再生成しました。");
