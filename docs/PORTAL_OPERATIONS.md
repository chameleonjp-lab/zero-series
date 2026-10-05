# ポータルの運用

初期の静的ページは8作品を固定掲載し、正式URLと配備資産の照合が済んだ作品だけプレイ入口を有効にする。画像は実画面の採用確認が済むまで画像準備中とする。全ランキングは未接続で、架空の記録を本番に表示しない。ゲーム、スコア送信、DBの変更は本リポジトリの公開に含まれない。

## ローカル確認

Node.js 24で `npm ci`、`npm test`、`npm run build` を実行する。`npx playwright install --with-deps chromium webkit` の後、`npm run test:browser` でブラウザ検査。`npm run serve` でdistを確認できる。ライブラリは開発・検査用のみで、ページに外部ランタイム依存はない。

`src/catalog.js` が紹介・公開状態・確認済みURL・出典の正本。`scripts/build.mjs` が静的HTMLを生成し、JavaScript無効でも作品情報を残す。生成物はdist内のみ。READMEと最初の計画書は過去の正本として保持する。

## 公開

公開先はGitHub Pages。本リポジトリのmainへの変更で、単体・Chromium・WebKit検査後にdistだけを配信する。配信対象は静的HTMLと実行に必要なJS/CSS・配備manifestのみ。テスト・docs・node_modules・.gitは配信しない。HTMLの `source-revision` と `deployment.json` の `sourceRevision` は、workflowが取得した完全なソースSHA。公開時刻はActions記録を使用し、commit時刻で代用しない。

ユーザーの「計画書に従いページ公開まで実装を進めて完了させる」という指示を、文書承認済み後の実装とこのポータル公開の承認として扱う。ゲーム本体の公開・改修やDB変更の承認には拡張しない。

## ランキング接続

本番のadapterにはreaderを注入しない。各scopeの版隔離、登録名best集約、公開read-only権限、単位、server順位と順序を確認できるまでenabled=falseを維持する。架空fixtureを使った検査の合格は実接続の合格を意味しない。backend保証が不足する既存RPCにルール版ラベルを足して接続しない。

## 復旧

公開不具合時は影響と対象SHAを確認し、承認された範囲で通常のrevert PRにより前のソースへ戻す。検査成功後に再配備し、HTML・deployment.json・資産を照合する。force pushやランキングDBの修正・削除を復旧手段にしない。初回公開前の状態へ戻す必要がある場合は、ページ停止の対象と影響を明示して扱う。

実iPhone・VoiceOver試験はクラウド上のWebKit模擬検査とは別で、実施していないものを実施済みと記載しない。
