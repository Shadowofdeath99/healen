window.Game_45 = {
  async mount(container){
    const EMOJI = ['🦁','🐱','🐶','🐸','🦆','🐮'][Math.floor(Math.random() * 6)];
    // 2x2 grid using emoji on colored bg for simplicity
    const BG = ['#ffe1ea','#d9f0ff','#fff5cc','#e0ffe0'];
    const pieces = [0,1,2,3];
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🧩 Puzzle</div>
        <div class="game-hint">ركّبي الصورة (اسحبي القطع لمكانها)</div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;align-items:center">
          <div id="slots" style="display:grid;grid-template-columns:1fr 1fr;gap:4px;width:min(60vw,240px);aspect-ratio:1/1;background:#fff;border-radius:14px;padding:6px"></div>
          <div id="tray" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:min(60vw,240px)"></div>
        </div>
        <div style="text-align:center;font-size:clamp(28px,6vw,44px);margin-top:8px">${EMOJI}</div>
      </div>`;

    const slots = document.getElementById('slots');
    const tray = document.getElementById('tray');

    // Create 4 empty slots
    const slotEls = [];
    for(let i = 0; i < 4; i++){
      const s = document.createElement('div');
      s.style.cssText = 'background:#f5f5f5;border:2px dashed #ccc;border-radius:10px;display:grid;place-items:center;font-size:clamp(28px,6vw,44px);cursor:pointer;aspect-ratio:1/1;';
      s.dataset.idx = i;
      s.addEventListener('click', () => {
        // If a piece is selected, place it here
        if(window.__selectedPiece){
          const piece = window.__selectedPiece;
          if(parseInt(piece.dataset.pieceIdx) === i){
            s.textContent = piece.textContent;
            s.style.background = piece.dataset.bg;
            s.style.border = '2px solid #9be3a8';
            piece.remove();
            window.__selectedPiece = null;
            if(document.querySelectorAll('#slots div').length && [...document.querySelectorAll('#slots div')].every(d => d.textContent)){
              starBurst();
              Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
              setTimeout(() => {
                container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><div style="font-size:60px">${EMOJI}</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
              }, 900);
            }
          } else {
            s.style.background = '#ffb3b3';
            setTimeout(() => s.style.background = '#f5f5f5', 400);
          }
        }
      });
      slots.appendChild(s);
      slotEls.push(s);
    }

    // Create pieces
    shuffled.forEach(idx => {
      const p = document.createElement('div');
      p.style.cssText = `background:${BG[idx]};border:2px solid #fff;border-radius:10px;display:grid;place-items:center;font-size:clamp(28px,6vw,44px);cursor:pointer;width:clamp(60px,15vw,90px);height:clamp(60px,15vw,90px);box-shadow:0 2px 8px rgba(0,0,0,.1);`;
      p.textContent = EMOJI;
      p.dataset.pieceIdx = idx;
      p.dataset.bg = BG[idx];
      p.addEventListener('click', () => {
        tray.querySelectorAll('div').forEach(x => x.style.border = '2px solid #fff');
        p.style.border = '3px solid #e0567f';
        window.__selectedPiece = p;
      });
      tray.appendChild(p);
    });
  }
};
