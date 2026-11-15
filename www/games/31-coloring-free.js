window.Game_31 = {
  async mount(container) {
    container.innerHTML = `
      <style>
        .g31-wrap { display: flex; flex-direction: column; gap: 10px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g31-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f59e0b 100%); color: #fff; padding: 12px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(236,72,153,.35); }
        .g31-title { font-size: 1.15rem; font-weight: 900; }
        .g31-hint { font-size: 0.85rem; font-weight: 800; color: #be185d; text-align: center; }
        .g31-toolbar { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: #fff; padding: 10px; border-radius: 18px; border: 2px solid #fbcfe8; }
        .g31-swatch { width: 34px; height: 34px; border-radius: 50%; border: 3px solid #cbd5e1; cursor: pointer; transition: transform .15s; }
        .g31-swatch.active { transform: scale(1.22); border-color: #1e293b; box-shadow: 0 0 0 3px #fde047; }
        .g31-size { width: 34px; height: 34px; border-radius: 10px; background: #f1f5f9; border: 2px solid #cbd5e1; font-weight: 900; font-size: 0.85rem; color: #334155; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .g31-size.active { background: #ec4899; color: #fff; border-color: #be185d; }
        .g31-canvas-box { position: relative; width: 100%; height: 330px; background: #fff; border-radius: 22px; border: 3px solid #fbcfe8; overflow: hidden; box-shadow: 0 10px 28px rgba(0,0,0,.07); touch-action: none; }
        .g31-canvas-box canvas { display: block; width: 100%; height: 100%; }
        .g31-actions { display: flex; gap: 10px; justify-content: center; }
        .g31-btn { border: none; border-radius: 16px; padding: 12px 20px; font-size: 1rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g31-btn:active { transform: scale(0.95); }
        .g31-btn-clear { background: #fee2e2; color: #b91c1c; box-shadow: 0 4px 0 #fca5a5; }
        .g31-btn-done { background: linear-gradient(180deg, #34d399, #10b981); color: #fff; box-shadow: 0 4px 0 #059669; }
        .g31-win { position: fixed; inset: 0; background: rgba(255,255,255,.96); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 9998; padding: 20px; text-align: center; }
        .g31-win-emoji { font-size: 4.8rem; }
        .g31-win-title { font-size: 1.9rem; font-weight: 900; color: #db2777; }
        .g31-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .g31-win-replay { background: linear-gradient(180deg,#f472b6,#ec4899); color: #fff; box-shadow: 0 5px 0 #be185d; }
        .g31-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
      </style>
      <div class="g31-wrap">
        <div class="g31-header">
          <div class="g31-title">🖍️ Coloriage Libre • رسم حر</div>
          <div style="font-weight:900;font-size:.9rem">🎨 فنانة</div>
        </div>
        <div class="g31-hint">ارسمي براحتك! اختاري لون وحجم القلم</div>
        <div class="g31-toolbar" id="g31-palette"></div>
        <div class="g31-canvas-box" id="g31-area">
          <canvas id="g31-cv"></canvas>
        </div>
        <div class="g31-actions">
          <button class="g31-btn g31-btn-clear" id="g31-clear">🗑️ امسح</button>
          <button class="g31-btn g31-btn-done" id="g31-done">🏆 خلصت الرسمة!</button>
        </div>
      </div>`;

    const colors = ['#e63946', '#3a86ff', '#ffbe0b', '#06d6a0', '#fb8500', '#8338ec', '#ff70a6', '#222222', '#8b4513', '#ffffff'];
    const sizes = [5, 12, 22];
    let currentColor = '#e63946';
    let currentSize = 12;

    const palette = document.getElementById('g31-palette');
    colors.forEach((c, i) => {
      const s = document.createElement('div');
      s.className = 'g31-swatch' + (i === 0 ? ' active' : '');
      s.style.background = c;
      s.addEventListener('click', () => {
        palette.querySelectorAll('.g31-swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        currentColor = c;
      });
      palette.appendChild(s);
    });
    sizes.forEach(sz => {
      const b = document.createElement('div');
      b.className = 'g31-size' + (sz === 12 ? ' active' : '');
      b.textContent = sz;
      b.addEventListener('click', () => {
        palette.querySelectorAll('.g31-size').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentSize = sz;
      });
      palette.appendChild(b);
    });

    const area = document.getElementById('g31-area');
    const cv = document.getElementById('g31-cv');
    const ctx = cv.getContext('2d');
    let drawing = false;

    function initCanvas() {
      const rect = area.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = rect.width * dpr;
      cv.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    }
    initCanvas();

    function pos(e) {
      const rect = cv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = currentColor;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }

    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', move);
    cv.addEventListener('mouseup', end);
    cv.addEventListener('mouseleave', end);
    cv.addEventListener('touchstart', start, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', end);

    document.getElementById('g31-clear').addEventListener('click', initCanvas);
    document.getElementById('g31-done').addEventListener('click', async () => {
      if (typeof starBurst === 'function') starBurst();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'رسمة جميلة يا فنانة!', lang: 'eg' }); } catch (e) {}
      const win = document.createElement('div');
      win.className = 'g31-win';
      win.innerHTML = `
        <div class="g31-win-emoji">🎨🏆</div>
        <div class="g31-win-title">رسمة تحفة يا بطلة!</div>
        <div style="font-size:2rem">⭐⭐⭐⭐⭐</div>
        <div class="g31-win-btns">
          <button class="g31-btn g31-win-replay" id="g31-replay">🔄 ارسمي تاني</button>
          <button class="g31-btn g31-win-home" id="g31-home">🏠 الرئيسية</button>
        </div>`;
      container.appendChild(win);
      document.getElementById('g31-replay').addEventListener('click', () => { win.remove(); initCanvas(); });
      document.getElementById('g31-home').addEventListener('click', () => { location.hash = '#/home'; });
    });
  }
};
