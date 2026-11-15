window.Game_37 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, isLoud = false;

    container.innerHTML = `
      <style>
        .g37-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g37-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#ef4444 0%,#dc2626 50%,#b91c1c 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(239,68,68,.35)}
        .g37-title{font-size:1.15rem;font-weight:900}
        .g37-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g37-stage{background:#fff;border:3px solid #fecaca;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g37-pop .35s}
        @keyframes g37-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g37-stage.shake{animation:g37-shk .4s}
        @keyframes g37-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g37-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g37-q{font-size:1.15rem;font-weight:900;color:#b91c1c;margin-bottom:16px}
        .g37-q small{display:block;font-size:.78rem;color:#f87171;font-weight:700;margin-top:2px}
        .g37-speaker{background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:22px;padding:20px;margin-bottom:14px;box-shadow:0 10px 24px rgba(239,68,68,.3)}
        .g37-speaker button{width:100px;height:100px;border-radius:50%;background:#fff;color:#b91c1c;border:none;font-size:3rem;cursor:pointer;box-shadow:0 6px 0 #fecaca;transition:transform .15s}
        .g37-speaker button:active{transform:scale(.92)}
        .g37-choices{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:400px;margin:0 auto}
        .g37-choice{background:#fff;border:4px solid #fecaca;border-radius:20px;padding:20px 0;font-size:1.35rem;font-weight:900;color:#b91c1c;cursor:pointer;box-shadow:0 6px 0 #fca5a5;transition:all .15s}
        .g37-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #fca5a5}
        .g37-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);color:#fff;border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g37-pop2 .5s}
        .g37-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);color:#fff;border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g37-shk .4s}
        @keyframes g37-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g37-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#dc2626}
        .g37-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g37-hint-box.visible{display:flex}
        .g37-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g37-win-emoji{font-size:4.8rem;animation:g37-bounce 1s infinite}
        @keyframes g37-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g37-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#ef4444,#b91c1c);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g37-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g37-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g37-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g37-win-replay{background:linear-gradient(180deg,#f87171,#ef4444);color:#fff;box-shadow:0 5px 0 #b91c1c}
        .g37-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g37-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g37-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g37-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g37-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g37-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g37-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g37-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g37-fall 1.6s linear forwards}
        @keyframes g37-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g37-wrap">
        <div class="g37-header"><div><div class="g37-title">🔊 Fort / Doux • عالي وواطي</div></div><div class="g37-progress" id="g37-prog">⭐ 0</div></div>
        <div class="g37-stage" id="g37-stage">
          <button class="g37-parent-btn" id="g37-parent-btn">⚙️</button>
          <div class="g37-q">🔊 اسمعي الصوت: عالي ولا واطي؟<small>Fort ou Doux ?</small></div>
          <div class="g37-speaker"><button id="g37-play">🔊</button></div>
          <div class="g37-choices">
            <button class="g37-choice" data-ans="loud">🔊 عالي Fort</button>
            <button class="g37-choice" data-ans="soft">🔈 واطي Doux</button>
          </div>
          <div class="g37-hint-box" id="g37-hint"></div>
          <div class="g37-feedback" id="g37-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g37-stage'), playBtn = document.getElementById('g37-play');
    const hintBox = document.getElementById('g37-hint'), msgEl = document.getElementById('g37-msg'), progEl = document.getElementById('g37-prog');

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
        g.gain.setValueAtTime(v || .14, c.currentTime);
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
      const c = document.createElement('div'); c.className = 'g37-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g37-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    function playSound() {
      if (isLoud) {
        playTone(440, 0.45, 'sawtooth', 0.55);
        playTone(660, 0.45, 'triangle', 0.45);
      } else {
        playTone(392, 0.5, 'sine', 0.045);
      }
    }

    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      container.querySelectorAll('.g37-choice').forEach(b => { b.classList.remove('correct', 'wrong'); b.style.boxShadow = ''; });
      isLoud = Math.random() > 0.5;
      setTimeout(playSound, 300);
    }

    playBtn.addEventListener('click', playSound);

    container.querySelectorAll('.g37-choice').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (locked) return;
        const ans = btn.dataset.ans;
        const correct = isLoud ? 'loud' : 'soft';
        if (ans === correct) {
          locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
          msgEl.style.color = '#16a34a'; msgEl.textContent = isLoud ? '🎉 Bravo ! عالي (Fort)' : '🎉 Bravo ! واطي (Doux)';
          await speakPraise(); await sleep(500);
          if (round >= ROUNDS) showWin(); else newRound();
        } else {
          wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
          stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
          pe(); await speakEncourage();
          if (wrong >= 2) {
            stageEl.classList.add('hint');
            hintBox.innerHTML = isLoud ? '💡 الصوت عالي 🔊' : '💡 الصوت واطي 🔈';
            hintBox.classList.add('visible');
            const cb = container.querySelector(`.g37-choice[data-ans="${correct}"]`);
            if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fca5a5';
          }
        }
      });
    });

    function showWin() {
      const win = document.createElement('div'); win.className = 'g37-win';
      win.innerHTML = `<div class="g37-win-emoji">🏆</div><div class="g37-win-title">أحسنتِ يا بطلة!</div><div class="g37-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g37-win-btns"><button class="g37-win-btn g37-win-replay" id="g37-replay">🔄 العبي تاني</button><button class="g37-win-btn g37-win-home" id="g37-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g37-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g37-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g37-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g37-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g37-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g37-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
