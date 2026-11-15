window.Game_48 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, target = null;
    const EMOTIONS = [
      { fr: 'Content', eg: 'مبسوط', emoji: '😊' },
      { fr: 'Triste', eg: 'زعلان', emoji: '😢' },
      { fr: 'Fâché', eg: 'غضبان', emoji: '😠' },
      { fr: 'Surpris', eg: 'متفاجئ', emoji: '😲' },
      { fr: 'Peur', eg: 'خايف', emoji: '😨' },
      { fr: 'Fatigué', eg: 'تعبان', emoji: '😴' }
    ];

    container.innerHTML = `
      <style>
        .g48-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g48-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#eab308 0%,#ca8a04 50%,#a16207 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(234,179,8,.35)}
        .g48-title{font-size:1.15rem;font-weight:900}
        .g48-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g48-stage{background:#fff;border:3px solid #fde68a;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g48-pop .35s}
        @keyframes g48-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g48-stage.shake{animation:g48-shk .4s}
        @keyframes g48-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g48-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g48-q{font-size:1.15rem;font-weight:900;color:#a16207;margin-bottom:16px;cursor:pointer}
        .g48-q small{display:block;font-size:.78rem;color:#eab308;font-weight:700;margin-top:2px}
        .g48-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g48-choice{background:#fff;border:4px solid #fde68a;border-radius:20px;padding:22px 0;font-size:3.5rem;cursor:pointer;box-shadow:0 6px 0 #fcd34d;transition:all .15s}
        .g48-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #fcd34d}
        .g48-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g48-pop2 .5s}
        .g48-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g48-shk .4s}
        @keyframes g48-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g48-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#ca8a04}
        .g48-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g48-hint-box.visible{display:flex}
        .g48-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g48-win-emoji{font-size:4.8rem;animation:g48-bounce 1s infinite}
        @keyframes g48-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g48-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#eab308,#a16207);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g48-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g48-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g48-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g48-win-replay{background:linear-gradient(180deg,#facc15,#eab308);color:#fff;box-shadow:0 5px 0 #a16207}
        .g48-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g48-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g48-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g48-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g48-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g48-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g48-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g48-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g48-fall 1.6s linear forwards}
        @keyframes g48-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g48-wrap">
        <div class="g48-header"><div><div class="g48-title">😊 Les Émotions • المشاعر</div></div><div class="g48-progress" id="g48-prog">⭐ 0</div></div>
        <div class="g48-stage" id="g48-stage">
          <button class="g48-parent-btn" id="g48-parent-btn">⚙️</button>
          <div class="g48-q" id="g48-q">😊 مين اللي مبسوط؟<small>Qui est content ?</small></div>
          <div class="g48-choices" id="g48-choices"></div>
          <div class="g48-hint-box" id="g48-hint"></div>
          <div class="g48-feedback" id="g48-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g48-stage'), qEl = document.getElementById('g48-q');
    const choicesEl = document.getElementById('g48-choices'), hintBox = document.getElementById('g48-hint');
    const msgEl = document.getElementById('g48-msg'), progEl = document.getElementById('g48-prog');

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
      const c = document.createElement('div'); c.className = 'g48-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g48-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    async function speakPrompt() {
      if (!target) return;
      await speakFr(null, target.fr);
      await sleep(300);
      await speakEg(target.eg);
    }
    qEl.addEventListener('click', speakPrompt);

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      target = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      qEl.innerHTML = `🔊 مين اللي ${target.eg}؟<small>Qui est ${target.fr.toLowerCase()} ?</small>`;
      const opts = [target];
      while (opts.length < 3 && opts.length < EMOTIONS.length) {
        const e = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
        if (!opts.find(o => o.emoji === e.emoji)) opts.push(e);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(e => {
        const btn = document.createElement('button'); btn.className = 'g48-choice'; btn.textContent = e.emoji; btn.dataset.emoji = e.emoji;
        btn.addEventListener('click', () => onChoice(e, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(speakPrompt, 300);
    }

    async function onChoice(e, btn) {
      if (locked) return;
      if (e.emoji === target.emoji) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${target.eg} (${target.fr})`;
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 ${target.eg} = ${target.emoji}`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-emoji="${target.emoji}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fcd34d';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g48-win';
      win.innerHTML = `<div class="g48-win-emoji">🏆</div><div class="g48-win-title">أحسنتِ يا بطلة!</div><div class="g48-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g48-win-btns"><button class="g48-win-btn g48-win-replay" id="g48-replay">🔄 العبي تاني</button><button class="g48-win-btn g48-win-home" id="g48-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g48-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g48-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g48-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g48-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g48-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g48-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
