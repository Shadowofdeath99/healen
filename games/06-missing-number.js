window.Game_06 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const start = Math.floor(Math.random() * 5) + 1;
      const missing = start + Math.floor(Math.random() * 4) + 1;
      const series = [];
      for(let i = start; i <= start + 4; i++) series.push(i === missing ? null : i);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">❓ Numéro Manquant</div>
          <div class="game-hint">إيه الرقم الناقص؟</div>
          <div class="animal-row" style="font-size:44px">${series.map(x => x === null ? '❓' : x).join(' ')}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      const opts = new Set([missing]);
      while(opts.size < 3) opts.add(start + Math.floor(Math.random() * 5));
      [...opts].sort(() => Math.random() - 0.5).forEach(n => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.textContent = n;
        b.addEventListener('click', () => {
          if(n === missing){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 4) showWin(); else newRound(); }, 900);
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
