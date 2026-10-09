import {catalog} from './catalog.js';
import {enhanceImages} from './media.js';
import {createProductionReader} from './ranking/reader.js';
import {createRankingAdapter} from './ranking/adapter.js';
import {createRankingStore} from './ranking/store.js';
import {renderRanking} from './ranking/view.js';

// The production reader accepts only independently verified, fixed bindings.
// Unconnected cards cause no network requests, even though transport is injected.
const read = createProductionReader({catalog});
const store = createRankingStore({adapter:createRankingAdapter({catalog,read})});
for (const game of catalog) {
  const card = document.querySelector(`[data-game="${game.id}"]`);
  if (!card) continue;
  const retry = card.querySelector('[data-retry]');
  const mode = card.querySelector('[data-mode]');
  store.subscribe(game.id,state => renderRanking(card,game,state));
  mode?.addEventListener('change',() => void store.select(game.id,mode.value));
  retry?.addEventListener('click',() => void store.retry(game.id));
  void store.load(game.id);
}
enhanceImages();
document.addEventListener('visibilitychange',() => {if (!document.hidden) store.refresh();});
window.addEventListener('pagehide',event => {
  if (event.persisted) store.suspend();
  else store.destroy();
});
window.addEventListener('pageshow',event => {if (event.persisted) store.resume();});
