window.Game_49 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, currentScene = null;
    const SCENES = [
      { weather: '☀️', fr: 'Il fait chaud', eg: 'الجو حر', correct: '👕👖', name: 'تيشيرت وبنطلون' },
      { weather: '❄️', fr: 'Il fait froid', eg: 'الجو برد', correct: '🧥🧣', name: 'جاكت وكوفية' },
      { weather: '🌧️', fr: 'Il pleut', eg: 'الجو مطر', correct: '☔🧥', name: 'شمسية وجاكت' },
      { weather: '🏖️', fr: 'À la plage', eg: 'على البحر', correct: '🩳🕶️', name: 'شورت ونضارة' }
    ];

    container.innerHTML = `
      <style>
        .g49-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g49-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#ec4899 0%,#db2777 50%,#be185d 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(236,72,153,.35)}
        .g49-title{font-size:1.15rem;font-weight:900}
        .g49-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g49-stage{background:#fff;border:3px solid #fbcfe8;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g49-pop .35s}
        @keyframes g49-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g49-stage.shake{animation:g49-shk .4s}
        @keyframes g49-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g49-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g49-q{font-size:1.15rem;font-weight:900;color:#be185d;margin-bottom:16px}
        .g49-q small{display:block;font-size:.78rem;color:#f472b6;font-weight:700;margin-top:2px}
        .g49-weather{font-size:6rem;margin-bottom:14px;animation:g49-bounce .5s;cursor:pointer}
        @keyframes g49-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g49-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g49-choice{background:#fff;border:4px solid #fbcfe8;border-radius:20px;padding:22px 0;font-size:2.4rem;cursor:pointer;box-shadow:0 6px 0 #f9a8d4;transition:all .15s}
        .g49-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #f9a8d4}
        .g49-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g49-pop2 .5s}
        .g49-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g49-shk .4s}
        @keyframes g49-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g49-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#db2777}
        .g49-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g49-hint-box.visible{display:flex}
        .g49-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g49-win-emoji{font-size:4.8rem;animation:g49-bounce2 1s infinite}
        @keyframes g49-bounce2{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g49-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#ec4899,#be185d);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g49-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g49-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g49-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g49-win-replay{background:linear-gradient(180deg,#f472b6,#ec4899);color:#fff;box-shadow:0 5px 0 #be185d}
        .g49-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g49-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g49-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g49-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g49-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g49-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g49-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g49-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g49-fall 1.6s linear forwards}
        @keyframes g49-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g49-wrap">
        <div class="g49-header"><div><div class="g49-title">👕 S'habiller • الملابس</div></div><div class="g49-progress" id="g49-prog">⭐ 0</div></div>
        <div class="g49-stage" id="g49-stage">
          <button class="g49-parent-btn" id="g49-parent-btn">⚙️</button>
          <div class="g49-q" id="g49-q"></div>
          <div class="g49-weather" id="g49-weather"></div>
          <div class="g49-choices" id="g49-choices"></div>
          <div class="g49-hint-box" id="g49-hint"></div>
          <div class="g49-feedback" id="g49-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g49-stage'), qEl = document.getElementById('g49-q');
    const weatherEl = document.getElementById('g49-weather'), choicesEl = document.getElementById('g49-choices');
    const hintBox = document.getElementById('g49-hint'), msgEl = document.getElementById('g49-msg'), progEl = document.getElementById('g49-prog');

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
      const c = document.createElement('div'); c.className = 'g49-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g49-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    async function speakScene() {
      if (!currentScene) return;
      await speakFr(null, currentScene.fr);
      await sleep(300);
      await speakEg(currentScene.eg);
    }
    weatherEl.addEventListener('click', speakScene);

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      currentScene = SCENES[Math.floor(Math.random() * SCENES.length)];
      qEl.innerHTML = `👕 ${currentScene.eg} — نلبس إيه؟<small>${currentScene.fr} — Que mettre ?</small>`;
      weatherEl.textContent = currentScene.weather;
      const allOutfits = SCENES.map(s => s.correct);
      const opts = [currentScene.correct];
      while (opts.length < 3 && opts.length < allOutfits.length) {
        const x = allOutfits[Math.floor(Math.random() * allOutfits.length)];
        if (!opts.includes(x)) opts.push(x);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(o => {
        const btn = document.createElement('button'); btn.className = 'g49-choice'; btn.textContent = o; btn.dataset.outfit = o;
        btn.addEventListener('click', () => onChoice(o, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(speakScene, 300);
    }

    async function onChoice(outfit, btn) {
      if (locked) return;
      if (outfit === currentScene.correct) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${currentScene.name}`;
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 ${currentScene.eg} نلبس ${currentScene.name}`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-outfit="${currentScene.correct}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #f9a8d4';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g49-win';
      win.innerHTML = `<div class="g49-win-emoji">🏆</div><div class="g49-win-title">أحسنتِ يا بطلة!</div><div class="g49-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g49-win-btns"><button class="g49-win-btn g49-win-replay" id="g49-replay">🔄 العبي تاني</button><button class="g49-win-btn g49-win-home" id="g49-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g49-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g49-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g49-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g49-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g49-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g49-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
