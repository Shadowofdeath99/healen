/* Helen – تعليمات صوتية بالمصري: تسجيل الوالدة أولاً، وإلا TTS */
(function () {
  'use strict';

  const INTRO_ID = 'eg_intro_full';
  const INTRO_TEXT = `أهلاً بيكي يا حبيبتي في لعبة هيلين!
أنا هحكيلك بسرعة إزاي نلعب.
اللعبة دي فيها ألعاب كتير حلوة: أرقام وحروف وألوان وحيوانات وحاجات كتير.
كل لعبة هتقولك تعملي إيه، اسمعيها كويس.
ولو غلطتي متزعليش خالص، جربي تاني.
إحنا بنتعلم مع بعض.
يلا بينا نبدأ!`;

  let played = false, playing = false, attached = false;

  async function speakInstructions() {
    if (window.Audio2 && typeof window.Audio2.play === 'function') {
      try {
        return await window.Audio2.play(INTRO_ID, { text: INTRO_TEXT, lang: 'eg' });
      } catch (e) { console.warn('[intro] Audio2 failed:', e); }
    }
    return await rawSpeak(INTRO_TEXT);
  }

  function rawSpeak(text) {
    return new Promise((res) => {
      if (!('speechSynthesis' in window)) return res('none');
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-EG'; u.rate = 0.9; u.pitch = 1.15; u.volume = 1;
      const vs = synth.getVoices();
      const v = vs.find(x => /ar[-_]EG/i.test(x.lang)) || vs.find(x => /ar/i.test(x.lang));
      if (v) u.voice = v;
      let done = false;
      const finish = (ok) => { if (done) return; done = true; res(ok ? 'tts' : 'none'); };
      u.onend = () => finish(true);
      u.onerror = () => finish(false);
      setTimeout(() => finish(false), Math.max(9000, text.length * 110));
      synth.speak(u);
    });
  }

  function goToParentDashboard() {
    const parentBtn = document.getElementById('btn-parent');
    if (parentBtn) parentBtn.click();
  }

  function attach() {
    if (attached) return;
    const btn = document.getElementById('btn-start');
    if (!btn) return setTimeout(attach, 120);
    attached = true;

    document.addEventListener('click', async function (e) {
      const t = e.target.closest && e.target.closest('#btn-start');
      if (!t) return;
      if (played) return;
      if (playing) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      e.preventDefault(); e.stopImmediatePropagation();

      playing = true;
      const html = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '🎧 اسمعي التعليمات...';

      let result = 'none';
      try { result = await speakInstructions(); } catch (err) { console.warn('[intro] error:', err); }
      playing = false; played = true;

      if (result === 'none') {
        const goRec = confirm(
          'مفيش تسجيل للتعليمات ولا صوت متصفح متاح.\n\n' +
          'روحي للوحة الوالدين → استوديو التسجيل → تبويب "📢 التعليمات" → سجّليها بصوتك.\n\n' +
          'عايزة تفتحي لوحة الوالدين دلوقتي؟'
        );
        btn.disabled = false;
        btn.innerHTML = html || 'يلا نلعب ▶️';
        if (goRec) { goToParentDashboard(); return; }
      }

      btn.disabled = false;
      btn.innerHTML = html || 'يلا نلعب ▶️';
      setTimeout(() => btn.click(), 350);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
