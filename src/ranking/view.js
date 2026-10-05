const messages={not_connected:'ランキング未接続',stopped:'ランキング表示停止中',loading:'ランキングを読み込み中',ready:'上位5名',empty:'まだランキング登録がありません',stale:'過去の取得結果です。更新確認が必要です。',error:'ランキングを取得できません'};

export function renderRanking(card,game,state){
  const status=card.querySelector('[data-ranking-status]');
  const results=card.querySelector('[data-ranking-results]');
  const scope=card.querySelector('[data-scope]');
  const time=card.querySelector('[data-ranking-time]');
  const retry=card.querySelector('[data-retry]');
  const mode=card.querySelector('[data-mode]');
  status.textContent=messages[state.state]+(state.state==='stale'&&state.errorCode?' 更新に失敗しました。':'');
  scope.textContent=`${state.modeLabel||'モード確認中'} / ${state.rulesVersion?`ルール版 ${state.rulesVersion}`:'ルール版未確認'}`;
  results.replaceChildren();
  if(state.rows.length){
    const table=document.createElement('table');
    table.setAttribute('aria-label',`${game.title} ${state.modeLabel||''}のランキング`);
    const head=table.createTHead().insertRow();
    for(const label of ['順位','登録名','ベスト']){const cell=document.createElement('th');cell.scope='col';cell.textContent=label;head.append(cell);}
    const body=table.createTBody();
    for(const row of state.rows){
      const line=body.insertRow();
      const formatted=state.score?`${new Intl.NumberFormat('ja-JP',{minimumFractionDigits:state.score.decimals,maximumFractionDigits:state.score.decimals}).format(row.bestValue/state.score.scale)} ${state.score.unit}`:String(row.bestValue);
      for(const value of [String(row.rank),row.displayName,formatted])line.insertCell().textContent=value;
    }
    results.append(table);
  }
  time.hidden=state.fetchedAt===null;
  time.textContent=state.fetchedAt===null?'':`最終取得: ${new Date(state.fetchedAt).toLocaleString('ja-JP')}`;
  retry.hidden=!['error','stale'].includes(state.state);
  retry.disabled=state.retryDisabled;
  if(mode&&state.mode)mode.value=state.mode;
}
