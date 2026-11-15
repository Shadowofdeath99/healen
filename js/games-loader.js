/* ===== Games loader: reads manifest.json, renders grid, loads game modules ===== */
window.GamesLoader = (() => {
  let manifest = null;
  const loaded = new Map();

  async function loadManifest(){
    if(manifest) return manifest;
    const res = await fetch('./games/manifest.json', { cache: 'no-cache' });
    manifest = await res.json();
    return manifest;
  }

  async function renderGrid(container){
    const m = await loadManifest();
    container.innerHTML = '';
    for(const g of m.games){
      const card = document.createElement('div');
      card.className = 'game-card' + (g.locked ? ' locked' : '');
      card.innerHTML = `<div class="emoji">${g.emoji || '🎮'}</div><div class="name">${g.title || g.id}</div>`;
      if(!g.locked){
        card.addEventListener('click', () => Router.navigate('#/game/' + g.id));
      }
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

  async function mountGame(id, container){
    const m = await loadManifest();
    const meta = m.games.find(g => g.id === id);
    if(!meta || meta.locked) throw new Error('Game not available: ' + id);
    container.innerHTML = '';
    const globalName = 'Game_' + id.replace(/[^a-z0-9]/gi, '_');
    if(!window[globalName]){
      await injectScript('./games/' + meta.script);
    }
    const mod = window[globalName];
    if(!mod || typeof mod.mount !== 'function') throw new Error('Invalid game module: ' + id);
    await mod.mount(container);
  }

  return { loadManifest, renderGrid, mountGame };
})();
