# 初回ポータルの独立レビュー

確認日時: 2026-10-05 03:58 UTC。実装担当とは別のレビュー担当が、実装ファイルを変更せずに検査した。対象は `chameleonjp-lab/zero-series` の初回静的ポータル候補。レビュー時の基準 HEAD は `2b5cb7cc001969bf1f92fe0f3b38edd9fac2e0a1` であり、未commitの追加実装を含む。最終公開ソース SHA と実配備確認は公開確認記録で確定する。

## 判定

**現在の限定した公開範囲に、未解消の公開阻害指摘はない。** 8作品の静的紹介、根拠を確認した2作品の入口、全8件のランキング未接続表示、画像準備中のplaceholderとして公開することを推奨する。公開workflowの成功と公開後の候補SHA・全資産hashの照合は、別の公開確認工程で実施する。

この判定は実ランキング接続、実ゲーム画像の採用、実iPhone・VoiceOver、各ゲームの通しプレイの合格を意味しない。これらの残件は [受入記録](acceptance.md) に明記されている。

## 検査範囲と根拠

- 掲載台帳、HTML生成、CSS、portal、ランキングadapter/request/store/view、単体・ブラウザ検査、package/lock、Playwright設定、Pages workflow、運用・掲載・受入記録を読取確認した。作業範囲に適用されるAGENTS.mdは見つからなかった。
- 全8件が固定allowlistと固定順に従う。publishedはKaisen/FFの2件だけで、正式URL・配備SHA・取得資産hash・ホーム確認の根拠がある。FFの現行mainと配備SHA、配備バイトのreplay検査と直接live検査の限界を混同していない。他6件はplayUrl=nullで、予定・準備中・公開確認中を区別している。
- productionの全ranking.enabledはfalse、API readerの注入もない。外部endpoint、開始・送信・再開RPC、DB接続、永続storage、広告・解析を追加していない。架空fixtureは検査コードにのみ置かれ、配信物へコピーされない。
- buildはvalidateCatalogを実行し、URLの固定対応と根拠を検査する。文字列をHTML escapeし、表示名はtextContentで描画する。ランキングは最大5行、serverの順位・同率・順序を保持し、応答scope/契約/型を検査する。生DB項目はUIモデルへ渡さない。
- distはHTML・実行用JS/CSS・manifestに限定される。entryと現在の全JS依存に候補SHA queryを付け、manifestで全HTML/JS/CSSのSHA-256を記録する。workflowは検査後にmainのみ配備し、書込権限はdeploy jobのPages/OIDCに限定される。
- READMEと初期の2計画書はHEADと同じblobで不変。READMEは `519fa0d048e87e3364ec826045a569961920b12e`、要件書は `8e8548991bf6d490658d9b4afd268456496e0709`、実装計画書は `69a6d5f2a922d96785c1fd5af69100146b17fc87`。

## 解消した指摘

|指摘|修正・再確認|
|---|---|
|公開先のsubpathをBASE_URLに指定すると一部検査がorigin rootへ移動する|ブラウザ検査を相対URLへ修正。外部要求の判定もoriginとsrc prefixを照合する|
|all-modes停止APIの不整合と、mode未確認の作品が停止されない|adapterのmode列挙とnull-modeを整合。Kaisen停止、FF全mode停止、easy選択後も停止を独立再確認|
|30分を過ぎてcacheを隠すと、要求がないのにloadingが残る|期限超過をerrorとして扱い、行を消す。期限到来・時計・停止・旧応答の単体検査で再確認|
|未接続mode変更時に描画が更新されない|通信しない状態でもsubscriberへ通知。FF easyの表示変更を回帰検査|
|stale表示が更新失敗を伝えない|errorCodeがあるstaleに更新失敗の文言と再試行を表示|
|select/retryの境界contrastが3:1を下回る|境界を#728b98へ修正。control背景に4.77:1、card背景に4.17:1を独立計算|
|運用文書が実行用srcを配信しないと記載する|実際のHTML/JS/CSS/manifestの配信範囲へ訂正|

## 実行・確認した検査

レビュー担当が `npm test` を独立実行し、26件すべて合格した。build/portal/ranking各moduleの構文検査、旧文書のblob照合、停止APIのfocused検査、色contrast計算、生成manifestのJSON読取、モバイル・PC検査画像の目視も実施した。

統合担当による最新Chromium/WebKit検査は各14件、計28件合格と報告され、[受入記録](acceptance.md) に記録されている。検査コードと記録を照合し、axe自動検査、幅・200%文字、keyboard/skip link、JS無効、offline、mode切替、テキストとしての表示名、局所状態が含まれることを確認した。性能記録はクラウド模擬条件の一測定と明記され、実機の測定として扱われていない。

## レビュー対象の識別

次の15ファイルをpathの辞書順に並べ、各 `UTF-8 path + NUL + file bytes + NUL` を連結したSHA-256は `38ac358d0478928fdd88c401007111072e532bb9633be4b32bd7e85ae184bc60`。これはレビュー時の実装・検査snapshotを識別し、公開commit SHAの代用にはしない。これらを変更する場合は変更箇所と関連検査を再レビューする。

`.github/workflows/pages.yml`、`package-lock.json`、`package.json`、`playwright.config.js`、`scripts/build.mjs`、`src/catalog.js`、`src/portal.js`、`src/ranking/adapter.js`、`src/ranking/requests.js`、`src/ranking/store.js`、`src/ranking/view.js`、`src/styles.css`、`tests/browser/portal.spec.js`、`tests/catalog.test.js`、`tests/ranking.test.js`。
