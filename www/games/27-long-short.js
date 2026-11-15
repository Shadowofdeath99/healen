window.Game_27 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, askLong = false, winner = 'top';

    container.innerHTML = `
      <style>
        .g27-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g27-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f472b6 0%,#ec4899 50%,#db2777 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(244,114,182,.35)}
        .g27-title{font-size:1.15rem;font-weight:900}
        .g27-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g27-stage{background:#fff;border:3px solid #fbcfe8;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g27-pop .35s}
        @keyframes g27-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g27-stage.shake{animation:g27-shk .4s}
        @keyframes g27-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g27-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g27-q{font-size:1.15rem;font-weight:900;color:#be185d;margin-bottom:16px}
        .g27-q small{display:block;font-size:.78rem;color:#f472b6;font-weight:700;margin-top:2px}
        .g27-col{display:flex;flex-direction:column;gap:18px;margin-bottom:14px;align-items:center;padding:12px 0}
        .g27-bar{border-radius:18px;cursor:pointer;transition:all .15s;position:relative;height:62px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:0 5px 0 rgba(0,0,0,.12)}
        .g27-bar:active{transform:translateY(2px)}
        .g27-bar.correct{box-shadow:0 0 0 5px #22c55e,0 4px 10px rgba(0,0,0,.2);animation:g27-pop2 .5s}
        .g27-bar.wrong{animation:g27-shk .4s}
        @keyframes g27-pop2{0%{transform:scale(1)}45%{transform:scale(1.05)}100%{transform:scale(1)}}
        .g27-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#db2777}
        .g27-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g27-hint-box.visible{display:flex}
        .g27-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g27-win-emoji{font-size:4.8rem;animation:g27-bounce 1s infinite}
        @keyframes g27-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g27-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#f472b6,#db2777);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g27-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g27-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g27-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g27-win-replay{background:linear-gradient(180deg,#f472b6,#ec4899);color:#fff;box-shadow:0 5px 0 #be185d}
        .g27-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g27-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g27-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g27-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g27-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g27-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g27-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g27-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g27-fall 1.6s linear forwards}
        @keyframes g27-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g27-wrap">
        <div class="g27-header"><div><div class="g27-title">📏 Long / Court • طويل وقصير</div></div><div class="g27-progress" id="g27-prog">⭐ 0</div></div>
        <div class="g27-stage" id="g27-stage">
          <button class="g27-parent-btn" id="g27-parent-btn">⚙️</button>
          <div class="g27-q" id="g27-q"></div>
          <div class="g27-col" id="g27-col"></div>
          <div class="g27-hint-box" id="g27-hint"></div>
          <div class="g27-feedback" id="g27-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g27-stage'), qEl = document.getElementById('g27-q');
    const colEl = document.getElementById('g27-col'), hintBox = document.getElementById('g27-hint');
    const msgEl = document.getElementById('g27-msg'), progEl = document.getElementById('g27-prog');

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
      const c = document.createElement('div'); c.className = 'g27-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g27-confetti';
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
      askLong = Math.random() > 0.5;
      const longTop = Math.random() > 0.5;
      const topW = longTop ? '90%' : '32%';
      const botW = longTop ? '32%' : '90%';
      winner = (askLong === longTop) ? 'top' : 'bottom';
      qEl.innerHTML = askLong ? '📏 دوسي على الطويل<small>Clique sur le LONG</small>' : '📏 دوسي على القصير<small>Clique sur le COURT</small>';
      colEl.innerHTML = `
        <div class="g27-bar" data-side="top" style="background:linear-gradient(135deg,#60a5fa,#3b82f6);width:${topW};min-width:95px">${longTop ? '🚂🚃🚃🚃' : '🚂'}</div>
        <div class="g27-bar" data-side="bottom" style="background:linear-gradient(135deg,#f472b6,#ec4899);width:${botW};min-width:95px">${!longTop ? '🚂🚃🚃🚃' : '🚂'}</div>`;
      colEl.querySelectorAll('[data-side]').forEach(el => {
        el.addEventListener('click', () => onPick(el.dataset.side, el));
      });
      setTimeout(async () => {
        if (askLong) { await speakFr('fr_long', 'Long'); await sleep(300); await speakEg('الطويل'); }
        else { await speakFr('fr_court', 'Court'); await sleep(300); await speakEg('القصير'); }
      }, 300);
    }

    async function onPick(side, el) {
      if (locked) return;
      if (side === winner) {
        locked = true; el.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = askLong ? '🎉 Bravo ! الطويل (Long)' : '🎉 Bravo ! القصير (Court)';
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; el.classList.add('wrong'); setTimeout(() => el.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint');
          hintBox.innerHTML = askLong ? '💡 الطويل هو القطار الأطول' : '💡 القصير هو القطار الأقصر';
          hintBox.classList.add('visible');
          const cb = colEl.querySelector(`[data-side="${winner}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g27-win';
      win.innerHTML = `<div class="g27-win-emoji">🏆</div><div class="g27-win-title">أحسنتِ يا بطلة!</div><div class="g27-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g27-win-btns"><button class="g27-win-btn g27-win-replay" id="g27-replay">🔄 العبي تاني</button><button class="g27-win-btn g27-win-home" id="g27-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g27-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g27-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g27-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g27-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g27-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g27-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
