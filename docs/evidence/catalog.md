# 掲載台帳の再確認記録

確認日: 2026-10-05 UTC。8 repo の main/README/tree と公式資料は 03:49 UTC 前後、正式配備物は 03:49:58–03:50:14 UTC、配備バイトのホーム検査は 03:52:34–03:52:35 UTC に読取確認した。紹介文を実際に更新した日時は `src/catalog.js` の `contentUpdatedAt` に記録する。調査日時、ソース commit 日時、ビルド日時を公開日時に読み替えない。

この記録は初期計画の古い観測を再確認するための証拠である。作品の実装、公開操作、ランキング接続・開始・送信、DB 変更は行っていない。8 repo は `/tmp` に shallow clone して読み、GitHub の public repository API と既存の公開物だけを取得した。候補の merge、push、workflow 起動、Pages 設定変更はしていない。

## 1. 固定ソースと採用状態

掲載順は下表の8作品のみ。`sourceCommit` と `sourceRoot` は紹介の根拠となる main の完全 SHA に固定する。公開ソース版は `publicationEvidence.deployedCommit` で分離する。

| 順 | 作品 | main の完全 SHA | README blob | 採用公開状態 |
|---|---|---|---|---|
| 1 | [カイセン](https://github.com/chameleonjp-lab/kaisen/tree/3d751051dc6212482a129e8da596ddd349b2f9f5) | `3d751051dc6212482a129e8da596ddd349b2f9f5` | `033192314eacd404f87e328f229d26b63a5fe7e8` | published |
| 2 | [ファイトフライト](https://github.com/chameleonjp-lab/faitofuraito/tree/c2b313d37875b93458032d98636fcf5b5d30a138) | `c2b313d37875b93458032d98636fcf5b5d30a138` | `f35652b032414bd6e98c6ed05da9065ad2384b0c` | published |
| 3 | [マチマモレ](https://github.com/chameleonjp-lab/machimamore/tree/4cefae935236f2b8bb6a9e5895ddd05220883eb2) | `4cefae935236f2b8bb6a9e5895ddd05220883eb2` | `0931cf7b6c5e212bcb8c984eead708772e1c55af` | preparing |
| 4 | [ゲキチン](https://github.com/chameleonjp-lab/gekichin/tree/98119b5ae6604ad5975024b0e523b78eef369662) | `98119b5ae6604ad5975024b0e523b78eef369662` | `9d0cfacf52833d90d39f02a9ab1c1c57dee30aa0` | preparing |
| 5 | [ウチオトセ](https://github.com/chameleonjp-lab/uchiotose/tree/14090299b5d1f67502210fe51e1c04799770d817) | `14090299b5d1f67502210fe51e1c04799770d817` | `cf5e374a2c1006b191144c2715fc078849295dde` | unverified |
| 6 | [センリョウ](https://github.com/chameleonjp-lab/senryou/tree/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650) | `71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650` | `7cd72c0b749376a26a98bde8e374695e80f9855f` | unverified |
| 7 | [ファンタジア](https://github.com/chameleonjp-lab/fantasia/tree/36b0e3b8130acb7149a646845b46f72294a3798a) | `36b0e3b8130acb7149a646845b46f72294a3798a` | `4c5140db4cc2cb340f631262003ef62225e2f628` | preparing |
| 8 | [ヌスミダセ](https://github.com/chameleonjp-lab/nusumidase/tree/c604c7990e5ba9a599898ede6c1ccb4b42970b51) | `c604c7990e5ba9a599898ede6c1ccb4b42970b51` | `fb589c4a910f392f1a282e5644a897d72d92cbc6` | preparing |

API metadata の観測では全8 repo の `homepage` は null。Kaisen と FF の `has_pages` は true、残る6 repo は false。これはその時点の GitHub Pages 状態の補助証拠であり、未記録の別ホストまで存在しないと証明するものではない。

## 2. Kaisen の正式 URL と配備版

正式 URL は [固定 README](https://github.com/chameleonjp-lab/kaisen/blob/3d751051dc6212482a129e8da596ddd349b2f9f5/README.md) にある `https://chameleonjp-lab.github.io/kaisen/`。命名規則から新しく組み立てた URL ではない。

同 URL の HTML は `カイセン` の title/h1、ホーム、モード選択、出撃入口を含む実ゲームの入口だった。リダイレクト後の URL は同一。HTTP 200 だけで公開判定せず、[公開 deployment.json](https://chameleonjp-lab.github.io/kaisen/deployment.json) の `repository = chameleonjp-lab/kaisen` と `commit = 3d751051dc6212482a129e8da596ddd349b2f9f5` を確認し、HTML と参照 JS/CSS、および NOTICE の実応答全バイトの SHA-256 を manifest と照合した。

| 配備ファイル | 実応答 SHA-256 |
|---|---|
| index.html | `ce4fc2a6af98bf8bfc437f5e7d9b903f45d183132a58eb0bccdb301d355d5d05` |
| assets/index-D79zFkmg.js | `9f3ecec88b461c2fe163216bc45751b6973d5978a195ed1483ac51917951ff36` |
| assets/index-DoDftaxZ.css | `470c3b2f05659b37212eb5b20ca1897138b7a509d939bb8f77314d0b9662f8b6` |
| third-party-notices.txt | `97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f` |

[Pages run 37242180604](https://github.com/chameleonjp-lab/kaisen/actions/runs/37242180604) は同じ完全 SHA、main、workflow_dispatch、completed/success。GitHub の run 作成記録は 2026-10-04 23:00:55 UTC、更新記録は 23:02:27 UTC。更新記録を配備物の正確な公開開始時刻とは呼ばない。

README と `docs/DEPLOYMENT.md` に古い公開版の記述が残っているが、現行配備判定は実応答の manifest、ファイル hash、対応する成功 run に基づく。新しいソースがあるという理由だけで公開済みにしたものではない。

## 3. FF の正式 URL と配備版

正式 URL は [固定 README](https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/README.md) と canonical にある `https://chameleonjp-lab.github.io/faitofuraito/`。

同 URL の HTML は `ファイトフライト` の title、ゲームホーム、零戦二一型の説明、normal/easy、出撃フォームを含む。現行 [deployment.json](https://chameleonjp-lab.github.io/faitofuraito/deployment.json) の `source_commit` は **`037e7914572871f18eb9aa9a41eca4fdae9f3bc7`**。現行 main `c2b313d…` とは別である。HTML 内の `chameleonjp-release = faitofuraito-20261003-aircraft-vfx` も manifest の `ui_release` と一致する。これらの版ラベルを ranking の rulesVersion とは扱わない。

| 配備ファイル | 実応答 SHA-256 |
|---|---|
| index.html | `ddb26ff81e70ea99ab514b34a7a200ed700e7f4031602f8fa45a1e4f9a8efdf2` |
| assets/index-mKVNiF0f.js | `94d35d736119c7fb8dd6fc035e7d21402e23f792c720a89be3de9f5f17a5925b` |
| assets/index-DA8nm5ZM.css | `d2e44f2c526697256fb0b181a707db529822fcc86c2b0c9413d1f80962c20507` |

上記3ファイルは公開 manifest の hash とすべて一致し、さらに実在する gh-pages branch commit **`8d22fa535e2f107745710b37df5c92b2ab1b763b`** の同ファイルを `git show` して計算した hash とも一致した。[固定 branch manifest](https://github.com/chameleonjp-lab/faitofuraito/blob/8d22fa535e2f107745710b37df5c92b2ab1b763b/deployment.json) と公開 manifest の source commit が一致する。manifest の `built_at = 2026-10-03T07:18:29.146084+00:00` はビルド時刻であり、公開時刻ではない。main の未配備更新を現行公開機能に含めない。

## 4. 2作品のホーム準備確認と限界

直接の live Chromium HTTPS 検査は、managed proxy CA を Chromium が信頼していないため `ERR_CERT_AUTHORITY_INVALID` で完了しなかった。TLS 検証は無効化していない。Python の通常 HTTPS/既存 proxy/設定済み CA trust で TLS 検証して取得した上記の正確な配備バイトを、隔離した Chromium に replay した。

条件は Linux / Playwright 1.63.0 / Chromium 153.0.8010.12 / SwiftShader / CSS viewport 393×852。Kaisen と FF それぞれ新しい context、service worker 禁止。全通信を route で捕捉し、該当作品の既知の取得済みファイルに対する GET/HEAD だけを replay。外部 URL、未知ファイル、POST/PUT/PATCH/DELETE を通さない。出撃・名前入力・音 ON・操作設定の保存・ランキング操作をしていない。

| 項目 | Kaisen | FF |
|---|---|---|
| 確認日時 UTC | 03:52:34.410 | 03:52:35.267 |
| title / h1 | カイセン / カイセン | ファイトフライト / ファイトフライト |
| ホーム表示 | visible | visible |
| 出撃入口 | present / enabled | present / enabled |
| 起動エラー表示 | なし | なし |
| page error | 0 | 0 |
| 使用した要求 | HTML / JS / CSS の GET 3件 | HTML / JS / CSS の GET 3件 |
| 外部・変更要求 | 0 | 0 |
| ゲーム開始 | 未実施 | 未実施 |

正式 URL、実配備版とファイル整合、実ゲームの入口内容、配備バイトのホーム準備を確認できたため両作品を published とし、固定 URL を有効化する。**この結果は live ブラウザでの飛行、勝敗・得点送信、音質、実 iPhone の操作や性能の合格を意味しない。** HTTP 成功だけで遊べると判定したものでもない。direct live browser の TLS 制限と実プレイ未検証は台帳にも残す。

## 5. 新しいソースに基づく6作品の扱い

- マチマモレ: [要件書](https://github.com/chameleonjp-lab/machimamore/blob/4cefae935236f2b8bb6a9e5895ddd05220883eb2/docs/REQUIREMENTS.md) は都市防衛・円盤 UFO のゲームを定義し、ゲーム実装・公開未実施を明記。main は README/docs のみ。紹介は「予定」、preparing、playUrl null。
- ゲキチン: [実装状況](https://github.com/chameleonjp-lab/gekichin/blob/98119b5ae6604ad5975024b0e523b78eef369662/docs/IMPLEMENTATION_STATUS.md) は P1 操縦プロトタイプ、砲台戦・勝利経路未実装。100基の砲台戦を完成済みとして紹介しない。preparing、playUrl null。
- ウチオトセ: [新しい実装記録](https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/docs/IMPLEMENTATION_RELEASE.md) と tree に戦闘・世界・HUD・得点等の実装がある。古い P1 のみという紹介は更新した。[公開計画](https://github.com/chameleonjp-lab/uchiotose/blob/14090299b5d1f67502210fe51e1c04799770d817/docs/DEPLOYMENT.md) に明記された `https://chameleonjp-lab.github.io/uchiotose/` は「想定URL」。読取応答は404で実配備版を確認できない。unverified、playUrl null、想定 URL は証拠欄にのみ保持。
- センリョウ: [README](https://github.com/chameleonjp-lab/senryou/blob/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650/README.md) と実装 tree は地上戦支援の一戦完結型ゲーム。[検証記録](https://github.com/chameleonjp-lab/senryou/blob/71b0e5bc9ffbe2cbd1f295160b9e8e3c40ad6650/docs/VERIFICATION.md) は公開受入未完了・Pages 未設定。正式 URL を確認できないため unverified、playUrl null。
- ファンタジア: main に campaign 系の実装と検証記録があるため「README/docs のみ」という初期観測は更新した。[DELIVERY_STATUS](https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/docs/DELIVERY_STATUS.md) と [RELEASE_GATE](https://github.com/chameleonjp-lab/fantasia/blob/36b0e3b8130acb7149a646845b46f72294a3798a/docs/RELEASE_GATE.json) は受入残件と `ready:false` を明記。ファイル存在・build 成功を公開済みとは扱わない。preparing、playUrl null。
- ヌスミダセ: main commit `c604c7990e5ba9a599898ede6c1ccb4b42970b51` の subject は `Merge pull request #1 from chameleonjp-lab/docs/nusumidase-requirements-plan-20261005`。[PR #1](https://github.com/chameleonjp-lab/nusumidase/pull/1) の文書が main tree にあり、進行中 PR の推測ではなく採用済み仕様として紹介へ反映。[REQUIREMENTS](https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/REQUIREMENTS.md) は敵基地の機密コアを奪い自基地へ持ち帰る一人用の空中旗取り、3回先取、護送・奪還を定義。ゲーム本体は未実装なので「予定」、preparing、playUrl null。

6 repo の README/docs/HTML/JSON/workflow を検索して、別の明記された作品 URL は見つからなかった。Uchiotose 以外に新しい URL を命名規則から推測・設定していない。資料の「未公開」は作者の記録範囲の証拠として用い、別ホストまで絶対に未公開という断定にはしない。

## 6. 画像とランキングの境界

全8作品の `thumbnail` は null。画像を生成・撮影・転載していない。FF の `public/social-card.png` は [共有画像記録](https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/docs/SHARING_ASSET.md) にある生成画像なので、実画面 thumbnail として採用しない。他作品の既存検査画像も実際の撮影対象版、内容、権利、個人情報、採用に適した画角の最終確認が済んでいないため流用しない。

全8作品の ranking は `enabled:false / displayState:not_connected`。FF の normal/easy の識別子・slug と点/scale1/整数/desc は [固定 ranking-manifest](https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/public/ranking-manifest.json) に基づいて対応表だけを保持し、`rulesVersion`、`contractVersion`、`verification` は null。manifest/client/HTML の版を rulesVersion に読み替えない。他7作品は backend mode 対応を推測せず空の modes。DB、RPC、実スコア、プレイヤー行は本調査で取得・実行していない。

## 7. 台帳の検証

`getPlayableUrl(entry)` は published、`publicationEvidence.verified === true`、確認済み完全配備 SHA と、作品 ID ごとに固定した正式 https URL が揃う場合だけ URL を返す。別作品、任意ホスト、URL query/hash、javascript/data URL、未確認・準備中は null。`validateCatalog()` は8件・固定順・完全 SHA/root・状態とリンク・ランキング無効を build 時に検査する。

台帳 module の構文・8作品の検証、実 URL 2件/null 6件、未知 ID/悪意 URL/未確認/null publication の拒否、全 ranking 無効をローカルで確認する。統合ページの JS 無効・レスポンシブ・アクセシビリティの検査はポータル側の QA 記録を参照する。
