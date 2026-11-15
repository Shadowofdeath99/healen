window.Game_27 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const pair = OPPOSITES[1]; // length
      const askLong = Math.random() > 0.5;
      const target = askLong ? pair.a : pair.b;
      const isLeftLong = Math.random() > 0.5;
      const leftIsLong = isLeftLong;
      const rightIsLong = !isLeftLong;
      const leftLen = leftIsLong ? '90%' : '30%';
      const rightLen = rightIsLong ? '90%' : '30%';
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">📏 Long / Court</div>
          <div class="game-hint">دوس على ${askLong ? 'الطويل' : 'القصير'}</div>
          <div style="display:flex;flex-direction:column;gap:20px;width:100%;max-width:500px">
            <button class="choice-btn" data-side="left" data-long="${leftIsLong}" style="height:60px;background:#7ec8ff;border-radius:20px;width:${leftLen};margin:0 auto"></button>
            <button class="choice-btn" data-side="right" data-long="${rightIsLong}" style="height:60px;background:#ff8fb1;border-radius:20px;width:${rightLen};margin:0 auto"></button>
          </div>
        </div>`;
      const winner = (isLeftLong === askLong) ? 'left' : 'right';
      container.querySelectorAll('[data-side]').forEach(btn => {
        btn.addEventListener('click', () => {
          if(btn.dataset.side === winner){
            btn.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
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
