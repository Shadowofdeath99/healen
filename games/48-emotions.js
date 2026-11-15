window.Game_48 = {
  async mount(container){
    const EMOTIONS = [
      { fr: 'Content', eg: 'مبسوط',   emoji: '😊' },
      { fr: 'Triste',  eg: 'زعلان',   emoji: '😢' },
      { fr: 'Fâché',   eg: 'غضبان',   emoji: '😠' },
      { fr: 'Surpris', eg: 'متفاجئ',  emoji: '😲' },
      { fr: 'Peur',    eg: 'خايف',    emoji: '😨' },
      { fr: 'Fatigué', eg: 'تعبان',   emoji: '😴' }
    ];
    let score = 0;
    function newRound(){
      const t = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const opts = [t];
      while(opts.length < 3){
        const x = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
        if(!opts.find(o => o.emoji === x.emoji)) opts.push(x);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">😊 Les Émotions</div>
          <div class="game-hint">مين اللي ${t.eg}؟</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const c = document.getElementById('choices');
      arr.forEach(e => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = '56px';
        b.textContent = e.emoji;
        b.addEventListener('click', () => {
          if(e.emoji === t.emoji){
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
      setTimeout(() => Audio2.play('fr_'+t.fr.toLowerCase(), { text: t.fr, lang: 'fr' }), 300);
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
