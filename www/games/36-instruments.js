window.Game_36 = {
  async mount(container) {
    let stars = 0, explored = new Set(), lastInst = null;

    container.innerHTML = `
      <style>
        .g36-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g36-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f59e0b 0%,#d97706 50%,#b45309 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(245,158,11,.35)}
        .g36-title{font-size:1.15rem;font-weight:900}
        .g36-pill{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g36-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g36-stage{background:#fff;border:3px solid #fde68a;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g36-pop .35s}
        @keyframes g36-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g36-q{font-size:1.05rem;font-weight:900;color:#b45309;margin-bottom:12px}
        .g36-q small{display:block;font-size:.78rem;color:#f59e0b;font-weight:700;margin-top:2px}
        .g36-popup{min-height:150px;background:linear-gradient(180deg,#fffbeb,#fef3c7);border-radius:20px;padding:16px;margin-bottom:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed #fcd34d;transition:all .3s;cursor:pointer}
        .g36-popup .emoji{font-size:4.8rem;animation:g36-bounce .6s}
        @keyframes g36-bounce{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
        .g36-popup .word-fr{font-size:1.5rem;font-weight:900;color:#b45309}
        .g36-popup .word-eg{font-size:1.2rem;font-weight:700;color:#d97706}
        .g36-popup .empty{font-size:1rem;color:#94a3b8;font-weight:700}
        .g36-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .g36-inst{position:relative;background:#fff;border:3px solid #fde68a;border-radius:18px;padding:14px 0;font-size:2.4rem;cursor:pointer;box-shadow:0 4px 0 #fcd34d;transition:all .15s}
        .g36-inst:hover{transform:translateY(-2px)}
        .g36-inst:active{transform:translateY(2px);box-shadow:0 2px 0 #fcd34d}
        .g36-inst.explored{background:linear-gradient(180deg,#dcfce7,#bbf7d0);border-color:#22c55e;box-shadow:0 4px 0 #16a34a}
        .g36-inst .star-dot{position:absolute;top:2px;left:4px;font-size:.7rem}
        .g36-finish-btn{margin-top:14px;background:linear-gradient(180deg,#34d399,#10b981);color:#fff;border:none;border-radius:16px;padding:12px 24px;font-size:1rem;font-weight:900;cursor:pointer;box-shadow:0 5px 0 #059669;display:none}
        .g36-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g36-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g36-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g36-win-replay{background:linear-gradient(180deg,#fbbf24,#f59e0b);color:#fff;box-shadow:0 5px 0 #b45309}
        .g36-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g36-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g36-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g36-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g36-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g36-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g36-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g36-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g36-fall 1.6s linear forwards}
        @keyframes g36-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g36-wrap">
        <div class="g36-header"><div><div class="g36-title">🎹 Les Instruments • الآلات</div><div class="g36-pill" id="g36-pill">🎓 استكشفي</div></div><div class="g36-progress" id="g36-prog">⭐ 0</div></div>
        <div class="g36-stage">
          <button class="g36-parent-btn" id="g36-parent-btn">⚙️</button>
          <div class="g36-q">🎹 اضغطي على آلة واسمعي صوتها<small>Clique sur un instrument</small></div>
          <div class="g36-popup" id="g36-popup"><div class="empty">👆 اختاري آلة من تحت</div></div>
          <div class="g36-grid" id="g36-grid"></div>
          <button class="g36-finish-btn" id="g36-finish">🏆 خلصت الاستكشاف!</button>
        </div>
      </div>`;

    const popupEl = document.getElementById('g36-popup'), gridEl = document.getElementById('g36-grid');
    const progEl = document.getElementById('g36-prog'), pillEl = document.getElementById('g36-pill');
    const finishBtn = document.getElementById('g36-finish'), stageEl = container.querySelector('.g36-stage');

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
        g.gain.setValueAtTime(.2, c.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, c.currentTime + (d || .45));
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + (d || .45));
      } catch (e) {}
    }
    function pc() { playTone(523, .15); setTimeout(() => playTone(659, .15), 120); setTimeout(() => playTone(784, .25), 240); }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g36-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g36-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }

    async function onInstClick(inst) {
      lastInst = inst;
      popupEl.innerHTML = `<div class="emoji">${inst.emoji}</div><div class="word-fr">${inst.fr}</div><div class="word-eg">${inst.eg}</div>`;
      playTone(inst.freq || 440, 0.45, inst.type || 'sine');
      await sleep(450);
      try { await Audio2.play('fr_' + inst.fr.toLowerCase().replace(/[^a-z]/g, ''), { text: inst.fr, lang: 'fr' }); } catch (e) {}
      await sleep(350);
      try { await Audio2.play(null, { text: inst.eg, lang: 'eg' }); } catch (e) {}
      if (!explored.has(inst.emoji)) {
        explored.add(inst.emoji);
        stars++;
        progEl.textContent = `⭐ ${stars}`;
        pc();
        confetti();
        if (typeof starBurst === 'function') starBurst();
        pillEl.textContent = `🎓 اكتشفتي ${explored.size} آلة`;
        if (explored.size >= 4) finishBtn.style.display = 'inline-block';
      }
      renderGrid();
    }

    popupEl.addEventListener('click', () => { if (lastInst) onInstClick(lastInst); });

    function renderGrid() {
      gridEl.innerHTML = '';
      (window.INSTRUMENTS || []).forEach(inst => {
        const btn = document.createElement('button');
        btn.className = 'g36-inst' + (explored.has(inst.emoji) ? ' explored' : '');
        btn.innerHTML = `${explored.has(inst.emoji) ? '<span class="star-dot">⭐</span>' : ''}${inst.emoji}`;
        btn.addEventListener('click', () => onInstClick(inst));
        gridEl.appendChild(btn);
      });
    }

    finishBtn.addEventListener('click', async () => {
      const win = document.createElement('div'); win.className = 'g36-win';
      win.innerHTML = `<div style="font-size:4.8rem">🎹🏆</div><div style="font-size:1.9rem;font-weight:900;color:#b45309">أحسنتِ يا بطلة!</div><div style="font-size:2rem">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g36-win-btns"><button class="g36-win-btn g36-win-replay" id="g36-replay">🔄 العبي تاني</button><button class="g36-win-btn g36-win-home" id="g36-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); if (typeof starBurst === 'function') starBurst(); pc();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      document.getElementById('g36-replay').addEventListener('click', () => Game_36.mount(container));
      document.getElementById('g36-home').addEventListener('click', () => { location.hash = '#/home'; });
    });

    document.getElementById('g36-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g36-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الآلات المكتشفة</span><strong>${explored.size}/${(window.INSTRUMENTS || []).length}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g36-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g36-pc').addEventListener('click', () => p.remove());
    });
    renderGrid();
  }
};
