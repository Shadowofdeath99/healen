window.Game_44 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const target = SHARED_ANIMALS[Math.floor(Math.random() * SHARED_ANIMALS.length)];
      const opts = [target];
      while(opts.length < 3){
        const a = SHARED_ANIMALS[Math.floor(Math.random() * SHARED_ANIMALS.length)];
        if(!opts.find(o => o.emoji === a.emoji)) opts.push(a);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">👤 Ombres</div>
          <div class="game-hint">مين صاحب الظل ده؟</div>
          <div style="font-size:100px;filter:brightness(0);">${target.emoji}</div>
          <div class="choices" id="choices" style="margin-top:16px"></div>
        </div>`;
      const c = document.getElementById('choices');
      arr.forEach(a => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = '56px';
        b.textContent = a.emoji;
        b.addEventListener('click', () => {
          if(a.emoji === target.emoji){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        c.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
