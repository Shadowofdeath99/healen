/* ===== Voice Dictionary — every phrase in the app with priority =====
   priority 1 = essential (record first)
   priority 2 = nice to have
   priority 3 = bonus
*/
window.VOICE_DICT = {
  // ===== Encouragement (priority 1) =====
  encouragement: [
    { id: 'fr_bravo',      fr: 'Bravo !',               eg: 'برافو',              p: 1 },
    { id: 'fr_tres_bien',  fr: 'Très bien !',           eg: 'تحفة',               p: 1 },
    { id: 'fr_encore',     fr: 'Encore !',              eg: 'تاني كمان مرة',      p: 1 },
    { id: 'fr_reessaie',   fr: 'Essaie encore !',       eg: 'حاولي تاني',         p: 1 },
    { id: 'fr_genial',     fr: 'Génial !',              eg: 'عظيم',               p: 1 },
    { id: 'fr_formidable', fr: 'Tu es formidable !',    eg: 'إنتِ رائعة',          p: 2 },
    { id: 'fr_parfait',    fr: 'Parfait !',             eg: 'ممتاز',              p: 1 },
    { id: 'fr_oui',        fr: 'Oui !',                 eg: 'أيوه',               p: 1 },
    { id: 'fr_super',      fr: 'Super !',               eg: 'جامد',               p: 1 },
    { id: 'fr_wow',        fr: 'Waouh !',               eg: 'واو',                p: 1 },
    { id: 'eg_try_again',  fr: 'Essaie encore !',       eg: 'حاولي تاني',         p: 1 },
    { id: 'eg_well_done',  fr: 'Bien joué !',           eg: 'شاطرة',              p: 1 },
    { id: 'eg_you_can',    fr: 'Tu peux le faire !',    eg: 'إنتِ تقدري',          p: 2 },
    { id: 'eg_almost',     fr: 'Presque !',             eg: 'قربتِ',              p: 2 },
    { id: 'eg_look_well',  fr: 'Regarde bien !',        eg: 'بصي كويس',           p: 1 }
  ],

  // ===== Greetings & UI =====
  ui: [
    { id: 'fr_hello',      fr: 'Bonjour !',             eg: 'أهلاً',              p: 1 },
    { id: 'fr_welcome',    fr: 'Bienvenue !',           eg: 'أهلاً وسهلاً',        p: 1 },
    { id: 'fr_lets_play',  fr: 'Allons jouer !',        eg: 'يلا نلعب',            p: 1 },
    { id: 'fr_choose',     fr: 'Choisis un jeu',        eg: 'اختاري لعبة',         p: 1 },
    { id: 'fr_choose_answer', fr: 'Choisis la bonne réponse', eg: 'اختاري الإجابة الصح', p: 1 },
    { id: 'fr_listen',     fr: 'Écoute bien',           eg: 'اسمعي كويس',          p: 1 },
    { id: 'fr_your_turn',  fr: 'À toi !',               eg: 'دورك',                p: 1 },
    { id: 'fr_click_hear', fr: 'Clique pour écouter',   eg: 'دوسي عشان تسمعي',     p: 1 },
    { id: 'fr_replay',     fr: 'Écoute encore',         eg: 'اسمعي تاني',          p: 1 },
    { id: 'fr_ready',      fr: 'Prêt ?',                eg: 'مستعدة؟',             p: 1 }
  ],

  // ===== Numbers 1–10 =====
  numbers: [
    { id: 'fr_un',     fr: 'Un',     eg: 'واحد',    p: 1,  n: 1 },
    { id: 'fr_deux',   fr: 'Deux',   eg: 'اتنين',   p: 1,  n: 2 },
    { id: 'fr_trois',  fr: 'Trois',  eg: 'تلاتة',   p: 1,  n: 3 },
    { id: 'fr_quatre', fr: 'Quatre', eg: 'أربعة',   p: 1,  n: 4 },
    { id: 'fr_cinq',   fr: 'Cinq',   eg: 'خمسة',    p: 1,  n: 5 },
    { id: 'fr_six',    fr: 'Six',    eg: 'ستة',     p: 1,  n: 6 },
    { id: 'fr_sept',   fr: 'Sept',   eg: 'سبعة',    p: 1,  n: 7 },
    { id: 'fr_huit',   fr: 'Huit',   eg: 'تمانية',  p: 1,  n: 8 },
    { id: 'fr_neuf',   fr: 'Neuf',   eg: 'تسعة',    p: 1,  n: 9 },
    { id: 'fr_dix',    fr: 'Dix',    eg: 'عشرة',    p: 1,  n: 10 }
  ],

  // ===== Letters A–Z (French pronunciation + example word) =====
  letters: [
    { id: 'fr_letter_a', fr: 'A comme Avion',       eg: 'أ = أڤيون = طيارة',    p: 2,  L: 'A' },
    { id: 'fr_letter_b', fr: 'B comme Ballon',      eg: 'ب = بالون = كورة',     p: 2,  L: 'B' },
    { id: 'fr_letter_c', fr: 'C comme Chat',        eg: 'س = شا = قطة',         p: 2,  L: 'C' },
    { id: 'fr_letter_d', fr: 'D comme Dauphin',     eg: 'د = دوفان = دولفين',   p: 2,  L: 'D' },
    { id: 'fr_letter_e', fr: 'E comme Éléphant',    eg: 'إ = إليفان = فيل',     p: 2,  L: 'E' },
    { id: 'fr_letter_f', fr: 'F comme Fleur',       eg: 'ف = فلور = زهرة',      p: 2,  L: 'F' },
    { id: 'fr_letter_g', fr: 'G comme Girafe',      eg: 'ج = جيراف = زرافة',    p: 2,  L: 'G' },
    { id: 'fr_letter_h', fr: 'H comme Hibou',       eg: 'إتش = إيبو = بومة',    p: 3,  L: 'H' },
    { id: 'fr_letter_i', fr: 'I comme Igloo',       eg: 'إي = إيجلو = إسكيمو',  p: 3,  L: 'I' },
    { id: 'fr_letter_j', fr: 'J comme Jus',         eg: 'جي = جو = عصير',       p: 2,  L: 'J' },
    { id: 'fr_letter_k', fr: 'K comme Kangourou',   eg: 'كا = كانجورو = كنغر',  p: 3,  L: 'K' },
    { id: 'fr_letter_l', fr: 'L comme Lion',        eg: 'إل = ليون = أسد',      p: 2,  L: 'L' },
    { id: 'fr_letter_m', fr: 'M comme Maison',      eg: 'إم = ميزون = بيت',     p: 2,  L: 'M' },
    { id: 'fr_letter_n', fr: 'N comme Nuage',       eg: 'إن = نُواج = سحابة',   p: 3,  L: 'N' },
    { id: 'fr_letter_o', fr: 'O comme Orange',      eg: 'أو = أورانج = برتقالة',p: 2,  L: 'O' },
    { id: 'fr_letter_p', fr: 'P comme Pomme',       eg: 'بي = بوم = تفاحة',     p: 2,  L: 'P' },
    { id: 'fr_letter_q', fr: 'Q comme Quatre',      eg: 'كيو = كاتر = أربعة',   p: 3,  L: 'Q' },
    { id: 'fr_letter_r', fr: 'R comme Rouge',       eg: 'إر = روج = أحمر',      p: 3,  L: 'R' },
    { id: 'fr_letter_s', fr: 'S comme Soleil',      eg: 'إس = سولي = شمس',      p: 2,  L: 'S' },
    { id: 'fr_letter_t', fr: 'T comme Train',       eg: 'تي = تران = قطر',      p: 2,  L: 'T' },
    { id: 'fr_letter_u', fr: 'U comme Un',          eg: 'أو = آن = واحد',       p: 3,  L: 'U' },
    { id: 'fr_letter_v', fr: 'V comme Voiture',     eg: 'في = ڤواتور = عربية',  p: 2,  L: 'V' },
    { id: 'fr_letter_w', fr: 'W comme Wagon',       eg: 'دوبل ڤي = ڤاجون = عربية قطر', p: 3, L: 'W' },
    { id: 'fr_letter_x', fr: 'X comme Xylophone',   eg: 'إكس = زيلوفون = زايلوفون', p: 3, L: 'X' },
    { id: 'fr_letter_y', fr: 'Y comme Yaourt',      eg: 'إيجريك = ياورت = زبادي', p: 3, L: 'Y' },
    { id: 'fr_letter_z', fr: 'Z comme Zèbre',       eg: 'زد = زيدبر = حمار وحشي', p: 3, L: 'Z' }
  ],

  // ===== Colors =====
  colors: [
    { id: 'fr_rouge',  fr: 'Rouge',  eg: 'أحمر',    p: 1 },
    { id: 'fr_bleu',   fr: 'Bleu',   eg: 'أزرق',    p: 1 },
    { id: 'fr_jaune',  fr: 'Jaune',  eg: 'أصفر',    p: 1 },
    { id: 'fr_vert',   fr: 'Vert',   eg: 'أخضر',    p: 1 },
    { id: 'fr_orange', fr: 'Orange', eg: 'برتقالي', p: 1 },
    { id: 'fr_violet', fr: 'Violet', eg: 'بنفسجي',  p: 1 },
    { id: 'fr_rose',   fr: 'Rose',   eg: 'وردي',    p: 1 },
    { id: 'fr_noir',   fr: 'Noir',   eg: 'أسود',    p: 1 },
    { id: 'fr_blanc',  fr: 'Blanc',  eg: 'أبيض',    p: 1 },
    { id: 'fr_marron', fr: 'Marron', eg: 'بني',     p: 1 }
  ],

  // ===== Animals =====
  animals: [
    { id: 'fr_chat',     fr: 'Le chat',       eg: 'القطة',    p: 1, emoji: '🐱' },
    { id: 'fr_chien',    fr: 'Le chien',      eg: 'الكلب',    p: 1, emoji: '🐶' },
    { id: 'fr_vache',    fr: 'La vache',      eg: 'البقرة',   p: 1, emoji: '🐮' },
    { id: 'fr_lion',     fr: 'Le lion',       eg: 'الأسد',    p: 1, emoji: '🦁' },
    { id: 'fr_grenouille', fr: 'La grenouille', eg: 'الضفدع', p: 2, emoji: '🐸' },
    { id: 'fr_lapin',    fr: 'Le lapin',      eg: 'الأرنب',   p: 1, emoji: '🐰' },
    { id: 'fr_elephant', fr: "L'éléphant",    eg: 'الفيل',    p: 1, emoji: '🐘' },
    { id: 'fr_canard',   fr: 'Le canard',     eg: 'البطة',    p: 2, emoji: '🦆' },
    { id: 'fr_poule',    fr: 'La poule',      eg: 'الفرخة',   p: 2, emoji: '🐔' },
    { id: 'fr_poisson',  fr: 'Le poisson',    eg: 'السمكة',   p: 1, emoji: '🐟' },
    { id: 'fr_abeille',  fr: "L'abeille",     eg: 'النحلة',   p: 2, emoji: '🐝' },
    { id: 'fr_singe',    fr: 'Le singe',      eg: 'القرد',    p: 2, emoji: '🐒' }
  ],

  // ===== Fruits & Vegetables =====
  fruits: [
    { id: 'fr_pomme',   fr: 'Pomme',      eg: 'تفاحة',   p: 1, emoji: '🍎' },
    { id: 'fr_banane',  fr: 'Banane',     eg: 'موزة',    p: 1, emoji: '🍌' },
    { id: 'fr_orange_fruit', fr: 'Orange', eg: 'برتقالة', p: 2, emoji: '🍊' },
    { id: 'fr_fraise',  fr: 'Fraise',     eg: 'فراولة',  p: 1, emoji: '🍓' },
    { id: 'fr_raisin',  fr: 'Raisin',     eg: 'عنب',     p: 2, emoji: '🍇' },
    { id: 'fr_pasteque', fr: 'Pastèque',  eg: 'بطيخ',    p: 2, emoji: '🍉' },
    { id: 'fr_carotte', fr: 'Carotte',    eg: 'جزر',     p: 1, emoji: '🥕' },
    { id: 'fr_tomate',  fr: 'Tomate',     eg: 'طماطم',   p: 1, emoji: '🍅' },
    { id: 'fr_brocoli', fr: 'Brocoli',    eg: 'بروكلي',  p: 2, emoji: '🥦' },
    { id: 'fr_concombre', fr: 'Concombre',eg: 'خيار',    p: 2, emoji: '🥒' }
  ],

  // ===== Body parts =====
  body: [
    { id: 'fr_tete',     fr: 'La tête',   eg: 'الراس',    p: 1, emoji: '👤' },
    { id: 'fr_main',     fr: 'La main',   eg: 'الإيد',    p: 1, emoji: '✋' },
    { id: 'fr_pied',     fr: 'Le pied',   eg: 'الرجل',    p: 1, emoji: '🦶' },
    { id: 'fr_oeil',     fr: "L'œil",     eg: 'العين',    p: 1, emoji: '👁️' },
    { id: 'fr_nez',      fr: 'Le nez',    eg: 'الأنف',    p: 1, emoji: '👃' },
    { id: 'fr_bouche',   fr: 'La bouche', eg: 'البق',     p: 1, emoji: '👄' },
    { id: 'fr_oreille',  fr: "L'oreille", eg: 'الودن',    p: 1, emoji: '👂' },
    { id: 'fr_bras',     fr: 'Le bras',   eg: 'الدراع',   p: 1, emoji: '💪' },
    { id: 'fr_jambe',    fr: 'La jambe',  eg: 'الساق',    p: 1, emoji: '🦵' },
    { id: 'fr_doigt',    fr: 'Le doigt',  eg: 'الصباع',   p: 1, emoji: '👆' }
  ],

  // ===== Emotions =====
  emotions: [
    { id: 'fr_content',  fr: 'Content',  eg: 'مبسوط',  p: 1, emoji: '😊' },
    { id: 'fr_triste',   fr: 'Triste',   eg: 'زعلان',  p: 1, emoji: '😢' },
    { id: 'fr_fache',    fr: 'Fâché',    eg: 'غضبان',  p: 1, emoji: '😠' },
    { id: 'fr_surpris',  fr: 'Surpris',  eg: 'متفاجئ', p: 2, emoji: '😲' },
    { id: 'fr_peur',     fr: 'Peur',     eg: 'خايف',   p: 2, emoji: '😨' },
    { id: 'fr_fatigue',  fr: 'Fatigué',  eg: 'تعبان',  p: 2, emoji: '😴' }
  ],

  // ===== Shapes =====
  shapes: [
    { id: 'fr_cercle',    fr: 'Cercle',    eg: 'دائرة',   p: 1 },
    { id: 'fr_carre',     fr: 'Carré',     eg: 'مربع',    p: 1 },
    { id: 'fr_triangle',  fr: 'Triangle',  eg: 'مثلث',    p: 1 },
    { id: 'fr_etoile',    fr: 'Étoile',    eg: 'نجمة',    p: 1 },
    { id: 'fr_coeur',     fr: 'Cœur',      eg: 'قلب',     p: 2 },
    { id: 'fr_rectangle', fr: 'Rectangle', eg: 'مستطيل',  p: 2 }
  ],

  // ===== Comparisons =====
  comparisons: [
    { id: 'fr_grand',    fr: 'Grand',    eg: 'كبير',   p: 1 },
    { id: 'fr_petit',    fr: 'Petit',    eg: 'صغير',   p: 1 },
    { id: 'fr_long',     fr: 'Long',     eg: 'طويل',   p: 1 },
    { id: 'fr_court',    fr: 'Court',    eg: 'قصير',   p: 1 },
    { id: 'fr_beaucoup', fr: 'Beaucoup', eg: 'كتير',   p: 1 },
    { id: 'fr_peu',      fr: 'Peu',      eg: 'قليل',   p: 1 },
    { id: 'fr_chaud',    fr: 'Chaud',    eg: 'ساخن',   p: 1 },
    { id: 'fr_froid',    fr: 'Froid',    eg: 'بارد',   p: 1 },
    { id: 'fr_dedans',   fr: 'Dedans',   eg: 'جوه',    p: 2 },
    { id: 'fr_dehors',   fr: 'Dehors',   eg: 'بره',    p: 2 }
  ],

  // ===== Musical instruments =====
  instruments: [
    { id: 'fr_piano',     fr: 'Piano',     eg: 'بيانو',      p: 2, emoji: '🎹' },
    { id: 'fr_tambour',   fr: 'Tambour',   eg: 'طبل',        p: 2, emoji: '🥁' },
    { id: 'fr_guitare',   fr: 'Guitare',   eg: 'جيتار',      p: 2, emoji: '🎸' },
    { id: 'fr_trompette', fr: 'Trompette', eg: 'ترومبيت',    p: 2, emoji: '🎺' },
    { id: 'fr_violon',    fr: 'Violon',    eg: 'كمان',       p: 2, emoji: '🎻' },
    { id: 'fr_flute',     fr: 'Flûte',     eg: 'فلوت',       p: 2, emoji: '🪈' },
    { id: 'fr_xylophone', fr: 'Xylophone', eg: 'زايلوفون',   p: 3, emoji: '🎵' },
    { id: 'fr_cloche',    fr: 'Cloche',    eg: 'جرس',        p: 2, emoji: '🔔' }
  ],

  // ===== Nature =====
  nature: [
    { id: 'fr_pluie',    fr: 'Pluie',    eg: 'مطر',     p: 2, emoji: '🌧️' },
    { id: 'fr_vent',     fr: 'Vent',     eg: 'رياح',    p: 2, emoji: '💨' },
    { id: 'fr_oiseaux',  fr: 'Oiseaux',  eg: 'عصافير',  p: 2, emoji: '🐦' },
    { id: 'fr_mer',      fr: 'Mer',      eg: 'بحر',     p: 2, emoji: '🌊' },
    { id: 'fr_tonnerre', fr: 'Tonnerre', eg: 'رعد',     p: 3, emoji: '⛈️' },
    { id: 'fr_feu',      fr: 'Feu',      eg: 'نار',     p: 2, emoji: '🔥' }
  ],

  // ===== Moves =====
  moves: [
    { id: 'fr_saute',      fr: 'Saute !',           eg: 'انططي',        p: 2, emoji: '🤸' },
    { id: 'fr_tourne',     fr: 'Tourne !',          eg: 'لفي',          p: 2, emoji: '🌀' },
    { id: 'fr_tape_mains', fr: 'Tape des mains',    eg: 'سقفي',         p: 2, emoji: '👏' },
    { id: 'fr_touche_sol', fr: 'Touche le sol',     eg: 'المسي الأرض',  p: 2, emoji: '👇' },
    { id: 'fr_leve_bras',  fr: 'Lève les bras',     eg: 'ارفعي إيديك',  p: 2, emoji: '🙌' },
    { id: 'fr_danse',      fr: 'Danse !',           eg: 'اتنططي',       p: 2, emoji: '💃' }
  ]
};

/* ===== Helper: get flat list of all phrases ===== */
window.getAllPhrases = function(){
  const all = [];
  for(const section in VOICE_DICT){
    VOICE_DICT[section].forEach(item => all.push({ ...item, section }));
  }
  return all;
};

/* ===== Count by priority ===== */
window.countByPriority = function(){
  const all = getAllPhrases();
  return {
    p1: all.filter(x => x.p === 1).length,
    p2: all.filter(x => x.p === 2).length,
    p3: all.filter(x => x.p === 3).length,
    total: all.length
  };
};
