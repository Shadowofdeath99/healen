window.Game_05 = {
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
    const UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g05_unlocked';

    let mode = 'order'; // order | count
    let currentThemeIdx = 0;
    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;

    let orderSequence = [];
    let orderProgress = 0;
    let orderCount = 0;
    let targetAnswer = 0;
    let currentChoices = [];
    let isCounting = false;

    container.innerHTML = `
      <style>
        .g05-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g05-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(6, 182, 212, 0.35); position: relative; overflow: hidden; }
        .g05-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g05-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.4px; }
        .g05-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g05-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; backdrop-filter: blur(4px); }

        .g05-tabs { display: flex; gap: 8px; justify-content: center; }
        .g05-tab { flex: 1; max-width: 220px; padding: 12px 8px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.9rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g05-tab.active { background: linear-gradient(180deg,#06b6d4,#0891b2); color: #fff; box-shadow: 0 5px 0 #0e7490; }

        .g05-stage { background: #fff; border: 3px solid #a5f3fc; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g05-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g05-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g05-stage.g05-shake { animation: g05-shk .4s; }
        @keyframes g05-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g05-stage.g05-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }

        .g05-q { font-size: 1.05rem; font-weight: 900; color: #0e7490; margin-bottom: 12px; min-height: 26px; }
        .g05-q small { display: block; font-size: 0.78rem; color: #22d3ee; font-weight: 700; margin-top: 2px; }

        .g05-order-area { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 14px; padding: 10px; background: #ecfeff; border-radius: 18px; border: 2px dashed #67e8f9; min-height: 80px; }
        .g05-order-slot { width: 64px; height: 64px; border-radius: 16px; background: #fff; border: 3px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #94a3b8; transition: all .2s; }
        .g05-order-slot.filled { border-style: solid; border-color: #22c55e; background: linear-gradient(180deg,#dcfce7,#bbf7d0); color: #166534; animation: g05-correctPop .4s; }
        .g05-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .g05-pool-num { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(180deg,#06b6d4,#0891b2); color: #fff; border: none; font-size: 1.8rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0e7490; transition: all .15s; }
        .g05-pool-num:active { transform: translateY(2px); box-shadow: 0 3px 0 #0e7490; }
        .g05-pool-num.used { opacity: 0.25; pointer-events: none; }

        .g05-animal-box { min-height: 120px; background: linear-gradient(180deg, #ecfeff, #cffafe); border-radius: 20px; padding: 14px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; border: 2px dashed #67e8f9; margin-bottom: 14px; }
        .g05-animal-item { font-size: 2.5rem; cursor: pointer; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 16px; background: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.08); animation: g05-itemIn .3s backwards; }
        @keyframes g05-itemIn { from { transform: scale(0) rotate(-30deg); } to { transform: scale(1) rotate(0); } }
        .g05-animal-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.2) translateY(-5px); box-shadow: 0 10px 20px rgba(234, 179, 8, 0.5); }
        .g05-item-badge { position: absolute; top: -7px; right: -7px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.75rem; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(225,29,72,.4); }
        .g05-animal-item.counted .g05-item-badge { opacity: 1; transform: scale(1); }

        .g05-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g05-choice { background: #fff; border: 4px solid #a5f3fc; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #0e7490; cursor: pointer; box-shadow: 0 6px 0 #67e8f9; transition: all 0.15s ease; }
        .g05-choice:hover { transform: translateY(-2px); }
        .g05-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #67e8f9; }
        .g05-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g05-correctPop .5s; }
        .g05-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g05-shk .4s; }
        @keyframes g05-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }

        .g05-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; font-size: 1.4rem; margin-top: 12px; }
        .g05-hint-box.visible { display: flex; }

        .g05-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #0891b2; }

        .g05-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g05-pop .4s; padding: 20px; }
        .g05-win-emoji { font-size: 4.8rem; animation: g05-bounce 1s infinite; }
        @keyframes g05-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g05-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#06b6d4,#0891b2,#0e7490); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g05-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g05-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g05-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g05-win-btn:active { transform: scale(0.95); }
        .g05-win-replay { background: linear-gradient(180deg,#22d3ee,#06b6d4); color: #fff; box-shadow: 0 5px 0 #0e7490; }
        .g05-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }

        .g05-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g05-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g05-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g05-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g05-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }

        .g05-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g05-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g05-fall 1.6s linear forwards; }
        @keyframes g05-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

        .g05-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g05-toast.show { transform: translateX(-50%) translateY(0); }
      </style>

      <div class="g05-wrap">
        <div class="g05-header">
          <div>
            <div class="g05-title">🔀 Ordre Croissant • رتّب</div>
            <div class="g05-unlock-pill" id="g05-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g05-progress" id="g05-prog">⭐ 0</div>
        </div>

        <div class="g05-tabs">
          <button class="g05-tab active" id="g05-tab-order">🔀 رتّب</button>
          <button class="g05-tab" id="g05-tab-count">🎯 كم رقم؟</button>
        </div>

        <div class="g05-stage" id="g05-stage">
          <button class="g05-parent-btn" id="g05-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g05-q" id="g05-q"></div>

          <div id="g05-order-wrap" style="display:none">
            <div class="g05-order-area" id="g05-order-area"></div>
            <div class="g05-pool" id="g05-pool"></div>
          </div>

          <div class="g05-animal-box" id="g05-animal-box" style="display:none"></div>
          <div class="g05-choices" id="g05-choices" style="display:none"></div>
          <div class="g05-hint-box" id="g05-hint"></div>
          <div class="g05-feedback" id="g05-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g05-stage');
    const qEl = document.getElementById('g05-q');
    const orderWrap = document.getElementById('g05-order-wrap');
    const orderArea = document.getElementById('g05-order-area');
    const poolEl = document.getElementById('g05-pool');
    const animalBox = document.getElementById('g05-animal-box');
    const choicesEl = document.getElementById('g05-choices');
    const hintBox = document.getElementById('g05-hint');
    const msgEl = document.getElementById('g05-msg');
    const progEl = document.getElementById('g05-prog');
    const unlockPill = document.getElementById('g05-unlock-pill');
    const tabOrder = document.getElementById('g05-tab-order');
    const tabCount = document.getElementById('g05-tab-count');

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
      progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`;
      unlockPill.textContent = `🔓 1-${unlockedMax} مفتوحة`;
    }

    async function speakNumber(num, lang) {
      const nObj = SHARED.numbers[num - 1];
      if (!nObj) return;
      try {
        if (lang === 'fr') await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(nObj.egId, { text: nObj.eg, lang: 'eg' });
        else {
          await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' });
          await sleep(400);
          await Audio2.play(nObj.egId, { text: nObj.eg, lang: 'eg' });
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
      c.className = 'g05-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g05-confetti';
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
      t.className = 'g05-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2200);
    }

    function tryUnlock() {
      successCount++;
      if (successCount >= UNLOCK_EVERY && unlockedMax < MAX_NUM) {
        successCount = 0;
        unlockedMax++;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        toast(`🎉 فتحنا الرقم ${unlockedMax}!`);
      }
    }

    async function countVisualItems(num, icon) {
      animalBox.innerHTML = '';
      animalBox.style.display = 'flex';
      const els = [];
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g05-animal-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g05-item-badge">${i}</span>`;
        animalBox.appendChild(el);
        els.push(el);
      }
      isCounting = true;
      for (let i = 0; i < els.length; i++) {
        if (!isCounting) break;
        els[i].classList.add('counted');
        playCountTone(i + 1);
        const nObj = SHARED.numbers[i];
        if (nObj) {
          try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {}
        }
        await sleep(380);
      }
      isCounting = false;
    }

    function startOrder() {
      round++;
      locked = false;
      wrongThisRound = 0;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g05-hint', 'g05-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      orderWrap.style.display = 'block';
      animalBox.style.display = 'none';
      choicesEl.style.display = 'none';

      orderCount = Math.min(unlockedMax, 5);
      orderSequence = range(orderCount);
      orderProgress = 0;

      qEl.innerHTML = `🔀 رتّبي الأرقام من الصغير للكبير<small>Range du plus petit au plus grand</small>`;

      orderArea.innerHTML = '';
      for (let i = 0; i < orderCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'g05-order-slot';
        slot.textContent = '?';
        slot.dataset.idx = i;
        orderArea.appendChild(slot);
      }

      poolEl.innerHTML = '';
      const shuffled = shuffle(range(orderCount));
      shuffled.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'g05-pool-num';
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
          msgEl.style.color = '#16a34a';
          msgEl.textContent = `🎉 Bravo ! رتّبتي صح!`;
          await speakPraise();
          await sleep(600);
          tryUnlock();
          await sleep(300);
          if (round >= TOTAL_ROUNDS) showWin();
          else startOrder();
        }
      } else {
        wrongThisRound++;
        playErrorTone();
        stageEl.classList.add('g05-shake');
        setTimeout(() => stageEl.classList.remove('g05-shake'), 400);
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g05-hint');
          const nextNum = orderProgress + 1;
          const nextBtn = poolEl.querySelector(`[data-num="${nextNum}"]:not(.used)`);
          if (nextBtn) nextBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #0e7490';
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">التالي:</span> ${nextNum}`;
          hintBox.classList.add('visible');
        }
      }
    }

    function startCount() {
      round++;
      locked = false;
      wrongThisRound = 0;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g05-hint', 'g05-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      orderWrap.style.display = 'none';
      animalBox.style.display = 'flex';
      choicesEl.style.display = 'grid';

      currentThemeIdx = Math.floor(Math.random() * THEMES.length);
      targetAnswer = 1 + Math.floor(Math.random() * unlockedMax);
      const icon = THEMES[currentThemeIdx].icon;

      qEl.innerHTML = `🎯 كم عدد ${THEMES[currentThemeIdx].name}؟<small>Combien de ${THEMES[currentThemeIdx].frName} ?</small>`;

      animalBox.innerHTML = '';
      for (let i = 1; i <= targetAnswer; i++) {
        const el = document.createElement('div');
        el.className = 'g05-animal-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g05-item-badge">${i}</span>`;
        el.addEventListener('click', async () => {
          if (isCounting) return;
          el.classList.add('counted');
          playCountTone(i);
          const nObj = SHARED.numbers[i - 1];
          if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
        });
        animalBox.appendChild(el);
      }

      const count = targetAnswer <= 3 ? 3 : 4;
      let choices = [targetAnswer];
      while (choices.length < count) {
        const c = 1 + Math.floor(Math.random() * Math.max(4, unlockedMax));
        if (!choices.includes(c)) choices.push(c);
      }
      currentChoices = shuffle(choices);
      choicesEl.style.gridTemplateColumns = currentChoices.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
      choicesEl.innerHTML = '';
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g05-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onCountChoice(c, btn));
        choicesEl.appendChild(btn);
      });

      setTimeout(() => speakNumber(targetAnswer, 'both'), 300);
    }

    async function onCountChoice(num, btn) {
      if (locked) return;
      if (num === targetAnswer) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${targetAnswer}`;
        await speakPraise();
        await sleep(350);
        await countVisualItems(targetAnswer, THEMES[currentThemeIdx].icon);
        await sleep(350);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else startCount();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g05-shake');
        setTimeout(() => stageEl.classList.remove('g05-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g05-hint');
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">عدّي معايا:</span> ${THEMES[currentThemeIdx].icon.repeat(targetAnswer)}`;
          hintBox.classList.add('visible');
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g05-win';
      win.innerHTML = `
        <div class="g05-win-emoji">🏆</div>
        <div class="g05-win-title">أحسنتِ يا بطلة!</div>
        <div class="g05-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g05-win-btns">
          <button class="g05-win-btn g05-win-replay" id="g05-replay">🔄 العبي تاني</button>
          <button class="g05-win-btn g05-win-home" id="g05-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g05-replay').addEventListener('click', () => {
        win.remove();
        round = 0;
        stars = 0;
        successCount = 0;
        startRound();
      });
      document.getElementById('g05-home').addEventListener('click', () => {
        location.hash = '#/home';
      });
    }

    function startRound() {
      if (mode === 'order') startOrder();
      else startCount();
    }

    function switchMode(newMode) {
      if (mode === newMode) return;
      mode = newMode;
      round = 0;
      stars = 0;
      successCount = 0;
      tabOrder.classList.toggle('active', mode === 'order');
      tabCount.classList.toggle('active', mode === 'count');
      startRound();
    }

    tabOrder.addEventListener('click', () => switchMode('order'));
    tabCount.addEventListener('click', () => switchMode('count'));

    document.getElementById('g05-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g05-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'order' ? 'رتّب' : 'كم رقم؟'}</strong></div>
        <button id="g05-parent-unlock-all">🔓 فتح كل الأرقام (للوالد)</button>
        <button id="g05-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g05-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        confetti();
        toast('🎉 كل الأرقام اتفتحت!');
        panel.remove();
      });
      document.getElementById('g05-parent-close').addEventListener('click', () => panel.remove());
    });

    startRound();
  }
};
