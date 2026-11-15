window.Game_35 = {
  async mount(container){
    // Star pattern with 10 points
    const N = 10;
    const cx = 200, cy = 200, r = 140;
    const points = [];
    for(let i = 0; i < N; i++){
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        n: i + 1
      });
    }

    container.innerHTML = `
      <div class="game-wrap" style="justify-content:flex-start;align-items:stretch">
        <div class="game-title-fr">🔵 Relie les Points</div>
        <div class="game-hint">وصّل النقط بالترتيب من 1 لـ 10</div>
        <div class="dots-wrap" id="dotsWrap">
          <canvas id="lineCv"></canvas>
          <div id="dotsLayer" style="position:absolute;inset:0"></div>
        </div>
      </div>`;

    const wrap = document.getElementById('dotsWrap');
    const canvas = document.getElementById('lineCv');
    const ctx = canvas.getContext('2d');
    const layer = document.getElementById('dotsLayer');

    let scaleX = 1, scaleY = 1;

    function resize(){
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      scaleX = rect.width / 400;
      scaleY = rect.height / 400;
      positionDots();
      redrawLines();
    }

    function positionDots(){
      layer.querySelectorAll('.dot-point').forEach(el => {
        const n = parseInt(el.dataset.n);
        const p = points[n - 1];
        el.style.left = (p.x * scaleX - 18) + 'px';
        el.style.top = (p.y * scaleY - 18) + 'px';
      });
    }

    let connected = [];
    let nextNum = 1;

    function redrawLines(){
      const rect = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if(connected.length < 2) return;
      ctx.strokeStyle = '#06d6a0';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      connected.forEach((n, i) => {
        const p = points[n - 1];
        const x = p.x * scaleX;
        const y = p.y * scaleY;
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    points.forEach(p => {
      const el = document.createElement('div');
      el.className = 'dot-point';
      el.dataset.n = p.n;
      el.textContent = p.n;
      el.addEventListener('click', () => {
        if(p.n === nextNum){
          el.classList.add('done');
          connected.push(p.n);
          nextNum++;
          redrawLines();
          Audio2.play('fr_'+['un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix'][p.n-1], { text: String(p.n), lang: 'fr' });
          if(nextNum > N){
            starBurst();
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo ! ⭐</div><div style="font-size:60px">⭐</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 600);
          }
        } else {
          el.style.background = '#ffb3b3';
          setTimeout(() => el.style.background = '', 400);
        }
      });
      layer.appendChild(el);
    });

    resize();
    window.addEventListener('resize', resize);
  }
};
