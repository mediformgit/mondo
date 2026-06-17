# CLAUDE.md — このリポジトリで作業するAIへ

**最初に [PRINCIPLES.md](./PRINCIPLES.md)（綱領）を読むこと。** それがこのプロジェクトの最上位の判断基準です。
このファイルは、綱領を技術作業に落とし込んだ実務ガイドです。人が読んでも構いません。

問道（MONDŌ）は、生成AI（Claude）の使いこなしを教える**無料・無登録・広告なし**の教育サイトです。
教えるのは“呪文”ではなく**「問いを立てる力」**。文系・理系を問いません。

---

## 絶対に守る不変条件（綱領 I・II の要約）

変更を加える前に、これを破っていないか必ず確認する。破る変更は、便利でも採用しない。

1. **無料・無登録・広告なし・追跡なし。** 課金機能、サインインの壁、行動追跡、ダークパターンを足さない。
2. **BYOKの鍵はブラウザの外に出さない。** ユーザーのAPIキー／プロンプト本文を、運営者サーバーやサードパーティへ送る設計を作らない。
3. **CSPの `connect-src` は `self` と `https://api.anthropic.com` のみ**（[next.config.mjs](./next.config.mjs)）。ここを広げる変更は原則違反の赤信号。どうしても必要なら、鍵が漏れないことを設計で証明してから。
4. **運営者が課金を負う“本物AIの無料デモ”を安易に作らない。** 「デモ＝定型応答（[lib/presets.ts](./lib/presets.ts) の `demoReply`）／自由対話＝BYOK」を保つ。
5. **計測はクッキーレス・無個人情報。** カスタムイベントにプロンプト本文や個人情報を含めない（現状 `lesson_complete{slug}` と `playground_send{mode,model}` のみ）。
6. **入口をせばめない／陳腐にしない／文理を分けない。** 初心者にも開かれ、かつ安易・量産的でないこと。

判断に迷う追加・変更は、PRINCIPLES.md §IV の判断テストを通すこと。

---

## どこに何があるか

- **コンテンツはすべてデータ。** 講義 [lib/lessons.ts](./lib/lessons.ts) ／ 型 [lib/patterns.ts](./lib/patterns.ts) ／ 道場の例 [lib/presets.ts](./lib/presets.ts) ／ サイト情報 [lib/site.ts](./lib/site.ts)。**多くの更新はここのデータ追加だけで完結**する。ページ・ナビ・進捗・sitemapは自動生成。
- 道場（Playground）: [components/playground/playground.tsx](./components/playground/playground.tsx)（BYOK・ブラウザ直結ストリーミング）。
- 進捗（localStorage）: [components/progress.tsx](./components/progress.tsx)。
- デザインシステム: [app/globals.css](./app/globals.css) と [tailwind.config.ts](./tailwind.config.ts)。

## デザイン言語（陳腐にしないために）

- 墨（sumi ink）の地、和紙の文字色、**朱（vermilion, `--shu`）**のアクセント、金（`--kin`）は控えめに、藍（`--ai`）は情報・思考に。
- 見出しは**明朝（Shippori Mincho）**、本文は Zen Kaku Gothic New、コードは JetBrains Mono。
- 円相（ensō）・落款（問の印）・間（余白）を活かす。汎用的な“AIっぽい”紫グラデや量産フォントは使わない。
- アクセシビリティ（キーボード、コントラスト、`prefers-reduced-motion`）を守る。

## API / モデル（Claude）

- 既定モデルは `claude-opus-4-8`。選択肢は Opus 4.8 / Sonnet 4.6 / Haiku 4.5。
- adaptive thinking のみ（`thinking: {type:"adaptive"}`）。`temperature`/`top_p`/`budget_tokens` は送らない（400になる）。
- 思考表示は `display:"summarized"`。Anthropic SDK／APIの詳細が要るときは `claude-api` スキルを参照。

## 作業のお作法

- **本番を直接いじらない。** ブランチ → 変更 → PR → Vercelプレビューで確認 → merge。
- **ブランチ前の衛生**：作業ツリーがクリーンで `main` が最新であること（`git switch main && git pull`）を確認してから `git checkout -b`。汚れている／別ブランチなら、まず整えるか運営者に確認。`gh` 未認証ならPRは作らずブランチまでで報告。
- 変更後は **`npm run build` を通してから**「完了」と言うこと。型・lintのエラーを残さない。
- **質の伴わないものは出さない。** タスク完遂のために凡庸なものを通すより、「保留・不採用」を選ぶ（[QUALITY-RUBRIC.md](./docs/QUALITY-RUBRIC.md) §1）。
- 新規ファイルや大きな変更は、PRINCIPLES.md §IV のチェックリストを満たすことを確認する。
- 詳しい運用は [docs/RUNBOOK.md](./docs/RUNBOOK.md)、貢献の作法は [CONTRIBUTING.md](./CONTRIBUTING.md)。
- **コンテンツ制作スキル**（[.claude/skills/](./.claude/skills/)）：講義のネタ出し `/propose-themes`（→ [docs/THEME-BACKLOG.md](./docs/THEME-BACKLOG.md)）／講義本文 `/create-lesson`／型 `/create-pattern`／道場プリセット `/create-preset`／既存講義の鑑定・改善 `/improve-lesson`。**すべて [docs/QUALITY-RUBRIC.md](./docs/QUALITY-RUBRIC.md)（§0〜§5の核＋§6型・§7プリセット・§8改善の追補）に従う。** 検証不能な事実は出さず保留。改善は欠陥を直すが**均一化しない**。

> サイトが大きくなるほど、芯は薄れやすい。新しいセッションのたびに、PRINCIPLES.md から始めること。
