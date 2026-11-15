window.Game_09 = {
  async mount(container) {
    const MAX_NUM = 8;
    const TOTAL_ROUNDS = 5;
    const UNLOCK_EVERY = 2;
    const PAIRS_PER_ROUND = 3;
    const STORAGE_KEY = 'helen_g09_unlocked';

    let unlockedMax = Math.min(MAX_NUM, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0;
    let round = 0;
    let stars = 0;
    let locked = false;
    let selectedNum = null;
    let matched = 0;
    let wrongThisRound = 0;
    let currentPicks = [];

    const THEMES = [
      { icon: '🍭', name: 'حلاوة' }, { icon: '⭐', name: 'نجوم' },
      { icon: '🍎', name: 'تفاح' }, { icon: '🐱', name: 'قطط' },
      { icon: '🎈', name: 'بالونات' }, { icon: '🍓', name: 'فراولة' }
    ];
    let currentThemeIdx = 0;

    container.innerHTML = `
      <style>
        .g09-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g09-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(20, 184, 166, 0.35); position: relative; overflow: hidden; }
        .g09-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g09-title { font-size: 1.15rem; font-weight: 900; }
        .g09-unlock-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g09-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g09-stage { background: #fff; border: 3px solid #99f6e4; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 400px; animation: g09-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g09-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g09-q { font-size: 1.05rem; font-weight: 900; color: #0f766e; margin-bottom: 12px; }
        .g09-q small { display: block; font-size: 0.78rem; color: #2dd4bf; font-weight: 700; margin-top: 2px; }
        .g09-section-title { font-size: 0.9rem; font-weight: 800; color: #64748b; margin: 10px 0 6px; }
        .g09-nums { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 12px; }
        .g09-num-btn { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(180deg,#14b8a6,#0d9488); color: #fff; border: none; font-size: 1.8rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0f766e; transition: all .15s; }
        .g09-num-btn:active { transform: translateY(2px); box-shadow: 0 3px 0 #0f766e; }
        .g09-num-btn.selected { box-shadow: 0 0 0 5px #fde68a, 0 5px 0 #0f766e; transform: scale(1.08); }
        .g09-num-btn.matched { opacity: 0.35; pointer-events: none; background: linear-gradient(180deg,#22c55e,#16a34a); box-shadow: 0 5px 0 #15803d; }
        .g09-groups { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .g09-group-btn { min-width: 90px; min-height: 70px; padding: 8px; border-radius: 16px; background: #fff; border: 4px solid #99f6e4; cursor: pointer; box-shadow: 0 5px 0 #5eead4; transition: all .15s; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 3px; }
        .g09-group-btn:active { transform: translateY(2px); box-shadow: 0 3px 0 #5eead4; }
        .g09-group-btn.matched { opacity: 0.5; pointer-events: none; background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #22c55e; box-shadow: 0 5px 0 #16a34a; }
        .g09-group-btn.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color: #ef4444; animation: g09-shake .4s; }
        @keyframes g09-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .g09-group-btn span { font-size: 1.8rem; }
        .g09-feedback { font-size: 1.05rem; font-weight: 900; min-height: 28px; margin-top: 12px; color: #0d9488; }
        .g09-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g09-pop .4s; padding: 20px; }
        .g09-win-emoji { font-size: 4.8rem; animation: g09-bounce 1s infinite; }
        @keyframes g09-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g09-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#14b8a6,#0f766e); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g09-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g09-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g09-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g09-win-btn:active { transform: scale(0.95); }
        .g09-win-replay { background: linear-gradient(180deg,#2dd4bf,#14b8a6); color: #fff; box-shadow: 0 5px 0 #0f766e; }
        .g09-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g09-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g09-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g09-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g09-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g09-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g09-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g09-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g09-fall 1.6s linear forwards; }
        @keyframes g09-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .g09-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; padding: 14px 24px; border-radius: 16px; font-weight: 900; font-size: 1.05rem; box-shadow: 0 10px 30px rgba(34,197,94,0.4); z-index: 10000; transition: transform .4s cubic-bezier(.34,1.56,.64,1); pointer-events: none; }
        .g09-toast.show { transform: translateX(-50%) translateY(0); }
      </style>
      <div class="g09-wrap">
        <div class="g09-header">
          <div>
            <div class="g09-title">🔗 Match • طابق</div>
            <div class="g09-unlock-pill" id="g09-unlock-pill">🔓 1-3 مفتوحة</div>
          </div>
          <div class="g09-progress" id="g09-prog">⭐ 0</div>
        </div>
        <div class="g09-stage" id="g09-stage">
          <button class="g09-parent-btn" id="g09-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g09-q">🔗 طابقي الرقم مع الكمية<small>Relie le nombre à la quantité</small></div>
          <div class="g09-section-title">🔢 الأرقام</div>
          <div class="g09-nums" id="g09-nums"></div>
          <div class="g09-section-title">🎨 الكميات</div>
          <div class="g09-groups" id="g09-groups"></div>
          <div class="g09-feedback" id="g09-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g09-stage');
    const numsEl = document.getElementById('g09-nums');
    const groupsEl = document.getElementById('g09-groups');
    const msgEl = document.getElementById('g09-msg');
    const progEl = document.getElementById('g09-prog');
    const unlockPill = document.getElementById('g09-unlock-pill');

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

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g09-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g09-confetti';
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
      t.className = 'g09-toast';
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

    function newRound() {
      round++;
      locked = false;
      selectedNum = null;
      matched = 0;
      wrongThisRound = 0;
      updateProgress();
      msgEl.style.color = '#0d9488';
      msgEl.textContent = '👆 اختاري رقم الأول';
      currentThemeIdx = Math.floor(Math.random() * THEMES.length);
      const icon = THEMES[currentThemeIdx].icon;

      const count = Math.min(PAIRS_PER_ROUND, unlockedMax);
      currentPicks = [];
      while (currentPicks.length < count) {
        const n = 1 + Math.floor(Math.random() * unlockedMax);
        if (!currentPicks.includes(n)) currentPicks.push(n);
      }

      numsEl.innerHTML = '';
      currentPicks.forEach(n => {
        const b = document.createElement('button');
        b.className = 'g09-num-btn';
        b.textContent = n;
        b.dataset.num = n;
        b.addEventListener('click', () => onNumPick(n, b));
        numsEl.appendChild(b);
      });

      groupsEl.innerHTML = '';
      shuffle(currentPicks).forEach(n => {
        const b = document.createElement('button');
        b.className = 'g09-group-btn';
        b.dataset.num = n;
        for (let i = 0; i < n; i++) {
          const sp = document.createElement('span');
          sp.textContent = icon;
          b.appendChild(sp);
        }
        b.addEventListener('click', () => onGroupPick(n, b));
        groupsEl.appendChild(b);
      });
    }

    function onNumPick(num, btn) {
      if (locked || btn.classList.contains('matched')) return;
      const wasSelected = btn.classList.contains('selected');
      numsEl.querySelectorAll('.g09-num-btn').forEach(b => b.classList.remove('selected'));
      groupsEl.querySelectorAll('.g09-group-btn').forEach(g => g.style.boxShadow = '');
      if (wasSelected) {
        selectedNum = null;
        msgEl.textContent = '👆 اختاري رقم الأول';
        return;
      }
      btn.classList.add('selected');
      selectedNum = num;
      wrongThisRound = 0;
      msgEl.style.color = '#0d9488';
      msgEl.textContent = `👇 فين المجموعة اللي فيها ${num}؟`;
      speakNumber(num);
    }

    async function onGroupPick(num, btn) {
      if (locked || btn.classList.contains('matched')) return;
      if (selectedNum === null) {
        msgEl.style.color = '#d97706';
        msgEl.textContent = '☝️ دوسي على رقم من فوق الأول!';
        playErrorTone();
        return;
      }
      if (selectedNum === num) {
        btn.classList.add('matched');
        btn.style.boxShadow = '';
        const numBtn = numsEl.querySelector(`[data-num="${num}"]`);
        if (numBtn) { numBtn.classList.remove('selected'); numBtn.classList.add('matched'); }
        matched++;
        selectedNum = null;
        wrongThisRound = 0;
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
          tryUnlock();
          if (round >= TOTAL_ROUNDS) showWin();
          else newRound();
        }
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        playErrorTone();
        msgEl.style.color = '#dc2626';
        msgEl.textContent = `دول ${num}.. احنا عايزين ${selectedNum}`;
        await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }).catch(() => {});
        setTimeout(() => btn.classList.remove('wrong'), 500);
        if (wrongThisRound >= 2) {
          const targetGroup = groupsEl.querySelector(`[data-num="${selectedNum}"]:not(.matched)`);
          if (targetGroup) targetGroup.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #5eead4';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g09-win';
      win.innerHTML = `
        <div class="g09-win-emoji">🏆</div>
        <div class="g09-win-title">أحسنتِ يا بطلة!</div>
        <div class="g09-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g09-win-btns">
          <button class="g09-win-btn g09-win-replay" id="g09-replay">🔄 العبي تاني</button>
          <button class="g09-win-btn g09-win-home" id="g09-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g09-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; successCount = 0; newRound();
      });
      document.getElementById('g09-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g09-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g09-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>أعلى رقم مفتوح</span><strong>${unlockedMax} / ${MAX_NUM}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g09-parent-unlock-all">🔓 فتح كل الأرقام</button>
        <button id="g09-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g09-parent-unlock-all').addEventListener('click', () => {
        unlockedMax = MAX_NUM; saveUnlocked(); updateProgress(); playUnlockTone(); confetti(); toast('🎉 كل الأرقام اتفتحت!'); panel.remove();
      });
      document.getElementById('g09-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
