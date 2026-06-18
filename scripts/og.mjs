/**
 * OGP画像（app/opengraph-image.png）を SVG から再生成する。
 * 再生成手順：
 *   npm i -D @resvg/resvg-js
 *   node scripts/og.mjs
 *   npm un @resvg/resvg-js   # 実行時/ビルドには不要なので外す
 * 出力 PNG は静的アセットとして Next が自動で og:image / twitter:image に使う。
 */
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("scripts/og-source.svg", "utf8");
const resvg = new Resvg(svg, {
  font: { loadSystemFonts: true, defaultFontFamily: "Yu Mincho" },
  fitTo: { mode: "width", value: 1200 },
});
const png = resvg.render().asPng();
writeFileSync("app/opengraph-image.png", png);
console.log(`wrote app/opengraph-image.png (${png.length} bytes)`);
