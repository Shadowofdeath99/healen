window.Game_41 = {
  async mount(container){
    const EMOJIS = ['🐱','🐶','🐮','🦁','🐸','🐰'];
    const cards = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let lock = false;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🧠 Memory</div>
        <div class="game-hint">اقلبي الكروت ولاقي الأزواج</div>
        <div class="num-grid" id="mg" style="grid-template-columns:repeat(4,1fr);max-width:400px"></div>
      </div>`;
    const grid = document.getElementById('mg');

    cards.forEach((emoji, idx) => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.style.fontSize = 'clamp(32px,7vw,48px)';
      b.style.aspectRatio = '1/1';
      b.textContent = '❓';
      b.dataset.emoji = emoji;
      b.addEventListener('click', () => {
        if(lock || flipped.includes(b) || b.classList.contains('done')) return;
        b.textContent = emoji;
        b.style.background = '#fff7fa';
        flipped.push(b);
        if(flipped.length === 2){
          lock = true;
          if(flipped[0].dataset.emoji === flipped[1].dataset.emoji){
            flipped.forEach(f => { f.classList.add('done'); f.style.background = '#9be3a8'; });
            matched++;
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            flipped = [];
            lock = false;
            if(matched === EMOJIS.length){
              setTimeout(() => {
                container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
              }, 700);
            }
          } else {
            setTimeout(() => {
              flipped.forEach(f => { f.textContent = '❓'; f.style.background = ''; });
              flipped = [];
              lock = false;
            }, 800);
          }
        }
      });
      grid.appendChild(b);
    });
  }
};
