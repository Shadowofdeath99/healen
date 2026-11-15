window.Game_08 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const total = Math.floor(Math.random() * 5) + 3;
      const remove = Math.floor(Math.random() * (total - 1)) + 1;
      const answer = total - remove;
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">➖ Soustraction</div>
          <div class="game-hint">فاضل كام؟</div>
          <div class="animal-row" style="font-size:44px">${'🍎'.repeat(total)} − ${'🍎'.repeat(remove)} = ❓</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      const opts = new Set([answer]);
      while(opts.size < 3) opts.add(Math.floor(Math.random() * total) + 1);
      [...opts].sort(() => Math.random() - 0.5).forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = n;
        btn.addEventListener('click', () => {
          if(n === answer){
            btn.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 4) showWin(); else newRound(); }, 900);
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
