window.Game_14 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    const PAIRS = 4;
    let round = 0;
    let stars = 0;
    let locked = false;
    let selectedWord = null;
    let matched = 0;
    let wrongThisPick = 0;
    let currentPicks = [];

    container.innerHTML = `
      <style>
        .g14-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g14-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(245,158,11,.35); position: relative; overflow: hidden; }
        .g14-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g14-title { font-size: 1.15rem; font-weight: 900; }
        .g14-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g14-stage { background: #fff; border: 3px solid #fde68a; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 420px; animation: g14-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g14-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g14-q { font-size: 1.05rem; font-weight: 900; color: #b45309; margin-bottom: 12px; }
        .g14-q small { display: block; font-size: 0.78rem; color: #f59e0b; font-weight: 700; margin-top: 2px; }
        .g14-section-title { font-size: 0.85rem; font-weight: 800; color: #64748b; margin: 10px 0 6px; }
        .g14-words { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 12px; direction: ltr; }
        .g14-word-btn { padding: 12px 18px; border-radius: 14px; background: #fff; border: 3px solid #fde68a; font-size: 1.1rem; font-weight: 800; color: #92400e; cursor: pointer; box-shadow: 0 4px 0 #fcd34d; transition: all .15s; }
        .g14-word-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #fcd34d; }
        .g14-word-btn.selected { box-shadow: 0 0 0 5px #fbbf24, 0 4px 0 #fcd34d; background: #fef3c7; transform: scale(1.06); }
        .g14-word-btn.matched { opacity: 0.4; pointer-events: none; background: linear-gradient(180deg,#22c55e,#16a34a); color: #fff; border-color: #15803d; box-shadow: 0 4px 0 #14532d; }
        .g14-imgs { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .g14-img-btn { width: 88px; height: 88px; border-radius: 18px; background: #fff; border: 3px solid #fde68a; font-size: 2.6rem; cursor: pointer; box-shadow: 0 4px 0 #fcd34d; transition: all .15s; display: flex; align-items: center; justify-content: center; }
        .g14-img-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #fcd34d; }
        .g14-img-btn.matched { opacity: 0.5; pointer-events: none; background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #22c55e; box-shadow: 0 4px 0 #16a34a; }
        .g14-img-btn.wrong { background: linear-gradient(180deg,#fee2e2,#fecaca); border-color: #ef4444; animation: g14-shk .4s; }
        @keyframes g14-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .g14-feedback { font-size: 1.05rem; font-weight: 900; min-height: 28px; margin-top: 12px; color: #b45309; }
        .g14-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g14-pop .4s; padding: 20px; }
        .g14-win-emoji { font-size: 4.8rem; animation: g14-bounce 1s infinite; }
        @keyframes g14-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g14-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#f59e0b,#b45309); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g14-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g14-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g14-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g14-win-btn:active { transform: scale(0.95); }
        .g14-win-replay { background: linear-gradient(180deg,#fbbf24,#f59e0b); color: #fff; box-shadow: 0 5px 0 #b45309; }
        .g14-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g14-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g14-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g14-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g14-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g14-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g14-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g14-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g14-fall 1.6s linear forwards; }
        @keyframes g14-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g14-wrap">
        <div class="g14-header">
          <div>
            <div class="g14-title">🖼️ Relie Mot–Image • كلمة-صورة</div>
          </div>
          <div class="g14-progress" id="g14-prog">⭐ 0</div>
        </div>
        <div class="g14-stage" id="g14-stage">
          <button class="g14-parent-btn" id="g14-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g14-q">🖼️ طابقي الكلمة مع صورتها<small>Relie le mot à l'image</small></div>
          <div class="g14-section-title">📝 الكلمات</div>
          <div class="g14-words" id="g14-words"></div>
          <div class="g14-section-title">🖼️ الصور</div>
          <div class="g14-imgs" id="g14-imgs"></div>
          <div class="g14-feedback" id="g14-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g14-stage');
    const wordsEl = document.getElementById('g14-words');
    const imgsEl = document.getElementById('g14-imgs');
    const msgEl = document.getElementById('g14-msg');
    const progEl = document.getElementById('g14-prog');

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

    async function speakPraise() {
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {}
    }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g14-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g14-confetti';
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
      locked = false;
      selectedWord = null;
      matched = 0;
      wrongThisPick = 0;
      updateProgress();
      msgEl.style.color = '#b45309';
      msgEl.textContent = '👆 اختاري كلمة من فوق الأول';

      const words = (window.SHARED_WORDS || []).filter(w => w && w.emoji && w.fr);
      const count = Math.min(PAIRS, words.length);
      currentPicks = shuffle(words).slice(0, count);

      wordsEl.innerHTML = '';
      currentPicks.forEach((w, idx) => {
        const b = document.createElement('button');
        b.className = 'g14-word-btn';
        b.textContent = w.fr;
        b.dataset.idx = idx;
        b.addEventListener('click', () => onWordPick(w, idx, b));
        wordsEl.appendChild(b);
      });

      imgsEl.innerHTML = '';
      shuffle(currentPicks.map((w, idx) => ({ w, idx }))).forEach(({ w, idx }) => {
        const b = document.createElement('button');
        b.className = 'g14-img-btn';
        b.textContent = w.emoji;
        b.dataset.idx = idx;
        b.addEventListener('click', () => onImgPick(w, idx, b));
        imgsEl.appendChild(b);
      });
    }

    async function onWordPick(w, idx, btn) {
      if (locked || btn.classList.contains('matched')) return;
      wordsEl.querySelectorAll('.g14-word-btn').forEach(b => b.classList.remove('selected'));
      imgsEl.querySelectorAll('.g14-img-btn').forEach(ib => ib.style.boxShadow = '');
      btn.classList.add('selected');
      selectedWord = { w, idx };
      wrongThisPick = 0;
      msgEl.style.color = '#b45309';
      msgEl.textContent = `👇 فين صورة "${w.fr}"؟`;
      try { await Audio2.play('fr_' + (w.fr || '').toLowerCase(), { text: w.fr, lang: 'fr' }); } catch (e) {}
    }

    async function onImgPick(w, idx, btn) {
      if (locked || btn.classList.contains('matched')) return;
      if (!selectedWord) {
        msgEl.style.color = '#d97706';
        msgEl.textContent = '☝️ دوسي على كلمة من فوق الأول!';
        playErrorTone();
        return;
      }
      if (selectedWord.idx === idx) {
        btn.classList.add('matched');
        btn.style.boxShadow = '';
        const wb = wordsEl.querySelector(`[data-idx="${idx}"]`);
        if (wb) { wb.classList.remove('selected'); wb.classList.add('matched'); }
        matched++;
        wrongThisPick = 0;
        if (typeof starBurst === 'function') starBurst();
        playCorrectTone();
        msgEl.style.color = '#16a34a';
        msgEl.textContent = `🎉 Bravo ! ${w.fr} = ${w.eg || ''}`;
        await speakPraise();
        selectedWord = null;
        if (matched === currentPicks.length) {
          locked = true;
          stars++;
          updateProgress();
          celebrate();
          await sleep(450);
          if (round >= TOTAL_ROUNDS) showWin();
          else newRound();
        }
      } else {
        wrongThisPick++;
        btn.classList.add('wrong');
        playErrorTone();
        try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
        setTimeout(() => btn.classList.remove('wrong'), 500);
        if (wrongThisPick >= 2) {
          const targetImg = imgsEl.querySelector(`[data-idx="${selectedWord.idx}"]`);
          if (targetImg) targetImg.style.boxShadow = '0 0 0 5px #fbbf24, 0 4px 0 #fcd34d';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g14-win';
      win.innerHTML = `
        <div class="g14-win-emoji">🏆</div>
        <div class="g14-win-title">أحسنتِ يا بطلة!</div>
        <div class="g14-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g14-win-btns">
          <button class="g14-win-btn g14-win-replay" id="g14-replay">🔄 العبي تاني</button>
          <button class="g14-win-btn g14-win-home" id="g14-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g14-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g14-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g14-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g14-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g14-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g14-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
