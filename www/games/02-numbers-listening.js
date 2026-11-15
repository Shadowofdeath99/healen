window.Game_02 = {
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
    const STORAGE_KEY = 'helen_g02_unlocked';

    let mode = 'listen'; // listen | see | match
    let currentThemeIdx = 0;
    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;

    let targetNum = 0;
    let currentChoices = [];
    let isCounting = false;

    container.innerHTML = `
      <style>
        .g02-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g02-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(99, 102, 241, 0.35); position: relative; overflow: hidden; }
        .g02-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g02-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.4px; }
        .g02-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g02-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; backdrop-filter: blur(4px); }

        .g02-tabs { display: flex; gap: 8px; justify-content: center; }
        .g02-tab { flex: 1; max-width: 220px; padding: 12px 8px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.9rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g02-tab.active { background: linear-gradient(180deg,#8b5cf6,#7c3aed); color: #fff; box-shadow: 0 5px 0 #5b21b6; }

        .g02-stage { background: #fff; border: 3px solid #ddd6fe; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g02-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g02-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g02-stage.g02-shake { animation: g02-shk .4s; }
        @keyframes g02-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g02-stage.g02-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }

        .g02-q { font-size: 1.05rem; font-weight: 900; color: #7c3aed; margin-bottom: 12px; min-height: 26px; }
        .g02-q small { display: block; font-size: 0.78rem; color: #a78bfa; font-weight: 700; margin-top: 2px; }

        .g02-speaker-card { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 22px; padding: 16px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 14px; box-shadow: 0 10px 24px rgba(99,102,241,.3); }
        .g02-speaker { width: 90px; height: 90px; border-radius: 50%; background: #fff; color: #4f46e5; border: none; font-size: 2.6rem; cursor: pointer; box-shadow: 0 6px 0 #c7d2fe; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
        .g02-speaker:active { transform: scale(0.92); }
        .g02-speaker.playing { animation: g02Pulse 0.6s infinite alternate; }
        @keyframes g02Pulse { from { transform: scale(1); } to { transform: scale(1.12); box-shadow: 0 0 0 14px rgba(255,255,255,0.25); } }
        .g02-sub-btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .g02-mini-btn { background: rgba(255,255,255,0.22); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 999px; padding: 7px 14px; font-size: 0.9rem; font-weight: 800; cursor: pointer; }
        .g02-mini-btn:active { transform: scale(0.95); }

        .g02-visual-box { min-height: 120px; background: linear-gradient(180deg, #f5f3ff, #ede9fe); border-radius: 20px; padding: 14px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; border: 2px dashed #c4b5fd; margin-bottom: 12px; }
        .g02-visual-item { font-size: 2.5rem; cursor: pointer; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 16px; background: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.08); animation: g02-itemIn .3s backwards; }
        @keyframes g02-itemIn { from { transform: scale(0) rotate(-30deg); } to { transform: scale(1) rotate(0); } }
        .g02-visual-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.2) translateY(-5px); box-shadow: 0 10px 20px rgba(234, 179, 8, 0.5); }
        .g02-item-badge { position: absolute; top: -7px; right: -7px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.75rem; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(225,29,72,.4); }
        .g02-visual-item.counted .g02-item-badge { opacity: 1; transform: scale(1); }

        .g02-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; font-size: 1.4rem; margin-bottom: 12px; }
        .g02-hint-box.visible { display: flex; }

        .g02-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g02-choice { background: #fff; border: 4px solid #e9d5ff; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #6b21a8; cursor: pointer; box-shadow: 0 6px 0 #d8b4fe; transition: all 0.15s ease; }
        .g02-choice:hover { transform: translateY(-2px); }
        .g02-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #d8b4fe; }
        .g02-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g02-correctPop .5s; }
        .g02-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g02-shk .4s; }
        @keyframes g02-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }

        .g02-choices.visual { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g02-choice-visual { background: #fff; border: 4px solid #e9d5ff; border-radius: 20px; padding: 14px 6px; cursor: pointer; box-shadow: 0 6px 0 #d8b4fe; transition: all 0.15s ease; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; min-height: 100px; }
        .g02-choice-visual:active { transform: translateY(2px); box-shadow: 0 3px 0 #d8b4fe; }
        .g02-choice-visual.correct { background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g02-correctPop .5s; }
        .g02-choice-visual.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g02-shk .4s; }
        .g02-choice-visual span { font-size: 1.8rem; }

        .g02-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #4f46e5; }

        .g02-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g02-pop .4s; padding: 20px; }
        .g02-win-emoji { font-size: 4.8rem; animation: g02-bounce 1s infinite; }
        @keyframes g02-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g02-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#ec4899,#a855f7,#3b82f6); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g02-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g02-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g02-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g02-win-btn:active { transform: scale(0.95); }
        .g02-win-replay { background: linear-gradient(180deg,#a78bfa,#8b5cf6); color: #fff; box-shadow: 0 5px 0 #6d28d9; }
        .g02-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }

        .g02-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g02-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g02-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g02-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g02-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }

        .g02-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g02-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g02-fall 1.6s linear forwards; }
        @keyframes g02-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

        .g02-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g02-toast.show { transform: translateX(-50%) translateY(0); }
      </style>

      <div class="g02-wrap">
        <div class="g02-header">
          <div>
            <div class="g02-title">👂 Écoute et Choisis • اسمع واختار</div>
            <div class="g02-unlock-pill" id="g02-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g02-progress" id="g02-prog">⭐ 0</div>
        </div>

        <div class="g02-tabs">
          <button class="g02-tab active" id="g02-tab-listen">🎧 اسمع</button>
          <button class="g02-tab" id="g02-tab-see">🎨 شوف</button>
          <button class="g02-tab" id="g02-tab-match">🔗 اربط</button>
        </div>

        <div class="g02-stage" id="g02-stage">
          <button class="g02-parent-btn" id="g02-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g02-q" id="g02-q"></div>

          <div class="g02-speaker-card" id="g02-speaker-card">
            <button class="g02-speaker" id="g02-speaker">🔊</button>
            <div class="g02-sub-btns">
              <button class="g02-mini-btn" id="g02-play-fr">🇫🇷 فرنساوي</button>
              <button class="g02-mini-btn" id="g02-play-eg">🇪🇬 مصري</button>
            </div>
          </div>

          <div class="g02-visual-box" id="g02-visual" style="display:none"></div>
          <div class="g02-hint-box" id="g02-hint"></div>
          <div class="g02-choices" id="g02-choices"></div>
          <div class="g02-choices visual" id="g02-choices-visual" style="display:none"></div>
          <div class="g02-feedback" id="g02-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g02-stage');
    const qEl = document.getElementById('g02-q');
    const speakerCard = document.getElementById('g02-speaker-card');
    const speakerBtn = document.getElementById('g02-speaker');
    const visualBox = document.getElementById('g02-visual');
    const hintBox = document.getElementById('g02-hint');
    const choicesEl = document.getElementById('g02-choices');
    const choicesVisual = document.getElementById('g02-choices-visual');
    const msgEl = document.getElementById('g02-msg');
    const progEl = document.getElementById('g02-prog');
    const unlockPill = document.getElementById('g02-unlock-pill');
    const tabListen = document.getElementById('g02-tab-listen');
    const tabSee = document.getElementById('g02-tab-see');
    const tabMatch = document.getElementById('g02-tab-match');

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
          await sleep(450);
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
      c.className = 'g02-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g02-confetti';
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
      t.className = 'g02-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2200);
    }

    async function countVisual(num) {
      visualBox.innerHTML = '';
      visualBox.style.display = 'flex';
      const icon = THEMES[currentThemeIdx].icon;
      const els = [];
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g02-visual-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g02-item-badge">${i}</span>`;
        visualBox.appendChild(el);
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

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g02-hint', 'g02-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      choicesEl.innerHTML = '';
      choicesVisual.innerHTML = '';
      visualBox.innerHTML = '';
      visualBox.style.display = 'none';

      targetNum = 1 + Math.floor(Math.random() * unlockedMax);

      if (mode === 'listen') {
        qEl.innerHTML = `🎧 اسمعي الرقم واختاري<small>Écoute et choisis le nombre</small>`;
        speakerCard.style.display = 'flex';
        choicesEl.style.display = 'grid';
        choicesVisual.style.display = 'none';
        buildNumericChoices();
        setTimeout(() => speakNumber(targetNum, 'both'), 350);
      } else if (mode === 'see') {
        qEl.innerHTML = `🎨 شوفي العناصر واختاري الرقم<small>Compte et choisis</small>`;
        speakerCard.style.display = 'none';
        choicesEl.style.display = 'grid';
        choicesVisual.style.display = 'none';
        visualBox.style.display = 'flex';
        renderVisualItems(targetNum);
        buildNumericChoices();
      } else {
        qEl.innerHTML = `🔗 اسمعي الرقم واختاري المجموعة الصح<small>Écoute et choisis le bon groupe</small>`;
        speakerCard.style.display = 'flex';
        choicesEl.style.display = 'none';
        choicesVisual.style.display = 'grid';
        buildVisualChoices();
        setTimeout(() => speakNumber(targetNum, 'both'), 350);
      }
    }

    function renderVisualItems(num) {
      visualBox.innerHTML = '';
      const icon = THEMES[currentThemeIdx].icon;
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g02-visual-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${icon}<span class="g02-item-badge">${i}</span>`;
        el.addEventListener('click', async () => {
          if (isCounting) return;
          el.classList.add('counted');
          playCountTone(i);
          const nObj = SHARED.numbers[i - 1];
          if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
        });
        visualBox.appendChild(el);
      }
    }

    function buildNumericChoices() {
      let choices = [targetNum];
      const count = targetNum <= 3 ? 3 : 4;
      while (choices.length < count) {
        const c = 1 + Math.floor(Math.random() * Math.max(4, unlockedMax));
        if (!choices.includes(c)) choices.push(c);
      }
      currentChoices = shuffle(choices);
      choicesEl.style.gridTemplateColumns = currentChoices.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
      choicesEl.innerHTML = '';
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g02-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onChoice(c, btn));
        choicesEl.appendChild(btn);
      });
    }

    function buildVisualChoices() {
      let choices = [targetNum];
      while (choices.length < 3) {
        const c = 1 + Math.floor(Math.random() * unlockedMax);
        if (!choices.includes(c)) choices.push(c);
      }
      currentChoices = shuffle(choices);
      choicesVisual.innerHTML = '';
      const icon = THEMES[currentThemeIdx].icon;
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g02-choice-visual';
        btn.dataset.num = c;
        let html = '';
        for (let i = 0; i < c; i++) html += `<span>${icon}</span>`;
        btn.innerHTML = html;
        btn.addEventListener('click', () => onChoice(c, btn));
        choicesVisual.appendChild(btn);
      });
    }

    async function onChoice(num, btn) {
      if (locked) return;
      if (num === targetNum) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        const nObj = SHARED.numbers[targetNum - 1];
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${nObj.fr} (${nObj.eg})`;
        await speakPraise();
        await sleep(350);
        await countVisual(targetNum);
        await sleep(350);
        tryUnlock();
        await sleep(350);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        msgEl.style.color = '#dc2626';
        const nObj = SHARED.numbers[num - 1];
        msgEl.textContent = `ده رقم ${nObj.fr} (${nObj.eg}).. جربي تاني!`;
        await speakNumber(num, 'both');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g02-shake');
        setTimeout(() => stageEl.classList.remove('g02-shake'), 400);
        playErrorTone();
        await speakEncourage();

        if (wrongThisRound >= 2) {
          stageEl.classList.add('g02-hint');
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">عدّي معايا:</span> ${THEMES[currentThemeIdx].icon.repeat(targetNum)}`;
          hintBox.classList.add('visible');
        }
      }
    }

    speakerBtn.addEventListener('click', async () => {
      speakerBtn.classList.add('playing');
      await speakNumber(targetNum, 'both');
      speakerBtn.classList.remove('playing');
    });
    document.getElementById('g02-play-fr').addEventListener('click', () => speakNumber(targetNum, 'fr'));
    document.getElementById('g02-play-eg').addEventListener('click', () => speakNumber(targetNum, 'eg'));

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g02-win';
      win.innerHTML = `
        <div class="g02-win-emoji">🏆</div>
        <div class="g02-win-title">أحسنتِ يا بطلة!</div>
        <div class="g02-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g02-win-btns">
          <button class="g02-win-btn g02-win-replay" id="g02-replay">🔄 العبي تاني</button>
          <button class="g02-win-btn g02-win-home" id="g02-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g02-replay').addEventListener('click', () => {
        win.remove();
        round = 0;
        stars = 0;
        successCount = 0;
        newRound();
      });
      document.getElementById('g02-home').addEventListener('click', () => {
        location.hash = '#/home';
      });
    }

    function switchMode(newMode) {
      if (mode === newMode) return;
      mode = newMode;
      round = 0;
      stars = 0;
      locked = false;
      isCounting = false;
      stageEl.classList.remove('g02-hint', 'g02-shake');
      hintBox.classList.remove('visible');
      msgEl.textContent = '';
      tabListen.classList.toggle('active', mode === 'listen');
      tabSee.classList.toggle('active', mode === 'see');
      tabMatch.classList.toggle('active', mode === 'match');
      newRound();
    }

    tabListen.addEventListener('click', () => switchMode('listen'));
    tabSee.addEventListener('click', () => switchMode('see'));
    tabMatch.addEventListener('click', () => switchMode('match'));

    document.getElementById('g02-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g02-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'listen' ? 'اسمع' : mode === 'see' ? 'شوف' : 'اربط'}</strong></div>
        <button id="g02-parent-unlock-all">🔓 فتح كل الأرقام (للوالد)</button>
        <button id="g02-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g02-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        confetti();
        toast('🎉 كل الأرقام اتفتحت!');
        panel.remove();
      });
      document.getElementById('g02-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
