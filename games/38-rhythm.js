window.Game_38 = {
  async mount(container){
    const FREQS = [261.63, 329.63, 392.00, 523.25]; // C E G C
    const COLORS = ['#e63946','#3ba55d','#3a86ff','#ffbe0b'];
    let sequence = [];
    let playerIndex = 0;
    let score = 0;
    let playing = false;

    container.innerHTML = `
      <div class="game-wrap">
        <div class="game-title-fr">🥁 Rythme à Reproduire</div>
        <div class="game-hint">شوف الأزرار اللي بتضيء، وكررها بنفس الترتيب</div>
        <div class="choices" id="pads" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:340px"></div>
        <div id="status" style="font-size:18px;color:#e0567f;font-weight:bold;min-height:30px"></div>
      </div>`;
    const pads = document.getElementById('pads');
    const status = document.getElementById('status');

    FREQS.forEach((f, i) => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.style.background = COLORS[i];
      b.style.height = '90px';
      b.style.border = '4px solid #fff';
      b.dataset.i = i;
      b.addEventListener('click', () => {
        if(playing) return;
        flashPad(i);
        if(sequence[playerIndex] === i){
          playerIndex++;
          if(playerIndex === sequence.length){
            score++;
            status.textContent = 'Bravo! ⭐';
            setTimeout(() => nextRound(), 800);
          }
        } else {
          status.textContent = 'حاولي تاني 💪';
          setTimeout(() => { sequence = []; score = 0; nextRound(); }, 900);
        }
      });
      pads.appendChild(b);
    });

    function flashPad(i){
      const pad = pads.querySelector(`[data-i="${i}"]`);
      if(!pad) return;
      playTone(FREQS[i], 350, 'sine');
      pad.style.transform = 'scale(1.15)';
      pad.style.opacity = '0.6';
      setTimeout(() => { pad.style.transform = ''; pad.style.opacity = ''; }, 350);
    }

    async function playSequence(){
      playing = true;
      status.textContent = 'شوفي كويس 👀';
      await sleep(400);
      for(const i of sequence){
        flashPad(i);
        await sleep(500);
      }
      playing = false;
      status.textContent = 'دورك! 🎯';
      playerIndex = 0;
    }

    function nextRound(){
      sequence.push(Math.floor(Math.random() * 4));
      playSequence();
    }

    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }

    function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
    nextRound();
  }
};
