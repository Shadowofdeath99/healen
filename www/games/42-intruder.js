window.Game_42 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, currentGroup = null;
    const GROUPS = [
      { common: ['🍎', '🍌', '🍊', '🍇'], intruder: '🚗', name: 'فواكه' },
      { common: ['🐱', '🐶', '🐮', '🐷'], intruder: '🌳', name: 'حيوانات' },
      { common: ['🔴', '🔵', '🟡', '🟢'], intruder: '⭐', name: 'ألوان' },
      { common: ['🍕', '🍔', '🌭', '🍟'], intruder: '👕', name: 'أكل' },
      { common: ['⚽', '🏀', '🎾', '🏐'], intruder: '📚', name: 'رياضة' },
      { common: ['🚗', '🚕', '🚌', '🚓'], intruder: '🌺', name: 'عربيات' }
    ];

    container.innerHTML = `
      <style>
        .g42-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g42-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f59e0b 0%,#d97706 50%,#b45309 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(245,158,11,.35)}
        .g42-title{font-size:1.15rem;font-weight:900}
        .g42-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g42-stage{background:#fff;border:3px solid #fde68a;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g42-pop .35s}
        @keyframes g42-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g42-stage.shake{animation:g42-shk .4s}
        @keyframes g42-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g42-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g42-q{font-size:1.15rem;font-weight:900;color:#b45309;margin-bottom:16px}
        .g42-q small{display:block;font-size:.78rem;color:#f59e0b;font-weight:700;margin-top:2px}
        .g42-choices{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:400px;margin:0 auto}
        .g42-choice{background:#fff;border:4px solid #fde68a;border-radius:20px;padding:22px 0;font-size:3.5rem;cursor:pointer;box-shadow:0 6px 0 #fcd34d;transition:all .15s}
        .g42-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #fcd34d}
        .g42-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g42-pop2 .5s}
        .g42-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g42-shk .4s}
        @keyframes g42-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g42-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#d97706}
        .g42-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g42-hint-box.visible{display:flex}
        .g42-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g42-win-emoji{font-size:4.8rem;animation:g42-bounce 1s infinite}
        @keyframes g42-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g42-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#f59e0b,#b45309);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g42-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g42-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g42-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g42-win-replay{background:linear-gradient(180deg,#fbbf24,#f59e0b);color:#fff;box-shadow:0 5px 0 #b45309}
        .g42-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g42-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g42-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g42-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g42-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g42-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g42-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g42-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g42-fall 1.6s linear forwards}
        @keyframes g42-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g42-wrap">
        <div class="g42-header"><div><div class="g42-title">🕵️ Trouve l'Intrus • الدخيل</div></div><div class="g42-progress" id="g42-prog">⭐ 0</div></div>
        <div class="g42-stage" id="g42-stage">
          <button class="g42-parent-btn" id="g42-parent-btn">⚙️</button>
          <div class="g42-q">🕵️ مين الدخيل اللي مش زي الباقي؟<small>Trouve l'intrus</small></div>
          <div class="g42-choices" id="g42-choices"></div>
          <div class="g42-hint-box" id="g42-hint"></div>
          <div class="g42-feedback" id="g42-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g42-stage'), choicesEl = document.getElementById('g42-choices');
    const hintBox = document.getElementById('g42-hint'), msgEl = document.getElementById('g42-msg'), progEl = document.getElementById('g42-prog');

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
      const c = document.createElement('div'); c.className = 'g42-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g42-confetti';
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
      currentGroup = GROUPS[Math.floor(Math.random() * GROUPS.length)];
      const items = [...currentGroup.common.slice(0, 3), currentGroup.intruder].sort(() => Math.random() - 0.5);
      choicesEl.innerHTML = '';
      items.forEach(it => {
        const btn = document.createElement('button'); btn.className = 'g42-choice'; btn.textContent = it; btn.dataset.item = it;
        btn.addEventListener('click', () => onChoice(it, btn)); choicesEl.appendChild(btn);
      });
    }

    async function onChoice(item, btn) {
      if (locked) return;
      if (item === currentGroup.intruder) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! الدخيل هو ${item}`;
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 الباقي كلهم ${currentGroup.name}`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-item="${currentGroup.intruder}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fcd34d';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g42-win';
      win.innerHTML = `<div class="g42-win-emoji">🏆</div><div class="g42-win-title">أحسنتِ يا بطلة!</div><div class="g42-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g42-win-btns"><button class="g42-win-btn g42-win-replay" id="g42-replay">🔄 العبي تاني</button><button class="g42-win-btn g42-win-home" id="g42-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g42-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g42-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g42-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g42-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g42-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g42-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
