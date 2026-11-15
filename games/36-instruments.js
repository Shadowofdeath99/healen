window.Game_36 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🎹 Les Instruments</div>
        <div class="game-hint">دوس على الآلة واسمع صوتها واسمها</div>
        <div class="num-grid" id="ig" style="grid-template-columns:repeat(auto-fill,minmax(clamp(80px,18vw,120px),1fr))"></div>
        <div id="popup" style="min-height:60px;text-align:center"></div>
      </div>`;
    const grid = document.getElementById('ig');
    const popup = document.getElementById('popup');
    INSTRUMENTS.forEach(inst => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = inst.emoji;
      b.style.fontSize = 'clamp(36px,8vw,52px)';
      b.addEventListener('click', async () => {
        popup.innerHTML = `<div style="font-size:20px;color:#e0567f;font-weight:bold">${inst.fr}</div><div style="font-size:16px;color:#6b5560">${inst.eg}</div>`;
        playTone(inst.freq, 500, inst.type);
        setTimeout(() => Audio2.play('fr_'+inst.fr.toLowerCase().replace(/[^a-z]/g,''), { text: inst.fr, lang: 'fr' }), 400);
      });
      grid.appendChild(b);
    });
  }
};
