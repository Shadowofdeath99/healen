window.Game_42 = {
  async mount(container){
    let score = 0;
    const GROUPS = [
      { common: ['🍎','🍌','🍊','🍇'], intruder: '🚗' },
      { common: ['🐱','🐶','🐮','🐷'], intruder: '🌳' },
      { common: ['🔴','🔵','🟡','🟢'], intruder: '⭐' },
      { common: ['🍕','🍔','🌭','🍟'], intruder: '👕' },
      { common: ['⚽','🏀','🎾','🏐'], intruder: '📚' }
    ];
    function newRound(){
      const g = GROUPS[Math.floor(Math.random() * GROUPS.length)];
      const items = [...g.common.slice(0, 3), g.intruder].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🕵️ Trouve l'Intrus</div>
          <div class="game-hint">اختار الحاجة اللي مش زي الباقي</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      items.forEach(it => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = 'clamp(40px,10vw,64px)';
        b.textContent = it;
        b.addEventListener('click', () => {
          if(it === g.intruder){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 4) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
