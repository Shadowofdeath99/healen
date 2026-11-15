/* ===== Simple hash router ===== */
window.Router = (() => {
  const routes = new Map();
  function on(path, fn){ routes.set(path, fn); }
  function navigate(hash){ if(location.hash !== hash) location.hash = hash; else handle(); }
  function handle(){
    const raw = location.hash.replace(/^#\/?/, '') || 'home';
    const [name, ...rest] = raw.split('/');
    const fn = routes.get(name) || routes.get('home');
    if(fn) fn(rest.join('/'));
  }
  window.addEventListener('hashchange', handle);
  window.addEventListener('DOMContentLoaded', handle);
  return { on, navigate, handle };
})();
