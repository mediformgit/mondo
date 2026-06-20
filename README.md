# 問道 — MONDŌ

**問いを、力に。** — 生成AI（Claude）の使いこなしに特化した、無料の教育サイト。

文系も理系も、初心者から本質まで。覚えるのは“呪文”ではなく、一生もののスキル＝**問いを立てる力**。
ブラウザ上で実際にClaudeを動かせる **道場（Playground）** 付き。

---

## 何が入っているか

| ルート | 内容 |
|---|---|
| `/` | トップ。思想・三つの道・型のプレビュー・文理を問わない使い方 |
| `/learn` | カリキュラム（入門 → 実践 → 探究 の3トラックで体系化した講義群） |
| `/learn/[slug]` | 各講（前後ナビ・before/after比較・気づき・道場への導線つき） |
| `/patterns` | 型ライブラリ（再現性のあるプロンプト・パターン集） |
| `/playground` | ブラウザ内Playground（デモ / 自分の鍵モード） |
| `/about` | マニフェスト（なぜ無料で、なぜ最高品質か） |
| `/made` | つくられ方（Colophon）。運営者がClaudeに与えた指示文の公開＋オープンソースへの導線 |
| `/privacy` | プライバシーと免責（クッキーなし・登録なし・広告なし、計測方針） |

> 収録数（講義 / 型 / 道場の例）は固定ではなく増えていきます。現在の正確な件数は `npm run check` の出力で確認できます。

### Playground の2モード

- **デモモード（鍵なし）** — 登録不要。用意された実例にAIが応答する“素振り”。初心者を締め出さない。
- **自分の鍵モード（BYOK）** — 自分の Anthropic API キーを入力すると自由に対話できる。
  キーは **ブラウザの `localStorage` にのみ** 保存され、通信は **ブラウザから直接 Anthropic へ**。
  本サイトのサーバーはキーもメッセージも一切受け取らず、保存もしません
  （`anthropic-dangerous-direct-browser-access` ヘッダを使用）。
  使用モデル: `claude-opus-4-8` / `claude-sonnet-4-6` / `claude-haiku-4-5`。
  Opus / Sonnet では「思考を表示」（adaptive thinking の要約表示）も切替可能。

---

## 技術スタック

- **Next.js 14**（App Router, 静的書き出し中心）+ **TypeScript**
- **Tailwind CSS 3** によるデザインシステム（墨＝sumi ink / 和紙＝washi / 朱＝vermilion）
- **Framer Motion**（円相アニメーション・スクロール演出）
- フォント: **Shippori Mincho**（見出し）/ **Zen Kaku Gothic New**（本文）/ **JetBrains Mono**
- サーバーレス関数・データベース・APIキーは **不要**（純粋な静的サイト + クライアント直結）

コンテンツ（講義・型・Playgroundの例）はすべて型付きのデータとして
`lib/lessons.ts` `lib/patterns.ts` `lib/presets.ts` にまとまっています。編集はここから。

---

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
npm run start    # 本番ビルドを配信
```

> 初回ビルド時、`next/font` が Google Fonts を取得します（ネットワーク必要）。

---

## Git リポジトリ

この `mondo/` フォルダ自体が **Git リポジトリのルート**（＝ Next.js アプリがルート）です。
そのまま GitHub に push すれば、Vercel は Root Directory の変更なしで認識します。

```bash
# まだリモートが無い場合
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`main` への push と、すべての Pull Request で GitHub Actions（[ci.yml](.github/workflows/ci.yml)）が
`lint` と `build` を実行し、壊れた変更がデプロイに流れるのを防ぎます。

## Vercel へのデプロイ

1. 上記リポジトリを GitHub に push。
2. [Vercel](https://vercel.com/new) で Import（Framework は自動で **Next.js**）。
   - Root Directory は **既定（リポジトリ直下）のまま**でOK。
3. **Settings → Environment Variables**（任意・推奨）:
   - `NEXT_PUBLIC_SITE_URL = https://<本番ドメイン>`（`sitemap.xml` / OGP に使用）
4. Deploy。

CLI で行う場合:

```bash
npx vercel        # 初回
npx vercel --prod # 本番反映
```

## 安全な更新フロー（推奨）

Vercel の Git 連携を繋ぐと、**本番を直接いじらずに**更新できます。

1. ブランチを切る `git checkout -b feature/add-lesson`
2. 内容を編集（多くは `lib/*.ts` のデータ追加だけ）
3. push して **Pull Request** を作成
4. → GitHub Actions が lint/build を検証 ＋ Vercel が **PR 専用プレビューURL** を自動生成
5. プレビューで実機確認 → `main` に merge → 本番へ自動デプロイ

---

## 思想・ライセンス・貢献

このプロジェクトには、最上位の文書 **[PRINCIPLES.md（綱領）](PRINCIPLES.md)** があります。
コード・デザイン・将来のあらゆる変更（人もAIも）は、まずこれに従います。サイトが大きくなっても、芯を手放さないための“契約”です。

- **綱領** → [PRINCIPLES.md](PRINCIPLES.md)（不可侵の原則・設計上の不変条件・判断テスト）
- **AI向けガイド** → [CLAUDE.md](CLAUDE.md)（将来のセッションが思想と技術的不変条件を引き継ぐ）
- **貢献の作法** → [CONTRIBUTING.md](CONTRIBUTING.md)（思想チェック付き・採否は運営者が最終判断）
- **行動規範** → [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) ／ **脆弱性報告** → [SECURITY.md](SECURITY.md)

### ライセンス（デュアル）

| 対象 | ライセンス |
|---|---|
| コード | **MIT** → [LICENSE](LICENSE) |
| コンテンツ本文（講義・型・例の文章） | **CC BY-SA 4.0** → [LICENSE-CONTENT.md](LICENSE-CONTENT.md) |
| ブランド（名称・ロゴ・公式ドメイン） | 権利留保（再利用不可） → [BRAND.md](BRAND.md) |

> フォークは歓迎しますが、**なりすまし防止のため「問道 / MONDŌ」の名称・ロゴ・公式ドメインは使わないでください**。利用者には公式ドメイン以外でAPIキーを入力しないよう案内します。

## 原則

- 永久に無料 / 登録不要 / 広告なし
- 入口をせばめない（初心者を置き去りにしない）
- 鍵は、あなたの手元に（BYOK はブラウザ内のみ）
- 知は、独占されない（[PRINCIPLES.md](PRINCIPLES.md)）

> 問いの中に、答えはない。問いの中にこそ、道がある。
