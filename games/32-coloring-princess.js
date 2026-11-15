window.Game_32 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap" style="justify-content:flex-start;align-items:stretch">
        <div class="game-title-fr">👸 Coloriage Princesse</div>
        <div class="game-hint">الوضع المقيّد: الرسم يتقطع برا الحدود</div>
        <div class="color-toolbar" id="palette"></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px">
          <button class="mode-toggle" id="modeFree">🎨 حر</button>
          <button class="mode-toggle guided" id="modeGuided">✏️ مقيّد</button>
        </div>
        <div class="canvas-area" id="canvasArea">
          <svg class="svg-overlay" id="svgOverlay" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"></svg>
          <canvas id="cv"></canvas>
        </div>
        <div class="draw-actions">
          <button class="action-btn danger" id="clear">🗑️ امسح</button>
        </div>
      </div>`;

    // Princess SVG shape path (simplified)
    const PRINCESS_PATHS = [
      // dress
      'M200,180 L140,360 L260,360 Z',
      // bodice
      'M200,120 L180,180 L220,180 Z',
      // head
      'M200,60 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0',
      // crown
      'M160,30 L180,10 L200,30 L220,10 L240,30 L240,45 L160,45 Z',
      // arms
      'M180,140 L150,180 L160,190 L185,155 Z',
      'M220,140 L250,180 L240,190 L215,155 Z'
    ];

    const svg = document.getElementById('svgOverlay');
    svg.innerHTML = PRINCESS_PATHS.map(p =>
      `<path d="${p}" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/>`
    ).join('');

    const colors = ['#e63946','#3a86ff','#ffbe0b','#06d6a0','#fb8500','#8338ec','#ff70a6','#ffe1ea','#8b4513','#ffffff'];
    let currentColor = '#ff70a6';
    let currentSize = 14;

    const palette = document.getElementById('palette');
    colors.forEach((c, i) => {
      const s = document.createElement('div');
      s.className = 'swatch' + (i === 6 ? ' active' : '');
      s.style.background = c;
      s.addEventListener('click', () => {
        palette.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        currentColor = c;
      });
      palette.appendChild(s);
    });

    const area = document.getElementById('canvasArea');
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    let drawing = false;
    let guided = true;
    let canvasRect = null;

    function resize(){
      const rect = area.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = rect.width * dpr;
      cv.height = rect.height * dpr;
      cv.style.width = rect.width + 'px';
      cv.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      canvasRect = rect;
    }
    resize();
    window.addEventListener('resize', resize);

    // Convert touch/mouse to canvas coords
    function pos(e){
      const rect = cv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    // Check if point inside any princess shape using SVG's point-in-fill
    // Use a hidden canvas to rasterize paths, then sample pixels
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    let maskReady = false;

    function buildMask(){
      maskCanvas.width = canvasRect.width;
      maskCanvas.height = canvasRect.height;
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskCtx.scale(1, 1);
      // Draw each path onto mask
      const scaleX = canvasRect.width / 400;
      const scaleY = canvasRect.height / 400;
      maskCtx.save();
      maskCtx.scale(scaleX, scaleY);
      PRINCESS_PATHS.forEach(p => {
        const path = new Path2D(p);
        maskCtx.fillStyle = '#000';
        maskCtx.fill(path);
      });
      maskCtx.restore();
      maskReady = true;
    }

    function isInsideShape(x, y){
      if(!maskReady) buildMask();
      if(x < 0 || y < 0 || x >= maskCanvas.width || y >= maskCanvas.height) return false;
      const px = maskCtx.getImageData(x, y, 1, 1).data;
      return px[3] > 0; // alpha > 0 means inside shape
    }

    function drawSegment(x0, y0, x1, y1){
      if(!guided){
        // free mode: draw everything
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
      // guided: only draw segments where BOTH endpoints are inside shape
      const steps = 10;
      let prevX = x0, prevY = y0;
      for(let i = 1; i <= steps; i++){
        const t = i / steps;
        const cx = x0 + (x1 - x0) * t;
        const cy = y0 + (y1 - y0) * t;
        if(isInsideShape(cx, cy) && isInsideShape(prevX, prevY)){
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
    function start(e){
      e.preventDefault();
      if(!maskReady) buildMask();
      drawing = true;
      last = pos(e);
    }
    function move(e){
      if(!drawing || !last) return;
      e.preventDefault();
      const p = pos(e);
      drawSegment(last.x, last.y, p.x, p.y);
      last = p;
    }
    function end(){ drawing = false; last = null; }

    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', move);
    cv.addEventListener('mouseup', end);
    cv.addEventListener('mouseleave', end);
    cv.addEventListener('touchstart', start, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', end);

    document.getElementById('modeFree').addEventListener('click', (e) => {
      guided = false;
      e.target.classList.add('guided');
      document.getElementById('modeGuided').classList.remove('guided');
    });
    document.getElementById('modeGuided').addEventListener('click', (e) => {
      guided = true;
      e.target.classList.add('guided');
      document.getElementById('modeFree').classList.remove('guided');
    });

    document.getElementById('clear').addEventListener('click', () => {
      const rect = area.getBoundingClientRect();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    });
  }
};
