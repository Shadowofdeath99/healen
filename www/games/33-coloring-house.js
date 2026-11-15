window.Game_33 = {
  async mount(container) {
    container.innerHTML = `
      <style>
        .g33-wrap { display: flex; flex-direction: column; gap: 10px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g33-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%); color: #fff; padding: 12px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(245,158,11,.35); }
        .g33-title { font-size: 1.15rem; font-weight: 900; }
        .g33-toolbar { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; background: #fff; padding: 10px; border-radius: 18px; border: 2px solid #fed7aa; }
        .g33-swatch { width: 32px; height: 32px; border-radius: 50%; border: 3px solid #cbd5e1; cursor: pointer; transition: transform .15s; }
        .g33-swatch.active { transform: scale(1.22); border-color: #1e293b; box-shadow: 0 0 0 3px #fde047; }
        .g33-modes { display: flex; gap: 8px; justify-content: center; }
        .g33-mode { padding: 8px 16px; border-radius: 14px; border: 2px solid #fed7aa; background: #fff; color: #c2410c; font-weight: 900; font-size: 0.9rem; cursor: pointer; }
        .g33-mode.active { background: linear-gradient(180deg,#fb923c,#f97316); color: #fff; border-color: #c2410c; }
        .g33-canvas-box { position: relative; width: 100%; height: 320px; background: #fff; border-radius: 22px; border: 3px solid #fed7aa; overflow: hidden; box-shadow: 0 10px 28px rgba(0,0,0,.07); touch-action: none; }
        .g33-canvas-box canvas { display: block; width: 100%; height: 100%; }
        .g33-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .g33-actions { display: flex; gap: 10px; justify-content: center; }
        .g33-btn { border: none; border-radius: 16px; padding: 12px 20px; font-size: 1rem; font-weight: 900; cursor: pointer; }
        .g33-btn-clear { background: #fee2e2; color: #b91c1c; box-shadow: 0 4px 0 #fca5a5; }
        .g33-btn-done { background: linear-gradient(180deg, #34d399, #10b981); color: #fff; box-shadow: 0 4px 0 #059669; }
        .g33-win { position: fixed; inset: 0; background: rgba(255,255,255,.96); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 9998; padding: 20px; text-align: center; }
        .g33-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .g33-win-replay { background: linear-gradient(180deg,#fb923c,#f97316); color: #fff; box-shadow: 0 5px 0 #c2410c; }
        .g33-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
      </style>
      <div class="g33-wrap">
        <div class="g33-header">
          <div class="g33-title">🏠 Coloriage Maison • تلوين البيت</div>
          <div style="font-weight:900;font-size:.9rem">🏡</div>
        </div>
        <div class="g33-toolbar" id="g33-palette"></div>
        <div class="g33-modes">
          <button class="g33-mode active" id="g33-modeGuided">✏️ داخل الحدود</button>
          <button class="g33-mode" id="g33-modeFree">🎨 تلوين حر</button>
        </div>
        <div class="g33-canvas-box" id="g33-area">
          <canvas id="g33-cv"></canvas>
          <svg class="g33-svg" id="g33-svg" viewBox="0 0 400 400" preserveAspectRatio="none"></svg>
        </div>
        <div class="g33-actions">
          <button class="g33-btn g33-btn-clear" id="g33-clear">🗑️ امسح</button>
          <button class="g33-btn g33-btn-done" id="g33-done">🏆 خلصت التلوين!</button>
        </div>
      </div>`;

    const HOUSE_PATHS = [
      'M80,180 L320,180 L320,360 L80,360 Z',
      'M50,180 L200,60 L350,180 Z',
      'M170,280 L230,280 L230,360 L170,360 Z',
      'M110,220 L150,220 L150,260 L110,260 Z',
      'M250,220 L290,220 L290,260 L250,260 Z'
    ];

    const svg = document.getElementById('g33-svg');
    svg.innerHTML = HOUSE_PATHS.map(p =>
      `<path d="${p}" fill="none" stroke="#334155" stroke-width="3" stroke-linejoin="round"/>`
    ).join('');

    const colors = ['#e63946', '#3a86ff', '#ffbe0b', '#06d6a0', '#fb8500', '#8338ec', '#ff70a6', '#ffe1ea', '#8b4513', '#ffffff'];
    let currentColor = '#fb8500';
    const currentSize = 16;

    const palette = document.getElementById('g33-palette');
    colors.forEach((c, i) => {
      const s = document.createElement('div');
      s.className = 'g33-swatch' + (i === 4 ? ' active' : '');
      s.style.background = c;
      s.addEventListener('click', () => {
        palette.querySelectorAll('.g33-swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        currentColor = c;
      });
      palette.appendChild(s);
    });

    const area = document.getElementById('g33-area');
    const cv = document.getElementById('g33-cv');
    const ctx = cv.getContext('2d');
    let drawing = false;
    let guided = true;
    let canvasRect = null;

    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    let maskReady = false;

    function buildMask() {
      if (!canvasRect) return;
      maskCanvas.width = canvasRect.width;
      maskCanvas.height = canvasRect.height;
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      const scaleX = canvasRect.width / 400;
      const scaleY = canvasRect.height / 400;
      maskCtx.save();
      maskCtx.scale(scaleX, scaleY);
      HOUSE_PATHS.forEach(p => {
        const path = new Path2D(p);
        maskCtx.fillStyle = '#000';
        maskCtx.fill(path);
      });
      maskCtx.restore();
      maskReady = true;
    }

    function initCanvas() {
      const rect = area.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = rect.width * dpr;
      cv.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      canvasRect = rect;
      maskReady = false;
    }
    initCanvas();

    function pos(e) {
      const rect = cv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    function isInsideShape(x, y) {
      if (!maskReady) buildMask();
      if (x < 0 || y < 0 || x >= maskCanvas.width || y >= maskCanvas.height) return false;
      const px = maskCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      return px[3] > 0;
    }

    function drawSegment(x0, y0, x1, y1) {
      if (!guided) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        return;
      }
      const steps = 10;
      let prevX = x0, prevY = y0;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const cx = x0 + (x1 - x0) * t;
        const cy = y0 + (y1 - y0) * t;
        if (isInsideShape(cx, cy) && isInsideShape(prevX, prevY)) {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = currentSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
        prevX = cx; prevY = cy;
      }
    }

    let last = null;
    function start(e) { e.preventDefault(); if (!maskReady) buildMask(); drawing = true; last = pos(e); }
    function move(e) {
      if (!drawing || !last) return;
      e.preventDefault();
      const p = pos(e);
      drawSegment(last.x, last.y, p.x, p.y);
      last = p;
    }
    function end() { drawing = false; last = null; }

    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', move);
    cv.addEventListener('mouseup', end);
    cv.addEventListener('mouseleave', end);
    cv.addEventListener('touchstart', start, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', end);

    const btnGuided = document.getElementById('g33-modeGuided');
    const btnFree = document.getElementById('g33-modeFree');
    btnFree.addEventListener('click', () => { guided = false; btnFree.classList.add('active'); btnGuided.classList.remove('active'); });
    btnGuided.addEventListener('click', () => { guided = true; btnGuided.classList.add('active'); btnFree.classList.remove('active'); });

    document.getElementById('g33-clear').addEventListener('click', initCanvas);
    document.getElementById('g33-done').addEventListener('click', async () => {
      if (typeof starBurst === 'function') starBurst();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'البيت بقى جميل أوي!', lang: 'eg' }); } catch (e) {}
      const win = document.createElement('div');
      win.className = 'g33-win';
      win.innerHTML = `
        <div style="font-size:4.8rem">🏠🏆</div>
        <div style="font-size:1.9rem;font-weight:900;color:#ea580c">أحسنتِ يا بطلة!</div>
        <div style="font-size:2rem">⭐⭐⭐⭐⭐</div>
        <div class="g33-win-btns">
          <button class="g33-btn g33-win-replay" id="g33-replay">🔄 لوّني تاني</button>
          <button class="g33-btn g33-win-home" id="g33-home">🏠 الرئيسية</button>
        </div>`;
      container.appendChild(win);
      document.getElementById('g33-replay').addEventListener('click', () => { win.remove(); initCanvas(); });
      document.getElementById('g33-home').addEventListener('click', () => { location.hash = '#/home'; });
    });
  }
};
