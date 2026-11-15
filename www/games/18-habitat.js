window.Game_18 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let currentAnimal = null;
    let correctHabitat = null;

    container.innerHTML = `
      <style>
        .g18-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g18-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(16,185,129,.35); position: relative; overflow: hidden; }
        .g18-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g18-title { font-size: 1.15rem; font-weight: 900; }
        .g18-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g18-stage { background: #fff; border: 3px solid #a7f3d0; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 400px; animation: g18-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g18-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g18-stage.g18-shake { animation: g18-shk .4s; }
        @keyframes g18-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g18-stage.g18-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g18-q { font-size: 1.05rem; font-weight: 900; color: #047857; margin-bottom: 12px; }
        .g18-q small { display: block; font-size: 0.78rem; color: #34d399; font-weight: 700; margin-top: 2px; }
        .g18-animal-card { background: linear-gradient(180deg,#f0fdf4,#dcfce7); border-radius: 22px; padding: 16px; margin-bottom: 14px; border: 3px solid #86efac; cursor: pointer; }
        .g18-emoji { font-size: 5rem; animation: g18-bounce .5s; }
        @keyframes g18-bounce { 0%{transform:scale(0) rotate(-30deg)} 100%{transform:scale(1) rotate(0)} }
        .g18-word-fr { font-size: 1.4rem; font-weight: 900; color: #047857; }
        .g18-word-eg { font-size: 1.1rem; font-weight: 700; color: #10b981; }
        .g18-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .g18-choice { background: #fff; border: 4px solid #a7f3d0; border-radius: 18px; padding: 16px 8px; cursor: pointer; box-shadow: 0 5px 0 #6ee7b7; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .g18-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #6ee7b7; }
        .g18-choice .emoji { font-size: 2.4rem; }
        .g18-choice .label-fr { font-size: 0.9rem; font-weight: 800; color: #047857; }
        .g18-choice .label-eg { font-size: 0.85rem; font-weight: 700; color: #10b981; }
        .g18-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); border-color:#16a34a; box-shadow: 0 5px 0 #15803d; animation: g18-correctPop .5s; }
        .g18-choice.correct .label-fr, .g18-choice.correct .label-eg { color: #fff; }
        .g18-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); border-color:#ef4444; box-shadow: 0 5px 0 #b91c1c; animation: g18-shk .4s; }
        @keyframes g18-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.12)} 100%{transform:scale(1)} }
        .g18-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g18-hint-box.visible { display: flex; }
        .g18-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #059669; }
        .g18-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g18-pop .4s; padding: 20px; }
        .g18-win-emoji { font-size: 4.8rem; animation: g18-winBounce 1s infinite; }
        @keyframes g18-winBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g18-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#10b981,#047857); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g18-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g18-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g18-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g18-win-btn:active { transform: scale(0.95); }
        .g18-win-replay { background: linear-gradient(180deg,#34d399,#10b981); color: #fff; box-shadow: 0 5px 0 #047857; }
        .g18-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g18-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g18-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g18-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g18-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g18-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g18-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g18-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g18-fall 1.6s linear forwards; }
        @keyframes g18-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g18-wrap">
        <div class="g18-header">
          <div>
            <div class="g18-title">🏞️ Habitat • فين بيعيش؟</div>
          </div>
          <div class="g18-progress" id="g18-prog">⭐ 0</div>
        </div>
        <div class="g18-stage" id="g18-stage">
          <button class="g18-parent-btn" id="g18-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g18-q">🏞️ فين الحيوان ده بيعيش؟<small>Où vit cet animal ?</small></div>
          <div class="g18-animal-card" id="g18-card">
            <div class="g18-emoji" id="g18-emoji"></div>
            <div class="g18-word-fr" id="g18-word-fr"></div>
            <div class="g18-word-eg" id="g18-word-eg"></div>
          </div>
          <div class="g18-choices" id="g18-choices"></div>
          <div class="g18-hint-box" id="g18-hint"></div>
          <div class="g18-feedback" id="g18-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g18-stage');
    const cardEl = document.getElementById('g18-card');
    const emojiEl = document.getElementById('g18-emoji');
    const wordFrEl = document.getElementById('g18-word-fr');
    const wordEgEl = document.getElementById('g18-word-eg');
    const choicesEl = document.getElementById('g18-choices');
    const hintBox = document.getElementById('g18-hint');
    const msgEl = document.getElementById('g18-msg');
    const progEl = document.getElementById('g18-prog');

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

    async function speakAnimal(animal, lang) {
      if (!animal) return;
      try {
        if (lang === 'fr') await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
        else {
          await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
          await sleep(400);
          await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
        }
      } catch (e) {}
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
      c.className = 'g18-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g18-confetti';
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

    cardEl.addEventListener('click', () => speakAnimal(currentAnimal, 'both'));

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g18-hint', 'g18-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      const all = (window.SHARED?.animals || []).filter(a => window.ANIMALS_EXTRA?.[a.emoji]);
      if (!all.length) { msgEl.textContent = 'البيانات غير متاحة'; return; }
      currentAnimal = all[Math.floor(Math.random() * all.length)];
      const extra = window.ANIMALS_EXTRA[currentAnimal.emoji];
      correctHabitat = extra.habitat;

      emojiEl.textContent = currentAnimal.emoji;
      wordFrEl.textContent = currentAnimal.fr;
      wordEgEl.textContent = currentAnimal.eg;

      const allHabitats = Object.keys(window.HABITAT_LABELS || {});
      const opts = [correctHabitat];
      while (opts.length < 3 && opts.length < allHabitats.length) {
        const h = allHabitats[Math.floor(Math.random() * allHabitats.length)];
        if (!opts.includes(h)) opts.push(h);
      }

      choicesEl.innerHTML = '';
      shuffle(opts).forEach(h => {
        const btn = document.createElement('button');
        btn.className = 'g18-choice';
        btn.dataset.habitat = h;
        const lab = window.HABITAT_LABELS[h];
        btn.innerHTML = `<div class="emoji">${lab.emoji}</div><div class="label-fr">${lab.fr}</div><div class="label-eg">${lab.eg}</div>`;
        btn.addEventListener('click', () => onChoice(h, btn));
        choicesEl.appendChild(btn);
      });

      setTimeout(() => speakAnimal(currentAnimal, 'both'), 300);
    }

    async function onChoice(habitat, btn) {
      if (locked) return;
      if (habitat === correctHabitat) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        const lab = window.HABITAT_LABELS[correctHabitat];
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${currentAnimal.fr} يعيش في ${lab.eg} (${lab.fr})`;
        try { await Audio2.play('fr_hab_' + correctHabitat, { text: lab.fr, lang: 'fr' }); } catch (e) {}
        await sleep(300);
        await speakPraise();
        await sleep(500);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g18-shake');
        setTimeout(() => stageEl.classList.remove('g18-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g18-hint');
          const lab = window.HABITAT_LABELS[correctHabitat];
          hintBox.innerHTML = `💡 ${currentAnimal.eg} يعيش في ${lab.emoji} ${lab.eg}`;
          hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-habitat="${correctHabitat}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #6ee7b7';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g18-win';
      win.innerHTML = `
        <div class="g18-win-emoji">🏆</div>
        <div class="g18-win-title">أحسنتِ يا بطلة!</div>
        <div class="g18-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g18-win-btns">
          <button class="g18-win-btn g18-win-replay" id="g18-replay">🔄 العبي تاني</button>
          <button class="g18-win-btn g18-win-home" id="g18-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g18-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g18-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g18-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g18-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g18-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g18-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
