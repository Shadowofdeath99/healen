window.Game_14 = {
  async mount(container){
    const picks = [...SHARED_WORDS].sort(() => Math.random() - 0.5).slice(0, 4);
    let selectedWord = null;
    let matched = 0;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🖼️ Relie Mot–Image</div>
        <div class="game-hint">اختار كلمة ثم اختار صورتها</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="words"></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="imgs"></div>
      </div>`;
    const wordsC = document.getElementById('words');
    const imgsC = document.getElementById('imgs');

    picks.forEach(w => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = w.fr;
      b.style.fontSize = 'clamp(16px,3vw,22px)';
      b.dataset.letter = w.letter;
      b.addEventListener('click', () => {
        wordsC.querySelectorAll('.choice-btn').forEach(x => x.style.background = '');
        b.style.background = '#ffe1ea';
        selectedWord = w;
        Audio2.play('fr_'+w.fr.toLowerCase(), { text: w.fr, lang: 'fr' });
      });
      wordsC.appendChild(b);
    });

    [...picks].sort(() => Math.random() - 0.5).forEach(w => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.fontSize = '48px';
      b.textContent = w.emoji;
      b.addEventListener('click', () => {
        if(selectedWord && selectedWord.letter === w.letter){
          b.classList.add('correct');
          b.disabled = true;
          const wb = wordsC.querySelector(`[data-letter="${w.letter}"]`);
          if(wb){ wb.classList.add('correct'); wb.disabled = true; }
          matched++;
          starBurst();
          Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
          if(matched === picks.length){
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 700);
          }
        } else if(selectedWord){
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      imgsC.appendChild(b);
    });
  }
};
