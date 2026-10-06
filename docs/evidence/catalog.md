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


## 2026-10-05 14:32 UTC 公開台帳の再照合

この節は初期掲載調査の後続記録。過去の調査本文を消さず、現在の掲載根拠を更新する。既存ゲームの公開状態を確認する作業であり、ゲームの再配備や未マージ修正の公開ではない。

|作品|現main|公開成果物の確認|掲載|
|---|---|---|---|
|カイセン|519fd0d50dfb2ce9a1145c0b58a1301b5c74d032|[成功run37300960802](https://github.com/chameleonjp-lab/kaisen/actions/runs/37300960802)、[deployment.json](https://chameleonjp-lab.github.io/kaisen/deployment.json)とHTML/JS/CSS/NOTICE全4 SHA-256一致|公開中を維持、版の根拠を更新|
|ファイトフライト|9b1a54b6c24cf9fa0487ff3c2c6fe5324fb1ac5e|[成功run37293139866](https://github.com/chameleonjp-lab/faitofuraito/actions/runs/37293139866)、gh-pages c0027e3d62bceafcc1cfb41bc95cff5a5b2fd8d8、[deployment.json](https://chameleonjp-lab.github.io/faitofuraito/deployment.json)を含む全7ファイル一致|公開中を維持、旧「mainと公開が異なる」状態を解消|
|ウチオトセ|772812665b94c854f1834a759560bb07eb9e89bb|[公式repoのgh-pages](https://github.com/chameleonjp-lab/uchiotose/tree/391ac84cb5fb68cae2aa1332b5b978e6a87cb1bb)、[公開release.json](https://chameleonjp-lab.github.io/uchiotose/release.json)、最新mainの新規production buildと配信HTML/JS/CSS/NOTICE全4一致|確認済みGitHub Pagesへの入口を有効化|

各ファイルのSHA-256はsrc/catalog.jsのpublicationEvidence.artifactHashesへ記録した。カイセンmanifestの手元保存と実配信の差は末尾改行だけで、JSON内容と全4製品ファイルは一致する。

ウチオトセのrelease.jsonは旧source aac2b36e651024bc3ccca851e2374f5dd373a3b1を示す。現mainは文書追加後のSHAなので、現main SHAを配備済みsourceへ付け替えない。製品bytesの一致を別に記録する。既存Sitesのrootは200だがassets/release取得は403で、別経路へ迂回せず未確認とした。今回の入口は検証済みGitHub Pagesのみ。

ウチオトセ[長gap停止修正PR #8](https://github.com/chameleonjp-lab/uchiotose/pull/8)は未マージ・未公開であり、公開版の停止不具合を修正済みとは扱わない。実機受入、操作感、音、全作戦通しプレイの合格も主張しない。Kaisen/FFの旧home replay結果はhistoricalHomeCheckへ分離し、旧source・確認時刻とappliesToCurrentSource=falseを付けて保存した。今回の公開版の実ブラウザ操作結果に流用しない。

掲載対象は8作品のまま、確認済みプレイ入口だけ2→3件。未公開5作品、全8ランキング未接続、画像準備中を維持する。製品コード、DB、スコア、公開設定は変更しない。初期公開のPages設定不足は別問題で、台帳修正だけでポータル公開完了とはしない。

今回の候補は単体30件とbuild成功。ブラウザ定義はUchiの固定URLと公開3件を検査するよう更新したが、この環境でのブラウザ実行・iPhone受入は未実施。候補のGitHub CIを別途確認する。

復元はこの限定変更を採用しないか、採用後に通常のrevert PRで初期台帳へ戻す。元ソースは基点99f1647b049e01f54b1b8eafa6dd57531a6fbcccと保存控えに保持。force pushやゲーム/ランキングの復旧操作は不要。


## 2026-10-05 18:24 UTC ゲキチン公開証拠の反映

この節は初期調査と14:32 UTCの再照合に続く追記で、旧「操縦プロトタイプ・砲台戦未実装・preparing」は当時の履歴として保持する。今回の掲載変更はゲキチン1件に限定し、他7作品の紹介・版・公開状態、全8作品のランキング未接続と画像準備中を変えない。ポータルの基点は `e8928676303f9ea784fa38809408d319e1002a82`、treeは `7ffe90c05ffc27d2553bddd9696d91a54ada3e5a`。変更前27 tracked filesのblob・SHA-256とソースの復元用控えを保管し、GitHubの基点treeと全blobの一致を確認した。

### 公開URL・配備版と実装説明

正式URLは [ゲキチン](https://chameleonjp-lab.github.io/gekichin/)。[公開deployment.json](https://chameleonjp-lab.github.io/gekichin/deployment.json) の `repository = chameleonjp-lab/gekichin`、`commit = ad0d62b7968fd40f4d502f07c5bc4671d44973b9` を確認した。現main、公開manifest、[成功run 37353314366](https://github.com/chameleonjp-lab/gekichin/actions/runs/37353314366) のsource SHAが一致する。Pages配備成功の記録は18:19:37 UTC。独立した現mainのproduction buildと実配信のmanifestおよび製品4ファイルは、TLS検証済みHTTPS GETで取得した全バイト・SHA-256とも一致した。公開確認は18:20:55 UTC開始、総合記録は18:24:14.731 UTC。manifest自体のSHA-256は `4fcda149b42d3dd6b1dc49f361d1cf2be9c5c739cddcedfd7b25e7b770966ce9`。

| 配備ファイル | 実応答SHA-256 |
|---|---|
| assets/index-BufJBCcE.css | `d89927dcc6ca023fc4eb27a7d824215101184aeac9f2505e117eb80b76bb89bf` |
| assets/index-Ca9XU86d.js | `75a38d906ca0775e2a1b7322366f3dfeb97a00edfd817ca00efc6f356f34cb9c` |
| index.html | `1856e5b784410ffd8af94e7c8610f9def8ed0bc3f157062c28a7dd80c9b09b6a` |
| third-party-notices.txt | `97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f` |

説明文は「超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。」へ更新する。[固定sourceのホーム・遊び方・結果表示](https://github.com/chameleonjp-lab/gekichin/blob/ad0d62b7968fd40f4d502f07c5bc4671d44973b9/src/main.ts) の100基、僚機、Easy/Normal、作戦タイムと成績に基づく。[実装状況](https://github.com/chameleonjp-lab/gekichin/blob/ad0d62b7968fd40f4d502f07c5bc4671d44973b9/docs/IMPLEMENTATION_STATUS.md) の戦闘実装と実機受入残件は区別し、旧候補の検査記録を現mainの受入結果へ読み替えない。

### 検証と未確認事項

同sourceの成功runでは単体112件成功、browser 56件成功・既存skip 1件・失敗0、baseline comparison成功を確認した。これらはゲキチン側の検査であり、このポータル変更のbrowser CI成功を示すものではない。

liveクラウドブラウザでホームと描画失敗案内の実画面を確認したが、その環境はWebGLが無効（GL_VENDOR / GL_RENDERER Disabled、BindToCurrentSequence failed）で出撃ボタンも無効だった。live gameplay、実iPhone、実機性能、人による操作感・音の受入は未実施。publishedは検証済み正式公開入口の状態を示し、全機能完成・実機受入完了の主張ではない。

ポータル側は固定許可URLへゲキチンを追加し、確認済み入口を3→4件とする。単体検査に完全source/deployed SHA、正式URL、製品4hash、manifest hash、配備run、未確認事項と未接続rankingの照合、不正URL・公開証拠欠落の拒否を追加した。browser定義はゲキチンの公開ラベル・正確な紹介文・リンク文言とURL・準備中表示なし・ranking未接続を確認し、JS無効時とoffline時にも固定リンクを確認する。全8カード、外部要求なし、レイアウト、アクセシビリティの既存検査を維持する。今回のローカル検査結果とexact-head browser実行はPRのChecksへ結び付け、browser定義の列挙だけを実行成功と扱わない。

変更対象は `src/catalog.js`、`tests/catalog.test.js`、`tests/browser/portal.spec.js`、この証拠追記の4ファイルだけ。workflow、package/lock、ゲーム本体、ランキング接続、公開設定は変更せず、benchmarkやliveランキング要求は行わない。復元は未採用ならこの候補を採用しない、採用後なら通常のrevert PRで基点の4ファイルへ戻す。旧本文と復元用控えを保持し、force pushや再帰的な強制削除は不要。


## 2026-10-06 00:41 UTC マチマモレ公開証拠の反映

この節は初期調査と既存の再照合記録に続く追記で、旧「仕様・計画の準備段階・preparing」は当時の履歴として保持する。今回の掲載変更はマチマモレ1件に限定する。ポータルの基点mainは `e5183cca3349a8425df1f23af2d6b07872a47b77`、treeは `facdb68643b5c8a595ab96ac539cb7b522ecdfff`。変更前4ファイルと全27 tracked filesの復元用控え、全blob・SHA-256一覧、ソースarchiveを保存し、現mainのGitHub treeと全27blobの一致を確認した。他7作品の紹介・版・公開状態、全8ランキング未接続、全8画像準備中を保持する。

### 公開URL・配備版・バイト照合

正式URLは [マチマモレ](https://chameleonjp-lab.github.io/machimamore/)。[公開deployment.json](https://chameleonjp-lab.github.io/machimamore/deployment.json) の `repository = chameleonjp-lab/machimamore`、`commit = 1d27a697ea62dbfa676e1e78968c164552459ec5` を確認した。現main、公開manifest、[成功run 37394426765](https://github.com/chameleonjp-lab/machimamore/actions/runs/37394426765) のsource SHAは一致し、source treeは `dbeb1439bc8af19dbe620dc9e6125a967a6765af`。Pages配備成功は2026-10-06 00:37:50 UTC、公開HTTPS照合の開始は00:39:17.412 UTC、総合記録は00:41:12.108 UTC。

固定配布5ファイル（HTML・JS・CSS・NOTICE・artifact-manifest.json）の実応答は、独立した現mainのproduction buildと全バイト・SHA-256で一致した。公開6ファイル（上記5件とdeployment.json）は、同runの実際のPages artifactとも全バイトで一致した。実配信hashは次のとおり。

| 配布ファイル | 実応答SHA-256 |
|---|---|
| artifact-manifest.json | `57742db53f439b2641c8c4b6f8eab3cf3264d9217cce217002531d58f3111589` |
| assets/index-BAyulP5k.css | `52bee58f42cf2b7d73afc93ba89df8a27f15cd117f74a857c8d852c602516d65` |
| assets/index-CX-kywWz.js | `9d04640ab8527e2b90fae88da3a455d7ca1da658eb0b20d21da04e1202dcceb0` |
| index.html | `dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79` |
| third-party-notices.txt | `8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc` |
| deployment.json | `ab92295564225afb5fe84a8b4c9596f3537ed3efdf5df43cd309e0d3d8626d8a` |

独立buildとCIのsource-manifest.jsonには生成時刻 `generatedAt` だけの差があり、そのhashを記録するdeployment.jsonは独立buildとバイト一致しない。公開deployment.jsonはCIの実配備artifactと一致する。CI source manifestの全81入力を独立checkoutで再計算して一致を確認した。公開 `sourceManifestSha256` は `c9ef9cd15a779cf1e0a5715ef39d39e3efdc367d8f12f5d07857ac4d8831725b`、両者で一致する `sourceContentDigest` は `f5cf45e8fc5907fcd8113596c8fb14d6d1e461e34f428547ae5fb9610bd41043`。`currentMainProductBytesMatch` は固定配布5件の一致を示し、deployment.jsonまで独立buildと完全一致したという意味ではない。

### 実装説明と受入の境界

説明文は「街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。」とする。[固定sourceのREADME](https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/README.md) は自機込み味方総数50機、敵UFO総数50機、同時出撃8対8、街20区画、有限の残機と全敵撃破による勝利、Easy/Normalを説明している。50機を同時出撃数とは記載しない。[実装状況](https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/docs/IMPLEMENTATION_STATUS.md) とREADMEの速度レバーUI・v2設定移行・受入検査の統合待ちは、今回完了したとは扱わない。

同sourceの検査は単体108件成功、browser 33件成功・既存対象skip 3件・失敗0。これはマチマモレ側の検査であり、このポータル変更のbrowser成功を示すものではない。liveクラウドブラウザではホームと描画失敗案内の実画面を確認したが、その環境のWebGLは無効だった。live gameplay、実iPhone、実機性能、人による操作感・音の受入は未実施。publishedは確認済みの正式公開入口を示し、全機能完成・実機受入完了の主張ではない。

### ポータルの変更・検査・復元

固定許可URLにマチマモレを追加し、確認済み入口を4→5件とする。単体検査は正式URL、完全source/deployed SHA、固定配布5hash、公開deployment manifest hash、source digest、生成時刻による差、配備run、未確認事項、ranking未接続、不正URL・公開証拠欠落の拒否を検査する。browser定義はマチマモレの公開ラベル・正確な紹介・リンク文言とURL・準備中表示なし・ranking未接続を確認し、JS無効時とoffline時の入口も確認する。全8カード、外部要求なし、レイアウト、アクセシビリティの既存検査は維持する。

変更対象は `src/catalog.js`、`tests/catalog.test.js`、`tests/browser/portal.spec.js`、この追記の4ファイルだけ。workflow、package/lock、ゲーム本体、ランキング接続、公開設定は変更しない。ローカルでは既存build scriptを変えず、検査用preloadで既存distの削除を拒否して新規distへ生成する。ローカルbrowserは既知の実行制約により実行せず、定義列挙を実行成功と扱わない。ローカル単体34件成功・失敗/skip 0、build成功、Chromium/WebKitのbrowser定義28件の列挙成功、8カード・5入口・全8ランキング未接続の生成HTML照合成功。他7作品のdeep equality、証拠本文のappend-only、4ファイル限定差分と `git diff --check` も確認した。採用前にPRのexact-head CIでbrowser検査を確認する。

復元は未採用ならこの候補を採用しない、採用後なら通常のrevert PRで基点の4ファイルへ戻す。旧本文・元ソース・復元用控えを保持し、force push、再帰的な強制削除、ゲームやランキングの復旧操作は不要。この作業はDraft PR提出までとし、merge・配備は行わない。


## 2026-10-06 09:26 UTC ゲキチン・ウチオトセ公開証拠の再同期

この節が2作品の現在の掲載根拠を更新する。上の2026-10-05記録にあるゲキチン旧source `ad0d62b…`、ウチオトセ旧source `aac2b36…` と「PR #8未マージ・未公開」は当時の観測として保持し、現在の公開状態には使用しない。ポータル基点mainは `3c93b56a789ed5c1aa9be49c73ecf13f29a81e30`、treeは `99ead966399a0b541a4dc11ab196af436622bf97`。09:24 UTCにmainとopen PRを再確認し、競合するopen PRはなかった。全29 tracked filesの控えを保存し、GitHub treeの全blobと一致を確認した。

### ゲキチン: 検査変更後のsourceを配備記録へ反映

- source / 公開manifest commit: `5504f3785ca783a694b2c5fedd39987ad6ef4349`
- [公開deployment.json](https://chameleonjp-lab.github.io/gekichin/deployment.json) のSHA-256: `bc0bcd6507275a37244084cfb63d37a4de4427db6d0e21f9e805fb10703d640c`
- [Pages run 37436127535](https://github.com/chameleonjp-lab/gekichin/actions/runs/37436127535) は同sourceでsuccess。deploy job完了記録は08:40:38 UTC、run更新は08:40:39 UTC。最初に公開された正確な時刻とは区別する
- artifact ID `11399464330` と08:43:14.434063 UTCの実配信照合では、HTML・JS・CSS・NOTICEの4製品ファイルとdeployment.jsonがHTTP 200かつ全バイト・SHA-256一致
- 4製品ファイルは旧配備 `ad0d62b7968fd40f4d502f07c5bc4671d44973b9` とも同一。旧4hashは維持し、変わった配備manifestとsource/runだけを更新する。ゲーム挙動の変更として扱わない

以前のクラウドブラウザ確認はWebGL無効で出撃不可だった。今回のsource更新・bytes一致を新しい実機プレイ、実iPhone、GPU性能、操作感・音の受入合格に読み替えない。

### ウチオトセ: マージ済みPR #8の停止修正を含む正式配備

- source / [公開release.json](https://chameleonjp-lab.github.io/uchiotose/release.json) commit: `2a7e815c70baf9dc65721fc938909b6ab083f074`
- [gh-pages commit](https://github.com/chameleonjp-lab/uchiotose/tree/1307117008dc72f9031a8c345b6ac077fc8ff30b): `1307117008dc72f9031a8c345b6ac077fc8ff30b`。ソースcommitと混同しない
- [Pages run 37439104263](https://github.com/chameleonjp-lab/uchiotose/actions/runs/37439104263) はこのgh-pages commitでbuild / report-build-status / deployがsuccess。deploy job完了記録は08:53:21 UTC、run更新は08:53:22 UTC
- [PR #8](https://github.com/chameleonjp-lab/uchiotose/pull/8) はマージ済み（merge commit `8b6e469f2007eed728fdefda7e4a9dda1d37702f`）。今回の正式配備はfixed-clockの長時間gap停止修正を含む。[PR #9の公開記録](https://github.com/chameleonjp-lab/uchiotose/pull/9#issuecomment-6012752273) と一致する。PR #9自体は受入検査の変更でゲームランタイム変更ではない
- 08:54:06–08:55:03 UTCに以下6ファイルがHTTP 200、独立したmain buildから `prepare-pages.mjs` で作成しgh-pagesへ提出した公開パッケージと全バイト・SHA-256一致。総合照合記録は08:55:57.349612 UTC

| 配布ファイル | 実応答SHA-256 |
|---|---|
| .nojekyll | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| assets/index-6rKQhKs9.js | `43c37845c5c40f00a614d813d5f68dad97d5d73ef46161725494bd19702cc639` |
| assets/index-jjlx_KNJ.css | `2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382` |
| index.html | `57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e` |
| release.json | `912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7` |
| third-party-notices.txt | `97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f` |

公開release.jsonの `rulesVersion: uchiotose-1` と `ranking: false` は配備証拠として記録する。これはランキング接続・backend版隔離の確認ではなく、ポータルrankingは引き続き未接続とする。

公開後のクラウドChromeでhome、遊び方の開閉、keyboard/touch設定編集画面、設定破棄・再表示、focus復帰を確認した。保存設定は変更していない。公開前後ともcloud WebGLを利用できずStartが無効だったため、公開ゲームプレイは未検証。WebKit検査は設定fixtureで、ゲーム全描画の証拠ではない。実iPhone Safariと実機GPU性能は未確認のまま。

### 今回の変更・検証と復元範囲

変更は `src/catalog.js`、`tests/catalog.test.js`、この証拠追記の3ファイル。8作品・5つの既存プレイ入口・紹介文・画像準備中・全8ランキング未接続を維持する。Gekichinの4製品hashと更新manifest/run、Uchiotoseのsource/gh-pages区別・6hash・公開済みPR #8・ranking:false・実機未確認を単体検査に固定する。他6作品は完全同一とし、歴史的記録はappend-onlyで残す。

Node.js 24で単体検査とbuildを実施し、ブラウザ定義を列挙する。buildは既存scriptを変更せず、検査用preloadで既存pathの削除を拒否し、新規distへ生成する。typecheck/lint専用scriptは本repoにない。ローカルとCIの結果はPRに記録し、PR head、base、GitHubが実際に検査するmerge refのSHAを区別する。定義列挙をbrowser実行成功とは扱わず、Chromium/WebKit実行結果は実際のPR CIで確認する。

Draft PRまでをこの作業の範囲とし、merge・Pages配備・workflow・権限・ゲームコード・DB・スコア送信は変更しない。復元は候補を採用しないか、採用後にこの3ファイルを通常のrevert PRで基点へ戻す。基点のGitHub履歴と全29blobの控えを保持しており、force pushや強制削除は不要。

ローカル確認結果（09:28 UTC）: Node.js v24.19.0、単体40件成功・失敗/skip 0、build成功。Chromium/WebKit定義は計28件を列挙できたが、ローカルでbrowser実行はしていない。生成HTMLの8カード・既存5入口・8つのランキング未接続、他6作品のdeep equality、旧証拠本文の完全保持、3 tracked filesのみの差分と空白検査を確認した。ローカルbuildのsource-revisionは比較用の基点SHAであり、提出後のPR headやCI tested merge SHAの検査結果には読み替えない。
