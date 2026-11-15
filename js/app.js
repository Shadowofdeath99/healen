(function(){
  const $ = (s) => document.querySelector(s);
  function show(id){
    ['splash','home','game-view','dashboard'].forEach(x => {
      const el = document.getElementById(x);
      if(el) el.classList.toggle('hidden', x !== id);
    });
  }
  async function openHome(){ show('home'); await GamesLoader.renderGrid($('#games-grid')); }
  async function openGame(id){
    show('game-view');
    $('#game-title').textContent = '...';
    const c = $('#game-container');
    try{
      const m = await GamesLoader.loadManifest();
      const meta = m.games.find(g => g.id === id);
      if(meta) $('#game-title').textContent = meta.title || id;
      await GamesLoader.mountGame(id, c);
    }catch(e){
      c.innerHTML = '<div style="padding:24px;text-align:center;color:#c33">⚠️ اللعبة دي لسه مش متاحة</div>';
      console.error(e);
    }
  }
  function openDashboard(){
    show('dashboard');
    if(window.Dashboard && Dashboard.init) Dashboard.init();
  }
  document.addEventListener('DOMContentLoaded', () => {
    $('#btn-start').addEventListener('click', () => Router.navigate('#/home'));
    $('#btn-back').addEventListener('click', () => Router.navigate('#/home'));
    $('#btn-parent').addEventListener('click', () => Router.navigate('#/dashboard'));
    $('#btn-dash-back').addEventListener('click', () => Router.navigate('#/home'));
    Router.on('home', openHome);
    Router.on('game', openGame);
    Router.on('dashboard', openDashboard);
    Router.handle();
  });
})();
