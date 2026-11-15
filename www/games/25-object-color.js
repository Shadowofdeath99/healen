window.Game_25 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, target = null, currentObj = null;
    const OBJECTS = [
      { emoji: '🍎', color: 'Rouge' }, { emoji: '🌊', color: 'Bleu' },
      { emoji: '☀️', color: 'Jaune' }, { emoji: '🌿', color: 'Vert' },
      { emoji: '🍊', color: 'Orange' }, { emoji: '🍇', color: 'Violet' },
      { emoji: '🌸', color: 'Rose' }, { emoji: '☁️', color: 'Blanc' },
      { emoji: '🐻', color: 'Marron' }, { emoji: '🌙', color: 'Noir' }
    ];

    container.innerHTML = `
      <style>
        .g25-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g25-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(16,185,129,.35)}
        .g25-title{font-size:1.15rem;font-weight:900}
        .g25-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g25-stage{background:#fff;border:3px solid #a7f3d0;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g25-pop .35s}
        @keyframes g25-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g25-stage.shake{animation:g25-shk .4s}
        @keyframes g25-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g25-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g25-q{font-size:1.05rem;font-weight:900;color:#047857;margin-bottom:12px}
        .g25-q small{display:block;font-size:.78rem;color:#34d399;font-weight:700;margin-top:2px}
        .g25-obj{font-size:7rem;margin-bottom:14px;animation:g25-bounce .5s}
        @keyframes g25-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g25-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .g25-choice{height:80px;border-radius:18px;border:4px solid #cbd5e1;cursor:pointer;box-shadow:0 5px 0 #94a3b8;transition:all .15s;font-size:1.05rem;font-weight:900}
        .g25-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #94a3b8}
        .g25-choice.correct{border-color:#16a34a;box-shadow:0 0 0 5px #22c55e,0 5px 0 #15803d;animation:g25-pop2 .5s}
        .g25-choice.wrong{border-color:#ef4444;box-shadow:0 0 0 5px #f87171,0 5px 0 #b91c1c;animation:g25-shk .4s}
        @keyframes g25-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g25-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#059669}
        .g25-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g25-hint-box.visible{display:flex}
        .g25-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g25-win-emoji{font-size:4.8rem;animation:g25-bounce 1s infinite}
        .g25-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#10b981,#047857);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g25-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g25-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g25-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g25-win-replay{background:linear-gradient(180deg,#34d399,#10b981);color:#fff;box-shadow:0 5px 0 #047857}
        .g25-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g25-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g25-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g25-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g25-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g25-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g25-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g25-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g25-fall 1.6s linear forwards}
        @keyframes g25-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g25-wrap">
        <div class="g25-header"><div><div class="g25-title">🍎 Couleur de l'Objet</div></div><div class="g25-progress" id="g25-prog">⭐ 0</div></div>
        <div class="g25-stage" id="g25-stage">
          <button class="g25-parent-btn" id="g25-parent-btn">⚙️</button>
          <div class="g25-q">🍎 لونه إيه؟<small>Quelle est sa couleur ?</small></div>
          <div class="g25-obj" id="g25-obj"></div>
          <div class="g25-choices" id="g25-choices"></div>
          <div class="g25-hint-box" id="g25-hint"></div>
          <div class="g25-feedback" id="g25-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g25-stage'), objEl = document.getElementById('g25-obj');
    const choicesEl = document.getElementById('g25-choices'), hintBox = document.getElementById('g25-hint');
    const msgEl = document.getElementById('g25-msg'), progEl = document.getElementById('g25-prog');

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
      const c = document.createElement('div'); c.className = 'g25-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g25-confetti';
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
      currentObj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
      const allColors = window.SHARED_COLORS || [];
      target = allColors.find(c => c.fr === currentObj.color);
      if (!target) { msgEl.textContent = 'بيانات ناقصة'; return; }
      objEl.textContent = currentObj.emoji;
      const opts = [target];
      while (opts.length < 3 && opts.length < allColors.length) {
        const c = allColors[Math.floor(Math.random() * allColors.length)];
        if (!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(c => {
        const btn = document.createElement('button'); btn.className = 'g25-choice'; btn.style.background = c.hex;
        btn.style.color = (c.fr === 'Blanc' || c.fr === 'Jaune') ? '#1e293b' : '#fff';
        btn.textContent = c.fr; btn.dataset.fr = c.fr;
        btn.addEventListener('click', () => onChoice(c, btn)); choicesEl.appendChild(btn);
      });
    }

    async function onChoice(c, btn) {
      if (locked) return;
      if (c.fr === target.fr) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${currentObj.emoji} ${target.fr} (${target.eg})`;
        await speakColor(target, 'both'); await sleep(350); await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 اللون: ${target.fr} (${target.eg})`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #94a3b8';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g25-win';
      win.innerHTML = `<div class="g25-win-emoji">🏆</div><div class="g25-win-title">أحسنتِ يا بطلة!</div><div class="g25-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g25-win-btns"><button class="g25-win-btn g25-win-replay" id="g25-replay">🔄 العبي تاني</button><button class="g25-win-btn g25-win-home" id="g25-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g25-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g25-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g25-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g25-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g25-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g25-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
