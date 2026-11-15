window.Game_21 = {
  async mount(container) {
    const MAX_COLORS = 10;
    const TOTAL_ROUNDS = 5;
    const UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g21_unlocked';

    let unlockedMax = Math.min(MAX_COLORS, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let explored = new Set();
    let mode = 'explore';
    let target = null;

    container.innerHTML = `
      <style>
        .g21-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g21-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(244,63,94,.35); position: relative; overflow: hidden; }
        .g21-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g21-title { font-size: 1.15rem; font-weight: 900; }
        .g21-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g21-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g21-tabs { display: flex; gap: 8px; justify-content: center; }
        .g21-tab { flex: 1; max-width: 220px; padding: 12px 8px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.9rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g21-tab.active { background: linear-gradient(180deg,#ec4899,#a855f7); color: #fff; box-shadow: 0 5px 0 #7e22ce; }
        .g21-stage { background: #fff; border: 3px solid #fbcfe8; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 420px; animation: g21-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g21-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g21-stage.g21-shake { animation: g21-shk .4s; }
        @keyframes g21-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g21-stage.g21-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g21-q { font-size: 1.05rem; font-weight: 900; color: #be185d; margin-bottom: 12px; }
        .g21-q small { display: block; font-size: 0.78rem; color: #f472b6; font-weight: 700; margin-top: 2px; }
        .g21-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g21-color-btn { position: relative; background: #fff; border: 4px solid #fbcfe8; border-radius: 20px; padding: 0; cursor: pointer; box-shadow: 0 6px 0 #f9a8d4; transition: all 0.15s; overflow: hidden; display: flex; flex-direction: column; align-items: center; }
        .g21-color-btn:active { transform: translateY(2px); box-shadow: 0 3px 0 #f9a8d4; }
        .g21-color-btn .swatch { width: 100%; height: 86px; border-bottom: 1px solid #e2e8f0; }
        .g21-color-btn .label { width: 100%; padding: 6px 4px 2px; font-size: 0.95rem; font-weight: 900; color: #334155; text-align: center; }
        .g21-color-btn .label-eg { font-size: 0.8rem; color: #be185d; font-weight: 800; padding-bottom: 6px; }
        .g21-color-btn .star-dot { position: absolute; top: 4px; right: 6px; font-size: 0.9rem; }
        .g21-target { font-size: 2.6rem; font-weight: 900; color: #be185d; margin-bottom: 6px; min-height: 54px; cursor: pointer; }
        .g21-target-eg { font-size: 1.2rem; font-weight: 700; color: #ec4899; margin-bottom: 14px; }
        .g21-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g21-choice { height: 94px; border-radius: 20px; border: 4px solid #cbd5e1; cursor: pointer; box-shadow: 0 6px 0 #94a3b8; transition: all 0.15s; }
        .g21-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #94a3b8; }
        .g21-choice.correct { border-color: #16a34a; box-shadow: 0 0 0 5px #22c55e, 0 6px 0 #15803d; animation: g21-correctPop .5s; }
        .g21-choice.wrong { border-color: #ef4444; box-shadow: 0 0 0 5px #f87171, 0 6px 0 #b91c1c; animation: g21-shk .4s; }
        @keyframes g21-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.12)} 100%{transform:scale(1)} }
        .g21-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #ec4899; }
        .g21-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g21-hint-box.visible { display: flex; }
        .g21-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g21-pop .4s; padding: 20px; }
        .g21-win-emoji { font-size: 4.8rem; animation: g21-bounce 1s infinite; }
        @keyframes g21-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g21-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#ec4899,#a855f7); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g21-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g21-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g21-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g21-win-btn:active { transform: scale(0.95); }
        .g21-win-replay { background: linear-gradient(180deg,#f472b6,#ec4899); color: #fff; box-shadow: 0 5px 0 #be185d; }
        .g21-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g21-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g21-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g21-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g21-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g21-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g21-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g21-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g21-fall 1.6s linear forwards; }
        @keyframes g21-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>

      <div class="g21-wrap">
        <div class="g21-header">
          <div>
            <div class="g21-title">🎨 Les Couleurs • الألوان</div>
            <div class="g21-unlock-pill" id="g21-unlock-pill">🔓 3 ألوان</div>
          </div>
          <div class="g21-progress" id="g21-prog">⭐ 0</div>
        </div>

        <div class="g21-tabs">
          <button class="g21-tab active" id="g21-tab-explore">🎨 اكتشفي</button>
          <button class="g21-tab" id="g21-tab-quiz">🔍 لاقي اللون</button>
        </div>

        <div class="g21-stage" id="g21-stage">
          <button class="g21-parent-btn" id="g21-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g21-q" id="g21-q"></div>
          <div id="g21-explore-wrap">
            <div class="g21-grid" id="g21-grid"></div>
          </div>
          <div id="g21-quiz-wrap" style="display:none">
            <div class="g21-target" id="g21-target"></div>
            <div class="g21-target-eg" id="g21-target-eg"></div>
            <div class="g21-choices" id="g21-choices"></div>
          </div>
          <div class="g21-hint-box" id="g21-hint"></div>
          <div class="g21-feedback" id="g21-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g21-stage');
    const qEl = document.getElementById('g21-q');
    const gridEl = document.getElementById('g21-grid');
    const exploreWrap = document.getElementById('g21-explore-wrap');
    const quizWrap = document.getElementById('g21-quiz-wrap');
    const targetEl = document.getElementById('g21-target');
    const targetEgEl = document.getElementById('g21-target-eg');
    const choicesEl = document.getElementById('g21-choices');
    const hintBox = document.getElementById('g21-hint');
    const msgEl = document.getElementById('g21-msg');
    const progEl = document.getElementById('g21-prog');
    const unlockPill = document.getElementById('g21-unlock-pill');
    const tabExplore = document.getElementById('g21-tab-explore');
    const tabQuiz = document.getElementById('g21-tab-quiz');

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
    function playUnlockTone() { playTone(523, .12, 'sine'); setTimeout(() => playTone(659, .12, 'sine'), 100); setTimeout(() => playTone(784, .12, 'sine'), 200); setTimeout(() => playTone(1047, .3, 'sine'), 300); }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function saveUnlocked() {
      try { localStorage.setItem(STORAGE_KEY, String(unlockedMax)); } catch (e) {}
    }

    function updateProgress() {
      progEl.textContent = mode === 'explore' ? `⭐ ${stars}` : `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`;
      unlockPill.textContent = `🔓 ${Math.min(unlockedMax, MAX_COLORS)} ألوان`;
    }

    async function speakColor(color, lang) {
      if (!color) return;
      try {
        if (lang === 'fr') await Audio2.play(color.frId, { text: color.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(null, { text: color.eg, lang: 'eg' });
        else {
          await Audio2.play(color.frId, { text: color.fr, lang: 'fr' });
          await sleep(350);
          await Audio2.play(null, { text: color.eg, lang: 'eg' });
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
      c.className = 'g21-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g21-confetti';
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

    function toast(msg) {
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;padding:14px 24px;border-radius:16px;font-weight:900;font-size:1.05rem;box-shadow:0 10px 30px rgba(34,197,94,0.4);z-index:10000;transition:transform .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.style.transform = 'translateX(-50%) translateY(0)');
      setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(-100px)'; setTimeout(() => t.remove(), 400); }, 2200);
    }

    function tryUnlock() {
      successCount++;
      if (successCount >= UNLOCK_EVERY && unlockedMax < MAX_COLORS) {
        successCount = 0;
        unlockedMax++;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        toast(`🎉 فتحنا لون جديد!`);
      }
    }

    function renderExplore() {
      const colors = (window.SHARED_COLORS || []).slice(0, unlockedMax);
      qEl.innerHTML = `🎨 اضغطي على لون واسمعيه<small>Clique sur une couleur</small>`;
      gridEl.innerHTML = '';
      colors.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g21-color-btn';
        btn.dataset.fr = c.fr;
        btn.innerHTML = `
          <div class="swatch" style="background:${c.hex}"></div>
          <div class="label">${c.fr}</div>
          <div class="label-eg">${c.eg}</div>
          ${explored.has(c.fr) ? '<span class="star-dot">⭐</span>' : ''}
        `;
        btn.addEventListener('click', () => onColorClick(c));
        gridEl.appendChild(btn);
      });
    }

    async function onColorClick(c) {
      await speakColor(c, 'both');
      if (!explored.has(c.fr)) {
        explored.add(c.fr);
        stars++;
        updateProgress();
        celebrate();
        if (explored.size >= unlockedMax && unlockedMax < MAX_COLORS) {
          unlockedMax++;
          saveUnlocked();
          updateProgress();
          playUnlockTone();
          toast('🎉 فتحنا لون جديد!');
        }
        renderExplore();
      }
    }

    targetEl.addEventListener('click', () => speakColor(target, 'both'));

    function startQuiz() {
      round = 0;
      stars = 0;
      successCount = 0;
      wrongThisRound = 0;
      newQuizRound();
    }

    function newQuizRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g21-hint', 'g21-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      const colors = (window.SHARED_COLORS || []).slice(0, unlockedMax);
      target = colors[Math.floor(Math.random() * colors.length)];

      qEl.innerHTML = `🔍 لاقي اللون ده<small>Trouve cette couleur</small>`;
      targetEl.textContent = target.fr;
      targetEgEl.textContent = target.eg;

      const opts = [target];
      while (opts.length < 3 && opts.length < colors.length) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        if (!opts.find(o => o.fr === c.fr)) opts.push(c);
      }

      choicesEl.innerHTML = '';
      shuffle(opts).forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g21-choice';
        btn.style.background = c.hex;
        btn.dataset.fr = c.fr;
        btn.addEventListener('click', () => onQuizChoice(c, btn));
        choicesEl.appendChild(btn);
      });

      setTimeout(() => speakColor(target, 'fr'), 300);
    }

    async function onQuizChoice(c, btn) {
      if (locked) return;
      if (c.fr === target.fr) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        await speakColor(target, 'both');
        await sleep(350);
        await speakPraise();
        await sleep(450);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else newQuizRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g21-shake');
        setTimeout(() => stageEl.classList.remove('g21-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g21-hint');
          hintBox.innerHTML = `💡 اللون: ${target.fr} (${target.eg})`;
          hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #94a3b8';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g21-win';
      win.innerHTML = `
        <div class="g21-win-emoji">🏆</div>
        <div class="g21-win-title">أحسنتِ يا بطلة!</div>
        <div class="g21-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g21-win-btns">
          <button class="g21-win-btn g21-win-replay" id="g21-replay">🔄 العبي تاني</button>
          <button class="g21-win-btn g21-win-home" id="g21-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g21-replay').addEventListener('click', () => { win.remove(); startQuiz(); });
      document.getElementById('g21-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    function switchMode(newMode) {
      if (mode === newMode) return;
      mode = newMode;
      stageEl.classList.remove('g21-hint', 'g21-shake');
      hintBox.classList.remove('visible');
      msgEl.textContent = '';
      tabExplore.classList.toggle('active', mode === 'explore');
      tabQuiz.classList.toggle('active', mode === 'quiz');
      if (mode === 'explore') {
        exploreWrap.style.display = 'block';
        quizWrap.style.display = 'none';
        updateProgress();
        renderExplore();
      } else {
        exploreWrap.style.display = 'none';
        quizWrap.style.display = 'block';
        startQuiz();
      }
    }

    tabExplore.addEventListener('click', () => switchMode('explore'));
    tabQuiz.addEventListener('click', () => switchMode('quiz'));

    document.getElementById('g21-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g21-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>الألوان المتاحة</span><strong>${unlockedMax} / ${MAX_COLORS}</strong></div>
        <div class="row"><span>الألوان المكتشفة</span><strong>${explored.size} / ${MAX_COLORS}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'explore' ? 'اكتشفي' : 'لاقي اللون'}</strong></div>
        <button id="g21-parent-unlock-all">🔓 فتح كل الألوان</button>
        <button id="g21-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g21-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_COLORS;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        confetti();
        toast('🎉 كل الألوان اتفتحت!');
        if (mode === 'explore') renderExplore();
        panel.remove();
      });
      document.getElementById('g21-parent-close').addEventListener('click', () => panel.remove());
    });

    updateProgress();
    renderExplore();
  }
};
