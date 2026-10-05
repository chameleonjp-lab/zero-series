# ゼロ シリーズ トップ画面 実装計画書

文書状態: Draft / 実装未着手  
作成日: 2026-10-05  
対象: `chameleonjp-lab/zero-series`  
基準要件: [固定commitの要件仕様計画書](https://github.com/chameleonjp-lab/zero-series/blob/e7f797a5403bbcb1d254a43edd6d45ebcc93c242/docs/ZERO_SERIES_TOP_REQUIREMENTS_PLAN.md)  
要件先行commit: `e7f797a5403bbcb1d254a43edd6d45ebcc93c242`

この計画は上記要件R01〜R09、受入条件A01〜A13、ゲートG0〜G5を実装可能な単位へ分ける。要件文書の固定commitを正本とし、mainや作業中の追記を無条件に取り込まない。要件変更が必要なら差分と影響をレビューし、基準を明示して改訂する。

## 1. このPRで行うこと／後続に分けること

このPRの変更は次の2ファイルの追加だけ。

1. `docs/ZERO_SERIES_TOP_REQUIREMENTS_PLAN.md`
2. `docs/ZERO_SERIES_TOP_IMPLEMENTATION_PLAN.md`

READMEを含む既存ファイルは保持する。mainの調査基準は `79d15da46b4fe4bbdc76c0156f63fb96ae9680ea`、README blobは `519fa0d048e87e3364ec826045a569961920b12e`。アプリ、依存パッケージ、画像、workflow、SQL、migration、環境変数、DB、公開設定は追加・変更しない。

後続の実装はG0/G3承認後。ランキング枠のUI、実データの読取接続、ランキング送信、ゲーム公開を別工程に分ける。本PRをマージしてもゲームやランキングが動き始める構成にしない。今回merge/deployも行わない。

## 2. 推奨構成

### 2.1 静的ファースト

初期案は依存の少ない静的HTML/CSS/ES modules。ゲーム本体と別の独立入口にし、ゲームのThree.js・モデル・BGM・操縦UIを読み込まない。既存repoがREADMEだけなので、実装承認時にホスティング方式とビルド有無を決める。GitHub Pagesの公開URLは現段階で発行・推測しない。

将来のファイル構成案（このPRでは作成しない）:

| 項目 | 役割 |
|---|---|
| `index.html` | title/h1、静的に読める8カード、skip link、noscript案内 |
| `src/catalog.*` | 掲載対象、紹介、確認済みリンク、公開状態、画像出典、mode/版対応 |
| `src/styles.*` | Kaisen参考token、responsive grid、focus、200%文字対応 |
| `src/portal.*` | progressive enhancement、カード単位の状態表示、イベント管理 |
| `src/ranking/adapter.*` | 検証済みAPIだけを呼ぶread-only境界、scope/型検証 |
| `src/ranking/store.*` | scope別メモリcache、timeout、並列数、旧応答除外 |
| `assets/thumbnails/` | 権利確認済み実画面サムネイルと汎用fallback |
| `tests/` | 台帳・scope・状態・アクセシビリティ・UIの検査 |
| `docs/evidence/` | 候補SHA、試験条件、結果、機密・個人情報を除いた証跡 |

拡張子やbuild toolは実装開始時の最小構成に合わせる。静的カードを台帳から生成する場合も生成物と台帳の一致を検査し、JS無効で紹介・確認済みplayリンクが失われないようにする。

### 2.2 掲載台帳モデル

| フィールド | 要件・検査 |
|---|---|
| `id` / `displayOrder` | 指定8作品の一意IDと固定順。Seme等を拒否 |
| `title` / `description` | 実在ソースと対応。計画中の機能は予定と記載。長文も表示可能 |
| `repositoryUrl` / `sourceCommit` / `sourceRoot` | 実在するrepo・完全SHA・rootを記録 |
| `releaseState` | published / preparing / unverified。ソース実装有無と独立 |
| `playUrl` | verified httpsのみ有効。未確認/nullにはhrefを出さない |
| `publicationEvidence` | URL根拠、配備版、確認日時、確認方法、未確認項目 |
| `thumbnail` | path、寸法、比率、alt、撮影元commit/配備版、撮影日、権利情報。未作成はnull |
| `ranking.enabled` / `ranking.displayState` | enabledはfalseが初期値。表示停止は承認済み設定の明示的stopped、未接続はnot_connectedとして区別。枠があるだけでは有効化しない |
| `ranking.modes` | modeごとのbackend slug、rulesVersion、順位・単位・丸め契約、検証根拠 |
| `contentUpdatedAt` | 内容を実際に更新した日時。配備・取得日時と分離 |

初期入力は要件2.2の固定台帳から開始する。8作品を同じ進捗と扱わない。カイセンとFFは公開記録があるが現行画面未確認、マチマモレとファンタジアは文書段階、ゲキチンとウチオトセは限定的P1、センリョウは実装あり公開未確認、ヌスミダセは調査時READMEのみ。別担当の進行中PRはマージ済み扱いしない。

## 3. ランキングの設計境界

### 3.1 既存APIをそのまま完成形にしない

要件2.3の読取確認を出発点にする。現行 `get_best_score_ranking(p_game_slug, p_limit)` は登録名/slugごとのbestを返す一方、版の分離引数やscopeの応答を持たない。FFのnormal/easyはslugで分かれるが、rulesVersionまで分かれる証拠は不足する。`client_version`、HTML公開SHA、規約schema_versionをrulesVersionと勝手に同一視しない。

後続G2では作品・modeごとに次のどちらかを根拠付きで選ぶ。

- **既存経路の再利用:** そのslugの既存全記録に別ルール版が混在せず、将来の受付も同版に制限済みであること、backendの順位・名前集約・権限・対象データを確認できる場合のみ、固定対応表からread-only APIを利用
- **別の版分離契約が必要:** 確認できない場合は未接続のまま。新API、データ移行、再登録、version別保存、権限変更は影響整理した別案件とし、本実装に紛れ込ませない

再利用は一度の目視確認だけで維持しない。ルール版、ゲーム配備、backend受付条件、読取契約の対応を検証記録に固定し、それらの変更時は再検証完了まで接続無効にする。新しいスコア流入時にも版隔離が成り立つbackend保証がなければ未接続とする。この保証を追加するための書込みは本計画内で実施せず、必要なら別提案にする。

どちらもポータルが送信RPC、開始RPC、is_active変更を実行する理由にはならない。FFの現行is_active=trueは観測であり、このPRが再開したという意味ではない。

### 3.2 アダプターの入出力（将来の内部契約）

リクエストは `{ gameSlug, mode, rulesVersion, limit: 5 }`。これは**ポータル内部の提案契約**であり、既存RPCに未対応の引数を渡すAPI定義ではない。

戻り値は、検証したscope、state、最大5行の `{ rank, displayName, bestValue }`、`fetchedAt`、確認できる場合だけ `sourceUpdatedAt`、出典識別を持つ内部モデルへ正規化する。APIにscope情報がなければ検証済みの固定対応とserver条件の証拠が必須。unknownを希望値で埋めない。

アダプターは次を検査する。

1. caller指定のIDが掲載allowlistとmode/版対応表に存在する
2. endpointとbackend slugが固定された正しい組み合わせである。別作品や旧slugへ代替しない
3. 権限・backend条件・版分離証拠が有効である。停止・契約失効は通信しない
4. 応答の型、件数、有限な数値、整数のrank、表示名の型・長さ、単位/scale/小数桁が契約内
5. rankと返却順を保持し、同率をフロントで再計算しない。返却行が上限を超えた場合は契約違反として拒否し、勝手に正常扱いで切り詰めない
6. display_nameだけで異なる人を統合しない。backendの登録名集約保証を使用し、ブラウザへ生IDを渡さない
7. source更新日時をランキングsnapshot時刻へ読み替えない。取得時刻は正常応答の検証完了時

現行APIを使える場合の最大件数は `p_limit=5`。同点の例を正本と合わせて検査する。5行目の同点が続いても追加要求しない。表示順 `rank_no ASC → updated_at ASC → display_name ASC` はサーバーに任せ、JS localeCompare等で変えない。play_countは表示しない。

### 3.3 通信・cache・状態機械

- 初期は全ランキングenabled=false。mockはテスト専用で、本番データと表示を混ぜない
- 有効化済みカードのみ取得。各カードの選択中modeだけを読み、最大2並列。画面外カードは表示接近時に開始する案を測定する
- cache keyはゲーム・mode・rulesVersion・API契約版を含む。画像やゲームのcacheと分離
- ページ内メモリに限り5分fresh、取得失敗時30分までstale。期限到来の単発timerとタブ復帰時に古さを再評価し、再取得しなくても5分後はstale、30分超は行を隠す。再取得中はloading、失敗後は期限に応じstale/error。scope不一致、停止、契約変更はcacheを無効化し行を出さない
- 停止はstaleより優先。停止の正本は承認済みのポータル表示停止設定またはG2で意味確認済みのsource信号。games.is_activeだけで読取停止と断定しない。通信失敗はerror、契約未確定はnot_connected。停止判明時はin-flight世代を失効し、cacheを隠す。不正レスポンスやscope不一致時は既存cacheも安全確認なしで使わない
- timeout 8秒、同scopeのin-flight共有、一時的失敗のみ自動再試行1回、Retry-After尊重。手動再試行は2秒以上の間隔と処理中disabledで連打抑制
- 400系の不正scope/契約、権限不一致は自動再試行しない。429と一時エラーは区別して回数制限を守る
- カードごとのrequest世代を持ち、mode変更でabort。古い応答は破棄。タブ非表示で無期限pollingしない
- ready/empty/not_connected/stopped/error/staleを独立管理。Promise.allの1失敗で全カードを落とさない
- 取得中/完了通知はaria-liveを必要最小限にし、focusを勝手に移動しない

## 4. 実装順序と並行作業

| 段階 | 作業・成果 | 依存 | 完了条件・承認境界 |
|---|---|---|---|
| P0 文書 | 本2文書、独立レビュー、Draft PR | なし | 本PRのみ。G0の決定待ち |
| P1 台帳・デザイン確定 | 8作品の情報再確認、Kaisen参考token、wireframe、公開state、画像計画 | G0/G3 | 未確認値はnull、公開未確認はunverified、画像はplaceholder。新規公開や画像制作を混ぜない |
| P2 静的UI | semantic HTML、responsive cards、placeholder、keyboard/focus、静的リンク | P1 | A01〜A05、JS無効試験。ランキング未接続でも一覧を利用可能 |
| P3 ランキングUI・mock | adapter境界、state、scope別cache、モード切替、最大5行 | P1の契約案 | mock単体・UI試験A06〜A10。実DB接続なし |
| P4 接続判断 | backend契約のread-only再確認、ゲーム別対応表・版隔離証拠 | G0/G3、P1の対応表 | G2を作品別に判定。接続できる作品だけ候補化。不明は未接続。DB変更必要なら別提案 |
| P5 実読取接続 | 承認対象だけadapterを有効化、正本との照合 | P3/P4/G4 | A06〜A11。送信/開始呼出ゼロ、公開権限・データ最小化確認 |
| P6 画像・総合QA | 許可された撮影/最適化、実端末、低速、部分障害、予算測定 | P2/P3、画像制作承認 | A03〜A12。実データ接続分はP5結果も照合 |
| P7 公開判断 | 変更一覧、候補SHA、URL、公開範囲、復旧案を提示 | P6、公開対象のG1最終確認 | G5の承認材料を提出。承認前にmerge/deployしない |
| P8 公開確認 | 承認済み公開物と候補SHA照合、読み取り検査、監視窓の結果 | G5後の公開操作承認 | A13。部分未接続は明示して引き継ぐ |

G1は項目単位の確認であり、P1では画像実物・URLが未確定でもnullとplaceholderで台帳を確定できる。画像撮影・権利の最終判定はP6、公開リンクは有効化前に行う。G2はP4の成果、G5はP7後の承認であり、それぞれの作業開始条件に同じゲートの完了を置かない。

並行できる単位はP1の掲載調査とデザイン検討、P2の静的UIとP3のmock、P4のread-only契約確認、許可後のサムネイル撮影準備。境界と台帳schemaを先に合意し、同じファイルの同時編集を避ける。統合担当が最後に全画面・全state・全scopeを通して検査する。担当分散を理由に独立レビューや実機確認を省略しない。

ヌスミダセ側の文書確定はその作品の解説精度を上げる入力になるが、他7作品の台帳・UI計画を止める依存にはしない。レバー改修はこのrepoへ持ち込まない。

## 5. 検証計画

### 5.1 文書PRの検証（今回）

- 書込み直前にmain/tree/open PRを再確認し、対象2パスがないことを確認
- 要件を先行commitへ追加し、戻りSHAを実装計画の基準リンクに固定する
- 2文書をremoteから全文読戻し。手元と完全一致、リンク・ID・未解決項目・2文書間整合を確認
- baseとheadの比較でaddedが2件のみ、modified/deletedが0、README blob不変であることを検査
- 独立担当が仕様、根拠の強度、上位5名、版隔離、匿名閲覧、公開境界、未知状態、非破壊性をレビュー
- Draft PR、base=main、期待head SHAを確認。CIがあれば同SHAの結果を確認し、ない場合は「CIなし」と報告。テストが存在しない文書repoで実機試験済みとは言わない

### 5.2 後続の単体・fixture試験

架空名のみのfixtureを用い、本番へのテスト送信はしない。

| 試験群 | 代表ケース |
|---|---|
| 台帳 | 8件・順序・一意ID、未知作品拒否、null URL、https/host/path allowlist、公開未確認リンク無効 |
| 集約/順位 | 同じ登録名の複数プレイはbackend集約1行、同名の別人は区別保証なし、0/1/4/5/6行、1/1/3、5行境界の同率、asc/desc、scale/丸め |
| scope | FF normal/easy混在拒否、別gameSlug、古いrulesVersion、unknown版、誤gameId、レスポンスscope不一致、cache key衝突 |
| 状態 | 0件正常、未接続、停止、timeout、500、429、認可エラー、malformed JSON、不正型、重複・過剰応答 |
| race | normalの遅延応答よりeasyが先に完了、連打、abort後到着、前のscopeでの再試行結果 |
| cache | 5分/30分境界、ページを開いたままの期限到来とタブ復帰、期限超過、停止/契約失効時の破棄、時計の不正/逆行はfreshへ誤昇格させない |
| 安全性 | script/HTML/属性注入の表示名、極端長、制御文字、危険URL、秘密鍵pattern、ID・メールをlogに含めない |

人数保証はクライアントのdisplayName重複検査だけで証明しない。backend主キーと集約定義を含めて確かめる。過剰応答等をテストし、エラーを0件へ変換してしまわない。

### 5.3 UI・実端末・低速試験

- viewport 320/375/390/430px、iPhone Safariの縦横、PC 768/1280/1440px。模擬viewportと実iPhoneは分けて記録
- 200%文字拡大、長い日本語・連続英数字・最大桁スコア、Tab/Shift+Tab/Enter/Space、focus、VoiceOver読順
- サムネイル404・未作成・decode失敗、slow network、offline、JS無効、1作品だけtimeout、全ランキング失敗、停止
- mode切替中の応答逆転、再試行連打、ページ戻る/進む、再読込、タブ非表示から復帰。重複通信と誤表示なし
- 画像の撮影元・内容・権利・alt・比率・圧縮後画質を目視。モックや生成共有画像を実画面として混入させない
- cacheを消した状態で転送量、LCP/CLS、リクエスト数、並列数、console errorを測定。測定端末・ブラウザ・network条件を残す
- networkログでランキングは読取経路のみ。開始・送信・guest開始・play count記録・再開・DB変更呼出が0であることを確認

### 5.4 実接続の受入

G4承認後に、各接続scopeの正式APIとポータルの最大5行を同条件で照合する。順位・同率の順番・単位・mode・rulesVersionを確認し、無関係作品や生IDがないことを確かめる。個人情報を含むレスポンス本文・画像をそのまま公開repoへ保存しない。必要な証跡はテスト用匿名化fixtureまたは件数/成否など最小限にする。

既存ランキングへ書込みを伴うテストは行わない。backendの仕様・データを変えないと確認できない項目は未完了として残す。アプリの枠の合格とlive接続の合格を別項目で報告する。

## 6. 公開と復旧の計画

公開方式は未確定。G5では、公開するrepo/branch、候補完全SHA、正式URL、静的配信設定、変更対象、公開データ、復旧手順を提示する。main merge・Pages有効化・別ホスト公開を包括的に自動承認されたものとみなさない。

承認後の公開では以下を確認する。

1. remote headと配備対象SHA、公開HTML内の版識別、asset版が一致する
2. 配備日時は配備記録に基づく。source commit日時を公開日時に代用しない
3. cacheなしと既存cacheありで同じ候補版を読める。古いassetの混在を検出する
4. 静的入口・state・許可されたread-only通信を確認。ゲーム開始やスコア送信の副作用を起こさない
5. 不具合は該当カードの読取を停止する案、前の静的配備物へ戻す案を選べるようにする。過去配備物・元ファイルの控えと対象差分を保持する

復旧も外部状態の変更なので、実施対象・件数・理由・影響・復元方法を示して承認を得る。既に明示承認された復旧範囲だけは再確認不要。ランキングDBの削除、既存スコア修正、force push、再帰的強制削除を復旧手段にしない。

## 7. 依存・リスクと完了報告

| リスク | 対応 |
|---|---|
| 公開記録と現行配備の差 | README記述やmain SHAだけを公開版と呼ばず、URL/配備物を照合 |
| 仕様段階の作品を完成品に見せる | 予定・準備中・確認中ラベル、リンク無効、正直なplaceholder |
| legacy APIの版混在 | G2で証拠不足なら接続しない。別backend作業を必要とする残件として明示 |
| 同名を同一人物と誤認 | 登録名単位を説明、アカウント識別の保証は別仕様 |
| 同点と上位5の解釈差 | 既存rankと順序を尊重、5行上限を明示 |
| ランキング障害が導線を壊す | 静的内容維持、局所state、部分失敗、読取の分離 |
| 新たな追跡・個人情報漏れ | 表示最小、メモリcacheのみ、ログ最小、外部解析なし |
| 他案件との混在 | 対象2文書のみ。ゲーム/レバー/送信/DB/公開は別ゲート |

今回の完了報告には、Draft PR URL、base/head SHA、2追加ファイル、固定要件commit、全文読戻し・独立レビュー結果、CIの実際の有無、未実装と未接続の残件を含める。画面やランキングの稼働開始・公開成功を報告しない。
