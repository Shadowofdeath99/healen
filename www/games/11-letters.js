window.Game_11 = {
  async mount(container) {
    let stars = 0;
    let explored = new Set();

    container.innerHTML = `
      <style>
        .g11-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g11-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(59, 130, 246, 0.35); position: relative; overflow: hidden; }
        .g11-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g11-title { font-size: 1.15rem; font-weight: 900; }
        .g11-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g11-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g11-stage { background: #fff; border: 3px solid #bfdbfe; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 400px; animation: g11-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g11-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g11-q { font-size: 1.05rem; font-weight: 900; color: #1d4ed8; margin-bottom: 12px; }
        .g11-q small { display: block; font-size: 0.78rem; color: #60a5fa; font-weight: 700; margin-top: 2px; }
        .g11-popup { min-height: 140px; background: linear-gradient(180deg,#eff6ff,#dbeafe); border-radius: 20px; padding: 16px; margin-bottom: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 2px dashed #93c5fd; transition: all .3s; cursor: pointer; }
        .g11-popup .emoji { font-size: 4.2rem; animation: g11-bounce .6s; }
        @keyframes g11-bounce { 0%{transform:scale(0) rotate(-30deg)} 100%{transform:scale(1) rotate(0)} }
        .g11-popup .letter-big { font-size: 3.2rem; font-weight: 900; color: #1d4ed8; text-shadow: 0 4px 0 #bfdbfe; line-height: 1; }
        .g11-popup .word-fr { font-size: 1.4rem; font-weight: 800; color: #2563eb; }
        .g11-popup .word-eg { font-size: 1.1rem; font-weight: 700; color: #3b82f6; }
        .g11-popup .empty { font-size: 1rem; color: #94a3b8; font-weight: 700; }
        .g11-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; direction: ltr; }
        .g11-letter { position: relative; background: #fff; border: 3px solid #bfdbfe; border-radius: 16px; padding: 13px 0; font-size: 1.55rem; font-weight: 900; color: #1d4ed8; cursor: pointer; box-shadow: 0 4px 0 #93c5fd; transition: all 0.15s; }
        .g11-letter:hover { transform: translateY(-2px); }
        .g11-letter:active { transform: translateY(2px); box-shadow: 0 2px 0 #93c5fd; }
        .g11-letter.explored { background: linear-gradient(180deg,#dbeafe,#bfdbfe); border-color: #3b82f6; color: #1e3a8a; }
        .g11-letter .star-dot { position: absolute; top: 2px; left: 4px; font-size: 0.7rem; }
        .g11-finish-btn { margin-top: 14px; background: linear-gradient(180deg,#34d399,#10b981); color: #fff; border: none; border-radius: 16px; padding: 12px 24px; font-size: 1rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #059669; display: none; }
        .g11-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g11-pop .4s; padding: 20px; }
        .g11-win-emoji { font-size: 4.8rem; animation: g11-winBounce 1s infinite; }
        @keyframes g11-winBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g11-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#3b82f6,#1d4ed8); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g11-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g11-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g11-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g11-win-replay { background: linear-gradient(180deg,#60a5fa,#3b82f6); color: #fff; box-shadow: 0 5px 0 #1d4ed8; }
        .g11-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g11-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g11-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g11-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g11-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g11-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g11-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g11-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g11-fall 1.6s linear forwards; }
        @keyframes g11-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g11-wrap">
        <div class="g11-header">
          <div>
            <div class="g11-title">🔤 Les Lettres • الحروف</div>
            <div class="g11-pill" id="g11-pill">🎓 استكشفي الحروف</div>
          </div>
          <div class="g11-progress" id="g11-prog">⭐ 0</div>
        </div>
        <div class="g11-stage">
          <button class="g11-parent-btn" id="g11-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g11-q">🔤 اضغطي على حرف واسمعيه<small>Clique sur une lettre</small></div>
          <div class="g11-popup" id="g11-popup">
            <div class="empty">👆 اختاري حرف من تحت</div>
          </div>
          <div class="g11-grid" id="g11-grid"></div>
          <button class="g11-finish-btn" id="g11-finish">🏆 خلصت الاستكشاف!</button>
        </div>
      </div>
    `;

    const popupEl = document.getElementById('g11-popup');
    const gridEl = document.getElementById('g11-grid');
    const progEl = document.getElementById('g11-prog');
    const pillEl = document.getElementById('g11-pill');
    const finishBtn = document.getElementById('g11-finish');
    const stageEl = container.querySelector('.g11-stage');
    let lastLetter = null;

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

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g11-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g11-confetti';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }

    async function onLetterClick(L) {
      lastLetter = L;
      const word = (window.SHARED_WORDS || []).find(w => w.letter === L);
      if (word) {
        popupEl.innerHTML = `
          <div class="emoji">${word.emoji}</div>
          <div class="letter-big">${L}</div>
          <div class="word-fr">${word.fr}</div>
          <div class="word-eg">${word.eg || ''}</div>
        `;
        try { await Audio2.play('fr_letter_' + L, { text: L + ' comme ' + word.fr, lang: 'fr' }); } catch (e) {}
        await sleep(350);
        try { await Audio2.play('eg_letter_' + L, { text: word.eg || word.fr, lang: 'eg' }); } catch (e) {}
      } else {
        popupEl.innerHTML = `<div class="letter-big">${L}</div>`;
        try { await Audio2.play('fr_letter_' + L, { text: L, lang: 'fr' }); } catch (e) {}
      }
      if (!explored.has(L)) {
        explored.add(L);
        stars++;
        progEl.textContent = `⭐ ${stars}`;
        playCorrectTone();
        confetti();
        if (typeof starBurst === 'function') starBurst();
        pillEl.textContent = `🎓 اكتشفتي ${explored.size} / 26 حرف`;
        if (explored.size >= 5) finishBtn.style.display = 'inline-block';
      }
      renderGrid();
    }

    popupEl.addEventListener('click', () => {
      if (lastLetter) onLetterClick(lastLetter);
    });

    function renderGrid() {
      gridEl.innerHTML = '';
      const LETTERS = window.LETTERS || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      LETTERS.forEach(L => {
        const btn = document.createElement('button');
        btn.className = 'g11-letter' + (explored.has(L) ? ' explored' : '');
        btn.innerHTML = `${explored.has(L) ? '<span class="star-dot">⭐</span>' : ''}${L}`;
        btn.addEventListener('click', () => onLetterClick(L));
        gridEl.appendChild(btn);
      });
    }

    finishBtn.addEventListener('click', async () => {
      const win = document.createElement('div');
      win.className = 'g11-win';
      win.innerHTML = `
        <div class="g11-win-emoji">🏆</div>
        <div class="g11-win-title">أحسنتِ يا بطلة!</div>
        <div class="g11-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g11-win-btns">
          <button class="g11-win-btn g11-win-replay" id="g11-replay">🔄 العبي تاني</button>
          <button class="g11-win-btn g11-win-home" id="g11-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      confetti();
      if (typeof starBurst === 'function') starBurst();
      playCorrectTone();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      document.getElementById('g11-replay').addEventListener('click', () => Game_11.mount(container));
      document.getElementById('g11-home').addEventListener('click', () => { location.hash = '#/home'; });
    });

    document.getElementById('g11-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g11-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>الحروف المكتشفة</span><strong>${explored.size} / 26</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g11-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g11-parent-close').addEventListener('click', () => panel.remove());
    });

    renderGrid();
  }
};
