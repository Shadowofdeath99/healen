window.Game_40 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, target = null;

    container.innerHTML = `
      <style>
        .g40-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g40-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#a855f7 0%,#9333ea 50%,#7e22ce 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(168,85,247,.35)}
        .g40-title{font-size:1.15rem;font-weight:900}
        .g40-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g40-stage{background:#fff;border:3px solid #e9d5ff;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g40-pop .35s}
        @keyframes g40-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g40-stage.shake{animation:g40-shk .4s}
        @keyframes g40-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g40-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g40-q{font-size:1.15rem;font-weight:900;color:#7e22ce;margin-bottom:16px}
        .g40-q small{display:block;font-size:.78rem;color:#c084fc;font-weight:700;margin-top:2px}
        .g40-speaker{background:linear-gradient(135deg,#a855f7,#9333ea);border-radius:22px;padding:20px;margin-bottom:14px;box-shadow:0 10px 24px rgba(168,85,247,.3)}
        .g40-speaker button{width:100px;height:100px;border-radius:50%;background:#fff;color:#7e22ce;border:none;font-size:3rem;cursor:pointer;box-shadow:0 6px 0 #e9d5ff;transition:transform .15s}
        .g40-speaker button:active{transform:scale(.92)}
        .g40-speaker button.playing{animation:g40Pulse .6s infinite alternate}
        @keyframes g40Pulse{from{transform:scale(1)}to{transform:scale(1.12);box-shadow:0 0 0 14px rgba(255,255,255,.25)}}
        .g40-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g40-choice{background:#fff;border:4px solid #e9d5ff;border-radius:20px;padding:22px 0;font-size:3.2rem;cursor:pointer;box-shadow:0 6px 0 #d8b4fe;transition:all .15s}
        .g40-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #d8b4fe}
        .g40-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g40-pop2 .5s}
        .g40-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g40-shk .4s}
        @keyframes g40-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g40-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#9333ea}
        .g40-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g40-hint-box.visible{display:flex}
        .g40-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g40-win-emoji{font-size:4.8rem;animation:g40-bounce 1s infinite}
        @keyframes g40-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g40-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#a855f7,#7e22ce);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g40-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g40-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g40-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g40-win-replay{background:linear-gradient(180deg,#c084fc,#a855f7);color:#fff;box-shadow:0 5px 0 #7e22ce}
        .g40-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g40-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g40-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g40-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g40-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g40-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g40-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g40-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g40-fall 1.6s linear forwards}
        @keyframes g40-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g40-wrap">
        <div class="g40-header"><div><div class="g40-title">🎧 Écoute et Choisis • صوت الآلة</div></div><div class="g40-progress" id="g40-prog">⭐ 0</div></div>
        <div class="g40-stage" id="g40-stage">
          <button class="g40-parent-btn" id="g40-parent-btn">⚙️</button>
          <div class="g40-q">🎧 اسمعي الآلة واختاري صورتها<small>Écoute et choisis</small></div>
          <div class="g40-speaker"><button id="g40-speaker">🔊</button></div>
          <div class="g40-choices" id="g40-choices"></div>
          <div class="g40-hint-box" id="g40-hint"></div>
          <div class="g40-feedback" id="g40-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g40-stage'), speakerBtn = document.getElementById('g40-speaker');
    const choicesEl = document.getElementById('g40-choices'), hintBox = document.getElementById('g40-hint');
    const msgEl = document.getElementById('g40-msg'), progEl = document.getElementById('g40-prog');

    let sharedAC = null;
    function getAC() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!sharedAC) sharedAC = new AC();
      if (sharedAC.state === 'suspended') sharedAC.resume().catch(() => {});
      return sharedAC;
    }

    function playTone(f, d, t, v) {
      try {
        const c = getAC();
        if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = t || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(v || .2, c.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, c.currentTime + (d || .45));
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + (d || .45));
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
      const c = document.createElement('div'); c.className = 'g40-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g40-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    function playTarget() {
      if (!target) return;
      speakerBtn.classList.add('playing');
      playTone(target.freq || 440, 0.45, target.type || 'sine', 0.22);
      setTimeout(() => speakerBtn.classList.remove('playing'), 550);
    }

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      const instruments = window.INSTRUMENTS || [];
      if (!instruments.length) { msgEl.textContent = 'الآلات غير متاحة'; return; }
      target = instruments[Math.floor(Math.random() * instruments.length)];
      const opts = [target];
      while (opts.length < 3 && opts.length < instruments.length) {
        const x = instruments[Math.floor(Math.random() * instruments.length)];
        if (!opts.find(o => o.emoji === x.emoji)) opts.push(x);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(inst => {
        const btn = document.createElement('button'); btn.className = 'g40-choice'; btn.textContent = inst.emoji; btn.dataset.emoji = inst.emoji;
        btn.addEventListener('click', () => onChoice(inst, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(playTarget, 400);
    }

    speakerBtn.addEventListener('click', playTarget);

    async function onChoice(inst, btn) {
      if (locked) return;
      if (inst.emoji === target.emoji) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        playTone(target.freq || 440, 0.45, target.type || 'sine', 0.22);
        await sleep(300); await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 الآلة: ${target.fr} (${target.eg})`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-emoji="${target.emoji}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #d8b4fe';
        }
      }
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g40-win';
      win.innerHTML = `<div class="g40-win-emoji">🏆</div><div class="g40-win-title">أحسنتِ يا بطلة!</div><div class="g40-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g40-win-btns"><button class="g40-win-btn g40-win-replay" id="g40-replay">🔄 العبي تاني</button><button class="g40-win-btn g40-win-home" id="g40-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g40-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g40-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g40-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g40-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g40-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g40-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
