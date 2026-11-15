window.Game_41 = {
  async mount(container) {
    const CARDS_DATA = [
      { emoji: '🐱', fr: 'Chat', eg: 'قطة' },
      { emoji: '🐶', fr: 'Chien', eg: 'كلب' },
      { emoji: '🐮', fr: 'Vache', eg: 'بقرة' },
      { emoji: '🦁', fr: 'Lion', eg: 'أسد' },
      { emoji: '🐸', fr: 'Grenouille', eg: 'ضفدعة' },
      { emoji: '🐰', fr: 'Lapin', eg: 'أرنب' }
    ];
    let stars = 0, matched = 0, moves = 0, flipped = [], locked = false;

    container.innerHTML = `
      <style>
        .g41-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g41-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 50%,#1d4ed8 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(59,130,246,.35)}
        .g41-title{font-size:1.15rem;font-weight:900}
        .g41-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g41-stage{background:#fff;border:3px solid #bfdbfe;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:440px;animation:g41-pop .35s}
        @keyframes g41-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g41-q{font-size:1.05rem;font-weight:900;color:#1d4ed8;margin-bottom:8px}
        .g41-q small{display:block;font-size:.78rem;color:#60a5fa;font-weight:700;margin-top:2px}
        .g41-stats{display:flex;justify-content:center;gap:20px;margin-bottom:12px;font-size:.95rem;font-weight:800;color:#475569}
        .g41-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:420px;margin:0 auto}
        .g41-card{aspect-ratio:1;background:linear-gradient(135deg,#3b82f6,#2563eb);border:3px solid #1d4ed8;border-radius:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:2.4rem;box-shadow:0 4px 0 #1e40af;transition:all .25s;user-select:none;color:#fff}
        .g41-card:active{transform:scale(.95)}
        .g41-card.revealed{background:#fef9c3;border-color:#fbbf24;box-shadow:0 4px 0 #f59e0b}
        .g41-card.matched{background:linear-gradient(135deg,#4ade80,#22c55e);border-color:#16a34a;box-shadow:0 4px 0 #15803d;pointer-events:none;animation:g41-pop2 .5s}
        @keyframes g41-pop2{0%{transform:scale(1)}45%{transform:scale(1.1)}100%{transform:scale(1)}}
        .g41-feedback{font-size:1.05rem;font-weight:900;min-height:26px;margin-top:10px;color:#1d4ed8}
        .g41-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g41-win-emoji{font-size:4.8rem;animation:g41-bounce 1s infinite}
        @keyframes g41-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g41-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#3b82f6,#1d4ed8);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g41-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g41-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g41-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g41-win-replay{background:linear-gradient(180deg,#60a5fa,#3b82f6);color:#fff;box-shadow:0 5px 0 #1d4ed8}
        .g41-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g41-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g41-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g41-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g41-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g41-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g41-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g41-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g41-fall 1.6s linear forwards}
        @keyframes g41-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g41-wrap">
        <div class="g41-header"><div><div class="g41-title">🧠 Memory • لعبة الذاكرة</div></div><div class="g41-progress" id="g41-prog">⭐ 0</div></div>
        <div class="g41-stage" id="g41-stage">
          <button class="g41-parent-btn" id="g41-parent-btn">⚙️</button>
          <div class="g41-q">🧠 اقلبي الكروت ولاقي الأزواج<small>Trouve les paires</small></div>
          <div class="g41-stats"><span>🎯 أزواج: <span id="g41-matched">0</span>/6</span><span>🔄 محاولات: <span id="g41-moves">0</span></span></div>
          <div class="g41-grid" id="g41-grid"></div>
          <div class="g41-feedback" id="g41-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g41-stage'), gridEl = document.getElementById('g41-grid');
    const progEl = document.getElementById('g41-prog'), matchedEl = document.getElementById('g41-matched');
    const movesEl = document.getElementById('g41-moves'), msgEl = document.getElementById('g41-msg');

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
    function pe() { playTone(196, .2, 'square'); }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g41-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g41-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play(null, { text: 'برافو!', lang: 'eg' }); } catch (e) {} }

    function startGame() {
      matched = 0; moves = 0; flipped = []; locked = false; stars = 0;
      matchedEl.textContent = '0'; movesEl.textContent = '0'; progEl.textContent = '⭐ 0'; msgEl.textContent = '';
      const deck = [...CARDS_DATA, ...CARDS_DATA].sort(() => Math.random() - 0.5);
      gridEl.innerHTML = '';
      deck.forEach(item => {
        const card = document.createElement('button');
        card.className = 'g41-card';
        card.textContent = '❓';
        card.dataset.emoji = item.emoji;
        card.dataset.fr = item.fr;
        card.dataset.eg = item.eg;
        card.addEventListener('click', () => onCardClick(card));
        gridEl.appendChild(card);
      });
    }

    async function onCardClick(card) {
      if (locked || card.classList.contains('matched') || card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      card.textContent = card.dataset.emoji;
      playTone(440, 0.1, 'sine');
      flipped.push(card);
      if (flipped.length === 2) {
        locked = true; moves++; movesEl.textContent = moves;
        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
          const fr = flipped[0].dataset.fr, eg = flipped[0].dataset.eg;
          flipped.forEach(f => { f.classList.remove('revealed'); f.classList.add('matched'); });
          matched++; matchedEl.textContent = matched;
          stars++; progEl.textContent = `⭐ ${stars}`;
          msgEl.style.color = '#16a34a';
          msgEl.textContent = `🎉 ${fr} • ${eg}`;
          pc(); confetti(); if (typeof starBurst === 'function') starBurst();
          try { await Audio2.play(null, { text: fr, lang: 'fr' }); } catch (e) {}
          await sleep(300);
          try { await Audio2.play(null, { text: eg, lang: 'eg' }); } catch (e) {}
          flipped = []; locked = false;
          if (matched === 6) { await speakPraise(); showWin(); }
        } else {
          pe();
          await sleep(750);
          flipped.forEach(f => { f.classList.remove('revealed'); f.textContent = '❓'; });
          flipped = []; locked = false;
        }
      }
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g41-win';
      win.innerHTML = `<div class="g41-win-emoji">🏆</div><div class="g41-win-title">أحسنتِ يا بطلة!</div><div class="g41-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g41-win-btns"><button class="g41-win-btn g41-win-replay" id="g41-replay">🔄 العبي تاني</button><button class="g41-win-btn g41-win-home" id="g41-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti();
      document.getElementById('g41-replay').addEventListener('click', () => { win.remove(); startGame(); });
      document.getElementById('g41-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g41-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g41-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الأزواج</span><strong>${matched}/6</strong></div><div class="row"><span>المحاولات</span><strong>${moves}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g41-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g41-pc').addEventListener('click', () => p.remove());
    });
    startGame();
  }
};
