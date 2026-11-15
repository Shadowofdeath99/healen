window.Game_04 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const left = Math.floor(Math.random() * 8) + 1;
      let right = Math.floor(Math.random() * 8) + 1;
      while(right === left) right = Math.floor(Math.random() * 8) + 1;
      const emoji = '🍎';
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">⚖️ Plus ou Moins</div>
          <div class="game-hint">دوس على الجنب اللي فيه حاجات أكتر</div>
          <div style="display:flex;gap:16px;width:100%;max-width:600px">
            <button class="choice-btn" data-side="left" style="flex:1;padding:30px 10px;font-size:28px">${emoji.repeat(left)}</button>
            <button class="choice-btn" data-side="right" style="flex:1;padding:30px 10px;font-size:28px">${emoji.repeat(right)}</button>
          </div>
        </div>`;
      const winner = left > right ? 'left' : 'right';
      container.querySelectorAll('[data-side]').forEach(btn => {
        btn.addEventListener('click', () => {
          if(btn.dataset.side === winner){
            btn.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => {
              score++;
              if(score >= 5) showWin(); else newRound();
            }, 900);
          } else {
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        });
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
