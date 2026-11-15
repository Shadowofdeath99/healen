window.Game_16 = {
  async mount(container) {
    let stars = 0;
    let explored = new Set();
    let lastAnimal = null;

    container.innerHTML = `
      <style>
        .g16-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g16-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(132,204,22,.35); position: relative; overflow: hidden; }
        .g16-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g16-title { font-size: 1.15rem; font-weight: 900; }
        .g16-pill { display: inline-block; background: rgba(255,255,255,0.28); padding: 2px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-top: 3px; }
        .g16-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g16-stage { background: #fff; border: 3px solid #d9f99d; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 420px; animation: g16-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g16-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g16-q { font-size: 1.05rem; font-weight: 900; color: #4d7c0f; margin-bottom: 12px; }
        .g16-q small { display: block; font-size: 0.78rem; color: #84cc16; font-weight: 700; margin-top: 2px; }
        .g16-popup { min-height: 150px; background: linear-gradient(180deg,#f7fee7,#ecfccb); border-radius: 20px; padding: 16px; margin-bottom: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 2px dashed #bef264; transition: all .3s; cursor: pointer; }
        .g16-popup .emoji { font-size: 4.8rem; animation: g16-bounce .6s; }
        @keyframes g16-bounce { 0%{transform:scale(0) rotate(-30deg)} 100%{transform:scale(1) rotate(0)} }
        .g16-popup .word-fr { font-size: 1.5rem; font-weight: 900; color: #4d7c0f; }
        .g16-popup .word-eg { font-size: 1.2rem; font-weight: 700; color: #65a30d; }
        .g16-popup .empty { font-size: 1rem; color: #94a3b8; font-weight: 700; }
        .g16-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .g16-animal-btn { position: relative; background: #fff; border: 3px solid #bef264; border-radius: 18px; padding: 14px 0; font-size: 2.4rem; cursor: pointer; box-shadow: 0 4px 0 #a3e635; transition: all 0.15s; }
        .g16-animal-btn:hover { transform: translateY(-2px); }
        .g16-animal-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #a3e635; }
        .g16-animal-btn.explored { background: linear-gradient(180deg,#dcfce7,#bbf7d0); border-color: #22c55e; box-shadow: 0 4px 0 #16a34a; }
        .g16-animal-btn .star-dot { position: absolute; top: 2px; left: 4px; font-size: 0.7rem; }
        .g16-finish-btn { margin-top: 14px; background: linear-gradient(180deg,#34d399,#10b981); color: #fff; border: none; border-radius: 16px; padding: 12px 24px; font-size: 1rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #059669; display: none; }
        .g16-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g16-pop .4s; padding: 20px; }
        .g16-win-emoji { font-size: 4.8rem; animation: g16-winBounce 1s infinite; }
        @keyframes g16-winBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g16-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#84cc16,#4d7c0f); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g16-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g16-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g16-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g16-win-replay { background: linear-gradient(180deg,#a3e635,#65a30d); color: #fff; box-shadow: 0 5px 0 #4d7c0f; }
        .g16-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g16-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g16-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g16-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g16-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g16-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g16-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g16-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g16-fall 1.6s linear forwards; }
        @keyframes g16-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g16-wrap">
        <div class="g16-header">
          <div>
            <div class="g16-title">🐾 Les Animaux & Sons • حيوانات وأصوات</div>
            <div class="g16-pill" id="g16-pill">🎓 استكشفي الحيوانات</div>
          </div>
          <div class="g16-progress" id="g16-prog">⭐ 0</div>
        </div>
        <div class="g16-stage">
          <button class="g16-parent-btn" id="g16-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g16-q">🐾 اضغطي على حيوان واسمعي اسمه<small>Clique sur un animal</small></div>
          <div class="g16-popup" id="g16-popup">
            <div class="empty">👆 اختاري حيوان من تحت</div>
          </div>
          <div class="g16-grid" id="g16-grid"></div>
          <button class="g16-finish-btn" id="g16-finish">🏆 خلصت الاستكشاف!</button>
        </div>
      </div>
    `;

    const popupEl = document.getElementById('g16-popup');
    const gridEl = document.getElementById('g16-grid');
    const progEl = document.getElementById('g16-prog');
    const pillEl = document.getElementById('g16-pill');
    const finishBtn = document.getElementById('g16-finish');
    const stageEl = container.querySelector('.g16-stage');

    let sharedAC = null;
    function getAC() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!sharedAC) sharedAC = new AC();
      if (sharedAC.state === 'suspended') sharedAC.resume().catch(() => {});
      return sharedAC;
    }

    function playTone(freq, dur, type) {
      try {
        const ctx = getAC();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (dur || 0.2));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (dur || 0.2));
      } catch (e) {}
    }
    function playCorrectTone() { playTone(523, .15, 'sine'); setTimeout(() => playTone(659, .15, 'sine'), 120); setTimeout(() => playTone(784, .25, 'sine'), 240); }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g16-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g16-confetti';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }

    async function onAnimalClick(animal) {
      lastAnimal = animal;
      popupEl.innerHTML = `
        <div class="emoji">${animal.emoji}</div>
        <div class="word-fr">${animal.fr}</div>
        <div class="word-eg">${animal.eg}</div>
      `;
      try { await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' }); } catch (e) {}
      await sleep(350);
      try { await Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' }); } catch (e) {}
      if (!explored.has(animal.emoji)) {
        explored.add(animal.emoji);
        stars++;
        progEl.textContent = `⭐ ${stars}`;
        playCorrectTone();
        confetti();
        if (typeof starBurst === 'function') starBurst();
        const totalAnimals = (window.SHARED?.animals || []).length;
        pillEl.textContent = `🎓 اكتشفتي ${explored.size} / ${totalAnimals} حيوان`;
        if (explored.size >= 5) finishBtn.style.display = 'inline-block';
      }
      renderGrid();
    }

    popupEl.addEventListener('click', () => {
      if (lastAnimal) onAnimalClick(lastAnimal);
    });

    function renderGrid() {
      gridEl.innerHTML = '';
      (window.SHARED?.animals || []).forEach(animal => {
        const btn = document.createElement('button');
        btn.className = 'g16-animal-btn' + (explored.has(animal.emoji) ? ' explored' : '');
        btn.innerHTML = `${explored.has(animal.emoji) ? '<span class="star-dot">⭐</span>' : ''}${animal.emoji}`;
        btn.addEventListener('click', () => onAnimalClick(animal));
        gridEl.appendChild(btn);
      });
    }

    finishBtn.addEventListener('click', async () => {
      const win = document.createElement('div');
      win.className = 'g16-win';
      win.innerHTML = `
        <div class="g16-win-emoji">🏆</div>
        <div class="g16-win-title">أحسنتِ يا بطلة!</div>
        <div class="g16-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g16-win-btns">
          <button class="g16-win-btn g16-win-replay" id="g16-replay">🔄 العبي تاني</button>
          <button class="g16-win-btn g16-win-home" id="g16-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      confetti();
      if (typeof starBurst === 'function') starBurst();
      playCorrectTone();
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      document.getElementById('g16-replay').addEventListener('click', () => Game_16.mount(container));
      document.getElementById('g16-home').addEventListener('click', () => { location.hash = '#/home'; });
    });

    document.getElementById('g16-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g16-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>الحيوانات المكتشفة</span><strong>${explored.size} / ${(window.SHARED?.animals || []).length}</strong></div>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g16-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g16-parent-close').addEventListener('click', () => panel.remove());
    });

    renderGrid();
  }
};
