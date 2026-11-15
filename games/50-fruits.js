window.Game_50 = {
  async mount(container){
    const ITEMS = [
      { fr: 'Pomme',    eg: 'تفاحة',   emoji: '🍎', type: 'fruit' },
      { fr: 'Banane',   eg: 'موزة',    emoji: '🍌', type: 'fruit' },
      { fr: 'Orange',   eg: 'برتقالة', emoji: '🍊', type: 'fruit' },
      { fr: 'Fraise',   eg: 'فراولة',  emoji: '🍓', type: 'fruit' },
      { fr: 'Carotte',  eg: 'جزر',     emoji: '🥕', type: 'legume' },
      { fr: 'Tomate',   eg: 'طماطم',   emoji: '🍅', type: 'legume' },
      { fr: 'Brocoli',  eg: 'بروكلي',  emoji: '🥦', type: 'legume' },
      { fr: 'Concombre',eg: 'خيار',    emoji: '🥒', type: 'legume' }
    ];
    let score = 0;
    function newRound(){
      const t = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const opts = [t];
      while(opts.length < 3){
        const x = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        if(!opts.find(o => o.emoji === x.emoji)) opts.push(x);
      }
      const arr = opts.sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🍓 Fruits & Légumes</div>
          <div class="game-hint">دوس على ${t.type === 'fruit' ? 'الفاكهة' : 'الخضار'}</div>
          <div class="choices" id="choices"></div>
        </div>`;
      const c = document.getElementById('choices');
      arr.forEach(x => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.style.fontSize = '56px';
        b.textContent = x.emoji;
        b.addEventListener('click', () => {
          if(x.type === t.type){
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
