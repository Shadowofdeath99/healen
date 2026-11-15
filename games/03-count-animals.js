window.Game_03 = {
  async mount(container){
    let score = 0;
    let target = 0;
    let animal = null;

    function newRound(){
      target = Math.floor(Math.random() * 5) + 1;
      animal = SHARED.animals[Math.floor(Math.random() * SHARED.animals.length)];
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🐣 Compte les Animaux</div>
          <div class="game-hint">عد الحيوانات واختار الرقم الصح</div>
          <div class="animal-row">${animal.emoji.repeat(target)}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      const opts = new Set([target]);
      while(opts.size < 3) opts.add(Math.floor(Math.random() * 6) + 1);
      [...opts].sort(() => Math.random() - 0.5).forEach(n => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.textContent = n;
        b.addEventListener('click', () => pick(n, b));
        choices.appendChild(b);
      });
    }

    async function pick(n, btn){
      if(n === target){
        btn.classList.add('correct');
        starBurst();
        Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
        await sleep(900);
        score++;
        if(score >= 5) showWin(); else newRound();
      } else {
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 500);
      }
    }

    function showWin(){
      container.innerHTML = `
        <div class="game-wrap">
          <div style="font-size:80px">🏆</div>
          <div class="game-title-fr">Bravo ! برافو!</div>
          <button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button>
        </div>`;
    }

    newRound();
  }
};
