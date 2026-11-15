/* ===== Parent Dashboard v3 — full settings + games management ===== */
window.Dashboard = (() => {
  let mediaRecorder = null;
  let chunks = [];
  let currentId = null;
  let stream = null;
  let activeSection = 'intro';
  let searchQuery = '';
  let filterMode = 'all';
  let gamesSearch = '';
  let gamesFilter = 'all';
  let pendingBlob = null;
  let pendingId = null;
  let isPreviewOpen = false;

  const SECTION_LABELS = {
    intro: '📢 التعليمات',
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

  const Settings = {
    getChildName: () => Store.get('child_name', ''),
    setChildName: (v) => Store.set('child_name', v || ''),
    getTtsSpeed: () => { const v = parseFloat(Store.get('tts_speed', 0.85)); return isNaN(v) ? 0.85 : v; },
    setTtsSpeed: (v) => Store.set('tts_speed', Math.max(0.5, Math.min(1.5, parseFloat(v) || 0.85))),
    getPin: () => Store.get('parent_pin', ''),
    setPin: (v) => Store.set('parent_pin', String(v || '').trim()),
    getAutoAdvance: () => Store.get('auto_advance', false),
    setAutoAdvance: (v) => Store.set('auto_advance', !!v),
    getLanguage: () => { const v = Store.get('language', 'both'); return (v === 'fr' || v === 'eg') ? v : 'both'; },
    setLanguage: (v) => Store.set('language', (v === 'fr' || v === 'eg') ? v : 'both'),
    getTheme: () => { const v = Store.get('theme', 'pink'); return ['pink','blue','green','purple'].includes(v) ? v : 'pink'; },
    setTheme: (v) => Store.set('theme', ['pink','blue','green','purple'].includes(v) ? v : 'pink'),
    getDisabledGames: () => { const v = Store.get('disabled_games', []); return Array.isArray(v) ? v : []; },
    setDisabledGames: (arr) => Store.set('disabled_games', Array.isArray(arr) ? arr : []),
    getGameStats: () => { const v = Store.get('game_stats', {}); return (v && typeof v === 'object') ? v : {}; },
    setGameStats: (obj) => Store.set('game_stats', obj || {})
  };

  /* ========== Recording ========== */
  async function startRecording(id) {
    currentId = id;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
        showPreviewModal(currentId, blob);
      };
      mediaRecorder.start();
      updateRecBtn(id, 'recording');
    } catch (e) { alert('محتاج إذن الميكروفون: ' + e.message); }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      updateRecBtn(currentId, 'idle');
    }
  }

  function updateRecBtn(id, state) {
    const btn = document.querySelector(`[data-rec="${id}"]`);
    if (!btn) return;
    const isEg = id.startsWith('eg_');
    if (state === 'recording') {
      btn.textContent = '⏹️ وقف';
      btn.style.background = '#e0567f'; btn.style.color = '#fff';
    } else {
      btn.textContent = isEg ? '🎙️ EG' : '🎙️ FR';
      btn.style.background = ''; btn.style.color = '';
    }
  }

  async function playRec(id) {
    const ok = await Audio2.play(id, {});
    if (ok === 'none') alert('مفيش تسجيل لسه');
  }
  async function deleteRec(id) {
    if (!confirm('هتحذف التسجيل ده؟')) return;
    await Store.deleteAudio(id);
    await renderSection(activeSection);
  }

  async function renderProgress() {
    const list = await Store.listAudio();
    const recorded = new Set(list.map(r => r.id));
    const all = getAllPhrases();
    const p1 = all.filter(x => x.p === 1);
    const p1Done = p1.filter(x => recorded.has(x.id)).length;
    return { p1Total: p1.length, p1Done, allTotal: all.length, allDone: recorded.size };
  }

  /* ========== Studio (recording) ========== */
  async function renderSection(section) {
    activeSection = section;
    const list = await Store.listAudio();
    const recorded = new Map(list.map(r => [r.id, r]));
    let items = VOICE_DICT[section] || [];
    const prog = await renderProgress();
    const c = document.getElementById('dash-content');

    const egId = (it) => 'eg_' + it.id.replace(/^fr_/, '');
    const hasRec = (it) => recorded.has(it.id) || recorded.has(egId(it));

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(it =>
        (it.fr || '').toLowerCase().includes(q) ||
        (it.eg || '').includes(searchQuery.trim()) ||
        (it.id || '').toLowerCase().includes(q)
      );
    }
    if (filterMode === 'recorded') items = items.filter(it => hasRec(it));
    else if (filterMode === 'unrecorded') items = items.filter(it => !hasRec(it));
    else if (filterMode === 'p1') items = items.filter(it => it.p === 1);

    c.innerHTML = `
      <div style="padding:12px;background:#fff7fa;border-radius:14px;margin-bottom:12px;text-align:center">
        <div style="font-size:16px;font-weight:bold;color:#e0567f">📊 التقدم الكلي</div>
        <div style="font-size:14px;margin-top:6px">
          أساسي: <b>${prog.p1Done}/${prog.p1Total}</b> &nbsp;|&nbsp;
          الكل: <b>${prog.allDone}/${prog.allTotal}</b>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <input id="search-box" type="text" placeholder="🔍 ابحث..." value="${searchQuery.replace(/"/g,'&quot;')}"
          style="flex:1;min-width:180px;padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit" />
        <select id="filter-mode" style="padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit">
          <option value="all"${filterMode==='all'?' selected':''}>الكل</option>
          <option value="unrecorded"${filterMode==='unrecorded'?' selected':''}>مش مسجل</option>
          <option value="recorded"${filterMode==='recorded'?' selected':''}>مسجل</option>
          <option value="p1"${filterMode==='p1'?' selected':''}>⭐ أساسي</option>
        </select>
      </div>
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px">
        ${Object.keys(SECTION_LABELS).map(k => {
          const si = VOICE_DICT[k] || [];
          const sr = si.filter(it => hasRec(it)).length;
          return `<button class="tab ${k===section?'active':''}" data-sec="${k}" style="white-space:nowrap">${SECTION_LABELS[k]} <small style="opacity:.75">${sr}/${si.length}</small></button>`;
        }).join('')}
      </div>
      ${items.length === 0 ? '<div style="text-align:center;padding:24px;color:#999">مفيش نتائج</div>' : ''}
      <div id="phrase-list"></div>
    `;

    document.getElementById('search-box').addEventListener('input', (e) => { searchQuery = e.target.value; renderSection(activeSection); });
    document.getElementById('filter-mode').addEventListener('change', (e) => { filterMode = e.target.value; renderSection(activeSection); });
    c.querySelectorAll('[data-sec]').forEach(tab => {
      tab.addEventListener('click', () => { searchQuery = ''; filterMode = 'all'; renderSection(tab.dataset.sec); });
    });

    const listC = document.getElementById('phrase-list');
    listC.innerHTML = items.map(item => {
      const has = recorded.has(item.id);
      const hasEg = recorded.has(egId(item));
      const egText = (item.eg || '').replace(/</g, '&lt;');
      return `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px;background:#fff;border-radius:12px;margin-bottom:8px;box-shadow:0 2px 6px rgba(0,0,0,.05)">
          <div style="flex:1;min-width:150px">
            <div style="font-size:15px;font-weight:bold">${has ? '✅' : '⬜'} ${item.fr}</div>
            <div style="font-size:13px;color:#6b5560;${item.long?'white-space:pre-line;max-height:90px;overflow-y:auto;padding:6px;background:#fafafa;border-radius:6px;margin-top:4px':''}">${egText}</div>
            ${item.p === 1 ? '<div style="font-size:11px;color:#e0567f">⭐ أساسي</div>' : ''}
          </div>
          <button data-rec="${item.id}" style="padding:8px 12px;border-radius:10px;background:#ffe1ea;font-size:13px;font-weight:bold;cursor:pointer">🎙️ FR</button>
          ${has ? `<button data-play="${item.id}" style="padding:8px 12px;border-radius:10px;background:#d9f0ff;font-size:13px;cursor:pointer">▶️ FR</button><button data-del="${item.id}" style="padding:8px 10px;border-radius:10px;background:#ffd9d9;font-size:12px;cursor:pointer">🗑️</button>` : ''}
          <button data-rec="${egId(item)}" style="padding:8px 12px;border-radius:10px;background:#ffe1ea;font-size:13px;font-weight:bold;cursor:pointer">🎙️ EG</button>
          ${hasEg ? `<button data-play="${egId(item)}" style="padding:8px 12px;border-radius:10px;background:#d9f0ff;font-size:13px;cursor:pointer">▶️ EG</button><button data-del="${egId(item)}" style="padding:8px 10px;border-radius:10px;background:#ffd9d9;font-size:12px;cursor:pointer">🗑️</button>` : ''}
        </div>
      `;
    }).join('');

    listC.querySelectorAll('[data-rec]').forEach(btn => btn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') stopRecording();
      else startRecording(btn.dataset.rec);
    }));
    listC.querySelectorAll('[data-play]').forEach(btn => btn.addEventListener('click', () => playRec(btn.dataset.play)));
    listC.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteRec(btn.dataset.del)));
  }

  /* ========== Settings ========== */
  async function renderSettings() {
    const c = document.getElementById('dash-content');
    const childName = Settings.getChildName();
    const speed = Settings.getTtsSpeed();
    const pin = Settings.getPin();
    const autoAdv = Settings.getAutoAdvance();
    const lang = Settings.getLanguage();
    const theme = Settings.getTheme();

    c.innerHTML = `
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">👧 إعدادات الطفل</h3>
        <label style="display:block;font-size:13px;margin-bottom:6px;color:#6b5560">اسم الطفلة</label>
        <input id="set-child-name" type="text" placeholder="مثال: هيلين" value="${(childName||'').replace(/"/g,'&quot;')}"
          style="width:100%;box-sizing:border-box;padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit" />
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">🌐 اللغة</h3>
        <select id="set-language" style="padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit;width:100%">
          <option value="both"${lang==='both'?' selected':''}>🇫🇷 فرنسي + 🇪🇬 مصري (الافتراضي)</option>
          <option value="fr"${lang==='fr'?' selected':''}>🇫🇷 فرنسي فقط</option>
          <option value="eg"${lang==='eg'?' selected':''}>🇪🇬 مصري فقط</option>
        </select>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">🔊 سرعة الصوت (TTS)</h3>
        <div style="display:flex;align-items:center;gap:12px">
          <input id="set-speed" type="range" min="0.5" max="1.5" step="0.05" value="${speed}" style="flex:1" />
          <span id="speed-val" style="font-weight:bold;min-width:44px;text-align:center">${speed.toFixed(2)}</span>
        </div>
        <button id="btn-test-tts" style="margin-top:10px;padding:8px 16px;border-radius:10px;background:#d9f0ff;font-size:13px;cursor:pointer">🔊 جرّبي</button>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">🎨 الثيم</h3>
        <select id="set-theme" style="padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit;width:100%">
          <option value="pink"${theme==='pink'?' selected':''}>🌸 وردي (الافتراضي)</option>
          <option value="blue"${theme==='blue'?' selected':''}>💙 أزرق</option>
          <option value="green"${theme==='green'?' selected':''}>💚 أخضر</option>
          <option value="purple"${theme==='purple'?' selected':''}>💜 بنفسجي</option>
        </select>
        <p style="font-size:12px;color:#999;margin:6px 0 0">⚠️ الثيم بيتطبق في التحديث الجاي</p>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">⌨️ سلوك التسجيل</h3>
        <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer">
          <input id="set-auto-adv" type="checkbox" ${autoAdv?'checked':''} />
          الانتقال التلقائي للعبارة التالية
        </label>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 12px">🔐 رمز الداشبورد (PIN)</h3>
        <p style="font-size:13px;color:#6b5560;margin:0 0 10px">اتركيه فاضي لتعطيل الحماية</p>
        <input id="set-pin" type="password" placeholder="••••" maxlength="6" value="${(pin||'').replace(/"/g,'&quot;')}"
          style="width:120px;padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;text-align:center;letter-spacing:6px;font-family:inherit" />
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px">
        <h3 style="color:#e0567f;margin:0 0 12px">🛠️ أدوات</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button id="btn-save-settings" style="padding:10px 20px;border-radius:10px;background:#9be3a8;font-weight:bold;font-size:14px;cursor:pointer">💾 حفظ الإعدادات</button>
          <button id="btn-replay-intro" style="padding:10px 20px;border-radius:10px;background:#d9f0ff;font-weight:bold;font-size:14px;cursor:pointer">🎧 اسمعي التعليمات الحالية</button>
          <button id="btn-reset-intro" style="padding:10px 20px;border-radius:10px;background:#ffe1ea;font-weight:bold;font-size:14px;cursor:pointer">🗑️ مسح تسجيل التعليمات</button>
          <button id="btn-clear-all" style="padding:10px 20px;border-radius:10px;background:#ffc9d4;font-weight:bold;font-size:14px;cursor:pointer">⚠️ مسح كل التسجيلات</button>
        </div>
      </div>
    `;

    document.getElementById('set-speed').addEventListener('input', (e) => {
      document.getElementById('speed-val').textContent = parseFloat(e.target.value).toFixed(2);
    });
    document.getElementById('btn-test-tts').addEventListener('click', () => {
      const sp = parseFloat(document.getElementById('set-speed').value);
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
        const name = document.getElementById('set-child-name').value.trim() || 'يا حبيبتي';
        const u = new SpeechSynthesisUtterance('أهلاً ' + name + '، اختبار سرعة الصوت');
        u.lang = 'ar-EG'; u.rate = sp;
        const v = (speechSynthesis.getVoices() || []).find(x => /ar[-_]EG/i.test(x.lang)) || (speechSynthesis.getVoices() || []).find(x => /ar/i.test(x.lang));
        if (v) u.voice = v;
        speechSynthesis.speak(u);
      }
    });
    document.getElementById('btn-save-settings').addEventListener('click', () => {
      Settings.setChildName(document.getElementById('set-child-name').value.trim());
      Settings.setTtsSpeed(parseFloat(document.getElementById('set-speed').value));
      Settings.setAutoAdvance(document.getElementById('set-auto-adv').checked);
      Settings.setPin(document.getElementById('set-pin').value);
      Settings.setLanguage(document.getElementById('set-language').value);
      Settings.setTheme(document.getElementById('set-theme').value);
      alert('✅ تم الحفظ');
      try { window.dispatchEvent(new CustomEvent('hl:settings-updated')); } catch(e){}
    });
    document.getElementById('btn-replay-intro').addEventListener('click', () => {
      Audio2.play('eg_intro_full', {});
    });
    document.getElementById('btn-reset-intro').addEventListener('click', async () => {
      if (!confirm('هتمسح تسجيل التعليمات. متأكدة؟')) return;
      await Store.deleteAudio('eg_intro_full');
      alert('✅ اتمسح');
    });
    document.getElementById('btn-clear-all').addEventListener('click', async () => {
      if (!confirm('⚠️ هيتمسح كل التسجيلات نهائياً. متأكدة؟')) return;
      if (!confirm('تأكيد أخير؟')) return;
      const list = await Store.listAudio();
      for (const r of list) await Store.deleteAudio(r.id);
      alert('✅ اتمسح ' + list.length + ' تسجيل');
      renderSection(activeSection);
    });
  }

  /* ========== Games Management ========== */
  async function renderGames() {
    const c = document.getElementById('dash-content');
    const m = await window.GamesLoader.loadManifest();
    const disabled = new Set(Settings.getDisabledGames());
    const stats = Settings.getGameStats();
    let games = m.games.slice();

    if (gamesSearch.trim()) {
      const q = gamesSearch.trim().toLowerCase();
      games = games.filter(g => (g.title||'').toLowerCase().includes(q) || (g.emoji||'').includes(q) || g.id === q);
    }
    if (gamesFilter === 'enabled') games = games.filter(g => !disabled.has(g.id));
    else if (gamesFilter === 'disabled') games = games.filter(g => disabled.has(g.id));

    const enabledCount = m.games.filter(g => !disabled.has(g.id)).length;
    const totalPlays = Object.values(stats).reduce((s, x) => s + (x.plays || 0), 0);

    const fmtDate = (ts) => {
      if (!ts) return '—';
      const d = new Date(ts);
      const diff = Date.now() - ts;
      if (diff < 3600000) return Math.round(diff/60000) + ' دقيقة';
      if (diff < 86400000) return Math.round(diff/3600000) + ' ساعة';
      return Math.round(diff/86400000) + ' يوم';
    };

    c.innerHTML = `
      <div style="padding:12px;background:#fff7fa;border-radius:14px;margin-bottom:12px;text-align:center">
        <div style="font-size:16px;font-weight:bold;color:#e0567f">🎮 حالة الألعاب</div>
        <div style="font-size:14px;margin-top:6px">
          مفعّلة: <b>${enabledCount}/${m.games.length}</b> &nbsp;|&nbsp; إجمالي مرات اللعب: <b>${totalPlays}</b>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <input id="games-search" type="text" placeholder="🔍 ابحث عن لعبة..." value="${gamesSearch.replace(/"/g,'&quot;')}"
          style="flex:1;min-width:180px;padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit" />
        <select id="games-filter" style="padding:10px 14px;border-radius:12px;border:2px solid #ffe1ea;font-size:14px;font-family:inherit">
          <option value="all"${gamesFilter==='all'?' selected':''}>الكل</option>
          <option value="enabled"${gamesFilter==='enabled'?' selected':''}>مفعّلة</option>
          <option value="disabled"${gamesFilter==='disabled'?' selected':''}>معطّلة</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button id="btn-enable-all" style="padding:8px 16px;border-radius:10px;background:#9be3a8;font-weight:bold;font-size:13px;cursor:pointer">✅ تفعيل الكل</button>
        <button id="btn-disable-all" style="padding:8px 16px;border-radius:10px;background:#ffc9d4;font-weight:bold;font-size:13px;cursor:pointer">⛔ تعطيل الكل</button>
        <button id="btn-reset-stats" style="padding:8px 16px;border-radius:10px;background:#ffe1ea;font-weight:bold;font-size:13px;cursor:pointer">🔄 تصفير الإحصائيات</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
        ${games.map(g => {
          const isDisabled = disabled.has(g.id);
          const st = stats[g.id] || {};
          return `
            <div style="padding:12px;background:${isDisabled?'#f5f5f5':'#fff'};border-radius:12px;border:2px solid ${isDisabled?'#ddd':'#ffe1ea'};opacity:${isDisabled?'0.65':'1'}">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span style="font-size:24px">${g.emoji||'🎮'}</span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${g.title}">${g.title}</div>
                  <div style="font-size:11px;color:#999">#${g.id}</div>
                </div>
              </div>
              <div style="font-size:11px;color:#6b5560;margin-bottom:8px">
                ▶️ لُعبت: <b>${st.plays||0}</b> مرة &nbsp;|&nbsp; آخر مرة: <b>${fmtDate(st.lastPlayed)}</b>
              </div>
              <div style="display:flex;gap:6px">
                <button data-toggle="${g.id}" style="flex:1;padding:6px 10px;border-radius:8px;background:${isDisabled?'#9be3a8':'#ffc9d4'};font-size:12px;font-weight:bold;cursor:pointer">${isDisabled?'✅ فعّل':'⛔ عطّل'}</button>
                ${st.plays ? `<button data-reset="${g.id}" style="padding:6px 10px;border-radius:8px;background:#eee;font-size:12px;cursor:pointer" title="تصفير">🔄</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${games.length === 0 ? '<div style="text-align:center;padding:24px;color:#999">مفيش نتائج</div>' : ''}
    `;

    document.getElementById('games-search').addEventListener('input', (e) => { gamesSearch = e.target.value; renderGames(); });
    document.getElementById('games-filter').addEventListener('change', (e) => { gamesFilter = e.target.value; renderGames(); });
    document.getElementById('btn-enable-all').addEventListener('click', () => {
      if (!confirm('تفعيل كل الألعاب؟')) return;
      Settings.setDisabledGames([]);
      renderGames();
    });
    document.getElementById('btn-disable-all').addEventListener('click', () => {
      if (!confirm('⚠️ تعطيل كل الألعاب؟')) return;
      Settings.setDisabledGames(m.games.map(g => g.id));
      renderGames();
    });
    document.getElementById('btn-reset-stats').addEventListener('click', () => {
      if (!confirm('تصفير إحصائيات كل الألعاب؟')) return;
      Settings.setGameStats({});
      renderGames();
    });
    c.querySelectorAll('[data-toggle]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.toggle;
      const dis = new Set(Settings.getDisabledGames());
      if (dis.has(id)) dis.delete(id); else dis.add(id);
      Settings.setDisabledGames([...dis]);
      renderGames();
    }));
    c.querySelectorAll('[data-reset]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.reset;
      const st = Settings.getGameStats();
      delete st[id];
      Settings.setGameStats(st);
      renderGames();
    }));
  }

  /* ========== Backup ========== */
  async function renderBackup() {
    const list = await Store.listAudio();
    const c = document.getElementById('dash-content');
    c.innerHTML = `
      <div style="padding:16px;background:#fff;border-radius:14px;margin-bottom:12px">
        <h3 style="color:#e0567f;margin:0 0 8px">💾 نسخ احتياطي</h3>
        <p style="font-size:14px;color:#6b5560;margin:0 0 12px">عدد التسجيلات: <b>${list.length}</b></p>
        <button id="btn-export" style="padding:12px 20px;border-radius:10px;background:#9be3a8;font-weight:bold;cursor:pointer">⬇️ تصدير كل شيء (JSON)</button>
      </div>
      <div style="padding:16px;background:#fff;border-radius:14px">
        <h3 style="color:#e0567f;margin:0 0 8px">📥 استيراد</h3>
        <input type="file" id="file-import" accept="application/json" style="font-size:14px" />
      </div>
    `;
    document.getElementById('btn-export').addEventListener('click', exportBackup);
    document.getElementById('file-import').addEventListener('change', importBackup);
  }

  async function exportBackup() {
    const list = await Store.listAudio();
    const out = [];
    for (const r of list) { const b64 = await blobToBase64(r.blob); out.push({ id: r.id, meta: r.meta, data: b64, type: r.blob.type }); }
    const data = { exportedAt: Date.now(), items: out };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ma-fille-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click(); URL.revokeObjectURL(url);
  }
  async function importBackup(e) {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    let data; try { data = JSON.parse(text); } catch { alert('ملف غير صالح'); return; }
    if (!data.items || !Array.isArray(data.items)) { alert('ملف غير صالح'); return; }
    if (!confirm('هيتم استبدال التسجيلات الموجودة بـ ' + data.items.length + ' تسجيل. متأكدة؟')) return;
    for (const item of data.items) { const blob = base64ToBlob(item.data, item.type || 'audio/webm'); await Store.putAudio(item.id, blob, item.meta || {}); }
    alert('تم الاستيراد ✅ (' + data.items.length + ' تسجيل)');
    await renderSection(activeSection);
  }

  function blobToBase64(blob) {
    return new Promise((res) => { const r = new FileReader(); r.onloadend = () => res(r.result.split(',')[1]); r.readAsDataURL(blob); });
  }
  function base64ToBlob(b64, type) {
    const bin = atob(b64); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type });
  }


  function showPreviewModal(id, blob) {
    const url = URL.createObjectURL(blob);
    const isEg = id.startsWith('eg_');
    const baseId = isEg ? id.replace(/^eg_/, 'fr_') : id;
    const flat = getAllPhrases();
    const item = flat.find(x => x.id === baseId) || {};
    const text = isEg ? (item.eg || '') : (item.fr || '');
    const overlay = document.createElement('div');
    overlay.id = 'hl-preview-modal';
    overlay.style.cssText = 'position:fixed; inset:0; z-index:999999; background:rgba(0,0,0,.7); display:flex; align-items:center; justify-content:center; padding:20px; font-family:Cairo,Tajawal,sans-serif;';
    overlay.innerHTML = '<div style="background:#fff;border-radius:20px;padding:24px;max-width:420px;width:100%;text-align:center">'
      + '<h2 style="color:#e0567f;margin:0 0 8px;font-size:1.3rem">🎧 راجعي التسجيل</h2>'
      + '<p style="color:#6b5560;font-size:14px;margin:0 0 16px;white-space:pre-line;max-height:120px;overflow-y:auto;background:#fafafa;border-radius:8px;padding:8px">' + (text||'') + '</p>'
      + '<audio id="hl-preview-audio" src="' + url + '" controls style="width:100%;margin-bottom:16px"></audio>'
      + '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">'
      + '<button id="hl-save" style="padding:12px 24px;border-radius:12px;background:#9be3a8;font-weight:bold;font-size:15px;cursor:pointer;border:none">💾 حفظ</button>'
      + '<button id="hl-redo" style="padding:12px 24px;border-radius:12px;background:#d9f0ff;font-weight:bold;font-size:15px;cursor:pointer;border:none">🔁 إعادة</button>'
      + '<button id="hl-cancel" style="padding:12px 24px;border-radius:12px;background:#ffc9d4;font-weight:bold;font-size:15px;cursor:pointer;border:none">❌ إلغاء</button>'
      + '</div></div>';
    document.body.appendChild(overlay);
    isPreviewOpen = true;
    setTimeout(() => { const a = document.getElementById('hl-preview-audio'); if (a) a.play().catch(() => {}); }, 200);
    const close = () => { URL.revokeObjectURL(url); overlay.remove(); isPreviewOpen = false; pendingBlob = null; pendingId = null; };
    document.getElementById('hl-save').addEventListener('click', async () => {
      await Store.putAudio(id, blob, { ts: Date.now() });
      const wasAutoAdvance = Settings.getAutoAdvance();
      close();
      await renderSection(activeSection);
      if (wasAutoAdvance) advanceToNext(id);
    });
    document.getElementById('hl-redo').addEventListener('click', () => { const rid = id; close(); setTimeout(() => startRecording(rid), 300); });
    document.getElementById('hl-cancel').addEventListener('click', close);
  }

  function advanceToNext(currentRecordingId) {
    const items = VOICE_DICT[activeSection] || [];
    const isEg = currentRecordingId.startsWith('eg_');
    const baseId = isEg ? currentRecordingId.replace(/^eg_/, 'fr_') : currentRecordingId;
    const idx = items.findIndex(it => it.id === baseId);
    if (idx < 0 || idx >= items.length - 1) return;
    const next = items[idx + 1];
    const nextRecId = isEg ? ('eg_' + next.id.replace(/^fr_/, '')) : next.id;
    setTimeout(() => startRecording(nextRecId), 400);
  }

  function bindTabs() {
    document.querySelectorAll('.dashboard-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dashboard-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset.tab;
        if (which === 'recorder') renderSection(activeSection);
        else if (which === 'backup') renderBackup();
        else if (which === 'settings') renderSettings();
        else if (which === 'games') renderGames();
      });
    });
  }

  function init() {
    const pin = Settings.getPin();
    if (pin) {
      const entered = prompt('🔐 أدخلي رمز الداشبورد:');
      if (entered !== pin) {
        alert('❌ رمز غلط');
        const back = document.getElementById('btn-dash-back');
        if (back) back.click();
        return;
      }
    }
    bindTabs();
    renderSection(activeSection);
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
      if (e.code !== 'Space' && e.key !== ' ') return;
      if (isPreviewOpen) return;
      const dash = document.getElementById('dashboard');
      if (!dash || dash.classList.contains('hidden')) return;
      e.preventDefault();
      if (mediaRecorder && mediaRecorder.state === 'recording') stopRecording();
      else if (currentId) startRecording(currentId);
    });
  }

  return { init, renderSection, Settings };
})();
