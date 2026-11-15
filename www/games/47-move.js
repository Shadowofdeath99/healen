window.Game_47 = {
  async mount(container) {
    let stars = 0, idx = 0, locked = false;
    const MOVES = [
      { fr: 'Saute !',        eg: 'انططي',        emoji: '🤸' },
      { fr: 'Tourne !',       eg: 'لفي',          emoji: '🌀' },
      { fr: 'Tape des mains', eg: 'سقفي',         emoji: '👏' },
      { fr: 'Touche le sol',  eg: 'المسي الأرض',  emoji: '👇' },
      { fr: 'Lève les bras',  eg: 'ارفعي إيديك', emoji: '🙌' },
      { fr: 'Danse !',        eg: 'ارقصي',        emoji: '💃' }
    ];

    container.innerHTML = `
      <style>
        .g47-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g47-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f97316 0%,#ea580c 50%,#c2410c 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(249,115,22,.35)}
        .g47-title{font-size:1.15rem;font-weight:900}
        .g47-pill{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g47-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g47-stage{background:#fff;border:3px solid #fed7aa;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:440px;animation:g47-pop .35s}
        @keyframes g47-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g47-q{font-size:1.05rem;font-weight:900;color:#c2410c;margin-bottom:12px}
        .g47-q small{display:block;font-size:.78rem;color:#fb923c;font-weight:700;margin-top:2px}
        .g47-emoji{font-size:7rem;margin:10px 0;animation:g47-bounce 1s infinite alternate}
        @keyframes g47-bounce{0%{transform:scale(1) translateY(0)}100%{transform:scale(1.1) translateY(-10px)}}
        .g47-fr{font-size:2rem;font-weight:900;color:#c2410c;margin-bottom:4px;direction:ltr}
        .g47-eg{font-size:1.3rem;font-weight:800;color:#ea580c;margin-bottom:16px}
        .g47-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        .g47-btn{border:none;border-radius:18px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer;transition:transform .15s}
        .g47-btn:active{transform:scale(.95)}
        .g47-speak{background:linear-gradient(180deg,#fb923c,#f97316);color:#fff;box-shadow:0 5px 0 #c2410c}
        .g47-done{background:linear-gradient(180deg,#4ade80,#22c55e);color:#fff;box-shadow:0 5px 0 #15803d}
        .g47-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g47-win-emoji{font-size:4.8rem;animation:g47-bounce2 1s infinite}
        @keyframes g47-bounce2{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g47-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#f97316,#c2410c);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g47-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g47-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g47-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g47-win-replay{background:linear-gradient(180deg,#fb923c,#f97316);color:#fff;box-shadow:0 5px 0 #c2410c}
        .g47-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g47-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g47-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g47-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g47-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g47-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g47-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g47-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g47-fall 1.6s linear forwards}
        @keyframes g47-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g47-wrap">
        <div class="g47-header"><div><div class="g47-title">🏃 Bouge avec Moi • اتحركي معايا</div><div class="g47-pill" id="g47-pill">🎯 حركات</div></div><div class="g47-progress" id="g47-prog">⭐ 0</div></div>
        <div class="g47-stage" id="g47-stage">
          <button class="g47-parent-btn" id="g47-parent-btn">⚙️</button>
          <div id="g47-content"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g47-stage'), contentEl = document.getElementById('g47-content');
    const progEl = document.getElementById('g47-prog'), pillEl = document.getElementById('g47-pill');

    let sharedAC = null;
    function getAC() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!sharedAC) sharedAC = new AC();
      if (sharedAC.state === 'suspended') sharedAC.resume().catch(() => {});
      return sharedAC;
    }

    function pc() {
      try {
        const c = getAC();
        if (!c) return;
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.value = 659;
        g.gain.setValueAtTime(.14, c.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .2);
        o.connect(g); g.connect(c.destination);
        o.start(); o.stop(c.currentTime + .2);
      } catch (e) {}
    }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g47-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g47-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play(null, { text: 'برافو!', lang: 'eg' }); } catch (e) {} }

    async function speakMove(m) {
      try { await Audio2.play(null, { text: m.fr, lang: 'fr' }); } catch (e) {}
      await sleep(350);
      try { await Audio2.play(null, { text: m.eg, lang: 'eg' }); } catch (e) {}
    }

    function show() {
      locked = false;
      if (idx >= MOVES.length) {
        progEl.textContent = `${MOVES.length}/${MOVES.length} • ⭐ ${stars}`;
        confetti(); if (typeof starBurst === 'function') starBurst(); pc();
        showWin(); return;
      }
      const m = MOVES[idx];
      pillEl.textContent = `🎯 ${idx + 1} / ${MOVES.length}`;
      progEl.textContent = `${idx + 1}/${MOVES.length} • ⭐ ${stars}`;
      contentEl.innerHTML = `
        <div class="g47-q">🏃 اعملي الحركة دي<small>Fais ce mouvement</small></div>
        <div class="g47-emoji">${m.emoji}</div>
        <div class="g47-fr">${m.fr}</div>
        <div class="g47-eg">${m.eg}</div>
        <div class="g47-btns">
          <button class="g47-btn g47-speak" id="g47-speak">🔊 اسمعي</button>
          <button class="g47-btn g47-done" id="g47-done">✅ عملتها!</button>
        </div>`;
      document.getElementById('g47-speak').addEventListener('click', () => speakMove(m));
      document.getElementById('g47-done').addEventListener('click', async () => {
        if (locked) return;
        locked = true;
        stars++; progEl.textContent = `${idx + 1}/${MOVES.length} • ⭐ ${stars}`;
        pc(); if (typeof starBurst === 'function') starBurst();
        await speakPraise();
        idx++; show();
      });
      setTimeout(() => speakMove(m), 300);
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g47-win';
      win.innerHTML = `<div class="g47-win-emoji">🎉</div><div class="g47-win-title">أحسنتِ يا بطلة!</div><div class="g47-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g47-win-btns"><button class="g47-win-btn g47-win-replay" id="g47-replay">🔄 العبي تاني</button><button class="g47-win-btn g47-win-home" id="g47-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); confetti(); speakPraise();
      document.getElementById('g47-replay').addEventListener('click', () => { win.remove(); idx = 0; stars = 0; show(); });
      document.getElementById('g47-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g47-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g47-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الحركات المكتملة</span><strong>${idx}/${MOVES.length}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g47-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g47-pc').addEventListener('click', () => p.remove());
    });
    show();
  }
};
