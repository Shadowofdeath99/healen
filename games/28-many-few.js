window.Game_28 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const askMany = Math.random() > 0.5;
      const manyCount = Math.floor(Math.random() * 5) + 6;
      const fewCount = Math.floor(Math.random() * 2) + 1;
      const isLeftMany = Math.random() > 0.5;
      const leftCount = isLeftMany ? manyCount : fewCount;
      const rightCount = isLeftMany ? fewCount : manyCount;
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🍬 Beaucoup / Peu</div>
          <div class="game-hint">دوس على اللي فيه ${askMany ? 'كتير' : 'قليل'}</div>
          <div style="display:flex;gap:20px;align-items:center;justify-content:center">
            <button class="choice-btn" data-side="left" data-many="${isLeftMany}" style="font-size:28px;background:#fff;padding:20px;min-width:120px">${'🍬'.repeat(leftCount)}</button>
            <button class="choice-btn" data-side="right" data-many="${!isLeftMany}" style="font-size:28px;background:#fff;padding:20px;min-width:120px">${'🍬'.repeat(rightCount)}</button>
          </div>
        </div>`;
      const winner = (askMany === isLeftMany) ? 'left' : 'right';
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
