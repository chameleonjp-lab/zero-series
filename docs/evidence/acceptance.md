# 初回ポータルの受入記録

対象: `chameleonjp-lab/zero-series`。2026-10-05 UTCの初回実装。最初の要件・実装計画書は過去の正本として保持し、この記録で実装結果と残件を区別する。公開承認はユーザーの「ページ公開まで実装を進めて完了させる」という指示に基づく。

## 公開する範囲

8作品の紹介、公開状態、確認済み2作品のプレイ入口、全作品のランキング未接続表示。静的HTMLはJavaScript無効でも読める。画像は全8件で準備中。FFのnormal/easy切替は未接続状態の表示だけを切り替え、通信しない。

mainに採用した候補ソースをGitHub Actionsが検査し、distだけをGitHub Pagesへ配備する。完全SHAをHTMLとdeployment.jsonへ埋め、全JS依存とCSS入口へSHA queryを付加し、配備manifestにSHA-256を記録する。正式公開URL・候補SHA・Actions run・配備後の照合結果は公開確認記録で確定する。

## 検査結果

- Node.js 24で台帳・ランキング境界の単体検査29件合格。順位・同率・0/1/4/5/6件、scope不一致、不正型、timeout、429、最大2並列、旧応答、停止、5分/30分cache、時計逆行、連打、契約失効を架空fixtureで検査。本番RPCは実行していない。
- ChromiumとWebKitで各14件、計28件合格。320/375/390/430/768/1280/1440px、200%文字・長い連続文字、44px操作、タッチ横向き1列、PC2/3列、JS無効、offline、keyboard/skip link、FF切替、HTML表示名の不活性化、局所状態表示を検査。
- axe-coreのWCAG 2 A/AA・2.1 AA対象自動検査で違反0。独立レビューの指摘によりselect/retry境界色を修正。人によるVoiceOver試験の代用ではない。
- [モバイル画像](portal-mobile.png)、[PC画像](portal-desktop.png) を目視。これはポータルの検査画像で、実ゲームサムネイルではない。SHA表示はcommit前の作業tree検査時の基準SHAで、最終配備SHAではない。
- [性能測定](performance.json): Chromium153、390×844 touch模擬、150ms latency・1.6Mbps download・750Kbps upload、CPU4倍減速、cacheなし。LCP572ms、CLS0、転送63,099bytes、8requests、HTML/CSS/JS個別gzip合計17,001bytes。クラウド模擬環境の一測定で、実iPhoneの保証値ではない。
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
