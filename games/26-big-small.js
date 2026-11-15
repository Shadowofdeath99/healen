window.Game_26 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const pair = OPPOSITES[0]; // size
      const askBig = Math.random() > 0.5;
      const target = askBig ? pair.a : pair.b;
      const left = Math.random() > 0.5 ? pair.a : pair.b;
      const right = left === pair.a ? pair.b : pair.a;
      const bigEmoji = '🐘';
      const smallEmoji = '🐜';
      const leftSize = left === pair.a ? 110 : 40;
      const rightSize = right === pair.a ? 110 : 40;
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🐘 Grand / Petit</div>
          <div class="game-hint">دوس على ${askBig ? 'الكبير' : 'الصغير'}</div>
          <div style="display:flex;gap:20px;align-items:center">
            <button class="choice-btn" data-side="left" style="font-size:${leftSize}px;padding:20px;background:#fff">${left === pair.a ? bigEmoji : smallEmoji}</button>
            <button class="choice-btn" data-side="right" style="font-size:${rightSize}px;padding:20px;background:#fff">${right === pair.a ? bigEmoji : smallEmoji}</button>
          </div>
        </div>`;
      const winner = (left === target) ? 'left' : 'right';
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
