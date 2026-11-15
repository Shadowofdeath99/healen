window.Game_03 = {
  async mount(container) {
    const MAX_NUM = 10;
    const TOTAL_ROUNDS = 5;
    const UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g03_unlocked';

    let mode = 'count'; // count | hear | match
    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;

    let targetNum = 0;
    let currentAnimal = null;
    let currentChoices = [];
    let isCounting = false;

    container.innerHTML = `
      <style>
        .g03-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g03-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(16, 185, 129, 0.35); position: relative; overflow: hidden; }
        .g03-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g03-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.4px; }
        .g03-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g03-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; backdrop-filter: blur(4px); }

        .g03-tabs { display: flex; gap: 8px; justify-content: center; }
        .g03-tab { flex: 1; max-width: 220px; padding: 12px 8px; border-radius: 16px; border: none; font-weight: 900; font-size: 0.85rem; cursor: pointer; background: #f1f5f9; color: #475569; transition: all .2s; }
        .g03-tab.active { background: linear-gradient(180deg,#10b981,#059669); color: #fff; box-shadow: 0 5px 0 #065f46; }

        .g03-stage { background: #fff; border: 3px solid #a7f3d0; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g03-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g03-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g03-stage.g03-shake { animation: g03-shk .4s; }
        @keyframes g03-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g03-stage.g03-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }

        .g03-q { font-size: 1.05rem; font-weight: 900; color: #047857; margin-bottom: 12px; min-height: 26px; }
        .g03-q small { display: block; font-size: 0.78rem; color: #34d399; font-weight: 700; margin-top: 2px; }

        .g03-speaker-card { background: linear-gradient(135deg, #10b981, #059669); border-radius: 22px; padding: 16px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 14px; box-shadow: 0 10px 24px rgba(16,185,129,.3); }
        .g03-speaker { width: 90px; height: 90px; border-radius: 50%; background: #fff; color: #059669; border: none; font-size: 2.6rem; cursor: pointer; box-shadow: 0 6px 0 #a7f3d0; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
        .g03-speaker:active { transform: scale(0.92); }
        .g03-speaker.playing { animation: g03Pulse 0.6s infinite alternate; }
        @keyframes g03Pulse { from { transform: scale(1); } to { transform: scale(1.12); box-shadow: 0 0 0 14px rgba(255,255,255,0.25); } }
        .g03-sub-btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .g03-mini-btn { background: rgba(255,255,255,0.22); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 999px; padding: 7px 14px; font-size: 0.9rem; font-weight: 800; cursor: pointer; }
        .g03-mini-btn:active { transform: scale(0.95); }

        .g03-animal-box { min-height: 130px; background: linear-gradient(180deg, #f0fdf4, #dcfce7); border-radius: 20px; padding: 14px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; border: 2px dashed #86efac; margin-bottom: 12px; }
        .g03-animal-item { font-size: 2.8rem; cursor: pointer; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; position: relative; display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 16px; background: #fff; box-shadow: 0 3px 10px rgba(0,0,0,0.08); animation: g03-itemIn .3s backwards; }
        @keyframes g03-itemIn { from { transform: scale(0) rotate(-30deg); } to { transform: scale(1) rotate(0); } }
        .g03-animal-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.2) translateY(-5px); box-shadow: 0 10px 20px rgba(234, 179, 8, 0.5); }
        .g03-item-badge { position: absolute; top: -7px; right: -7px; background: linear-gradient(180deg,#f43f5e,#e11d48); color: #fff; font-size: 0.75rem; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0); transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(225,29,72,.4); }
        .g03-animal-item.counted .g03-item-badge { opacity: 1; transform: scale(1); }

        .g03-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; font-size: 1.4rem; margin-bottom: 12px; }
        .g03-hint-box.visible { display: flex; }

        .g03-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g03-choice { background: #fff; border: 4px solid #a7f3d0; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #047857; cursor: pointer; box-shadow: 0 6px 0 #6ee7b7; transition: all 0.15s ease; }
        .g03-choice:hover { transform: translateY(-2px); }
        .g03-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #6ee7b7; }
        .g03-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g03-correctPop .5s; }
        .g03-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g03-shk .4s; }
        @keyframes g03-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }

        .g03-choices-animal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g03-choice-animal { background: #fff; border: 4px solid #a7f3d0; border-radius: 20px; padding: 20px 0; font-size: 3rem; cursor: pointer; box-shadow: 0 6px 0 #6ee7b7; transition: all 0.15s ease; }
        .g03-choice-animal:active { transform: translateY(2px); box-shadow: 0 3px 0 #6ee7b7; }
        .g03-choice-animal.correct { background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g03-correctPop .5s; }
        .g03-choice-animal.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g03-shk .4s; }

        .g03-choices-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g03-choice-group { background: #fff; border: 4px solid #a7f3d0; border-radius: 20px; padding: 10px 6px; cursor: pointer; box-shadow: 0 6px 0 #6ee7b7; transition: all 0.15s ease; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 3px; min-height: 100px; }
        .g03-choice-group:active { transform: translateY(2px); box-shadow: 0 3px 0 #6ee7b7; }
        .g03-choice-group.correct { background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g03-correctPop .5s; }
        .g03-choice-group.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g03-shk .4s; }
        .g03-choice-group span { font-size: 1.7rem; }

        .g03-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #059669; }

        .g03-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g03-pop .4s; padding: 20px; }
        .g03-win-emoji { font-size: 4.8rem; animation: g03-bounce 1s infinite; }
        @keyframes g03-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g03-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#10b981,#0d9488,#3b82f6); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g03-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g03-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g03-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g03-win-btn:active { transform: scale(0.95); }
        .g03-win-replay { background: linear-gradient(180deg,#34d399,#10b981); color: #fff; box-shadow: 0 5px 0 #047857; }
        .g03-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }

        .g03-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g03-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g03-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g03-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g03-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }

        .g03-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g03-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g03-fall 1.6s linear forwards; }
        @keyframes g03-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

        .g03-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g03-toast.show { transform: translateX(-50%) translateY(0); }
      </style>

      <div class="g03-wrap">
        <div class="g03-header">
          <div>
            <div class="g03-title">🐣 Compte les Animaux • عدّ الحيوانات</div>
            <div class="g03-unlock-pill" id="g03-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g03-progress" id="g03-prog">⭐ 0</div>
        </div>

        <div class="g03-tabs">
          <button class="g03-tab active" id="g03-tab-count">🐣 عدّ</button>
          <button class="g03-tab" id="g03-tab-hear">🎧 اسمع</button>
          <button class="g03-tab" id="g03-tab-match">🔗 اربط</button>
        </div>

        <div class="g03-stage" id="g03-stage">
          <button class="g03-parent-btn" id="g03-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g03-q" id="g03-q"></div>

          <div class="g03-speaker-card" id="g03-speaker-card" style="display:none">
            <button class="g03-speaker" id="g03-speaker">🔊</button>
            <div class="g03-sub-btns">
              <button class="g03-mini-btn" id="g03-play-fr">🇫🇷 فرنساوي</button>
              <button class="g03-mini-btn" id="g03-play-eg">🇪🇬 مصري</button>
            </div>
          </div>

          <div class="g03-animal-box" id="g03-animal-box" style="display:none"></div>
          <div class="g03-hint-box" id="g03-hint"></div>
          <div class="g03-choices" id="g03-choices" style="display:none"></div>
          <div class="g03-choices-animal" id="g03-choices-animal" style="display:none"></div>
          <div class="g03-choices-group" id="g03-choices-group" style="display:none"></div>
          <div class="g03-feedback" id="g03-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g03-stage');
    const qEl = document.getElementById('g03-q');
    const speakerCard = document.getElementById('g03-speaker-card');
    const speakerBtn = document.getElementById('g03-speaker');
    const animalBox = document.getElementById('g03-animal-box');
    const hintBox = document.getElementById('g03-hint');
    const choicesEl = document.getElementById('g03-choices');
    const choicesAnimal = document.getElementById('g03-choices-animal');
    const choicesGroup = document.getElementById('g03-choices-group');
    const msgEl = document.getElementById('g03-msg');
    const progEl = document.getElementById('g03-prog');
    const unlockPill = document.getElementById('g03-unlock-pill');
    const tabCount = document.getElementById('g03-tab-count');
    const tabHear = document.getElementById('g03-tab-hear');
    const tabMatch = document.getElementById('g03-tab-match');

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

    async function speakAnimal(animal, lang) {
      if (!animal) return;
      try {
        if (lang === 'fr') await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
        else {
          await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
          await sleep(450);
          await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' });
        }
      } catch (e) {}
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
      c.className = 'g03-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g03-confetti';
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
      t.className = 'g03-toast';
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

    async function countAnimalsVisual(num, animal) {
      animalBox.innerHTML = '';
      animalBox.style.display = 'flex';
      const els = [];
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g03-animal-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${animal.emoji}<span class="g03-item-badge">${i}</span>`;
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

    function renderAnimals(num, animal) {
      animalBox.innerHTML = '';
      animalBox.style.display = 'flex';
      for (let i = 1; i <= num; i++) {
        const el = document.createElement('div');
        el.className = 'g03-animal-item';
        el.style.animationDelay = (i * 50) + 'ms';
        el.innerHTML = `${animal.emoji}<span class="g03-item-badge">${i}</span>`;
        el.addEventListener('click', async () => {
          if (isCounting) return;
          el.classList.add('counted');
          playCountTone(i);
          const nObj = SHARED.numbers[i - 1];
          if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
        });
        animalBox.appendChild(el);
      }
    }

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g03-hint', 'g03-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      choicesEl.innerHTML = '';
      choicesAnimal.innerHTML = '';
      choicesGroup.innerHTML = '';
      animalBox.innerHTML = '';
      animalBox.style.display = 'none';
      choicesEl.style.display = 'none';
      choicesAnimal.style.display = 'none';
      choicesGroup.style.display = 'none';
      speakerCard.style.display = 'none';

      if (mode === 'count') {
        targetNum = 1 + Math.floor(Math.random() * unlockedMax);
        currentAnimal = SHARED.animals[Math.floor(Math.random() * SHARED.animals.length)];
        qEl.innerHTML = `🐣 عدّي ${currentAnimal.eg} واختاري الرقم<small>Compte les ${currentAnimal.fr.toLowerCase()}s</small>`;
        animalBox.style.display = 'flex';
        renderAnimals(targetNum, currentAnimal);
        buildNumericChoices();
        setTimeout(() => speakAnimal(currentAnimal, 'both'), 350);

      } else if (mode === 'hear') {
        const pool = shuffle(SHARED.animals).slice(0, 3);
        currentAnimal = pool[0];
        targetNum = 0;
        qEl.innerHTML = `🎧 اسمعي اسم الحيوان واختاري<small>Écoute et choisis l'animal</small>`;
        speakerCard.style.display = 'flex';
        choicesAnimal.style.display = 'grid';
        currentChoices = pool;
        pool.forEach(a => {
          const btn = document.createElement('button');
          btn.className = 'g03-choice-animal';
          btn.textContent = a.emoji;
          btn.dataset.egId = a.egId;
          btn.addEventListener('click', () => onAnimalChoice(a, btn));
          choicesAnimal.appendChild(btn);
        });
        setTimeout(() => speakAnimal(currentAnimal, 'both'), 350);

      } else {
        targetNum = 1 + Math.floor(Math.random() * unlockedMax);
        const animalsPool = shuffle(SHARED.animals).slice(0, 3);
        currentAnimal = animalsPool[0];
        qEl.innerHTML = `🔗 اسمعي واختاري المجموعة الصح<small>Écoute et choisis le bon groupe</small>`;
        speakerCard.style.display = 'flex';
        choicesGroup.style.display = 'grid';
        const opts = [{ animal: currentAnimal, num: targetNum }];
        const others = animalsPool.slice(1);
        while (opts.length < 3) {
          const a = others[opts.length - 1] || SHARED.animals[Math.floor(Math.random() * SHARED.animals.length)];
          const n = 1 + Math.floor(Math.random() * unlockedMax);
          if (opts.find(o => o.animal.egId === a.egId)) continue;
          opts.push({ animal: a, num: n });
        }
        currentChoices = shuffle(opts);
        currentChoices.forEach(o => {
          const btn = document.createElement('button');
          btn.className = 'g03-choice-group';
          btn.dataset.egId = o.animal.egId;
          btn.dataset.num = o.num;
          let html = '';
          for (let i = 0; i < o.num; i++) html += `<span>${o.animal.emoji}</span>`;
          btn.innerHTML = html;
          btn.addEventListener('click', () => onGroupChoice(o, btn));
          choicesGroup.appendChild(btn);
        });
        setTimeout(async () => {
          await speakNumber(targetNum, 'both');
          await sleep(400);
          await speakAnimal(currentAnimal, 'both');
        }, 350);
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
      choicesEl.style.display = 'grid';
      currentChoices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g03-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onCountChoice(c, btn));
        choicesEl.appendChild(btn);
      });
    }

    async function onCountChoice(num, btn) {
      if (locked) return;
      if (num === targetNum) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${currentAnimal.fr} (${currentAnimal.eg})`;
        await speakPraise();
        await sleep(350);
        await countAnimalsVisual(targetNum, currentAnimal);
        await sleep(350);
        tryUnlock();
        await sleep(350);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        msgEl.style.color = '#dc2626';
        msgEl.textContent = `ده رقم ${num}.. جربي تاني!`;
        await speakNumber(num, 'both');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g03-shake');
        setTimeout(() => stageEl.classList.remove('g03-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g03-hint');
          hintBox.innerHTML = `<span style="font-size:0.9rem;font-weight:800;color:#854d0e;">عدّي معايا:</span> ${currentAnimal.emoji.repeat(targetNum)}`;
          hintBox.classList.add('visible');
        }
      }
    }

    async function onAnimalChoice(animal, btn) {
      if (locked) return;
      if (animal.egId === currentAnimal.egId) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${animal.fr} (${animal.eg})`;
        await speakPraise();
        await sleep(600);
        tryUnlock();
        await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        msgEl.style.color = '#dc2626';
        msgEl.textContent = `ده ${animal.fr} (${animal.eg}).. جربي تاني!`;
        await speakAnimal(animal, 'both');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g03-shake');
        setTimeout(() => stageEl.classList.remove('g03-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g03-hint');
          const correctBtn = choicesAnimal.querySelector(`[data-eg-id="${currentAnimal.egId}"]`);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #6ee7b7';
        }
      }
    }

    async function onGroupChoice(opt, btn) {
      if (locked) return;
      if (opt.animal.egId === currentAnimal.egId && opt.num === targetNum) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${targetNum} × ${currentAnimal.fr} (${currentAnimal.eg})`;
        await speakPraise();
        await sleep(350);
        await countAnimalsVisual(targetNum, currentAnimal);
        await sleep(350);
        tryUnlock();
        await sleep(350);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        msgEl.style.color = '#dc2626';
        msgEl.textContent = `جربي تاني!`;
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g03-shake');
        setTimeout(() => stageEl.classList.remove('g03-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g03-hint');
          const correctBtn = choicesGroup.querySelector(`[data-eg-id="${currentAnimal.egId}"][data-num="${targetNum}"]`);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #6ee7b7';
        }
      }
    }

    speakerBtn.addEventListener('click', async () => {
      speakerBtn.classList.add('playing');
      if (mode === 'match') {
        await speakNumber(targetNum, 'both');
        await sleep(400);
        await speakAnimal(currentAnimal, 'both');
      } else {
        await speakAnimal(currentAnimal, 'both');
      }
      speakerBtn.classList.remove('playing');
    });
    document.getElementById('g03-play-fr').addEventListener('click', () => {
      if (mode === 'match') speakNumber(targetNum, 'fr').then(() => sleep(300)).then(() => speakAnimal(currentAnimal, 'fr'));
      else speakAnimal(currentAnimal, 'fr');
    });
    document.getElementById('g03-play-eg').addEventListener('click', () => {
      if (mode === 'match') speakNumber(targetNum, 'eg').then(() => sleep(300)).then(() => speakAnimal(currentAnimal, 'eg'));
      else speakAnimal(currentAnimal, 'eg');
    });

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g03-win';
      win.innerHTML = `
        <div class="g03-win-emoji">🏆</div>
        <div class="g03-win-title">أحسنتِ يا بطلة!</div>
        <div class="g03-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g03-win-btns">
          <button class="g03-win-btn g03-win-replay" id="g03-replay">🔄 العبي تاني</button>
          <button class="g03-win-btn g03-win-home" id="g03-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g03-replay').addEventListener('click', () => {
        win.remove();
        round = 0;
        stars = 0;
        successCount = 0;
        newRound();
      });
      document.getElementById('g03-home').addEventListener('click', () => {
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
      stageEl.classList.remove('g03-hint', 'g03-shake');
      hintBox.classList.remove('visible');
      msgEl.textContent = '';
      tabCount.classList.toggle('active', mode === 'count');
      tabHear.classList.toggle('active', mode === 'hear');
      tabMatch.classList.toggle('active', mode === 'match');
      newRound();
    }

    tabCount.addEventListener('click', () => switchMode('count'));
    tabHear.addEventListener('click', () => switchMode('hear'));
    tabMatch.addEventListener('click', () => switchMode('match'));

    document.getElementById('g03-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g03-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <div class="row"><span>النمط الحالي</span><strong>${mode === 'count' ? 'عدّ' : mode === 'hear' ? 'اسمع' : 'اربط'}</strong></div>
        <button id="g03-parent-unlock-all">🔓 فتح كل الأرقام (للوالد)</button>
        <button id="g03-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g03-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM;
        saveUnlocked();
        updateProgress();
        playUnlockTone();
        confetti();
        toast('🎉 كل الأرقام اتفتحت!');
        panel.remove();
      });
      document.getElementById('g03-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
