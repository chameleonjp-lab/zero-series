# 公開と候補版の状態 — 2026-10-09

**旧版は公開済み。今回の入口ページ候補は未公開。** 初回時点のPages権限403は後半に履歴として保持し、現在の公開未完了理由としては扱わない。mainへの直接push、マージ、自動マージ、新候補のPages配備は行っていない。

| 区分 | 確認した版・証拠 |
|---|---|
| 開始時/提出前のmain | `ce51a8de9fd1b8c367a60f0978d8bf071b042e5d`。2026-10-09開始時と提出前にGitHubから再確認。開始時open PRは0 |
| 現在の正式公開URL | https://chameleonjp-lab.github.io/zero-series/ |
| 旧版の公開照合 | [2026-10-09 14:47 UTC観測](baseline-20261009.json): HTML/source-revision、deployment.jsonの版、manifest掲載8資産のSHA-256一致。5入口、全画像準備中、全8ランキング未接続の旧版 |
| 旧版のPages run | [37445934859](https://github.com/chameleonjp-lab/zero-series/actions/runs/37445934859)。push/main、head `ce51a8d`、success、2026-10-06 09:52:19〜09:54:06 UTC。[run/job記録](baseline-pages-run-20261009.json) |
| 今回の実装・ローカル検査候補 | `bd2edf6c58f1b7787a07f285df781cf9bfdc3915`。[同候補の画面/性能](candidate-20261009/candidate.json)、[受入結果](acceptance.md) |
| 今回の提出 | `feat/portal-entry-completion-20261009` からDraft PR。最終PR head、URL、CI run/artifactはPR本文で確定。証拠追記commitと実装候補を区別する |
| 今回候補のA13 | 未実施。マージ待ち。ローカル・PRのCI成功を公開成功と呼ばない |

## マージ後に行う確認

ユーザー本人の「マージしました。後続対応開始」を受けた後、[PORTAL_OPERATIONS](../PORTAL_OPERATIONS.md) の承認済み手順で、採用mainの完全SHA、成功したPages workflow/deploy job、正式公開URLを確定する。`SOURCE_SHA` と `PAGES_RUN_ID` を指定して `npm run verify:publication` を実行し、TLS読取だけでHTMLのsource-revision、schema 2 deployment.json、画像を含む全配信資産のhashとinventoryを照合する。

manifest自身は自己参照を避けてassetHashes対象外と明記し、内容・版・inventoryを照合する。Node fetchのno-store/defaultの2種類は要求cache hintの比較であり、実ブラウザwarm cacheの検証ではない。別にcold/warmブラウザで画像/モジュール版、8カード/正式5入口、無関係通信ゼロを確認する。物理iPhone/VoiceOver、実プレイ画像、実ランキング接続の残件は公開しても自動的に解消しない。

復元は通常のrevert PRを検査してmainに採用し、Pages再配備後に版と全hashを再照合する。ゲーム/DB/score historyは変更・削除しない。

---

# 履歴: 初回公開の状態（2026-10-05）

以下の403・公開未完了・2入口・全画像準備中は当時の記録。

2026-10-05 UTC。実装・自動検査・独立レビューは完了。GitHub Pagesへの初回公開は接続GitHubアプリの権限でブロックされている。

`POST /repos/chameleonjp-lab/zero-series/pages`、`build_type=workflow` に対しGitHubがHTTP403 `Resource not accessible by integration` を返した。既存Pagesは未設定で、公開URLはまだ発行されていない。リポジトリへのコード更新権限とPagesの管理権限は別。認証値を保存・公開せず、権限の異なる経路へ置き換えて有効化しない。

## 必要な設定

リポジトリ所有者が [Settings → Pages](https://github.com/chameleonjp-lab/zero-series/settings/pages) で、Build and deployment の Source を **GitHub Actions** に設定する。その後、この実装PRの検査済み候補をmainへ採用することで、`Verify and publish portal` workflowが単体・ブラウザ検査を行って配備する。

公開準備は `.github/workflows/pages.yml` に含まれる。ソース完全SHAをHTMLとdeployment.jsonへ埋め込み、全静的資産のSHA-256を記録する。独立レビュー・受入結果・復旧案は同PRに揃っている。

## 公開後の確認

Actionsの成功runと配備URLを確認し、公式に返されたURLからHTMLの `source-revision`、deployment.json の `sourceRevision`、すべての `assetHashes` をTLS検証を有効にした読取で照合する。キャッシュなしと既存キャッシュありで同じ版を読み、8カード・2プレイ入口・未接続ランキング・無関係API通信ゼロを確認する。配備時刻はActionsの実記録から取得する。

この時点ではA13未実施であり、公開完了・配備成功とは報告しない。未接続ランキング8件、未採用実画面サムネイル8件、実iPhone/VoiceOver確認の残件は [acceptance](acceptance.md) に記載する。
