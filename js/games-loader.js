/* ===== Games loader: filters disabled games + tracks plays ===== */
window.GamesLoader = (() => {
  let manifest = null;
  const loaded = new Map();

  async function loadManifest(){
    if(manifest) return manifest;
    const res = await fetch('./games/manifest.json', { cache: 'no-cache' });
    manifest = await res.json();
    return manifest;
  }

  function getDisabledSet(){
    try {
      const v = window.Store ? Store.get('disabled_games', []) : [];
      return new Set(Array.isArray(v) ? v : []);
    } catch { return new Set(); }
  }

  async function renderGrid(container){
    const m = await loadManifest();
    const disabled = getDisabledSet();
    container.innerHTML = '';
    for(const g of m.games){
      if(g.locked || disabled.has(g.id)) continue;
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `<div class="emoji">${g.emoji || '🎮'}</div><div class="name">${g.title || g.id}</div>`;
      card.addEventListener('click', () => Router.navigate('#/game/' + g.id));
      container.appendChild(card);
    }
  }

  function injectScript(src){
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => res(true);
      s.onerror = () => rej(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  function trackPlay(id){
    try {
      if(!window.Store) return;
      const stats = Store.get('game_stats', {}) || {};
      const s = stats[id] || { plays: 0, lastPlayed: 0 };
      s.plays = (s.plays || 0) + 1;
      s.lastPlayed = Date.now();
      stats[id] = s;
      Store.set('game_stats', stats);
    } catch(e) { console.warn('[trackPlay]', e); }
  }

  async function mountGame(id, container){
    const m = await loadManifest();
    const meta = m.games.find(g => g.id === id);
    if(!meta || meta.locked) throw new Error('Game not available: ' + id);
    if(getDisabledSet().has(id)) throw new Error('Game disabled: ' + id);
    container.innerHTML = '';
    const globalName = 'Game_' + id.replace(/[^a-z0-9]/gi, '_');
    if(!window[globalName]){
      await injectScript('./games/' + meta.script);
    }
    const mod = window[globalName];
    if(!mod || typeof mod.mount !== 'function') throw new Error('Invalid game module: ' + id);
    await mod.mount(container);
    trackPlay(id);
  }

  return { loadManifest, renderGrid, mountGame };
})();
