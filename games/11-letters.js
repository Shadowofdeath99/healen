window.Game_11 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🔤 Les Lettres</div>
        <div class="game-hint">دوس على الحرف واسمع نطقه وكلمة تبدأ بيه</div>
        <div class="num-grid" id="lg" style="grid-template-columns:repeat(auto-fill,minmax(clamp(52px,11vw,80px),1fr))"></div>
        <div id="popup" style="min-height:120px;text-align:center"></div>
      </div>`;
    const grid = document.getElementById('lg');
    const popup = document.getElementById('popup');
    LETTERS.forEach(L => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = L;
      b.style.fontSize = 'clamp(22px,5vw,36px)';
      b.addEventListener('click', async () => {
        const word = SHARED_WORDS.find(w => w.letter === L);
        if(word){
          popup.innerHTML = `<div style="font-size:60px">${word.emoji}</div><div style="font-size:22px;color:#e0567f;font-weight:bold">${word.fr}</div>`;
          await Audio2.play('fr_letter_'+L, { text: L + ' comme ' + word.fr, lang: 'fr' });
        } else {
          popup.innerHTML = `<div style="font-size:22px;color:#e0567f;font-weight:bold">${L}</div>`;
          await Audio2.play('fr_letter_'+L, { text: L, lang: 'fr' });
        }
      });
      grid.appendChild(b);
    });
  }
};
