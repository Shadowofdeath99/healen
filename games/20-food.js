window.Game_20 = {
  async mount(container){
    const picks = [...SHARED_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 4);
    let selectedAnimal = null;
    let matched = 0;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🍽️ Qui mange quoi?</div>
        <div class="game-hint">وصّل كل حيوان بأكله</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="animals"></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="foods"></div>
      </div>`;
    const animalsC = document.getElementById('animals');
    const foodsC = document.getElementById('foods');

    picks.forEach(a => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = '52px';
      b.textContent = a.emoji;
      b.dataset.emoji = a.emoji;
      b.addEventListener('click', () => {
        animalsC.querySelectorAll('.choice-btn').forEach(x => x.style.background = '');
        b.style.background = '#ffe1ea';
        selectedAnimal = a;
      });
      animalsC.appendChild(b);
    });

    [...picks].sort(() => Math.random() - 0.5).forEach(a => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = 'clamp(18px,4vw,26px)';
      b.textContent = a.food;
      b.dataset.emoji = a.emoji;
      b.addEventListener('click', () => {
        if(selectedAnimal && selectedAnimal.emoji === a.emoji){
          b.classList.add('correct');
          b.disabled = true;
          const ab = animalsC.querySelector(`[data-emoji="${a.emoji}"]`);
          if(ab){ ab.classList.add('correct'); ab.disabled = true; }
          matched++;
          starBurst();
          Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
          if(matched === picks.length){
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 700);
          }
        } else if(selectedAnimal){
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      foodsC.appendChild(b);
    });
  }
};
