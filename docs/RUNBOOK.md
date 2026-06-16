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

## 困ったとき
- ビルドが失敗：PRの GitHub Actions ログ、または Vercel の Deploy ログを確認。
- 解析にデータが出ない：Analytics を Enable したか、ブラウザのコンソールにエラーが出ていないか。
- 道場のライブが動かない：APIキーの誤り（401）か、ブラウザ拡張（広告ブロッカー）が通信を妨げている可能性。

> 知は、独占されてはならない。— このサイトを、誰にでも開かれたまま保ち続けてください。
