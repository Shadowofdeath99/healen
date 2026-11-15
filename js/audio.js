/* ===== Audio2: recorded first, Egyptian TTS fallback ===== */
window.Audio2 = (() => {
  const cache = new Map();
  let current = null;

  // Pick best matching voice
  function pickVoice(langPrefix){
    const voices = speechSynthesis.getVoices();
    if(!langPrefix) return voices[0] || null;
    const p = langPrefix.toLowerCase();
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(p)) || null;
  }

  function speakTTS(text, lang){
    return new Promise((res) => {
      if(!('speechSynthesis' in window)){ res(false); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if(lang === 'eg' || lang === 'ar'){
        u.lang = 'ar-EG';
        u.rate = (function(){try{var v=parseFloat(Store.get('tts_speed',0.85));return isNaN(v)?0.85:v;}catch(e){return 0.85;}})();
        u.pitch = 1.1;
        const v = pickVoice('ar');
        if(v) u.voice = v;
      } else {
        u.lang = 'fr-FR';
        u.rate = (function(){try{var v=parseFloat(Store.get('tts_speed',0.85));return isNaN(v)?0.85:v;}catch(e){return 0.85;}})();
        u.pitch = 1.1;
        const v = pickVoice('fr');
        if(v) u.voice = v;
      }
      u.onend = () => res(true);
      u.onerror = () => res(false);
      speechSynthesis.speak(u);
    });
  }

  async function playRecorded(id){
    try{
      let entry = cache.get(id);
      if(!entry){
        const rec = await Store.getAudio(id);
        if(!rec || !rec.blob) return false;
        entry = URL.createObjectURL(rec.blob);
        cache.set(id, entry);
      }
      if(current){ try{ current.pause(); }catch(e){} }
      const a = new Audio(entry);
      current = a;
      await a.play();
      return true;
    }catch(e){ return false; }
  }

  /**
   * play(id) — reads from recorded audio or TTS from VOICE_DICT
   * Returns 'recorded' | 'tts' | 'none'
   */
  function getLang(){
    try {
      var l = Store.get('language', 'both');
      return (l === 'fr' || l === 'eg') ? l : 'both';
    } catch(e) { return 'both'; }
  }

  async function play(id, opts={}){
    const ok = await playRecorded(id);
    if(ok) return 'recorded';

    // Try from voice dictionary
    if(window.VOICE_DICT){
      const flat = getAllPhrases();
      const item = flat.find(x => x.id === id);
      if(item){
        const lang = opts.lang || (id.startsWith('eg_') ? 'eg' : 'fr');
        const text = opts.text || (lang === 'eg' ? item.eg : item.fr);
        const done = await speakTTS(text, lang);
        return done ? 'tts' : 'none';
      }
    }

    if(opts.text){
      const done = await speakTTS(opts.text, opts.lang || 'fr');
      return done ? 'tts' : 'none';
    }
    return 'none';
  }

  /**
   * speakBoth(id) — speak French first, then Egyptian
   */
  async function speakBoth(id){
    const lang = getLang();
    const flat = window.VOICE_DICT ? getAllPhrases() : [];
    const item = flat.find(x => x.id === id);
    if(!item) return;
    if(lang === 'eg'){
      const okRec = await playRecorded('eg_' + item.id.replace(/^fr_/, ''));
      if(!okRec) await speakTTS(item.eg, 'eg');
      return;
    }
    if(lang === 'fr'){
      await play(item.id, { text: item.fr, lang: 'fr' });
      return;
    }
    await play(item.id, { text: item.fr, lang: 'fr' });
    await new Promise(r => setTimeout(r, 600));
    // Egyptian TTS
    const okRec = await playRecorded('eg_' + item.id.replace(/^fr_/, ''));
    if(!okRec){
      await speakTTS(item.eg, 'eg');
    }
  }

  function stop(){
    if(current){ try{ current.pause(); }catch(e){} current = null; }
    if('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Preload voices
  if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = () => {};
    setTimeout(() => speechSynthesis.getVoices(), 200);
  }

  return { play, speakBoth, stop, speakTTS };
})();
