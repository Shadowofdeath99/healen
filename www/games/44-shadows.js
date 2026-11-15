window.Game_44 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, target = null;

    container.innerHTML = `
      <style>
        .g44-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g44-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#475569 0%,#334155 50%,#1e293b 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(71,85,105,.35)}
        .g44-title{font-size:1.15rem;font-weight:900}
        .g44-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g44-stage{background:#fff;border:3px solid #cbd5e1;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g44-pop .35s}
        @keyframes g44-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g44-stage.shake{animation:g44-shk .4s}
        @keyframes g44-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g44-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g44-q{font-size:1.15rem;font-weight:900;color:#1e293b;margin-bottom:16px}
        .g44-q small{display:block;font-size:.78rem;color:#64748b;font-weight:700;margin-top:2px}
        .g44-shadow{font-size:6rem;margin-bottom:16px;filter:brightness(0) contrast(0);opacity:.75;animation:g44-bounce .5s;transition:filter .3s}
        .g44-shadow.revealed{filter:none;opacity:1}
        @keyframes g44-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g44-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g44-choice{background:#fff;border:4px solid #cbd5e1;border-radius:20px;padding:22px 0;font-size:3rem;cursor:pointer;box-shadow:0 6px 0 #94a3b8;transition:all .15s}
        .g44-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #94a3b8}
        .g44-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g44-pop2 .5s}
        .g44-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g44-shk .4s}
        @keyframes g44-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g44-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#334155}
        .g44-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g44-hint-box.visible{display:flex}
        .g44-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g44-win-emoji{font-size:4.8rem;animation:g44-bounce2 1s infinite}
        @keyframes g44-bounce2{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g44-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#475569,#1e293b);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g44-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g44-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g44-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g44-win-replay{background:linear-gradient(180deg,#64748b,#475569);color:#fff;box-shadow:0 5px 0 #1e293b}
        .g44-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g44-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g44-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g44-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g44-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g44-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g44-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g44-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g44-fall 1.6s linear forwards}
        @keyframes g44-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g44-wrap">
        <div class="g44-header"><div><div class="g44-title">👤 Ombres • الظلال</div></div><div class="g44-progress" id="g44-prog">⭐ 0</div></div>
        <div class="g44-stage" id="g44-stage">
          <button class="g44-parent-btn" id="g44-parent-btn">⚙️</button>
          <div class="g44-q">👤 مين صاحب الظل ده؟<small>À qui est cette ombre ?</small></div>
          <div class="g44-shadow" id="g44-shadow"></div>
          <div class="g44-choices" id="g44-choices"></div>
          <div class="g44-hint-box" id="g44-hint"></div>
          <div class="g44-feedback" id="g44-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g44-stage'), shadowEl = document.getElementById('g44-shadow');
    const choicesEl = document.getElementById('g44-choices'), hintBox = document.getElementById('g44-hint');
    const msgEl = document.getElementById('g44-msg'), progEl = document.getElementById('g44-prog');

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
    async function speakAnimal(a, lang) {
      if (!a) return;
      try {
        if (lang === 'fr') await Audio2.play(a.frId, { text: a.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(null, { text: a.eg, lang: 'eg' });
        else { await Audio2.play(a.frId, { text: a.fr, lang: 'fr' }); await sleep(350); await Audio2.play(null, { text: a.eg, lang: 'eg' }); }
      } catch (e) {}
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play(null, { text: 'برافو!', lang: 'eg' }); } catch (e) {} }
    async function speakEncourage() { try { await Audio2.play(null, { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {} }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g44-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g44-confetti';
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
      shadowEl.classList.remove('revealed');
      const animals = (window.SHARED?.animals || []);
      if (!animals.length) { msgEl.textContent = 'الحيوانات غير متاحة'; return; }
      target = animals[Math.floor(Math.random() * animals.length)];
      shadowEl.textContent = target.emoji;
      const opts = [target];
      while (opts.length < 3 && opts.length < animals.length) {
        const a = animals[Math.floor(Math.random() * animals.length)];
        if (!opts.find(o => o.emoji === a.emoji)) opts.push(a);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(a => {
        const btn = document.createElement('button'); btn.className = 'g44-choice'; btn.textContent = a.emoji; btn.dataset.emoji = a.emoji;
        btn.addEventListener('click', () => onChoice(a, btn)); choicesEl.appendChild(btn);
      });
    }

    async function onChoice(a, btn) {
      if (locked) return;
      if (a.emoji === target.emoji) {
        locked = true; btn.classList.add('correct'); shadowEl.classList.add('revealed'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        await speakAnimal(target, 'both'); await sleep(350); await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 الظل لـ ${target.eg}`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-emoji="${target.emoji}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #94a3b8';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g44-win';
      win.innerHTML = `<div class="g44-win-emoji">🏆</div><div class="g44-win-title">أحسنتِ يا بطلة!</div><div class="g44-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g44-win-btns"><button class="g44-win-btn g44-win-replay" id="g44-replay">🔄 العبي تاني</button><button class="g44-win-btn g44-win-home" id="g44-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g44-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g44-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g44-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g44-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g44-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g44-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
