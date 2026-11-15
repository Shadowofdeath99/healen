window.Game_31 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap" style="justify-content:flex-start;align-items:stretch">
        <div class="game-title-fr">🖍️ Coloriage Libre</div>
        <div class="game-hint">ارسمي براحتك! اختاري لون وحجم وابدأي</div>
        <div class="color-toolbar" id="palette"></div>
        <div class="canvas-area" id="canvasArea">
          <canvas id="cv"></canvas>
        </div>
        <div class="draw-actions">
          <button class="action-btn danger" id="clear">🗑️ امسح</button>
        </div>
      </div>`;
    const colors = ['#e63946','#3a86ff','#ffbe0b','#06d6a0','#fb8500','#8338ec','#ff70a6','#222222','#8b4513','#ffffff'];
    const sizes = [4, 10, 20];
    let currentColor = '#e63946';
    let currentSize = 10;

    const palette = document.getElementById('palette');
    colors.forEach((c, i) => {
      const s = document.createElement('div');
      s.className = 'swatch' + (i === 0 ? ' active' : '');
      s.style.background = c;
      s.dataset.color = c;
      s.addEventListener('click', () => {
        palette.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        currentColor = c;
      });
      palette.appendChild(s);
    });
    sizes.forEach((sz, i) => {
      const b = document.createElement('div');
      b.className = 'brush-size' + (sz === 10 ? ' active' : '');
      b.textContent = sz;
      b.dataset.size = sz;
      b.addEventListener('click', () => {
        palette.querySelectorAll('.brush-size').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        currentSize = sz;
      });
      palette.appendChild(b);
    });

    const area = document.getElementById('canvasArea');
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    let drawing = false;

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
    }
    resize();
    window.addEventListener('resize', resize);

    function pos(e){
      const rect = cv.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function start(e){ e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e){
      if(!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end(){ drawing = false; }

    cv.addEventListener('mousedown', start);
    cv.addEventListener('mousemove', move);
    cv.addEventListener('mouseup', end);
    cv.addEventListener('mouseleave', end);
    cv.addEventListener('touchstart', start, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', end);

    document.getElementById('clear').addEventListener('click', () => {
      const rect = area.getBoundingClientRect();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    });
  }
};
