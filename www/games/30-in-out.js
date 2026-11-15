window.Game_30 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, locked = false, answerYes = false, currentInside = false;

    container.innerHTML = `
      <style>
        .g30-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g30-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#14b8a6 0%,#0d9488 50%,#0f766e 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(20,184,166,.35)}
        .g30-title{font-size:1.15rem;font-weight:900}
        .g30-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g30-stage{background:#fff;border:3px solid #99f6e4;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g30-pop .35s}
        @keyframes g30-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g30-stage.shake{animation:g30-shk .4s}
        @keyframes g30-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g30-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g30-q{font-size:1.15rem;font-weight:900;color:#0f766e;margin-bottom:16px}
        .g30-q small{display:block;font-size:.78rem;color:#2dd4bf;font-weight:700;margin-top:2px}
        .g30-scene{position:relative;width:100%;max-width:320px;height:210px;background:linear-gradient(180deg,#ecfdf5,#d1fae5);border-radius:22px;margin:0 auto 16px;border:3px solid #a7f3d0;overflow:hidden}
        .g30-box-back{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);width:120px;height:88px;background:#b45309;border-radius:10px 10px 14px 14px;z-index:1}
        .g30-box-front{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);width:126px;height:66px;background:linear-gradient(180deg,#f59e0b,#d97706);border:3px solid #92400e;border-radius:6px 6px 14px 14px;z-index:3;display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#fef3c7;font-weight:900;box-shadow:0 6px 12px rgba(0,0,0,.15)}
        .g30-animal{font-size:4rem;position:absolute;transition:all .35s cubic-bezier(.34,1.56,.64,1);z-index:2;line-height:1}
        .g30-animal.inside{bottom:64px;left:50%;transform:translateX(-50%)}
        .g30-animal.outside{bottom:26px;left:16%;transform:translateX(0);z-index:4}
        .g30-choices{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:400px;margin:0 auto}
        .g30-choice{background:#fff;border:4px solid #99f6e4;border-radius:20px;padding:18px 0;font-size:1.3rem;font-weight:900;color:#0f766e;cursor:pointer;box-shadow:0 6px 0 #5eead4;transition:all .15s}
        .g30-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #5eead4}
        .g30-choice.correct{background:linear-gradient(180deg,#4ade80,#22c55e);color:#fff;border-color:#16a34a;box-shadow:0 6px 0 #15803d;animation:g30-pop2 .5s}
        .g30-choice.wrong{background:linear-gradient(180deg,#fca5a5,#f87171);color:#fff;border-color:#ef4444;box-shadow:0 6px 0 #b91c1c;animation:g30-shk .4s}
        @keyframes g30-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g30-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#0d9488}
        .g30-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g30-hint-box.visible{display:flex}
        .g30-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g30-win-emoji{font-size:4.8rem;animation:g30-bounce 1s infinite}
        @keyframes g30-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g30-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#14b8a6,#0f766e);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g30-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g30-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g30-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g30-win-replay{background:linear-gradient(180deg,#2dd4bf,#14b8a6);color:#fff;box-shadow:0 5px 0 #0f766e}
        .g30-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g30-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g30-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g30-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g30-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g30-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g30-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g30-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g30-fall 1.6s linear forwards}
        @keyframes g30-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g30-wrap">
        <div class="g30-header"><div><div class="g30-title">📦 Dedans / Dehors • جوه وبره</div></div><div class="g30-progress" id="g30-prog">⭐ 0</div></div>
        <div class="g30-stage" id="g30-stage">
          <button class="g30-parent-btn" id="g30-parent-btn">⚙️</button>
          <div class="g30-q" id="g30-q"></div>
          <div class="g30-scene" id="g30-scene">
            <div class="g30-box-back"></div>
            <div class="g30-animal" id="g30-animal"></div>
            <div class="g30-box-front">📦</div>
          </div>
          <div class="g30-choices" id="g30-choices">
            <button class="g30-choice" data-ans="yes">✅ نعم Oui</button>
            <button class="g30-choice" data-ans="no">❌ لا Non</button>
          </div>
          <div class="g30-hint-box" id="g30-hint"></div>
          <div class="g30-feedback" id="g30-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g30-stage'), qEl = document.getElementById('g30-q');
    const animalEl = document.getElementById('g30-animal'), choicesEl = document.getElementById('g30-choices');
    const hintBox = document.getElementById('g30-hint'), msgEl = document.getElementById('g30-msg');
    const progEl = document.getElementById('g30-prog');

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
    function updateProgress() { progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`; }
    async function speakFr(id, text) { try { await Audio2.play(id, { text, lang: 'fr' }); } catch (e) {} }
    async function speakEg(text) { try { await Audio2.play(null, { text, lang: 'eg' }); } catch (e) {} }
    async function speakPraise() { await speakFr('fr_bravo', 'Bravo !'); await sleep(300); await speakEg('برافو!'); }
    async function speakEncourage() { await speakEg('حاولي تاني'); }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g30-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g30-confetti';
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
      currentInside = Math.random() > 0.5;
      const askInside = Math.random() > 0.5;
      answerYes = (currentInside === askInside);
      const animalEmoji = ['🐱', '🐶', '🐰', '🐸', '🦆'][Math.floor(Math.random() * 5)];
      qEl.innerHTML = askInside ? '📦 الحيوان ده جوه الصندوق؟<small>Est-il dedans ?</small>' : '📦 الحيوان ده برّه الصندوق؟<small>Est-il dehors ?</small>';
      animalEl.textContent = animalEmoji;
      animalEl.className = 'g30-animal ' + (currentInside ? 'inside' : 'outside');
      choicesEl.querySelectorAll('.g30-choice').forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.style.boxShadow = '';
        b.onclick = () => onChoice(b.dataset.ans, b);
      });
      setTimeout(async () => {
        if (askInside) { await speakFr('fr_dedans', 'Dedans ?'); await sleep(300); await speakEg('جوه الصندوق؟'); }
        else { await speakFr('fr_dehors', 'Dehors ?'); await sleep(300); await speakEg('بره الصندوق؟'); }
      }, 300);
    }

    async function onChoice(ans, btn) {
      if (locked) return;
      if ((ans === 'yes' && answerYes) || (ans === 'no' && !answerYes)) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = currentInside ? '🎉 Bravo ! جوه (Dedans)' : '🎉 Bravo ! برّه (Dehors)';
        await speakPraise(); await sleep(500);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint');
          hintBox.innerHTML = currentInside ? '💡 بصّي: الحيوان جوه الصندوق' : '💡 بصّي: الحيوان برّه الصندوق';
          hintBox.classList.add('visible');
          const rightAns = answerYes ? 'yes' : 'no';
          const cb = choicesEl.querySelector(`[data-ans="${rightAns}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #5eead4';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g30-win';
      win.innerHTML = `<div class="g30-win-emoji">🏆</div><div class="g30-win-title">أحسنتِ يا بطلة!</div><div class="g30-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g30-win-btns"><button class="g30-win-btn g30-win-replay" id="g30-replay">🔄 العبي تاني</button><button class="g30-win-btn g30-win-home" id="g30-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g30-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; newRound(); });
      document.getElementById('g30-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g30-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g30-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g30-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g30-pc').addEventListener('click', () => p.remove());
    });
    newRound();
  }
};
