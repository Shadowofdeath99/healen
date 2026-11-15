window.Game_12 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const word = SHARED_WORDS[Math.floor(Math.random() * SHARED_WORDS.length)];
      const correct = word.letter;
      const opts = new Set([correct]);
      while(opts.size < 3) opts.add(LETTERS[Math.floor(Math.random() * 26)]);
      const arr = [...opts].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🅰️ Première Lettre</div>
          <div class="game-hint">إيه أول حرف في الكلمة دي؟</div>
          <div style="font-size:100px">${word.emoji}</div>
          <div style="font-size:28px;color:#e0567f;font-weight:bold">${word.fr}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(L => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.textContent = L;
        b.addEventListener('click', () => {
          if(L === correct){
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
      setTimeout(() => Audio2.play('fr_'+word.fr.toLowerCase(), { text: word.fr, lang: 'fr' }), 300);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
