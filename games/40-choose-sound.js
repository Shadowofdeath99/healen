window.Game_40 = {
  async mount(container){
    let score = 0;
    let target = null;
    function newRound(){
      target = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)];
      const opts = [target];
      while(opts.length < 3){
        const x = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)];
        if(!opts.find(o => o.emoji === x.emoji)) opts.push(x);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🎧 Écoute et Choisis</div>
          <div class="game-hint">اسمع الآلة واختار صورتها</div>
          <button class="speak-btn" id="replay">🔊 اسمع تاني</button>
          <div class="choices" id="choices" style="margin-top:20px"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(inst => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = '56px';
        b.textContent = inst.emoji;
        b.addEventListener('click', () => {
          if(inst.emoji === target.emoji){
            b.classList.add('correct');
            starBurst();
            playTone(target.freq, 500, target.type);
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 1000);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
      const replay = () => playTone(target.freq, 500, target.type);
      document.getElementById('replay').addEventListener('click', replay);
      setTimeout(replay, 400);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
