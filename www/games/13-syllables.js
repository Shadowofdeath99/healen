window.Game_13 = {
  async mount(container) {
    const TOTAL_ROUNDS = 5;
    let round = 0;
    let stars = 0;
    let wrongThisRound = 0;
    let locked = false;
    let currentItem = null;
    let picked = [];

    const SYLLABLE_WORDS = [
      { parts: ['ma','man'], word: 'maman', emoji: '👩', eg: 'ماما' },
      { parts: ['pa','pa'], word: 'papa', emoji: '👨', eg: 'بابا' },
      { parts: ['cha','ton'], word: 'chaton', emoji: '🐱', eg: 'قطة صغيرة' },
      { parts: ['bou','ton'], word: 'bouton', emoji: '🔘', eg: 'زرار' },
      { parts: ['ba','na','ne'], word: 'banane', emoji: '🍌', eg: 'موزة' },
      { parts: ['bi','be','ron'], word: 'biberon', emoji: '🍼', eg: 'ببرونة' },
      { parts: ['pa','pi','llon'], word: 'papillon', emoji: '🦋', eg: 'فراشة' }
    ];

    container.innerHTML = `
      <style>
        .g13-wrap { display: flex; flex-direction: column; gap: 12px; padding: 10px; max-width: 640px; margin: 0 auto; user-select: none; font-family: inherit; }
        .g13-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%); color: #fff; padding: 14px 18px; border-radius: 22px; box-shadow: 0 10px 26px rgba(168, 85, 247, 0.35); position: relative; overflow: hidden; }
        .g13-header::after { content: ''; position: absolute; top: -60%; left: -30%; width: 70%; height: 220%; background: linear-gradient(120deg, rgba(255,255,255,0.35), transparent 60%); transform: rotate(15deg); pointer-events: none; }
        .g13-title { font-size: 1.15rem; font-weight: 900; }
        .g13-progress { background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 999px; font-weight: 900; font-size: 0.95rem; }
        .g13-stage { background: #fff; border: 3px solid #e9d5ff; border-radius: 26px; padding: 18px 14px 20px; text-align: center; box-shadow: 0 14px 34px rgba(0,0,0,0.07); position: relative; overflow: hidden; min-height: 380px; animation: g13-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes g13-pop { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .g13-stage.g13-shake { animation: g13-shk .4s; }
        @keyframes g13-shk { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        .g13-stage.g13-hint { box-shadow: 0 0 0 4px #fde68a, 0 14px 34px rgba(0,0,0,0.07); }
        .g13-q { font-size: 1.05rem; font-weight: 900; color: #7e22ce; margin-bottom: 12px; }
        .g13-q small { display: block; font-size: 0.78rem; color: #c084fc; font-weight: 700; margin-top: 2px; }
        .g13-emoji { font-size: 5rem; margin-bottom: 8px; animation: g13-bounce .5s; cursor: pointer; }
        @keyframes g13-bounce { 0%{transform:scale(0) rotate(-30deg)} 100%{transform:scale(1) rotate(0)} }
        .g13-word-eg { font-size: 1.1rem; font-weight: 700; color: #a855f7; margin-bottom: 12px; }
        .g13-built { display: flex; gap: 8px; min-height: 70px; justify-content: center; align-items: center; margin-bottom: 14px; padding: 10px; background: #faf5ff; border-radius: 16px; border: 2px dashed #d8b4fe; flex-wrap: wrap; direction: ltr; }
        .g13-built-slot { padding: 10px 18px; background: linear-gradient(180deg,#e9d5ff,#d8b4fe); color: #581c87; border-radius: 12px; font-size: 1.5rem; font-weight: 900; box-shadow: 0 3px 0 #a855f7; }
        .g13-built-slot.empty { background: transparent; border: 2px dashed #cbd5e1; color: #94a3b8; box-shadow: none; }
        .g13-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; direction: ltr; }
        .g13-syllable { padding: 14px 22px; border-radius: 16px; background: linear-gradient(180deg,#a855f7,#9333ea); color: #fff; border: none; font-size: 1.5rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #6b21a8; transition: all 0.15s; }
        .g13-syllable:active { transform: translateY(2px); box-shadow: 0 3px 0 #6b21a8; }
        .g13-syllable.used { opacity: 0.25; pointer-events: none; }
        .g13-syllable.wrong { background: linear-gradient(180deg,#fca5a5,#f87171); box-shadow: 0 5px 0 #b91c1c; }
        .g13-feedback { font-size: 1.1rem; font-weight: 900; min-height: 28px; margin-top: 12px; color: #9333ea; }
        .g13-win { position: absolute; inset: 0; background: rgba(255,255,255,0.97); border-radius: 26px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 20; animation: g13-pop .4s; padding: 20px; }
        .g13-win-emoji { font-size: 4.8rem; animation: g13-winBounce 1s infinite; }
        @keyframes g13-winBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .g13-win-title { font-size: 1.9rem; font-weight: 900; background: linear-gradient(90deg,#a855f7,#7e22ce); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .g13-win-stars { font-size: 2.1rem; letter-spacing: 4px; }
        .g13-win-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; }
        .g13-win-btn { border: none; border-radius: 16px; padding: 14px 24px; font-size: 1.05rem; font-weight: 900; cursor: pointer; transition: transform .15s; }
        .g13-win-btn:active { transform: scale(0.95); }
        .g13-win-replay { background: linear-gradient(180deg,#c084fc,#a855f7); color: #fff; box-shadow: 0 5px 0 #7e22ce; }
        .g13-win-home { background: #f1f5f9; color: #475569; box-shadow: 0 5px 0 #cbd5e1; }
        .g13-parent-btn { position: absolute; top: 6px; right: 8px; background: transparent; border: none; font-size: 0.85rem; opacity: 0.25; cursor: pointer; z-index: 30; }
        .g13-parent-panel { position: absolute; inset: 0; background: rgba(15,23,42,0.92); color: #fff; border-radius: 22px; padding: 20px; z-index: 40; font-size: 0.95rem; line-height: 1.9; overflow-y: auto; }
        .g13-parent-panel h3 { margin: 0 0 10px; font-size: 1.2rem; color: #fbbf24; }
        .g13-parent-panel .row { display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.2); padding: 6px 0; }
        .g13-parent-panel button { margin-top: 10px; width: 100%; padding: 12px; border-radius: 12px; border: none; background: #fbbf24; color: #1e293b; font-weight: 900; font-size: 1rem; cursor: pointer; }
        .g13-celebration { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
        .g13-confetti { position: absolute; width: 12px; height: 12px; border-radius: 3px; animation: g13-fall 1.6s linear forwards; }
        @keyframes g13-fall { 0% { transform: translateY(-40px) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      </style>
      <div class="g13-wrap">
        <div class="g13-header">
          <div>
            <div class="g13-title">🧩 Les Syllabes • المقاطع</div>
          </div>
          <div class="g13-progress" id="g13-prog">⭐ 0</div>
        </div>
        <div class="g13-stage" id="g13-stage">
          <button class="g13-parent-btn" id="g13-parent-btn" title="وضع الوالد">⚙️</button>
          <div class="g13-q">🧩 كوّني الكلمة بالترتيب<small>Compose le mot</small></div>
          <div class="g13-emoji" id="g13-emoji"></div>
          <div class="g13-word-eg" id="g13-word-eg"></div>
          <div class="g13-built" id="g13-built"></div>
          <div class="g13-pool" id="g13-pool"></div>
          <div class="g13-feedback" id="g13-msg"></div>
        </div>
      </div>
    `;

    const stageEl = document.getElementById('g13-stage');
    const emojiEl = document.getElementById('g13-emoji');
    const wordEgEl = document.getElementById('g13-word-eg');
    const builtEl = document.getElementById('g13-built');
    const poolEl = document.getElementById('g13-pool');
    const msgEl = document.getElementById('g13-msg');
    const progEl = document.getElementById('g13-prog');

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
    function playErrorTone() { playTone(196, .25, 'square'); }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }

    function updateProgress() { progEl.textContent = `${round}/${TOTAL_ROUNDS} • ⭐ ${stars}`; }

    async function speakWord() {
      if (!currentItem) return;
      try { await Audio2.play('fr_syl_' + currentItem.word, { text: currentItem.word, lang: 'fr' }); } catch (e) {}
    }

    async function speakPraise() {
      try { await Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' }); } catch (e) {}
      await sleep(300);
      try { await Audio2.play('eg_bravo', { text: 'برافو!', lang: 'eg' }); } catch (e) {}
    }
    async function speakEncourage() {
      try { await Audio2.play('eg_try_again', { text: 'حاولي تاني', lang: 'eg' }); } catch (e) {}
    }

    function confetti() {
      const c = document.createElement('div');
      c.className = 'g13-celebration';
      const colors = ['#f43f5e', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'g13-confetti';
        p.style.left = (Math.random() * 100) + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        p.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2500);
    }
    function celebrate() { confetti(); if (typeof starBurst === 'function') starBurst(); playCorrectTone(); }

    emojiEl.addEventListener('click', speakWord);

    function newRound() {
      round++;
      wrongThisRound = 0;
      locked = false;
      picked = [];
      updateProgress();
      stageEl.classList.remove('g13-hint', 'g13-shake');
      msgEl.textContent = '';

      currentItem = SYLLABLE_WORDS[Math.floor(Math.random() * SYLLABLE_WORDS.length)];
      emojiEl.textContent = currentItem.emoji;
      wordEgEl.textContent = `${currentItem.eg} (${currentItem.word})`;

      builtEl.innerHTML = '';
      for (let i = 0; i < currentItem.parts.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'g13-built-slot empty';
        slot.dataset.idx = i;
        slot.textContent = '?';
        builtEl.appendChild(slot);
      }

      poolEl.innerHTML = '';
      shuffle([...currentItem.parts]).forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'g13-syllable';
        btn.textContent = s;
        btn.dataset.syllable = s;
        btn.addEventListener('click', () => onPick(s, btn));
        poolEl.appendChild(btn);
      });

      setTimeout(speakWord, 300);
    }

    async function onPick(s, btn) {
      if (locked || btn.classList.contains('used')) return;
      const nextIdx = picked.length;
      if (s === currentItem.parts[nextIdx]) {
        picked.push(s);
        btn.classList.add('used');
        btn.style.boxShadow = '';
        const slot = builtEl.querySelector(`[data-idx="${nextIdx}"]`);
        if (slot) { slot.classList.remove('empty'); slot.textContent = s; }
        playTone(400 + nextIdx * 80, .15, 'sine');
        try { await Audio2.play('fr_part_' + s, { text: s, lang: 'fr' }); } catch (e) {}
        if (picked.length === currentItem.parts.length) {
          locked = true;
          stars++;
          updateProgress();
          celebrate();
          msgEl.style.color = '#16a34a';
          msgEl.textContent = `🎉 Bravo ! ${currentItem.word}`;
          await speakWord();
          await speakPraise();
          await sleep(450);
          if (round >= TOTAL_ROUNDS) showWin();
          else newRound();
        }
      } else {
        wrongThisRound++;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
        stageEl.classList.add('g13-shake');
        setTimeout(() => stageEl.classList.remove('g13-shake'), 400);
        playErrorTone();
        await speakEncourage();
        if (wrongThisRound >= 2) {
          stageEl.classList.add('g13-hint');
          const nextPart = currentItem.parts[picked.length];
          const nextBtn = [...poolEl.querySelectorAll('.g13-syllable:not(.used)')].find(b => b.dataset.syllable === nextPart);
          if (nextBtn) nextBtn.style.boxShadow = '0 0 0 5px #fde68a, 0 5px 0 #6b21a8';
          msgEl.textContent = `💡 التالي: ${nextPart}`;
        }
      }
    }

    function showWin() {
      const win = document.createElement('div');
      win.className = 'g13-win';
      win.innerHTML = `
        <div class="g13-win-emoji">🏆</div>
        <div class="g13-win-title">أحسنتِ يا بطلة!</div>
        <div class="g13-win-stars">${'⭐'.repeat(Math.min(stars, 5))}</div>
        <div class="g13-win-btns">
          <button class="g13-win-btn g13-win-replay" id="g13-replay">🔄 العبي تاني</button>
          <button class="g13-win-btn g13-win-home" id="g13-home">🏠 الرئيسية</button>
        </div>
      `;
      stageEl.appendChild(win);
      celebrate();
      speakPraise();
      document.getElementById('g13-replay').addEventListener('click', () => {
        win.remove(); round = 0; stars = 0; newRound();
      });
      document.getElementById('g13-home').addEventListener('click', () => { location.hash = '#/home'; });
    }

    document.getElementById('g13-parent-btn').addEventListener('click', () => {
      const panel = document.createElement('div');
      panel.className = 'g13-parent-panel';
      panel.innerHTML = `
        <h3>👨‍👩‍👧 وضع الوالد</h3>
        <div class="row"><span>النجوم</span><strong>⭐ ${stars}</strong></div>
        <button id="g13-parent-close">إغلاق</button>
      `;
      stageEl.appendChild(panel);
      document.getElementById('g13-parent-close').addEventListener('click', () => panel.remove());
    });

    newRound();
  }
};
