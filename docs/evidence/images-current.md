# 現行の公開製品画面画像

2026-10-09に、公開版の製品コードをハッシュ固定したローカルリプレイから5作品のHome／タイトル画面を撮影し、640×360・960×540のWebPを作成した。これは実製品画面の証拠だが、**実プレイ画面の撮影要件は満たしていない**。すべてStart操作前の画面で、戦闘画面として扱ってはならない。

詳細な契約、公開マニフェスト・観測ファイル、ソースと派生のSHA-256、ブラウザー状態、権利とalt/captionは [`images-current.json`](images-current.json) に記録した。ビルド側は各項目の `gameId`, `sourceCommit`, `deployedCommit`, `capturedAt`, `outputs`, `version`, `alt`, `caption`, `evidence` を使用できる。`outputs` の `src` は次の画像ファイルを指し、640と960の両方が登録されている。

| 作品 | 撮影した公開版画面 | 640 / 960 WebP | 実プレイ画面 |
|---|---|---|---|
| kaisen | 海上、戦闘機、艦隊と操作モード選択を含むタイトル画面 | [640](../../assets/screenshots/kaisen-42a69bc9873d-640.webp) / [960](../../assets/screenshots/kaisen-42a69bc9873d-960.webp) | 未撮影。Startなしの製品preview経路を確認できていない。 |
| faitofuraito | 青空・零戦のタイトル背景とモード選択。パイロット名は空欄 | [640](../../assets/screenshots/faitofuraito-ce4eff271a44-640.webp) / [960](../../assets/screenshots/faitofuraito-ce4eff271a44-960.webp) | 未撮影。Startなしの製品preview経路を確認できていない。 |
| machimamore | 街・海・UFOのタイトル背景、モード選択と有効な「街を守りに出撃」ボタン | [640](../../assets/screenshots/machimamore-883dc35fd2d1-640.webp) / [960](../../assets/screenshots/machimamore-883dc35fd2d1-960.webp) | 未撮影。Startなしの製品preview経路を確認できていない。 |
| gekichin | タイトル、母艦・砲台の説明、モード選択。背景は暗い空と水平線 | [640](../../assets/screenshots/gekichin-214e1a7181ab-640.webp) / [960](../../assets/screenshots/gekichin-214e1a7181ab-960.webp) | **未撮影。** 公開Homeに母艦や砲台の戦闘レンダリングがない。Startを押さずに戦闘画面を表示する安全なpreview経路も確認できていない。 |
| uchiotose | 浮遊島、自機、艦隊と有効な「作戦開始」ボタンを含むタイトル画面 | [640](../../assets/screenshots/uchiotose-f1e85d80c44b-640.webp) / [960](../../assets/screenshots/uchiotose-f1e85d80c44b-960.webp) | 未撮影。Startなしの製品preview経路を確認できていない。 |

### 撮影と通信の条件

各作品の正式公開URL、公開マニフェスト、製品ファイルをTLS検証付きで取得した記録は `docs/evidence/current-games.json` と `/workspace/game-sources/public-assets/<id>/observation-at-capture.json` にある。撮影スクリプト [`capture-games.mjs`](../../scripts/capture-games.mjs) は、マニフェストのSHA-256と一致するバイト列だけをローカルから返し、未知URLやGET/HEAD以外の要求を中断する。ブラウザーコンテキストもofflineに設定した。

5ページすべてでHomeが表示され、プレイ画面は表示されなかった。Start、クリック、キー、ポインター、タッチ入力は送っていない。各ページで許可した製品ファイルへの静的要求は3件、非GET要求の試行は0件、外部要求の許可は0件、中断要求は0件、コンソール／ページ実行時エラーは0件だった。新規のプレイ開始、ランキング送信、戦闘セッションは行っていない。初期Home表示に必要な製品側の待機状態は通常どおり生成され得るが、プレイ開始イベントは発火していない。

環境はPlaywright 1.63.0、Chromium 153.0.8010.12、Linux 6.18.44 x64、1280×720・DPR 1・ja-JP・reduced motion。ChromiumはSwiftShaderによるWebGLを有効にして起動した。4作品ではHomeの製品背景シーンが実際に表示された。ゲキチンはタイトルパネルのみで、戦闘背景は表示されない。WebGL APIのvendor/version値は個別に採取していない。

原画は1280×720 PNGで撮影し、切り抜かず16:9のままWebPへ忠実に縮小した。ImageMagick 7.1.1-43 / libwebp 1.5.0を使用し、色・構図の編集、生成画像、既存social-card、UI専用fixtureは使っていない。派生画像は合計142,152 bytesで、個別サイズ・ハッシュはJSONにある。原画は一時領域にあり、リポジトリには派生WebPだけを配置した。各原画SHA-256からファイル名のhash部分を構成した。

### 権利・プライバシーと対象範囲

このタスクではユーザーが公開製品画面の撮影とポータル掲載用派生を承認している。これはゲームリポジトリ全体へのライセンス主張ではない。公開 `third-party-notices.txt` はThree.jsのMIT表示を含むが、リポジトリ全体のライセンスとしては扱っていない。各作品の公開ソース資料（素材来歴、第三者素材方針、実装状態など）と、個別の権利判断はJSONの `rightsReview` と `rightsBasis` に記録した。人物、個人名、通知、アカウント情報は画面に含まれていない。

撮影時点で公開証拠が揃っていなかった `senryou`、`fantasia`、`nusumidase` は撮影していない。`faitofuraito` の公開 `social-card.png` は共有用画像であり、製品画面としては使っていない。既存の `portal-desktop.png` と `portal-mobile.png` はポータルUIの画像で、製品スクリーンショットとしては数えていない。

### 安全な戦闘preview経路のソース確認

公開時のsource commitへ固定した5リポジトリのproduction sourceだけを読み取り検索した。Startイベントは戦闘状態を開始する実装へつながり、Startを避けて製品の戦闘rendererだけを出すURLやpreview hookは確認できなかった。`preview` の一致は操作設定の配置previewであり、戦闘シーンではない。ファイトフライトの `?display-check=1` は結果リンク等の状態を表示する読み取り専用テキスト診断で、戦闘画面を出さない。ゲキチンの `MOTHERSHIP_PREVIEW` も母艦寸法定数である。既存のテスト画面生成はテストfixtureやプレイ中の状態に依存するため利用していない。作品ごとのStart経路とファイル位置はJSONの `capturePolicy.previewRouteAudit` に記録した。


### 描画準備完了後に撮影した画面

独立レビューでMachiとUchiのStartが無効状態に見える点を受け、capture scriptに最大20秒の読み取り専用ready待機を追加した。Machiでは製品が `prepareGraphics()` を完了し、`#start` が有効かつ「街を守りに出撃」へ変わり、`#startup-error` が非表示であることを確認した。撮影までの待機は2,497ms。Uchiでは製品が `renderer.prepare()` 後に `pollRender() === ready` となり、`#start` が有効、`#p1-status` が「準備完了」を記録して非表示となったことを確認した。撮影までの待機は2,511ms。どちらもStartは押していない。これは製品のHome renderer準備完了信号であり、物理GPU性能を主張しない。

以前の2画像は描画準備完了前に取得されたため置き換えた。Machi旧原画SHA-256は `9fdec2cadc003531bf71406c6bcc4f6817cc418c8bc881eb2481887ef342711a`、旧派生640 SHAは `5bc7ffb13e9d94489e30dcaaae5f167ae323811cd655d134deb62fd31c7fa9bc`、960 SHAは `d4c0dc14535b961621fc8c8fa9b3566055772fceb95537b12a809a412876ebc4`。Uchi旧原画SHA-256は `1c87c1f8d272e2e12acd4dff9cc6f44c96084424947d182e2499992f5bbf6f75`、旧派生640 SHAは `64e9aba110078644a0647f7466bd2d724326a9fdb206a32f54d41dc150809a6b`、960 SHAは `1e9ccf8cf1aeb13932e727734e402faf0914525e62ec63472a94451a2bb1cc66`。旧Machi画面は「画面を準備しています」、旧Uchi画面は無効なStartを表示していた。今回の画像と置き換え前後の状態はJSONに記録した。旧派生ファイルはassetsから削除した。
