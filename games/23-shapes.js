window.Game_23 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const target = SHARED_SHAPES[Math.floor(Math.random() * SHARED_SHAPES.length)];
      const opts = [target];
      while(opts.length < 3){
        const s = SHARED_SHAPES[Math.floor(Math.random() * SHARED_SHAPES.length)];
        if(!opts.find(o => o.fr === s.fr)) opts.push(s);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">⬛ Les Formes</div>
          <div class="game-hint">إيه ده؟ ${target.fr}؟</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const choices = document.getElementById('choices');
      arr.forEach(s => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.padding = '10px';
        b.innerHTML = `<svg viewBox="0 0 100 100" width="80" height="80">${s.svg}</svg>`;
        b.addEventListener('click', () => {
          if(s.fr === target.fr){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_forme_'+s.fr.toLowerCase().replace(/[^a-z]/g,''), { text: s.fr, lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 1000);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        choices.appendChild(b);
      });
      setTimeout(() => Audio2.play('fr_forme_'+target.fr.toLowerCase().replace(/[^a-z]/g,''), { text: target.fr, lang: 'fr' }), 300);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
