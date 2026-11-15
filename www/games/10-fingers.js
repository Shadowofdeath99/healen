window.Game_10 = {
  async mount(container) {
    const MAX_NUM = 10;
    const TOTAL_ROUNDS = 5;
    const UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g10_unlocked';

    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let targetNum = 0;
    let isCounting = false;
    let choices = [];

    container.innerHTML = `
      <style>
        .g10-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g10-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f472b6 0%, #db2777 50%, #be185d 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(244, 114, 182, 0.35); position: relative; overflow: hidden; }
        .g10-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g10-title { font-size: 1.15rem; font-weight: 900; }
        .g10-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g10-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g10-stage { background: #fff; border: 3px solid #fbcfe8; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g10-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g10-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g10-stage.g10-shake { animation: g10-shk .4s; }
        @keyframes g10-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g10-stage.g10-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g10-q { font-size: 1.05rem; font-weight: 900; color: #be185d; margin-bottom: 12px; }
        .g10-q small { display: block; font-size: 0.78rem; color: #f472b6; font-weight: 700; margin-top: 2px; }

        .g10-hands-stage { background: linear-gradient(180deg,#fdf2f8,#fce7f3); border-radius: 22px; padding: 16px 10px; display: flex; justify-content: center; align-items: flex-end; gap: 18px; border: 2px dashed #fbcfe8; margin-bottom: 14px; direction: ltr; }
        .g10-hand { display: flex; flex-direction: column; align-items: center; }
        .g10-fingers-row { display: flex; align-items: flex-end; gap: 6px; }
        .g10-finger-bar { width: 28px; border-radius: 14px 14px 6px 6px; background: #e2e8f0; border: 2px solid #cbd5e1; position: relative; transition: all .25s cubic-bezier(.34,1.56,.64,1); display: flex; align-items: flex-start; justify-content: center; padding-top: 4px; font-size: 0.7rem; font-weight: 900; color: transparent; }
        .g10-finger-bar.up { background: linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%); border-color: #fb923c; box-shadow: 0 4px 10px rgba(251, 146, 60, 0.35); cursor: pointer; color: #9a3412; }
        .g10-finger-bar.up::before { content: ''; width: 16px; height: 10px; border-radius: 8px 8px 4px 4px; background: rgba(255,255,255,0.75); position: absolute; top: 3px; }
        .g10-finger-bar.counted { background: linear-gradient(180deg,#fef08a,#facc15); border-color: #ca8a04; transform: translateY(-7px) scale(1.08); box-shadow: 0 8px 16px rgba(234,179,8,0.5); }
        .g10-palm { width: 158px; height: 64px; background: linear-gradient(180deg, #fed7aa, #fdba74); border: 2px solid #fb923c; border-top: none; border-radius: 12px 12px 44px 44px; margin-top: -2px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900; color: #9a3412; box-shadow: 0 6px 14px rgba(251,146,60,0.25); }
        .g10-item-badge { position: absolute; top: -22px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.75rem; font-weight: 900; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; }
        .g10-finger-bar.counted .g10-item-badge { opacity: 1; transform: scale(1); }

        .g10-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g10-choice { background: #fff; border: 4px solid #fbcfe8; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #be185d; cursor: pointer; box-shadow: 0 6px 0 #f9a8d4; transition: all 0.15s; }
        .g10-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #f9a8d4; }
        .g10-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g10-correctPop .5s; }
        .g10-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g10-shk .4s; }
        @keyframes g10-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .g10-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g10-hint-box.visible { display: flex; }
        .g10-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #db2777; }
        .g10-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g10-pop .4s; padding: 20px; }
        .g10-win-emoji { font-size: 4.8rem; animation: g10-bounce 1s infinite; }
        @keyframes g10-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g10-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#f472b6,#be185d); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g10-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g10-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g10-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g10-win-btn:active { transform: scale(0.95); }
        .g10-win-replay { background: linear-gradient(180deg,#f472b6,#ec4899); color: #fff; box-shadow: 0 5px 0 #be185d; }
        .g10-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g10-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g10-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g10-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g10-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g10-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g10-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g10-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g10-fall 1.6s linear forwards; }
        @keyframes g10-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .g10-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g10-toast.show { transform: translateX(-50%) translateY(0); }
      </style>
      <div class="g10-wrap">
        <div class="g10-header">
          <div>
            <div class="g10-title">✋ Compte les Doigts • عدّ الأصابع</div>
            <div class="g10-unlock-pill" id="g10-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g10-progress" id="g10-prog">⭐ 0</div>
        </div>
        <div class="g10-stage" id="g10-stage">
          <button class="g10-parent-btn" id="g10-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g10-q" id="g10-q"></div>
          <div class="g10-hands-stage" id="g10-hand"></div>
          <div class="g10-choices" id="g10-choices"></div>
          <div class="g10-hint-box" id="g10-hint"></div>
          <div class="g10-feedback" id="g10-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g10-stage');
    const qEl = document.getElementById('g10-q');
    const handEl = document.getElementById('g10-hand');
    const choicesEl = document.getElementById('g10-choices');
    const hintBox = document.getElementById('g10-hint');
    const msgEl = document.getElementById('g10-msg');
    const progEl = document.getElementById('g10-prog');
    const unlockPill = document.getElementById('g10-unlock-pill');

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
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function saveUnlocked() {
      try { localStorage.setItem(STORAGE_KEY, String(unlockedMax)); } catch (e) {}
    }

    function updateProgress() {
      progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`;
      unlockPill.textContent = `🔓 1-${unlockedMax} مفتوحة`;
    }

    async function speakNumber(num) {
      const nObj = SHARED.numbers[num - 1];
      if (!nObj) return;
      try {
        await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' });
        await sleep(350);
        await Audio2.play(nObj.egId, { text: nObj.eg, lang: 'eg' });
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
      c.className = 'g10-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g10-confetti';
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
      t.className = 'g10-toast';
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

    function buildHands(raisedCount) {
      handEl.innerHTML = '';
      const leftHeights = [66, 78, 86, 76, 52];  // خنصر -> إبهام
      const rightHeights = [52, 76, 86, 78, 66]; // إبهام -> خنصر
      let fingerIdx = 0;

      const createHand = (heights, label) => {
        const hand = document.createElement('div');
        hand.className = 'g10-hand';
        const row = document.createElement('div');
        row.className = 'g10-fingers-row';
        heights.forEach(h => {
          fingerIdx++;
          const currentIdx = fingerIdx;
          const isUp = currentIdx <= raisedCount;
          const bar = document.createElement('div');
          bar.className = 'g10-finger-bar' + (isUp ? ' up' : '');
          bar.style.height = (isUp ? h : 24) + 'px';
          if (isUp) {
            bar.dataset.step = currentIdx;
            bar.innerHTML = `<span class="g10-item-badge">${currentIdx}</span>`;
            bar.addEventListener('click', async () => {
              if (isCounting) return;
              bar.classList.add('counted');
              playCountTone(currentIdx);
              const nObj = SHARED.numbers[currentIdx - 1];
              if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
            });
          }
          row.appendChild(bar);
        });
        const palm = document.createElement('div');
        palm.className = 'g10-palm';
        palm.textContent = label;
        hand.appendChild(row);
        hand.appendChild(palm);
        return hand;
      };

      handEl.appendChild(createHand(leftHeights, '🤚'));
      if (raisedCount > 5 || unlockedMax > 5) {
        handEl.appendChild(createHand(rightHeights, '✋'));
      }
    }

    async function countVisual(num) {
      const upBars = [...handEl.querySelectorAll('.g10-finger-bar.up')];
      upBars.forEach(b => b.classList.remove('counted'));
      isCounting = true;
      for (let i = 0; i < upBars.length; i++) {
        if (!isCounting) break;
        upBars[i].classList.add('counted');
        playCountTone(i + 1);
        const nObj = SHARED.numbers[i];
        if (nObj) {
          try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {}
        }
        await sleep(360);
      }
      isCounting = false;
    }

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g10-hint', 'g10-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      targetNum = 1 + Math.floor(Math.random() * unlockedMax);
      qEl.innerHTML = `✋ كم صباع مرفوع؟<small>Combien de doigts levés ?</small>`;

      buildHands(targetNum);

      const count = targetNum <= 3 ? 3 : 4;
      choices = [targetNum];
      while (choices.length < count) {
        const c = 1 + Math.floor(Math.random() * Math.max(4, unlockedMax));
        if (!choices.includes(c)) choices.push(c);
      }
      choices = shuffle(choices);
      choicesEl.style.gridTemplateColumns = choices.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
      choicesEl.innerHTML = '';
      choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g10-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onChoice(c, btn));
        choicesEl.appendChild(btn);
      });

      setTimeout(() => speakNumber(targetNum), 300);
    }

    async function onChoice(num, btn) {
      if (locked) return;
      if (num === targetNum) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${targetNum}`;
        await speakPraise();
        await sleep(350);
        await countVisual(targetNum);
        await sleep(350);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g10-shake');
        setTimeout(() => stageEl.classList.remove('g10-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g10-hint');
          hintBox.innerHTML = `💡 دوسي على كل صباع مرفوع عشان نعدّهم سوا!`;
          hintBox.classList.add('visible');
          const correctBtn = choicesEl.querySelector(`[data-num="${targetNum}"]`);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #f9a8d4';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g10-win';
      win.innerHTML = `
        <div class="g10-win-emoji">🏆</div>
        <div class="g10-win-title">أحسنتِ يا بطلة!</div>
        <div class="g10-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g10-win-btns">
          <button class="g10-win-btn g10-win-replay" id="g10-replay">🔄 العبي تاني</button>
          <button class="g10-win-btn g10-win-home" id="g10-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g10-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; successCount = 0; newRound();
      });
      document.getElementById('g10-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g10-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g10-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g10-parent-unlock-all">🔓 فتح كل الأرقام (1-10)</button>
        <button id="g10-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g10-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM; saveUnlocked(); updateProgress(); playUnlockTone(); confetti(); toast('🎉 كل الأرقام اتفتحت!'); panel.remove();
      });
      document.getElementById('g10-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
