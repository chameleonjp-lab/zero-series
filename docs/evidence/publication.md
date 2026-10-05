# 初回公開の状態

2026-10-05 UTC。実装・自動検査・独立レビューは完了。GitHub Pagesへの初回公開は接続GitHubアプリの権限でブロックされている。

`POST /repos/chameleonjp-lab/zero-series/pages`、`build_type=workflow` に対しGitHubがHTTP403 `Resource not accessible by integration` を返した。既存Pagesは未設定で、公開URLはまだ発行されていない。リポジトリへのコード更新権限とPagesの管理権限は別。認証値を保存・公開せず、権限の異なる経路へ置き換えて有効化しない。

## 必要な設定

リポジトリ所有者が [Settings → Pages](https://github.com/chameleonjp-lab/zero-series/settings/pages) で、Build and deployment の Source を **GitHub Actions** に設定する。その後、この実装PRの検査済み候補をmainへ採用することで、`Verify and publish portal` workflowが単体・ブラウザ検査を行って配備する。

公開準備は `.github/workflows/pages.yml` に含まれる。ソース完全SHAをHTMLとdeployment.jsonへ埋め込み、全静的資産のSHA-256を記録する。独立レビュー・受入結果・復旧案は同PRに揃っている。

## 公開後の確認

Actionsの成功runと配備URLを確認し、公式に返されたURLからHTMLの `source-revision`、deployment.json の `sourceRevision`、すべての `assetHashes` をTLS検証を有効にした読取で照合する。キャッシュなしと既存キャッシュありで同じ版を読み、8カード・2プレイ入口・未接続ランキング・無関係API通信ゼロを確認する。配備時刻はActionsの実記録から取得する。

この時点ではA13未実施であり、公開完了・配備成功とは報告しない。未接続ランキング8件、未採用実画面サムネイル8件、実iPhone/VoiceOver確認の残件は [acceptance](acceptance.md) に記載する。
