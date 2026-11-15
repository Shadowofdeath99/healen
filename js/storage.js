/* ===== Storage: IndexedDB (audio blobs) + localStorage (settings) ===== */
window.Store = (() => {
  const DB_NAME = 'ma-fille-db';
  const DB_VER = 1;
  const STORE = 'audio';
  let dbPromise = null;

  function openDB(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    return dbPromise;
  }

  async function putAudio(id, blob, meta={}){
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ id, blob, meta, ts: Date.now() });
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  }

  async function getAudio(id){
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const r = tx.objectStore(STORE).get(id);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
    });
  }

  async function listAudio(){
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const r = tx.objectStore(STORE).getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => rej(r.error);
    });
  }

  async function deleteAudio(id){
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  }

  // localStorage helpers
  function set(key, val){ try{ localStorage.setItem('mf_'+key, JSON.stringify(val)); return true; }catch(e){ return false; } }
  function get(key, fallback=null){ try{ const v = localStorage.getItem('mf_'+key); return v?JSON.parse(v):fallback; }catch(e){ return fallback; } }
  function remove(key){ try{ localStorage.removeItem('mf_'+key); }catch(e){} }

  return { putAudio, getAudio, listAudio, deleteAudio, set, get, remove };
})();
