window.Game_01 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🔢 Les Nombres</div>
        <div class="game-hint">دوس على الرقم واسمع نطقه بالفرنسي وبالعامية</div>
        <div class="num-grid" id="ng"></div>
      </div>`;
    const grid = document.getElementById('ng');
    for(let i = 1; i <= 10; i++){
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = i;
      b.addEventListener('click', async () => {
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 300);
        await speakNum(i);
      });
      grid.appendChild(b);
    }
  }
};
