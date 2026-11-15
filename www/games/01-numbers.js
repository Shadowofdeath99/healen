window.Game_01 = {
  async mount(container) {
    const THEMES = [
      { icon: '🍎', name: 'تفاح', frName: 'pommes' },
      { icon: '⭐', name: 'نجوم', frName: 'étoiles' },
      { icon: '🐱', name: 'قطط', frName: 'chats' },
      { icon: '🎈', name: 'بالونات', frName: 'ballons' },
      { icon: '🍓', name: 'فراولة', frName: 'fraises' },
      { icon: '🦋', name: 'فراشات', frName: 'papillons' }
    ];

    const MAX_NUM = 10;
    const TOTAL_ROUNDS = 5;
    const STORAGE_KEY = 'helen_g01_unlocked';

    let mode = 'learn'; // learn | match | order
    let currentThemeIdx = 0;
    let selectedNum = 1;
    let unlockedMax = Math.min(MAX_NUM, Math.max(1, parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10)));
    let discovered = new Set();

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;

    let targetNum = 0;
    let orderSequence = [];
    let orderProgress = 0;
    let isCounting = false;

    container.innerHTML = `
      <style>
        .g01-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g01-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #ff8ab5 0%, #ff6b9d 45%, #c084fc 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(255, 107, 157, 0.35); position: relative; overflow: hidden; }
        .g01-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g01-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.4px; }
        .g01-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g01-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; backdrop-filter: blur(4px); }

        .g01-tabs { display: flex; gap: 8px; justify-content: center; }
        .g01-tab { flex: 1; max-width: 220px; padding: 12px 8px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.95rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g01-tab.active { background: linear-gradient(180deg,#a855f7,#7c3aed); color: #fff; box-shadow: 0 5px 0 #5b21b6; }

        .g01-stage { background: #fff; border: 3px solid #ffd1e0; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 340px; animation: g01-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g01-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g01-stage.g01-shake { animation: g01-shk .4s; }
        @keyframes g01-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g01-stage.g01-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }

        .g01-q { font-size: 1.1rem; font-weight: 900; color: #7c3aed; margin-bottom: 12px; min-height: 26px; }
        .g01-q small { display: block; font-size: 0.8rem; color: #a78bfa; font-weight: 700; margin-top: 2px; }

        .g01-stage-top { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 14px; }
        .g01-big-num { font-size: 5rem; font-weight: 900; line-height: 1; color: #e11d48; text-shadow: 0 5px 0 #fecdd3, 0 9px 16px rgba(225,29,72,.2); cursor: pointer; transition: transform 0.2s cubic-bezier(.34,1.56,.64,1); }
        .g01-big-num:active { transform: scale(1.2) rotate(-5deg); }
        .g01-words { text-align: right; }
        .g01-fr { font-size: 1.75rem; font-weight: 900; color: #1e293b; }
        .g01-eg { font-size: 1.3rem; font-weight: 800; color: #ec4899; }

        .g01-items-box { min-height: 120px; background: linear-gradient(180deg, #fff7fa, #ffedf4); border-radius: 20px; padding: 14px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; border: 2px dashed #fbcfe8; }
        .g01-item { font-size: 2.5rem; cursor: pointer; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 16px; background: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.08); animation: g01-itemIn .3s backwards; }
        @keyframes g01-itemIn { from { transform: scale(0) rotate(-30deg); } to { transform: scale(1) rotate(0); } }
        .g01-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.2) translateY(-5px); box-shadow: 0 10px 20px rgba(234, 179, 8, 0.5); }
        .g01-item-badge { position: absolute; top: -7px; right: -7px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.75rem; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(225,29,72,.4); }
        .g01-item.counted .g01-item-badge { opacity: 1; transform: scale(1); }

        .g01-controls { display: flex; justify-content: center; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .g01-action-btn { border: none; border-radius: 16px; padding: 12px 16px; font-size: 1rem; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.15s, filter .15s; }
        .g01-action-btn:hover { filter: brightness(1.06); }
        .g01-action-btn:active { transform: scale(0.95); }
        .g01-btn-speak { background: linear-gradient(180deg,#34d399,#10b981); color: #fff; box-shadow: 0 5px 0 #059669; }
        .g01-btn-count { background: linear-gradient(180deg,#fbbf24,#f59e0b); color: #fff; box-shadow: 0 5px 0 #d97706; }
        .g01-btn-theme { background: #fce7f3; color: #be185d; box-shadow: 0 5px 0 #fbcfe8; }

        .g01-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
        .g01-choice { position: relative; background: #fff; border: 4px solid #e9d5ff; border-radius: 20px; padding: 24px 0; font-size: 2.2rem; font-weight: 900; color: #6b21a8; cursor: pointer; box-shadow: 0 6px 0 #d8b4fe; transition: all 0.15s ease; }
        .g01-choice:hover { transform: translateY(-2px); }
        .g01-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #d8b4fe; }
        .g01-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g01-correctPop .5s; }
        .g01-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g01-shk .4s; }
        @keyframes g01-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }

        .g01-order-area { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 10px; min-height: 90px; padding: 10px; background: #faf5ff; border-radius: 18px; border: 2px dashed #e9d5ff; }
        .g01-order-slot { width: 62px; height: 62px; border-radius: 16px; background: #fff; border: 3px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #94a3b8; transition: all .2s; }
        .g01-order-slot.filled { border-style: solid; border-color: #22c55e; background: linear-gradient(180deg,#dcfce7,#bbf7d0); color: #166534; animation: g01-correctPop .4s; }
        .g01-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 14px; }
        .g01-pool-num { width: 62px; height: 62px; border-radius: 16px; background: linear-gradient(180deg,#a855f7,#7c3aed); color: #fff; border: none; font-size: 1.8rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #5b21b6; transition: all .15s; }
        .g01-pool-num:active { transform: translateY(2px); box-shadow: 0 3px 0 #5b21b6; }
        .g01-pool-num.used { opacity: 0.25; pointer-events: none; }

        .g01-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 9px; }
        .g01-num-btn { position: relative; background: #fff; border: 3px solid #e9d5ff; border-radius: 16px; padding: 12px 0; font-size: 1.6rem; font-weight: 900; color: #334155; cursor: pointer; box-shadow: 0 5px 0 #d8b4fe; transition: all 0.15s ease; }
        .g01-num-btn.active { background: linear-gradient(180deg,#a855f7,#9333ea); color: #fff; border-color: #7e22ce; box-shadow: 0 5px 0 #6b21a8; transform: translateY(-2px); }
        .g01-num-btn.locked { opacity: 0.35; cursor: not-allowed; background: #f1f5f9; border-color: #cbd5e1; box-shadow: 0 4px 0 #94a3b8; color: #94a3b8; }
        .g01-num-btn .star-dot { position: absolute; top: 2px; left: 5px; font-size: 0.75rem; }
        .g01-num-btn .lock-dot { position: absolute; top: 2px; left: 5px; font-size: 0.7rem; }

        .g01-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g01-pop .4s; padding: 20px; }
        .g01-win-emoji { font-size: 4.8rem; animation: g01-bounce 1s infinite; }
        @keyframes g01-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g01-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#ec4899,#a855f7,#3b82f6); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g01-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g01-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g01-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g01-win-btn:active { transform: scale(0.95); }
        .g01-win-replay { background: linear-gradient(180deg,#f472b6,#ec4899); color: #fff; box-shadow: 0 5px 0 #be185d; }
        .g01-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }

        .g01-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g01-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g01-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g01-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g01-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }

        .g01-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g01-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g01-fall 1.6s linear forwards; }
        @keyframes g01-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

        .g01-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g01-toast.show { transform: translateX(-50%) translateY(0); }
      </style>

      <div class="g01-wrap">
        <div class="g01-header">
          <div>
            <div class="g01-title">🔢 Les Nombres • الأرقام</div>
            <div class="g01-unlock-pill" id="g01-unlock-pill">🔓 1 / 10 مفتوحة</div>
          </div>
          <div class="g01-progress" id="g01-prog">⭐ 0</div>
        </div>

        <div class="g01-tabs">
          <button class="g01-tab active" id="g01-tab-learn">📚 تعلّم</button>
          <button class="g01-tab" id="g01-tab-match">🎯 عدّ</button>
          <button class="g01-tab" id="g01-tab-order">🔢 رتّب</button>
        </div>

        <div class="g01-stage" id="g01-stage">
          <button class="g01-parent-btn" id="g01-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g01-q" id="g01-q"></div>
          <div class="g01-stage-top" id="g01-top">
            <div class="g01-big-num" id="g01-big">1</div>
            <div class="g01-words">
              <div class="g01-fr" id="g01-fr">Un</div>
              <div class="g01-eg" id="g01-eg">واحد</div>
            </div>
          </div>

          <div class="g01-items-box" id="g01-items"></div>

          <div class="g01-controls" id="g01-controls-learn">
            <button class="g01-action-btn g01-btn-speak" id="g01-speak">🔊 اسمع</button>
            <button class="g01-action-btn g01-btn-count" id="g01-count">👆 عدّ</button>
            <button class="g01-action-btn g01-btn-theme" id="g01-theme">🍎 غيّر</button>
          </div>

          <div class="g01-choices" id="g01-choices" style="display:none"></div>

          <div id="g01-order-wrap" style="display:none">
            <div class="g01-order-area" id="g01-order-area"></div>
            <div class="g01-pool" id="g01-pool"></div>
          </div>
        </div>

        <div class="g01-grid" id="g01-grid"></div>
      </div>
    `;

    const bigEl = document.getElementById('g01-big');
    const frEl = document.getElementById('g01-fr');
    const egEl = document.getElementById('g01-eg');
    const itemsBox = document.getElementById('g01-items');
    const gridEl = document.getElementById('g01-grid');
    const progEl = document.getElementById('g01-prog');
    const stageEl = document.getElementById('g01-stage');
    const qEl = document.getElementById('g01-q');
    const choicesEl = document.getElementById('g01-choices');
    const controlsLearn = document.getElementById('g01-controls-learn');
    const tabLearn = document.getElementById('g01-tab-learn');
    const tabMatch = document.getElementById('g01-tab-match');
    const tabOrder = document.getElementById('g01-tab-order');
    const unlockPill = document.getElementById('g01-unlock-pill');
    const topEl = document.getElementById('g01-top');
    const orderWrap = document.getElementById('g01-order-wrap');
    const orderArea = document.getElementById('g01-order-area');
    const poolEl = document.getElementById('g01-pool');

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
    function playCountTone(step) { playTone(320 + step * 45, .18, 'sine'); }
    function playUnlockTone() { playTone(523, .12, 'sine'); setTimeout(() => playTone(659, .12, 'sine'), 100); setTimeout(() => playTone(784, .12, 'sine'), 200); setTimeout(() => playTone(1047, .3, 'sine'), 300); }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    function range(n) { const r = []; for (let i = 1; i <= n; i++) r.push(i); return r; }

    function saveUnlocked() {
      try { localStorage.setItem(STORAGE_KEY, String(unlockedMax)); } catch (e) {}
    }

    function updateProgress() {
      progEl.textContent = mode === 'learn' ? `⭐ ${discovered.size}` : `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`;
      unlockPill.textContent = `🔓 ${unlockedMax} / ${MAX_NUM} مفتوحة`;
    }

    async function speakNumber(num, includeEg) {
      const nObj = SHARED.numbers[num - 1];
      if (!nObj) return;
      try {
        if (typeof speakNum === 'function') await speakNum(num);
        else await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' });
      } catch (e) {}
      if (includeEg) {
        try { await Audio2.play(nObj.egId || ('eg_num_' + num), { text: nObj.eg, lang: 'eg' }); } catch (e) {}
      }
    }
    async function speakPraise() {
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'برافو عليكي!', lang: 'eg' }); } catch (e) {}
    }
    async function speakEncourage() {
      try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
    }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g01-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g01-confetti';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }

    function celebrate() {
      confetti();
      if (typeof starBurst === 'function') starBurst();
      playCorrectTone();
    }

    function toast(msg) {
      const t = document.createElement('div');
      t.className = 'g01-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 400);
      }, 2200);
    }

    async function unlockNext(numJustTouched) {
      if (numJustTouched === unlockedMax && unlockedMax < MAX_NUM) {
        unlockedMax++;
        saveUnlocked();
        updateProgress();
        renderGrid();
        playUnlockTone();
        confetti();
        toast(`🎉 فتحنا الرقم ${unlockedMax}!`);
        await sleep(300);
        try { await speakNumber(unlockedMax, false); } catch (e) {}
      }
    }

    function renderGrid() {
      gridEl.innerHTML = '';
      if (mode !== 'learn') return;
      for (let i = 1; i <= MAX_NUM; i++) {
        const isUnlocked = i <= unlockedMax;
        const btn = document.createElement('button');
        btn.className = 'g01-num-btn' + (i === selectedNum && isUnlocked ? ' active' : '') + (isUnlocked ? '' : ' locked');
        if (isUnlocked) {
          btn.innerHTML = `${discovered.has(i) ? '<span class="star-dot">⭐</span>' : ''}${i}`;
          btn.addEventListener('click', () => selectNumber(i, true));
        } else {
          btn.innerHTML = `<span class="lock-dot">🔒</span>${i}`;
        }
        gridEl.appendChild(btn);
      }
    }

    function renderItems(num) {
      itemsBox.innerHTML = '';
      const icon = THEMES[currentThemeIdx].icon;
      let tappedCount = 0;
      for (let i = 1; i <= num; i++) {
        const item = document.createElement('div');
        item.className = 'g01-item';
        item.style.animationDelay = (i * 40) + 'ms';
        item.innerHTML = `${icon}<span class="g01-item-badge">${i}</span>`;
        item.addEventListener('click', async () => {
          if (isCounting || locked) return;
          if (!item.classList.contains('counted')) tappedCount++;
          item.classList.add('counted');
          playCountTone(i);
          const nObj = SHARED.numbers[i - 1];
          if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
          if (tappedCount === num && mode === 'learn') {
            if (!discovered.has(num)) {
              discovered.add(num);
              updateProgress();
              renderGrid();
            }
            await speakPraise();
            celebrate();
          }
        });
        itemsBox.appendChild(item);
      }
    }

    async function selectNumber(num, shouldSpeak) {
      if (num > unlockedMax) return;
      isCounting = false;
      selectedNum = num;
      discovered.add(num);
      const data = SHARED.numbers[num - 1];
      bigEl.textContent = num;
      frEl.textContent = data ? data.fr : '';
      egEl.textContent = data ? data.eg : '';
      updateProgress();
      renderGrid();
      renderItems(num);
      if (shouldSpeak) await speakNumber(num, true);
      await unlockNext(num);
    }

    async function autoCount() {
      if (isCounting) return;
      isCounting = true;
      const itemEls = Array.from(itemsBox.querySelectorAll('.g01-item'));
      itemEls.forEach(el => el.classList.remove('counted'));
      for (let i = 0; i < itemEls.length; i++) {
        if (!isCounting) break;
        const el = itemEls[i];
        el.classList.add('counted');
        playCountTone(i + 1);
        const nObj = SHARED.numbers[i];
        if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
        await sleep(420);
      }
      if (isCounting) { celebrate(); await speakPraise(); }
      isCounting = false;
    }

    function startMatch() {
      round = 0;
      stars = 0;
      wrongThisRound = 0;
      newMatchRound();
    }

    function newMatchRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g01-hint', 'g01-shake');

      const maxRange = Math.max(3, unlockedMax);
      targetNum = 1 + Math.floor(Math.random() * maxRange);

      bigEl.style.display = 'none';
      frEl.style.display = 'none';
      egEl.style.display = 'none';
      itemsBox.style.display = 'flex';

      qEl.innerHTML = `🎯 كم عدد ${THEMES[currentThemeIdx].name}؟<small>Combien de ${THEMES[currentThemeIdx].frName} ?</small>`;
      renderItems(targetNum);

      const choiceCount = targetNum <= 3 ? 3 : 4;
      let choices = [targetNum];
      while (choices.length < choiceCount) {
        const c = 1 + Math.floor(Math.random() * Math.max(4, maxRange));
        if (!choices.includes(c)) choices.push(c);
      }
      choices = shuffle(choices);

      choicesEl.style.display = 'grid';
      choicesEl.style.gridTemplateColumns = choices.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
      choicesEl.innerHTML = '';
      controlsLearn.style.display = 'none';

      choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g01-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onMatchChoice(c, btn));
        choicesEl.appendChild(btn);
      });

      speakNumber(targetNum, false);
    }

    async function onMatchChoice(num, btn) {
      if (locked) return;
      if (num === targetNum) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        await speakPraise();
        await sleep(700);
        if (round >= TOTAL_ROUNDS) showWin();
        else newMatchRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g01-shake');
        setTimeout(() => stageEl.classList.remove('g01-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g01-hint');
          const correctBtn = choicesEl.querySelector(`[data-num="${targetNum}"]`);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #d8b4fe';
        }
      }
    }

    function startOrder() {
      if (round === 0) round = 1;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g01-hint', 'g01-shake');
      qEl.innerHTML = `🔢 رتّبي الأرقام من الصغير للكبير<small>Range les nombres</small>`;
      choicesEl.style.display = 'none';
      controlsLearn.style.display = 'none';
      itemsBox.style.display = 'none';
      orderWrap.style.display = 'block';
      bigEl.style.display = 'none';
      frEl.style.display = 'none';
      egEl.style.display = 'none';

      const count = Math.min(Math.max(3, unlockedMax), 5);
      orderSequence = range(count);
      orderProgress = 0;
      wrongThisRound = 0;

      orderArea.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const slot = document.createElement('div');
        slot.className = 'g01-order-slot';
        slot.textContent = '?';
        slot.dataset.idx = i;
        orderArea.appendChild(slot);
      }

      poolEl.innerHTML = '';
      const shuffled = shuffle(range(count));
      shuffled.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'g01-pool-num';
        btn.textContent = n;
        btn.dataset.num = n;
        btn.addEventListener('click', () => onOrderPick(n, btn));
        poolEl.appendChild(btn);
      });
    }

    async function onOrderPick(num, btn) {
      if (locked) return;
      if (num === orderProgress + 1) {
        btn.classList.add('used');
        const slot = orderArea.querySelector(`[data-idx="${orderProgress}"]`);
        if (slot) { slot.classList.add('filled'); slot.textContent = num; }
        orderProgress++;
        playCountTone(num);
        try {
          const nObj = SHARED.numbers[num - 1];
          if (nObj) await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' });
        } catch (e) {}
        if (orderProgress === orderSequence.length) {
          locked = true;
          stars++;
          updateProgress();
          celebrate();
          await speakPraise();
          await sleep(900);
          if (round >= TOTAL_ROUNDS) showWin();
          else { round++; startOrder(); }
        }
      } else {
        playErrorTone();
        stageEl.classList.add('g01-shake');
        setTimeout(() => stageEl.classList.remove('g01-shake'), 400);
        await speakEncourage();
        wrongThisRound++;
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g01-hint');
          const nextBtn = poolEl.querySelector(`[data-num="${orderProgress + 1}"]:not(.used)`);
          if (nextBtn) nextBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #5b21b6';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g01-win';
      win.innerHTML = `
        <div class="g01-win-emoji">🏆</div>
        <div class="g01-win-title">أحسنتِ يا بطلة!</div>
        <div class="g01-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g01-win-btns">
          <button class="g01-win-btn g01-win-replay" id="g01-replay">🔄 العب تاني</button>
          <button class="g01-win-btn g01-win-home" id="g01-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g01-replay').addEventListener('click', () => {
        win.remove();
        if (mode === 'match') startMatch();
        else if (mode === 'order') { round = 0; stars = 0; startOrder(); }
        else Game_01.mount(container);
      });
      document.getElementById('g01-home').addEventListener('click', () => {
        location.hash = '#/home';
      });
    }

    async function switchMode(newMode) {
      if (mode === newMode) return;
      mode = newMode;
      isCounting = false;
      locked = false;
      round = 0;
      stars = 0;
      stageEl.classList.remove('g01-hint', 'g01-shake');
      orderWrap.style.display = 'none';
      choicesEl.style.display = 'none';
      controlsLearn.style.display = 'none';
      itemsBox.style.display = 'flex';
      topEl.style.display = 'flex';
      bigEl.style.display = '';
      frEl.style.display = '';
      egEl.style.display = '';
      gridEl.style.display = 'none';

      tabLearn.classList.toggle('active', mode === 'learn');
      tabMatch.classList.toggle('active', mode === 'match');
      tabOrder.classList.toggle('active', mode === 'order');

      if (mode === 'learn') {
        gridEl.style.display = 'grid';
        qEl.textContent = '';
        controlsLearn.style.display = 'flex';
        renderGrid();
        await selectNumber(Math.min(selectedNum, unlockedMax), false);
      } else if (mode === 'match') {
        startMatch();
      } else {
        wrongThisRound = 0;
        startOrder();
      }
    }

    document.getElementById('g01-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g01-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>الأرقام المكتشفة</span><strong>${discovered.size} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'learn' ? 'تعلّم' : mode === 'match' ? 'عدّ' : 'رتّب'}</strong></div>
        <button id="g01-parent-unlock-all">🔓 فتح كل الأرقام (للوالد)</button>
        <button id="g01-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g01-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM;
        saveUnlocked();
        updateProgress();
        renderGrid();
        playUnlockTone();
        confetti();
        toast('🎉 كل الأرقام اتفتحت!');
        panel.remove();
      });
      document.getElementById('g01-parent-close').addEventListener('click', () => panel.remove());
    });

    bigEl.addEventListener('click', () => speakNumber(selectedNum, false));
    document.getElementById('g01-speak').addEventListener('click', () => speakNumber(selectedNum, true));
    document.getElementById('g01-count').addEventListener('click', autoCount);
    document.getElementById('g01-theme').addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % THEMES.length;
      document.getElementById('g01-theme').textContent = `${THEMES[currentThemeIdx].icon} غيّر`;
      if (mode === 'learn') renderItems(selectedNum);
      else if (mode === 'match') { round--; newMatchRound(); }
    });

    tabLearn.addEventListener('click', () => switchMode('learn'));
    tabMatch.addEventListener('click', () => switchMode('match'));
    tabOrder.addEventListener('click', () => switchMode('order'));

    await selectNumber(1, false);
    updateProgress();
    gridEl.style.display = 'grid';
  }
};
