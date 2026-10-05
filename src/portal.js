import {catalog} from './catalog.js';
import {createRankingAdapter} from './ranking/adapter.js';
import {createRankingStore} from './ranking/store.js';
import {renderRanking} from './ranking/view.js';

// No production reader is configured until each scope passes its connection gate.
const store=createRankingStore({adapter:createRankingAdapter({catalog})});
for(const game of catalog){
  const card=document.querySelector(`[data-game="${game.id}"]`);
  if(!card)continue;
  const retry=card.querySelector('[data-retry]');
  const mode=card.querySelector('[data-mode]');
  store.subscribe(game.id,state=>renderRanking(card,game,state));
  mode?.addEventListener('change',()=>store.select(game.id,mode.value));
  retry.addEventListener('click',()=>store.retry(game.id));
  // Disabled scopes render locally and cause no network calls.
  void store.load(game.id);
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)store.refresh();});
window.addEventListener('pagehide',()=>store.destroy(),{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)window.location.reload();});
