window.Game_39 = {
  async mount(container){
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🌧️ Son de la Nature</div>
        <div class="game-hint">دوس على العنصر واسمع اسمه</div>
        <div class="num-grid" id="ng" style="grid-template-columns:repeat(auto-fill,minmax(clamp(80px,18vw,120px),1fr))"></div>
        <div id="popup" style="min-height:60px;text-align:center"></div>
      </div>`;
    const grid = document.getElementById('ng');
    const popup = document.getElementById('popup');
    NATURE_SOUNDS.forEach(n => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = n.emoji;
      b.style.fontSize = 'clamp(36px,8vw,52px)';
      b.addEventListener('click', async () => {
        popup.innerHTML = `<div style="font-size:20px;color:#e0567f;font-weight:bold">${n.fr}</div><div style="font-size:16px;color:#6b5560">${n.eg}</div>`;
        // Try recorded audio first, then TTS
        await Audio2.play('fr_'+n.fr.toLowerCase(), { text: n.fr, lang: 'fr' });
        setTimeout(() => Audio2.play('eg_'+n.eg, { text: n.eg, lang: 'eg' }), 900);
      });
      grid.appendChild(b);
    });
  }
};
