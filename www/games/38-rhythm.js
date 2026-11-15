window.Game_38 = {
  async mount(container) {
    const FREQS = [261.63, 329.63, 392.00, 523.25];
    const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24'];
    const TARGET_LEVEL = 5;
    let sequence = [], playerIndex = 0, score = 0, playing = false, best = 0, wrongThisLevel = 0;

    container.innerHTML = `
      <style>
        .g38-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g38-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f472b6 0%,#ec4899 50%,#db2777 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(244,114,182,.35)}
        .g38-title{font-size:1.15rem;font-weight:900}
        .g38-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g38-stage{background:#fff;border:3px solid #fbcfe8;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:440px;animation:g38-pop .35s}
        @keyframes g38-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g38-q{font-size:1.05rem;font-weight:900;color:#be185d;margin-bottom:12px}
        .g38-q small{display:block;font-size:.78rem;color:#f472b6;font-weight:700;margin-top:2px}
        .g38-pads{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:340px;margin:0 auto 14px}
        .g38-pad{height:110px;border-radius:20px;border:4px solid #fff;cursor:pointer;transition:all .15s;box-shadow:0 6px 20px rgba(0,0,0,.2)}
        .g38-pad:active{transform:scale(0.95)}
        .g38-pad.flash{transform:scale(1.1);box-shadow:0 0 0 6px rgba(255,255,255,.8),0 0 30px currentColor}
        .g38-pad.hint{box-shadow:0 0 0 6px #fde047, 0 6px 20px rgba(0,0,0,.2)}
        .g38-status{font-size:1.1rem;color:#be185d;font-weight:900;min-height:30px;margin-top:6px}
        .g38-info{display:flex;justify-content:center;gap:20px;margin-top:10px;font-size:.95rem;font-weight:800;color:#64748b}
        .g38-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g38-win-emoji{font-size:4.8rem;animation:g38-bounce 1s infinite}
        @keyframes g38-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g38-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#f472b6,#db2777);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g38-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g38-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g38-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g38-win-replay{background:linear-gradient(180deg,#f472b6,#ec4899);color:#fff;box-shadow:0 5px 0 #be185d}
        .g38-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g38-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g38-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g38-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g38-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g38-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g38-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g38-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g38-fall 1.6s linear forwards}
        @keyframes g38-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g38-wrap">
        <div class="g38-header"><div><div class="g38-title">🥁 Rythme à Reproduire • الإيقاع</div></div><div class="g38-progress" id="g38-prog">⭐ 0</div></div>
        <div class="g38-stage" id="g38-stage">
          <button class="g38-parent-btn" id="g38-parent-btn">⚙️</button>
          <div class="g38-q">🥁 شوفي الأزرار اللي بتنوّر وكرريها<small>Regarde et répète</small></div>
          <div class="g38-pads" id="g38-pads"></div>
          <div class="g38-status" id="g38-status">استعدي...</div>
          <div class="g38-info"><span>🎯 المستوى: <span id="g38-level">1</span> / ${TARGET_LEVEL}</span><span>⭐ أفضل: <span id="g38-best">0</span></span></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g38-stage'), padsEl = document.getElementById('g38-pads');
    const statusEl = document.getElementById('g38-status'), progEl = document.getElementById('g38-prog');
    const levelEl = document.getElementById('g38-level'), bestEl = document.getElementById('g38-best');

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
        g.gain.setValueAtTime(v || .18, c.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, c.currentTime + (d || .25));
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + (d || .25));
      } catch (e) {}
    }
    function pc() { playTone(523, .15); setTimeout(() => playTone(659, .15), 120); setTimeout(() => playTone(784, .25), 240); }
    function pe() { playTone(196, .25, 'square'); }
    function updateProgress() { progEl.textContent = `${score}/${TARGET_LEVEL} • ⭐ ${score}`; levelEl.textContent = sequence.length || 1; bestEl.textContent = best; }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g38-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g38-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }

    FREQS.forEach((f, i) => {
      const b = document.createElement('button');
      b.className = 'g38-pad';
      b.style.background = COLORS[i];
      b.style.color = COLORS[i];
      b.dataset.i = i;
      b.addEventListener('click', () => onPadClick(i));
      padsEl.appendChild(b);
    });

    function flashPad(i) {
      const pad = padsEl.querySelector(`[data-i="${i}"]`);
      if (!pad) return;
      playTone(FREQS[i], 0.35, 'sine', 0.22);
      pad.classList.add('flash');
      setTimeout(() => pad.classList.remove('flash'), 350);
    }

    async function playSequence() {
      playing = true;
      padsEl.querySelectorAll('.g38-pad').forEach(p => p.classList.remove('hint'));
      statusEl.textContent = '👀 شوفي كويس...';
      await sleep(500);
      for (const i of sequence) {
        flashPad(i);
        await sleep(520);
      }
      await sleep(150);
      playing = false;
      playerIndex = 0;
      statusEl.textContent = '🎯 دورك!';
    }

    function nextRound() {
      wrongThisLevel = 0;
      sequence.push(Math.floor(Math.random() * 4));
      updateProgress();
      playSequence();
    }

    async function onPadClick(i) {
      if (playing) return;
      flashPad(i);
      if (sequence[playerIndex] === i) {
        padsEl.querySelectorAll('.g38-pad').forEach(p => p.classList.remove('hint'));
        playerIndex++;
        if (playerIndex === sequence.length) {
          score = sequence.length;
          if (score > best) best = score;
          updateProgress();
          statusEl.textContent = '🎉 Bravo !';
          pc();
          if (typeof starBurst === 'function') starBurst();
          try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
          await sleep(600);
          if (score >= TARGET_LEVEL) showWin();
          else nextRound();
        }
      } else {
        wrongThisLevel++;
        statusEl.textContent = '💪 حاولي تاني - شوفي الترتيب تاني';
        pe();
        try { await Audio2.play(null, { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
        await sleep(700);
        await playSequence();
        if (wrongThisLevel >= 2) {
          const firstPad = padsEl.querySelector(`[data-i="${sequence[0]}"]`);
          if (firstPad) firstPad.classList.add('hint');
        }
      }
    }

    async function showWin() {
      const win = document.createElement('div'); win.className = 'g38-win';
      win.innerHTML = `<div class="g38-win-emoji">🏆</div><div class="g38-win-title">أحسنتِ يا بطلة!</div><div class="g38-win-stars">${'⭐'.repeat(Math.min(score, 5))}</div><div class="g38-win-btns"><button class="g38-win-btn g38-win-replay" id="g38-replay">🔄 العبي تاني</button><button class="g38-win-btn g38-win-home" id="g38-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); if (typeof starBurst === 'function') starBurst(); pc();
      try { await Audio2.play('eg_bravo', { text: 'برافو عليكي!', lang: 'eg' }); } catch (e) {}
      document.getElementById('g38-replay').addEventListener('click', () => { win.remove(); sequence = []; score = 0; updateProgress(); nextRound(); });
      document.getElementById('g38-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g38-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g38-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>أفضل مستوى</span><strong>${best}</strong></div><button id="g38-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g38-pc').addEventListener('click', () => p.remove());
    });
    updateProgress(); nextRound();
  }
};
