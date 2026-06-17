---
name: fix-deps
description: 依存パッケージの脆弱性・更新を安全に処理する。npm audit/outdated で点検し、安全な修正をビルド検証つきでPRにする。破壊的変更や安全な更新パスが無い場合は適用せず運営者に上げる。Dependabotが開いたPRのレビューにも使う。
argument-hint: "[なし=点検レポートのみ / security=脆弱性のみ修正 / <パッケージ名>=指定更新]"
---

# /fix-deps — 依存とセキュリティを安全に保つ

Dependabot（無料の検知）と組み合わせて使う「**対応**」の層。**何か起きた時だけ**叩く守りのスキル。
推奨モデル: Opus 4.8（破壊的変更・脆弱性の影響判断のため）。

## 最初に必ず読む／前提
1. [CLAUDE.md](../../../CLAUDE.md) — 作業のお作法（ブランチ衛生・ビルド必須・自動 merge 禁止）。
2. [PRINCIPLES.md](../../../PRINCIPLES.md) §II と [next.config.mjs](../../../next.config.mjs) — 設計上の不変条件、特に **CSP**。
3. 衛生：作業ツリーがクリーンで `main` が最新（`git switch main && git pull`）を確認してから。`gh` 未認証ならPRは作らずブランチまで。

## モード
- **引数なし** … 点検レポートのみ（変更しない）。
- **security** … 脆弱性の解消だけ。
- **`<パッケージ名>`** … その依存の更新。
- **Dependabotブランチ上** … そのPRをレビュー（末尾参照）。

## 手順

### 1. 点検
- `npm audit`（脆弱性）と `npm outdated`（更新可能）を実行。
- 深刻度（critical/high/moderate/low）と、各更新の種別（patch/minor/major）を表に整理。
- `next` 等の重要パッケージは、セキュリティ告知を `web_search` で確認（過去に Next.js の脆弱性対応の実績あり）。

### 2. トリアージ
- **緊急（セキュリティ）** — critical/high を最優先。
- **安全な更新** — patch/minor は低リスク。
- **要注意（major/破壊的）** — 変更履歴・移行ガイドを読み、影響を評価。

### 3. 安全に適用
- セキュリティ・patch/minor … 対象を狙って更新（`npm install <pkg>@<version>`）。`npm audit fix` は可だが **`--force` は使わない**（major を巻き込み壊しやすい）。
- major/破壊的 … 移行ガイドに沿って慎重に。判断が要る／製品挙動に影響するなら **適用せず運営者に上げる**。
- `package-lock.json` も更新する。

### 4. 検証（安全ゲート・必須）
- **`npm run build` を通す**（型・lint 含む）。通らなければ **戻して**（`git restore .` / ブランチ破棄）、何が壊れたかを報告。
- **CSP/セキュリティヘッダの維持を確認**：[next.config.mjs](../../../next.config.mjs) の `headers()`／CSP 文字列が**意図せず変わっていない**こと。`next`（特に major）を上げた時は、`next start` ＋ `curl -sI http://localhost:3000` で `Content-Security-Policy` に **`connect-src 'self' https://api.anthropic.com` だけ**が出ることを実測。挙動が変わっていたら **止めて報告**（BYOK の生命線）。

### 5. PR（自動 merge 禁止）
- `git checkout -b deps/<内容>` → コミット → PR（`gh` 認証済みなら `gh pr create`、無ければブランチまで報告）。
- PR本文に：**何を・なぜ（CVE/告知リンク）・リスク（種別）・検証したこと（build 緑・CSP 維持）**。

### Dependabot PR のレビュー（GitHub 連携後）
そのブランチで build と CSP 確認を回し、変更履歴を読み、**merge 可否を所見として報告**。判断は人。

## 守る不変条件
- **CSP・セキュリティヘッダを弱めない。** `connect-src` は `self` と `https://api.anthropic.com` のみ。
- `--no-verify`・フック無効化・署名スキップをしない。**ビルドゲートを飛ばさない。**
- **自動 merge しない。** 安全に直せないものは **保留して運営者に上げる**。
- 既定モデル `claude-opus-4-8`。`next` は**修正済み・サポート中**のバージョンを保つ。

> 守りのスキル。確実に直せる時だけ直し、迷ったら止める。サイトの信頼（特に BYOK の鍵の安全）を最優先に。
