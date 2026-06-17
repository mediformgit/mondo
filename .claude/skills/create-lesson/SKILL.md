---
name: create-lesson
description: テーマ台帳(docs/THEME-BACKLOG.md)または引数のテーマから、問道の講義を1本ゼロから起草し、品質ルーブリックで自己採点・改稿してPRを開く。事実が検証不能なときは出さずに保留し運営者に上げる。
argument-hint: "[テーマ または 台帳の項目名。省略時は台帳の最上位を採用]"
---

# /create-lesson — 講義を1本、起草してPRにする

完全自律で起草し、ルーブリック自己採点に**合格したらPRを開く**。
事実が検証不能なときだけ**保留して運営者に相談**する。**推奨モデル: Opus 4.8**（声・正確さ・自己批評の質のため）。

## 最初に必ず読む
1. [PRINCIPLES.md](../../../PRINCIPLES.md) — 不可侵の原則。
2. [docs/QUALITY-RUBRIC.md](../../../docs/QUALITY-RUBRIC.md) — §0 ハードゲートと陳腐テストに従う。
3. [lib/lessons.ts](../../../lib/lessons.ts) — `Lesson` / `Block` 型の定義、`num` の採番、**声・密度の手本**。
4. [lib/presets.ts](../../../lib/presets.ts) — 道場プリセットの型（講義に「試す」導線を付けるなら追加）。

## 手順

### 1. テーマを決める
- 引数があればそれを採用。無ければ [docs/THEME-BACKLOG.md](../../../docs/THEME-BACKLOG.md) の最上位（`提案中`/`採用`）を採る。台帳が空なら、`/propose-themes` の手順で1件起案してから進める。
- 既存講義と重複しないか確認。

### 2. 事実を検証（§0 ハードゲート）
- 流動的な事実（モデル名・料金・できる/できない・統計・出典）は `web_search` で検証し、出典を控える。
- **検証できない核心的事実があれば、ここで停止。** 講義を出さず、何が確かめられなかったかを運営者に報告して終了。

### 3. 起草
- `Lesson` 型に厳密準拠：`slug`(英語kebab)・`track`・`num`(既存最大+1)・`title`・`subtitle`・`minutes`・`summary`・`goals`(3つ)・`body`(Blockの配列)。
- `body` は単調にしない：`p`/`h`/`list`/`callout`(tip|warn|insight)/`compare`(before/after)/`try` を**目的に応じて混ぜる**。最低1つは `compare`（曖昧な問い→設計された問い）を入れる。
- 文理どちらにも効く例を入れる。声は QUALITY-RUBRIC §2（手本＝既存lessons）。
- 「試す」導線を付けるなら [lib/presets.ts](../../../lib/presets.ts) に対応プリセット（鍵なしデモ用 `demoReply` 付き・**プロンプトに個人情報を入れない**）を追加し、`body` に `{ t:"try", preset:"<id>" }`。

### 4. 自己採点 → 改稿（ルーブリック）
- QUALITY-RUBRIC §1 の8基準を ○/△/× で採点。× があれば §3 の辛口セルフレビューで改稿。
- 合格しなければ、無理に出さず保留して運営者に相談（§0）。

### 5. ビルド確認
- `lib/lessons.ts`（必要なら `lib/presets.ts`）に追記し、**`npm run build` を通す**。型・lintエラーを残さない。

### 6. PRにする（黄金律：草案を出すだけ、merge は人）
- ブランチを切る：`git checkout -b lesson/<slug>`。
- コミット → リモートがあれば `gh pr create` でPR、無ければブランチ作成までで止め、その旨を報告。
- PR本文に**ルーブリック §4 の添付**を必ず入れる：**なぜ陳腐でないか／不確実な点／出典**、加えて8基準の採点結果。
- [docs/THEME-BACKLOG.md](../../../docs/THEME-BACKLOG.md) の該当テーマを `起草済` に更新。

## 守る不変条件（CLAUDE.md と同じ）
- 無料/無登録/広告なし/追跡なしを崩さない。CSPの `connect-src` を広げない。コンテンツは `lib/*.ts` に閉じる。
- 既定モデルは `claude-opus-4-8`、adaptive thinking のみ（`temperature`/`budget_tokens` は使わない）。
- 自動 merge はしない。content は人の承認を経る。
