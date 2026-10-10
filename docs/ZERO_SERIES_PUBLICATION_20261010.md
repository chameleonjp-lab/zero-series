# 2026-10-10 ゼロシリーズ公開・共通UI反映

本人の依頼に基づき、ゲーム本体のある未公開2作品（センリョウ・ファンタジア）を公開し、3作品の配信を更新した。カイセン・ファイトフライトは現main・公開版を確認し、変更は不要だった。ヌスミダセはmainにREADMEと仕様・実装計画しかなく、公開可能なゲーム本体がないためプレイ入口を有効にしない。

今回の製品変更は、マチマモレのPC入力時も共通操作ボタンを表示、ゲキチンの速度表示をkm/hへ統一、ウチオトセの結果画面から操作モードを変更可能、ファンタジアのPause詳細へ告知が重なる問題の修正。ゲームごとの武器・戦闘ルール・得点・ランキングは変更していない。

## 配信確認

すべて下記sourceの製品buildと公開HTML・全製品配布ファイルをTLS HTTPSで読み、SHA256とbytesの一致、入口HTTP 200を確認した。公開runとdeploy jobのsuccessも別途確認した。証拠は`docs/evidence/current-games.json`。CIだけで公開成功と判定していない。

| 作品 | 公開source | 公開run | 製品ファイル数 |
|---|---|---|---|
| machimamore | `cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70` | [38019861713](https://github.com/chameleonjp-lab/machimamore/actions/runs/38019861713) | 5 |
| gekichin | `cd9431c53d64543c0d49e562dea9ea03d22a609c` | [38019866234](https://github.com/chameleonjp-lab/gekichin/actions/runs/38019866234) | 4 |
| uchiotose | `0d00ef31a44786e23a0e93aae2bda6d78c15ccdf` | [38018823568](https://github.com/chameleonjp-lab/uchiotose/actions/runs/38018823568) | 4 |
| senryou | `210f6a782f2499367651f9678b383b754d3b1101` | [38019994971](https://github.com/chameleonjp-lab/senryou/actions/runs/38019994971) | 4 |
| fantasia | `7b59137065ae7af26b37f0fa304c16bf7483ed50` | [38020805395](https://github.com/chameleonjp-lab/fantasia/actions/runs/38020805395) | 4 |

ウチオトセは製品sourceとgh-pages commit `df1827e37d962d14cb75ca8038d0c6bf36c9435b` を分けて記録する。他4作品は採用mainを配備manifestへ記録し、既存のmain限定github-pages環境ルールに従った。mainへの直接push、force push、環境制限の緩和はしていない。

## 一覧・画像

公開配信が確認できた後にセンリョウ・ファンタジアの正確な公式URLをallowlistへ追加し、8作品固定の一覧で7作品の入口を有効にする。既存のURL・source・deploy・hash検査は維持する。ヌスミダセは準備中。ランキングは全作品で無効のまま。

旧3作品のタイトル画像は以前のsourceへ紐づいているため、新しいsourceへ付け替えず今回の一覧では画像準備中とする。旧証拠・元画像は履歴として保持する。現在の配信sourceへ紐づくカイセン・ファイトフライトの2作品の画像は維持する。候補検査は今回表示する実画像の件数を待ち、未表示の歴史画像を待たない。

## 検証の範囲

各製品の単体・buildと現在の短時間UI-only検査が成功し、元の添付画像を独立レビューした。実機iPhone、本編、操作感、GPU性能、音声、全機能・全HUDの正式受入は未検証。ファンタジアの`docs/RELEASE_GATE.json`はready:falseのまま。センリョウの短横HUDの世界ラベル密集は既存の作品固有所見として残し、全HUD合格としない。

センリョウのPR同期で既存legacy/GPU workflow run38019700364が付随起動し失敗した。今回のbounded UI-only・公開run成功の証拠と分離し、再実行や合格化する変更は加えていない。ファンタジアのrun38020361204は親形式検査で公開前停止し、成功証拠に含めない。修正後の公開run38020805395を採用する。公開ゲームの開始、得点送信、ランキング再開、Codex Cloud environmentsの操作は行っていない。

復元は通常のrevert・承認済み再配備で行い、履歴書換えやデータ削除は行わない。
