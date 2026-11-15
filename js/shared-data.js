/* ===== Shared data for games ===== */
window.SHARED = {
  numbers: [
    { n: 1,  fr: 'Un',     frId: 'fr_un',     eg: 'واحد',    egId: 'eg_one' },
    { n: 2,  fr: 'Deux',   frId: 'fr_deux',   eg: 'اتنين',   egId: 'eg_two' },
    { n: 3,  fr: 'Trois',  frId: 'fr_trois',  eg: 'تلاتة',   egId: 'eg_three' },
    { n: 4,  fr: 'Quatre', frId: 'fr_quatre', eg: 'أربعة',   egId: 'eg_four' },
    { n: 5,  fr: 'Cinq',   frId: 'fr_cinq',   eg: 'خمسة',    egId: 'eg_five' },
    { n: 6,  fr: 'Six',    frId: 'fr_six',    eg: 'ستة',     egId: 'eg_six' },
    { n: 7,  fr: 'Sept',   frId: 'fr_sept',   eg: 'سبعة',    egId: 'eg_seven' },
    { n: 8,  fr: 'Huit',   frId: 'fr_huit',   eg: 'تمانية',  egId: 'eg_eight' },
    { n: 9,  fr: 'Neuf',   frId: 'fr_neuf',   eg: 'تسعة',    egId: 'eg_nine' },
    { n: 10, fr: 'Dix',    frId: 'fr_dix',    eg: 'عشرة',    egId: 'eg_ten' }
  ],
  animals: [
    { emoji: '🐱', fr: 'Le chat',  frId: 'fr_chat',  eg: 'القطة',  egId: 'eg_cat' },
    { emoji: '🐶', fr: 'Le chien', frId: 'fr_chien', eg: 'الكلب',  egId: 'eg_dog' },
    { emoji: '🐮', fr: 'La vache', frId: 'fr_vache', eg: 'البقرة', egId: 'eg_cow' },
    { emoji: '🦁', fr: 'Le lion',  frId: 'fr_lion',  eg: 'الأسد',  egId: 'eg_lion' },
    { emoji: '🐸', fr: 'La grenouille', frId: 'fr_frog', eg: 'الضفدع', egId: 'eg_frog' },
    { emoji: '🐰', fr: 'Le lapin', frId: 'fr_rabbit', eg: 'الأرنب', egId: 'eg_rabbit' },
    { emoji: '🐘', fr: 'L\'éléphant', frId: 'fr_elephant', eg: 'الفيل', egId: 'eg_elephant' },
    { emoji: '🦆', fr: 'Le canard', frId: 'fr_duck', eg: 'البطة', egId: 'eg_duck' },
    { emoji: '🐔', fr: 'La poule', frId: 'fr_hen', eg: 'الفرخة', egId: 'eg_hen' },
    { emoji: '🐟', fr: 'Le poisson', frId: 'fr_fish', eg: 'السمكة', egId: 'eg_fish' }
  ]
};

/* Helper: click feedback + speak */
window.speakNum = async function(num){
  const n = SHARED.numbers[num-1];
  if(!n) return;
  await Audio2.play(n.frId, { text: n.fr, lang: 'fr' });
  setTimeout(() => Audio2.play(n.egId, { text: n.eg, lang: 'eg' }), 900);
};

window.speakAnimal = async function(animal){
  await Audio2.play(animal.frId, { text: animal.fr, lang: 'fr' });
  setTimeout(() => Audio2.play(animal.egId, { text: animal.eg, lang: 'eg' }), 900);
};

/* ===== Words (with first letter + emoji) ===== */
window.SHARED_WORDS = [
  { fr: 'Avion',    letter: 'A', emoji: '✈️',  eg: 'طيارة' },
  { fr: 'Ballon',   letter: 'B', emoji: '⚽',  eg: 'كورة' },
  { fr: 'Chat',     letter: 'C', emoji: '🐱',  eg: 'قطة' },
  { fr: 'Dauphin',  letter: 'D', emoji: '🐬',  eg: 'دولفين' },
  { fr: 'Éléphant', letter: 'E', emoji: '🐘',  eg: 'فيل' },
  { fr: 'Fleur',    letter: 'F', emoji: '🌸',  eg: 'زهرة' },
  { fr: 'Girafe',   letter: 'G', emoji: '🦒',  eg: 'زرافة' },
  { fr: 'Hibou',    letter: 'H', emoji: '🦉',  eg: 'بومة' },
  { fr: 'Igloo',    letter: 'I', emoji: '🏠',  eg: 'إسكيمو' },
  { fr: 'Jus',      letter: 'J', emoji: '🧃',  eg: 'عصير' },
  { fr: 'Kangourou',letter: 'K', emoji: '🦘',  eg: 'كنغر' },
  { fr: 'Lion',     letter: 'L', emoji: '🦁',  eg: 'أسد' },
  { fr: 'Maison',   letter: 'M', emoji: '🏠',  eg: 'بيت' },
  { fr: 'Nuage',    letter: 'N', emoji: '☁️',  eg: 'سحابة' },
  { fr: 'Orange',   letter: 'O', emoji: '🍊',  eg: 'برتقالة' },
  { fr: 'Pomme',    letter: 'P', emoji: '🍎',  eg: 'تفاحة' },
  { fr: 'Poisson',  letter: 'P', emoji: '🐟',  eg: 'سمكة' },
  { fr: 'Soleil',   letter: 'S', emoji: '☀️',  eg: 'شمس' },
  { fr: 'Train',    letter: 'T', emoji: '🚂',  eg: 'قطر' },
  { fr: 'Voiture',  letter: 'V', emoji: '🚗',  eg: 'عربية' }
];

window.LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/* ===== Extended animals with habitat, baby, food ===== */
window.SHARED_ANIMALS = [
  { emoji: '🐱', fr: 'Le chat',        eg: 'القطة',    sound: 'meow', habitat: '🏠 maison',  baby: '🐈 chaton',  food: '🐟 poisson' },
  { emoji: '🐶', fr: 'Le chien',       eg: 'الكلب',    sound: 'woof', habitat: '🏠 maison',  baby: '🐕 chiot',   food: '🦴 os' },
  { emoji: '🐮', fr: 'La vache',       eg: 'البقرة',   sound: 'moo',  habitat: '🌾 ferme',   baby: '🐄 veau',    food: '🌿 herbe' },
  { emoji: '🦁', fr: 'Le lion',        eg: 'الأسد',    sound: 'roar', habitat: '🌳 jungle',  baby: '🐆 lionceau', food: '🥩 viande' },
  { emoji: '🐸', fr: 'La grenouille',  eg: 'الضفدع',   sound: 'croak',habitat: '💧 étang',   baby: '🐸 têtard',  food: '🪰 mouche' },
  { emoji: '🐰', fr: 'Le lapin',       eg: 'الأرنب',   sound: 'squeak',habitat: '🌾 ferme',  baby: '🐇 lapereau', food: '🥕 carotte' },
  { emoji: '🐘', fr: "L'éléphant",     eg: 'الفيل',    sound: 'trumpet',habitat: '🌳 jungle',baby: '🐘 éléphanteau', food: '🌿 herbe' },
  { emoji: '🦆', fr: 'Le canard',      eg: 'البطة',    sound: 'quack',habitat: '💧 étang',   baby: '🐤 caneton',  food: '🍞 pain' },
  { emoji: '🐔', fr: 'La poule',       eg: 'الفرخة',   sound: 'cluck',habitat: '🌾 ferme',   baby: '🐣 poussin',  food: '🌾 grain' },
  { emoji: '🐟', fr: 'Le poisson',     eg: 'السمكة',   sound: 'blub', habitat: '💧 mer',     baby: '🐟 alevin',   food: '🪱 ver' },
  { emoji: '🐝', fr: "L'abeille",      eg: 'النحلة',   sound: 'buzz', habitat: '🌸 jardin',  baby: '🐛 larve',    food: '🌺 nectar' },
  { emoji: '🐒', fr: 'Le singe',       eg: 'القرد',    sound: 'ooh',  habitat: '🌳 jungle',  baby: '🐒 bébé singe',food: '🍌 banane' }
];

/* Animal sound files (in /audio/sounds/) — fallback to TTS if missing */
window.playAnimalSound = async function(animal){
  const ok = await Audio2.play('sound_'+animal.sound, {});
  if(ok !== 'recorded'){
    // fallback: speak the French name
    await Audio2.play('fr_'+animal.fr.replace(/[^a-z]/gi,'').toLowerCase(), { text: animal.fr, lang: 'fr' });
  }
};

/* ===== Colors ===== */
window.SHARED_COLORS = [
  { fr: 'Rouge',  frId: 'fr_rouge',  eg: 'أحمر',   egId: 'eg_red',    hex: '#e63946', emoji: '🍎' },
  { fr: 'Bleu',   frId: 'fr_bleu',   eg: 'أزرق',   egId: 'eg_blue',   hex: '#3a86ff', emoji: '🌊' },
  { fr: 'Jaune',  frId: 'fr_jaune',  eg: 'أصفر',   egId: 'eg_yellow', hex: '#ffbe0b', emoji: '☀️' },
  { fr: 'Vert',   frId: 'fr_vert',   eg: 'أخضر',   egId: 'eg_green',  hex: '#06d6a0', emoji: '🌿' },
  { fr: 'Orange', frId: 'fr_orange', eg: 'برتقالي',egId: 'eg_orange', hex: '#fb8500', emoji: '🍊' },
  { fr: 'Violet', frId: 'fr_violet', eg: 'بنفسجي', egId: 'eg_purple', hex: '#8338ec', emoji: '🍇' },
  { fr: 'Rose',   frId: 'fr_rose',   eg: 'وردي',   egId: 'eg_pink',   hex: '#ff70a6', emoji: '🌸' },
  { fr: 'Noir',   frId: 'fr_noir',   eg: 'أسود',   egId: 'eg_black',  hex: '#222222', emoji: '🐈‍⬛' },
  { fr: 'Blanc',  frId: 'fr_blanc',  eg: 'أبيض',   egId: 'eg_white',  hex: '#ffffff', emoji: '☁️' },
  { fr: 'Marron', frId: 'fr_marron', eg: 'بني',    egId: 'eg_brown',  hex: '#8b4513', emoji: '🐻' }
];

/* ===== Shapes ===== */
window.SHARED_SHAPES = [
  { fr: 'Cercle',   eg: 'دائرة',  svg: '<circle cx="50" cy="50" r="40" fill="#7ec8ff"/>' },
  { fr: 'Carré',    eg: 'مربع',   svg: '<rect x="10" y="10" width="80" height="80" fill="#ff8fb1"/>' },
  { fr: 'Triangle', eg: 'مثلث',   svg: '<polygon points="50,10 90,90 10,90" fill="#9be3a8"/>' },
  { fr: 'Étoile',   eg: 'نجمة',   svg: '<polygon points="50,10 61,35 88,35 66,54 74,80 50,65 26,80 34,54 12,35 39,35" fill="#ffe17a"/>' },
  { fr: 'Cœur',     eg: 'قلب',    svg: '<path d="M50,85 C20,60 10,35 25,25 C35,18 45,25 50,35 C55,25 65,18 75,25 C90,35 80,60 50,85 Z" fill="#ff70a6"/>' },
  { fr: 'Rectangle',eg: 'مستطيل', svg: '<rect x="5" y="25" width="90" height="50" fill="#c6a8ff"/>' }
];

/* Color mixing rules */
window.COLOR_MIX = [
  { a: 'Rouge', b: 'Jaune', result: 'Orange', emoji: '🍊' },
  { a: 'Bleu',  b: 'Jaune', result: 'Vert',   emoji: '🌿' },
  { a: 'Rouge', b: 'Bleu',  result: 'Violet', emoji: '🍇' }
];

/* ===== Opposites / comparisons ===== */
window.OPPOSITES = [
  { a: { fr: 'Grand',  eg: 'كبير',   emoji: '🐘', frId: 'fr_grand',    egId: 'eg_big' },
    b: { fr: 'Petit',  eg: 'صغير',   emoji: '🐜', frId: 'fr_petit',    egId: 'eg_small' }, axis: 'size' },
  { a: { fr: 'Long',   eg: 'طويل',   emoji: '🦒', frId: 'fr_long',     egId: 'eg_long' },
    b: { fr: 'Court',  eg: 'قصير',   emoji: '🐢', frId: 'fr_court',    egId: 'eg_short' }, axis: 'length' },
  { a: { fr: 'Beaucoup',eg: 'كتير',  emoji: '🍬🍬🍬🍬🍬', frId: 'fr_beaucoup', egId: 'eg_many' },
    b: { fr: 'Peu',    eg: 'قليل',   emoji: '🍬', frId: 'fr_peu',      egId: 'eg_few' }, axis: 'quantity' },
  { a: { fr: 'Chaud',  eg: 'ساخن',   emoji: '🔥', frId: 'fr_chaud',    egId: 'eg_hot' },
    b: { fr: 'Froid',  eg: 'بارد',   emoji: '❄️', frId: 'fr_froid',    egId: 'eg_cold' }, axis: 'temp' },
  { a: { fr: 'Dedans', eg: 'جوه',    emoji: '📦🐱', frId: 'fr_dedans',  egId: 'eg_in' },
    b: { fr: 'Dehors', eg: 'بره',    emoji: '🐱🌳', frId: 'fr_dehors',  egId: 'eg_out' }, axis: 'place' }
];

/* ===== Musical instruments ===== */
window.INSTRUMENTS = [
  { fr: 'Piano',      eg: 'بيانو',  emoji: '🎹', freq: 261.63, type: 'sine' },
  { fr: 'Tambour',    eg: 'طبل',    emoji: '🥁', freq: 80,     type: 'square' },
  { fr: 'Guitare',    eg: 'جيتار',  emoji: '🎸', freq: 196,    type: 'triangle' },
  { fr: 'Trompette',  eg: 'ترومبيت',emoji: '🎺', freq: 349.23, type: 'sawtooth' },
  { fr: 'Violon',     eg: 'كمان',   emoji: '🎻', freq: 440,    type: 'sine' },
  { fr: 'Flûte',      eg: 'فلوت',   emoji: '🪈', freq: 523.25, type: 'sine' },
  { fr: 'Xylophone',  eg: 'زايلوفون',emoji: '🎵', freq: 587.33, type: 'triangle' },
  { fr: 'Cloche',     eg: 'جرس',    emoji: '🔔', freq: 880,    type: 'sine' }
];

/* ===== Nature sounds ===== */
window.NATURE_SOUNDS = [
  { fr: 'Pluie',    eg: 'مطر',    emoji: '🌧️' },
  { fr: 'Vent',     eg: 'رياح',   emoji: '💨' },
  { fr: 'Oiseaux',  eg: 'عصافير', emoji: '🐦' },
  { fr: 'Mer',      eg: 'بحر',    emoji: '🌊' },
  { fr: 'Tonnerre', eg: 'رعد',    emoji: '⛈️' },
  { fr: 'Feu',      eg: 'نار',    emoji: '🔥' }
];

/* ===== Play a tone using Web Audio ===== */
window.playTone = function(freq, durationMs = 400, type = 'sine'){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    window.__ac = window.__ac || new AC();
    const ac = window.__ac;
    if(ac.state === 'suspended') ac.resume();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ac.destination);
    const now = ac.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.05);
  }catch(e){ console.warn('tone error', e); }
};
