window.Game_39 = {
  async mount(container) {
    let stars = 0, explored = new Set(), lastItem = null;

    container.innerHTML = `
      <style>
        .g39-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g39-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#06b6d4 0%,#0891b2 50%,#0e7490 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(6,182,212,.35)}
        .g39-title{font-size:1.15rem;font-weight:900}
        .g39-pill{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g39-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g39-stage{background:#fff;border:3px solid #a5f3fc;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g39-pop .35s}
        @keyframes g39-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g39-q{font-size:1.05rem;font-weight:900;color:#0e7490;margin-bottom:12px}
        .g39-q small{display:block;font-size:.78rem;color:#22d3ee;font-weight:700;margin-top:2px}
        .g39-popup{min-height:150px;background:linear-gradient(180deg,#ecfeff,#cffafe);border-radius:20px;padding:16px;margin-bottom:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed #67e8f9;transition:all .3s;cursor:pointer}
        .g39-popup .emoji{font-size:4.8rem;animation:g39-bounce .6s}
        @keyframes g39-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g39-popup .word-fr{font-size:1.5rem;font-weight:900;color:#0e7490}
        .g39-popup .word-eg{font-size:1.2rem;font-weight:700;color:#0891b2}
        .g39-popup .empty{font-size:1rem;color:#94a3b8;font-weight:700}
        .g39-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .g39-item{position:relative;background:#fff;border:3px solid #a5f3fc;border-radius:18px;padding:14px 0;font-size:2.4rem;cursor:pointer;box-shadow:0 4px 0 #67e8f9;transition:all .15s}
        .g39-item:hover{transform:translateY(-2px)}
        .g39-item:active{transform:translateY(2px);box-shadow:0 2px 0 #67e8f9}
        .g39-item.explored{background:linear-gradient(180deg,#dcfce7,#bbf7d0);border-color:#22c55e;box-shadow:0 4px 0 #16a34a}
        .g39-item .star-dot{position:absolute;top:2px;left:4px;font-size:.7rem}
        .g39-finish-btn{margin-top:14px;background:linear-gradient(180deg,#34d399,#10b981);color:#fff;border:none;border-radius:16px;padding:12px 24px;font-size:1rem;font-weight:900;cursor:pointer;box-shadow:0 5px 0 #059669;display:none}
        .g39-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g39-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g39-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g39-win-replay{background:linear-gradient(180deg,#22d3ee,#06b6d4);color:#fff;box-shadow:0 5px 0 #0e7490}
        .g39-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g39-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g39-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g39-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g39-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g39-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g39-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g39-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g39-fall 1.6s linear forwards}
        @keyframes g39-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g39-wrap">
        <div class="g39-header"><div><div class="g39-title">🌧️ Son de la Nature • الطبيعة</div><div class="g39-pill" id="g39-pill">🎓 استكشفي</div></div><div class="g39-progress" id="g39-prog">⭐ 0</div></div>
        <div class="g39-stage">
          <button class="g39-parent-btn" id="g39-parent-btn">⚙️</button>
          <div class="g39-q">🌧️ اضغطي على عنصر واسمعي اسمه<small>Clique pour écouter</small></div>
          <div class="g39-popup" id="g39-popup"><div class="empty">👆 اختاري عنصر من تحت</div></div>
          <div class="g39-grid" id="g39-grid"></div>
          <button class="g39-finish-btn" id="g39-finish">🏆 خلصت الاستكشاف!</button>
        </div>
      </div>`;

    const popupEl = document.getElementById('g39-popup'), gridEl = document.getElementById('g39-grid');
    const progEl = document.getElementById('g39-prog'), pillEl = document.getElementById('g39-pill');
    const finishBtn = document.getElementById('g39-finish'), stageEl = container.querySelector('.g39-stage');

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
      const c = document.createElement('div'); c.className = 'g39-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g39-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }

    async function onItemClick(n) {
      lastItem = n;
      popupEl.innerHTML = `<div class="emoji">${n.emoji}</div><div class="word-fr">${n.fr}</div><div class="word-eg">${n.eg}</div>`;
      try { await Audio2.play('fr_' + n.fr.toLowerCase().replace(/[^a-z]/g, ''), { text: n.fr, lang: 'fr' }); } catch (e) {}
      await sleep(350);
      try { await Audio2.play(null, { text: n.eg, lang: 'eg' }); } catch (e) {}
      if (!explored.has(n.emoji)) {
        explored.add(n.emoji);
        stars++;
        progEl.textContent = `⭐ ${stars}`;
        pc();
        confetti();
        if (typeof starBurst === 'function') starBurst();
        pillEl.textContent = `🎓 اكتشفتي ${explored.size} عنصر`;
        if (explored.size >= 4) finishBtn.style.display = 'inline-block';
      }
      renderGrid();
    }

    popupEl.addEventListener('click', () => { if (lastItem) onItemClick(lastItem); });

    function renderGrid() {
      gridEl.innerHTML = '';
      (window.NATURE_SOUNDS || []).forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'g39-item' + (explored.has(n.emoji) ? ' explored' : '');
        btn.innerHTML = `${explored.has(n.emoji) ? '<span class="star-dot">⭐</span>' : ''}${n.emoji}`;
        btn.addEventListener('click', () => onItemClick(n));
        gridEl.appendChild(btn);
      });
    }

    finishBtn.addEventListener('click', async () => {
      const win = document.createElement('div'); win.className = 'g39-win';
      win.innerHTML = `<div style="font-size:4.8rem">🌈🏆</div><div style="font-size:1.9rem;font-weight:900;color:#0e7490">أحسنتِ يا بطلة!</div><div style="font-size:2rem">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g39-win-btns"><button class="g39-win-btn g39-win-replay" id="g39-replay">🔄 العبي تاني</button><button class="g39-win-btn g39-win-home" id="g39-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); if (typeof starBurst === 'function') starBurst(); pc();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      document.getElementById('g39-replay').addEventListener('click', () => Game_39.mount(container));
      document.getElementById('g39-home').addEventListener('click', () => { location.hash = '#/home'; });
    });

    document.getElementById('g39-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g39-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>العناصر المكتشفة</span><strong>${explored.size}/${(window.NATURE_SOUNDS || []).length}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g39-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g39-pc').addEventListener('click', () => p.remove());
    });
    renderGrid();
  }
};
