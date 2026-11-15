window.Game_12 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let currentWord = null;
    let correctLetter = '';

    const LETTERS = window.LETTERS || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    container.innerHTML = `
      <style>
        .g12-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g12-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(6, 182, 212, 0.35); position: relative; overflow: hidden; }
        .g12-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g12-title { font-size: 1.15rem; font-weight: 900; }
        .g12-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g12-stage { background: #fff; border: 3px solid #a5f3fc; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g12-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g12-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g12-stage.g12-shake { animation: g12-shk .4s; }
        @keyframes g12-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g12-stage.g12-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g12-q { font-size: 1.05rem; font-weight: 900; color: #0e7490; margin-bottom: 12px; }
        .g12-q small { display: block; font-size: 0.78rem; color: #22d3ee; font-weight: 700; margin-top: 2px; }
        .g12-card { background: linear-gradient(180deg,#ecfeff,#cffafe); border-radius: 22px; padding: 16px; margin-bottom: 14px; border: 3px solid #67e8f9; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
        .g12-emoji { font-size: 5rem; animation: g12-bounce .5s; }
        @keyframes g12-bounce { 0%{transform:scale(0) rotate(-30deg)} 100%{transform:scale(1) rotate(0)} }
        .g12-word { font-size: 1.8rem; font-weight: 900; color: #0e7490; direction: ltr; }
        .g12-word-eg { font-size: 1.1rem; font-weight: 700; color: #06b6d4; }
        .g12-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; direction: ltr; }
        .g12-choice { background: #fff; border: 4px solid #a5f3fc; border-radius: 20px; padding: 22px 0; font-size: 2.4rem; font-weight: 900; color: #0e7490; cursor: pointer; box-shadow: 0 6px 0 #67e8f9; transition: all 0.15s; }
        .g12-choice:active { transform: translateY(2px); box-shadow: 0 3px 0 #67e8f9; }
        .g12-choice.correct { background: linear-gradient(180deg,#4ade80,#22c55e); color:#fff; border-color:#16a34a; box-shadow: 0 6px 0 #15803d; animation: g12-correctPop .5s; }
        .g12-choice.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); color:#fff; border-color:#ef4444; box-shadow: 0 6px 0 #b91c1c; animation: g12-shk .4s; }
        @keyframes g12-correctPop { 0%{transform:scale(1)} 45%{transform:scale(1.18)} 100%{transform:scale(1)} }
        .g12-hint-box { min-height: 44px; background: #fefce8; border: 2px dashed #fde047; border-radius: 16px; padding: 8px 12px; display: none; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; font-size: 1.05rem; font-weight: 800; color: #854d0e; }
        .g12-hint-box.visible { display: flex; }
        .g12-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 10px; color: #0891b2; }
        .g12-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g12-pop .4s; padding: 20px; }
        .g12-win-emoji { font-size: 4.8rem; animation: g12-winBounce 1s infinite; }
        @keyframes g12-winBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g12-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#06b6d4,#0e7490); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g12-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g12-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g12-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g12-win-btn:active { transform: scale(0.95); }
        .g12-win-replay { background: linear-gradient(180deg,#22d3ee,#06b6d4); color: #fff; box-shadow: 0 5px 0 #0e7490; }
        .g12-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g12-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g12-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g12-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g12-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g12-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g12-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g12-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g12-fall 1.6s linear forwards; }
        @keyframes g12-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g12-wrap">
        <div class="g12-header">
          <div>
            <div class="g12-title">🅰️ Première Lettre • أول حرف</div>
          </div>
          <div class="g12-progress" id="g12-prog">⭐ 0</div>
        </div>
        <div class="g12-stage" id="g12-stage">
          <button class="g12-parent-btn" id="g12-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g12-q">🅰️ إيه أول حرف في الكلمة دي؟<small>Quelle est la première lettre ?</small></div>
          <div class="g12-card" id="g12-card">
            <div class="g12-emoji" id="g12-emoji"></div>
            <div class="g12-word" id="g12-word"></div>
            <div class="g12-word-eg" id="g12-word-eg"></div>
          </div>
          <div class="g12-choices" id="g12-choices"></div>
          <div class="g12-hint-box" id="g12-hint"></div>
          <div class="g12-feedback" id="g12-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g12-stage');
    const cardEl = document.getElementById('g12-card');
    const emojiEl = document.getElementById('g12-emoji');
    const wordEl = document.getElementById('g12-word');
    const wordEgEl = document.getElementById('g12-word-eg');
    const choicesEl = document.getElementById('g12-choices');
    const hintBox = document.getElementById('g12-hint');
    const msgEl = document.getElementById('g12-msg');
    const progEl = document.getElementById('g12-prog');

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

    async function speakWord() {
      if (!currentWord) return;
      try { await Audio2.play('fr_' + (currentWord.fr || '').toLowerCase(), { text: currentWord.fr, lang: 'fr' }); } catch (e) {}
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
      c.className = 'g12-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g12-confetti';
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

    cardEl.addEventListener('click', speakWord);

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      updateProgress();
      stageEl.classList.remove('g12-hint', 'g12-shake');
      hintBox.classList.remove('visible');
      hintBox.innerHTML = '';
      msgEl.textContent = '';

      const words = (window.SHARED_WORDS || []).filter(w => w && w.letter && w.emoji);
      if (!words.length) {
        msgEl.textContent = 'لا توجد كلمات متاحة';
        return;
      }
      currentWord = words[Math.floor(Math.random() * words.length)];
      correctLetter = currentWord.letter.toUpperCase();

      emojiEl.textContent = currentWord.emoji;
      const rest = (currentWord.fr || '').slice(1);
      wordEl.innerHTML = `<span style="color:#f59e0b;">_</span>${rest}`;
      wordEgEl.textContent = currentWord.eg || '';

      let choices = [correctLetter];
      while (choices.length < 3) {
        const c = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        if (!choices.includes(c)) choices.push(c);
      }
      choices = shuffle(choices);
      choicesEl.innerHTML = '';
      choices.forEach(L => {
        const btn = document.createElement('button');
        btn.className = 'g12-choice';
        btn.textContent = L;
        btn.addEventListener('click', () => onChoice(L, btn));
        choicesEl.appendChild(btn);
      });

      setTimeout(speakWord, 300);
    }

    async function onChoice(L, btn) {
      if (locked) return;
      if (L === correctLetter) {
        locked = true;
        btn.classList.add('correct');
        wordEl.textContent = currentWord.fr || '';
        stars++;
        updateProgress();
        celebrate();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${currentWord.fr} تبدأ بـ ${correctLetter}`;
        try { await Audio2.play('fr_letter_' + correctLetter, { text: correctLetter + ' comme ' + currentWord.fr, lang: 'fr' }); } catch (e) {}
        await sleep(350);
        await speakPraise();
        await sleep(450);
        if (round >= TOTAL_ROUNDS) showWin();
        else newRound();
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g12-shake');
        setTimeout(() => stageEl.classList.remove('g12-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g12-hint');
          hintBox.innerHTML = `💡 أول حرف هو: ${correctLetter}`;
          hintBox.classList.add('visible');
          const correctBtn = [...choicesEl.querySelectorAll('.g12-choice')].find(b => b.textContent === correctLetter);
          if (correctBtn) correctBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #67e8f9';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g12-win';
      win.innerHTML = `
        <div class="g12-win-emoji">🏆</div>
        <div class="g12-win-title">أحسنتِ يا بطلة!</div>
        <div class="g12-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g12-win-btns">
          <button class="g12-win-btn g12-win-replay" id="g12-replay">🔄 العبي تاني</button>
          <button class="g12-win-btn g12-win-home" id="g12-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g12-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g12-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g12-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g12-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g12-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g12-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
