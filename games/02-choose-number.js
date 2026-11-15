window.Game_02 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">👂 Écoute et Choisis</div>
        <div class="game-hint">اسمع الرقم واختار الصح</div>
        <button class="speak-btn" id="replay">🔊 اسمع تاني</button>
        <div class="choices" id="choices"></div>
      </div>`;
    const choices = document.getElementById('choices');
    let target = 0;
    let score = 0;

    async function newRound(){
      choices.innerHTML = '';
      target = Math.floor(Math.random() * 10) + 1;
      const opts = new Set([target]);
      while(opts.size < 3) opts.add(Math.floor(Math.random() * 10) + 1);
      const arr = [...opts].sort(() => Math.random() - 0.5);
      for(const n of arr){
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.textContent = n;
        b.addEventListener('click', () => pick(n, b));
        choices.appendChild(b);
      }
      setTimeout(() => speakNum(target), 300);
    }

    async function pick(n, btn){
      if(n === target){
        btn.classList.add('correct');
        starBurst();
        Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
        await sleep(900);
        score++;
        if(score >= 5){
          showWin();
        } else {
          newRound();
        }
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
          <div class="game-hint">خلصت اللعبة بنجاح</div>
          <button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button>
        </div>`;
    }

    document.getElementById('replay').addEventListener('click', () => speakNum(target));
    newRound();
  }
};

window.starBurst = function(){
  const d = document.createElement('div');
  d.className = 'star-burst';
  d.textContent = '⭐';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1000);
};

window.sleep = (ms) => new Promise(r => setTimeout(r, ms));
