window.Game_19 = {
  async mount(container){
    const picks = [...SHARED_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 4);
    let selectedMama = null;
    let matched = 0;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">👶 Bébé et Maman</div>
        <div class="game-hint">وصّل كل بيبي بأمه</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="mamas"></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="babies"></div>
      </div>`;
    const mamasC = document.getElementById('mamas');
    const babiesC = document.getElementById('babies');

    picks.forEach(a => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = '48px';
      b.textContent = a.emoji;
      b.dataset.emoji = a.emoji;
      b.addEventListener('click', () => {
        mamasC.querySelectorAll('.choice-btn').forEach(x => x.style.background = '');
        b.style.background = '#ffe1ea';
        selectedMama = a;
      });
      mamasC.appendChild(b);
    });

    [...picks].sort(() => Math.random() - 0.5).forEach(a => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = 'clamp(20px,4vw,28px)';
      b.textContent = a.baby;
      b.dataset.emoji = a.emoji;
      b.addEventListener('click', () => {
        if(selectedMama && selectedMama.emoji === a.emoji){
          b.classList.add('correct');
          b.disabled = true;
          const mb = mamasC.querySelector(`[data-emoji="${a.emoji}"]`);
          if(mb){ mb.classList.add('correct'); mb.disabled = true; }
          matched++;
          starBurst();
          Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
          if(matched === picks.length){
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 700);
          }
        } else if(selectedMama){
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      babiesC.appendChild(b);
    });
  }
};
