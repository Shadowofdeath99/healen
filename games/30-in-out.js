window.Game_30 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const askIn = Math.random() > 0.5;
      // Scene: box in center, animal either inside (overlapping) or outside
      const inside = Math.random() > 0.5;
      const emoji = ['🐱','🐶','🐰','🐸','🦆'][Math.floor(Math.random() * 5)];
      const insidePos = inside;
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">📦 Dedans / Dehors</div>
          <div class="game-hint">الحيوان ده ${askIn ? 'جوه' : 'بره'} الصندوق؟</div>
          <div style="position:relative;width:260px;height:260px;background:#f5f5f5;border-radius:20px;display:grid;place-items:center">
            <div style="position:absolute;font-size:80px">📦</div>
            <div style="position:absolute;font-size:60px;${insidePos ? 'transform:translate(0,0)' : 'transform:translate(140px,-100px)'}">${emoji}</div>
          </div>
          <div class="choices" style="margin-top:20px">
            <button class="choice-btn" data-ans="yes">نعم Oui</button>
            <button class="choice-btn" data-ans="no">لا Non</button>
          </div>
        </div>`;
      const correct = (inside === askIn) ? 'yes' : 'no';
      container.querySelectorAll('[data-ans]').forEach(btn => {
        btn.addEventListener('click', () => {
          if(btn.dataset.ans === correct){
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
