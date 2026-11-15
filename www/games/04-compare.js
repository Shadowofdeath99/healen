window.Game_04 = {
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
    const STORAGE_KEY = 'helen_g04_unlocked';

    let mode = 'compare'; // compare | count | add
    let currentThemeIdx = 0;
    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;

    let leftNum = 0;
    let rightNum = 0;
    let targetAnswer = 0;
    let currentChoices = [];
    let isCounting = false;

    container.innerHTML = `
      <style>
        .g04-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g04-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(245, 158, 11, 0.35); position: relative; overflow: hidden; }
        .g04-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g04-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.4px; }
        .g04-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g04-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; backdrop-filter: blur(4px); }

        .g04-tabs { display: flex; gap: 8px; justify-content: center; }
        .g04-tab { flex: 1; max-width: 220px; padding: 12px 6px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.85rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g04-tab.active { background: linear-gradient(180deg,#f59e0b,#ea580c); color: #fff; box-shadow: 0 5px 0 #9a3412; }

        .g04-stage { background: #fff; border: 3px solid #fed7aa; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g04-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g04-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g04-stage.g04-shake { animation: g04-shk .4s; }
        @keyframes g04-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g04-stage.g04-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }

        .g04-q { font-size: 1.05rem; font-weight: 900; color: #c2410c; margin-bottom: 12px; min-height: 26px; }
        .g04-q small { display: block; font-size: 0.78rem; color: #fb923c; font-weight: 700; margin-top: 2px; }

        .g04-compare-row { display: flex; gap: 10px; align-items: stretch; justify-content: center; margin-bottom: 12px; }
        .g04-side { flex: 1; background: linear-gradient(180deg,#fff7ed,#ffedd5); border: 3px solid #fed7aa; border-radius: 20px; padding: 14px 8px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px; min-height: 130px; cursor: pointer; transition: all .15s; position: relative; }
        .g04-side:hover { transform: translateY(-2px); }
        .g04-side:active { transform: translateY(2px); }
        .g04-side.correct { background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #16a34a; animation: g04-correctPop .5s; }
        .g04-side.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color: #ef4444; animation: g04-shk .4s; }
        @keyframes g04-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.06)} 100%{transform:scale(1)} }
        .g04-side-item { font-size: 2.2rem; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); transition: all .25s; animation: g04-itemIn .3s backwards; }
        @keyframes g04-itemIn { from { transform: scale(0) rotate(-30deg); } to { transform: scale(1) rotate(0); } }
        .g04-side-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.15) translateY(-3px); box-shadow: 0 6px 14px rgba(234, 179, 8, 0.5); }
        .g04-item-badge { position: absolute; top: -6px; right: -6px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.7rem; font-weight: 900; width: 19px; height: 19px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; }
        .g04-side-item.counted .g04-item-badge { opacity: 1; transform: scale(1); }

        .g04-vs { display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; color: #c2410c; padding: 0 4px; }

        .g04-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g04-choice { background: #fff; border: 4px solid #fed7aa; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #c2410c; cursor: pointer; box-shadow: 0 6px 0 #fdba74; transition: all 0.15s ease; }
        .g04-choice:hover { transform: translateY(-2px); }
        .g04-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #fdba74; }
        .g04-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g04-correctPop .5s; }
        .g04-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g04-shk .4s; }

        .g04-add-row { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .g04-add-group { background: linear-gradient(180deg,#fff7ed,#ffedd5); border: 3px solid #fed7aa; border-radius: 18px; padding: 10px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; min-height: 80px; min-width: 100px; max-width: 140px; }
        .g04-add-item { font-size: 1.8rem; display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
        .g04-add-op { font-size: 1.8rem; font-weight: 900; color: #c2410c; }
        .g04-add-eq { font-size: 1.8rem; font-weight: 900; color: #c2410c; }
        .g04-add-q { font-size: 2rem; font-weight: 900; color: #94a3b8; }

        .g04-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; font-size: 1.4rem; margin-bottom: 12px; }
        .g04-hint-box.visible { display: flex; }

        .g04-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #ea580c; }

        .g04-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g04-pop .4s; padding: 20px; }
        .g04-win-emoji { font-size: 4.8rem; animation: g04-bounce 1s infinite; }
        @keyframes g04-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g04-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#f59e0b,#f97316,#ea580c); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g04-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g04-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g04-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g04-win-btn:active { transform: scale(0.95); }
        .g04-win-replay { background: linear-gradient(180deg,#fb923c,#f97316); color: #fff; box-shadow: 0 5px 0 #c2410c; }
        .g04-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }

        .g04-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g04-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g04-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g04-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g04-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }

        .g04-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g04-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g04-fall 1.6s linear forwards; }
        @keyframes g04-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

        .g04-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g04-toast.show { transform: translateX(-50%) translateY(0); }
      </style>

      <div class="g04-wrap">
        <div class="g04-header">
          <div>
            <div class="g04-title">⚖️ Plus ou Moins • أكتر ولا أقل</div>
            <div class="g04-unlock-pill" id="g04-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g04-progress" id="g04-prog">⭐ 0</div>
        </div>

        <div class="g04-tabs">
          <button class="g04-tab active" id="g04-tab-compare">⚖️ أكتر/أقل</button>
          <button class="g04-tab" id="g04-tab-count">🎯 عدّ واختار</button>
          <button class="g04-tab" id="g04-tab-add">➕ اجمع</button>
        </div>

        <div class="g04-stage" id="g04-stage">
          <button class="g04-parent-btn" id="g04-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g04-q" id="g04-q"></div>

          <div class="g04-compare-row" id="g04-compare-row" style="display:none">
            <div class="g04-side" id="g04-left"></div>
            <div class="g04-vs">⚖️</div>
            <div class="g04-side" id="g04-right"></div>
          </div>

          <div class="g04-add-row" id="g04-add-row" style="display:none"></div>
          <div class="g04-hint-box" id="g04-hint"></div>
          <div class="g04-choices" id="g04-choices" style="display:none"></div>
          <div class="g04-feedback" id="g04-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g04-stage');
    const qEl = document.getElementById('g04-q');
    const compareRow = document.getElementById('g04-compare-row');
    const leftEl = document.getElementById('g04-left');
    const rightEl = document.getElementById('g04-right');
    const addRow = document.getElementById('g04-add-row');
    const hintBox = document.getElementById('g04-hint');
    const choicesEl = document.getElementById('g04-choices');
    const msgEl = document.getElementById('g04-msg');
    const progEl = document.getElementById('g04-prog');
    const unlockPill = document.getElementById('g04-unlock-pill');
    const tabCompare = document.getElementById('g04-tab-compare');
    const tabCount = document.getElementById('g04-tab-count');
    const tabAdd = document.getElementById('g04-tab-add');

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
      c.className = 'g04-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g04-confetti';
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
      t.className = 'g04-toast';
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

    async function countVisual(box, num, icon, startFrom) {
      box.innerHTML = '';
      const els = [];
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g04-side-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g04-item-badge">${(startFrom || 0) + i}</span>`;
        box.appendChild(el);
        els.push(el);
      }
      for (let i = 0; i < els.length; i++) {
        if (!isCounting) break;
        els[i].classList.add('counted');
        playCountTone((startFrom || 0) + i + 1);
        const nObj = SHARED.numbers[(startFrom || 0) + i];
        if (nObj) {
          try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {}
        }
        await sleep(360);
      }
    }

    function currentIcon() {
      return THEMES[currentThemeIdx].icon;
    }

    async function startCompare() {
      const icon = currentIcon();
      leftNum = 1 + Math.floor(Math.random() * unlockedMax);
      do {
        rightNum = 1 + Math.floor(Math.random() * unlockedMax);
      } while (rightNum === leftNum);

      qEl.innerHTML = `⚖️ مين فيهم أكتر؟<small>Qui a le plus ?</small>`;
      compareRow.style.display = 'flex';
      addRow.style.display = 'none';
      choicesEl.style.display = 'none';
      leftEl.className = 'g04-side';
      rightEl.className = 'g04-side';

      leftEl.innerHTML = '';
      for (let i = 1; i <= leftNum; i++) {
        const el = document.createElement('div');
        el.className = 'g04-side-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g04-item-badge">${i}</span>`;
        leftEl.appendChild(el);
      }
      rightEl.innerHTML = '';
      for (let i = 1; i <= rightNum; i++) {
        const el = document.createElement('div');
        el.className = 'g04-side-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g04-item-badge">${i}</span>`;
        rightEl.appendChild(el);
      }

      leftEl.onclick = () => onComparePick('left');
      rightEl.onclick = () => onComparePick('right');

      setTimeout(() => speakNumber(leftNum, 'both'), 300);
      await sleep(1000);
      if (locked) return;
      speakNumber(rightNum, 'both');
    }

    async function onComparePick(side) {
      if (locked) return;
      const winner = leftNum > rightNum ? 'left' : 'right';
      if (side === winner) {
        locked = true;
        (side === 'left' ? leftEl : rightEl).classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${Math.max(leftNum, rightNum)} أكبر من ${Math.min(leftNum, rightNum)}`;
        await speakPraise();
        await sleep(350);
        isCounting = true;
        await countVisual(leftEl, leftNum, currentIcon());
        isCounting = true;
        await countVisual(rightEl, rightNum, currentIcon());
        isCounting = false;
        await sleep(350);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else startRound();
      } else {
        wrongThisRound++;
        (side === 'left' ? leftEl : rightEl).classList.add('wrong');
        setTimeout(() => (side === 'left' ? leftEl : rightEl).classList.remove('wrong'), 500);
        stageEl.classList.add('g04-shake');
        setTimeout(() => stageEl.classList.remove('g04-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g04-hint');
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">عدّي معايا:</span> ${currentIcon().repeat(leftNum)} vs ${currentIcon().repeat(rightNum)}`;
          hintBox.classList.add('visible');
        }
      }
    }

    async function startCount() {
      const icon = currentIcon();
      leftNum = 1 + Math.floor(Math.random() * unlockedMax);
      do {
        rightNum = 1 + Math.floor(Math.random() * unlockedMax);
      } while (rightNum === leftNum);

      qEl.innerHTML = `🎯 عدّي واختاري الرقم الأكبر<small>Compte et choisis le plus grand</small>`;
      compareRow.style.display = 'flex';
      addRow.style.display = 'none';
      choicesEl.style.display = 'grid';
      leftEl.className = 'g04-side';
      rightEl.className = 'g04-side';
      leftEl.onclick = null;
      rightEl.onclick = null;

      leftEl.innerHTML = '';
      for (let i = 1; i <= leftNum; i++) {
        const el = document.createElement('div');
        el.className = 'g04-side-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g04-item-badge">${i}</span>`;
        leftEl.appendChild(el);
      }
      rightEl.innerHTML = '';
      for (let i = 1; i <= rightNum; i++) {
        const el = document.createElement('div');
        el.className = 'g04-side-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g04-item-badge">${i}</span>`;
        rightEl.appendChild(el);
      }

      targetAnswer = Math.max(leftNum, rightNum);
      let choices = [targetAnswer];
      while (choices.length < 3) {
        const c = 1 + Math.floor(Math.random() * Math.max(4, unlockedMax));
        if (!choices.includes(c)) choices.push(c);
      }
      currentChoices = shuffle(choices);
      choicesEl.innerHTML = '';
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g04-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onCountChoice(c, btn));
        choicesEl.appendChild(btn);
      });
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
        msgEl.textContent = `🎉 Bravo ! الأكبر هو ${targetAnswer}`;
        await speakPraise();
        await sleep(350);
        isCounting = true;
        await countVisual(leftEl, leftNum, currentIcon());
        isCounting = true;
        await countVisual(rightEl, rightNum, currentIcon());
        isCounting = false;
        await sleep(350);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else startRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g04-shake');
        setTimeout(() => stageEl.classList.remove('g04-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g04-hint');
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">عدّي معايا:</span> ${currentIcon().repeat(leftNum)} vs ${currentIcon().repeat(rightNum)}`;
          hintBox.classList.add('visible');
        }
      }
    }

    async function startAdd() {
      const icon = currentIcon();
      const maxPart = Math.min(unlockedMax, 5);
      const a = 1 + Math.floor(Math.random() * maxPart);
      const b = 1 + Math.floor(Math.random() * Math.max(1, Math.min(unlockedMax - a + 1, 5)));
      const sum = a + b;

      qEl.innerHTML = `➕ اجمعي واختاري الناتج<small>Combien ça fait ?</small>`;
      compareRow.style.display = 'none';
      addRow.style.display = 'flex';
      choicesEl.style.display = 'grid';

      addRow.innerHTML = '';
      const g1 = document.createElement('div');
      g1.className = 'g04-add-group';
      for (let i = 0; i < a; i++) {
        const el = document.createElement('div');
        el.className = 'g04-add-item';
        el.textContent = icon;
        g1.appendChild(el);
      }
      const op = document.createElement('div');
      op.className = 'g04-add-op';
      op.textContent = '+';
      const g2 = document.createElement('div');
      g2.className = 'g04-add-group';
      for (let i = 0; i < b; i++) {
        const el = document.createElement('div');
        el.className = 'g04-add-item';
        el.textContent = icon;
        g2.appendChild(el);
      }
      const eq = document.createElement('div');
      eq.className = 'g04-add-eq';
      eq.textContent = '=';
      const q = document.createElement('div');
      q.className = 'g04-add-q';
      q.textContent = '?';

      addRow.appendChild(g1);
      addRow.appendChild(op);
      addRow.appendChild(g2);
      addRow.appendChild(eq);
      addRow.appendChild(q);

      targetAnswer = sum;
      let choices = [sum];
      while (choices.length < 3) {
        const c = 2 + Math.floor(Math.random() * Math.max(sum + 2, 5));
        if (!choices.includes(c)) choices.push(c);
      }
      currentChoices = shuffle(choices);
      choicesEl.innerHTML = '';
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g04-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onAddChoice(c, btn));
        choicesEl.appendChild(btn);
      });
    }

    async function onAddChoice(num, btn) {
      if (locked) return;
      if (num === targetAnswer) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! الناتج ${targetAnswer}`;
        await speakPraise();
        await sleep(350);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else startRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g04-shake');
        setTimeout(() => stageEl.classList.remove('g04-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g04-hint');
          const q = addRow.querySelector('.g04-add-q');
          if (q) q.textContent = targetAnswer;
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g04-win';
      win.innerHTML = `
        <div class="g04-win-emoji">🏆</div>
        <div class="g04-win-title">أحسنتِ يا بطلة!</div>
        <div class="g04-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g04-win-btns">
          <button class="g04-win-btn g04-win-replay" id="g04-replay">🔄 العبي تاني</button>
          <button class="g04-win-btn g04-win-home" id="g04-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g04-replay').addEventListener('click', () => {
        win.remove();
        round = 0;
        stars = 0;
        successCount = 0;
        startRound();
      });
      document.getElementById('g04-home').addEventListener('click', () => {
        location.hash = '#/home';
      });
    }

    function startRound() {
      round++;
      locked = false;
      wrongThisRound = 0;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g04-hint', 'g04-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      if (mode === 'compare') startCompare();
      else if (mode === 'count') startCount();
      else startAdd();
    }

    function switchMode(newMode) {
      if (mode === newMode) return;
      mode = newMode;
      round = 0;
      stars = 0;
      successCount = 0;
      tabCompare.classList.toggle('active', mode === 'compare');
      tabCount.classList.toggle('active', mode === 'count');
      tabAdd.classList.toggle('active', mode === 'add');
      startRound();
    }

    tabCompare.addEventListener('click', () => switchMode('compare'));
    tabCount.addEventListener('click', () => switchMode('count'));
    tabAdd.addEventListener('click', () => switchMode('add'));

    document.getElementById('g04-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g04-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'compare' ? 'أكتر/أقل' : mode === 'count' ? 'عدّ واختار' : 'اجمع'}</strong></div>
        <button id="g04-parent-unlock-all">🔓 فتح كل الأرقام (للوالد)</button>
        <button id="g04-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g04-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        confetti();
        toast('🎉 كل الأرقام اتفتحت!');
        panel.remove();
      });
      document.getElementById('g04-parent-close').addEventListener('click', () => panel.remove());
    });

    startRound();
  }
};
