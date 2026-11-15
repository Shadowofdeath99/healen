window.Game_50 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, askFruit = false;
    const ITEMS = [
      { fr: 'Pomme',     eg: 'تفاحة',   emoji: '🍎', type: 'fruit' },
      { fr: 'Banane',    eg: 'موزة',    emoji: '🍌', type: 'fruit' },
      { fr: 'Orange',    eg: 'برتقالة', emoji: '🍊', type: 'fruit' },
      { fr: 'Fraise',    eg: 'فراولة',  emoji: '🍓', type: 'fruit' },
      { fr: 'Carotte',   eg: 'جزر',     emoji: '🥕', type: 'legume' },
      { fr: 'Tomate',    eg: 'طماطم',   emoji: '🍅', type: 'legume' },
      { fr: 'Brocoli',   eg: 'بروكلي',  emoji: '🥦', type: 'legume' },
      { fr: 'Concombre', eg: 'خيار',    emoji: '🥒', type: 'legume' }
    ];

    container.innerHTML = `
      <style>
        .g50-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g50-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#15803d 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(34,197,94,.35)}
        .g50-title{font-size:1.15rem;font-weight:900}
        .g50-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g50-stage{background:#fff;border:3px solid #bbf7d0;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g50-pop .35s}
        @keyframes g50-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g50-stage.shake{animation:g50-shk .4s}
        @keyframes g50-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g50-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g50-q{font-size:1.15rem;font-weight:900;color:#15803d;margin-bottom:16px;cursor:pointer}
        .g50-q small{display:block;font-size:.78rem;color:#4ade80;font-weight:700;margin-top:2px}
        .g50-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g50-choice{background:#fff;border:4px solid #bbf7d0;border-radius:20px;padding:22px 0;font-size:3.2rem;cursor:pointer;box-shadow:0 6px 0 #86efac;transition:all .15s}
        .g50-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #86efac}
        .g50-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g50-pop2 .5s}
        .g50-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g50-shk .4s}
        @keyframes g50-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g50-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#16a34a}
        .g50-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g50-hint-box.visible{display:flex}
        .g50-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g50-win-emoji{font-size:4.8rem;animation:g50-bounce 1s infinite}
        @keyframes g50-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g50-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#22c55e,#15803d);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g50-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g50-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g50-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g50-win-replay{background:linear-gradient(180deg,#4ade80,#22c55e);color:#fff;box-shadow:0 5px 0 #15803d}
        .g50-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g50-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g50-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g50-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g50-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g50-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g50-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g50-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g50-fall 1.6s linear forwards}
        @keyframes g50-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g50-wrap">
        <div class="g50-header"><div><div class="g50-title">🍓 Fruits & Légumes • فواكه وخضار</div></div><div class="g50-progress" id="g50-prog">⭐ 0</div></div>
        <div class="g50-stage" id="g50-stage">
          <button class="g50-parent-btn" id="g50-parent-btn">⚙️</button>
          <div class="g50-q" id="g50-q"></div>
          <div class="g50-choices" id="g50-choices"></div>
          <div class="g50-hint-box" id="g50-hint"></div>
          <div class="g50-feedback" id="g50-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g50-stage'), qEl = document.getElementById('g50-q');
    const choicesEl = document.getElementById('g50-choices'), hintBox = document.getElementById('g50-hint');
    const msgEl = document.getElementById('g50-msg'), progEl = document.getElementById('g50-prog');

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
      const c = document.createElement('div'); c.className = 'g50-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g50-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    async function speakQuestion() {
      if (askFruit) { await speakFr(null, 'Un fruit'); await sleep(250); await speakEg('فاكهة'); }
      else { await speakFr(null, 'Un légume'); await sleep(250); await speakEg('خضار'); }
    }
    qEl.addEventListener('click', speakQuestion);

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      askFruit = Math.random() > 0.5;
      qEl.innerHTML = askFruit ? '🍎 دوسي على الفاكهة<small>Clique sur un fruit</small>' : '🥕 دوسي على الخضار<small>Clique sur un légume</small>';
      const wantType = askFruit ? 'fruit' : 'legume';
      const correctPool = ITEMS.filter(i => i.type === wantType);
      const wrongPool = ITEMS.filter(i => i.type !== wantType);
      const correct = correctPool[Math.floor(Math.random() * correctPool.length)];
      const opts = [correct];
      while (opts.length < 3 && opts.length < wrongPool.length + 1) {
        const x = wrongPool[Math.floor(Math.random() * wrongPool.length)];
        if (!opts.find(o => o.emoji === x.emoji)) opts.push(x);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(it => {
        const btn = document.createElement('button'); btn.className = 'g50-choice'; btn.textContent = it.emoji; btn.dataset.emoji = it.emoji; btn.dataset.type = it.type;
        btn.addEventListener('click', () => onChoice(it, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(speakQuestion, 300);
    }

    async function onChoice(item, btn) {
      if (locked) return;
      const wantType = askFruit ? 'fruit' : 'legume';
      if (item.type === wantType) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${item.fr} (${item.eg})`;
        await speakFr(null, item.fr); await sleep(250); await speakEg(item.eg); await sleep(250); await speakPraise(); await sleep(450);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = askFruit ? '💡 الفاكهة = 🍎 🍌 🍊 🍓' : '💡 الخضار = 🥕 🍅 🥦 🥒'; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-type="${wantType}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #86efac';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g50-win';
      win.innerHTML = `<div class="g50-win-emoji">🏆</div><div class="g50-win-title">أحسنتِ يا بطلة!</div><div class="g50-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g50-win-btns"><button class="g50-win-btn g50-win-replay" id="g50-replay">🔄 العبي تاني</button><button class="g50-win-btn g50-win-home" id="g50-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g50-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g50-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g50-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g50-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g50-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g50-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
