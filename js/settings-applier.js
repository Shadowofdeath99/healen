/* Helen – Settings applier: theme, child name, language */
(function(){
  'use strict';

  function get(k, def){ try { return Store.get(k, def); } catch(e){ return def; } }
  function set(k, v){ try { Store.set(k, v); } catch(e){} }

  // ============ Theme ============
  const THEMES = {
    pink:   { primary: '#ff8fb1', primary2: '#e0567f', bg: '#fff7fa', accent: '#ffe1ea' },
    blue:   { primary: '#7cc4f2', primary2: '#3a8fc7', bg: '#f0f8ff', accent: '#d9f0ff' },
    green:  { primary: '#9be3a8', primary2: '#5cb870', bg: '#f3fdf5', accent: '#e0f7e4' },
    purple: { primary: '#c8a2e0', primary2: '#9b6cc0', bg: '#f9f4ff', accent: '#ecdcff' }
  };

  function applyTheme(){
    const name = get('theme', 'pink');
    const t = THEMES[name] || THEMES.pink;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-primary2', t.primary2);
    root.style.setProperty('--theme-bg', t.bg);
    root.style.setProperty('--theme-accent', t.accent);

    // Also update meta theme-color for mobile
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', t.primary);

    // Inject a dynamic style tag that overrides common pink colors
    let tag = document.getElementById('hl-theme-style');
    if(!tag){ tag = document.createElement('style'); tag.id = 'hl-theme-style'; document.head.appendChild(tag); }
    tag.textContent = `
      body { background: ${t.bg} !important; }
      .splash, #app { background: ${t.bg} !important; }
      .btn-primary, .btn-xl { background: ${t.primary} !important; color: #fff !important; }
      .topbar { background: ${t.primary} !important; }
      .tab.active { background: ${t.primary} !important; color: #fff !important; }
      .game-card { border-color: ${t.primary} !important; }
      .game-card:hover { background: ${t.accent} !important; }
    `;
  }

  // ============ Child name ============
  function applyChildName(){
    const name = (get('child_name', '') || '').trim();
    if(!name) return;

    // Splash sub
    const splashSub = document.querySelector('#splash .splash-sub');
    if(splashSub && !splashSub.dataset.hlName){
      splashSub.dataset.hlName = '1';
      const original = splashSub.textContent || '';
      splashSub.textContent = original + ' — يا ' + name + ' 🌸';
    }

    // Update any [data-hl-name] placeholders
    document.querySelectorAll('[data-hl-name]').forEach(el => {
      el.textContent = el.textContent.replace(/\{name\}/g, name);
    });

    // Also update document title with child name
    const baseTitle = document.title.replace(/\s—\s.*$/, '');
    if(!document.title.includes(name)){
      document.title = baseTitle + ' — ' + name;
    }
  }

  // ============ Language ============
  function applyLanguage(){
    const lang = get('language', 'both');
    document.documentElement.setAttribute('data-hl-lang', lang);
    // audio.js will read this via Store.get('language')
  }

  // ============ Apply all ============
  function applyAll(){
    try { applyTheme(); } catch(e){ console.warn('[settings-applier] theme:', e); }
    try { applyChildName(); } catch(e){ console.warn('[settings-applier] name:', e); }
    try { applyLanguage(); } catch(e){ console.warn('[settings-applier] lang:', e); }
  }

  // Re-apply when settings change (custom event)
  window.addEventListener('hl:settings-updated', applyAll);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => setTimeout(applyAll, 100));
  } else {
    setTimeout(applyAll, 100);
  }
})();
