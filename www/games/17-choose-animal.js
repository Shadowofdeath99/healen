window.Game_17 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let target = null;

    container.innerHTML = `
      <style>
        .g17-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g17-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(249,115,22,.35); position: relative; overflow: hidden; }
        .g17-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g17-title { font-size: 1.15rem; font-weight: 900; }
        .g17-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g17-stage { background: #fff; border: 3px solid #fed7aa; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 400px; animation: g17-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g17-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g17-stage.g17-shake { animation: g17-shk .4s; }
        @keyframes g17-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g17-stage.g17-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g17-q { font-size: 1.05rem; font-weight: 900; color: #c2410c; margin-bottom: 12px; }
        .g17-q small { display: block; font-size: 0.78rem; color: #fb923c; font-weight: 700; margin-top: 2px; }
        .g17-speaker-card { background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 22px; padding: 16px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 14px; box-shadow: 0 10px 24px rgba(249,115,22,.3); }
        .g17-speaker { width: 90px; height: 90px; border-radius: 50%; background: #fff; color: #c2410c; border: none; font-size: 2.6rem; cursor: pointer; box-shadow: 0 6px 0 #fed7aa; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
        .g17-speaker:active { transform: scale(0.92); }
        .g17-speaker.playing { animation: g17Pulse 0.6s infinite alternate; }
        @keyframes g17Pulse { from { transform: scale(1); } to { transform: scale(1.12); box-shadow: 0 0 0 14px rgba(255,255,255,0.25); } }
        .g17-sub-btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .g17-mini-btn { background: rgba(255,255,255,0.22); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 999px; padding: 7px 14px; font-size: 0.9rem; font-weight: 800; cursor: pointer; }
        .g17-mini-btn:active { transform: scale(0.95); }
        .g17-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g17-choice { background: #fff; border: 4px solid #fed7aa; border-radius: 20px; padding: 22px 0; font-size: 3.5rem; cursor: pointer; box-shadow: 0 6px 0 #fdba74; transition: all 0.15s; }
        .g17-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #fdba74; }
        .g17-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g17-correctPop .5s; }
        .g17-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g17-shk .4s; }
        @keyframes g17-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .g17-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g17-hint-box.visible { display: flex; }
        .g17-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #c2410c; }
        .g17-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g17-pop .4s; padding: 20px; }
        .g17-win-emoji { font-size: 4.8rem; animation: g17-bounce 1s infinite; }
        @keyframes g17-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g17-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#f97316,#c2410c); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g17-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g17-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g17-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g17-win-btn:active { transform: scale(0.95); }
        .g17-win-replay { background: linear-gradient(180deg,#fb923c,#f97316); color: #fff; box-shadow: 0 5px 0 #c2410c; }
        .g17-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g17-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g17-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g17-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g17-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g17-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g17-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g17-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g17-fall 1.6s linear forwards; }
        @keyframes g17-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g17-wrap">
        <div class="g17-header">
          <div>
            <div class="g17-title">🦁 Écoute et Choisis • اسمع واختار حيوان</div>
          </div>
          <div class="g17-progress" id="g17-prog">⭐ 0</div>
        </div>
        <div class="g17-stage" id="g17-stage">
          <button class="g17-parent-btn" id="g17-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g17-q">🦁 اسمعي اسم الحيوان واختاريه<small>Écoute et choisis l'animal</small></div>
          <div class="g17-speaker-card">
            <button class="g17-speaker" id="g17-speaker">🔊</button>
            <div class="g17-sub-btns">
              <button class="g17-mini-btn" id="g17-play-fr">🇫🇷 فرنساوي</button>
              <button class="g17-mini-btn" id="g17-play-eg">🇪🇬 مصري</button>
            </div>
          </div>
          <div class="g17-choices" id="g17-choices"></div>
          <div class="g17-hint-box" id="g17-hint"></div>
          <div class="g17-feedback" id="g17-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g17-stage');
    const speakerBtn = document.getElementById('g17-speaker');
    const choicesEl = document.getElementById('g17-choices');
    const hintBox = document.getElementById('g17-hint');
    const msgEl = document.getElementById('g17-msg');
    const progEl = document.getElementById('g17-prog');

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
        if (lang === 'fr') await Audio2.play(target.frId, { text: target.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(target.egId, { text: target.eg, lang: 'eg' });
        else {
          await Audio2.play(target.frId, { text: target.fr, lang: 'fr' });
          await sleep(400);
          await Audio2.play(target.egId, { text: target.eg, lang: 'eg' });
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
      c.className = 'g17-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g17-confetti';
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
      stageEl.classList.remove('g17-hint', 'g17-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      const animals = (window.SHARED?.animals || []);
      if (!animals.length) { msgEl.textContent = 'لا توجد حيوانات'; return; }
      target = animals[Math.floor(Math.random() * animals.length)];

      const opts = [target];
      while (opts.length < 3) {
        const a = animals[Math.floor(Math.random() * animals.length)];
        if (!opts.find(o => o.emoji === a.emoji)) opts.push(a);
      }

      choicesEl.innerHTML = '';
      shuffle(opts).forEach(a => {
        const b = document.createElement('button');
        b.className = 'g17-choice';
        b.textContent = a.emoji;
        b.dataset.emoji = a.emoji;
        b.addEventListener('click', () => onChoice(a, b));
        choicesEl.appendChild(b);
      });

      setTimeout(() => speakTarget('both'), 300);
    }

    async function onChoice(a, btn) {
      if (locked) return;
      if (a.emoji === target.emoji) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        await speakPraise();
        await sleep(600);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g17-shake');
        setTimeout(() => stageEl.classList.remove('g17-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g17-hint');
          hintBox.innerHTML = `💡 الحيوان: ${target.fr} (${target.eg})`;
          hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-emoji="${target.emoji}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fdba74';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g17-win';
      win.innerHTML = `
        <div class="g17-win-emoji">🏆</div>
        <div class="g17-win-title">أحسنتِ يا بطلة!</div>
        <div class="g17-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g17-win-btns">
          <button class="g17-win-btn g17-win-replay" id="g17-replay">🔄 العبي تاني</button>
          <button class="g17-win-btn g17-win-home" id="g17-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g17-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g17-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    speakerBtn.addEventListener('click', () => speakTarget('both'));
    document.getElementById('g17-play-fr').addEventListener('click', () => speakTarget('fr'));
    document.getElementById('g17-play-eg').addEventListener('click', () => speakTarget('eg'));

    document.getElementById('g17-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g17-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g17-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g17-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
