window.Game_47 = {
  async mount(container){
    const MOVES = [
      { fr: 'Saute !',       eg: 'انططي',       emoji: '🤸' },
      { fr: 'Tourne !',      eg: 'لفي',         emoji: '🌀' },
      { fr: 'Tape des mains',eg: 'سقفي',        emoji: '👏' },
      { fr: 'Touche le sol', eg: 'المسي الأرض', emoji: '👇' },
      { fr: 'Lève les bras', eg: 'ارفعي إيديك', emoji: '🙌' },
      { fr: 'Danse !',       eg: 'اتنططي',      emoji: '💃' }
    ];
    let idx = 0;
    function show(){
      if(idx >= MOVES.length){
        starBurst();
        container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🎉</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
        return;
      }
      const m = MOVES[idx];
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🏃 Bouge avec Moi</div>
          <div style="font-size:120px;animation:pop 1s infinite alternate">${m.emoji}</div>
          <div style="font-size:clamp(22px,5vw,32px);color:#e0567f;font-weight:bold">${m.fr}</div>
          <div style="font-size:18px;color:#6b5560">${m.eg}</div>
          <button class="speak-btn" id="replay" style="margin-top:16px">🔊 اسمعي تاني</button>
          <button class="choice-btn" id="next" style="margin-top:16px;font-size:20px">✅ عملتها!</button>
        </div>`;
      const speak = () => {
        Audio2.play('fr_move_'+m.fr.toLowerCase().replace(/[^a-z]/g,''), { text: m.fr, lang: 'fr' });
        setTimeout(() => Audio2.play('eg_move_'+m.eg, { text: m.eg, lang: 'eg' }), 900);
      };
      document.getElementById('replay').addEventListener('click', speak);
      document.getElementById('next').addEventListener('click', () => { idx++; show(); });
      setTimeout(speak, 300);
    }
    show();
  }
};
