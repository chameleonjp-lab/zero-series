# ゼロ シリーズ トップ画面 要件仕様計画書

文書状態: Draft / 実装前の提案  
作成日: 2026-10-05  
対象: `chameleonjp-lab/zero-series`  
調査基準: 2026-10-05 03:28–03:32 UTC（12:28–12:32 JST）の読取確認。実装開始時に再確認する

## 1. 目的と今回の範囲

「ゼロ シリーズ」の各作品を、実画面サムネイル、タイトル、短い解説、ゲームへの入口、ゲームごとのランキング上位5名で紹介する、スマートフォン優先のトップページを計画する。

今回の成果物はこの要件仕様計画書と実装計画書の**新規文書2件のみ**。既存README・ゲーム・ランキング・DB・公開設定は変更しない。Draft PR作成までとし、画面実装、画像制作、ランキング接続・送信・再開、本番SQLやmigration、デプロイ、マージは含めない。

- 初期対象は指定の8作品に固定する。Seme、診断、素材ツール、その他の実験場作品は含めない
- ヌスミダセの文書整備 → 本トップの文書整備 → レバー実装の優先順位を守る。資料確認など相互に依存しない作業は品質を落とさず並行可能。トップの文書はレバー改修に依存させない
- ゲーム本体はそれぞれのリポジトリに残す。全作品のiframe埋め込みや同時WebGL起動は行わない
- 本文の数値・構成は初期案であり、本番で達成済みの主張ではない

## 2. 現状と根拠

### 2.1 対象リポジトリ

調査時のmainは [`79d15da46b4fe4bbdc76c0156f63fb96ae9680ea`](https://github.com/chameleonjp-lab/zero-series/tree/79d15da46b4fe4bbdc76c0156f63fb96ae9680ea)。再帰treeはREADME.md 1件だけで、HTML、package設定、画像、テスト、workflow、AGENTS.md、`.agents/skills`は存在しなかった。READMEのblobは `519fa0d048e87e3364ec826045a569961920b12e`。既存実装へ増築する前提にしない。

### 2.2 初期8作品の台帳

| 作品・repo | ソースに基づく紹介案 | 読取時の実体・初期状態 | 公式プレイURLの根拠 | サムネイル状況 |
|---|---|---|---|---|
| [Kaisen / カイセン](https://github.com/chameleonjp-lab/kaisen) | 自機と僚機で敵航空機・戦艦を撃破する海上空戦タイムアタック | [main/実装root](https://github.com/chameleonjp-lab/kaisen/tree/3d751051dc6212482a129e8da596ddd349b2f9f5)にindex.html/src。公開記録あり、現行画面未確認 | [README](https://github.com/chameleonjp-lab/kaisen/blob/3d751051dc6212482a129e8da596ddd349b2f9f5/README.md)に https://chameleonjp-lab.github.io/kaisen/ 。[Pages run](https://github.com/chameleonjp-lab/kaisen/actions/runs/37242180604)は同main SHAで成功 | treeに画像ファイルなし。未作成placeholder |
| [faitofuraito / ファイトフライト](https://github.com/chameleonjp-lab/faitofuraito) | 零戦二一型を題材に、ノーマル／イージーで操縦と射撃を楽しむ空戦ゲーム | [main/実装root](https://github.com/chameleonjp-lab/faitofuraito/tree/c2b313d37875b93458032d98636fcf5b5d30a138)にindex.html/src。公開記録あり、現行画面未確認 | [README](https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/README.md)に https://chameleonjp-lab.github.io/faitofuraito/ 。[deployment.json](https://github.com/chameleonjp-lab/faitofuraito/blob/8d22fa535e2f107745710b37df5c92b2ab1b763b/deployment.json)の公開元は037e7914572871f18eb9aa9a41eca4fdae9f3bc7で、mainとは別 | public/social-card.pngは[生成された共有用画像](https://github.com/chameleonjp-lab/faitofuraito/blob/c2b313d37875b93458032d98636fcf5b5d30a138/docs/SHARING_ASSET.md)。実画面thumbとして使わない。evidence画像は採用未確認 |
| [machimamore / マチマモレ](https://github.com/chameleonjp-lab/machimamore) | 街を攻撃する円盤UFOを味方戦闘機と迎撃する都市防衛ゲーム（企画） | [root](https://github.com/chameleonjp-lab/machimamore/tree/4cefae935236f2b8bb6a9e5895ddd05220883eb2)はREADME/docsのみ。[要件書](https://github.com/chameleonjp-lab/machimamore/blob/4cefae935236f2b8bb6a9e5895ddd05220883eb2/docs/REQUIREMENTS.md)で実装・公開未実施。準備中 | 未確認 / URL未設定 | 画像なし / placeholder |
| [gekichin / ゲキチン](https://github.com/chameleonjp-lab/gekichin) | 超大型宇宙船の100基の砲台を僚機と破壊するタイム／スコアアタック（企画） | [root](https://github.com/chameleonjp-lab/gekichin/tree/98119b5ae6604ad5975024b0e523b78eef369662)に実装あり。[進捗](https://github.com/chameleonjp-lab/gekichin/blob/98119b5ae6604ad5975024b0e523b78eef369662/docs/IMPLEMENTATION_STATUS.md)はP1飛行プロトタイプ、砲台戦・勝利経路は未実装。開発中／入口準備中 | 未確認 / URL未設定 | docs/evidence/p1の検査画像あり。専用thumb・権利・見え方未確認 |
| [uchiotose / ウチオトセ](https://github.com/chameleonjp-lab/uchiotose) | 味方艦隊と戦闘機が、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム（企画） | [root](https://github.com/chameleonjp-lab/uchiotose/tree/2714a9ffc002312c10831ea5deedd887eeedc7b0)に実装あり。[進捗](https://github.com/chameleonjp-lab/uchiotose/blob/2714a9ffc002312c10831ea5deedd887eeedc7b0/docs/IMPLEMENTATION_PROGRESS.md)はホームと有限戦力台帳のP1、開始ボタン準備中 | 未確認 / URL未設定 | docs/evidenceにホーム検査画像。戦闘実画面ではない、採用未確認 |
| [senryou / センリョウ](https://github.com/chameleonjp-lab/senryou) | 戦闘機で地上戦へ介入し、歩兵による拠点占領を支援する一戦完結型ゲーム | [root](https://github.com/chameleonjp-lab/senryou/tree/46223297a39ae17ca2bbd091218fa1676d320b0e)にindex.html/src/battle。[README](https://github.com/chameleonjp-lab/senryou/blob/46223297a39ae17ca2bbd091218fa1676d320b0e/README.md)確認。通しプレイ未検証、開発中／公開確認中 | 未確認 / URL未設定 | treeに画像なし / placeholder |
| [fantasia / ファンタジア](https://github.com/chameleonjp-lab/fantasia) | 剣と魔法の世界で、7方面へ進む味方軍を戦闘機で支援する占領戦タイムアタック（企画） | [root](https://github.com/chameleonjp-lab/fantasia/tree/4d217d839875c3e7ddc066add284c66089418926)はREADME/docs。[仕様](https://github.com/chameleonjp-lab/fantasia/blob/4d217d839875c3e7ddc066add284c66089418926/docs/FANTASIA_SPEC.md)で実装・ビルド・実行・配備未着手。準備中 | 未確認 / URL未設定 | 画像なし / placeholder |
| [nusumidase / ヌスミダセ](https://github.com/chameleonjp-lab/nusumidase) | 紹介文は要件確定後に追記。現時点で内容を推測しない | [root](https://github.com/chameleonjp-lab/nusumidase/tree/2ca2e0a9ccddc41438175e750a93d0190d531ac7)は[README](https://github.com/chameleonjp-lab/nusumidase/blob/2ca2e0a9ccddc41438175e750a93d0190d531ac7/README.md)のみ。進行中の文書PRはmainの既成事実にしない。準備中 | 未確認 / URL未設定 | 画像なし / placeholder |

上記8repoは実在確認済み。READMEで正式URLを確認できた2作品は、公開ページの読取ツールが取得不能だったため、**公開記録あり／現在の画面未確認**と記録する。初回の実装台帳では `unverified` とし、G1で現行配備の確認後にpublishedへ進める。他6件はGitHubのhas_pages=falseかつhomepageなし、調査した公式資料にplay URLを確認できなかった。別ホストを含む絶対的な未公開断定はしない。画像ファイルの記載はtree上の存在確認で、ピクセル・掲載権利・採用可否は未確認。

公開先URLがソースに記載されていること、公開ページを取得できること、現在の公開版が実際に遊べることは別の確認である。この調査ではゲームを開始せず、送信・プレイ回数の副作用を発生させない。HTTP成功だけで「動作確認済み」としない。新しい正式URLを命名規則から組み立てない。

初期並びは Kaisen、faitofuraito、machimamore、gekichin、uchiotose、senryou、fantasia、nusumidase。日本語表示名と紹介は固定ソースに基づく。仕様段階の作品は「予定」と明記し、未実装の機能を完成済みとして紹介しない。

### 2.3 ランキングの既存正本と確認限界

根拠となる既存ソースは実験場main [`18ed5f3e6b29ab65df6488d10295cc31fd9a9225`](https://github.com/chameleonjp-lab/chameleonjp_lab/tree/18ed5f3e6b29ab65df6488d10295cc31fd9a9225)。

- [`ranking.html`](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/ranking.html) の `fetchBestRanking` は `get_best_score_ranking` に `p_game_slug` と `p_limit` を渡す。使用列は `rank_no`、`display_name`、`best_score`、`play_count` など
- [`共通ランキング規約`](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/docs/chameleonjp-lab/11_ranking_integration_standard.md) は表示名を本人の一意識別番号とみなさない。[`現行フロー`](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/docs/chameleonjp-lab/03_supabase_ranking_flow.md) はRPCの順位・単位を使う
- [`ファイトフライト資料`](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/docs/chameleonjp-lab/13_faitofuraito_integration.md) は通常とイージーの分離、名前未登録は順位対象外を定める。一方、同資料の2026-09-29時点の `is_active=false` は現状確認とは異なる

2026-10-05 03:29 UTCに、接続済みの既存ランキングDBで**関数定義・権限・台帳・制約メタデータだけをSELECTで読取確認**した。プレイヤー行・実スコアは取得せず、RPC実行・変更はしていない。確認結果は次の通り。DB状態はこの時点の観測であり、将来を保証する固定ソースではない。

| 項目 | 読取確認結果 | ポータルへの影響 |
|---|---|---|
| 関数 | `get_best_score_ranking(text, integer)`、STABLE。戻り値は `rank_no, display_name, first_score, best_score, play_count, updated_at` | `mode`・`rulesVersion`引数も応答scopeも存在しない |
| 集約単位 | `game_scores`の主キーは `(normalized_name, game_slug)` | 登録名ごとのbestであり、実在の人物の一意性は保証しない |
| 対象行 | 対象slugと一致し、`first_score is not null`、`ranking_status`がnormalの行 | 全プレイ履歴や失格・非表示行を並べるものではない |
| 順位 | `score_order`がascならbest昇順、その他は降順の `rank()` | 同点は同順位、次順位は飛び番。クライアントで付け直さない |
| 同順位の順序 | `rank_no ASC, updated_at ASC, display_name ASC` | DB照合順序を含む返却順を保持。ブラウザ独自の名前ソートをしない |
| limit | 1〜100に制限される。順位ではなく行数制限 | `p_limit=5`で最大5行。境界の同率全員を追加しない |
| 権限 | anon/authenticatedに実行権限あり | SQLロールanonは閲覧用権限の意味。匿名スコア登録の許可と混同しない。実際のブラウザ読取成功は未検証 |
| 台帳 | 指定8作品のslug接頭辞照合ではFFの `faitofuraito_normal` と `faitofuraito_easy` のみ一致。両方 `is_active=true`、desc、点、scale 1、小数0 | activeを変更しない。他作品が別名登録されている可能性は残る。推測で別slugに接続しない |
| 版の分離 | `games`と`game_scores`の確認対象列にrulesVersion列はなく、関数にも版フィルタなし | 過去ルール混在の安全性を保証できない。既存RPCをそのまま接続済みとはしない |

**重要な接続ゲート:** 現状の読取APIだけでは `gameSlug + mode + rulesVersion` の隔離を保証できない。各slugの全記録が単一ルール版であり、将来の受付も同じ版に制限されることをbackendの検証・制約の証拠付きで確認するか、別途承認した版分離済み読取契約を用意するまで、そのランキング枠は「未接続」のままにする。フロントでrulesVersionラベルを付け足すだけでは合格しない。接続中もゲームのルール・送信受付条件・読取契約がその保証を維持し、変更時には再検証まで未接続へ戻せることが必要。保証を継続できないlegacy経路は接続しない。

## 3. 画面・掲載要件

### R01 ページとカード

- document titleと見出しh1は正確に「ゼロ シリーズ」とする
- 各カードは作品サムネイル → ゲームタイトルh2 → 解説 → 公開状態とプレイ入口 → ランキング、の読順とする
- 解説は通常1〜3文程度。長い日本語・連続英数字は折り返し、固定高や省略で意味を失わせない
- プレイ入口は「カイセンを遊ぶ」など作品名が分かるアクセシブル名を持つ。通常は同じタブへ遷移し、戻る操作を妨げない
- 8作品以外を共通ランキングの全件取得から自動追加しない。掲載台帳を唯一のallowlistにする
- ゲーム説明・リンク・ランキングの失敗はカード単位で分離する。1作品の不具合で一覧全体を消さない

### R02 公開状態とURL

掲載台帳には、実装有無とは独立した `releaseState = published | preparing | unverified` を持つ。

- published: 正式URL、配備版、公開内容を確認済み。ゲームへのリンクを有効にする
- preparing: 未公開・仕様段階など、準備中と確認できた作品。カードを残し「準備中」、リンクは作らない。`href="#"`など見せかけの入口を禁止する
- unverified: 正式URLまたは現行公開状況の確認が完了していない。URLがnullの場合も含む。「公開状況確認中」としリンク無効
- GitHub repo/rootリンクはプレイリンクと区別した開発資料。リンクが実在しても公開中の代用にしない
- 正式play URLは台帳の検証済みhttps URLに限定する。外部APIの任意URL、javascript/data URL、open redirect、別ゲームへのfallbackを使用しない
- 画面内の「最終更新」は、作品紹介更新、配備、ランキング取得を区別する。ファイルの読取日時や現在時刻をゲームの公開日時として表示しない

### R03 サムネイル

- 本PRでは画像を制作・撮影・流用しない。後続で各ゲームの実プレイ画面を撮影する。想像した画面を実画面として使わない
- 撮影対象の正式URLまたは承認済み候補版、ソースcommit、配備版、撮影日時・端末・撮影者を台帳に残す。未公開作品は承認された候補版がなければ撮影しない
- 素材・キャラクター・音声以外の映り込みを含め、掲載権利を確認する。プレイヤー名、通知、個人情報を含まない撮影用データを用いる。スコア送信を起こさない方法で撮影する
- 初期案は全カード16:9、幅640/960pxの派生画像。主要被写体・HUDを切らない。縦画面は余白付きcontainを許し、不適切な引伸ばし・トリミングをしない
- WebP/AVIF候補と汎用fallbackを比較し、目標は代表画像1枚120KB以下。画質優先の例外は根拠を記録する
- width/heightまたはaspect-ratioで領域を予約、srcset/sizes・async decodeを使う。ファーストビューの主要1枚以外はlazy loading。全作品の動画・ゲームコードを読まない
- altは「カイセンのゲーム画面: …」のように実際の内容を短く説明する。未確認の被写体を記述しない。周囲の説明と重複する装飾fallbackはalt空、別テキストで「画像準備中」を伝える
- 未作成・404・decode失敗は共通placeholderと「画像準備中」または「画像を読み込めません」に置換し、実ゲーム画像ではないことを隠さない

### R04 ブランドとレイアウト

Kaisenの[固定CSS](https://github.com/chameleonjp-lab/kaisen/blob/3d751051dc6212482a129e8da596ddd349b2f9f5/src/style.css)を統一ブランドの参考とする。背景 `#071e2b`、本文 `#eff4ed`、金 `#e4c88b`、補助文字 `#b8cbce`、主要ボタン背景 `#e5cc98` / 文字 `#152c35` が既存値。本文はsystem-ui / -apple-system / Hiragino Kaku Gothic ProN / Noto Sans JP / sans-serif、タイトルはHiragino Mincho ProN / Yu Mincho / serif。Noto Sans JPの指定だけでWebフォント配信済みとは扱わず、追加ダウンロードを必須にしない。色・書体は読みやすさを検証してポータル用tokenへ整理する。操縦レバー・計器・射撃UIをトップへ複製しない。

- iPhoneでは縦横とも1列。初期案はprimary pointerがcoarseなタッチ端末を1列に保ち、hover可能なfine pointerのPCでは幅768pxから2列、1200pxから3列、コンテンツ最大1200px。幅だけでiPhone横向きを複数列へ変えない。UA文字列に依存せず、実機・複合入力端末・文字拡大を含む実測で条件を調整する
- 320px幅でも横スクロールに頼らず、本文・表示名・スコアを折り返す。iPhoneの縦横、safe area、ブラウザバーの変化を確認する
- すべての操作対象は44×44 CSS px以上。隣接操作に間隔を設ける。タッチだけでなくマウス・キーボードでも操作可能とする
- ページのズームを禁止しない。200%文字拡大で欠落・重なり・操作不能を発生させない
- visible focus、自然なTab順、skip link、適切な見出し、意味のあるリンク・button要素、screen reader向けの状態通知を備える
- 色だけで公開／エラー／停止を伝えない。本文コントラスト4.5:1を目標に実測し、フォーカスや操作部品の境界も識別可能にする
- 自動アニメーションを最小化し、prefers-reduced-motionを尊重する

## 4. ランキング要件

### R05 「上位5名」の意味

1. 1作品・1mode・1rulesVersion内で、既存正本のプレイヤー単位の最高記録を1行に集約する。上位5プレイ・最新5送信ではない
2. 現行共通系のプレイヤー単位は正規化された登録名である。表示には「上位5名」「登録名ごとのベスト」と説明し、同名の別人を識別できると宣伝しない。本人アカウントによる厳密な1人1行が必要なら別仕様・別承認に分ける
3. 表示名文字列だけを手掛かりにフロントで人を推定・結合しない。backendの集約と識別契約を検証する。改名・同名衝突の扱いは既存正本に合わせる
4. defaultは確認済みの標準モードを1つ表示。FFはnormalを代表にし、easyは明示した切替で別取得する。未確認のmodeを作らない。単一モードでも内部契約は明示する
5. ルール版が異なる記録やEasy/Normalは混在させない。各表示にmodeとrulesVersionの識別可能なラベルを添える。未確定版を「最新」と仮置きして接続しない
6. 順位はサーバーのrank_no、行順は正本の返却順を保持する。例: スコア100、100、90なら1位、1位、3位。内部値の大小と表示値の丸めを取り違えない
7. **最大5行**。5行目と6行目が同率でも6行目を追加しない。「同率を含め最大5名を表示」と明示する。少人数なら実人数だけ表示し、ダミー名・0点で埋めない
8. スコア単位・scale・小数桁・昇降順はゲーム契約に従う。FFの観測値は点/scale1/整数/desc。他作品に無条件コピーしない
9. 初期表示列は順位、登録名、ベスト値だけ。play_countや実スコア履歴を余計に取得・表示しない。既存RPCで付属列が返る場合は表示／保存／ログから除く

### R06 取得とscope契約

掲載台帳の作品識別子（例: faitofuraito）と、ランキング保存slug（例: faitofuraito_normal）を別項目で管理し、対応表を明示する。

- 必須scope: `gameSlug + mode + rulesVersion`。同じscopeだけでリクエスト、レスポンス、cache、再試行、描画を対応付ける
- source/APIには対象scopeの記録だけを返す保証が必要。既存APIにscope応答がなければ、検証済みの固定対応・サーバー条件・版別保存を組み合わせた証拠を接続ゲートで確認する。クライアントの自己申告ラベルだけでは不可
- slug不明・誤gameId・未対応版・scope不一致・未知の返却形式は失敗として扱う。似た名前や他ゲーム、別mode、以前選択したカードをfallback表示しない
- 遅い旧リクエストがモード切替後の新しい結果を上書きしない。AbortControllerとrequest世代番号等で防ぐ
- 取得はread-only。作品開始・プレイ回数記録・submit系RPCをポータルから呼ばない。名前登録・ランキング送信・停止中ゲームの再開を意味しない
- ポータル閲覧のために追加ログイン・名前入力を強制しない。既存ゲームの名前必須の登録規約と、FFの名前なしプレー／順位対象外の既存例外は変更しない

### R07 状態を分ける

| 内部state | 表示例 | 行の扱い・動作 |
|---|---|---|
| loading | ランキングを読み込み中 | 前回同scopeの正当なcacheがあれば取得日時付きで扱う。無限spinner禁止 |
| ready | 上位5名 / mode / rulesVersion / 最終取得日時 | 検証済みの1〜5行 |
| empty | まだランキング登録がありません | 接続済み・正常応答0件に限る。エラーと混同しない |
| not_connected | ランキング未接続 | API/対応/版隔離が未確定。fakeランキングなし、通信しない |
| stopped | ランキング表示停止中 | 運用上の停止を確認した場合。cacheも隠す。停止を勝手に解除しない |
| error | ランキングを取得できません / 再試行 | 通信失敗・不正応答・scope不一致等。安全な同scope cacheがなければ行を消す |
| stale | 過去の取得結果（日時）/ 更新確認が必要。取得失敗時はその旨を併記 | 許容期限内で同scopeの検証済みcacheだけ。停止・不一致・契約失効時は使用不可 |

停止の正本は、承認済みポータル設定の明示的な「表示停止」、またはG2で意味と取得経路を確認したsource側の表示停止信号とする。現行 `games.is_active` は既存一覧・送信受付にも関わるため、値だけでポータルの読取停止と同一視しない。停止信号がなく通信に失敗した場合はerror、契約が未確定ならnot_connectedであり、停止を推測しない。停止判明時には同scopeのin-flight応答を破棄し、cacheを非表示にする。

取得時刻 `fetchedAt`、元データ時刻 `sourceUpdatedAt`、コンテンツ更新、配備日時は別物。既存RPCの各行 `updated_at` はプレイ状況等の更新を含み、ランキング全体の生成日時と呼ばない。unknownは不明のまま表示する。

初期cache案: ページ内メモリのみ、有効5分、取得失敗時に30分までstale表示可。それ以上は破棄してerror。永続保存・別端末同期は行わない。期限到来時およびタブ復帰時に古さを再評価し、5分経過後にreadyのまま放置せずstale表示、30分を越えた結果は非表示にする。再取得中はloading、失敗後は期限に応じstale/errorへ遷移する。通信は最大2並列、timeout 8秒、同scopeの重複要求をまとめる。再試行ボタンは連打抑制し、自動再試行は一時的失敗に1回まで。バックグラウンドの無期限pollingはしない。数値はモック・低速試験で見直す。

## 5. セキュリティ・性能

### R08 最小限の公開データ

- 表示名は信頼しないテキストとしてtextContent等で挿入。HTML・Markdownとして解釈しない。制御文字、極端な長さ、不正型の検査を行う
- endpoint、画像URL、ゲームURLは設定済みoriginと許可パスを検証する。API応答から新しい外部URLや画像を作らない
- ブラウザへ置けるのは正規の公開用設定だけ。service_role、secret、DB接続文字列、個人トークンは文書・コード・HTML・log・成果物へ含めない。本計画にキー値は掲載しない
- player ID、normalized_name、認証情報、メール、IP、生DBレコードを露出しない。必要最小の登録名・順位・best以外をブラウザの永続storageやアクセス解析へ記録しない
- 公開読取の権限/RLS/API契約を確認する。読取不可だからといって匿名の直接テーブル権限や管理キーを足さない
- 初期版は広告、外部解析、アカウント作成、通知登録を増やさない

### R09 軽量静的サイト

- 静的HTML/CSSと必要最小のJSを基本案とする。SSRサーバーやSPA frameworkを必須にしない
- 静的なタイトル・紹介・公開済み入口は、ランキングのネットワーク失敗やJS無効でも読める構成にする
- 3Dモデル、音声、ゲームJS、iframeを一覧表示時に先読みしない。画像だけで紹介する
- 初期性能予算案: HTML+CSS+JS gzip合計150KB以下、主要画像を含む初回表示500KB以下、サムネイル全8件合計1MB以下。予算超過は測定・理由・軽量化案を記録する
- キャッシュなしのモバイル低速条件でLCP 2.5秒以内・CLS 0.1以下を目標測定値とする。実機性能を計画時点で保証しない
- エラーが起きても高さの急変、重複要求、全画面ブロックを避ける

## 6. 受入条件

| ID | 試験 | 合格条件 |
|---|---|---|
| A01 | 初期表示・掲載範囲 | title/h1が「ゼロ シリーズ」、指定8カードのみ、Seme等なし |
| A02 | 公開・未公開・未確認 | 確認済みURLだけ有効。準備中/確認中はリンク無効。repoリンクを遊ぶ導線にしない |
| A03 | 画像成功/404/未作成 | 実画面・出典・権利情報が対応、placeholder明記、比率維持、alt、lazy、CLS確認 |
| A04 | 320/375/390/430pxとPC | iPhone1列・PC複数列、長文・長いスコアでも欠落や横overflowなし |
| A05 | 200%文字・keyboard・VoiceOver | 44px以上、focus可視、全操作到達、状態とmodeが読め、ズーム禁止なし |
| A06 | 0/1/4/5/6名・同名・同率 | backend集約単位、最大5行、1/1/3等の順位保持、5行境界で増えない |
| A07 | normal/easy・rulesVersion切替 | 混在なし、scope不一致拒否、遅延旧応答の上書きなし |
| A08 | 未接続/停止/timeout/部分失敗 | 0件と区別、他カード利用可能、停止cache非表示、再試行が局所的 |
| A09 | cache/期限/clock | 同scopeだけ、5分/30分境界、元データ時刻と取得時刻を混同せず古さを明示 |
| A10 | 表示名XSS・悪意URL・不正型 | scriptやHTMLは実行されず、許可外URL・NaN・不正順位・過剰応答等を拒否 |
| A11 | read-only・匿名閲覧 | 開始/送信/再開RPCゼロ、追加ログインなし、キー・DB生ID漏洩なし |
| A12 | 性能・JS無効・低速 | 静的紹介/入口を保持、全ゲーム起動なし、予算測定、個別timeout、無期限spinnerなし |
| A13 | 公開版照合 | 承認済み候補SHAと実配備版・資産版が一致。日時を捏造しない |

A01〜A12は後続実装の受入条件であり、この文書PRで実行済みではない。A13は別途公開承認後に限る。

## 7. 決定ゲートと未解決事項

| ゲート | 解消する内容 | それまでの安全な扱い |
|---|---|---|
| G0 文書承認 | 要件・8作品・初期構成・最大5行・登録名単位の意味 | Draftのまま、実装開始しない |
| G1 掲載情報 | 正式タイトル/解説、公開状態、正式URL、実配備版、画像と権利 | 未確認リンク無効、画像placeholder |
| G2 読取契約 | 8作品ごとのscope/単位/順位/API権限/版隔離を検証 | ランキング枠は未接続。FFの現在activeを触らない |
| G3 実装承認 | 静的UI・モック・試験対象と差分を確定 | 文書のみ |
| G4 実読取接続 | 許可対象、使用API、公開データ、scope証拠を固定 | モックの試験画面のみ。モックは本番表示しない |
| G5 公開承認 | 公開先・候補SHA・範囲・復旧方法を提示して承認 | merge/deployしない |
| 別案件 | ゲームの実装、ランキング送信開始/再開、DB変更、レバー変更 | 本計画の対象外。必要なら個別に承認を受ける |

G1は掲載項目単位で判定する。P1相当では未確認値をnullとし、placeholder・無効リンクで設計を進められる。実画像・権利・公開URLの最終確認は、それぞれを表示／有効化する前に完了させる。

安全な枠の完成と実ランキング接続の完成は別に報告する。未接続のまま公開する場合も、全ランキング接続済みとは呼ばない。全8作品の接続が未完了なら、その残件を明示する。
