# カメラ・射線修正の実行記録

対象は [PR #13](https://github.com/chameleonjp-lab/zero-series/pull/13) の[計画書](ZERO_SERIES_AIM_ASSIST_REMOVAL_PLAN_20261107.md)。2026年11月7日（日本時間）に8作品を修正し、作品別のDraft PRへ提出しました。以下は実装・検査・所有者のマージ・公開反映を分けた記録です。初回記録では代理マージや配信を行っていません。後続の明示指示による公開は末尾に追記しています。

## 着手時の照合（P0）

全8作品は計画書の開発版と同じmainで、開始時の未保存変更はありませんでした。[取得記録](evidence/aim-removal-p0-20261107.json)には取得時刻、公開HTML・JavaScript・CSS等のSHA-256、公開元と開発版の完全SHAを保存しています。6作品は公開manifestの実ファイルを照合しました。manifestが404のファイトフライトとヌスミダセは、記録された公開元を元の設定で再ビルドし、公開HTML・JS・CSSの全バイト一致を確認しました。これは修正前の公開版の確認です。

| 作品 | 開始版 | 着手時の公開元 |
| --- | --- | --- |
| カイセン | c95c9d18 | c95c9d18 |
| ファイトフライト | 069e3e65 | 85e79c13 |
| マチマモレ | 7afbc6a8 | 8d8a725e |
| ゲキチン | a44fc39d | 102c23ff |
| ウチオトセ | 8de66dbf | 89725b8b |
| センリョウ | 5dc32d0e | 129ea7f0 |
| ファンタジア | 3526a2b4 | 7f9c9045 |
| ヌスミダセ | 21b4d738 | 58a4fded |

## 実装と独立レビュー（K1〜K3・R1）

両モードで、標的の追尾・画面外の旋回倍率・通常弾の発射方向補正を撤去しました。通常弾は左右の銃口正面へ発射します。Easyの自動引き金は計画書の仮案どおり、実際の画面比と確定姿勢で有効な円内・射程内の敵だけを判定します。遮蔽物を持つ作品では射線も判定し、Normalの長押し射撃を維持しています。

操縦指を中央で保持したときの機首角、高さだけの変更での同じ指・操作量の継続、両モードの表示補間を修正しました。正方形の比率やHUDの配置境界をまたぐ高さ変更と、実際の回転・幅変更を分けています。実際のmain側のリサイズ処理も検査しました。表示の機体・標的・カメラ・照準色は同じ時点を使い、発射・命中・時計には確定状態を使います。画面を描く前に停止・再開する場合と、操縦機の交代でも古い表示区間を持ち越さないよう検査しています。

カイセンの重点14件を実装前の失敗から修正し、実装担当以外も再実行して14/14成功した後、残る7作品へ進みました。カイセンの修正前→後は、敵配置による視線差2.545度→0度、中央保持中0.2秒の機首の戻り9.386度→0度、120Hz相当の同じ視線24/48→0/48です。Normalで既に通っていた条件も維持しました。

実装者と異なるエージェントが各作品の差分をレビューしました。指摘された表示時点の照準色、全機体の停止・再開表示、実際のmainと入力アダプターの高さ変更を修正し、追加差分も独立レビューしています。地形回避、巡航、敵・僚機の射撃、カイセンの爆弾予測・魚雷誘導、機体交代・復活・コア運搬は作品固有の検査で確認しました。得点算式、保存先、ランキング、依存、workflow、公開設定は変更していません。

## 修正候補とCI（V1）

最終候補の必須CIは8作品すべて成功しました。完全SHAとtreeを[最終読取記録](evidence/aim-removal-ci-20261107.json)で再確認しています。

全候補は、ローカルで検査・レビューした内容とGitHubへ保存したtreeの完全一致を確認して提出しました。提出版の完全SHA、tree、CI runは検査記録とPRのChecksへ対応づけています。初回CIの失敗を消さず、同じPRで修正しました。各作品の詳細は、対応PR内の `docs/AIM_ASSIST_REMOVAL_VERIFICATION_20261107.md` にあります。

| 作品 | 修正PR | 単体検査 | 最終CI |
| --- | --- | ---: | --- |
| カイセン | [#27](https://github.com/chameleonjp-lab/kaisen/pull/27) | 366/366 | [成功](https://github.com/chameleonjp-lab/kaisen/actions/runs/42280133354) |
| ファイトフライト | [#29](https://github.com/chameleonjp-lab/faitofuraito/pull/29) | 216/216 | [成功](https://github.com/chameleonjp-lab/faitofuraito/actions/runs/42281260625) |
| マチマモレ | [#23](https://github.com/chameleonjp-lab/machimamore/pull/23) | 232/232 | [成功](https://github.com/chameleonjp-lab/machimamore/actions/runs/42279078634) |
| ゲキチン | [#18](https://github.com/chameleonjp-lab/gekichin/pull/18) | 171/171 | [成功](https://github.com/chameleonjp-lab/gekichin/actions/runs/42279030205) |
| ウチオトセ | [#22](https://github.com/chameleonjp-lab/uchiotose/pull/22) | 234/234 | [成功](https://github.com/chameleonjp-lab/uchiotose/actions/runs/42279549468) |
| センリョウ | [#26](https://github.com/chameleonjp-lab/senryou/pull/26) | 261/261 | [成功](https://github.com/chameleonjp-lab/senryou/actions/runs/42283250479) |
| ファンタジア | [#25](https://github.com/chameleonjp-lab/fantasia/pull/25) | 499/499 | [成功](https://github.com/chameleonjp-lab/fantasia/actions/runs/42279215961) |
| ヌスミダセ | [#10](https://github.com/chameleonjp-lab/nusumidase/pull/10) | 140/140 | [成功](https://github.com/chameleonjp-lab/nusumidase/actions/runs/42279975389) |

CIでは型検査・ビルド・作品ごとの成果物/ブラウザゲートも確認しました。既存の条件付きskipと、旧版へ新条件を当てた非gating診断は候補の成功件数に含めません。ヌスミダセの旧参照での機首保持4件の失敗は、旧実装の診断結果として保存しています。

ブラウザ検査の変更も、アサーション・制限時間・retry・製品の安全停止を維持してレビューしました。ファイトフライトの60秒に達する集合は独立したカメラ/入力検査と停止・再出撃検査へ分割しています。実時間のGPU待ちで停止した撃破・再出撃fixtureは、実際の描画・入力を使う制御時計へ分離し、古い絶対pitch操縦を相対pitch誤差へ修正しました。実時間の停止保護検査は残し、制御時計の成功を性能合格には数えません。カイセンの空の視界は測定区間中の発射増分0を検査し、区間前の合法なEasy射撃を失敗条件にしていません。

## 向きと描画間隔の測定（M1）

ゲキチンは100基の操縦専用遮蔽照会を0回にしました。表示・発射に必要な照会は別集計し、母艦の壁からカメラを押し出す処理も維持しました。

カイセンはLinux/Chromium149/SwiftShader・402×874・同じseed/依存/実タッチ列で24窓を1回だけ測定し、15窓が成立、9窓は既存の描画停止保護で未成立でした。再試行や自動復旧で成功へ置き換えていません。[全窓の統計と条件](evidence/kaisen-m1-statistics-20261107.json)、[生データgzip](evidence/kaisen-m1-raw-20261107.json.gz)、[実行スクリプト](evidence/measure-kaisen-m1-20261107.mjs)を保存しています。スクリプトのPlaywright import先は今回の実行環境の絶対パスです。

成立した同じ試行同士を集計したアプリのRAF間隔です。値は中央値/95パーセント点（ms）、nearest-rankです。

| モード・場面 | 修正前 | 修正後 | 成立した比較 |
| --- | --- | --- | --- |
| Easy・海 | 16.7 / 33.2 | 16.6 / 31.5 | 3組 |
| Easy・艦 | 16.7 / 35.8 | 16.7 / 47.6 | 2組 |
| Normal・艦 | 16.6 / 33.7 | 16.6 / 28.6 | 1組 |
| Normal・海 | 未成立 | 未成立 | 0組 |

描画完了fenceの間隔は250msごとの疎な観測で、全GPUフレームや実画面の表示時刻ではありません。Normal・海の前後比較は未成立です。高速化や実機の滑らかさをこの結果から断定せず、追加の性能最適化は行っていません。生データSHA-256は `eb5b35918cfffbd91463d3967729cf4ffa48cc2d321c6c58caa956bfc9d17745` です。

## 所有者のマージと公開照合（L1）

2026年11月6日20:18 UTCの最終読取では、所有者による7作品のマージとmain treeの検査候補への一致を確認しました。センリョウ #26 はCI成功のDraftでした。代理マージ・Ready化・auto-merge・手動配信は行っていません。

[公開照合の完全SHA・URL・HTTP取得時刻](evidence/publication-check-20261107.json)のとおり、同日20:18:29〜20:18:31 UTCに8作品を再取得しました。カイセンとファイトフライトは既存のmain公開経路で修正後のHTML・JS・CSSが全バイト一致しました。他の6作品は公開JS/HTMLが旧版でした。ファイトフライトにはcommitを示す公開manifestがないため、検査候補の成果物との全バイト一致で対応づけています。

| 作品 | 読取時のmain | 実配信のsource | 公開反映 |
| --- | --- | --- | --- |
| カイセン | 58577fb753a0 | 58577fb753a0 | HTML・JS・CSS一致 |
| ファイトフライト | 70d2a8d44be7 | 識別manifestなし | HTML・JS・CSS一致 |
| マチマモレ | e80d98c78021 | 8d8a725e8479 | 未反映 |
| ゲキチン | 8a7bd6aca86d | 102c23ff4af1 | 未反映 |
| ウチオトセ | e2af08dd3d1a | 89725b8bf96b | 未反映 |
| センリョウ | 5dc32d0e57bf | 129ea7f04ac7 | 未マージ・未反映 |
| ファンタジア | 425f1311e0d0 | 7f9c9045d164 | 未反映 |
| ヌスミダセ | f33afc8c44de | 58a4fded9eab | 未反映 |

公開ページもLinux Chromium/SwiftShader・402×874で確認しました。カイセンはEasy/Normalの通常Start、HUD/canvas、短い実キー操縦、手動停止中の時計停止、Resume、再出撃に成功しました。ファイトフライトは両モードでStart・HUD/canvas・短い実キー操縦へ到達した後、画像取得中に実際のslow-frame安全停止を観測し、公開UIは未合格です。自動再開や再試行で成功へ置き換えず、残る停止・Resume・再出撃の確認へ進んでいません。ファイトフライトの確認は匿名play-countを変更する `POST /rest/v1/rpc/start_faitofuraito_guest_play_v1` を各モード1回、送信前に遮断したクライアント側の公開ファイル検査であり、backend・ランキングの受入検査ではありません。成功RPCの偽造、開発hook、world/clockの書換えは行っていません。両作品の各4枚の画像を目視確認し、時刻と結果を公開照合JSONの `production_ui` に記録しました。

ゲキチンとマチマモレは既存の手動配信workflow、ヌスミダセ・ウチオトセは既存gh-pagesへの成果物反映が残っています。ファンタジアは既存の正式公開ゲートに `ready=false`・`physicalPhoneVerified=false`・`independentReview=blocked` が残り、過去の特定版用verification publisherも今回のマージでは動きません。正式公開用のゲートは実機検査等の完了を別に記録する仕組みです。これらのゲートや公開設定を変更していません。

iPhone17 Pro/Safari実機は接続されておらず、全8作品の実機欄は未確認です。模擬タッチ、Chromium/WebKit、CI画像の結果を実機検査へ昇格させません。公開後の新規表示は上記2作品の確認範囲に限られ、古いタブの再読込は未確認です。したがってL1全体の完了は主張しません。

## 全8作品の公開完了（2026年11月7日・日本時間）

ユーザーの「全て公開」の指示に従い、マージ済みの修正を全8作品の正式URLへ反映しました。以下は上記20:18 UTCの過去の観測に続く新しい記録です。過去の未反映結果は書き換えず保持しています。

最終の受領証の確認時刻は 2026-11-06 20:51:18 UTC です。[全8作品の公開完了証跡](evidence/aim-removal-publication-complete-20261107.json)には、完全なsource SHAとtree、成功した配信run/deploy job、TLSで取得した各ファイルのURL・HTTP状態・長さ・SHA-256・観測または照合時刻（記録によってHTTP応答日時も併記）、元の受領証のSHA-256を保存しています。各製品ファイルは検査済みソースから作成した成果物と全バイトが一致しました。

| 作品 | 正式URL | 公開ソース | 製品ファイル数 | 配信処理 |
| --- | --- | --- | ---: | --- |
| カイセン | [公開ページ](https://chameleonjp-lab.github.io/kaisen/) | [58577fb753a0](https://github.com/chameleonjp-lab/kaisen/tree/58577fb753a06c7f15cf4141b869db1b34466b38) | 4 | [成功](https://github.com/chameleonjp-lab/kaisen/actions/runs/42283696875) |
| ファイトフライト | [公開ページ](https://chameleonjp-lab.github.io/faitofuraito/) | [70d2a8d44be7](https://github.com/chameleonjp-lab/faitofuraito/tree/70d2a8d44be70282cd99912f4881c6aab626800f) | 7 | [成功](https://github.com/chameleonjp-lab/faitofuraito/actions/runs/42283668744) |
| マチマモレ | [公開ページ](https://chameleonjp-lab.github.io/machimamore/) | [e80d98c78021](https://github.com/chameleonjp-lab/machimamore/tree/e80d98c780216cdb24c8b2f233d33a6ce0ffc579) | 5 | [成功](https://github.com/chameleonjp-lab/machimamore/actions/runs/42289426494) |
| ゲキチン | [公開ページ](https://chameleonjp-lab.github.io/gekichin/) | [8a7bd6aca86d](https://github.com/chameleonjp-lab/gekichin/tree/8a7bd6aca86d0c1eea13c1dcb706c36e9efa98cf) | 4 | [成功](https://github.com/chameleonjp-lab/gekichin/actions/runs/42289430251) |
| ウチオトセ | [公開ページ](https://chameleonjp-lab.github.io/uchiotose/) | [e2af08dd3d1a](https://github.com/chameleonjp-lab/uchiotose/tree/e2af08dd3d1a9aede5721b657c876e11b1d520c2) | 4（公開計11） | [成功](https://github.com/chameleonjp-lab/uchiotose/actions/runs/42290626792) |
| センリョウ | [公開ページ](https://chameleonjp-lab.github.io/senryou/) | [afad9179b9a0](https://github.com/chameleonjp-lab/senryou/tree/afad9179b9a036491fe998bca4005f3d6ae1a646) | 4（公開計5） | [成功](https://github.com/chameleonjp-lab/senryou/actions/runs/42289937081) |
| ファンタジア | [公開ページ](https://chameleonjp-lab.github.io/fantasia/) | [8e11890b6f88](https://github.com/chameleonjp-lab/fantasia/tree/8e11890b6f88cfd8e6b8e2441f696ef1a401e3dc) | 4 | [成功](https://github.com/chameleonjp-lab/fantasia/actions/runs/42290332116) |
| ヌスミダセ | [公開ページ](https://chameleonjp-lab.github.io/nusumidase/) | [f33afc8c44de](https://github.com/chameleonjp-lab/nusumidase/tree/f33afc8c44de1ba0f540cd08c18cb3f08154ef16) | 3（公開計7） | [成功](https://github.com/chameleonjp-lab/nusumidase/actions/runs/42290413067) |

ウチオトセとヌスミダセは、既存の `gh-pages` の履歴と古いhash付き資産を保持して公開しました。表の「公開計」はmanifest・公開用metadata・保持した旧資産も含む全配信ファイル数で、現行製品の数と分けています。ソースmainと公開ブランチのSHAは証跡でも別欄です。ヌスミダセのHTML・JavaScript・CSSは、別々の固定main checkoutで2回作成した結果とも一致しました。

ファイトフライトにはsourceを識別する公開manifestがないため、完全なmain/tree、成功した配信処理、および7製品ファイルの全バイト一致で対応づけています。ファンタジアは[公開用PR #26](https://github.com/chameleonjp-lab/fantasia/pull/26)の499件の検査・ビルド・CI成功後に公開用mainを採用し、既存の限定公開処理を実行しました。公開mainは `8e11890b6f88cfd8e6b8e2441f696ef1a401e3dc`、製品runtimeは検査済みの `425f1311e0d0210670fe960f0fda7b1cdf75f51f` と同一です。正式公開ゲートの `ready=false`・`physicalPhoneVerified=false`・`independentReview=blocked` は維持しています。

この節で完了したのは公開反映と配信ファイルの照合です。ファイトフライトの公開UI未合格、全8作品のiPhone17 Pro/Safari実機未確認、古いタブでの再読込未確認は継続します。HTTPの再取得・ETag確認を実ブラウザのcacheや実機の受入へ置き換えず、L1全体の完了は主張しません。ポータルにはヌスミダセの確認済み入口を追加し、既存7作品の掲載元・撮影日時と画像を保持、全8ランキングは未接続のままとしています。
