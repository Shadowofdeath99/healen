window.Game_18 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const animal = SHARED_ANIMALS[Math.floor(Math.random() * SHARED_ANIMALS.length)];
      const habitats = ['🌾 ferme','🌳 jungle','💧 étang','🏠 maison','🌸 jardin','💧 mer'];
      const correct = animal.habitat;
      const opts = new Set([correct]);
      while(opts.size < 3) opts.add(habitats[Math.floor(Math.random() * habitats.length)]);
      const arr = [...opts].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🏞️ Habitat</div>
          <div class="game-hint">فين الحيوان ده بيعيش؟</div>
          <div style="font-size:100px">${animal.emoji}</div>
          <div style="font-size:22px;color:#e0567f;font-weight:bold">${animal.fr}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(h => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = 'clamp(16px,3vw,22px)';
        b.textContent = h;
        b.addEventListener('click', () => {
          if(h === correct){
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
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
