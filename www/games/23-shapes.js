window.Game_23 = {
  async mount(container) {
    const MAX = 6, ROUNDS = 5, UNLOCK_EVERY = 2;
    const STORAGE_KEY = 'helen_g23_unlocked';
    let unlockedMax = Math.min(MAX, Math.max(2, parseInt(localStorage.getItem(STORAGE_KEY) || '2', 10)));
    let successCount = 0, round = 0, stars = 0, wrong = 0, locked = false, explored = new Set();
    let mode = 'explore', target = null;

    container.innerHTML = `
      <style>
        .g23-wrap{display:flex;flex-direction:column;gap:12px;padding:10px;max-width:640px;margin:0 auto;user-select:none;font-family:inherit}
        .g23-header{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#f59e0b 0%,#ea580c 50%,#c2410c 100%);color:#fff;padding:14px 18px;border-radius:22px;box-shadow:0 10px 26px rgba(245,158,11,.35)}
        .g23-title{font-size:1.15rem;font-weight:900}
        .g23-unlock{display:inline-block;background:rgba(255,255,255,.28);padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:800;margin-top:3px}
        .g23-progress{background:rgba(255,255,255,.3);padding:6px 14px;border-radius:999px;font-weight:900;font-size:.95rem}
        .g23-tabs{display:flex;gap:8px;justify-content:center}
        .g23-tab{flex:1;max-width:220px;padding:12px 8px;border-radius:16px;border:none;font-weight:900;font-size:.9rem;cursor:pointer;background:#f1f5f9;color:#475569;transition:all .2s}
        .g23-tab.active{background:linear-gradient(180deg,#f59e0b,#c2410c);color:#fff;box-shadow:0 5px 0 #9a3412}
        .g23-stage{background:#fff;border:3px solid #fed7aa;border-radius:26px;padding:18px 14px 20px;text-align:center;box-shadow:0 14px 34px rgba(0,0,0,.07);position:relative;overflow:hidden;min-height:420px;animation:g23-pop .35s}
        @keyframes g23-pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
        .g23-stage.shake{animation:g23-shk .4s}
        @keyframes g23-shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        .g23-stage.hint{box-shadow:0 0 0 4px #fde68a,0 14px 34px rgba(0,0,0,.07)}
        .g23-q{font-size:1.05rem;font-weight:900;color:#c2410c;margin-bottom:12px}
        .g23-q small{display:block;font-size:.78rem;color:#fb923c;font-weight:700;margin-top:2px}
        .g23-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g23-shape-btn{position:relative;background:#fff;border:4px solid #fed7aa;border-radius:20px;padding:14px;cursor:pointer;box-shadow:0 6px 0 #fdba74;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:6px}
        .g23-shape-btn:active{transform:translateY(2px);box-shadow:0 3px 0 #fdba74}
        .g23-shape-btn .label{font-size:.9rem;font-weight:900;color:#c2410c}
        .g23-shape-btn .label-eg{font-size:.75rem;color:#ea580c;font-weight:800}
        .g23-shape-btn .star-dot{position:absolute;top:4px;right:6px;font-size:.9rem}
        .g23-target{font-size:1.8rem;font-weight:900;color:#c2410c;margin-bottom:8px;cursor:pointer}
        .g23-target-eg{font-size:1.1rem;font-weight:700;color:#ea580c;margin-bottom:14px}
        .g23-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .g23-choice{background:#fff;border:4px solid #fed7aa;border-radius:20px;padding:12px;cursor:pointer;box-shadow:0 6px 0 #fdba74;transition:all .15s}
        .g23-choice:active{transform:translateY(2px);box-shadow:0 3px 0 #fdba74}
        .g23-choice.correct{border-color:#16a34a;box-shadow:0 0 0 5px #22c55e,0 6px 0 #15803d;animation:g23-pop2 .5s}
        .g23-choice.wrong{border-color:#ef4444;box-shadow:0 0 0 5px #f87171,0 6px 0 #b91c1c;animation:g23-shk .4s}
        @keyframes g23-pop2{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1)}}
        .g23-feedback{font-size:1.1rem;font-weight:900;min-height:28px;margin-top:10px;color:#ea580c}
        .g23-hint-box{min-height:44px;background:#fefce8;border:2px dashed #fde047;border-radius:16px;padding:8px 12px;display:none;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:1.05rem;font-weight:800;color:#854d0e}
        .g23-hint-box.visible{display:flex}
        .g23-win{position:absolute;inset:0;background:rgba(255,255,255,.97);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:20;padding:20px}
        .g23-win-emoji{font-size:4.8rem;animation:g23-bounce 1s infinite}
        @keyframes g23-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .g23-win-title{font-size:1.9rem;font-weight:900;background:linear-gradient(90deg,#f59e0b,#c2410c);-webkit-background-clip:text;background-clip:text;color:transparent}
        .g23-win-stars{font-size:2.1rem;letter-spacing:4px}
        .g23-win-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
        .g23-win-btn{border:none;border-radius:16px;padding:14px 24px;font-size:1.05rem;font-weight:900;cursor:pointer}
        .g23-win-replay{background:linear-gradient(180deg,#fb923c,#f59e0b);color:#fff;box-shadow:0 5px 0 #c2410c}
        .g23-win-home{background:#f1f5f9;color:#475569;box-shadow:0 5px 0 #cbd5e1}
        .g23-parent-btn{position:absolute;top:6px;right:8px;background:transparent;border:none;font-size:.85rem;opacity:.25;cursor:pointer;z-index:30}
        .g23-parent-panel{position:absolute;inset:0;background:rgba(15,23,42,.92);color:#fff;border-radius:22px;padding:20px;z-index:40;font-size:.95rem;line-height:1.9}
        .g23-parent-panel h3{margin:0 0 10px;font-size:1.2rem;color:#fbbf24}
        .g23-parent-panel .row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.2);padding:6px 0}
        .g23-parent-panel button{margin-top:10px;width:100%;padding:12px;border-radius:12px;border:none;background:#fbbf24;color:#1e293b;font-weight:900;font-size:1rem;cursor:pointer}
        .g23-celebration{position:fixed;inset:0;pointer-events:none;z-index:9999}
        .g23-confetti{position:absolute;width:12px;height:12px;border-radius:3px;animation:g23-fall 1.6s linear forwards}
        @keyframes g23-fall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      </style>
      <div class="g23-wrap">
        <div class="g23-header">
          <div><div class="g23-title">⬛ Les Formes • الأشكال</div><div class="g23-unlock" id="g23-unlock">🔓 2 أشكال</div></div>
          <div class="g23-progress" id="g23-prog">⭐ 0</div>
        </div>
        <div class="g23-tabs">
          <button class="g23-tab active" id="g23-tab-explore">🎨 اكتشفي</button>
          <button class="g23-tab" id="g23-tab-quiz">🔍 لاقي الشكل</button>
        </div>
        <div class="g23-stage" id="g23-stage">
          <button class="g23-parent-btn" id="g23-parent-btn">⚙️</button>
          <div class="g23-q" id="g23-q"></div>
          <div id="g23-explore-wrap"><div class="g23-grid" id="g23-grid"></div></div>
          <div id="g23-quiz-wrap" style="display:none">
            <div class="g23-target" id="g23-target"></div>
            <div class="g23-target-eg" id="g23-target-eg"></div>
            <div class="g23-choices" id="g23-choices"></div>
          </div>
          <div class="g23-hint-box" id="g23-hint"></div>
          <div class="g23-feedback" id="g23-msg"></div>
        </div>
      </div>`;

    const stageEl = document.getElementById('g23-stage'), qEl = document.getElementById('g23-q'), gridEl = document.getElementById('g23-grid');
    const exploreWrap = document.getElementById('g23-explore-wrap'), quizWrap = document.getElementById('g23-quiz-wrap');
    const targetEl = document.getElementById('g23-target'), targetEgEl = document.getElementById('g23-target-eg');
    const choicesEl = document.getElementById('g23-choices'), hintBox = document.getElementById('g23-hint'), msgEl = document.getElementById('g23-msg');
    const progEl = document.getElementById('g23-prog'), unlockEl = document.getElementById('g23-unlock');
    const tabExplore = document.getElementById('g23-tab-explore'), tabQuiz = document.getElementById('g23-tab-quiz');

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
    function pu() { playTone(523, .12); setTimeout(() => playTone(659, .12), 100); setTimeout(() => playTone(784, .12), 200); setTimeout(() => playTone(1047, .3), 300); }
    function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
    function saveUnlocked() { try { localStorage.setItem(STORAGE_KEY, String(unlockedMax)); } catch (e) {} }
    function updateProgress() { progEl.textContent = mode === 'explore' ? `⭐ ${stars}` : `${round}/${ROUNDS} • ⭐ ${stars}`; unlockEl.textContent = `🔓 ${unlockedMax} أشكال`; }

    async function speakShape(s, lang) {
      if (!s) return;
      try {
        if (lang === 'fr') await Audio2.play(s.frId, { text: s.fr, lang: 'fr' });
        else if (lang === 'eg') await Audio2.play(null, { text: s.eg, lang: 'eg' });
        else { await Audio2.play(s.frId, { text: s.fr, lang: 'fr' }); await sleep(350); await Audio2.play(null, { text: s.eg, lang: 'eg' }); }
      } catch (e) {}
    }
    async function speakPraise() { try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {} await sleep(300); try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {} }
    async function speakEncourage() { try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {} }

    function confetti() {
      const c = document.createElement('div'); c.className = 'g23-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div'); p.className = 'g23-confetti';
        p.style.left = `${Math.random() * 100}%`; p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = `${Math.random() * .4}s`; p.style.animationDuration = `${1.2 + Math.random() * .8}s`;
        c.appendChild(p);
      }
      document.body.appendChild(c); setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); pc(); }
    function tryUnlock() {
      successCount++;
      if (successCount >= UNLOCK_EVERY && unlockedMax < MAX) {
        successCount = 0; unlockedMax++; saveUnlocked(); updateProgress(); pu();
      }
    }

    targetEl.addEventListener('click', () => speakShape(target, 'both'));

    function renderExplore() {
      const shapes = (window.SHARED_SHAPES || []).slice(0, unlockedMax);
      qEl.innerHTML = `🎨 اضغطي على شكل واسمعيه<small>Clique sur une forme</small>`;
      gridEl.innerHTML = '';
      shapes.forEach(s => {
        const btn = document.createElement('button'); btn.className = 'g23-shape-btn'; btn.dataset.fr = s.fr;
        btn.innerHTML = `<svg viewBox="0 0 100 100" width="70" height="70">${s.svg}</svg><div class="label">${s.fr}</div><div class="label-eg">${s.eg}</div>${explored.has(s.fr) ? '<span class="star-dot">⭐</span>' : ''}`;
        btn.addEventListener('click', () => onShapeClick(s)); gridEl.appendChild(btn);
      });
    }
    async function onShapeClick(s) {
      await speakShape(s, 'both');
      if (!explored.has(s.fr)) {
        explored.add(s.fr); stars++; updateProgress(); celebrate();
        if (explored.size >= unlockedMax && unlockedMax < MAX) { unlockedMax++; saveUnlocked(); updateProgress(); pu(); }
        renderExplore();
      }
    }

    function startQuiz() { round = 0; stars = 0; successCount = 0; wrong = 0; newRound(); }
    function newRound() {
      round++; wrong = 0; locked = false; updateProgress();
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); hintBox.innerHTML = ''; msgEl.textContent = '';
      const shapes = (window.SHARED_SHAPES || []).slice(0, Math.max(3, unlockedMax));
      target = shapes[Math.floor(Math.random() * shapes.length)];
      targetEl.textContent = target.fr; targetEgEl.textContent = target.eg;
      const opts = [target];
      while (opts.length < 3 && opts.length < shapes.length) {
        const s = shapes[Math.floor(Math.random() * shapes.length)];
        if (!opts.find(o => o.fr === s.fr)) opts.push(s);
      }
      choicesEl.innerHTML = '';
      shuffle(opts).forEach(s => {
        const btn = document.createElement('button'); btn.className = 'g23-choice'; btn.dataset.fr = s.fr;
        btn.innerHTML = `<svg viewBox="0 0 100 100" width="70" height="70">${s.svg}</svg>`;
        btn.addEventListener('click', () => onChoice(s, btn)); choicesEl.appendChild(btn);
      });
      setTimeout(() => speakShape(target, 'fr'), 300);
    }
    async function onChoice(s, btn) {
      if (locked) return;
      if (s.fr === target.fr) {
        locked = true; btn.classList.add('correct'); stars++; updateProgress(); celebrate();
        msgEl.style.color = '#16a34a'; msgEl.textContent = `🎉 Bravo ! ${target.fr} (${target.eg})`;
        await speakShape(target, 'both'); await sleep(350); await speakPraise(); await sleep(450);
        tryUnlock(); await sleep(300);
        if (round >= ROUNDS) showWin(); else newRound();
      } else {
        wrong++; btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('shake'); setTimeout(() => stageEl.classList.remove('shake'), 400);
        pe(); await speakEncourage();
        if (wrong >= 2) {
          stageEl.classList.add('hint'); hintBox.innerHTML = `💡 الشكل: ${target.fr} (${target.eg})`; hintBox.classList.add('visible');
          const cb = choicesEl.querySelector(`[data-fr="${target.fr}"]`);
          if (cb) cb.style.boxShadow = '0 0 0 5px #fde68a, 0 6px 0 #fdba74';
        }
      }
    }
    function showWin() {
      const win = document.createElement('div'); win.className = 'g23-win';
      win.innerHTML = `<div class="g23-win-emoji">🏆</div><div class="g23-win-title">أحسنتِ يا بطلة!</div><div class="g23-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div><div class="g23-win-btns"><button class="g23-win-btn g23-win-replay" id="g23-replay">🔄 العبي تاني</button><button class="g23-win-btn g23-win-home" id="g23-home">🏠 الرئيسية</button></div>`;
      stageEl.appendChild(win); celebrate(); speakPraise();
      document.getElementById('g23-replay').addEventListener('click', () => { win.remove(); startQuiz(); });
      document.getElementById('g23-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    function switchMode(m) {
      if (mode === m) return; mode = m;
      stageEl.classList.remove('hint', 'shake'); hintBox.classList.remove('visible'); msgEl.textContent = '';
      tabExplore.classList.toggle('active', mode === 'explore'); tabQuiz.classList.toggle('active', mode === 'quiz');
      if (mode === 'explore') { exploreWrap.style.display = 'block'; quizWrap.style.display = 'none'; updateProgress(); renderExplore(); }
      else { exploreWrap.style.display = 'none'; quizWrap.style.display = 'block'; startQuiz(); }
    }
    tabExplore.addEventListener('click', () => switchMode('explore'));
    tabQuiz.addEventListener('click', () => switchMode('quiz'));

    document.getElementById('g23-parent-btn').addEventListener('click', () => {
      const p = document.createElement('div'); p.className = 'g23-parent-panel';
      p.innerHTML = `<h3>👨‍👩‍👧 وضع الوالد</h3><div class="row"><span>الأشكال المتاحة</span><strong>${unlockedMax}/${MAX}</strong></div><div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div><button id="g23-pu">🔓 فتح كل الأشكال</button><button id="g23-pc">إغلاق</button>`;
      stageEl.appendChild(p);
      document.getElementById('g23-pu').addEventListener('click', () => { unlockedMax = MAX; saveUnlocked(); updateProgress(); pu(); confetti(); if (mode === 'explore') renderExplore(); p.remove(); });
      document.getElementById('g23-pc').addEventListener('click', () => p.remove());
    });

    updateProgress(); renderExplore();
  }
};
