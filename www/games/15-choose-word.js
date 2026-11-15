window.Game_15 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let target = null;

    container.innerHTML = `
      <style>
        .g15-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g15-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(99,102,241,.35); position: relative; overflow: hidden; }
        .g15-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g15-title { font-size: 1.15rem; font-weight: 900; }
        .g15-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g15-stage { background: #fff; border: 3px solid #c7d2fe; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 400px; animation: g15-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g15-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g15-stage.g15-shake { animation: g15-shk .4s; }
        @keyframes g15-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g15-stage.g15-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g15-q { font-size: 1.05rem; font-weight: 900; color: #4338ca; margin-bottom: 12px; }
        .g15-q small { display: block; font-size: 0.78rem; color: #818cf8; font-weight: 700; margin-top: 2px; }
        .g15-speaker-card { background: linear-gradient(135deg, #6366f1, #4f46e5); border-radius: 22px; padding: 16px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 14px; box-shadow: 0 10px 24px rgba(99,102,241,.3); }
        .g15-speaker { width: 90px; height: 90px; border-radius: 50%; background: #fff; color: #4338ca; border: none; font-size: 2.6rem; cursor: pointer; box-shadow: 0 6px 0 #c7d2fe; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
        .g15-speaker:active { transform: scale(0.92); }
        .g15-speaker.playing { animation: g15Pulse 0.6s infinite alternate; }
        @keyframes g15Pulse { from { transform: scale(1); } to { transform: scale(1.12); box-shadow: 0 0 0 14px rgba(255,255,255,0.25); } }
        .g15-sub-btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .g15-mini-btn { background: rgba(255,255,255,0.22); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 999px; padding: 7px 14px; font-size: 0.9rem; font-weight: 800; cursor: pointer; }
        .g15-mini-btn:active { transform: scale(0.95); }
        .g15-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g15-choice { background: #fff; border: 4px solid #c7d2fe; border-radius: 20px; padding: 20px 0; font-size: 3rem; cursor: pointer; box-shadow: 0 6px 0 #a5b4fc; transition: all 0.15s; }
        .g15-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #a5b4fc; }
        .g15-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g15-correctPop .5s; }
        .g15-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g15-shk .4s; }
        @keyframes g15-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .g15-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g15-hint-box.visible { display: flex; }
        .g15-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #4338ca; }
        .g15-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g15-pop .4s; padding: 20px; }
        .g15-win-emoji { font-size: 4.8rem; animation: g15-bounce 1s infinite; }
        @keyframes g15-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g15-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#6366f1,#4338ca); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g15-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g15-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g15-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g15-win-btn:active { transform: scale(0.95); }
        .g15-win-replay { background: linear-gradient(180deg,#818cf8,#6366f1); color: #fff; box-shadow: 0 5px 0 #4338ca; }
        .g15-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g15-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g15-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g15-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g15-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g15-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g15-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g15-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g15-fall 1.6s linear forwards; }
        @keyframes g15-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g15-wrap">
        <div class="g15-header">
          <div>
            <div class="g15-title">👂 Écoute et Choisis • اسمع واختار</div>
          </div>
          <div class="g15-progress" id="g15-prog">⭐ 0</div>
        </div>
        <div class="g15-stage" id="g15-stage">
          <button class="g15-parent-btn" id="g15-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g15-q">👂 اسمعي الكلمة واختاري صورتها<small>Écoute et choisis l'image</small></div>
          <div class="g15-speaker-card">
            <button class="g15-speaker" id="g15-speaker">🔊</button>
            <div class="g15-sub-btns">
              <button class="g15-mini-btn" id="g15-play-fr">🇫🇷 فرنساوي</button>
              <button class="g15-mini-btn" id="g15-play-eg">🇪🇬 مصري</button>
            </div>
          </div>
          <div class="g15-choices" id="g15-choices"></div>
          <div class="g15-hint-box" id="g15-hint"></div>
          <div class="g15-feedback" id="g15-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g15-stage');
    const speakerBtn = document.getElementById('g15-speaker');
    const choicesEl = document.getElementById('g15-choices');
    const hintBox = document.getElementById('g15-hint');
    const msgEl = document.getElementById('g15-msg');
    const progEl = document.getElementById('g15-prog');

    let sharedAC = null;
    function getAC() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!sharedAC) sharedAC = new AC();
      if (sharedAC.state === 'suspended') sharedAC.resume().catch(() => {});
      return sharedAC;
    }

    function playTone(freq, dur, type) {
      try {
        const ctx = getAC();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (dur || 0.2));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (dur || 0.2));
      } catch (e) {}
    }
    function playCorrectTone() { playTone(523, .15, 'sine'); setTimeout(() => playTone(659, .15, 'sine'), 120); setTimeout(() => playTone(784, .25, 'sine'), 240); }
    function playErrorTone() { playTone(196, .25, 'square'); }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function updateProgress() { progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`; }

    async function speakTarget(lang) {
      if (!target) return;
      speakerBtn.classList.add('playing');
      try {
        if (lang === 'fr') await Audio2.play('fr_' + (target.fr || '').toLowerCase(), { text: target.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play('eg_' + (target.fr || '').toLowerCase(), { text: target.eg || target.fr, lang: 'eg' });
        else {
          await Audio2.play('fr_' + (target.fr || '').toLowerCase(), { text: target.fr, lang: 'fr' });
          await sleep(400);
          await Audio2.play('eg_' + (target.fr || '').toLowerCase(), { text: target.eg || target.fr, lang: 'eg' });
        }
      } catch (e) {}
      speakerBtn.classList.remove('playing');
    }

    async function speakPraise() {
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {}
    }
    async function speakEncourage() {
      try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
    }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g15-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g15-confetti';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); playCorrectTone(); }

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g15-hint', 'g15-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      const words = (window.SHARED_WORDS || []).filter(w => w && w.emoji && w.fr);
      if (!words.length) { msgEl.textContent = 'لا توجد كلمات'; return; }
      target = words[Math.floor(Math.random() * words.length)];

      const opts = [target];
      while (opts.length < 3) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (!opts.find(o => o.fr === w.fr)) opts.push(w);
      }

      choicesEl.innerHTML = '';
      shuffle(opts).forEach(w => {
        const b = document.createElement('button');
        b.className = 'g15-choice';
        b.textContent = w.emoji;
        b.dataset.fr = w.fr;
        b.addEventListener('click', () => onChoice(w, b));
        choicesEl.appendChild(b);
      });

      setTimeout(() => speakTarget('both'), 300);
    }

    async function onChoice(w, btn) {
      if (locked) return;
      if (w.fr === target.fr) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${target.fr}`;
        await speakPraise();
        await sleep(600);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g15-shake');
        setTimeout(() => stageEl.classList.remove('g15-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g15-hint');
          hintBox.innerHTML = `💡 الكلمة: ${target.fr} ${target.emoji}`;
          hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #a5b4fc';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g15-win';
      win.innerHTML = `
        <div class="g15-win-emoji">🏆</div>
        <div class="g15-win-title">أحسنتِ يا بطلة!</div>
        <div class="g15-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g15-win-btns">
          <button class="g15-win-btn g15-win-replay" id="g15-replay">🔄 العبي تاني</button>
          <button class="g15-win-btn g15-win-home" id="g15-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g15-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g15-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    speakerBtn.addEventListener('click', () => speakTarget('both'));
    document.getElementById('g15-play-fr').addEventListener('click', () => speakTarget('fr'));
    document.getElementById('g15-play-eg').addEventListener('click', () => speakTarget('eg'));

    document.getElementById('g15-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g15-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g15-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g15-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
