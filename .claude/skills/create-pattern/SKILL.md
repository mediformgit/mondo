---
name: create-pattern
description: 問道(MONDŌ)の型ライブラリに、新しいプロンプト・パターン(型)を1つゼロから起草し、品質ルーブリック(§1+§6)で自己採点・改稿してPRを開く。検証不能な事実は出さず保留。
argument-hint: "[型の主題。省略時は既存の型のギャップから1つ起案]"
---

# /create-pattern — 型（パターン）を1つ作る

[lib/patterns.ts](../../../lib/patterns.ts) の `Pattern` 型に沿って、再利用できる“問いの構え”を1つ起草し、PRにする。**推奨モデル: Opus 4.8 / effort 高め**。

## 最初に必ず読む
1. [PRINCIPLES.md](../../../PRINCIPLES.md) — 不可侵の原則。
2. [docs/QUALITY-RUBRIC.md](../../../docs/QUALITY-RUBRIC.md) — **§0 ハードゲート＋§1 陳腐テスト＋§6 型の追加基準**に従う。
3. [lib/patterns.ts](../../../lib/patterns.ts) — `Pattern` 型と既存の型（重複回避・声の手本）。
4. [lib/presets.ts](../../../lib/presets.ts) — 「道場で試す」を付けるならプリセットも作る。

## 手順
1. **主題を決める** — 引数があれば採用。無ければ既存の型を読み、**抜けている構え**を1つ選ぶ（万能でなく切れ味のあるもの）。既存と重複しないこと。
2. **事実検証（§0）** — 流動的な事実は `web_search` で確認・出典控え。検証不能なら**保留→運営者に報告して終了**。
3. **起草** — `Pattern` 型に厳密準拠：`id`(英語)・`kanji`(1〜2字の印)・`name`・`en`・`level`(`基本`|`応用`|`達人`)・`when`(いつ使うか／鋭く)・`idea`(なぜ効くか)・`template`(パラメータ化された雛形)・`example`(そのまま打てる実例)・`preset?`。
4. **プリセット連携（任意）** — 試せるようにするなら [lib/presets.ts](../../../lib/presets.ts) に `p-<id>` を追加（`category:"型"`・**個人情報なしの** `demoReply` 付き）し、`Pattern.preset` に紐付け。
5. **自己採点→改稿** — §1（8基準）＋§6（再利用性・切れ味・実例・合成可能性・非冗長・原理性）で採点。× は §3 の辛口レビューで直す。合格しなければ保留。
6. **ビルド** — `lib/patterns.ts`（必要なら `lib/presets.ts`）に追記し **`npm run build` を通す**。
7. **PR** — `git checkout -b pattern/<id>` → コミット → リモートがあれば `gh pr create`、無ければブランチまでで報告。PR本文に**§4の添付（なぜ陳腐でないか／不確実な点／出典）＋採点結果**。

## 守る不変条件
- コンテンツは `lib/*.ts` に閉じる。CSPの `connect-src` を広げない。無料/無登録/広告なしを崩さない。
- 既定モデル `claude-opus-4-8`・adaptive thinking のみ。自動 merge しない（人の承認）。
