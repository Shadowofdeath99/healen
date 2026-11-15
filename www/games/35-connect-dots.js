window.Game_35 = {
  async mount(container) {
    const ROUNDS = 5;
    let round = 0, stars = 0, wrong = 0, connected = [], nextNum = 1, N = 10;

    const SHAPES = [
      {
        name: 'نجمة ⭐',
        pts: [
          {x:50,y:10},{x:62,y:36},{x:90,y:40},{x:69,y:60},{x:74,y:88},
          {x:50,y:74},{x:26,y:88},{x:31,y:60},{x:10,y:40},{x:38,y:36}
        ]
      },
      {
        name: 'بيت 🏠',
        pts: [
          {x:50,y:12},{x:84,y:42},{x:74,y:42},{x:74,y:86},{x:56,y:86},
          {x:56,y:64},{x:44,y:64},{x:44,y:86},{x:26,y:86},{x:26,y:42},{x:16,y:42}
        ]
      },
      {
        name: 'قلب ❤️',
        pts: [
          {x:50,y:28},{x:66,y:14},{x:85,y:22},{x:88,y:44},{x:72,y:66},
          {x:50,y:88},{x:28,y:66},{x:12,y:44},{x:15,y:22},{x:34,y:14}
        ]
      },
      {
        name: 'تاج 👑',
        pts: [
          {x:16,y:76},{x:14,y:32},{x:34,y:54},{x:50,y:22},{x:66,y:54},
          {x:86,y:32},{x:84,y:76},{x:62,y:82},{x:38,y:82}
        ]
      },
      {
        name: 'شجرة 🎄',
        pts: [
          {x:50,y:10},{x:72,y:38},{x:60,y:38},{x:82,y:68},{x:58,y:68},
          {x:58,y:88},{x:42,y:88},{x:42,y:68},{x:18,y:68},{x:40,y:38},{x:28,y:38}
        ]
      }
    ];

    container.innerHTML = `
      <style>
        .g35-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g35-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 50%,#6d28d9 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(139,92,246,.35)}
        .g35-title{font-size:1.15rem;font-weight:900}
        .g35-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g35-stage{background:#fff;border:3px solid #ddd6fe;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:430px;animation:g35-pop .35s}
        @keyframes g35-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g35-q{font-size:1.05rem;font-weight:900;color:#6d28d9;margin-bottom:8px}
        .g35-q small{display:block;font-size:.78rem;color:#a78bfa;font-weight:700;margin-top:2px}
        .g35-progress-bar{height:10px;background:#ede9fe;border-radius:999px;margin-bottom:12px;overflow:hidden}
        .g35-progress-fill{height:100%;background:linear-gradient(90deg,#a78bfa,#7c3aed);border-radius:999px;transition:width .3s;width:0%}
        .g35-dots-wrap{position:relative;width:100%;max-width:340px;height:310px;margin:0 auto;background:#faf5ff;border-radius:20px;border:2px dashed #ddd6fe}
        .g35-dot-point{position:absolute;width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#a78bfa,#7c3aed);color:#fff;font-weight:900;font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 #6d28d9;transition:all .2s;border:none;z-index:2}
        .g35-dot-point:active{transform:scale(0.95)}
        .g35-dot-point.done{background:linear-gradient(180deg,#4ade80,#22c55e);box-shadow:0 4px 0 #15803d;pointer-events:none;transform:scale(1.08)}
        .g35-dot-point.hint-next{box-shadow:0 0 0 5px #fde047, 0 4px 0 #6d28d9;transform:scale(1.15)}
        .g35-dot-point.wrong{animation:g35-shk .4s}
        @keyframes g35-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        .g35-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#7c3aed}
        .g35-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g35-win-emoji{font-size:4.8rem;animation:g35-bounce 1s infinite}
        @keyframes g35-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g35-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#8b5cf6,#6d28d9);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g35-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g35-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g35-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g35-win-replay{background:linear-gradient(180deg,#a78bfa,#8b5cf6);color:#fff;box-shadow:0 5px 0 #6d28d9}
        .g35-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g35-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g35-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g35-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g35-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g35-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g35-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g35-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g35-fall 1.6s linear forwards}
        @keyframes g35-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g35-wrap">
        <div class="g35-header"><div><div class="g35-title">🔵 Relie les Points • وصّل النقط</div></div><div class="g35-progress" id="g35-prog">⭐ 0</div></div>
        <div class="g35-stage" id="g35-stage">
          <button class="g35-parent-btn" id="g35-parent-btn">⚙️</button>
          <div class="g35-q">🔵 وصّلي النقط بالترتيب من 1 لـ <span id="g35-n">10</span><small>Relie les points dans l'ordre</small></div>
          <div class="g35-progress-bar"><div class="g35-progress-fill" id="g35-fill"></div></div>
          <div class="g35-dots-wrap" id="g35-dots"></div>
          <div class="g35-feedback" id="g35-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g35-stage'), dotsEl = document.getElementById('g35-dots');
    const fillEl = document.getElementById('g35-fill'), msgEl = document.getElementById('g35-msg');
    const progEl = document.getElementById('g35-prog'), nEl = document.getElementById('g35-n');
    let currentShape = SHAPES[0];

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
    function updateProgress() { progEl.textContent = `${round}/${ROUNDS} • ⭐ ${stars}`; fillEl.style.width = (connected.length / N * 100) + '%'; }
    async function speakNum(n) { const o = (window.SHARED?.numbers || [])[n - 1]; if (!o) return; try { await Audio2.play(o.frId, { text: o.fr, lang: 'fr' }); } catch (e) {} }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play(null, { text: 'برافو!', lang: 'eg' }); } catch (e) {} }
    async function speakEncourage() { try { await Audio2.play(null, { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {} }
    function confetti() {
      const c = document.createElement('div'); c.className = 'g35-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g35-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }

    function startRound() {
      round++; connected = []; nextNum = 1; wrong = 0; msgEl.textContent = '';
      currentShape = SHAPES[(round - 1) % SHAPES.length];
      N = currentShape.pts.length;
      nEl.textContent = N;
      dotsEl.innerHTML = '';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
      svg.id = 'g35-svg';
      dotsEl.appendChild(svg);
      currentShape.pts.forEach((pt, idx) => {
        const n = idx + 1;
        const p = { x: pt.x, y: pt.y, n };
        const btn = document.createElement('button');
        btn.className = 'g35-dot-point';
        btn.dataset.n = n;
        btn.textContent = n;
        btn.style.left = `calc(${p.x}% - 20px)`;
        btn.style.top = `calc(${p.y}% - 20px)`;
        btn.addEventListener('click', () => onDotClick(p, btn));
        dotsEl.appendChild(btn);
      });
      updateProgress();
    }

    async function onDotClick(p, btn) {
      if (p.n === nextNum) {
        dotsEl.querySelectorAll('.g35-dot-point').forEach(b => b.classList.remove('hint-next'));
        btn.classList.add('done');
        connected.push(p);
        nextNum++;
        wrong = 0;
        playTone(400 + p.n * 35, .15, 'sine');
        drawLines(nextNum > N);
        updateProgress();
        await speakNum(p.n);
        if (nextNum > N) {
          stars++; updateProgress(); celebrate();
          msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! رسمتي ${currentShape.name}`;
          await speakPraise(); await sleep(700);
          if (round >= ROUNDS) showWin(); else startRound();
        }
      } else {
        wrong++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 400);
        pe();
        if (wrong >= 2) {
          msgEl.style.color = '#854d0e';
          msgEl.textContent = `💡 التالي: ${nextNum}`;
          const nb = dotsEl.querySelector(`[data-n="${nextNum}"]`);
          if (nb) nb.classList.add('hint-next');
        } else {
          await speakEncourage();
        }
      }
    }

    function drawLines(closeShape) {
      const svg = document.getElementById('g35-svg');
      if (!svg) return;
      svg.innerHTML = '';
      if (connected.length < 2) return;
      const list = closeShape ? [...connected, connected[0]] : connected;
      const pts = list.map(p => `${p.x},${p.y}`).join(' ');
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', closeShape ? 'rgba(167,139,250,0.2)' : 'none');
      poly.setAttribute('stroke', '#7c3aed');
      poly.setAttribute('stroke-width', '2');
      poly.setAttribute('stroke-linecap', 'round');
      poly.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(poly);
    }

    function showWin() {
      const win = document.createElement('div'); win.className = 'g35-win';
      win.innerHTML = `<div class="g35-win-emoji">🏆</div><div class="g35-win-title">أحسنتِ يا بطلة!</div><div class="g35-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g35-win-btns"><button class="g35-win-btn g35-win-replay" id="g35-replay">🔄 العبي تاني</button><button class="g35-win-btn g35-win-home" id="g35-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g35-replay').addEventListener('click', () => { win.remove(); round = 0; stars = 0; startRound(); });
      document.getElementById('g35-home').addEventListener('click', () => { location.hash = '#/home'; });
    }
    document.getElementById('g35-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g35-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><div class="row"><span>التقدم</span><strong>${connected.length}/${N}</strong></div><button id="g35-pc">إغلاق</button>`;
      stageEl.appendChild(p); document.getElementById('g35-pc').addEventListener('click', () => p.remove());
    });
    startRound();
  }
};
