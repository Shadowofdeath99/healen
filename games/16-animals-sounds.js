window.Game_16 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🐾 Les Animaux & Sons</div>
        <div class="game-hint">دوس على الحيوان واسمع صوته واسمه</div>
        <div class="num-grid" id="ag" style="grid-template-columns:repeat(auto-fill,minmax(clamp(80px,18vw,120px),1fr))"></div>
        <div id="popup" style="min-height:80px;text-align:center"></div>
      </div>`;
    const grid = document.getElementById('ag');
    const popup = document.getElementById('popup');
    SHARED_ANIMALS.forEach(a => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = a.emoji;
      b.style.fontSize = 'clamp(36px,8vw,52px)';
      b.addEventListener('click', async () => {
        popup.innerHTML = `<div style="font-size:24px;color:#e0567f;font-weight:bold">${a.fr}</div><div style="font-size:18px;color:#6b5560">${a.eg}</div>`;
        await playAnimalSound(a);
        setTimeout(() => Audio2.play('fr_'+a.fr.replace(/[^a-z]/gi,'').toLowerCase(), { text: a.fr, lang: 'fr' }), 800);
      });
      grid.appendChild(b);
    });
  }
};
