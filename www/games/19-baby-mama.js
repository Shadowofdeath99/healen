window.Game_19 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    const PAIRS = 4;
    let round = 0;
    let stars = 0;
    let locked = false;
    let selectedMama = null;
    let matched = 0;
    let wrongThisPick = 0;
    let currentPicks = [];

    container.innerHTML = `
      <style>
        .g19-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g19-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(236,72,153,.35); position: relative; overflow: hidden; }
        .g19-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g19-title { font-size: 1.15rem; font-weight: 900; }
        .g19-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g19-stage { background: #fff; border: 3px solid #fbcfe8; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 440px; animation: g19-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g19-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g19-q { font-size: 1.05rem; font-weight: 900; color: #be185d; margin-bottom: 12px; }
        .g19-q small { display: block; font-size: 0.78rem; color: #f472b6; font-weight: 700; margin-top: 2px; }
        .g19-section-title { font-size: 0.85rem; font-weight: 800; color: #64748b; margin: 10px 0 6px; }
        .g19-mamas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
        .g19-mama { background: #fff; border: 3px solid #fbcfe8; border-radius: 16px; padding: 12px 0; font-size: 2.4rem; cursor: pointer; box-shadow: 0 4px 0 #f9a8d4; transition: all 0.15s; }
        .g19-mama:active { transform: translateY(2px); box-shadow: 0 2px 0 #f9a8d4; }
        .g19-mama.selected { box-shadow: 0 0 0 5px #fbbf24, 0 4px 0 #f9a8d4; background: #fef3c7; transform: scale(1.06); }
        .g19-mama.matched { opacity: 0.4; pointer-events: none; background: linear-gradient(180deg,#22c55e,#16a34a); color: #fff; border-color: #15803d; box-shadow: 0 4px 0 #14532d; }
        .g19-babies { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .g19-baby { background: #fff; border: 3px solid #fbcfe8; border-radius: 16px; padding: 10px 6px; cursor: pointer; box-shadow: 0 4px 0 #f9a8d4; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .g19-baby:active { transform: translateY(2px); box-shadow: 0 2px 0 #f9a8d4; }
        .g19-baby .b-emoji { font-size: 2rem; }
        .g19-baby .b-label { font-size: 0.78rem; font-weight: 800; color: #be185d; text-align: center; }
        .g19-baby.matched { opacity: 0.4; pointer-events: none; background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #22c55e; box-shadow: 0 4px 0 #16a34a; }
        .g19-baby.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color: #ef4444; animation: g19-shk .4s; }
        @keyframes g19-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .g19-feedback { font-size: 1.05rem; font-weight: 900; min-height: 28px; margin-top: 12px; color: #db2777; }
        .g19-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g19-pop .4s; padding: 20px; }
        .g19-win-emoji { font-size: 4.8rem; animation: g19-bounce 1s infinite; }
        @keyframes g19-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g19-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#ec4899,#be185d); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g19-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g19-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g19-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g19-win-btn:active { transform: scale(0.95); }
        .g19-win-replay { background: linear-gradient(180deg,#f472b6,#ec4899); color: #fff; box-shadow: 0 5px 0 #be185d; }
        .g19-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g19-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g19-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g19-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g19-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g19-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g19-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g19-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g19-fall 1.6s linear forwards; }
        @keyframes g19-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g19-wrap">
        <div class="g19-header">
          <div>
            <div class="g19-title">👶 Bébé et Maman • بيبي وأمه</div>
          </div>
          <div class="g19-progress" id="g19-prog">⭐ 0</div>
        </div>
        <div class="g19-stage" id="g19-stage">
          <button class="g19-parent-btn" id="g19-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g19-q">👶 وصّلي كل بيبي بأمه<small>Relie chaque bébé à sa maman</small></div>
          <div class="g19-section-title">👩 الأمهات</div>
          <div class="g19-mamas" id="g19-mamas"></div>
          <div class="g19-section-title">👶 البيبيات</div>
          <div class="g19-babies" id="g19-babies"></div>
          <div class="g19-feedback" id="g19-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g19-stage');
    const mamasEl = document.getElementById('g19-mamas');
    const babiesEl = document.getElementById('g19-babies');
    const msgEl = document.getElementById('g19-msg');
    const progEl = document.getElementById('g19-prog');

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
      c.className = 'g19-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g19-confetti';
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
      selectedMama = null;
      matched = 0;
      wrongThisPick = 0;
      updateProgress();
      msgEl.style.color = '#db2777';
      msgEl.textContent = '👆 اختاري الأم من فوق الأول';

      const all = (window.SHARED?.animals || []).filter(a => window.ANIMALS_EXTRA?.[a.emoji]);
      const count = Math.min(PAIRS, all.length);
      currentPicks = shuffle(all).slice(0, count);

      mamasEl.innerHTML = '';
      currentPicks.forEach(a => {
        const b = document.createElement('button');
        b.className = 'g19-mama';
        b.textContent = a.emoji;
        b.dataset.emoji = a.emoji;
        b.addEventListener('click', () => onMamaPick(a, b));
        mamasEl.appendChild(b);
      });

      babiesEl.innerHTML = '';
      shuffle(currentPicks).forEach(a => {
        const extra = window.ANIMALS_EXTRA[a.emoji];
        const b = document.createElement('button');
        b.className = 'g19-baby';
        b.dataset.emoji = a.emoji;
        b.innerHTML = `<div class="b-emoji">${extra.baby.split(' ')[0]}</div><div class="b-label">${extra.baby.split(' ').slice(1).join(' ')}</div>`;
        b.addEventListener('click', () => onBabyPick(a, b));
        babiesEl.appendChild(b);
      });
    }

    async function onMamaPick(animal, btn) {
      if (locked || btn.classList.contains('matched')) return;
      mamasEl.querySelectorAll('.g19-mama').forEach(b => b.classList.remove('selected'));
      babiesEl.querySelectorAll('.g19-baby').forEach(bb => bb.style.boxShadow = '');
      btn.classList.add('selected');
      selectedMama = animal;
      wrongThisPick = 0;
      msgEl.style.color = '#db2777';
      msgEl.textContent = `👇 فين بيبي "${animal.eg}"؟`;
      try {
        await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
        await sleep(300);
        await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
      } catch (e) {}
    }

    async function onBabyPick(animal, btn) {
      if (locked || btn.classList.contains('matched')) return;
      if (!selectedMama) {
        msgEl.style.color = '#d97706';
        msgEl.textContent = '☝️ دوسي على الأم من فوق الأول!';
        playErrorTone();
        return;
      }
      if (selectedMama.emoji === animal.emoji) {
        btn.classList.add('matched');
        btn.style.boxShadow = '';
        const mb = mamasEl.querySelector(`[data-emoji="${animal.emoji}"]`);
        if (mb) { mb.classList.remove('selected'); mb.classList.add('matched'); }
        matched++;
        selectedMama = null;
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
          const targetBaby = babiesEl.querySelector(`[data-emoji="${selectedMama.emoji}"]:not(.matched)`);
          if (targetBaby) targetBaby.style.boxShadow = '0 0 0 5px #fbbf24, 0 4px 0 #f9a8d4';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g19-win';
      win.innerHTML = `
        <div class="g19-win-emoji">🏆</div>
        <div class="g19-win-title">أحسنتِ يا بطلة!</div>
        <div class="g19-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g19-win-btns">
          <button class="g19-win-btn g19-win-replay" id="g19-replay">🔄 العبي تاني</button>
          <button class="g19-win-btn g19-win-home" id="g19-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g19-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g19-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g19-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g19-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g19-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g19-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
