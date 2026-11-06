# ゼロシリーズ8作品　カメラ修正実装計画表

同じ操作で敵の位置だけを変えたとき、自機の軌道とカメラの向きに差が出ないこと。機銃・機関砲の弾が銃口の正面へ飛ぶこと。この2点をイージー・ノーマルの両方で確かめます。カイセンで先に直し、同じ手順を残る7作品に使います。

2026年11月7日（日本時間）作成。開始版と修正前の比較値は着手前の調査記録です。実行後の修正候補・CI結果・実機と公開版の確認状況は[実行記録](ZERO_SERIES_AIM_ASSIST_REMOVAL_PROGRESS_20261107.md)へ分けて記録します。

## 何を直すか

前回の調査では、イージーは8作品すべてで敵の位置が操縦に影響しました。ノーマルはカイセンで敵に応じた倍率が既に1倍、残る7作品では画面外の敵がいると最大1.65倍でした。

| 対象 | 扱い | 修正後の動き |
| --- | --- | --- |
| 両モードの操縦と射線 | 確定 | 画面内の敵へ向く働き、画面外の敵がいると左右の旋回が速くなる働き、自機の通常弾を敵や予測位置へ向ける働きを外します。敵に応じた旋回倍率は常に1倍にします。 |
| イージーの引き金 | 計画上の仮案 | 自分で照準円に入れた有効な敵にだけ自動発射します。引き金を手動にする方針になった場合は、イージーの射撃ボタン・長押し・指を離したときの停止を実装し、同じ射線検査を使います。 |
| ノーマルの引き金 | 継続する操作 | 射撃ボタンを押している間に発射します。指を離したとき、照準に敵が入ったとき、対象が切り替わったときの3条件を個別に試します。 |

照準の色・敵味方の印、イージーの巡航、速度による旋回の違いはそれぞれの役割を保ちます。敵・僚機の射撃、カイセンの爆弾の落下予測と規定内で投下した魚雷の発射後の誘導、地形・障害物の回避は別々に動作を確認します。 得点、記録の保存先、ランキング、公開設定はこの修正の対象外です。

10月16日の共通計画が指定したイージーの標的追尾、画面外での旋回1.65倍、固定砲台への弱い追尾は、今回の依頼で置き換える旧条件です。各作品の現行説明と旧条件を正解としている検査も、該当する実装と同じ変更で更新します。

[10月16日の旧計画](https://github.com/chameleonjp-lab/zero-series/blob/5fdef68b43cf019f356f1b77650ddd8ea56e06ea/docs/ZERO_SERIES_CAMERA_CONTROLS_ROLLOUT_PLAN_20261016.md) ／ [従来の照準仕様](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/docs/ZERO_SERIES_AIM_CONTRACT.md)

## 実装の順番

残る7作品の開始版確認と再現用の入力作りは、カイセンの修正中に進められます。カイセンで合格条件がそろったら作品単位で並行し、同じ作品への書き込みは1担当にまとめます。

| 工程 | 着手条件 | 実施すること | 完了条件 |
| --- | --- | --- | --- |
| **P0** 着手時の版と症状を記録する | 最初に全8作品 | 開発版・公開版・作業中の変更を確認し、同じ初期状態と操作を再生します。敵の位置、機首角、視線、入力、発射方向、表示間隔を別々に記録します。 | 8作品の開始版と公開ファイル、再現できた条件・未確認の条件を区別できる。 |
| **K1** カイセンの操縦と射撃を分ける | P0のカイセン分 | 標的選択と、前の標的から残る補正量を自機の操縦から外します。通常弾は発射時の自機の姿勢を使います。自動発射の仮案では、最新の姿勢・画面比で円内・射程・遮蔽を判定し、発射の可否だけを射撃側へ渡します。 | 確認①・②に合格。標的の切替・消失や一時停止後も、前の追尾が残らない。 |
| **K2** 指を置いたまま操縦できるようにする | P0の入力再現後 | 上下入力が中央でも、操縦する指が残っていれば機首角を保ちます。表示の高さだけが変わった際は、同じ指と操作量を引き継ぎ、次の移動で急に旋回しないよう座標を合わせます。 | 確認③に合格。指を離す、画面を回す、他の指で撃つ場合も通る。 |
| **K3** カメラと自機を同じ時点で描く | P0の描画再現後 | 飛行計算の前後の姿勢をつなぐカイセンの既存処理をイージーにも使います。自機、対象、照準は同じ表示時点を参照し、発射・命中・時計は確定した飛行状態を使います。 | 確認④に合格。開始・復活・停止再開で古い姿勢が一瞬混じらない。 |
| **R1** 残る7作品へ適用する | K1〜K3の基準合格後 | 作品別の表に沿って担当を分けます。各作品の通常の出撃画面で①〜④を試し、再現した入力・描画の問題を直します。既に合格する箇所は検査結果を記録します。 | 7作品すべてで両モードの共通検査と、作品固有の検査が通る。 |
| **M1** 敵を捉えた瞬間の重さを切り分ける | P0後、K・Rと並行可 | カイセンは海だけを映す場面と艦を捉える場面を比較します。ゲキチンは砲台100基で操縦・表示・発射それぞれの遮蔽照会を数え、操縦専用の全件照会を外します。 | 確認⑤の記録を残す。追加の軽量化は、原因を再現し修正前後の差を測れた箇所に限る。 |
| **V1** 作品ごとの修正候補を提出する | 各作品の修正・検査後 | 操作説明・旧検査を更新し、実装担当と別の担当が差分と結果を確認します。作品ごとに変更の取り込みを依頼する下書き（Draft PR）を提出し、検査失敗は同じ依頼で修正します。 | 提出した版と検査した版が一致し、対象検査と所定の最終検査に合格。実機欄は別に記録する。 |
| **L1** 実機と公開ページを照合する | 候補が試せた時点／本人のマージ後 | 候補が実機で開ければ先に操作を確認します。本人のマージ後、正式ページの配信ファイルを照合し、両モードで出撃します。先に実機で試せない場合はこの段階で実施します。 | 8作品それぞれに実機の結果と公開版の識別値がそろった時点で完了。 |

## 作品別の作業

8作品とも確認①〜④を行います。下表はそれに加える固有の手順です。

| 作品 | この作品で直すこと | 作品固有の合格条件 |
| --- | --- | --- |
| カイセン | 敵機と艦の両方を対象に、自動旋回、艦への弱い追尾、機銃・機関砲の発射時補正を外します。ノーマルの手動操縦と滑らかな表示を比較元にします。 | 敵機・艦を右側／背後に置き換えたとき、同じ操作で視線が一致する。魚雷の誘導、爆弾の予測表示、照準の色もそれぞれ作動する。 |
| ファイトフライト | 敵が画面外にいる場合の倍率を両モードで1倍にし、敵の将来位置を予測する関数が自機の弾を曲げる経路も外します。 | 敵機が画面の端をまたいでも同じ入力の旋回量が一致する。横切る敵に対して左右両銃口の初速方向が発射時の正面と一致する。 |
| マチマモレ | UFOへの操縦・発射補正を外します。通常飛行で前後をつないだ位置と最新姿勢を混ぜている箇所をそろえ、機体交代時の約0.3秒のカメラ移動は別に扱います。 | UFOの出入りや交代直後に旧標的へ引かれない。交代の演出が1回で終わり、新しい機体で操縦と射撃が再開できる。 |
| ゲキチン | 母艦の砲台を調べる処理を操縦から分けます。発射・照準表示に必要な候補だけを調べ、母艦の壁にカメラが入るのを防ぐ処理を別に検査します。 | 100基が生きている開始時、操縦専用の遮蔽照会は0回。壁際でカメラは船体の外にあり、隠れた砲台へ自動発射しない。 |
| ウチオトセ | 飛行戦士への追尾と射線補正を外し、描画時に機体の姿勢と左右の傾きを同じ割合でつなぎます。作品独自の姿勢計算を使います。 | 旋回開始時、前の姿勢を描く瞬間の視線も前の向きと一致する。ノーマルで約0.68度出ていた差が消え、宙返りを中断しても視線が飛ばない。 |
| センリョウ | 空と地上の敵への操縦・射線補正を外します。イージーで約3秒先の地形を見て自動上昇する処理は、安全な高度と地面に近い高度で分けて試します。 | 安全な高度では敵の配置だけを変えても同じ軌道になる。地形に向かって下降したときはイージーの回避と表示が働く。 |
| ファンタジア | 通常の出撃から使うキャンペーンで、固定砲台への追尾（強さ0.25）と通常弾の補正を外します。傾きによる視線の横ずれはノーマルの公開版で約3.49度、開発版で0度でした。既存の修正が公開版へ届いたかを別に確認します。 | 敵味方の兵士・ドラゴン・砲台で操縦が変わらない。敵なしで方位・上下を固定し機体だけ約41度傾けても、公開後の視線差は開発版と同じ0度相当。 |
| ヌスミダセ | 実際の画面の縦横比で発射可否を1回だけ決めます。発射処理が縦向きの既定値で敵を選び直す経路を外し、保護中の機体・復活前の対象を除きます。 | 右55・前方500の敵は横874×402で円内になる。縦横それぞれで画面上の円と発射可否が一致し、弾は正面へ出る。復活・コア運搬も確認する。 |

ファイトフライト、ゲキチン、センリョウ、ファンタジア、ヌスミダセでは、カメラが最新の機体姿勢を読む経路があります。表示の段差は各作品で確認④を先に測り、カイセンの測定値をそのまま当てはめません。ヌスミダセはシリーズ一覧では準備中ですが、確認対象は作品の直URLです。

## 共通の合格条件

合格は難易度ごとに判定します。カイセンのノーマルで先に通る検査は、その結果も残し、同じ不具合が戻るのを防ぎます。

| 確認 | 再現手順 | 合格条件 |
| --- | --- | --- |
| ① 敵の位置だけを変える | 同じ難易度・初期姿勢・速度・操作を使い、安全な高度で、敵なし、正面、照準円の縁、画面端、背後、複数の敵の交差・消失を比較。無操作・小さな上下左右・斜め・射撃の開始と終了を再生する。 | 命中・衝突・勝敗処理の前の各時点で、自機位置・姿勢・実際のカメラの位置と向きが計算誤差内で一致する。敵による倍率は常に1倍。上下左右・斜めは既存の手動感度の検査にも合格する。 |
| ② 引き金と弾の向きを別々に見る | 横切る敵、円の内側／外側、射程外、遮蔽物の裏、撃破済み・味方を試す。機銃と機関砲の左右の銃口で、生成直後の弾の向きと発射時の銃口の正面を比較する。 | 各弾の初速方向が銃口の方向と一致する。仮案のイージーでは有効な敵が円内・射程内で射線が通る時だけ発射でき、ノーマルは長押しで射撃する。発射の有無や対象変更で視線は跳ねない。 |
| ③ 指の保持・解放・中断を分ける | 機首を約20度上げ、操作を中央に戻して0.2秒保持してから離す。別の指で射撃・速度を操作し、縦402×874から402×820へ高さだけを変えて、元の指を動かし続ける。 | 保持中の戻りは0度相当。離した後は滑らかに水平へ戻る。高さだけの変化では触れ直さず操縦できる。画面回転・アプリ離脱・停止時は残留入力を解除し、OSが1本の指を中断した場合は他の指を巻き込まない。 |
| ④ 同じ入力を異なる表示頻度で描く | 毎秒30・60・120回相当で同じ操作を再生。カイセンの基準は上昇入力0.45、毎秒60回の飛行計算、開始直後を除く48表示。一定の上昇区間で直前と同じ視線だった回数を数える。 | 120回相当の基準区間で同じ視線の繰り返しが両モードとも0/48。各作品では自機・照準・対象を同じ時点で描き、同じ計算時点の飛行・弾・時間・結果は表示頻度を変えても一致する。 |
| ⑤ 向きの変化と表示の遅れを見分ける | 同じ端末・場面・操作で敵を捉える前後を繰り返す。自機とカメラの方向、1枚ごとの表示間隔を別に記録。遮蔽、爆弾予測、魚雷の投下判定、描画完了待ちを測定用の候補にする。 | ゲキチンは操縦専用の100回の照会が0回になる。表示・発射に必要な照会は別集計。端末の重さは修正前後の表示間隔の中央値・遅い側の値（95パーセント点）を記録し、実測できた箇所だけを原因と判断する。 |

### カイセンで比べる修正前後の数値

| カイセンの比較 | 調査時のイージー | 調査時のノーマル | 修正後の目標 |
| --- | --- | --- | --- |
| 敵の配置を右側から背後へ変える | 視線差 約2.55度 | 0度 | 敵に起因する差が0度相当 |
| 上向きで指を中央に0.2秒保持 | 約9.39度戻る | 0度 | 保持中は0度相当 |
| 一定の上昇を120回/秒相当で48回表示 | 24回が直前と同じ | 0回 | 両方とも0回 |
| 縦向きで表示の高さだけを変更 | 触れ直すまで操縦不可 | 同じ現象 | 同じ指で操縦を継続 |

カイセンの視線比較は乱数の初期値73、高度1500、敵機1機。右側はカメラ基準で右105・前方500、背後は後方500に置き、0.2秒（飛行計算12回）を比べます。敵なしで戦闘が終了する作品は、終了前の飛行処理も独立して比較します。

「0度相当」は数値比較での判定です。暫定の許容差は視線・銃口の角度差0.001度、位置差0.001ゲーム内距離単位です。同じ入力を再生した同一作品・同一モード内で使い、作品間や実機の指操作にこの数値を当てはめません。

## 担当・検査・公開後の確認

進行と取りまとめはカメレオン開発係、実装と検査は各作品の担当、公開前の確認は実装者以外が担います。採用とマージは本人が行います。

| 作業 | 手順 |
| --- | --- |
| 実装中の検査 | 変更に近い既存検査を先に実行し、旧版で再現・修正版で解消した入力列を残します。カイセンの開始例は下記です。各作品の提出版で所定の全件検査・ビルドと通常の出撃経路のブラウザ検査を実行します。 |
| iPhone 17 ProのSafari | 両モードで縦・横・縦の短い表示を確認します。比較用の画面は402×874、874×402、402×700相当です。①機首を上げて中央に戻す、②敵を横切らせながら射撃、③ブラウザのバーの開閉、④回転・停止再開を順に試し、触れ直し・視線の跳ね・残留射撃を記録します。 |
| 本人のマージと公開後の照合 | 各作品の配信方法を確認し、公開ページが読み込んだプログラムの照合値を、マージした版から作ったファイルと突き合わせます。版の記録だけでは判定せず、初めて開く状態と古いタブの再読込の両方で確認します。 |
| 結果の記録と差し戻し | 作品ごとに、難易度・画面向き・候補版・検査結果・実機結果・公開版の照合値を記録します。公開版が古ければ配信を調べ、動作が悪化した候補は後続の公開を止め、直前の正常な版へ戻す変更案を本人へ提出します。 |

追尾すること、画面外の1.65倍、敵に向かう弾、イージーで途中の姿勢を描かないことを期待する旧検査は、①〜④の条件へ書き替えます。自動発射の成立、弾数・再装填、敵・僚機の射撃や固有兵装を確かめる検査は別に実行します。

カイセンのディレクトリで、関係する既存検査から実行する例です。

```sh
node --import tsx --test tests/normal-camera.test.ts tests/flight-presentation.test.ts tests/input-recovery.test.ts
```

公開時の識別値がない作品は、記録された公開元の版から同じ設定で作り直し、実際に配信されるプログラムと全バイトが一致するかを確認します。 ブラウザでの数値検査・模擬タッチ、iPhone実機、公開版の照合は別の記録欄にします。確認できた段階だけを完了として記入します。

## 作品ごとの進捗

開始版・最終CI・実機・公開版を分けた最新の結果は[実行記録](ZERO_SERIES_AIM_ASSIST_REMOVAL_PROGRESS_20261107.md)にあります。以下の候補は検査した内容とGitHubのtree一致を確認しています。

| 作品 | 修正候補 | iPhone実機 | 公開照合 |
| --- | --- | --- | --- |
| カイセン | [#27](https://github.com/chameleonjp-lab/kaisen/pull/27) / `7998bde7` | 未確認 | 配信ファイル一致 |
| ファイトフライト | [#29](https://github.com/chameleonjp-lab/faitofuraito/pull/29) / `82f14878` | 未確認 | 配信ファイル一致・公開UI未合格 |
| マチマモレ | [#23](https://github.com/chameleonjp-lab/machimamore/pull/23) / `f55a0bc2` | 未確認 | 旧版を照合・未反映 |
| ゲキチン | [#18](https://github.com/chameleonjp-lab/gekichin/pull/18) / `5d9064a6` | 未確認 | 旧版を照合・未反映 |
| ウチオトセ | [#22](https://github.com/chameleonjp-lab/uchiotose/pull/22) / `c3d7c3a4` | 未確認 | 旧版を照合・未反映 |
| センリョウ | [#26](https://github.com/chameleonjp-lab/senryou/pull/26) / `a3099c9a` | 未確認 | 未マージ・旧版を照合 |
| ファンタジア | [#25](https://github.com/chameleonjp-lab/fantasia/pull/25) / `f6d438c2` | 未確認 | 旧版を照合・未反映 |
| ヌスミダセ | [#10](https://github.com/chameleonjp-lab/nusumidase/pull/10) / `331c6ee2` | 未確認 | 旧版を照合・未反映 |

## 作品ごとの実装入口と既存検査

各リンクは今回確認した開発版に固定しています。検査専用の画面に加え、通常の出撃からも実行します。

### カイセン

実装　[simulation.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/simulation.ts) ・ [flight-assist.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/flight-assist.ts) ・ [flight.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/flight.ts) ・ [input.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/input.ts) ・ [flight-presentation.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/flight-presentation.ts)

検査　[normal-camera.test.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/tests/normal-camera.test.ts) ・ [flight-presentation.test.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/tests/flight-presentation.test.ts) ・ [camera-rate.spec.ts](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/browser-tests/camera-rate.spec.ts)

### ファイトフライト

実装　[simulation.ts](https://github.com/chameleonjp-lab/faitofuraito/blob/069e3e65e46bae95144ce11fb41de7487435e4e9/src/simulation.ts) ・ [flight-assist.ts](https://github.com/chameleonjp-lab/faitofuraito/blob/069e3e65e46bae95144ce11fb41de7487435e4e9/src/flight-assist.ts) ・ [scene.ts](https://github.com/chameleonjp-lab/faitofuraito/blob/069e3e65e46bae95144ce11fb41de7487435e4e9/src/scene.ts)

検査　[flight-assist.test.ts](https://github.com/chameleonjp-lab/faitofuraito/blob/069e3e65e46bae95144ce11fb41de7487435e4e9/tests/flight-assist.test.ts) ・ [flight-view.test.ts](https://github.com/chameleonjp-lab/faitofuraito/blob/069e3e65e46bae95144ce11fb41de7487435e4e9/tests/flight-view.test.ts)

### マチマモレ

実装　[simulation.ts](https://github.com/chameleonjp-lab/machimamore/blob/7afbc6a8de9e4489035ca093a97ae695b2cb1161/src/simulation.ts) ・ [flight-assist.ts](https://github.com/chameleonjp-lab/machimamore/blob/7afbc6a8de9e4489035ca093a97ae695b2cb1161/src/flight-assist.ts) ・ [scene.ts](https://github.com/chameleonjp-lab/machimamore/blob/7afbc6a8de9e4489035ca093a97ae695b2cb1161/src/scene.ts)

検査　[flight-assist.test.ts](https://github.com/chameleonjp-lab/machimamore/blob/7afbc6a8de9e4489035ca093a97ae695b2cb1161/tests/flight-assist.test.ts) ・ [simulation-lifecycle.test.ts](https://github.com/chameleonjp-lab/machimamore/blob/7afbc6a8de9e4489035ca093a97ae695b2cb1161/tests/simulation-lifecycle.test.ts)

### ゲキチン

実装　[game-state.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/src/game-state.ts) ・ [aircraft-weapons.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/src/aircraft-weapons.ts) ・ [flight-view.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/src/flight-view.ts) ・ [scene.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/src/scene.ts)

検査　[aim-camera-regression.test.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/tests/aim-camera-regression.test.ts) ・ [combat-core.test.ts](https://github.com/chameleonjp-lab/gekichin/blob/a44fc39d7bebb1409421993722bf9ba1f85de6e9/tests/combat-core.test.ts)

### ウチオトセ

実装　[world.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/src/world.ts) ・ [world-renderer.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/src/world-renderer.ts) ・ [simulation.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/src/simulation.ts) ・ [flight-view.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/src/flight-view.ts)

検査　[flight-target-regression.test.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/tests/flight-target-regression.test.ts) ・ [combat.test.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/tests/combat.test.ts) ・ [input-capture.test.ts](https://github.com/chameleonjp-lab/uchiotose/blob/8de66dbfdcbedbd8a6f3b607e1020684a63f9476/tests/input-capture.test.ts)

### センリョウ

実装　[battle/simulation.ts](https://github.com/chameleonjp-lab/senryou/blob/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157/src/battle/simulation.ts) ・ [battle/combat.ts](https://github.com/chameleonjp-lab/senryou/blob/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157/src/battle/combat.ts) ・ [battle-view.ts](https://github.com/chameleonjp-lab/senryou/blob/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157/src/battle-view.ts)

検査　[flight-render-contract.test.ts](https://github.com/chameleonjp-lab/senryou/blob/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157/tests/flight-render-contract.test.ts) ・ [terrain-ground.test.ts](https://github.com/chameleonjp-lab/senryou/blob/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157/tests/terrain-ground.test.ts)

### ファンタジア

実装　[main.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/src/main.ts) ・ [campaign-flight.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/src/campaign-flight.ts) ・ [campaign-scene.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/src/campaign-scene.ts) ・ [flight-view.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/src/flight-view.ts)

検査　[campaign-npc-camera-assist.test.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/tests/campaign-npc-camera-assist.test.ts) ・ [campaign-aim-regression.test.ts](https://github.com/chameleonjp-lab/fantasia/blob/3526a2b4b499da9f0f20be303f3a4624e8053be4/tests/campaign-aim-regression.test.ts)

### ヌスミダセ

実装　[simulation.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/src/simulation.ts) ・ [combat.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/src/combat.ts) ・ [flight-assist.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/src/flight-assist.ts) ・ [input.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/src/input.ts)

検査　[flight-inheritance.test.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/tests/flight-inheritance.test.ts) ・ [combat.test.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/tests/combat.test.ts) ・ [input-controls.test.ts](https://github.com/chameleonjp-lab/nusumidase/blob/21b4d738e3dec11f45766ecaceb8907586fe4d10/tests/input-controls.test.ts)

## 比較に使った版

公開版は11月7日の原因調査で配信されたプログラムと照合した版、開発版は今回GitHubで再確認した版です。版番号が違うだけではゲーム内容の差を断定できません。実装開始時と公開後に再取得します。

| 作品 | 調査時の公開版 | 計画作成時の開発版 |
| --- | --- | --- |
| カイセン | [c95c9d18](https://github.com/chameleonjp-lab/kaisen/commit/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8) | [c95c9d18](https://github.com/chameleonjp-lab/kaisen/commit/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8) |
| ファイトフライト | [85e79c13](https://github.com/chameleonjp-lab/faitofuraito/commit/85e79c13612c06d301b0d7e9ed39e8ad2cb0c86b) | [069e3e65](https://github.com/chameleonjp-lab/faitofuraito/commit/069e3e65e46bae95144ce11fb41de7487435e4e9) |
| マチマモレ | [8d8a725e](https://github.com/chameleonjp-lab/machimamore/commit/8d8a725e847974516be9fbc9a0e9e759d6e35683) | [7afbc6a8](https://github.com/chameleonjp-lab/machimamore/commit/7afbc6a8de9e4489035ca093a97ae695b2cb1161) |
| ゲキチン | [102c23ff](https://github.com/chameleonjp-lab/gekichin/commit/102c23ff4af10f67edb099632cf2aeed358b6449) | [a44fc39d](https://github.com/chameleonjp-lab/gekichin/commit/a44fc39d7bebb1409421993722bf9ba1f85de6e9) |
| ウチオトセ | [89725b8b](https://github.com/chameleonjp-lab/uchiotose/commit/89725b8bf96b7bdbef6869284f8c764ed9cd4e10) | [8de66dbf](https://github.com/chameleonjp-lab/uchiotose/commit/8de66dbfdcbedbd8a6f3b607e1020684a63f9476) |
| センリョウ | [129ea7f0](https://github.com/chameleonjp-lab/senryou/commit/129ea7f04ac72c236f267c8e8be1dc78c397794a) | [5dc32d0e](https://github.com/chameleonjp-lab/senryou/commit/5dc32d0e57bff6b7c77ef7f8b38d4b4672f01157) |
| ファンタジア | [7f9c9045](https://github.com/chameleonjp-lab/fantasia/commit/7f9c9045d164dda5a938db6a324bc6ac62b97bb3) | [3526a2b4](https://github.com/chameleonjp-lab/fantasia/commit/3526a2b4b499da9f0f20be303f3a4624e8053be4) |
| ヌスミダセ | [58a4fded](https://github.com/chameleonjp-lab/nusumidase/commit/58a4fded9eab018c59a4a1a57f5644c7feb6a5d9) | [21b4d738](https://github.com/chameleonjp-lab/nusumidase/commit/21b4d738e3dec11f45766ecaceb8907586fe4d10) |

[カイセンの入力解除](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/src/input.ts#L108-L116) ／ [イージーの描画を固定していた旧検査](https://github.com/chameleonjp-lab/kaisen/blob/c95c9d186b977b2ab02bd6fa9e1a0ca32ea7f0a8/tests/flight-presentation.test.ts)
