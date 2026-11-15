window.Game_29 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, askHot = false;
    const ITEMS = [
      { emoji: '🔥', hot: true, name: 'نار' }, { emoji: '☀️', hot: true, name: 'شمس' },
      { emoji: '☕', hot: true, name: 'شاي سخن' }, { emoji: '🍲', hot: true, name: 'شوربة سخنة' },
      { emoji: '❄️', hot: false, name: 'ثلج' }, { emoji: '🧊', hot: false, name: 'مكعب ثلج' },
      { emoji: '🍦', hot: false, name: 'آيس كريم' }, { emoji: '⛄', hot: false, name: 'رجل ثلج' }
    ];

    container.innerHTML = `
      <style>
        .g29-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g29-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#ef4444 0%,#dc2626 50%,#b91c1c 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(239,68,68,.35)}
        .g29-title{font-size:1.15rem;font-weight:900}
        .g29-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g29-stage{background:#fff;border:3px solid #fecaca;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g29-pop .35s}
        @keyframes g29-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g29-stage.shake{animation:g29-shk .4s}
        @keyframes g29-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g29-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g29-q{font-size:1.15rem;font-weight:900;color:#b91c1c;margin-bottom:16px}
        .g29-q small{display:block;font-size:.78rem;color:#f87171;font-weight:700;margin-top:2px}
        .g29-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .g29-item{background:#fff;border:4px solid #fecaca;border-radius:20px;padding:20px 0;font-size:3rem;cursor:pointer;box-shadow:0 6px 0 #fca5a5;transition:all .15s}
        .g29-item:active{transform:translateY(2px);box-shadow:0 3px 0 #fca5a5}
        .g29-item.correct{border-color:#16a34a;box-shadow:0 0 0 5px #22c55e,0 6px 0 #15803d;animation:g29-pop2 .5s}
        .g29-item.wrong{border-color:#ef4444;box-shadow:0 0 0 5px #f87171,0 6px 0 #b91c1c;animation:g29-shk .4s}
        @keyframes g29-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g29-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#dc2626}
        .g29-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g29-hint-box.visible{display:flex}
        .g29-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g29-win-emoji{font-size:4.8rem;animation:g29-bounce 1s infinite}
        @keyframes g29-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g29-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#ef4444,#b91c1c);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g29-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g29-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g29-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g29-win-replay{background:linear-gradient(180deg,#f87171,#ef4444);color:#fff;box-shadow:0 5px 0 #b91c1c}
        .g29-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g29-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g29-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g29-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g29-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g29-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g29-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g29-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g29-fall 1.6s linear forwards}
        @keyframes g29-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g29-wrap">
        <div class="g29-header"><div><div class="g29-title">🔥 Chaud / Froid • سخن وبارد</div></div><div class="g29-progress" id="g29-prog">⭐ 0</div></div>
        <div class="g29-stage" id="g29-stage">
          <button class="g29-parent-btn" id="g29-parent-btn">⚙️</button>
          <div class="g29-q" id="g29-q"></div>
          <div class="g29-grid" id="g29-grid"></div>
          <div class="g29-hint-box" id="g29-hint"></div>
          <div class="g29-feedback" id="g29-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g29-stage'), qEl = document.getElementById('g29-q');
    const gridEl = document.getElementById('g29-grid'), hintBox = document.getElementById('g29-hint');
    const msgEl = document.getElementById('g29-msg'), progEl = document.getElementById('g29-prog');

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
    function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
    function updateProgress() { progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`; }
    async function speakFr(id, text) { try { await Audio2.play(id, { text, lang: 'fr' }); } catch (e) {} }
    async function speakEg(text) { try { await Audio2.play(null, { text, lang: 'eg' }); } catch (e) {} }
    async function speakPraise() { await speakFr('fr_bravo', 'Bravo !'); await sleep(300); await speakEg('برافو!'); }
    async function speakEncourage() { await speakEg('حاولي تاني'); }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g29-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g29-confetti';
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
      askHot = Math.random() > 0.5;
      const picks = shuffle(ITEMS).slice(0, 6);
      if (!picks.find(o => o.hot === askHot)) {
        const c = ITEMS.find(o => o.hot === askHot);
        picks[0] = c;
      }
      qEl.innerHTML = askHot ? '🔥 دوسي على الساخن<small>Clique sur le CHAUD</small>' : '❄️ دوسي على البارد<small>Clique sur le FROID</small>';
      gridEl.innerHTML = '';
      picks.forEach(it => {
        const btn = document.createElement('button'); btn.className = 'g29-item'; btn.textContent = it.emoji;
        btn.dataset.match = it.hot === askHot ? '1' : '0';
        btn.addEventListener('click', () => onChoice(it, btn)); gridEl.appendChild(btn);
      });
      setTimeout(async () => {
        if (askHot) { await speakFr('fr_chaud', 'Chaud'); await sleep(300); await speakEg('ساخن'); }
        else { await speakFr('fr_froid', 'Froid'); await sleep(300); await speakEg('بارد'); }
      }, 300);
    }

    async function onChoice(it, btn) {
      if (locked) return;
      if (it.hot === askHot) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = askHot ? `🎉 Bravo ! ${it.name} ساخن (Chaud)` : `🎉 Bravo ! ${it.name} بارد (Froid)`;
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint');
          hintBox.innerHTML = askHot ? '💡 الساخن = 🔥 ☀️ ☕ 🍲' : '💡 البارد = ❄️ 🧊 🍦 ⛄';
          hintBox.classList.add('visible');
          gridEl.querySelectorAll('[data-match="1"]').forEach(el => {
            el.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fca5a5';
          });
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g29-win';
      win.innerHTML = `<div class="g29-win-emoji">🏆</div><div class="g29-win-title">أحسنتِ يا بطلة!</div><div class="g29-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g29-win-btns"><button class="g29-win-btn g29-win-replay" id="g29-replay">🔄 العبي تاني</button><button class="g29-win-btn g29-win-home" id="g29-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g29-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g29-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g29-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g29-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g29-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g29-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
