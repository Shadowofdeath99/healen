window.Game_43 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, currentPattern = null;
    const PATTERNS = [
      { seq: ['🔴', '🔵', '🔴', '🔵'], next: '🔴', name: 'أحمر/أزرق' },
      { seq: ['⭐', '🌙', '⭐', '🌙'], next: '⭐', name: 'نجمة/قمر' },
      { seq: ['🍎', '🍎', '🍌', '🍎', '🍎'], next: '🍌', name: 'تفاح/موز' },
      { seq: ['🐱', '🐶', '🐱', '🐶'], next: '🐱', name: 'قطة/كلب' },
      { seq: ['1️⃣', '2️⃣', '3️⃣', '1️⃣'], next: '2️⃣', name: '1-2-3' },
      { seq: ['🌞', '🌧️', '🌞', '🌧️'], next: '🌞', name: 'شمس/مطر' }
    ];

    container.innerHTML = `
      <style>
        .g43-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g43-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#06b6d4 0%,#0891b2 50%,#0e7490 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(6,182,212,.35)}
        .g43-title{font-size:1.15rem;font-weight:900}
        .g43-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g43-stage{background:#fff;border:3px solid #a5f3fc;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g43-pop .35s}
        @keyframes g43-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g43-stage.shake{animation:g43-shk .4s}
        @keyframes g43-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g43-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g43-q{font-size:1.15rem;font-weight:900;color:#0e7490;margin-bottom:16px}
        .g43-q small{display:block;font-size:.78rem;color:#22d3ee;font-weight:700;margin-top:2px}
        .g43-seq{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;padding:14px;background:#ecfeff;border-radius:18px;border:2px dashed #67e8f9;direction:ltr}
        .g43-seq-item{font-size:2.4rem;background:#fff;width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.1)}
        .g43-seq-q{font-size:2rem;color:#94a3b8;font-weight:900;background:#fff;width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.1);border:3px dashed #cbd5e1}
        .g43-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:400px;margin:0 auto}
        .g43-choice{background:#fff;border:4px solid #a5f3fc;border-radius:20px;padding:22px 0;font-size:3rem;cursor:pointer;box-shadow:0 6px 0 #67e8f9;transition:all .15s}
        .g43-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #67e8f9}
        .g43-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g43-pop2 .5s}
        .g43-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g43-shk .4s}
        @keyframes g43-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g43-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#0891b2}
        .g43-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g43-hint-box.visible{display:flex}
        .g43-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g43-win-emoji{font-size:4.8rem;animation:g43-bounce 1s infinite}
        @keyframes g43-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g43-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#06b6d4,#0e7490);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g43-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g43-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g43-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g43-win-replay{background:linear-gradient(180deg,#22d3ee,#06b6d4);color:#fff;box-shadow:0 5px 0 #0e7490}
        .g43-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g43-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g43-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g43-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g43-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g43-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g43-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g43-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g43-fall 1.6s linear forwards}
        @keyframes g43-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g43-wrap">
        <div class="g43-header"><div><div class="g43-title">➡️ Suite Logique • كمّل النمط</div></div><div class="g43-progress" id="g43-prog">⭐ 0</div></div>
        <div class="g43-stage" id="g43-stage">
          <button class="g43-parent-btn" id="g43-parent-btn">⚙️</button>
          <div class="g43-q">➡️ إيه اللي يجي بعد كده؟<small>Qu'est-ce qui vient après ?</small></div>
          <div class="g43-seq" id="g43-seq"></div>
          <div class="g43-choices" id="g43-choices"></div>
          <div class="g43-hint-box" id="g43-hint"></div>
          <div class="g43-feedback" id="g43-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g43-stage'), seqEl = document.getElementById('g43-seq');
    const choicesEl = document.getElementById('g43-choices'), hintBox = document.getElementById('g43-hint');
    const msgEl = document.getElementById('g43-msg'), progEl = document.getElementById('g43-prog');

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
      const c = document.createElement('div'); c.className = 'g43-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g43-confetti';
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
      currentPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
      seqEl.innerHTML = '';
      currentPattern.seq.forEach(it => {
        const el = document.createElement('div'); el.className = 'g43-seq-item'; el.textContent = it; seqEl.appendChild(el);
      });
      const qEl = document.createElement('div'); qEl.className = 'g43-seq-q'; qEl.textContent = '?'; seqEl.appendChild(qEl);
      const otherChoices = ['🍇', '🌳', '🎈'].filter(x => x !== currentPattern.next).slice(0, 2);
      const allChoices = shuffle([currentPattern.next, ...otherChoices]);
      choicesEl.innerHTML = '';
      allChoices.forEach(it => {
        const btn = document.createElement('button'); btn.className = 'g43-choice'; btn.textContent = it; btn.dataset.item = it;
        btn.addEventListener('click', () => onChoice(it, btn)); choicesEl.appendChild(btn);
      });
    }

    async function onChoice(item, btn) {
      if (locked) return;
      if (item === currentPattern.next) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        const qBox = seqEl.querySelector('.g43-seq-q');
        if (qBox) { qBox.textContent = item; qBox.style.borderStyle = 'solid'; qBox.style.borderColor = '#22c55e'; }
        msgEl.style.color = '#16a34a'; msgEl.textContent = '🎉 Bravo !';
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 النمط: ${currentPattern.name}`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-item="${currentPattern.next}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #67e8f9';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g43-win';
      win.innerHTML = `<div class="g43-win-emoji">🏆</div><div class="g43-win-title">أحسنتِ يا بطلة!</div><div class="g43-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g43-win-btns"><button class="g43-win-btn g43-win-replay" id="g43-replay">🔄 العبي تاني</button><button class="g43-win-btn g43-win-home" id="g43-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g43-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g43-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g43-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g43-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g43-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g43-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
