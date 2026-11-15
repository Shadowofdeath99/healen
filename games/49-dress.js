window.Game_49 = {
  async mount(container){
    let score = 0;
    const SCENES = [
      { weather: '☀️', fr: 'Chaud',  eg: 'حر',  correct: '👕👖' },
      { weather: '❄️', fr: 'Froid',  eg: 'برد', correct: '🧥🧣' },
      { weather: '🌧️', fr: 'Pluie',  eg: 'مطر', correct: '☔🧥' },
      { weather: '🏖️', fr: 'Plage',  eg: 'بحر', correct: '🩳🕶️' }
    ];
    function newRound(){
      const s = SCENES[Math.floor(Math.random() * SCENES.length)];
      const opts = [s.correct];
      const allOutfits = SCENES.map(x => x.correct);
      while(opts.length < 3){
        const x = allOutfits[Math.floor(Math.random() * allOutfits.length)];
        if(!opts.includes(x)) opts.push(x);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">👕 S'habiller</div>
          <div class="game-hint">الجو ${s.eg} ${s.weather} — نلبس إيه؟</div>
          <div style="font-size:90px">${s.weather}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const c = document.getElementById('choices');
      arr.forEach(o => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = 'clamp(30px,7vw,44px)';
        b.textContent = o;
        b.addEventListener('click', () => {
          if(o === s.correct){
            b.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 4) showWin(); else newRound(); }, 900);
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        c.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
