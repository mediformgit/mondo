---
name: create-preset
description: 道場(Playground)の例＝プリセットを1つ起草し、品質ルーブリック(§1+§7)で自己採点・改稿してPRを開く。鍵なしデモ用の高品質な demoReply 付き。検証不能な事実は出さず保留。
argument-hint: "[紐付ける講義/型のslug、または主題]"
---

# /create-preset — 道場のプリセットを1つ作る

[lib/presets.ts](../../../lib/presets.ts) の `Preset` 型に沿って、道場の例を1つ作る。これは
**鍵なしデモモードで動く例**であり、講義・型の「試す」導線の中身になる。**推奨モデル: Opus 4.8 / effort 高め**（`demoReply` の質が肝）。

## 最初に必ず読む
1. [PRINCIPLES.md](../../../PRINCIPLES.md) — 不可侵の原則（特に④鍵・データ、②非商品化）。
2. [docs/QUALITY-RUBRIC.md](../../../docs/QUALITY-RUBRIC.md) — **§0＋§1＋§7 プリセットの追加基準**に従う。
3. [lib/presets.ts](../../../lib/presets.ts) — `Preset` 型（`id`/`title`/`category`/`system?`/`user`/`demoReply`）と既存例（声・粒度の手本）。
4. 紐付け先の [lib/lessons.ts](../../../lib/lessons.ts) / [lib/patterns.ts](../../../lib/patterns.ts)。

## 手順
1. **主題と紐付け先を決める** — 引数の講義/型に対応させる。題材は既存プリセットと**重複させない**。
2. **事実検証（§0）** — `demoReply` に流動的な事実を書くなら検証・出典。検証不能なら**保留→報告**。`demoReply` は事実より“技法の体現”を優先し、固有の数値は控えめに。
3. **起草** — `Preset` 型に準拠：
   - `user` … **それ自体が“良い問い”の手本**になる入力（曖昧な悪例をあえて出すなら意図が伝わる形で）。
   - `system?` … 役割・前提（任意）。
   - `demoReply` … **本物のClaudeらしい高品質な回答**。具体的・簡潔・その技法を実演。slop禁止。
   - `category` … `入門`/`実践`/`探究`/`型` のいずれか。
   - **個人情報・実在の機微情報を入れない**（`user`・`system`・`demoReply` すべて）。
4. **導線をつなぐ（任意）** — 対応する講義/型の `body` に `{ t:"try", preset:"<id>" }`、または `Pattern.preset` を設定。
5. **自己採点→改稿** — §1＋§7（デモの質・教育的な問い・紐付け・安全・非重複）。× は改稿、無理なら保留。
6. **ビルド** — `lib/presets.ts`（＋紐付け先）に追記し **`npm run build` を通す**。
7. **PR** — `git checkout -b preset/<id>` → コミット → PR（無ければブランチまで報告）。本文に**§4の添付＋採点結果**。

## 守る不変条件
- 鍵・プロンプト・データはユーザーの手元（プリセットに個人情報を残さない）。`lib/*.ts` に閉じる。
- 既定モデル `claude-opus-4-8`・adaptive thinking のみ。自動 merge しない。
