# 問道 MONDŌ 運用手順書（運営者向け）

このドキュメントは、**あなた（運営者）が手を動かす作業**だけをまとめたものです。
コードの編集は基本不要で、ほとんどが GitHub と Vercel の画面操作・コマンドです。

- 開発・技術仕様 → [README.md](../README.md)
- このファイル自体もリポジトリに含まれるので、`git push` すれば常に手元に残ります。

---

# A. サイトの公開まで（一度きり）

> 所要：30〜60分。GitHub と Vercel のアカウントが必要（どちらも無料）。

### A-1. GitHub にコードを上げる
- [ ] GitHub で**空のリポジトリ**を新規作成（READMEなし・.gitignoreなしで作る）。
- [ ] 端末で、このフォルダ（`mondo/`）からリモートを繋いで push：
  ```bash
  git remote add origin https://github.com/<あなた>/<リポジトリ名>.git
  git push -u origin main
  ```
- [ ] push後、GitHub の **Actions** タブで CI（lint+build）が ✅ になるのを確認。

### A-2. Vercel にデプロイ
- [ ] [vercel.com/new](https://vercel.com/new) で、上のリポジトリを **Import**。
- [ ] Framework が **Next.js** に自動判定されることを確認（**Root Directory は既定のままでOK**）。
- [ ] **Deploy** を押す。数分で `https://<プロジェクト>.vercel.app` が公開される。

### A-3. 環境変数（任意・推奨）
- [ ] Vercel → 対象プロジェクト → **Settings → Environment Variables**：
  - `NEXT_PUBLIC_SITE_URL` = `https://<公開URL>`（`sitemap.xml`・OGP・SEOに使用）
- [ ] 設定後、**Deployments → 最新 → Redeploy** で反映。

### A-4. アクセス解析を有効化（クッキー不要）
- [ ] Vercel → プロジェクト → **Analytics** タブ → **Enable**（Web Analytics）。
  - コード側（`<Analytics />`）は実装済み。ダッシュボードで有効化するだけ。
  - クッキーを使わないため、多くの場合この時点で同意バナーは不要。
- [ ] 公開URLを数回開き、数分後に Analytics にページビューが出れば成功。

### A-5. 独自ドメイン（任意）
- [ ] ドメインを取得（年 約¥1,500〜4,000）。
- [ ] Vercel → **Settings → Domains** で追加し、表示されるDNS設定を反映。
- [ ] 反映後、`NEXT_PUBLIC_SITE_URL` を独自ドメインに更新 → Redeploy。

### A-6. 公開後チェック
- [ ] `https://<URL>/` 表示・`/learn`・`/patterns`・`/playground`・`/about` が開く。
- [ ] 道場の**デモモード**で送信 → 返答がストリーミング表示される。
- [ ] `https://<URL>/sitemap.xml` と `/robots.txt` が表示される。
- [ ] ブラウザのタブに 問 のアイコン（朱）が出る。

---

# B. 運用（日常）

## B-1. 内容を更新する（安全フロー）
**本番を直接いじらない。** 必ずブランチ → PR → プレビュー確認 → merge。

```bash
git checkout -b edit/lesson-add      # 1) ブランチを切る
# 2) 編集（下表の場所だけでほぼ完結）
git add -A && git commit -m "内容を編集"
git push -u origin edit/lesson-add   # 3) push
```
- [ ] GitHub で **Pull Request** を作成。
- [ ] PRに付く **Vercel の Preview URL** で実機確認（本番には影響しない）。
- [ ] 問題なければ **Merge** → `main` が自動で本番デプロイ。

### 編集する場所（コードを書かずにデータを足すだけ）
| やりたいこと | 編集するファイル |
|---|---|
| 講義を追加・修正 | [`lib/lessons.ts`](../lib/lessons.ts) |
| 型（パターン）を追加 | [`lib/patterns.ts`](../lib/patterns.ts) |
| 道場の例を追加 | [`lib/presets.ts`](../lib/presets.ts) |
| サイト名・ナビ・説明 | [`lib/site.ts`](../lib/site.ts) |

> 講義を1件足すと、ページ・前後ナビ・進捗カウント・`sitemap.xml` は自動で更新されます。

### 自動ガード（公開前に整備済み）
PR・週次・リリースで自動的に守られます。手元でも同じコマンドで確認できます。
| いつ | 何を | 手元での実行 |
|---|---|---|
| 毎PR（CI） | ビルド＋lint＋**内部リンク整合**＋**セキュリティ不変条件** | `npm run check` ／ `npm run check:security` |
| 週次（health.yml） | ビルド健全性＋**外部リンク切れ** | `npm run check:external` |
| リリース時（release.yml） | merge済みPRから**変更履歴**を自動生成（GitHub Release） | `npm run changelog`（CHANGELOG.md を再生成） |

- **セキュリティ不変条件**＝CSPの `connect-src` がAnthropicのみ・ヘッダ揃い・鍵は playground 限定・外部送信なし（BYOKの生命線）。これに違反するPRはCIで落ちます。
- 依存・脆弱性の検知は Dependabot、対応は `/fix-deps`（B-3）。

## B-2. アクセス解析の見方（改善の判断材料）
- Vercel → **Analytics**：人気ページ＝伸ばすべき場所。
- **Custom Events**（実装済み・個人情報なし）：
  - `lesson_complete`（どの講が修了されているか）
  - `playground_send`（デモ/ライブ別・モデル別の利用、※入力文は一切送らない）

## B-3. 保守（壊さないための定期作業）
- [ ] **月1回**：依存パッケージの点検
  ```bash
  npm audit            # 脆弱性の確認
  npm outdated         # 更新可能なものを確認
  ```
  更新は必ずブランチ＋PRで（特に `next`。過去にセキュリティ更新あり）。
- [ ] **四半期に1回**：内容の鮮度レビュー
  - モデル名・操作手順・例が古くなっていないか。
  - 「教えるスキル（問いを立てる力）」は古びないが、**具体例は古びる**。
- バックアップ：**Git自体がバックアップ**。GitHubに push されていれば安心。

## B-4. コスト監視
- 通常は **¥0**（静的サイト＋デモは定型＋ライブはユーザーの鍵）。
- 見るべきは Vercel の **Usage**（帯域・関数）。バズで無料枠超過の兆候が出たら通知設定を。
- 固定費が出るのは**独自ドメインの年更新**くらい。

## B-5. ⚠️ 増やすと課金が始まる操作（避ける/慎重に）
- **サーバー側で鍵を持つ「無料の本物AIデモ」**：Anthropic利用料を運営者が全額負担・悪用で青天井。
  → 現状の「デモ＝定型／自由＝BYOK」を維持するのが最も持続可能。
- 動画・大容量画像の**自前配信**（帯域を食う）→ 動画は YouTube 等の外部へ。
- ログイン・問い合わせDB等で**個人情報を集め始める** → DB費用＋個人情報保護法対応が発生。
  現状の「無登録・クッキーなし」を守れば回避できる。

---

# C. オープンソースとして運用する（公開する場合）

> 思想（[PRINCIPLES.md](../PRINCIPLES.md)）と一貫し、横展開・継続性・信頼の面で価値が大きい。
> ただし「なりすまし」と「メンテナ負荷」の2点を設計でガードする前提。

### C-1. 公開前チェック
- [ ] リポジトリに**秘密が含まれていない**こと（BYOK設計なので本来ゼロ。`.env*.local` は `.gitignore` 済み）。
- [ ] ライセンスが揃っている：[LICENSE](../LICENSE)（MIT）／[LICENSE-CONTENT.md](../LICENSE-CONTENT.md)（CC BY-SA 4.0）／[BRAND.md](../BRAND.md)（ブランド留保）。**配置済み**。

### C-2. なりすまし対策（BYOKの要）
- [ ] **公式ドメインを明示**：READMEは対応済み。道場の「鍵の扱い」モーダルにも公式URLを1行入れると万全
  （`components/playground/playground.tsx` の `KeyInfoModal`。`NEXT_PUBLIC_SITE_URL` を表示する形が簡単）。
- [ ] [BRAND.md](../BRAND.md) の通り、フォークは別名・別ロゴで、という方針を README/About で周知。

### C-3. GitHub の設定
- [ ] **Settings → Branches → Branch protection（`main`）**：
  - 「Require a pull request before merging」をON（本番直編集を禁止）。
  - 「Require status checks（CI）to pass」をON（[ci.yml](../.github/workflows/ci.yml) を必須に）。
- [ ] Issue テンプレート（[.github/ISSUE_TEMPLATE](../.github/ISSUE_TEMPLATE)）・PRテンプレートは配置済み。
- [ ] **Security → Private vulnerability reporting** をON（[SECURITY.md](../SECURITY.md)）。
- [ ] （任意）Discussions をON、`good first issue` ラベルで初参加を歓迎。

### C-4. ⭐ 思想を抜け落ちさせない仕組み（最重要）
サイトが大きくなるほど芯は薄れる。次の多層で防ぐ：

1. **[PRINCIPLES.md](../PRINCIPLES.md) が最上位文書。** すべての判断はここから。リポジトリの中心に置き続ける。
2. **[CLAUDE.md](../CLAUDE.md) で将来のAIセッションが自動継承。** 別のセッションで作業しても、まず綱領と技術的不変条件（CSP/BYOK等）を読む構造。
3. **PRテンプレの「思想チェック」**（[PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)）で、**毎回の変更が綱領 §IV を通過**する。
4. **四半期レビュー（B-3）に綱領点検を追加**：実装が PRINCIPLES.md から逸れていないか、不可侵の原則 7 項目を1つずつ照合。
5. **新しい貢献者・AIには、まず PRINCIPLES.md を案内**してから着手してもらう。

> 運営者として迷ったときの最終判断基準も PRINCIPLES.md。便利さは原則の上位に来ない。

### C-5. メンテナ負荷を抑える
- **キュレーション型**：PR歓迎・採否は運営者。質を保てないPRは丁寧に見送る（[CONTRIBUTING.md](../CONTRIBUTING.md) に明記済み）。
- テンプレートで提案の質を底上げ。無理なら一旦クローズしてよい。OSS＝無制限の対応義務ではない。

---

# D. 別の無料ホストへ移す / 公開を止める

このサイトは**完全な静的サイト**（サーバAPIなし・道場はブラウザから Anthropic 直結）なので、
どの無料静的ホストでも動く。移設で気をつけるのは **CSP（鍵保護の生命線）の配信方法**だけ。

## D-1. いまの公開を止める（Vercel・画面操作のみ）
> コード変更は不要。GitHub のコードは消えない＝いつでも再公開できる。
- [ ] **新規デプロイだけ止める**（URLは残す）：Vercel → プロジェクト → **Settings → Git → Disconnect**。
- [ ] **公開そのものを止める**（URLも閉じる）：**Settings → 最下部 → Delete Project**。
  - リポジトリは無傷。再開は [vercel.com/new](https://vercel.com/new) から Import し直すだけ。

## D-2. Cloudflare Pages へ移す（推奨・無料）
> CSP を [public/_headers](../public/_headers) がそのまま配るので、鍵保護（綱領III）を完全に維持できる。
- [ ] [Cloudflare Pages](https://pages.cloudflare.com/) で **GitHub リポジトリを接続**。
- [ ] ビルド設定：
  - **Build command**: `STATIC_EXPORT=1 npm run build`
  - **Build output directory**: `out`
  - **Environment variables**: `STATIC_EXPORT` = `1`（＋任意で `NEXT_PUBLIC_SITE_URL` = `https://<新URL>`）
- [ ] デプロイ後、`https://<プロジェクト>.pages.dev` が公開される。
- [ ] **最重要の確認**：`curl -sI https://<新URL>/` で `content-security-policy` に
      `connect-src 'self' https://api.anthropic.com` **だけ**が出ること（BYOK の生命線）。
- [ ] 道場のデモ送信／`/sitemap.xml`／`/robots.txt`／タブの問アイコン（A-6 と同じ）を確認。

> 仕組み：`STATIC_EXPORT=1` のとき [next.config.mjs](../next.config.mjs) が `output: "export"` に切替わり `out/` に静的書き出し。
> CSP ヘッダは public/_headers が配る（Vercel 経路の `headers()` と同期。`npm run check:security` が**両方**を検査）。
> Vercel 用の既定ビルド `npm run build` は従来どおり動くので、どちらの経路も壊れない。

## D-3. 移設に伴う注意
- **アクセス解析は止まる**：現在の計測は Vercel Web Analytics（`<Analytics />`）。静的書き出しでは自動で無効化される。
  Cloudflare で続けるなら **Cloudflare Web Analytics（無料・クッキーレス）** を有効化する。ただし計測ビーコンのため
  CSP を最小限ゆるめる必要があり、綱領III に関わる変更なので**別PRで慎重に**。
- **新ドメイン**：完全無料の独自ドメインは実質難しい（無料サブドメイン `*.pages.dev` で十分）。
  独自ドメインを使うなら年額で取得し、Cloudflare 側で割当て＋`NEXT_PUBLIC_SITE_URL` を更新。
- **GitHub Pages は非推奨**：HTTP ヘッダを設定できず CSP が `<meta>` 止まりになり、鍵保護が弱まる（綱領III）。

---

## 困ったとき
- ビルドが失敗：PRの GitHub Actions ログ、または Vercel の Deploy ログを確認。
- 解析にデータが出ない：Analytics を Enable したか、ブラウザのコンソールにエラーが出ていないか。
- 道場のライブが動かない：APIキーの誤り（401）か、ブラウザ拡張（広告ブロッカー）が通信を妨げている可能性。

> 知は、独占されてはならない。— このサイトを、誰にでも開かれたまま保ち続けてください。
