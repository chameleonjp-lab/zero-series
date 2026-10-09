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

Illustrative additive DDL shape only (not executable as-is; body, exact release values, and grants need owner review):

```sql
ALTER TABLE public.games
  ADD COLUMN rules_version text,
  ADD COLUMN accepted_client_version text;

ALTER TABLE private.game_play_sessions
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
