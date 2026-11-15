/* ===== Parent Dashboard — 380 phrases, tabbed by section ===== */
window.Dashboard = (() => {
  let mediaRecorder = null;
  let chunks = [];
  let currentId = null;
  let stream = null;
  let activeSection = 'encouragement';

  const SECTION_LABELS = {
    intro: '📢 التعليمات (قبل اللعب)',
    encouragement: '💪 التشجيع',
    ui: '🎮 واجهة اللعب',
    numbers: '🔢 الأرقام',
    letters: '🔤 الحروف',
    colors: '🎨 الألوان',
    animals: '🐾 الحيوانات',
    fruits: '🍓 الفواكه',
    body: '🧍 الجسم',
    emotions: '😊 المشاعر',
    shapes: '🔷 الأشكال',
    comparisons: '📐 المقارنات',
    instruments: '🎵 الآلات',
    nature: '🌧️ الطبيعة',
    moves: '🏃 الحركات'
  };

  async function startRecording(id){
    currentId = id;
    try{
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      mediaRecorder.ondataavailable = e => { if(e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await Store.putAudio(currentId, blob, { ts: Date.now() });
        if(stream){ stream.getTracks().forEach(t => t.stop()); stream = null; }
        await renderSection(activeSection);
      };
      mediaRecorder.start();
      updateRecBtn(id, 'recording');
    }catch(e){
      alert('محتاج إذن الميكروفون: ' + e.message);
    }
  }

  function stopRecording(){
    if(mediaRecorder && mediaRecorder.state !== 'inactive'){
      mediaRecorder.stop();
      updateRecBtn(currentId, 'idle');
    }
  }

  function updateRecBtn(id, state){
    const btn = document.querySelector(`[data-rec="${id}"]`);
    if(!btn) return;
    if(state === 'recording'){
      btn.textContent = '⏹️ وقف';
      btn.style.background = '#e0567f';
      btn.style.color = '#fff';
    } else {
      btn.textContent = '🎙️ سجل';
      btn.style.background = '';
      btn.style.color = '';
    }
  }

  async function playRec(id){
    const ok = await Audio2.play(id, {});
    if(ok === 'none') alert('مفيش تسجيل لسه');
  }

  async function deleteRec(id){
    if(!confirm('هتحذف التسجيل ده؟')) return;
    await Store.deleteAudio(id);
    await renderSection(activeSection);
  }

  async function renderProgress(){
    const list = await Store.listAudio();
    const recorded = new Set(list.map(r => r.id));
    const all = getAllPhrases();
    const p1 = all.filter(x => x.p === 1);
    const p1Done = p1.filter(x => recorded.has(x.id)).length;
    return { p1Total: p1.length, p1Done, allTotal: all.length, allDone: recorded.size };
  }

  async function renderSection(section){
    activeSection = section;
    const list = await Store.listAudio();
    const recorded = new Map(list.map(r => [r.id, r]));
    const items = VOICE_DICT[section] || [];
    const prog = await renderProgress();
    const c = document.getElementById('dash-content');

    c.innerHTML = `
      <div style="padding:12px;background:#fff7fa;border-radius:14px;margin-bottom:12px;text-align:center">
        <div style="font-size:16px;font-weight:bold;color:#e0567f">📊 التقدم الكلي</div>
        <div style="font-size:14px;margin-top:6px">
          أساسي: <b>${prog.p1Done}/${prog.p1Total}</b> &nbsp;|&nbsp;
          كل العبارات: <b>${prog.allDone}/${prog.allTotal}</b>
        </div>
      </div>
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px">
        ${Object.keys(SECTION_LABELS).map(k => `
          <button class="tab ${k === section ? 'active' : ''}" data-sec="${k}" style="white-space:nowrap">${SECTION_LABELS[k]}</button>
        `).join('')}
      </div>
      <div id="phrase-list"></div>
    `;

    // Bind section tabs
    c.querySelectorAll('[data-sec]').forEach(tab => {
      tab.addEventListener('click', () => renderSection(tab.dataset.sec));
    });

    // Render phrases
    const listC = document.getElementById('phrase-list');
    listC.innerHTML = items.map(item => {
      const has = recorded.has(item.id);
      const hasEg = recorded.has('eg_' + item.id.replace(/^fr_/, ''));
      return `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px;background:#fff;border-radius:12px;margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,.05)">
          <div style="flex:1;min-width:150px">
            <div style="font-size:15px;font-weight:bold">${has ? '✅' : '⬜'} ${item.fr}</div>
            <div style="font-size:13px;color:#6b5560">${item.eg}</div>
            ${item.p === 1 ? '<div style="font-size:11px;color:#e0567f">⭐ أساسي</div>' : ''}
          </div>
          <button data-rec="${item.id}" style="padding:8px 12px;border-radius:10px;background:#ffe1ea;font-size:13px;font-weight:bold">🎙️ سجل FR</button>
          ${has ? `<button data-play="${item.id}" style="padding:8px 12px;border-radius:10px;background:#d9f0ff;font-size:13px">▶️ FR</button>` : ''}
          <button data-rec="eg_${item.id.replace(/^fr_/, '')}" style="padding:8px 12px;border-radius:10px;background:#ffe1ea;font-size:13px;font-weight:bold">🎙️ سجل EG</button>
          ${hasEg ? `<button data-play="eg_${item.id.replace(/^fr_/, '')}" style="padding:8px 12px;border-radius:10px;background:#d9f0ff;font-size:13px">▶️ EG</button>` : ''}
        </div>
      `;
    }).join('');

    listC.querySelectorAll('[data-rec]').forEach(btn => {
      btn.addEventListener('click', () => {
        if(mediaRecorder && mediaRecorder.state === 'recording'){
          stopRecording();
        } else {
          startRecording(btn.dataset.rec);
        }
      });
    });
    listC.querySelectorAll('[data-play]').forEach(btn => {
      btn.addEventListener('click', () => playRec(btn.dataset.play));
    });
  }

  async function renderBackup(){
    const list = await Store.listAudio();
    const c = document.getElementById('dash-content');
    c.innerHTML = `
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin-bottom:8px">💾 نسخ احتياطي</h3>
        <p style="font-size:14px;color:#6b5560;margin-bottom:12px">عدد التسجيلات: <b>${list.length}</b></p>
        <button id="btn-export" style="padding:12px 20px;border-radius:10px;background:#9be3a8;font-weight:bold">⬇️ تصدير كل شيء (JSON)</button>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px">
        <h3 style="color:#e0567f;margin-bottom:8px">📥 استيراد</h3>
        <input type="file" id="file-import" accept="application/json" style="font-size:14px" />
      </div>
    `;
    document.getElementById('btn-export').addEventListener('click', exportBackup);
    document.getElementById('file-import').addEventListener('change', importBackup);
  }

  async function exportBackup(){
    const list = await Store.listAudio();
    const out = [];
    for(const r of list){
      const b64 = await blobToBase64(r.blob);
      out.push({ id: r.id, meta: r.meta, data: b64, type: r.blob.type });
    }
    const data = { exportedAt: Date.now(), items: out };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-fille-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(e){
    const file = e.target.files[0];
    if(!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    for(const item of data.items){
      const blob = base64ToBlob(item.data, item.type || 'audio/webm');
      await Store.putAudio(item.id, blob, item.meta || {});
    }
    alert('تم الاستيراد ✅ (' + data.items.length + ' تسجيل)');
    await renderSection(activeSection);
  }

  function blobToBase64(blob){
    return new Promise((res) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result.split(',')[1]);
      r.readAsDataURL(blob);
    });
  }

  function base64ToBlob(b64, type){
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type });
  }

  function bindTabs(){
    document.querySelectorAll('.dashboard-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dashboard-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset.tab;
        if(which === 'recorder') renderSection(activeSection);
        else if(which === 'backup') renderBackup();
        else if(which === 'games'){
          document.getElementById('dash-content').innerHTML =
            '<div style="padding:24px;text-align:center;color:#6b5560">🎮 إدارة الألعاب هتيجي في التحديث الجاي</div>';
        }
      });
    });
  }

  function init(){
    bindTabs();
    renderSection(activeSection);
  }

  return { init, renderSection };
})();
