# ゼロ シリーズ

ブラウザゲーム8作品の静的な入口ページです。紹介と確認済みのプレイ入口はJavaScript無効でも使えます。カイセン、ファイトフライト、マチマモレ、ゲキチン、ウチオトセの5入口と公開版タイトル画像を掲載し、残る3入口は公開証拠待ち、全8ランキングは版隔離の接続契約待ちです。実プレイ画像・実iPhone確認・今回候補の公開は未完了です。

公開中の旧版: https://chameleonjp-lab.github.io/zero-series/

## 起動と検査

Node.js 24を使用します。

```sh
npm ci
npm test
npm run build
npx playwright install --with-deps chromium webkit
npm run test:browser
npm run verify:candidate
npm run serve
```

`npm run serve` は http://localhost:4173/ を開きます。検査用ライブラリは配信せず、入口に外部ランタイム依存はありません。`verify:candidate` は配信hashを再照合し、Chromium/WebKitの同候補画像と低速性能を `test-results/candidate/` に保存します。低速測定は150ms・1.6Mbps・CPU4倍・cacheなしのChromium模擬で、実iPhone性能の保証ではありません。

システムライブラリを入れられない実行環境では、同じ公式WebKitの起動wrapperを `WEBKIT_EXECUTABLE_PATH` へ指定できます。今回のクラウドではDebian依存をworkspaceに展開して使用しました。通常のCIは標準Playwrightとシステム依存を使用します。テストをskipする設定は追加していません。

## 台帳と画像の更新

`src/catalog.js` が固定8件・正式URLallowlist・公開状態・画像・ranking契約の正本です。最新main、公開source、Pagesブランチ、観測日時を分けて [掲載証拠](docs/evidence/current-games.json) を更新します。正式URLと実配備・全製品資産を確認するまで新入口を有効化しません。

画像は公開製品資産を固定し、Start・新規戦闘・回数記録・送信なしで撮影します。再現スクリプトは `scripts/capture-games.mjs`、条件・入力準備は [撮影記録](docs/evidence/images-current.md) を参照してください。640/960px派生と撮影証拠を揃えてcatalogへ採用します。buildが出典・SHA・実寸・画像hashを検査し、採用した画像だけをdistへコピーします。タイトル画面は実プレイ画像として扱いません。

ランキングは [現行調査と最小変更案](docs/evidence/ranking-current.md) の接続ゲートに従います。公開読取権限、登録名best集約、順位/同点順序、単位、難易度とルール版のbackend隔離を証明して固定bindingを追加するまで未接続です。enabledだけの変更はbuildが拒否します。開始・送信・再開の呼出しは入口にありません。

## PRと公開

専用ブランチからDraft PRを提出し、mainへ直接push・自動マージはしません。CIはPR head SHAの単体・build・Chromium/WebKit・性能検査を行い、同SHAの画面/測定artifactを保存します。ユーザーが「マージしました。後続対応開始」と通知した後に [公開・復旧手順](docs/PORTAL_OPERATIONS.md) で確認します。

```sh
SOURCE_SHA=<公開mainの完全SHA> PAGES_RUN_ID=<成功runのID> npm run verify:publication
```

このコマンドはTLS読取だけでActions・公開HTML・manifest・全配信hashを照合します。2種類のcache hintは実ブラウザのwarm cache検査とは別です。

現在の承認範囲・実装/未検証/外部待ちは [今回の記録](docs/PORTAL_COMPLETION_20261009.md)、条件別の結果は [受入記録](docs/evidence/acceptance.md)、実機操作は [iPhone確認表](docs/evidence/iphone-checklist.md) を参照してください。最初の要件仕様・実装計画書は2026-10-05の履歴として保持しています。
