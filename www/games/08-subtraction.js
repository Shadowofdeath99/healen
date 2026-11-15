window.Game_08 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    const STORAGE_KEY = 'helen_g08_maxtotal';
    let maxTotal = Math.min(10, Math.max(5, parseInt(localStorage.getItem(STORAGE_KEY) || '5', 10)));

    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let isCounting = false;
    let total = 0, remove = 0, answer = 0;
    let currentIcon = '🍎';
    const THEMES = [
      { icon: '🍎', name: 'تفاح' }, { icon: '⭐', name: 'نجوم' },
      { icon: '🐱', name: 'قطط' }, { icon: '🎈', name: 'بالونات' },
      { icon: '🍓', name: 'فراولة' }, { icon: '🦋', name: 'فراشات' }
    ];
    let currentThemeIdx = 0;

    container.innerHTML = `
      <style>
        .g08-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g08-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(239, 68, 68, 0.35); position: relative; overflow: hidden; }
        .g08-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g08-title { font-size: 1.15rem; font-weight: 900; }
        .g08-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g08-stage { background: #fff; border: 3px solid #fecaca; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 360px; animation: g08-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g08-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g08-stage.g08-shake { animation: g08-shk .4s; }
        @keyframes g08-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g08-stage.g08-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g08-q { font-size: 1.05rem; font-weight: 900; color: #b91c1c; margin-bottom: 12px; }
        .g08-q small { display: block; font-size: 0.78rem; color: #f87171; font-weight: 700; margin-top: 2px; }
        .g08-equation { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; padding: 12px; background: #fef2f2; border-radius: 18px; border: 2px dashed #fecaca; direction: ltr; }
        .g08-group { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; min-height: 60px; max-width: 175px; padding: 6px; background: #fff; border-radius: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .g08-item { font-size: 1.8rem; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; transition: all .25s; position: relative; }
        .g08-item.removed { opacity: 0.35; transform: scale(0.75); }
        .g08-item.removed::after { content: '❌'; position: absolute; font-size: 1.1rem; }
        .g08-item.counted { background: linear-gradient(180deg,#fef9c3,#fde047); transform: scale(1.15); box-shadow: 0 4px 10px rgba(234,179,8,.4); }
        .g08-op { font-size: 2rem; font-weight: 900; color: #b91c1c; }
        .g08-eq { font-size: 2rem; font-weight: 900; color: #b91c1c; }
        .g08-qmark { font-size: 2rem; font-weight: 900; color: #94a3b8; }
        .g08-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .g08-choice { background: #fff; border: 4px solid #fecaca; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #b91c1c; cursor: pointer; box-shadow: 0 6px 0 #fca5a5; transition: all 0.15s; }
        .g08-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #fca5a5; }
        .g08-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g08-correctPop .5s; }
        .g08-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g08-shk .4s; }
        @keyframes g08-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .g08-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g08-hint-box.visible { display: flex; }
        .g08-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #dc2626; }
        .g08-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g08-pop .4s; padding: 20px; }
        .g08-win-emoji { font-size: 4.8rem; animation: g08-bounce 1s infinite; }
        @keyframes g08-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g08-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#ef4444,#b91c1c); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g08-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g08-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g08-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g08-win-btn:active { transform: scale(0.95); }
        .g08-win-replay { background: linear-gradient(180deg,#f87171,#ef4444); color: #fff; box-shadow: 0 5px 0 #b91c1c; }
        .g08-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g08-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g08-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g08-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g08-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g08-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g08-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g08-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g08-fall 1.6s linear forwards; }
        @keyframes g08-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g08-wrap">
        <div class="g08-header">
          <div>
            <div class="g08-title">➖ Soustraction • اطرح</div>
            <div id="g08-sub" style="font-size:0.8rem;opacity:0.9;margin-top:3px;">👆 طرح حتى ${maxTotal}</div>
          </div>
          <div class="g08-progress" id="g08-prog">⭐ 0</div>
        </div>
        <div class="g08-stage" id="g08-stage">
          <button class="g08-parent-btn" id="g08-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g08-q" id="g08-q"></div>
          <div class="g08-equation" id="g08-equation"></div>
          <div class="g08-choices" id="g08-choices"></div>
          <div class="g08-hint-box" id="g08-hint"></div>
          <div class="g08-feedback" id="g08-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g08-stage');
    const qEl = document.getElementById('g08-q');
    const equationEl = document.getElementById('g08-equation');
    const choicesEl = document.getElementById('g08-choices');
    const hintBox = document.getElementById('g08-hint');
    const msgEl = document.getElementById('g08-msg');
    const progEl = document.getElementById('g08-prog');
    const subEl = document.getElementById('g08-sub');

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

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function updateProgress() {
      progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`;
      subEl.textContent = `👆 طرح حتى ${maxTotal}`;
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
      c.className = 'g08-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g08-confetti';
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
      wrongThisRound = 0;
      locked = false;
      isCounting = false;
      updateProgress();
      stageEl.classList.remove('g08-hint', 'g08-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';
      currentThemeIdx = Math.floor(Math.random() * THEMES.length);
      currentIcon = THEMES[currentThemeIdx].icon;

      total = 2 + Math.floor(Math.random() * (maxTotal - 1));
      remove = 1 + Math.floor(Math.random() * (total - 1));
      answer = total - remove;

      qEl.innerHTML = `➖ فاضل كام ${THEMES[currentThemeIdx].name}؟ (${total} − ${remove})<small>Combien en reste-t-il ?</small>`;
      equationEl.innerHTML = '';
      const g1 = document.createElement('div'); g1.className = 'g08-group';
      for (let i = 0; i < total; i++) {
        const el = document.createElement('div');
        el.className = 'g08-item';
        if (i >= (total - remove)) el.classList.add('removed');
        el.textContent = currentIcon;
        g1.appendChild(el);
      }
      const op = document.createElement('div'); op.className = 'g08-op'; op.textContent = '−';
      const removed = document.createElement('div'); removed.className = 'g08-op'; removed.textContent = remove;
      const eq = document.createElement('div'); eq.className = 'g08-eq'; eq.textContent = '=';
      const q = document.createElement('div'); q.className = 'g08-qmark'; q.textContent = '?';
      equationEl.appendChild(g1); equationEl.appendChild(op); equationEl.appendChild(removed); equationEl.appendChild(eq); equationEl.appendChild(q);

      let choices = [answer];
      while (choices.length < 3) {
        const c = 1 + Math.floor(Math.random() * Math.max(total, 4));
        if (!choices.includes(c)) choices.push(c);
      }
      choices = shuffle(choices);
      choicesEl.innerHTML = '';
      choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g08-choice';
        btn.textContent = c;
        btn.dataset.num = c;
        btn.addEventListener('click', () => onChoice(c, btn));
        choicesEl.appendChild(btn);
      });
    }

    async function onChoice(num, btn) {
      if (locked) return;
      if (num === answer) {
        locked = true;
        btn.classList.add('correct');
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${total} − ${remove} = ${answer}`;
        await speakPraise();
        await sleep(350);
        isCounting = true;
        const remaining = [...equationEl.querySelectorAll('.g08-item')].filter(el => !el.classList.contains('removed'));
        for (let i = 0; i < remaining.length; i++) {
          if (!isCounting) break;
          remaining[i].classList.add('counted');
          playCountTone(i + 1);
          const nObj = SHARED.numbers[i];
          if (nObj) { try { await Audio2.play(nObj.frId, { text: nObj.fr, lang: 'fr' }); } catch (e) {} }
          await sleep(350);
        }
        isCounting = false;
        await sleep(350);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g08-shake');
        setTimeout(() => stageEl.classList.remove('g08-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g08-hint');
          hintBox.innerHTML = `💡 الباقي: ${currentIcon.repeat(answer)} (${answer})`;
          hintBox.classList.add('visible');
          const correctBtn = choicesEl.querySelector(`[data-num="${answer}"]`);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fca5a5';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g08-win';
      win.innerHTML = `
        <div class="g08-win-emoji">🏆</div>
        <div class="g08-win-title">أحسنتِ يا بطلة!</div>
        <div class="g08-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g08-win-btns">
          <button class="g08-win-btn g08-win-replay" id="g08-replay">🔄 العبي تاني</button>
          <button class="g08-win-btn g08-win-home" id="g08-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g08-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g08-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g08-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g08-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>الحد الأقصى للعدد</span><strong>${maxTotal}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g08-parent-toggle">${maxTotal === 5 ? '🚀 رفع المستوى (طرح حتى 10)' : '🎯 مستوى مبتدئ (طرح حتى 5)'}</button>
        <button id="g08-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g08-parent-toggle').addEventListener('click', () => {
        maxTotal = maxTotal === 5 ? 10 : 5;
        try { localStorage.setItem(STORAGE_KEY, String(maxTotal)); } catch (e) {}
        round = 0; stars = 0;
        panel.remove();
        newRound();
      });
      document.getElementById('g08-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
