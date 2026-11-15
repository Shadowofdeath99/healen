window.Game_46 = {
  async mount(container) {
    let stars = 0, explored = new Set(), lastPart = null;
    const PARTS = [
      { fr: 'Tête',    eg: 'راس',   emoji: '👤' },
      { fr: 'Main',    eg: 'إيد',   emoji: '✋' },
      { fr: 'Pied',    eg: 'رجل',   emoji: '🦶' },
      { fr: 'Œil',     eg: 'عين',   emoji: '👁️' },
      { fr: 'Nez',     eg: 'أنف',   emoji: '👃' },
      { fr: 'Bouche',  eg: 'بق',    emoji: '👄' },
      { fr: 'Oreille', eg: 'ودن',   emoji: '👂' },
      { fr: 'Bras',    eg: 'دراع',  emoji: '💪' },
      { fr: 'Jambe',   eg: 'ساق',   emoji: '🦵' },
      { fr: 'Doigt',   eg: 'صباع',  emoji: '👆' }
    ];

    container.innerHTML = `
      <style>
        .g46-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g46-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f43f5e 0%,#e11d48 50%,#be123c 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(244,63,94,.35)}
        .g46-title{font-size:1.15rem;font-weight:900}
        .g46-pill{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g46-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g46-stage{background:#fff;border:3px solid #fecdd3;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:440px;animation:g46-pop .35s}
        @keyframes g46-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g46-q{font-size:1.05rem;font-weight:900;color:#be123c;margin-bottom:12px}
        .g46-q small{display:block;font-size:.78rem;color:#fb7185;font-weight:700;margin-top:2px}
        .g46-popup{min-height:140px;background:linear-gradient(180deg,#fff1f2,#ffe4e6);border-radius:20px;padding:16px;margin-bottom:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed #fda4af;transition:all .3s;cursor:pointer}
        .g46-popup .emoji{font-size:4.8rem;animation:g46-bounce .6s}
        @keyframes g46-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g46-popup .word-fr{font-size:1.5rem;font-weight:900;color:#be123c}
        .g46-popup .word-eg{font-size:1.2rem;font-weight:700;color:#e11d48}
        .g46-popup .empty{font-size:1rem;color:#94a3b8;font-weight:700}
        .g46-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        .g46-part{position:relative;background:#fff;border:3px solid #fecdd3;border-radius:16px;padding:12px 0;font-size:2rem;cursor:pointer;box-shadow:0 4px 0 #fda4af;transition:all .15s}
        .g46-part:hover{transform:translateY(-2px)}
        .g46-part:active{transform:translateY(2px);box-shadow:0 2px 0 #fda4af}
        .g46-part.explored{background:linear-gradient(180deg,#dcfce7,#bbf7d0);border-color:#22c55e;box-shadow:0 4px 0 #16a34a}
        .g46-part .star-dot{position:absolute;top:2px;left:4px;font-size:.7rem}
        .g46-finish-btn{margin-top:14px;background:linear-gradient(180deg,#34d399,#10b981);color:#fff;border:none;border-radius:16px;padding:12px 24px;font-size:1rem;font-weight:900;cursor:pointer;box-shadow:0 5px 0 #059669;display:none}
        .g46-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g46-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g46-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g46-win-replay{background:linear-gradient(180deg,#fb7185,#f43f5e);color:#fff;box-shadow:0 5px 0 #be123c}
        .g46-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g46-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g46-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g46-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g46-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g46-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g46-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g46-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g46-fall 1.6s linear forwards}
        @keyframes g46-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g46-wrap">
        <div class="g46-header"><div><div class="g46-title">🧍 Parties du Corps • أعضاء الجسم</div><div class="g46-pill" id="g46-pill">🎓 استكشفي</div></div><div class="g46-progress" id="g46-prog">⭐ 0</div></div>
        <div class="g46-stage">
          <button class="g46-parent-btn" id="g46-parent-btn">⚙️</button>
          <div class="g46-q">🧍 اضغطي على عضو واسمعي اسمه<small>Clique sur une partie du corps</small></div>
          <div class="g46-popup" id="g46-popup"><div class="empty">👆 اختاري عضو من تحت</div></div>
          <div class="g46-grid" id="g46-grid"></div>
          <button class="g46-finish-btn" id="g46-finish">🏆 خلصت الاستكشاف!</button>
        </div>
      </div>`;

    const popupEl = document.getElementById('g46-popup'), gridEl = document.getElementById('g46-grid');
    const progEl = document.getElementById('g46-prog'), pillEl = document.getElementById('g46-pill');
    const finishBtn = document.getElementById('g46-finish'), stageEl = container.querySelector('.g46-stage');

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
    function confetti() {
      const c = document.createElement('div'); c.className = 'g46-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g46-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }

    async function onPartClick(p) {
      lastPart = p;
      popupEl.innerHTML = `<div class="emoji">${p.emoji}</div><div class="word-fr">${p.fr}</div><div class="word-eg">${p.eg}</div>`;
      try { await Audio2.play(null, { text: p.fr, lang: 'fr' }); } catch (e) {}
      await sleep(350);
      try { await Audio2.play(null, { text: p.eg, lang: 'eg' }); } catch (e) {}
      if (!explored.has(p.emoji)) {
        explored.add(p.emoji); stars++; progEl.textContent = `⭐ ${stars}`; pc(); confetti();
        if (typeof starBurst === 'function') starBurst();
        pillEl.textContent = `🎓 اكتشفتي ${explored.size} / ${PARTS.length}`;
        if (explored.size >= 5) finishBtn.style.display = 'inline-block';
      }
      renderGrid();
    }

    popupEl.addEventListener('click', () => { if (lastPart) onPartClick(lastPart); });

    function renderGrid() {
      gridEl.innerHTML = '';
      PARTS.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'g46-part' + (explored.has(p.emoji) ? ' explored' : '');
        btn.innerHTML = `${explored.has(p.emoji) ? '<span class="star-dot">⭐</span>' : ''}${p.emoji}`;
        btn.addEventListener('click', () => onPartClick(p));
        gridEl.appendChild(btn);
      });
    }

    finishBtn.addEventListener('click', async () => {
      const win = document.createElement('div'); win.className = 'g46-win';
      win.innerHTML = `<div style="font-size:4.8rem">🧍🏆</div><div style="font-size:1.9rem;font-weight:900;color:#be123c">أحسنتِ يا بطلة!</div><div style="font-size:2rem">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g46-win-btns"><button class="g46-win-btn g46-win-replay" id="g46-replay">🔄 العبي تاني</button><button class="g46-win-btn g46-win-home" id="g46-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); if (typeof starBurst === 'function') starBurst(); pc();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      document.getElementById('g46-replay').addEventListener('click', () => Game_46.mount(container));
      document.getElementById('g46-home').addEventListener('click', () => { location.hash = '#/home'; });
    });

    document.getElementById('g46-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g46-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الأعضاء المكتشفة</span><strong>${explored.size}/${PARTS.length}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g46-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g46-pc').addEventListener('click', () => p.remove());
    });
    renderGrid();
  }
};
