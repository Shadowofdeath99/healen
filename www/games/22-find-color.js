window.Game_22 = {
  async mount(container) {
    const MAX_COLORS = 10;
    const TOTAL_ROUNDS = 5;
    const UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g22_unlocked';

    let unlockedMax = Math.min(MAX_COLORS, Math.max(3, parseInt(localStorage.getItem(STORAGE_KEY) || '3', 10)));
    let successCount = 0, round = 0, stars = 0, wrongThisRound = 0, locked = false;
    let target = null;

    container.innerHTML = `
      <style>
        .g22-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g22-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#3b82f6 0%,#6366f1 50%,#8b5cf6 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(59,130,246,.35);position:relative;overflow:hidden}
        .g22-header::after{content:'';position:absolute;top:-60%;left:-30%;width:70%;height:220%;background:linear-gradient(120deg,rgba(255,255,255,.35),transparent 60%);transform:rotate(15deg);pointer-events:none}
        .g22-title{font-size:1.15rem;font-weight:900}
        .g22-unlock{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g22-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g22-stage{background:#fff;border:3px solid #bfdbfe;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g22-pop .35s cubic-bezier(.34,1.56,.64,1)}
        @keyframes g22-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g22-stage.shake{animation:g22-shk .4s}
        @keyframes g22-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g22-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g22-q{font-size:1.05rem;font-weight:900;color:#4338ca;margin-bottom:12px}
        .g22-q small{display:block;font-size:.78rem;color:#818cf8;font-weight:700;margin-top:2px}
        .g22-target{font-size:2.6rem;font-weight:900;color:#4338ca;margin-bottom:6px;min-height:54px;cursor:pointer}
        .g22-target-eg{font-size:1.2rem;font-weight:700;color:#6366f1;margin-bottom:14px}
        .g22-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g22-choice{height:100px;border-radius:20px;border:4px solid #cbd5e1;cursor:pointer;box-shadow:0 6px 0 #94a3b8;transition:all .15s}
        .g22-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #94a3b8}
        .g22-choice.correct{border-color:#16a34a;box-shadow:0 0 0 5px #22c55e,0 6px 0 #15803d;animation:g22-pop2 .5s}
        .g22-choice.wrong{border-color:#ef4444;box-shadow:0 0 0 5px #f87171,0 6px 0 #b91c1c;animation:g22-shk .4s}
        @keyframes g22-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g22-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#6366f1}
        .g22-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g22-hint-box.visible{display:flex}
        .g22-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;animation:g22-pop .4s;padding:20px}
        .g22-win-emoji{font-size:4.8rem;animation:g22-bounce 1s infinite}
        @keyframes g22-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g22-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g22-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g22-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g22-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer;transition:transform .15s}
        .g22-win-btn:active{transform:scale(.95)}
        .g22-win-replay{background:linear-gradient(180deg,#60a5fa,#3b82f6);color:#fff;box-shadow:0 5px 0 #1d4ed8}
        .g22-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g22-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g22-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9;overflow-y:auto}
        .g22-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g22-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g22-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g22-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g22-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g22-fall 1.6s linear forwards}
        @keyframes g22-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g22-wrap">
        <div class="g22-header">
          <div><div class="g22-title">🔍 Trouve la Couleur</div><div class="g22-unlock" id="g22-unlock">🔓 3 ألوان</div></div>
          <div class="g22-progress" id="g22-prog">⭐ 0</div>
        </div>
        <div class="g22-stage" id="g22-stage">
          <button class="g22-parent-btn" id="g22-parent-btn">⚙️</button>
          <div class="g22-q">🔍 لاقي اللون ده<small>Trouve cette couleur</small></div>
          <div class="g22-target" id="g22-target"></div>
          <div class="g22-target-eg" id="g22-target-eg"></div>
          <div class="g22-choices" id="g22-choices"></div>
          <div class="g22-hint-box" id="g22-hint"></div>
          <div class="g22-feedback" id="g22-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g22-stage');
    const targetEl = document.getElementById('g22-target');
    const targetEgEl = document.getElementById('g22-target-eg');
    const choicesEl = document.getElementById('g22-choices');
    const hintBox = document.getElementById('g22-hint');
    const msgEl = document.getElementById('g22-msg');
    const progEl = document.getElementById('g22-prog');
    const unlockEl = document.getElementById('g22-unlock');

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
    function playCorrect() { playTone(523, .15); setTimeout(() => playTone(659, .15), 120); setTimeout(() => playTone(784, .25), 240); }
    function playError() { playTone(196, .25, 'square'); }
    function playUnlock() { playTone(523, .12); setTimeout(() => playTone(659, .12), 100); setTimeout(() => playTone(784, .12), 200); setTimeout(() => playTone(1047, .3), 300); }

    function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
    function saveUnlocked() { try { localStorage.setItem(STORAGE_KEY, String(unlockedMax)); } catch (e) {} }
    function updateProgress() { progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`; unlockEl.textContent = `🔓 ${unlockedMax} ألوان`; }

    async function speakColor(c, lang) {
      if (!c) return;
      try {
        if (lang === 'fr') await Audio2.play(c.frId, { text: c.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(null, { text: c.eg, lang: 'eg' });
        else { await Audio2.play(c.frId, { text: c.fr, lang: 'fr' }); await sleep(350); await Audio2.play(null, { text: c.eg, lang: 'eg' }); }
      } catch (e) {}
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {} }
    async function speakEncourage() { try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {} }

    function confetti() {
      const c = document.createElement('div'); c.className = 'g22-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g22-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); playCorrect(); }

    function tryUnlock() {
      successCount++;
      if (successCount >= UNLOCK_EVERY && unlockedMax < MAX_COLORS) {
        successCount = 0; unlockedMax++; saveUnlocked(); updateProgress(); playUnlock();
      }
    }

    targetEl.addEventListener('click', () => speakColor(target, 'both'));

    function newRound() {
      round++; wrongThisRound = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      const colors = (window.SHARED_COLORS || []).slice(0, unlockedMax);
      target = colors[Math.floor(Math.random() * colors.length)];
      targetEl.textContent = target.fr; targetEgEl.textContent = target.eg;
      const opts = [target];
      while (opts.length < 3 && opts.length < colors.length) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        if (!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(c => {
        const btn = document.createElement('button'); btn.className = 'g22-choice'; btn.style.background = c.hex; btn.dataset.fr = c.fr;
        btn.addEventListener('click', () => onChoice(c, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(() => speakColor(target, 'fr'), 300);
    }

    async function onChoice(c, btn) {
      if (locked) return;
      if (c.fr === target.fr) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        await speakColor(target, 'both'); await sleep(350); await speakPraise(); await sleep(450);
        tryUnlock(); await sleep(300);
        if (round >= TOTAL_ROUNDS) showWin(); else newRound();
      } else {
        wrongThisRound++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        playError(); await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 اللون: ${target.fr} (${target.eg})`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #94a3b8';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g22-win';
      win.innerHTML = `<div class="g22-win-emoji">🏆</div><div class="g22-win-title">أحسنتِ يا بطلة!</div><div class="g22-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g22-win-btns"><button class="g22-win-btn g22-win-replay" id="g22-replay">🔄 العبي تاني</button><button class="g22-win-btn g22-win-home" id="g22-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g22-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; successCount = 0; newRound(); });
      document.getElementById('g22-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g22-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g22-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الألوان المتاحة</span><strong>${unlockedMax}/${MAX_COLORS}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g22-pu">🔓 فتح كل الألوان</button><button id="g22-pc">إغلاق</button>`;
      stageEl.appendChild(p);
      document.getElementById('g22-pu').addEventListener('click', () => { unlockedMax = MAX_COLORS; saveUnlocked(); updateProgress(); playUnlock(); confetti(); p.remove(); });
      document.getElementById('g22-pc').addEventListener('click', () => p.remove());
    });

    newRound();
  }
};
