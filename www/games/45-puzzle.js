window.Game_45 = {
  async mount(container) {
    const ROUNDS = 3;
    let round = 0, stars = 0, selectedPiece = null, placed = 0;
    const ANIMALS = [
      { emoji: '🦁', fr: 'Lion', eg: 'أسد' },
      { emoji: '🐱', fr: 'Chat', eg: 'قطة' },
      { emoji: '🐶', fr: 'Chien', eg: 'كلب' },
      { emoji: '🐸', fr: 'Grenouille', eg: 'ضفدعة' },
      { emoji: '🐮', fr: 'Vache', eg: 'بقرة' }
    ];
    let currentAnimal = ANIMALS[0];

    container.innerHTML = `
      <style>
        .g45-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g45-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(16,185,129,.35)}
        .g45-title{font-size:1.15rem;font-weight:900}
        .g45-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g45-stage{background:#fff;border:3px solid #a7f3d0;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:460px;animation:g45-pop .35s}
        @keyframes g45-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g45-q{font-size:1.05rem;font-weight:900;color:#047857;margin-bottom:8px}
        .g45-q small{display:block;font-size:.78rem;color:#34d399;font-weight:700;margin-top:2px}
        .g45-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;width:200px;height:200px;margin:10px auto 16px;background:#ecfdf5;border-radius:18px;padding:8px;border:3px dashed #34d399;direction:ltr}
        .g45-slot{background:#fff;border:2px dashed #86efac;border-radius:10px;position:relative;overflow:hidden;cursor:pointer;transition:all .2s}
        .g45-slot.filled{border:2px solid #16a34a;background:#dcfce7}
        .g45-slot.wrong{background:#fee2e2;border-color:#ef4444;animation:g45-shk .4s}
        @keyframes g45-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        .g45-tray{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;min-height:92px;direction:ltr}
        .g45-piece{background:#fff;border:3px solid #10b981;border-radius:14px;width:82px;height:82px;position:relative;overflow:hidden;cursor:pointer;box-shadow:0 4px 0 #047857;transition:all .15s}
        .g45-piece:active{transform:translateY(2px);box-shadow:0 2px 0 #047857}
        .g45-piece.selected{border-color:#f59e0b;box-shadow:0 0 0 5px #fde68a, 0 4px 0 #047857;transform:translateY(-4px)}
        .g45-quad{position:absolute;width:164px;height:164px;font-size:135px;line-height:164px;text-align:center;pointer-events:none}
        .g45-quad.q0{top:0;left:0}
        .g45-quad.q1{top:0;left:-82px}
        .g45-quad.q2{top:-82px;left:0}
        .g45-quad.q3{top:-82px;left:-82px}
        .g45-slot .g45-quad{width:176px;height:176px;font-size:145px;line-height:176px}
        .g45-slot .g45-quad.q1{left:-88px}
        .g45-slot .g45-quad.q2{top:-88px}
        .g45-slot .g45-quad.q3{top:-88px;left:-88px}
        .g45-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g45-win-emoji{font-size:4.8rem;animation:g45-bounce 1s infinite}
        @keyframes g45-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g45-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#10b981,#047857);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g45-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g45-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g45-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g45-win-replay{background:linear-gradient(180deg,#34d399,#10b981);color:#fff;box-shadow:0 5px 0 #047857}
        .g45-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g45-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g45-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g45-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g45-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g45-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g45-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g45-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g45-fall 1.6s linear forwards}
        @keyframes g45-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g45-wrap">
        <div class="g45-header"><div><div class="g45-title">🧩 Puzzle • بازل الصور</div></div><div class="g45-progress" id="g45-prog">⭐ 0</div></div>
        <div class="g45-stage" id="g45-stage">
          <button class="g45-parent-btn" id="g45-parent-btn">⚙️</button>
          <div class="g45-q">🧩 اختاري قطعة وركّبيها في مكانها<small>Assemble le puzzle</small></div>
          <div class="g45-grid" id="g45-grid"></div>
          <div class="g45-tray" id="g45-tray"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g45-stage'), gridEl = document.getElementById('g45-grid');
    const trayEl = document.getElementById('g45-tray'), progEl = document.getElementById('g45-prog');

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
    function confetti() {
      const c = document.createElement('div'); c.className = 'g45-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g45-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play(null, { text: 'برافو!', lang: 'eg' }); } catch (e) {} }

    function startRound() {
      round++;
      placed = 0; selectedPiece = null;
      progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`;
      currentAnimal = ANIMALS[(round - 1) % ANIMALS.length];
      gridEl.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = 'g45-slot';
        slot.dataset.idx = i;
        slot.addEventListener('click', () => onSlotClick(slot));
        gridEl.appendChild(slot);
      }
      trayEl.innerHTML = '';
      const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      order.forEach(idx => {
        const piece = document.createElement('div');
        piece.className = 'g45-piece';
        piece.dataset.idx = idx;
        piece.innerHTML = `<div class="g45-quad q${idx}">${currentAnimal.emoji}</div>`;
        piece.addEventListener('click', () => onPieceClick(piece));
        trayEl.appendChild(piece);
      });
    }

    function onPieceClick(piece) {
      if (piece.classList.contains('placed')) return;
      trayEl.querySelectorAll('.g45-piece').forEach(p => p.classList.remove('selected'));
      piece.classList.add('selected');
      selectedPiece = piece;
    }

    async function onSlotClick(slot) {
      if (!selectedPiece || slot.classList.contains('filled')) return;
      const idx = parseInt(selectedPiece.dataset.idx, 10);
      if (idx === parseInt(slot.dataset.idx, 10)) {
        slot.classList.add('filled');
        slot.innerHTML = `<div class="g45-quad q${idx}">${currentAnimal.emoji}</div>`;
        selectedPiece.classList.add('placed');
        selectedPiece.remove();
        selectedPiece = null;
        placed++;
        pc();
        if (typeof starBurst === 'function') starBurst();
        if (placed === 4) {
          stars++;
          progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`;
          confetti();
          try { await Audio2.play(null, { text: currentAnimal.fr, lang: 'fr' }); } catch (e) {}
          await sleep(300);
          await speakPraise();
          await sleep(600);
          if (round >= ROUNDS) showWin();
          else startRound();
        }
      } else {
        slot.classList.add('wrong');
        pe();
        setTimeout(() => slot.classList.remove('wrong'), 400);
      }
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g45-win';
      win.innerHTML = `<div class="g45-win-emoji">🏆</div><div class="g45-win-title">أحسنتِ يا بطلة!</div><div class="g45-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g45-win-btns"><button class="g45-win-btn g45-win-replay" id="g45-replay">🔄 العبي تاني</button><button class="g45-win-btn g45-win-home" id="g45-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); speakPraise();
      document.getElementById('g45-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; startRound(); });
      document.getElementById('g45-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g45-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g45-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>القطع الموضوعة</span><strong>${placed}/4</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g45-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g45-pc').addEventListener('click', () => p.remove());
    });
    startRound();
  }
};
