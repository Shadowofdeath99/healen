window.Game_25 = {
  async mount(container){
    const OBJECTS = [
      { emoji: '🍎', color: 'Rouge' },
      { emoji: '🌊', color: 'Bleu' },
      { emoji: '☀️', color: 'Jaune' },
      { emoji: '🌿', color: 'Vert' },
      { emoji: '🍊', color: 'Orange' },
      { emoji: '🍇', color: 'Violet' },
      { emoji: '🌸', color: 'Rose' },
      { emoji: '☁️', color: 'Blanc' }
    ];
    let score = 0;
    function newRound(){
      const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
      const target = SHARED_COLORS.find(c => c.fr === obj.color);
      const opts = [target];
      while(opts.length < 3){
        const c = SHARED_COLORS[Math.floor(Math.random() * SHARED_COLORS.length)];
        if(!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🍎 Couleur de l'Objet</div>
          <div class="game-hint">${obj.emoji} لونه إيه؟</div>
          <div style="font-size:110px">${obj.emoji}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(c => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.background = c.hex;
        b.style.color = (c.fr === 'Blanc' || c.fr === 'Jaune') ? '#333' : '#fff';
        b.style.border = '3px solid #fff';
        b.style.fontSize = 'clamp(14px,3vw,18px)';
        b.textContent = c.fr;
        b.addEventListener('click', () => {
          if(c.fr === obj.color){
            b.classList.add('correct');
            starBurst();
            Audio2.play(c.frId, { text: c.fr, lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 1000);
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
