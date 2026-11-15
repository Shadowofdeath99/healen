window.Game_24 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, target = null, cA = null, cB = null;

    container.innerHTML = `
      <style>
        .g24-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g24-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 50%,#6d28d9 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(139,92,246,.35)}
        .g24-title{font-size:1.15rem;font-weight:900}
        .g24-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g24-stage{background:#fff;border:3px solid #ddd6fe;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g24-pop .35s}
        @keyframes g24-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g24-stage.shake{animation:g24-shk .4s}
        @keyframes g24-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g24-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g24-q{font-size:1.05rem;font-weight:900;color:#6d28d9;margin-bottom:12px}
        .g24-q small{display:block;font-size:.78rem;color:#a78bfa;font-weight:700;margin-top:2px}
        .g24-mix{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:16px;padding:12px;background:#f5f3ff;border-radius:18px;border:2px dashed #ddd6fe;flex-wrap:wrap;direction:ltr}
        .g24-circle{width:70px;height:70px;border-radius:50%;border:3px solid #cbd5e1;box-shadow:0 4px 10px rgba(0,0,0,.15);cursor:pointer}
        .g24-op{font-size:1.8rem;font-weight:900;color:#6d28d9}
        .g24-qmark{font-size:2.2rem;font-weight:900;color:#94a3b8}
        .g24-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g24-choice{height:100px;border-radius:20px;border:4px solid #cbd5e1;cursor:pointer;box-shadow:0 6px 0 #94a3b8;transition:all .15s}
        .g24-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #94a3b8}
        .g24-choice.correct{border-color:#16a34a;box-shadow:0 0 0 5px #22c55e,0 6px 0 #15803d;animation:g24-pop2 .5s}
        .g24-choice.wrong{border-color:#ef4444;box-shadow:0 0 0 5px #f87171,0 6px 0 #b91c1c;animation:g24-shk .4s}
        @keyframes g24-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g24-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#7c3aed}
        .g24-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g24-hint-box.visible{display:flex}
        .g24-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g24-win-emoji{font-size:4.8rem;animation:g24-bounce 1s infinite}
        @keyframes g24-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g24-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#8b5cf6,#6d28d9);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g24-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g24-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g24-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g24-win-replay{background:linear-gradient(180deg,#a78bfa,#8b5cf6);color:#fff;box-shadow:0 5px 0 #6d28d9}
        .g24-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g24-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g24-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g24-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g24-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g24-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g24-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g24-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g24-fall 1.6s linear forwards}
        @keyframes g24-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g24-wrap">
        <div class="g24-header"><div><div class="g24-title">🌀 Mélange les Couleurs</div></div><div class="g24-progress" id="g24-prog">⭐ 0</div></div>
        <div class="g24-stage" id="g24-stage">
          <button class="g24-parent-btn" id="g24-parent-btn">⚙️</button>
          <div class="g24-q">🌀 لو خلطنا اللونين دول، يطلع إيه؟<small>Mélange les couleurs</small></div>
          <div class="g24-mix" id="g24-mix"></div>
          <div class="g24-choices" id="g24-choices"></div>
          <div class="g24-hint-box" id="g24-hint"></div>
          <div class="g24-feedback" id="g24-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g24-stage'), mixEl = document.getElementById('g24-mix');
    const choicesEl = document.getElementById('g24-choices'), hintBox = document.getElementById('g24-hint');
    const msgEl = document.getElementById('g24-msg'), progEl = document.getElementById('g24-prog');

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
      const c = document.createElement('div'); c.className = 'g24-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g24-confetti';
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
      const mixes = window.COLOR_MIX || [];
      if (!mixes.length) { msgEl.textContent = 'بيانات خلط الألوان ناقصة'; return; }
      const mix = mixes[Math.floor(Math.random() * mixes.length)];
      const allColors = window.SHARED_COLORS || [];
      cA = allColors.find(x => x.fr === mix.a); cB = allColors.find(x => x.fr === mix.b);
      target = allColors.find(x => x.fr === mix.result);
      if (!cA || !cB || !target) { msgEl.textContent = 'بيانات الألوان ناقصة'; return; }
      mixEl.innerHTML = `<div class="g24-circle" id="g24-ca" style="background:${cA.hex}" title="${cA.fr}"></div><div class="g24-op">+</div><div class="g24-circle" id="g24-cb" style="background:${cB.hex}" title="${cB.fr}"></div><div class="g24-op">=</div><div class="g24-qmark">?</div>`;
      document.getElementById('g24-ca').addEventListener('click', () => speakColor(cA, 'both'));
      document.getElementById('g24-cb').addEventListener('click', () => speakColor(cB, 'both'));
      const opts = [target];
      while (opts.length < 3 && opts.length < allColors.length) {
        const c = allColors[Math.floor(Math.random() * allColors.length)];
        if (!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(c => {
        const btn = document.createElement('button'); btn.className = 'g24-choice'; btn.style.background = c.hex; btn.dataset.fr = c.fr;
        btn.addEventListener('click', () => onChoice(c, btn)); choicesEl.appendChild(btn);
      });
    }

    async function onChoice(c, btn) {
      if (locked) return;
      if (c.fr === target.fr) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${cA.fr} + ${cB.fr} = ${target.fr}`;
        await speakColor(target, 'both'); await sleep(350); await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 الناتج: ${target.fr} (${target.eg})`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #94a3b8';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g24-win';
      win.innerHTML = `<div class="g24-win-emoji">🏆</div><div class="g24-win-title">أحسنتِ يا بطلة!</div><div class="g24-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g24-win-btns"><button class="g24-win-btn g24-win-replay" id="g24-replay">🔄 العبي تاني</button><button class="g24-win-btn g24-win-home" id="g24-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g24-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g24-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g24-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g24-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g24-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g24-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
