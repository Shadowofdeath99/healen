window.Game_13 = {
  async mount(container){
    let score = 0;
    const SYLLABLE_WORDS = [
      { parts: ['ma','man'], word: 'maman', emoji: '👩' },
      { parts: ['pa','pa'], word: 'papa', emoji: '👨' },
      { parts: ['cha','ton'], word: 'chaton', emoji: '🐱' },
      { parts: ['bou','ton'], word: 'bouton', emoji: '🔘' },
      { parts: ['bi','bé','ron'], word: 'bibéron', emoji: '🍼' },
      { parts: ['ma','ri','on'], word: 'marion', emoji: '🧒' }
    ];
    function newRound(){
      const item = SYLLABLE_WORDS[Math.floor(Math.random() * SYLLABLE_WORDS.length)];
      const shuffled = [...item.parts].sort(() => Math.random() - 0.5);
      const picked = [];
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🧩 Les Syllabes</div>
          <div class="game-hint">كوّن الكلمة بالترتيب</div>
          <div style="font-size:80px">${item.emoji}</div>
          <div style="display:flex;gap:8px;min-height:60px;justify-content:center" id="built"></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center" id="pool"></div>
        </div>`;
      const built = document.getElementById('built');
      const pool = document.getElementById('pool');
      shuffled.forEach(s => {
        const b = document.createElement('button');
        b.className = 'choice-btn';
        b.textContent = s;
        b.addEventListener('click', () => {
          if(s === item.parts[picked.length]){
            picked.push(s);
            built.innerHTML += `<div class="choice-btn" style="padding:14px 20px">${s}</div>`;
            b.remove();
            if(picked.length === item.parts.length){
              starBurst();
              Audio2.play('fr_bravo', { text: 'Bravo ! ' + item.word, lang: 'fr' });
              setTimeout(() => { score++; if(score >= 3) showWin(); else newRound(); }, 1000);
            }
          } else {
            b.classList.add('wrong');
            setTimeout(() => b.classList.remove('wrong'), 500);
          }
        });
        pool.appendChild(b);
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
