window.Game_09 = {
  async mount(container){
    const count = 4;
    const picks = [];
    while(picks.length < count){
      const n = Math.floor(Math.random() * 5) + 1;
      if(!picks.includes(n)) picks.push(n);
    }
    const emoji = '🍭';
    let selectedNum = null;
    let matched = 0;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🔗 Match</div>
        <div class="game-hint">اختار رقم ثم اختار الكمية الصح</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="nums"></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="groups"></div>
      </div>`;

    const numsC = document.getElementById('nums');
    const grpC = document.getElementById('groups');

    picks.forEach(n => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = n;
      b.dataset.n = n;
      b.addEventListener('click', () => {
        numsC.querySelectorAll('.choice-btn').forEach(x => x.style.background = '');
        b.style.background = '#ffe1ea';
        selectedNum = n;
      });
      numsC.appendChild(b);
    });

    [...picks].sort(() => Math.random() - 0.5).forEach(n => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = '24px';
      b.textContent = emoji.repeat(n);
      b.dataset.n = n;
      b.addEventListener('click', () => {
        if(selectedNum === n){
          b.classList.add('correct');
          b.disabled = true;
          const numBtn = numsC.querySelector(`[data-n="${n}"]`);
          if(numBtn){ numBtn.classList.add('correct'); numBtn.disabled = true; }
          matched++;
          starBurst();
          Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
          if(matched === count){
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 700);
          }
        } else if(selectedNum !== null){
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      grpC.appendChild(b);
    });
  }
};
