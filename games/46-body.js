window.Game_46 = {
  async mount(container){
    const PARTS = [
      { fr: 'Tête',  eg: 'راس',    emoji: '👤' },
      { fr: 'Main',  eg: 'إيد',    emoji: '✋' },
      { fr: 'Pied',  eg: 'رجل',    emoji: '🦶' },
      { fr: 'Œil',   eg: 'عين',    emoji: '👁️' },
      { fr: 'Nez',   eg: 'أنف',    emoji: '👃' },
      { fr: 'Bouche',eg: 'بق',    emoji: '👄' },
      { fr: 'Oreille',eg: 'ودن',  emoji: '👂' },
      { fr: 'Bras',  eg: 'دراع',  emoji: '💪' },
      { fr: 'Jambe', eg: 'ساق',   emoji: '🦵' },
      { fr: 'Doigt', eg: 'صباع',  emoji: '👆' }
    ];
    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🧍 Parties du Corps</div>
        <div class="game-hint">دوس على العضو واسمع اسمه</div>
        <div class="num-grid" id="bg" style="grid-template-columns:repeat(auto-fill,minmax(clamp(80px,18vw,120px),1fr))"></div>
        <div id="popup" style="min-height:60px;text-align:center"></div>
      </div>`;
    const grid = document.getElementById('bg');
    const popup = document.getElementById('popup');
    PARTS.forEach(p => {
      const b = document.createElement('button');
      b.className = 'num-btn';
      b.textContent = p.emoji;
      b.style.fontSize = 'clamp(36px,8vw,52px)';
      b.addEventListener('click', async () => {
        popup.innerHTML = `<div style="font-size:20px;color:#e0567f;font-weight:bold">${p.fr}</div><div style="font-size:16px;color:#6b5560">${p.eg}</div>`;
        await Audio2.play('fr_body_'+p.fr.toLowerCase().replace(/[^a-z]/g,''), { text: p.fr, lang: 'fr' });
        setTimeout(() => Audio2.play('eg_body_'+p.eg, { text: p.eg, lang: 'eg' }), 900);
      });
      grid.appendChild(b);
    });
  }
};
