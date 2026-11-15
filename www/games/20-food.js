window.Game_20 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    const PAIRS = 4;
    let round = 0;
    let stars = 0;
    let locked = false;
    let selectedAnimal = null;
    let matched = 0;
    let wrongThisPick = 0;
    let currentPicks = [];

    container.innerHTML = `
      <style>
        .g20-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g20-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(168,85,247,.35); position: relative; overflow: hidden; }
        .g20-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g20-title { font-size: 1.15rem; font-weight: 900; }
        .g20-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g20-stage { background: #fff; border: 3px solid #e9d5ff; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 440px; animation: g20-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g20-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g20-q { font-size: 1.05rem; font-weight: 900; color: #7e22ce; margin-bottom: 12px; }
        .g20-q small { display: block; font-size: 0.78rem; color: #c084fc; font-weight: 700; margin-top: 2px; }
        .g20-section-title { font-size: 0.85rem; font-weight: 800; color: #64748b; margin: 10px 0 6px; }
        .g20-animals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
        .g20-animal { background: #fff; border: 3px solid #e9d5ff; border-radius: 16px; padding: 12px 0; font-size: 2.4rem; cursor: pointer; box-shadow: 0 4px 0 #d8b4fe; transition: all 0.15s; }
        .g20-animal:active { transform: translateY(2px); box-shadow: 0 2px 0 #d8b4fe; }
        .g20-animal.selected { box-shadow: 0 0 0 5px #fbbf24, 0 4px 0 #d8b4fe; background: #fef3c7; transform: scale(1.06); }
        .g20-animal.matched { opacity: 0.4; pointer-events: none; background: linear-gradient(180deg,#22c55e,#16a34a); color: #fff; border-color: #15803d; box-shadow: 0 4px 0 #14532d; }
        .g20-foods { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .g20-food { background: #fff; border: 3px solid #e9d5ff; border-radius: 16px; padding: 12px 6px; cursor: pointer; box-shadow: 0 4px 0 #d8b4fe; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .g20-food:active { transform: translateY(2px); box-shadow: 0 2px 0 #d8b4fe; }
        .g20-food .f-emoji { font-size: 2rem; }
        .g20-food .f-label { font-size: 0.8rem; font-weight: 800; color: #7e22ce; text-align: center; }
        .g20-food.matched { opacity: 0.4; pointer-events: none; background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #22c55e; box-shadow: 0 4px 0 #16a34a; }
        .g20-food.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color: #ef4444; animation: g20-shk .4s; }
        @keyframes g20-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .g20-feedback { font-size: 1.05rem; font-weight: 900; min-height: 28px; margin-top: 12px; color: #9333ea; }
        .g20-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g20-pop .4s; padding: 20px; }
        .g20-win-emoji { font-size: 4.8rem; animation: g20-bounce 1s infinite; }
        @keyframes g20-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g20-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#a855f7,#7e22ce); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g20-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g20-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g20-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g20-win-btn:active { transform: scale(0.95); }
        .g20-win-replay { background: linear-gradient(180deg,#c084fc,#a855f7); color: #fff; box-shadow: 0 5px 0 #7e22ce; }
        .g20-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g20-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g20-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g20-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g20-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g20-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g20-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g20-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g20-fall 1.6s linear forwards; }
        @keyframes g20-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g20-wrap">
        <div class="g20-header">
          <div>
            <div class="g20-title">🍽️ Qui mange quoi? • مين بيأكل إيه؟</div>
          </div>
          <div class="g20-progress" id="g20-prog">⭐ 0</div>
        </div>
        <div class="g20-stage" id="g20-stage">
          <button class="g20-parent-btn" id="g20-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g20-q">🍽️ وصّلي كل حيوان بأكله<small>Relie chaque animal à sa nourriture</small></div>
          <div class="g20-section-title">🐾 الحيوانات</div>
          <div class="g20-animals" id="g20-animals"></div>
          <div class="g20-section-title">🍽️ الأكل</div>
          <div class="g20-foods" id="g20-foods"></div>
          <div class="g20-feedback" id="g20-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g20-stage');
    const animalsEl = document.getElementById('g20-animals');
    const foodsEl = document.getElementById('g20-foods');
    const msgEl = document.getElementById('g20-msg');
    const progEl = document.getElementById('g20-prog');

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

    async function speakPraise() {
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {}
    }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g20-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g20-confetti';
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
      locked = false;
      selectedAnimal = null;
      matched = 0;
      wrongThisPick = 0;
      updateProgress();
      msgEl.style.color = '#9333ea';
      msgEl.textContent = '👆 اختاري الحيوان من فوق الأول';

      const all = (window.SHARED?.animals || []).filter(a => window.ANIMALS_EXTRA?.[a.emoji]);
      const count = Math.min(PAIRS, all.length);
      currentPicks = shuffle(all).slice(0, count);

      animalsEl.innerHTML = '';
      currentPicks.forEach(a => {
        const b = document.createElement('button');
        b.className = 'g20-animal';
        b.textContent = a.emoji;
        b.dataset.emoji = a.emoji;
        b.addEventListener('click', () => onAnimalPick(a, b));
        animalsEl.appendChild(b);
      });

      foodsEl.innerHTML = '';
      shuffle(currentPicks).forEach(a => {
        const extra = window.ANIMALS_EXTRA[a.emoji];
        const b = document.createElement('button');
        b.className = 'g20-food';
        b.dataset.emoji = a.emoji;
        b.innerHTML = `<div class="f-emoji">${extra.food.split(' ')[0]}</div><div class="f-label">${extra.food.split(' ').slice(1).join(' ')}</div>`;
        b.addEventListener('click', () => onFoodPick(a, b));
        foodsEl.appendChild(b);
      });
    }

    async function onAnimalPick(animal, btn) {
      if (locked || btn.classList.contains('matched')) return;
      animalsEl.querySelectorAll('.g20-animal').forEach(b => b.classList.remove('selected'));
      foodsEl.querySelectorAll('.g20-food').forEach(fb => fb.style.boxShadow = '');
      btn.classList.add('selected');
      selectedAnimal = animal;
      wrongThisPick = 0;
      msgEl.style.color = '#9333ea';
      msgEl.textContent = `👇 إيه أكل "${animal.eg}"؟`;
      try {
        await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
        await sleep(300);
        await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
      } catch (e) {}
    }

    async function onFoodPick(animal, btn) {
      if (locked || btn.classList.contains('matched')) return;
      if (!selectedAnimal) {
        msgEl.style.color = '#d97706';
        msgEl.textContent = '☝️ دوسي على الحيوان من فوق الأول!';
        playErrorTone();
        return;
      }
      if (selectedAnimal.emoji === animal.emoji) {
        btn.classList.add('matched');
        btn.style.boxShadow = '';
        const ab = animalsEl.querySelector(`[data-emoji="${animal.emoji}"]`);
        if (ab) { ab.classList.remove('selected'); ab.classList.add('matched'); }
        matched++;
        selectedAnimal = null;
        wrongThisPick = 0;
        if (typeof starBurst === 'function') starBurst();
        playCorrectTone();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = '🎉 Bravo !';
        await speakPraise();
        if (matched === currentPicks.length) {
          locked = true;
          stars++;
          updateProgress();
          celebrate();
          await sleep(450);
          if (round >= TOTAL_ROUNDS) showWin();
          else newRound();
        }
      } else {
        wrongThisPick++;
        btn.classList.add('wrong');
        playErrorTone();
        try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
        setTimeout(() => btn.classList.remove('wrong'), 500);
        if (wrongThisPick >= 2) {
          const targetFood = foodsEl.querySelector(`[data-emoji="${selectedAnimal.emoji}"]:not(.matched)`);
          if (targetFood) targetFood.style.boxShadow = '0 0 0 5px #fbbf24, 0 4px 0 #d8b4fe';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g20-win';
      win.innerHTML = `
        <div class="g20-win-emoji">🏆</div>
        <div class="g20-win-title">أحسنتِ يا بطلة!</div>
        <div class="g20-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g20-win-btns">
          <button class="g20-win-btn g20-win-replay" id="g20-replay">🔄 العبي تاني</button>
          <button class="g20-win-btn g20-win-home" id="g20-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g20-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g20-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g20-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g20-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g20-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g20-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
