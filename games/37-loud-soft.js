window.Game_37 = {
  async mount(container){
    let score = 0;
    function newRound(){
      const isLoud = Math.random() > 0.5;
      const volume = isLoud ? 0.8 : 0.08;
      const freq = 440;
      container.innerHTML = `
        <div class="game-wrap">
          <div class="game-title-fr">🔊 Fort / Doux</div>
          <div class="game-hint">اسمع الصوت: عالي (Fort) ولا واطي (Doux)؟</div>
          <button class="speak-btn" id="play">🔊 اسمع</button>
          <div class="choices" id="choices" style="margin-top:20px">
            <button class="choice-btn" data-ans="loud" style="font-size:clamp(16px,3vw,22px)">🔊 Fort</button>
            <button class="choice-btn" data-ans="soft" style="font-size:clamp(16px,3vw,22px)">🔈 Doux</button>
          </div>
        </div>`;
      const play = () => {
        try{
          const AC = window.AudioContext || window.webkitAudioContext;
          window.__ac = window.__ac || new AC();
          const ac = window.__ac;
          if(ac.state === 'suspended') ac.resume();
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.connect(gain); gain.connect(ac.destination);
          const now = ac.currentTime;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          osc.start(now); osc.stop(now + 0.65);
        }catch(e){}
      };
      document.getElementById('play').addEventListener('click', play);
      setTimeout(play, 200);
      const correct = isLoud ? 'loud' : 'soft';
      container.querySelectorAll('[data-ans]').forEach(btn => {
        btn.addEventListener('click', () => {
          if(btn.dataset.ans === correct){
            btn.classList.add('correct');
            starBurst();
            Audio2.play('fr_bravo', { text: 'Bravo !', lang: 'fr' });
            setTimeout(() => { score++; if(score >= 5) showWin(); else newRound(); }, 900);
          } else {
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        });
      });
    }
    function showWin(){
      container.innerHTML = `<div class="game-wrap"><div style="font-size:80px">🏆</div><div class="game-title-fr">Bravo !</div><button class="speak-btn" onclick="location.hash='#/home'">🏠 الرئيسية</button></div>`;
    }
    newRound();
  }
};
