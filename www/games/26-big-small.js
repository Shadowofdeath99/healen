window.Game_26 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, askBig = false, winner = 'left';
    const PAIRS = [
      { big: '🐘', small: '🐜' },
      { big: '🐋', small: '🐟' },
      { big: '🦒', small: '🐇' },
      { big: '🐻', small: '🐭' },
      { big: '🦕', small: '🐞' }
    ];
    let currentPair = PAIRS[0];

    container.innerHTML = `
      <style>
        .g26-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g26-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 50%,#0369a1 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(14,165,233,.35)}
        .g26-title{font-size:1.15rem;font-weight:900}
        .g26-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g26-stage{background:#fff;border:3px solid #bae6fd;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g26-pop .35s}
        @keyframes g26-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g26-stage.shake{animation:g26-shk .4s}
        @keyframes g26-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g26-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g26-q{font-size:1.15rem;font-weight:900;color:#0369a1;margin-bottom:16px}
        .g26-q small{display:block;font-size:.78rem;color:#38bdf8;font-weight:700;margin-top:2px}
        .g26-row{display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:14px}
        .g26-side{flex:1;max-width:190px;background:linear-gradient(180deg,#f0f9ff,#e0f2fe);border:3px solid #bae6fd;border-radius:20px;padding:14px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;min-height:150px}
        .g26-side:hover{transform:translateY(-2px)}
        .g26-side:active{transform:translateY(2px)}
        .g26-side.correct{background:linear-gradient(180deg,#dcfce7,#bbf7d0);border-color:#16a34a;animation:g26-pop2 .5s}
        .g26-side.wrong{background:linear-gradient(180deg,#fee2e2,#fecaca);border-color:#ef4444;animation:g26-shk .4s}
        @keyframes g26-pop2{0%{transform:scale(1)}45%{transform:scale(1.06)}100%{transform:scale(1)}}
        .g26-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#0284c7}
        .g26-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g26-hint-box.visible{display:flex}
        .g26-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g26-win-emoji{font-size:4.8rem;animation:g26-bounce 1s infinite}
        @keyframes g26-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g26-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#0ea5e9,#0369a1);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g26-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g26-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g26-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g26-win-replay{background:linear-gradient(180deg,#38bdf8,#0ea5e9);color:#fff;box-shadow:0 5px 0 #0369a1}
        .g26-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g26-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g26-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g26-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g26-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g26-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g26-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g26-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g26-fall 1.6s linear forwards}
        @keyframes g26-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g26-wrap">
        <div class="g26-header"><div><div class="g26-title">🐘 Grand / Petit • كبير وصغير</div></div><div class="g26-progress" id="g26-prog">⭐ 0</div></div>
        <div class="g26-stage" id="g26-stage">
          <button class="g26-parent-btn" id="g26-parent-btn">⚙️</button>
          <div class="g26-q" id="g26-q"></div>
          <div class="g26-row" id="g26-row"></div>
          <div class="g26-hint-box" id="g26-hint"></div>
          <div class="g26-feedback" id="g26-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g26-stage'), qEl = document.getElementById('g26-q');
    const rowEl = document.getElementById('g26-row'), hintBox = document.getElementById('g26-hint');
    const msgEl = document.getElementById('g26-msg'), progEl = document.getElementById('g26-prog');

    let sharedAC = null;
    function getAC() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!sharedAC) sharedAC = new AC();
      if (sharedAC.state === 'suspended') sharedAC.resume().catch(() => {});
      return sharedAC;
    }

    function playTone(f, d, t) {
      try {
        const c = getAC();
        if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = t || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.14, c.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, c.currentTime + (d || .2));
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + (d || .2));
      } catch (e) {}
    }
    function pc() { playTone(523, .15); setTimeout(() => playTone(659, .15), 120); setTimeout(() => playTone(784, .25), 240); }
    function pe() { playTone(196, .25, 'square'); }
    function updateProgress() { progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`; }
    async function speakFr(id, text) { try { await Audio2.play(id, { text, lang: 'fr' }); } catch (e) {} }
    async function speakEg(text) { try { await Audio2.play(null, { text, lang: 'eg' }); } catch (e) {} }
    async function speakPraise() { await speakFr('fr_bravo', 'Bravo !'); await sleep(300); await speakEg('برافو!'); }
    async function speakEncourage() { await speakEg('حاولي تاني'); }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g26-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g26-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      askBig = Math.random() > 0.5;
      currentPair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
      const bigLeft = Math.random() > 0.5;
      const leftEmoji = bigLeft ? currentPair.big : currentPair.small;
      const rightEmoji = bigLeft ? currentPair.small : currentPair.big;
      const leftSize = bigLeft ? '5.5rem' : '2.2rem';
      const rightSize = bigLeft ? '2.2rem' : '5.5rem';
      qEl.innerHTML = askBig ? `${currentPair.big} دوسي على الكبير<small>Clique sur le GRAND</small>` : `${currentPair.small} دوسي على الصغير<small>Clique sur le PETIT</small>`;
      winner = (askBig === bigLeft) ? 'left' : 'right';
      rowEl.innerHTML = `
        <div class="g26-side" data-side="left" style="font-size:${leftSize}">${leftEmoji}</div>
        <div class="g26-side" data-side="right" style="font-size:${rightSize}">${rightEmoji}</div>`;
      rowEl.querySelectorAll('[data-side]').forEach(el => {
        el.addEventListener('click', () => onPick(el.dataset.side, el));
      });
      setTimeout(async () => {
        if (askBig) { await speakFr('fr_grand', 'Grand'); await sleep(300); await speakEg('الكبير'); }
        else { await speakFr('fr_petit', 'Petit'); await sleep(300); await speakEg('الصغير'); }
      }, 300);
    }

    async function onPick(side, el) {
      if (locked) return;
      if (side === winner) {
        locked = true; el.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = askBig ? '🎉 Bravo ! الكبير (Grand)' : '🎉 Bravo ! الصغير (Petit)';
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; el.classList.add('wrong'); setTimeout(() => el.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint');
          hintBox.innerHTML = askBig ? `💡 الكبير هو ${currentPair.big}` : `💡 الصغير هو ${currentPair.small}`;
          hintBox.classList.add('visible');
          const cb = rowEl.querySelector(`[data-side="${winner}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g26-win';
      win.innerHTML = `<div class="g26-win-emoji">🏆</div><div class="g26-win-title">أحسنتِ يا بطلة!</div><div class="g26-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g26-win-btns"><button class="g26-win-btn g26-win-replay" id="g26-replay">🔄 العبي تاني</button><button class="g26-win-btn g26-win-home" id="g26-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g26-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g26-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g26-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g26-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g26-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g26-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
