# 入口ページの受入記録 — 2026-10-09

対象は `chameleonjp-lab/zero-series` の入口ページ。現在の承認範囲は [今回の実装記録](../PORTAL_COMPLETION_20261009.md) に記載する。最初の2計画書と、この文書後半の2026-10-05記録は当時の履歴として保持する。

今回の実装・検査候補は `bd2edf6c58f1b7787a07f285df781cf9bfdc3915`。このSHAを埋め込んだ同一distで、単体56件、build、Chromium/WebKit各21件・計42件、配信hash・画面・性能検査が成功した。skip・対象数削減・判定緩和は行っていない。最後の証拠文書だけを追加したPR headについては、head SHAを直接checkoutするCIのartifactをPRに記録する。**実ランキング、8作品の実プレイ画像、実iPhone/VoiceOver、今回候補の公開まで完了したという判定ではない。**

## 現在の画面と検査

- [検査・画像hash・性能JSON](candidate-20261009/candidate.json)。[Chromiumモバイル](candidate-20261009/portal-chromium-mobile.png)、[Chromium PC](candidate-20261009/portal-chromium-desktop.png)、[WebKitモバイル](candidate-20261009/portal-webkit-mobile.png)、[WebKit PC](candidate-20261009/portal-webkit-desktop.png) は同じ候補SHAの全ページ画像。統合担当が4画面すべてを目視し、タイトル画面5件・3件の準備中表示、固定順、カード内の入口・mode・余白・折返しを確認した。最終の独立判定は [今回のレビュー](review-20261009.md) に分ける。
- Node.js 24の単体56件。既存のadapter/request/store検査に、掲載証拠と画像hash/寸法の改変拒否、固定reader/公開キー/厳密なRPC引数、通信allowlist、BFCacheの中断・復帰を追加した。本番scopeは空であり、実順位の合格証拠にfixtureを使わない。
- Chromium 153.0.8010.12 / WebKit 26.6、各21件。320/375/390/430/768/1280/1440px、タッチ横向き、200%文字・長い作品名/登録名/スコア、44px操作、focus/skip link、JS無効、offline、画像成功/cached/404/decode失敗、順位0/1/4/5/6行・同点・HTML不活性化、mode/版変更・旧応答を検査。axe-coreの対象WCAG自動検査は違反0。
- 戻る処理はpersisted pagehide/pageshowの検査で、再読込なし・選択mode/scroll保持を無条件に確認した。実history back検査はエンジンがBFCacheへ保存した場合の復帰を確認する条件付き検査で、常に実BFCacheへ保存されたとの主張はしない。物理iPhone Safariの復帰挙動は未確認。
- クラウドWebKitはシステム依存をworkspaceに展開したwrapperから同じ公式実行バイナリを起動した。CIは標準Playwright依存を使う。実iPhone、VoiceOver、実機GPUの合格とは区別する。
- [性能](performance.json): 390×844 touch模擬、150ms latency・1.6Mbps download・750Kbps upload、CPU4倍、cold cache。CDP制限を回避するroute.fetch/fulfillを性能測定から除き、検査済みローカル静的serverへのroute.continueで計測。HTML/CSS/JS gzip計30,199B（目標150KB）、初回161,761B（500KB）、採用画像10派生・5作品計142,152B（8作品合計1MB）、LCP652ms（2.5秒）、CLS0（0.1）。全予算内。実ランキング接続後、残り画像採用後、実端末では再測定が必要。

## A01〜A13の現在の判定

| 条件 | 結果・証拠 | 未達 / 未確認 |
|---|---|---|
| A01 | 8作品・固定順、title/h1、余分な作品なし。単体・ブラウザ合格 | なし |
| A02 | 全8mainと配備を再照合。正式5URLだけ有効。最新mainと公開sourceを分離し、正式公開未確認3入口は無効 | 新規3作品の正式公開根拠待ち |
| A03 | 公開製品のタイトル画面5件。出典/権利/版/日付/640・960/hash/alt/16:9/contain/lazy/失敗代替を検査 | 実プレイ画像8件未撮影。残る3件は理由付き準備中 |
| A04 | 画像と順位fixtureを載せた指定幅・PC・縦横・長文の自動検査、同候補画像の目視合格 | 実iPhone縦横、実順位での確認未実施 |
| A05 | 200%文字、44px、focus/keyboard/構造/名前/色/ズーム許可の自動検査合格 | 実VoiceOver未実施 |
| A06 | 最大5行、0/1/4/5/6行、同点順位/返却順を保持するfixture検査合格 | 実backendのルール別・登録名best集約の接続合格なし |
| A07 | mode/版のscope不一致・遅延旧応答を拒否する検査合格 | backend版隔離がなく本番binding追加不可 |
| A08 | 未接続/0件/停止/失敗/staleを区別、timeout/部分失敗/局所再試行/停止優先合格 | 実接続後の実データ検査待ち |
| A09 | 5分/30分、時計逆行、同scope cache、復帰時の期限再判定・旧応答破棄合格 | 実接続後の確認待ち |
| A10 | 表示名textContent、悪意URL/NaN/不正順位/不正画像/許可外引数/秘密キー拒否合格 | なし（実読取応答確認は別残件） |
| A11 | 匿名閲覧。初回RPCゼロ、開始/送信/再開/他ゲーム/任意外部通信を拒否。readerは固定読取RPCだけを実装し本番bindingは空 | FF読取の空probeは到達性だけ。実順位は未取得 |
| A12 | JS無効/offlineでも紹介と5入口が使用可能。ゲーム本体・3D・音声・iframeの先読みゼロ。現在の性能予算合格 | 新画像/実ランキング追加時、実端末で再測定 |
| A13 | 旧公開main `ce51a8d` は開始時HTML/manifest/掲載8資産を照合。今回候補は専用branch/PR検査まで | 今回候補のマージ・Pages配備・全配信hash・warm browser cache確認待ち |

## 完了に必要な外部対応

[掲載台帳](current-games.json)、[画像採用記録](images-current.md)、[ランキング調査とレビュー可能な変更依存](ranking-current.md)、[実iPhone確認表](iphone-checklist.md)、[公開状態](publication.md) に各残件と次の対応を記録する。FFのnormal/easyは候補対応だけで、現行DBにはルール版の分離保証がない。他7作品へ保存名や点数を作らない。DB/ゲーム送信経路の変更案は本PRでは実行しない。

ユーザーの「マージしました。後続対応開始」を受けてから、承認済み公開手順で成功run、正式URL、source-revision、deployment.json、全配信hashを照合する。mainへの直接push・マージ・自動マージはしない。

---

# 履歴: 初回ポータルの受入記録（2026-10-05）

以下は初回時点の結果。2入口・全画像準備中などの件数を現在の状態として用いない。

対象: `chameleonjp-lab/zero-series`。2026-10-05 UTCの初回実装。最初の要件・実装計画書は過去の正本として保持し、この記録で実装結果と残件を区別する。公開承認はユーザーの「ページ公開まで実装を進めて完了させる」という指示に基づく。

## 公開する範囲

8作品の紹介、公開状態、確認済み2作品のプレイ入口、全作品のランキング未接続表示。静的HTMLはJavaScript無効でも読める。画像は全8件で準備中。FFのnormal/easy切替は未接続状態の表示だけを切り替え、通信しない。

mainに採用した候補ソースをGitHub Actionsが検査し、distだけをGitHub Pagesへ配備する。完全SHAをHTMLとdeployment.jsonへ埋め、全JS依存とCSS入口へSHA queryを付加し、配備manifestにSHA-256を記録する。正式公開URL・候補SHA・Actions run・配備後の照合結果は公開確認記録で確定する。

## 検査結果

- Node.js 24で台帳・ランキング境界の単体検査29件合格。順位・同率・0/1/4/5/6件、scope不一致、不正型、timeout、429、最大2並列、旧応答、停止、5分/30分cache、時計逆行、連打、契約失効を架空fixtureで検査。本番RPCは実行していない。
- ChromiumとWebKitで各14件、計28件合格。320/375/390/430/768/1280/1440px、200%文字・長い連続文字、44px操作、タッチ横向き1列、PC2/3列、JS無効、offline、keyboard/skip link、FF切替、HTML表示名の不活性化、局所状態表示を検査。
- axe-coreのWCAG 2 A/AA・2.1 AA対象自動検査で違反0。独立レビューの指摘によりselect/retry境界色を修正。人によるVoiceOver試験の代用ではない。
- [モバイル画像](portal-mobile.png)、[PC画像](portal-desktop.png) を目視。これはポータルの検査画像で、実ゲームサムネイルではない。SHA表示はcommit前の作業tree検査時の基準SHAで、最終配備SHAではない。
- [当時の性能測定](performance-20261005.json): Chromium153、390×844 touch模擬、150ms latency・1.6Mbps download・750Kbps upload、CPU4倍減速、cacheなし。LCP572ms、CLS0、転送63,099bytes、8requests、HTML/CSS/JS個別gzip合計17,001bytes。クラウド模擬環境の一測定で、実iPhoneの保証値ではない。
- READMEと初期計画書は不変。ブラウザにキー・DB・API readerを追加せず、広告・解析・ゲーム先読み・iframe・音声を追加していない。

## 条件別の達成と残件

|条件|今回の結果|
|---|---|
|A01/A02|8件・固定順・title/h1一致。確認済み2URLのみ有効、他6件の入口無効|
|A03|未作成placeholderの比率・表示を確認。実サムネイルの撮影・権利・画像404/decode検査は採用後の残件|
|A04|模擬幅・touch・PC・長文・文字拡大合格。実iPhone縦横確認は未実施|
|A05|44px・keyboard・focus・構造/名前/色の自動検査合格。実VoiceOverは未実施|
|A06〜A10|adapter/store/UIの架空fixture検査合格。実backend集約・版隔離・実データ一致の合格とは呼ばない|
|A11|匿名閲覧・ローカル状態管理のみ。本番ランキングreaderなし、RPC・DB呼出ゼロ|
|A12|JS無効/offline・通信副作用なし・模擬性能予算合格|
|A13|GitHub Pages公開後にSHAと全資産hashを読取照合して記録|

## 接続・画像・実端末の残件

全8ランキングの実読取接続は未完了。既存計画の正本ではルール版の隔離保証が不足しており、その保証を追加するDB変更は本ポータル実装の対象外。FFのnormal/easyの対応は文書で確認済みだが、ルール版未確定のため有効化しない。今回はDBへ再接続せず、既存SQL状態を新しい観測として報告しない。

実画面サムネイルは未採用。実iPhone・VoiceOver・各ゲーム通しプレイも未実施。公開ページの枠と安全な未接続表示を初回成果として公開し、全作品が公開済み・全ランキングが接続済みとは説明しない。

復旧方法と運用手順は [PORTAL_OPERATIONS](../PORTAL_OPERATIONS.md)、掲載根拠は [catalog](catalog.md)、独立レビューは [independent-review](independent-review.md) を参照。
