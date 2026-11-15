window.Game_43 = {
  async mount(container){
    let score = 0;
    const PATTERNS = [
      { seq: ['🔴','🔵','🔴','🔵'], next: '🔴' },
      { seq: ['⭐','🌙','⭐','🌙'], next: '⭐' },
      { seq: ['🍎','🍎','🍌','🍎','🍎'], next: '🍌' },
      { seq: ['🐱','🐶','🐱','🐶'], next: '🐱' },
      { seq: ['1️⃣','2️⃣','3️⃣','1️⃣'], next: '2️⃣' }
    ];
    function newRound(){
      const p = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
      const choices = [p.next, '🍇', '🌳'].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">➡️ Suite Logique</div>
          <div class="game-hint">إيه اللي يجي بعد كده؟</div>
          <div style="font-size:clamp(28px,6vw,44px);text-align:center">${p.seq.join(' ')} ❓</div>
          <div class="choices" id="choices" style="margin-top:16px"></div>
        </div>`;
      const c = document.getElementById('choices');
      choices.forEach(x => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = 'clamp(36px,8vw,52px)';
        b.textContent = x;
        b.addEventListener('click', () => {
          if(x === p.next){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 4) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        c.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
