window.Game_21 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🎨 Les Couleurs</div>
        <div class="game-hint">دوس على اللون واسمع نطقه</div>
        <div class="num-grid" id="cg" style="grid-template-columns:repeat(auto-fill,minmax(clamp(80px,18vw,120px),1fr))"></div>
      </div>`;
    const grid = document.getElementById('cg');
    SHARED_COLORS.forEach(c => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.style.background = c.hex;
      b.style.color = (c.fr === 'Blanc' || c.fr === 'Jaune') ? '#333' : '#fff';
      b.style.border = '3px solid #fff';
      b.style.fontSize = 'clamp(20px,4vw,28px)';
      b.textContent = c.fr;
      b.addEventListener('click', async () => {
        await Audio2.play(c.frId, { text: c.fr, lang: 'fr' });
        setTimeout(() => Audio2.play(c.egId, { text: c.eg, lang: 'eg' }), 900);
      });
      grid.appendChild(b);
    });
  }
};
