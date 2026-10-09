# Ranking connection recheck

Checked: 2026-10-09 14:58 UTC  
Scope: read-only inspection of the current shared repository and Supabase metadata for the eight-game Zero Series portal. No player or score rows were read. No start, finish, submit, retry, or resume RPC was called. No database object or permission was changed.

## Decision

The existing read RPC is publicly callable and its current argument/return contract is usable for a fixed-slug, read-only request. It does **not** isolate a `rulesVersion`, and the current Faitofuraito records are stored under slugs that are not tied to a rules version. Therefore no production scope is safe to enable today. All portal ranking entries remain `enabled: false` and `not_connected`.

Only the two Faitofuraito modes are candidates for a later, separately verified connection:

| Portal mode | Current slug | Score shape | Current gate |
|---|---|---|---|
| Normal | `faitofuraito_normal` | descending integer points, scale 1, 0 decimals | disconnected; rules version unknown |
| Easy | `faitofuraito_easy` | descending integer points, scale 1, 0 decimals | disconnected; rules version unknown |

No other game's slug is inferred from its title or URL.

## Current source contracts

The current `chameleonjp-lab/chameleonjp_lab` `main` commit observed through GitHub's read API was [`18ed5f3e6b29ab65df6488d10295cc31fd9a9225`](https://github.com/chameleonjp-lab/chameleonjp_lab/tree/18ed5f3e6b29ab65df6488d10295cc31fd9a9225). Its [`ranking.html`](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/ranking.html) calls `get_best_score_ranking` with `p_game_slug` and `p_limit`. It does not send a mode or rules-version argument.

The shared [ranking integration standard](https://github.com/chameleonjp-lab/chameleonjp_lab/blob/18ed5f3e6b29ab65df6488d10295cc31fd9a9225/docs/chameleonjp-lab/11_ranking_integration_standard.md) defines `client_version` as the game build/release version. That value is not a rules version. The [Faitofuraito main source](https://github.com/chameleonjp-lab/faitofuraito/tree/8946bf12a777d24c7334b887492d62fd93153e23) and its [`ranking-manifest.json`](https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/public/ranking-manifest.json) contain Normal/Easy mode IDs, the two slugs above, and `client_version: faitofuraito-web-20260929-02`; neither the manifest nor the inspected `src`, `public`, and `docs/DB_RANKING.md` source contains a `rulesVersion` or `rules_version`. The game reader also calls `get_best_score_ranking` with only `p_game_slug` and `p_limit`.

The current [Faitofuraito DB ranking note](https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/docs/DB_RANKING.md) says both rows are inactive. That note is stale relative to the database observation below; do not use it as proof of current activation.

## Eight-game source and deployment audit

The following comparison uses the latest-main clones and release records captured in [current-games.json](current-games.json) (`sourceObservedAt: 2026-10-09T14:46:27Z`, record observed at `2026-10-09T15:03:20Z`). A deployment SHA is the source SHA recorded by the published artifact, not a `gh-pages` branch commit. For published releases the public artifact hashes were checked against the pinned deployed source; the evidence record identifies the exact artifact parity result. The three games without a verified public deployment have no deployed ranking behavior to infer.

| Game; pinned main → deployed source | Ranking present in main / deployed source | Saved name; mode | Rules and score | Best aggregation and ties | Public read permission |
|---|---|---|---|---|---|
| Kaisen; [`519fd0d` main/deployed scoring note](https://github.com/chameleonjp-lab/kaisen/blob/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032/docs/SCORING.md) → same SHA | No ranking, name submission, external score submission, or persistent score history in either. The pinned scoring notes explicitly defer online ranking. | No saved player name; Easy / Normal. | `rulesVersion=kaisen-air-sea-11`; `scoreRulesVersion=kaisen-contribution-1`; points are a mission result. | No saved best, aggregation, or tie rule. | No public ranking RPC or ranking permission in this source/deployment. |
| Faitofuraito; [`8946bf1` manifest](https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/public/ranking-manifest.json), [`ranking.ts`](https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/src/ranking.ts) → same source SHA; Pages branch `88bfaf5` | Online ranking is present in source and the published artifact. | Name is locally retained under `faitofuraito.player-name.v1`; only registered names rank. Normal → `faitofuraito_normal`, Easy → `faitofuraito_easy`. | No `rulesVersion`/`rules_version` in the inspected source or manifest. `client_version=faitofuraito-web-20260929-02` is a release identifier. Integer points, 0–2,147,483,647, descending, best. | Server aggregate is per `normalized_name` and exact `game_slug`. Equal best scores share the server rank; display order among them is `updated_at`, then `display_name`. | `anon` and `authenticated` can execute `get_best_score_ranking`; it is `SECURITY DEFINER`. The public route was probed only with an absent sentinel slug; no real-game rows were fetched. Live FF rows are active despite the stale source note. |
| Machimamore; [`192c075` main README / score](https://github.com/chameleonjp-lab/machimamore/blob/192c075532a8f0d2810a444ae5ac299cdfec9f1a/README.md) → [`1d27a69` deployed README](https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/README.md) | No ranking or saved score in either; current and deployed READMEs explicitly exclude ranking, names, and external score submission. | No saved player name; Easy / Normal. | Main [`rules.ts`](https://github.com/chameleonjp-lab/machimamore/blob/192c075532a8f0d2810a444ae5ac299cdfec9f1a/src/rules.ts) defines `machimamore-2`; [`score.ts`](https://github.com/chameleonjp-lab/machimamore/blob/192c075532a8f0d2810a444ae5ac299cdfec9f1a/src/score.ts) exposes an integer run total. | No saved best, aggregate, or tie rule; score is for the current mission. | No public ranking RPC or permission in source/deployed artifact. |
| Gekichin; [`01d9d9c` main scoring](https://github.com/chameleonjp-lab/gekichin/blob/01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3/src/scoring.ts) → [`de500c3` deployed scoring](https://github.com/chameleonjp-lab/gekichin/blob/de500c3e0e077fe2bab636dc2a382a8796ea8b9e/src/scoring.ts) | No public ranking. Both sources have a local best record, not a public leaderboard. | No saved player name; Easy / Normal. | Main [`rules.ts`](https://github.com/chameleonjp-lab/gekichin/blob/01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3/src/rules.ts) defines `gekichin-combat-v1`; score is integer points. | LocalStorage key `gekichin-best-${RULES_VERSION}-${mode}`; victories only. Higher total wins, then lower `endTick`, then fewer combined player/wingman losses; an exact tie keeps the existing record. | No public read RPC or permission in source/deployed artifact. |
| Uchiotose; [`7506b4c` main scoring / deploy policy](https://github.com/chameleonjp-lab/uchiotose/blob/7506b4c883f7ed0154f6bb3ddc902e62a73eb2c8/src/scoring.ts) → [`2a7e815` deployed policy](https://github.com/chameleonjp-lab/uchiotose/blob/2a7e815c70baf9dc65721fc938909b6ab083f074/docs/DEPLOYMENT.md) | No ranking, name input, external score send, or saved best in either. Deployment notes explicitly exclude DB/ranking connection. | No saved player name; Easy / Normal. | Main `rulesVersion=uchiotose-1`; integer result points. | No saved best, aggregate, or tie rule. | No public ranking RPC or permission in source/deployed artifact. |
| Senryou; [`6ad011e` main network gate / score](https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/docs/NETWORK_ACCEPTANCE.md) → no verified deployment | No ranking or score persistence found in runtime source. Its network acceptance contract rejects external communication; the score is a result snapshot. | No saved player name; Easy / Normal. | [`battle/rules.ts`](https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/src/battle/rules.ts) defines `senryou-rules-v1`; result has an integer total assembled from kill, support, capture, time, and loss components. | No runtime best or tie aggregation. A requirements statement about comparing mode/rules-compatible records is not an implemented save path. | No public deployment or ranking read permission verified. |
| Fantasia; [`08f2c98` main records / rules](https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/src/campaign-records.ts) → no verified deployment | No public ranking. Main has local best records. | No saved player name; Easy / Normal. | [`campaign-config.ts`](https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/src/campaign-config.ts): current default is `fantasia-capture-v1-dragon-fireballs-suspended`; base is `fantasia-capture-v1`. Map is `fantasia-sevenfold-v1`; points are secondary to time. | LocalStorage only; successful, uninterrupted base-rule victories; comparison group is mode + rules + map + seed + start heading. Lower `recordTicks` wins, then higher score. Current suspended default is ineligible for persistent and session-only bests. | No public deployment or ranking read permission verified. |
| Nusumidase; [`c604c79` main requirements](https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/REQUIREMENTS.md) → no verified deployment | No game `src/` or current runtime ranking implementation exists in the pinned main snapshot. The document describes a future local-record feature only. | No current saved name or mode implementation; planned Normal / Easy. | No current runtime `rulesVersion` value or score contract. The plan requires rule/mode separation but does not provide a released value. | Plan only: `nusumidase-records-v1`, latest 20 completed records plus per-mode/rules best; victory comparison by larger capture difference, then shorter `playTicks`. Further exact-tie handling is unspecified. | No public deployment or ranking read permission verified. |

For Kaisen, Machimamore, Gekichin, and Uchiotose, the source files and requirements linked above distinguish a local result/best from a public leaderboard. The deployed-source SHA is included even when older than current main; [current-games.json](current-games.json) records `deployedSourceProductBytesMatch=true` for those published artifacts. For Senryou, Fantasia, and Nusumidase the current evidence records no verified deployed source, so source-only observations must not be presented as live behavior. Faitofuraito is the only audited source with a public leaderboard contract; its Normal/Easy mappings are candidates only, not portal-approved versioned scopes.

## Current Supabase metadata

The connected project is `chameleonJP-Lab` (`mlpnjgezrnhdxsxolyzj`). The following checks used Supabase's table metadata tool and read-only catalog `SELECT`s.

| Object | Current metadata | Consequence |
|---|---|---|
| `public.get_best_score_ranking(text, integer)` | `STABLE`; `SECURITY DEFINER`; owner `postgres`; empty `search_path`; returns `rank_no, display_name, first_score, best_score, play_count, updated_at` | The function is read-only, but its returned rows do not identify a rules version. |
| Effective public permissions | `anon` and `authenticated` both have `EXECUTE`; direct RLS is enabled on `public.games` and `public.game_scores` | The RPC is public. Because it is `SECURITY DEFINER`, it runs with its owner's rights and bypasses table RLS. The returned public leaderboard fields must remain narrowly projected by the reader. |
| Ranking function behavior | Matches the normalized slug; includes rows with non-null `first_score` and `ranking_status = 'normal'`; ranks by `games.score_order`; keeps server `rank_no`; orders ties by `updated_at`, then `display_name`; clamps row limit to 1–100 | Send `p_limit: 5`, preserve server order/rank, and do not turn the row limit into “all tied at rank five.” |
| `public.games` | Has `game_slug`, score configuration, `is_active`, and submission fields, but no rules-version column | The current slug is not bound to a rule version by this table. |
| `public.game_scores` | Primary key `(normalized_name, game_slug)`; no rules-version column | A registered name has one aggregate per slug, not per rules version. Reusing the slug across rule versions merges those scores. |
| `public.score_runs` and `private.game_play_sessions` | Have `client_version`; neither has a rules-version column | The source/build version is recorded, but the read RPC does not filter on it. |
| Faitofuraito rows | `faitofuraito_normal` and `faitofuraito_easy` are both `is_active=true`, `submission_mode='shared'`, `top_ranking_type='best'`, `score_order='desc'`, unit `点`, scale 1, decimals 0 | This differs from the checked-in Faitofuraito note. Activation alone does not satisfy the rules-version gate. |

The RPC definition contains no `rules_version`, `client_version`, mode, or `is_active` predicate. It aggregates `game_scores` by normalized registered name and slug. The backing score table is therefore not a one-person-one-human guarantee; the UI should say “registered-name best” and must not infer identities from display names.

The current Faitofuraito write flow is `start_game_play_v1` → `finish_game_play_v1` → `submit_score_idempotent_v1`. Metadata inspection shows the start/finish/submit functions bind a play session to its `game_slug` and `client_version`; the game registry does not bind either value to a rules version. None of those write functions was called.

## Public route check

To verify the public route without retrieving real player data, the database first confirmed that `zero_series_read_only_probe_20261009` was absent from `public.games`. The only public request was:

```json
{"p_game_slug":"zero_series_read_only_probe_20261009","p_limit":5}
```

It called only `get_best_score_ranking` at the fixed Supabase RPC route using the active legacy anon key; the response was HTTP 200 with an empty JSON array. The key was not printed, added to source, or retained in this evidence. No real game slug was queried through the public API.

Supabase's current [security guidance](https://supabase.com/docs/guides/observability/advisors?queryGroups=lint&lint=0028_anon_security_definer_function_executable) explains that an anon-callable `SECURITY DEFINER` function can bypass RLS. The current function is intentionally a public ranking surface, but this exposure should be part of the backend review before creating another public function.

## Reader implementation boundary

`src/ranking/reader.js` pins the single existing RPC URL and name, sends only `p_game_slug` plus `p_limit: 5`, rejects scopes without a fixed verified binding, and accepts only a publishable key or legacy anon key. It never accepts a caller-supplied URL, RPC, slug mapping, or argument object. Its production binding table is empty because no scope passed the version-isolation gate. The two Faitofuraito mappings are candidate scopes only. The reader strips `first_score`, `play_count`, `updated_at`, normalized names, and other raw fields before returning data to the adapter.

The production catalog remains disabled. A verified adapter fixture or successful transport unit test cannot enable a live scope.

## Smallest safe backend proposal

No SQL in this section was executed or committed. The existing `game_scores` primary key cannot hold independent versions for one slug, and existing submission RPCs do not bind `client_version` to `rulesVersion`. A safe additive contract needs to establish both sides:

1. Give each mode/rules-version an immutable backend scope. The smaller migration is a new slug per rules version because both `game_scores` and the existing RPC already partition on `game_slug`; never reassign the current `faitofuraito_normal` or `faitofuraito_easy` slugs to a new rule set. Leave their unversioned history disconnected.
2. Add authoritative `rules_version` and accepted client-release metadata to `public.games`. Bind the accepted values when `start_game_play_v1` creates a session, then require the same values through finish and score submission. A client-supplied version label alone is not proof.
3. Add a read-only versioned RPC such as `get_best_score_ranking_v2(p_game_slug text, p_rules_version text, p_limit integer DEFAULT 5)`. It must verify that the requested version matches the authoritative game row, filter the exact versioned scope, use the backend's rank/order contract, and return only the public ranking fields. Keep the legacy RPC unchanged for legacy consumers.

The smallest reviewable contract has these concrete field/function dependencies. Any field named in the required-condition column but absent from the current-schema column is proposed, not an existing field. Version values and new slugs remain owner decisions; none is filled in by this portal change.

| Layer | Exact current fields / function inputs | Required condition before a scope can be enabled |
|---|---|---|
| Mode and rules registry | `public.games.game_slug` is the current aggregation scope; the existing row also carries `score_order`, `score_unit`, `score_scale`, `score_decimals`, `top_ranking_type`, `submission_mode`, `score_min`, `score_max`, and `is_active`. It has no `rules_version`. | Every new rule set gets a new immutable `game_slug` for its mode. Add authoritative `rules_version` and exact accepted `client_version` metadata to the game row. Both version strings must be trimmed, nonempty, and bounded (use the current `client_version` convention of 1–80 characters); do not backfill legacy values or give legacy slugs a guessed version. Reject any active ranking row whose scope/version/release mapping is incomplete. The owner selects the actual version strings and release SHA before migration. |
| Name and score scope | `public.game_scores` uses `(normalized_name, game_slug)` as its primary key. The Faitofuraito manifest accepts a trimmed 1–20-character display name and integer score `0..2147483647`. | Treat `normalized_name` as a registered display-name key, not an authenticated human identity. Keep one immutable slug per mode/rules version so the existing primary key cannot merge versions. Preserve the current FF score contract only if the selected new game build uses it: integer points, `desc`, unit `点`, scale 1, decimals 0, `best`, `shared`, min 0, max 2147483647. |
| Start | Current client calls `start_game_play_v1` with `p_start_id`, `p_display_name`, `p_game_slug`, and `p_client_version`; the anonymous path uses `start_faitofuraito_guest_play_v1` and has no ranked finish path. `private.game_play_sessions` stores `play_id`, `start_id`, `game_slug`, `client_version`, and registered-name data; it has no rules version. | Resolve `(game_slug, client_version)` against the backend registry and derive `rules_version` server-side. Store the tuple on the session. Reject unknown release, slug/mode mismatch, and client-supplied version mismatch. If a `p_rules_version` input is added, compare it to the registry; never trust it as the source of truth. Add `rules_version` to the session row; retain existing start-ID idempotency and conflict checks. |
| Finish | `finish_game_play_v1` receives `p_play_id`, `p_display_name`, `p_game_slug`, `p_result_type`, `p_reached_wave`, `p_score`, `p_client_version`, and `p_ranking_score`. | Lock and load the started session; require its `game_slug`, `client_version`, and stored `rules_version` to match the registered scope and the submitted finish. Preserve the existing one-time frozen result and reject changed/replayed scope values. Do not accept a new rules version at finish. |
| Score submission | `submit_score_idempotent_v1` receives `p_play_id`, `p_submission_id`, `p_display_name`, `p_game_slug`, `p_score`, and `p_client_version`. `public.score_runs` records `game_slug` and `client_version`, but no rules version. | Require a matching finished session and exact same scope tuple; validate the score against `public.games.score_min/score_max`; bind idempotency to the same `p_submission_id` and frozen result; reject cross-mode, cross-slug, cross-release, or cross-rules resubmission before aggregate upsert. Add `rules_version` to `score_runs` for audit. The aggregate remains partitioned by immutable unique `game_slug`. |
| Ranking read | Existing `get_best_score_ranking(p_game_slug text,p_limit integer)` has no rules argument and returns `rank_no`, `display_name`, `first_score`, `best_score`, `play_count`, `updated_at`. | Add `get_best_score_ranking_v2(p_game_slug text,p_rules_version text,p_limit integer DEFAULT 5)`, `STABLE`, `SECURITY DEFINER`, `SET search_path = ''`. Require the authoritative active row to match the exact slug/version; return only `rank_no bigint`, `display_name text`, and `best_score integer`; preserve `rank()` ties by score, server ordering by update time/name, and bounded row limit. Revoke default `PUBLIC` execution and grant only the approved public client roles on this read function; leave write grants and legacy RPCs unchanged. |
| Verification and rollback | Current function is anon/authenticated executable and security-definer; direct RLS does not constrain its owner-rights query. | On a disposable database branch verify client-release rejection, session→finish→submission tuple equality, idempotent replay, mode/rules isolation for equal normalized names, score bounds, tie/rank/limit behavior, exact public function grants, and no direct access to private rows. Recovery disables only the newly versioned rows or revokes only the new read grant, retains submitted history and legacy slugs/functions, and rolls game clients back to the last accepted release. |

Illustrative additive DDL shape only (not executable as-is; body, exact release values, and grants need owner review):

```sql
ALTER TABLE public.games
  ADD COLUMN rules_version text,
  ADD COLUMN accepted_client_version text;

ALTER TABLE private.game_play_sessions
  ADD COLUMN rules_version text;

ALTER TABLE public.score_runs
  ADD COLUMN rules_version text;

CREATE FUNCTION public.get_best_score_ranking_v2(
  p_game_slug text,
  p_rules_version text,
  p_limit integer DEFAULT 5
)
RETURNS TABLE(rank_no bigint, display_name text, best_score integer)
-- STABLE; validate p_rules_version against public.games; read only;
-- preserve server rank/order and return no normalized_name.
```

If the product needs the same slug to serve multiple rules versions, a new aggregate table keyed by `(normalized_name, game_slug, rules_version)` and corresponding version-aware write functions are also required; adding a nullable column to `game_scores` while keeping its current primary key would still merge versions.

Expected impact is limited to the new Faitofuraito versioned scopes and their game-side RPC integration. Existing score history stays in its legacy slug and is not backfilled or relabeled. No new paid service is needed. Before enabling the portal, verify in a disposable database branch: old and new client-version mismatch rejection; session→finish→submission scope equality; same-name scores isolated across rule versions; Normal/Easy isolation; rank ties/order and limit; anon can call only the intended read RPC; direct table access remains blocked; no writer or restart request is issued by the portal.

Recovery for a later rollout: disable the new versioned game rows or revoke only the new reader grant, revert the game deployment to the last known client, and leave submitted versioned rows intact for investigation. Keep legacy slugs and RPCs unchanged. A production migration, function grant, game write-flow update, or legacy-data relabel requires a separate explicit approval because it changes production schema, public database behavior, or accepted game submissions; none is part of this portal reader change.
