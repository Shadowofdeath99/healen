window.Game_22 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const target = SHARED_COLORS[Math.floor(Math.random() * SHARED_COLORS.length)];
      const opts = [target];
      while(opts.length < 3){
        const c = SHARED_COLORS[Math.floor(Math.random() * SHARED_COLORS.length)];
        if(!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🔍 Trouve la Couleur</div>
          <div class="game-hint">اختار اللون ${target.fr}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(c => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.background = c.hex;
        b.style.width = 'clamp(80px,20vw,120px)';
        b.style.height = 'clamp(80px,20vw,120px)';
        b.style.border = '3px solid #fff';
        b.textContent = '';
        b.addEventListener('click', () => {
          if(c.fr === target.fr){
            b.classList.add('correct');
            starBurst();
            Audio2.play(target.frId, { text: target.fr, lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 1000);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
      setTimeout(() => Audio2.play(target.frId, { text: target.fr, lang: 'fr' }), 300);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
