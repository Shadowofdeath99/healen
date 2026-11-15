window.Game_24 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const mix = COLOR_MIX[Math.floor(Math.random() * COLOR_MIX.length)];
      const cA = SHARED_COLORS.find(c => c.fr === mix.a);
      const cB = SHARED_COLORS.find(c => c.fr === mix.b);
      const cR = SHARED_COLORS.find(c => c.fr === mix.result);
      const opts = [cR];
      while(opts.length < 3){
        const c = SHARED_COLORS[Math.floor(Math.random() * SHARED_COLORS.length)];
        if(!opts.find(o => o.fr === c.fr)) opts.push(c);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🌀 Mélange</div>
          <div class="game-hint">لو خلطنا لونين دول، يطلع إيه؟</div>
          <div style="display:flex;gap:8px;align-items:center;font-size:28px">
            <span style="display:inline-block;width:60px;height:60px;border-radius:50%;background:${cA.hex};border:3px solid #fff"></span>
            <span>➕</span>
            <span style="display:inline-block;width:60px;height:60px;border-radius:50%;background:${cB.hex};border:3px solid #fff"></span>
            <span>= ❓</span>
          </div>
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
          if(c.fr === mix.result){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo ! ' + mix.result, lang: 'fr' });
            setTimeout(() => { score++; if(score >= 3) showWin(); else newRound(); }, 1000);
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
