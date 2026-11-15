window.Game_10 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const n = Math.floor(Math.random() * 10) + 1;
      const fingers = '👆'.repeat(n);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">✋ Compte les Doigts</div>
          <div class="game-hint">كام صباع؟</div>
          <div class="animal-row" style="font-size:32px;max-width:400px">${fingers}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      const opts = new Set([n]);
      while(opts.size < 3) opts.add(Math.floor(Math.random() * 10) + 1);
      [...opts].sort(() => Math.random() - 0.5).forEach(x => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = x;
        btn.addEventListener('click', () => {
          if(x === n){
            btn.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
          } else {
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(btn);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
