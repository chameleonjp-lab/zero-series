# ポータルの運用

現在の承認範囲は [2026-10-09実装記録](PORTAL_COMPLETION_20261009.md)。初期計画2件は履歴として保持する。入口の実装・撮影・読取検証・専用ブランチ・Draft PRまで進める。mainへの直接push、マージ、自動マージはしない。ゲーム本体・他repo・DB・送信開始/再開は含めない。

## 現状

固定8作品。正式URLと実配備資産の確認済み5件に入口と公開版タイトル画像を掲載する。センリョウ・ファンタジア・ヌスミダセは正式公開証拠待ち。全8ランキングは未接続。公開製品タイトル画像5件は実プレイ画像の合格ではない。実iPhone/VoiceOverは未実施。

最新main・配備source・Pages branchと観測時刻は [current-games.json](evidence/current-games.json)、画像は [images-current.json](evidence/images-current.json)、読取契約は [ranking-current.md](evidence/ranking-current.md) を参照する。以前の「2入口」「画像準備中」「公開未完了」は過去の初回記録で、今回の状態と分ける。

## ローカル検査

Node.js 24で `npm ci`、`npm test`、`npm run build`。`npx playwright install --with-deps chromium webkit` 後に `npm run test:browser`、`npm run verify:candidate`。`npm run serve` でdistを表示する。候補画像・性能JSONは `test-results/candidate/`。単体・ブラウザfixtureは架空検査データで、実順位の受入証拠とは扱わない。

`src/catalog.js` と `scripts/build.mjs` が静的HTMLと掲載契約を検証する。画像の出典・実寸・派生hashを照合して採用したファイルだけ配信する。distにHTML、必要なJS/CSS、画像、.nojekyll、deployment.jsonだけを置く。全配信ファイルをhash化し、manifest自身は自己参照のため対象外と明記する。画像は撮影版を含む名と派生hash query、JS/CSS importは完全source SHA queryを付ける。

## ランキング

本番のadapterへ `createProductionReader` を注入するが、現時点の固定production bindingは空。各scopeのbackend版隔離・登録名best集約・公開read-only権限・単位・server順位と順序の根拠が揃うまでenabled=falseを維持する。catalogの自己申告ラベルやテストbindingでbuildを通さない。

通信検査は既知の静的資産と採用画像の正確なpath/hashだけを許可する。将来の検証済み読取は正確なhost・RPC・POST body・公開鍵種別だけを許可し、開始/送信/再開、他作品、任意外部先、redirect、WebSocketを拒否する。HTTP POSTだけを理由に書込みとは判定しない。停止はstaleより優先し、通信とcache表示を止める。is_activeを勝手に変更しない。

## マージ後の公開確認

ユーザーの「マージしました。後続対応開始」を受けてから続ける。入口repoのmainへの採用はGitHub Pages workflowで検査後にdistだけを配備する。ゲーム公開やDB変更へ承認を拡張しない。

1. 最新mainの完全SHAと、`.github/workflows/pages.yml` のverify/deploy成功run・成功job・実配備時刻・正式URLを確認する。
2. `SOURCE_SHA=<完全SHA> PAGES_RUN_ID=<成功ID> npm run verify:publication` で、TLS/redirect禁止のGETによりHTML source-revision、deployment.json sourceRevision、全配信hashを照合する。結果を公開証拠へ追記する。
3. cacheなしブラウザで8カード、確認済み入口、画像の版、rank状態、許可外通信0を確認。同じブラウザで通常再訪/戻る/再読込を行い、既存browser cacheを使用した条件と資産版を別に記録する。Node fetchのcache hint2通りをwarm browser cacheの代用にしない。
4. 実iPhone/Safari/VoiceOverの確認を [短い確認表](evidence/iphone-checklist.md) で行う。クラウドWebKitと区別する。ゲームを開始しない。

公開の具体的な承認が不足する最終操作だけは、候補SHA・内容・影響・復元案を揃えて確認する。今回のDraft PR提出段階では公開/A13合格と呼ばない。

## 復旧

影響と採用SHAを確認し、通常のrevert PRで前のソースに戻して検査・再配備・全hash照合を行う。ランキング障害だけなら対象card/scopeを明示してstoppedへ変更するPRを準備できる。承認済みの復旧範囲は再確認しない。DB行削除・スコア改変・force push・他ゲームの変更を復旧手段にしない。
