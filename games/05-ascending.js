window.Game_05 = {
  async mount(container){
    const nums = [1,2,3,4,5,6,7,8,9,10].sort(() => Math.random() - 0.5).slice(0, 5);
    const sorted = [...nums].sort((a,b) => a-b);
    const picked = [];
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🔀 Ordre Croissant</div>
        <div class="game-hint">دوس على الأرقام بالترتيب من الصغير للكبير</div>
        <div class="num-grid" id="pool"></div>
        <div style="display:flex;gap:8px;min-height:70px" id="sorted-row"></div>
      </div>`;
    const pool = document.getElementById('pool');
    const row = document.getElementById('sorted-row');
    nums.forEach(n => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = n;
      b.addEventListener('click', () => {
        if(n === sorted[picked.length]){
          picked.push(n);
          row.innerHTML += `<div class="choice-btn" style="padding:14px 20px">${n}</div>`;
          b.remove();
          if(picked.length === sorted.length){
            starBurst();
            setTimeout(() => {
              container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
            }, 700);
          }
        } else {
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
        }
      });
      pool.appendChild(b);
    });
  }
};
