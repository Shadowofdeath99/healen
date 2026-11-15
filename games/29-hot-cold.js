window.Game_29 = {
  async mount(container){
    let score = 0;
    const ITEMS = [
      { emoji: '🔥', hot: true },  { emoji: '☀️', hot: true },
      { emoji: '☕', hot: true },  { emoji: '🍲', hot: true },
      { emoji: '❄️', hot: false }, { emoji: '🧊', hot: false },
      { emoji: '🍦', hot: false }, { emoji: '⛄', hot: false }
    ];
    function newRound(){
      const askHot = Math.random() > 0.5;
      const opts = [];
      while(opts.length < 6){
        const it = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        if(!opts.find(o => o.emoji === it.emoji)) opts.push(it);
      }
      const correct = opts.find(o => o.hot === askHot);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🔥 Chaud / Froid</div>
          <div class="game-hint">دوس على ${askHot ? 'الساخن' : 'البارد'}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      opts.forEach(it => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = 'clamp(40px,10vw,64px)';
        b.textContent = it.emoji;
        b.addEventListener('click', () => {
          if(it.emoji === correct.emoji){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
