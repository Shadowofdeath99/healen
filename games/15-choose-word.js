window.Game_15 = {
  async mount(container){
    let score = 0;
    let target = null;
    function newRound(){
      target = SHARED_WORDS[Math.floor(Math.random() * SHARED_WORDS.length)];
      const opts = [target];
      while(opts.length < 3){
        const w = SHARED_WORDS[Math.floor(Math.random() * SHARED_WORDS.length)];
        if(!opts.find(o => o.letter === w.letter)) opts.push(w);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">👂 Écoute et Choisis</div>
          <div class="game-hint">اسمع الكلمة واختار صورتها</div>
          <button class="speak-btn" id="replay">🔊 اسمع تاني</button>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(w => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = '56px';
        b.textContent = w.emoji;
        b.addEventListener('click', () => {
          if(w.letter === target.letter){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
      document.getElementById('replay').addEventListener('click', () => {
        Audio2.play('fr_'+target.fr.toLowerCase(), { text: target.fr, lang: 'fr' });
      });
      setTimeout(() => Audio2.play('fr_'+target.fr.toLowerCase(), { text: target.fr, lang: 'fr' }), 300);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
