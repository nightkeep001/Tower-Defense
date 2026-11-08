'use strict';
/* =====================================================
   دفاع الأبراج — النسخة الموسّعة
   أبراج متنوعة • دمج وهجين • قدرات خاصة • مكافآت • ترقيات دائمة
   ===================================================== */

/* ---------- الخريطة ---------- */
const TILE = 60, COLS = 8, ROWS = 10, W = COLS * TILE, H = ROWS * TILE;
const PATH_CELLS = [[-1, 8], [6, 8], [6, 4], [1, 4], [1, 0]];
const WP = PATH_CELLS.map(([c, r]) => ({ x: c * TILE + TILE / 2, y: r * TILE + TILE / 2 }));
const SLOT_CELLS = [
  [2, 6], [4, 6], [0, 6], [7, 6], [2, 9], [4, 9], [6, 9], [3, 2],
  [5, 2], [0, 2], [3, 5], [7, 3], [5, 7], [3, 7], [1, 6], [6, 2],
];
const TREES = [[3,0],[4,0],[5,0],[6,0],[7,0],[7,1],[5,1],[0,0],[0,1],[0,9],[1,9],[7,9]];

const MAX_LEVEL = 7;
const START_COINS = 100, START_HP = 20;

/* =====================================================
   الأبراج
   dmg: الضرر • rate: ثواني بين الطلقات • splash: نصف قطر الانفجار
   slow/freeze/burn/poison: تأثيرات • chain: قفزات الصاعقة
   magic: يتجاوز الدروع • pierce: يخترق الدروع • crit: ضربة حرجة
   income/interval: دخل العملات • buff: تعزيز الأبراج القريبة
   unlock: سعر الفتح بالجواهر (0 = مفتوح من البداية)
   ===================================================== */
const TOWER_TYPES = {
  archer:   { icon: '🏹', cost: 50,  dmg: 12, rate: 0.5, range: 120, crit: 0.08, color: '#ffd54a', plate: '#3b6fd4', unlock: 0 },
  mage:     { icon: '🧙', cost: 80,  dmg: 26, rate: 1.0, range: 140, splash: 45, magic: true, color: '#b57bff', plate: '#7a4cc2', unlock: 0 },
  ice:      { icon: '❄️', cost: 70,  dmg: 6,  rate: 0.8, range: 110, slow: 1, slowDur: 2, freeze: 0.12, freezeDur: 1, color: '#8fe3ff', plate: '#2a9ac4', unlock: 0 },
  cannon:   { icon: '💣', cost: 110, dmg: 55, rate: 1.8, range: 150, splash: 62, color: '#ff9a4a', plate: '#a8562a', unlock: 0 },
  fire:     { icon: '🔥', cost: 90,  dmg: 4,  rate: 0.22, range: 90, splash: 26, burn: 7, burnDur: 3, color: '#ff6a2a', plate: '#c23a1a', unlock: 40 },
  poison:   { icon: '🧪', cost: 85,  dmg: 5,  rate: 0.7, range: 125, poison: 5, poisonDur: 4, color: '#8be04a', plate: '#4a8a1e', unlock: 60 },
  lightning:{ icon: '⚡', cost: 120, dmg: 16, rate: 0.9, range: 130, chain: 3, magic: true, color: '#fff27a', plate: '#8a7a1a', unlock: 80 },
  sniper:   { icon: '🎯', cost: 140, dmg: 100, rate: 2.4, range: 280, pierce: true, crit: 0.25, target: 'strong', color: '#ff5a5a', plate: '#8a2a2a', unlock: 100 },
  bank:     { icon: '💰', cost: 100, income: 8, interval: 4, color: '#ffd54a', plate: '#8a6a1a', unlock: 70 },
  totem:    { icon: '🗿', cost: 130, buff: 0.25, range: 130, color: '#7be0a8', plate: '#2a7a5a', unlock: 90 },

  /* ---- أبراج هجينة (تُصنع بالدمج فقط) ---- */
  flamearrow:  { hybrid: true, recipe: ['archer', 'fire'],      icon: '☄️', cost: 150, dmg: 20, rate: 0.4, range: 145, burn: 12, burnDur: 3, crit: 0.1, color: '#ff8a3a', plate: '#c2501a' },
  froststorm:  { hybrid: true, recipe: ['ice', 'lightning'],    icon: '🌨️', cost: 180, dmg: 18, rate: 0.8, range: 140, chain: 4, magic: true, slow: 1, slowDur: 2.5, freeze: 0.22, freezeDur: 1.2, color: '#a8e8ff', plate: '#3a7aa8' },
  volcano:     { hybrid: true, recipe: ['cannon', 'fire'],      icon: '🌋', cost: 220, dmg: 75, rate: 1.6, range: 155, splash: 80, burn: 14, burnDur: 4, color: '#ff5a1a', plate: '#8a2a0a' },
  plague:      { hybrid: true, recipe: ['mage', 'poison'],      icon: '☣️', cost: 200, dmg: 24, rate: 0.9, range: 150, splash: 60, magic: true, poison: 8, poisonDur: 5, color: '#a8ff4a', plate: '#5a8a1a' },
  thundergod:  { hybrid: true, recipe: ['sniper', 'lightning'], icon: '🔱', cost: 260, dmg: 140, rate: 2.0, range: 240, chain: 3, magic: true, crit: 0.2, target: 'strong', color: '#ffe84a', plate: '#8a7a0a' },
  frostsniper: { hybrid: true, recipe: ['ice', 'sniper'],       icon: '🧊', cost: 240, dmg: 90, rate: 2.0, range: 260, pierce: true, freeze: 0.6, freezeDur: 1.4, slow: 1, slowDur: 3, target: 'strong', color: '#7be0ff', plate: '#2a6a9a' },
  toxiccloud:  { hybrid: true, recipe: ['fire', 'poison'],      icon: '🌫️', cost: 200, dmg: 8, rate: 0.25, range: 110, splash: 45, burn: 8, burnDur: 3, poison: 6, poisonDur: 4, color: '#c8e84a', plate: '#6a7a2a' },
  arcane:      { hybrid: true, recipe: ['archer', 'mage'],      icon: '🪄', cost: 170, dmg: 34, rate: 0.5, range: 155, splash: 25, magic: true, crit: 0.15, color: '#d8a8ff', plate: '#6a3aa8' },
  temple:      { hybrid: true, recipe: ['bank', 'totem'],       icon: '🏛️', cost: 250, income: 22, interval: 4, buff: 0.2, range: 140, color: '#ffe08a', plate: '#8a6a2a' },
};
const RECIPES = {};
for (const [k, d] of Object.entries(TOWER_TYPES)) if (d.recipe) RECIPES[d.recipe.slice().sort().join('+')] = k;
const recipeKey = (a, b) => [a, b].sort().join('+');

/* =====================================================
   الأعداء
   ===================================================== */
const ENEMY_TYPES = {
  skeleton: { icon: '💀', hp: 1,    speed: 60,  reward: 10,  dmg: 1, size: 34 },
  bat:      { icon: '🦇', hp: 0.45, speed: 140, reward: 8,   dmg: 1, size: 30 },
  ghost:    { icon: '👻', hp: 0.6,  speed: 105, reward: 12,  dmg: 1, size: 32 },
  zombie:   { icon: '🧟', hp: 2.4,  speed: 42,  reward: 20,  dmg: 2, size: 36 },
  knight:   { icon: '🛡️', hp: 2,    speed: 50,  reward: 22,  dmg: 2, size: 34, armor: true },
  troll:    { icon: '👺', hp: 3.5,  speed: 45,  reward: 30,  dmg: 3, size: 38, regen: 0.03 },
  boss:     { icon: '👹', hp: 12,   speed: 36,  reward: 120, dmg: 5, size: 52, boss: true },
};
const BOSS_ICONS = ['👹', '🐉', '🦖', '👿'];

/* =====================================================
   القدرات الخاصة
   ===================================================== */
const SPELLS = [
  { id: 'freeze', key: 'q', icon: '❄️', cd: 45 },
  { id: 'fire',   key: 'w', icon: '🔥', cd: 50 },
  { id: 'meteor', key: 'e', icon: '☄️', cd: 35 },
  { id: 'gold',   key: 'r', icon: '💰', cd: 70 },
  { id: 'heal',   key: 't', icon: '💚', cd: 90 },
];

/* =====================================================
   مكافآت داخل الجولة (تُعرض كل 3 موجات)
   ===================================================== */
const PERKS = [
  { id: 'dmg',    icon: '⚔️', fn: () => G.mods.dmg *= 1.15 },
  { id: 'range',  icon: '🎯', fn: () => G.mods.range *= 1.12 },
  { id: 'speed',  icon: '⚡', fn: () => G.mods.speed *= 1.12 },
  { id: 'coin',   icon: '💰', fn: () => G.mods.coin *= 1.25 },
  { id: 'spell',  icon: '✨', fn: () => G.mods.spellCd *= 0.8 },
  { id: 'crit',   icon: '💥', fn: () => G.mods.crit += 0.08 },
  { id: 'burn',   icon: '🔥', fn: () => G.mods.burn *= 1.5 },
  { id: 'poison', icon: '☠️', fn: () => G.mods.poison *= 1.5 },
  { id: 'hp',     icon: '❤️', fn: () => { G.maxHp += 5; G.hp += 5; } },
  { id: 'gold',   icon: '🎁', fn: () => G.coins += 100 },
  { id: 'free',   icon: '⭐', fn: () => freeUpgrade(), cond: () => G.towers.some(t => t.level < MAX_LEVEL) },
];

/* =====================================================
   الترقيات الدائمة (تُشترى بالجواهر 💎)
   ===================================================== */
const META = {
  startCoins: { icon: '🪙', max: 10, cost: l => 15 + l * 10 },
  baseHp:     { icon: '❤️', max: 10, cost: l => 15 + l * 10 },
  damage:     { icon: '⚔️', max: 10, cost: l => 20 + l * 15 },
  coin:       { icon: '💰', max: 10, cost: l => 20 + l * 12 },
  spell:      { icon: '✨', max: 10, cost: l => 20 + l * 12 },
  sell:       { icon: '🏷️', max: 8,  cost: l => 15 + l * 10 },
  merge:      { icon: '🧬', max: 10, cost: l => 25 + l * 15 },
};

/* =====================================================
   الإنجازات
   ===================================================== */
const ACH = [
  { id: 'k100',  icon: '💀', stat: 'kills',    goal: 100,  gems: 10 },
  { id: 'k1000', icon: '☠️', stat: 'kills',    goal: 1000, gems: 40 },
  { id: 'w10',   icon: '🌊', stat: 'bestWave', goal: 10,   gems: 20 },
  { id: 'w20',   icon: '🌋', stat: 'bestWave', goal: 20,   gems: 60 },
  { id: 'b5',    icon: '👹', stat: 'bosses',   goal: 5,    gems: 30 },
  { id: 'm20',   icon: '🧬', stat: 'merges',   goal: 20,   gems: 25 },
  { id: 'f5',    icon: '⚗️', stat: 'fusions',  goal: 5,    gems: 30 },
  { id: 's30',   icon: '✨', stat: 'spells',   goal: 30,   gems: 20 },
  { id: 'r10',   icon: '🎮', stat: 'runs',     goal: 10,   gems: 15 },
];

/* ---------- عناصر الواجهة ---------- */
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d');
const ui = {
  hp: $('hp'), coins: $('coins'), wave: $('wave'), coinStat: $('coinStat'),
  towerBar: $('towerBar'), spells: $('spells'), nextBtn: $('nextBtn'), toast: $('toast'),
  info: $('info'), infoIcon: $('infoIcon'), infoName: $('infoName'), infoLv: $('infoLv'),
  infoStats: $('infoStats'), infoHint: $('infoHint'), btnUpgrade: $('btnUpgrade'), btnSell: $('btnSell'),
  menu: $('menu'), pauseOv: $('pauseOv'), overOv: $('overOv'), perkOv: $('perkOv'), perkList: $('perkList'),
  hub: $('hub'), hubBody: $('hubBody'), hubTabs: $('hubTabs'), hubGems: $('hubGems'),
  btnSpeed: $('btnSpeed'), btnPause: $('btnPause'), btnSound: $('btnSound'),
};

/* ---------- الإعدادات ---------- */
const SET_KEY = 'td_settings';
function detectLang() {
  const n = ((typeof navigator !== 'undefined' && navigator.language) || 'en').slice(0, 2).toLowerCase();
  return I18N[n] ? n : 'en';
}
let settings = { lang: detectLang(), sound: true, volume: 1, shake: true, floating: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY)) || {}); } catch (e) {}
if (!I18N[settings.lang]) settings.lang = 'en';
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {} }

const tName = k => lookup('tw', k)[0];
const tDesc = k => lookup('tw', k)[1];

/* ---------- الصوت ---------- */
let AC = null;
function beep(freq, dur = 0.08, type = 'square', vol = 0.04) {
  if (!settings.sound || settings.volume <= 0) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol * settings.volume;
    o.connect(g); g.connect(AC.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.stop(AC.currentTime + dur);
  } catch (e) { /* تجاهل */ }
}
const sfx = {
  build:   () => { beep(520, .08); setTimeout(() => beep(780, .1), 70); },
  upgrade: () => { beep(600, .08); setTimeout(() => beep(900, .08), 70); setTimeout(() => beep(1200, .12), 140); },
  sell:    () => beep(300, .12, 'triangle'),
  kill:    () => beep(900, .05, 'square', .02),
  hurt:    () => beep(140, .25, 'sawtooth', .06),
  wave:    () => { beep(330, .12, 'triangle'); setTimeout(() => beep(440, .18, 'triangle'), 120); },
  error:   () => beep(180, .1, 'square', .05),
  spell:   () => { beep(220, .25, 'sawtooth', .05); setTimeout(() => beep(660, .2, 'triangle', .05), 100); },
};

/* =====================================================
   الحفظ الدائم (جواهر • ترقيات • أبراج مفتوحة • إنجازات)
   ===================================================== */
const SAVE_KEY = 'td_save_v2';
function loadSave() {
  const def = {
    gems: 0, up: {}, unlocked: { archer: 1, mage: 1, ice: 1, cannon: 1 }, ach: {},
    stats: { kills: 0, bosses: 0, merges: 0, fusions: 0, spells: 0, bestWave: 0, runs: 0 },
  };
  let s = null;
  try { s = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) {}
  if (!s) { try { def.stats.bestWave = +localStorage.getItem('td_best') || 0; } catch (e) {} return def; }
  return {
    gems: s.gems || 0, up: s.up || {}, ach: s.ach || {},
    unlocked: { ...def.unlocked, ...(s.unlocked || {}) },
    stats: { ...def.stats, ...(s.stats || {}) },
  };
}
let save = loadSave();
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
const upLvl = k => save.up[k] || 0;

function checkAch() {
  for (const a of ACH) {
    if (!save.ach[a.id] && save.stats[a.stat] >= a.goal) {
      save.ach[a.id] = 1; save.gems += a.gems;
      toast(tr('t.ach', { name: lookup('a', a.id)[0], g: a.gems })); sfx.upgrade(); persist();
    }
  }
}

/* =====================================================
   حالة اللعبة
   ===================================================== */
let G = null;
const canPlay = () => G && G.state === 'playing' && !G.paused;

function newGame() {
  const spellCd = {};
  SPELLS.forEach(s => spellCd[s.id] = 0);
  G = {
    state: 'playing', paused: false, perkOpen: false, speed: 1,
    coins: START_COINS + 25 * upLvl('startCoins'),
    maxHp: START_HP + 2 * upLvl('baseHp'), hp: 0, wave: 0,
    enemies: [], towers: [], bullets: [], fx: [], rings: [], bolts: [],
    slots: SLOT_CELLS.map(([c, r]) => ({ c, r, tower: null })),
    queue: [], spawnTimer: 0, spawnGap: 0.9, countdown: 5, cleared: true,
    sel: 'archer', selTower: null, hover: null, mouse: null, drag: null, targeting: null,
    spellCd, goldT: 0, flash: null, shake: 0, time: 0,
    kills: 0, bosses: 0, perkChoices: [],
    mods: {
      dmg: 1 + 0.04 * upLvl('damage'), range: 1, speed: 1,
      coin: 1 + 0.05 * upLvl('coin'), spellCd: 1 - 0.04 * upLvl('spell'),
      crit: 0, burn: 1, poison: 1,
    },
  };
  G.hp = G.maxHp;
  buildTowerBar(); buildSpellBar(); hideInfo();
  refreshUI(true);
}

/* =====================================================
   الأبراج: إنشاء وحساب القوة
   ===================================================== */
function makeTower(key, slot, level = 1, spent = 0, bonus = 1) {
  const D = TOWER_TYPES[key];
  const t = {
    key, def: D, icon: D.icon, plate: D.plate, color: D.color, hybrid: !!D.hybrid,
    x: slot.c * TILE + TILE / 2, y: slot.r * TILE + TILE / 2,
    level, spent: spent || D.cost, bonus, slot, cd: 0, timer: 0, buff: 0, kills: 0,
  };
  recalc(t);
  return t;
}

function recalc(t) {
  const D = t.def, L = t.level - 1, m = Math.pow(1.4, L) * t.bonus;
  t.dmg = (D.dmg || 0) * m;
  t.range = (D.range || 0) + 8 * L;
  t.rate = (D.rate || 1) * Math.pow(0.93, L);
  t.splash = D.splash ? D.splash + 4 * L : 0;
  t.burn = (D.burn || 0) * Math.pow(1.3, L) * t.bonus;
  t.poison = (D.poison || 0) * Math.pow(1.3, L) * t.bonus;
  t.income = (D.income || 0) * m;
  t.aura = D.buff ? D.buff + 0.05 * L : 0;
}

const effDmg   = t => t.dmg * G.mods.dmg * (1 + t.buff);
const effRange = t => t.range * G.mods.range;
const effRate  = t => t.rate / G.mods.speed;
const upgradeCost = t => Math.round(t.def.cost * 0.9 * t.level);
const sellRate = () => 0.6 + 0.03 * upLvl('sell');
const sellValue = t => Math.floor(t.spent * sellRate());
const mergeMul = () => 1.10 + 0.03 * upLvl('merge');
const coinMul = () => G.mods.coin * (G.goldT > 0 ? 2 : 1);

function removeTower(t) {
  t.slot.tower = null;
  G.towers = G.towers.filter(x => x !== t);
  if (G.selTower === t) hideInfo();
}

function freeUpgrade() {
  const c = G.towers.filter(t => t.level < MAX_LEVEL);
  if (!c.length) return;
  const t = c[Math.floor(Math.random() * c.length)];
  t.level++; recalc(t);
  G.rings.push({ x: t.x, y: t.y, max: 50, life: 0.5, total: 0.5, color: '#ffd54a' });
  addFx(t.x, t.y - 20, '⭐ +1', '#ffd54a');
}

/* =====================================================
   الدمج: برجان متماثلان → مستوى أعلى • برجان مختلفان → هجين
   ===================================================== */
function mergeInfo(a, b) {
  if (a.key === b.key) {
    if (a.level !== b.level) return { error: 't.mergeLvl' };
    if (a.level >= MAX_LEVEL) return { error: 't.mergeMax' };
    return { type: 'merge' };
  }
  const r = RECIPES[recipeKey(a.key, b.key)];
  if (!r) return { error: 't.mergeNone' };
  if (a.level < 2 || b.level < 2) return { error: 't.mergeLv2' };
  return { type: 'fuse', result: r };
}

function tryMerge(a, b) {
  const info = mergeInfo(a, b);
  if (info.error) { toast('⚠️ ' + tr(info.error)); sfx.error(); return; }
  const slot = b.slot, spent = a.spent + b.spent, bonus = Math.max(a.bonus, b.bonus);
  removeTower(a); removeTower(b);
  let nt;
  if (info.type === 'merge') {
    nt = makeTower(a.key, slot, a.level + 1, spent, bonus * mergeMul());
    save.stats.merges++;
    addFx(nt.x, nt.y - 22, tr('fx.level', { n: nt.level }), '#7be0a8');
  } else {
    nt = makeTower(info.result, slot, Math.max(a.level, b.level), spent, bonus);
    save.stats.fusions++;
    addFx(nt.x, nt.y - 22, `✨ ${tName(nt.key)}`, '#d8a8ff');
    toast(tr('t.fused', { name: tName(nt.key) }));
  }
  slot.tower = nt; G.towers.push(nt);
  G.rings.push({ x: nt.x, y: nt.y, max: 60, life: 0.45, total: 0.45, color: '#fff' });
  G.shake = 0.12;
  sfx.upgrade(); checkAch(); persist();
  showInfo(nt);
}

/* =====================================================
   الموجات والأعداء
   ===================================================== */
function buildWave(w) {
  const pool = ['skeleton', 'skeleton'];
  if (w >= 2) pool.push('bat');
  if (w >= 3) pool.push('ghost');
  if (w >= 4) pool.push('zombie');
  if (w >= 6) pool.push('knight', 'knight');
  if (w >= 8) pool.push('troll');
  const q = [], n = 5 + Math.floor(w * 1.8);
  for (let i = 0; i < n; i++) q.push(pool[Math.floor(Math.random() * pool.length)]);
  if (w % 5 === 0) q.push('boss');
  return q;
}

function startWave() {
  G.wave++;
  G.queue = buildWave(G.wave);
  G.spawnTimer = 0;
  G.spawnGap = Math.max(0.4, 0.95 - G.wave * 0.02);
  G.cleared = false;
  if (G.wave > save.stats.bestWave) { save.stats.bestWave = G.wave; checkAch(); }
  sfx.wave();
  toast(tr(G.wave % 5 === 0 ? 't.boss' : 't.wave', { n: G.wave }));
}

function spawnEnemy(type) {
  const t = ENEMY_TYPES[type];
  let hp = 24 * Math.pow(1.18, G.wave - 1) * t.hp, icon = t.icon, armor = 0;
  if (t.armor) armor = 2 + G.wave * 0.5;
  if (t.boss) {
    const tier = Math.floor(G.wave / 5) - 1;
    icon = BOSS_ICONS[tier % BOSS_ICONS.length];
    hp *= 1 + 0.35 * tier; armor = G.wave * 0.4;
  }
  G.enemies.push({
    type, icon, size: t.size, boss: !!t.boss, x: WP[0].x, y: WP[0].y, wp: 1,
    hp: Math.round(hp), maxHp: Math.round(hp), speed: t.speed, reward: t.reward, dmg: t.dmg,
    armor, regen: t.regen || 0,
    slow: 0, stun: 0, burn: null, pStacks: 0, pT: 0, pDps: 0,
    flash: 0, dist: 0, dead: false, bob: Math.random() * 6,
  });
}

/* =====================================================
   الضرر والتأثيرات
   ===================================================== */
function damage(e, d, o) {
  if (e.dead) return;
  o = o || {};
  if (!o.dot && !o.magic && !o.pierce && e.armor > 0) d = Math.max(d - e.armor, d * 0.25);
  e.hp -= d;
  if (!o.dot) e.flash = 0.1;
  if (e.hp <= 0) killEnemy(e, o);
}

function killEnemy(e, o) {
  e.dead = true;
  const gain = Math.round(e.reward * coinMul());
  G.coins += gain; G.kills++; save.stats.kills++;
  if (e.boss) { G.bosses++; save.stats.bosses++; G.shake = 0.25; }
  if (o && o.tower) o.tower.kills++;
  addFx(e.x, e.y, `+${gain}`, '#ffd54a');
  sfx.kill(); checkAch();
}

function stun(e, d) { e.stun = Math.max(e.stun, e.boss ? d * 0.5 : d); }

function applyEffects(e, s) {
  if (e.dead) return;
  if (s.slow) e.slow = Math.max(e.slow, s.slow);
  if (s.freeze && Math.random() < s.freeze) stun(e, s.freezeDur);
  if (s.burn > 0) e.burn = { t: s.burnDur, dps: Math.max(s.burn, e.burn ? e.burn.dps : 0) };
  if (s.poison > 0) { e.pStacks = Math.min(8, e.pStacks + 1); e.pT = s.poisonDur; e.pDps = Math.max(e.pDps, s.poison); }
}

function hitEnemy(e, s, mult) {
  damage(e, s.dmg * mult, { magic: s.magic, pierce: s.pierce, tower: s.tower });
  applyEffects(e, s);
}

function impact(s, target, x, y) {
  if (s.splash) {
    G.rings.push({ x, y, max: s.splash, life: 0.3, total: 0.3, color: s.color });
    for (const e of G.enemies) {
      if (!e.dead && Math.hypot(e.x - x, e.y - y) <= s.splash) hitEnemy(e, s, e === target ? 1 : 0.7);
    }
  } else if (!target.dead) {
    hitEnemy(target, s, 1);
  }
  if (s.crit) addFx(x, y - 16, '💥', '#ff9a4a');
}

function chainStrike(t, first, s) {
  const pts = [{ x: t.x, y: t.y }], hit = new Set();
  let cur = first, d = s.dmg;
  for (let i = 0; i <= s.chain && cur; i++) {
    hit.add(cur); pts.push({ x: cur.x, y: cur.y });
    hitEnemy(cur, { ...s, dmg: d }, 1);
    let next = null, best = 95;
    for (const e of G.enemies) {
      if (e.dead || hit.has(e)) continue;
      const dd = Math.hypot(e.x - cur.x, e.y - cur.y);
      if (dd < best) { best = dd; next = e; }
    }
    cur = next; d *= 0.75;
  }
  G.bolts.push({ pts, life: 0.2, color: s.color });
}

function shoot(t, target) {
  const D = t.def;
  let dmg = effDmg(t), crit = false;
  if (Math.random() < (D.crit || 0) + G.mods.crit) { dmg *= 2.5; crit = true; }
  const s = {
    dmg, crit, splash: t.splash, slow: D.slow ? (D.slowDur || 2) : 0,
    freeze: D.freeze || 0, freezeDur: D.freezeDur || 1,
    burn: t.burn * G.mods.burn, burnDur: D.burnDur || 3,
    poison: t.poison * G.mods.poison, poisonDur: D.poisonDur || 4,
    magic: !!D.magic, pierce: !!D.pierce, chain: D.chain || 0, color: t.color, tower: t,
  };
  if (s.chain) { chainStrike(t, target, s); if (crit) addFx(target.x, target.y - 16, '💥', '#ff9a4a'); }
  else G.bullets.push({ x: t.x, y: t.y, target, tx: target.x, ty: target.y, s, r: t.splash ? 7 : 5 });
}

function addFx(x, y, text, color) { G.fx.push({ x, y, text, color, life: 0.9 }); }

/* =====================================================
   القدرات الخاصة
   ===================================================== */
function castSpell(id, x, y) {
  const S = SPELLS.find(s => s.id === id);
  if (G.spellCd[id] > 0) { toast(tr('t.cd')); sfx.error(); return false; }
  if (id === 'freeze') {
    if (!G.enemies.length) { toast(tr('t.noenemies')); return false; }
    for (const e of G.enemies) stun(e, 4);
    G.flash = { c: '120,220,255', t: 0.5, total: 0.5 };
    toast(tr('t.freeze'));
  } else if (id === 'fire') {
    if (!G.enemies.length) { toast(tr('t.noenemies')); return false; }
    for (const e of G.enemies) e.burn = { t: 5, dps: Math.max(e.maxHp * 0.06, 12) };
    G.flash = { c: '255,140,40', t: 0.5, total: 0.5 };
    toast(tr('t.fire'));
  } else if (id === 'meteor') {
    const dmg = 150 + G.wave * 45;
    G.rings.push({ x, y, max: 95, life: 0.45, total: 0.45, color: '#ff6a2a' });
    G.rings.push({ x, y, max: 60, life: 0.35, total: 0.35, color: '#ffd54a' });
    for (const e of G.enemies) {
      if (!e.dead && Math.hypot(e.x - x, e.y - y) <= 95) { damage(e, dmg, { magic: true }); stun(e, 1); }
    }
    addFx(x, y - 10, '☄️', '#fff'); G.shake = 0.3;
  } else if (id === 'gold') {
    G.goldT = 15; toast(tr('t.gold'));
  } else if (id === 'heal') {
    if (G.hp >= G.maxHp) { toast(tr('t.fullhp')); return false; }
    G.hp = Math.min(G.maxHp, G.hp + 5);
    addFx(WP[WP.length - 1].x, WP[WP.length - 1].y, '+5 ❤️', '#7be0a8');
  }
  G.spellCd[id] = S.cd * G.mods.spellCd;
  save.stats.spells++; sfx.spell(); checkAch();
  return true;
}

function useSpell(id) {
  if (!canPlay()) return;
  if (id === 'meteor') {
    if (G.spellCd.meteor > 0) { toast(tr('t.cd')); return; }
    G.targeting = G.targeting === 'meteor' ? null : 'meteor';
    if (G.targeting) toast(tr('t.meteor'));
  } else castSpell(id);
}

/* =====================================================
   المكافآت داخل الجولة
   ===================================================== */
function openPerks() {
  const pool = PERKS.filter(p => !p.cond || p.cond());
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  G.perkChoices = pool.slice(0, 3);
  ui.perkList.innerHTML = '';
  for (const p of G.perkChoices) {
    const b = document.createElement('button');
    b.className = 'perk';
    const [pn, pd] = lookup('p', p.id);
    b.innerHTML = `<span class="pi">${p.icon}</span><span><b>${pn}</b><small>${pd}</small></span>`;
    b.onclick = () => choosePerk(p);
    ui.perkList.appendChild(b);
  }
  G.paused = true; G.perkOpen = true; ui.perkOv.hidden = false;
}

function choosePerk(p) {
  p.fn();
  G.perkOpen = false; G.paused = false; ui.perkOv.hidden = true;
  sfx.upgrade(); toast(`${p.icon} ${lookup('p', p.id)[0]}`); refreshUI(true);
}

/* =====================================================
   التحديث
   ===================================================== */
function update(rawDt) {
  if (!G || G.state !== 'playing' || G.paused) return;
  const dt = rawDt * G.speed;
  G.time += dt;

  for (const id in G.spellCd) G.spellCd[id] = Math.max(0, G.spellCd[id] - dt);
  G.goldT = Math.max(0, G.goldT - dt);

  /* --- الموجات --- */
  if (G.queue.length) {
    G.spawnTimer -= dt;
    if (G.spawnTimer <= 0) { spawnEnemy(G.queue.shift()); G.spawnTimer = G.spawnGap; }
  } else if (G.enemies.length === 0) {
    if (!G.cleared && G.wave > 0) {
      G.cleared = true;
      const bonus = 20 + G.wave * 5;
      G.coins += bonus; G.countdown = 6;
      toast(tr('t.cleared', { n: bonus }));
      if (G.wave % 3 === 0) openPerks();
    }
    if (!G.paused) { G.countdown -= dt; if (G.countdown <= 0) startWave(); }
  }

  /* --- الأعداء --- */
  for (const e of G.enemies) {
    if (e.dead) continue;
    if (e.burn) {
      damage(e, e.burn.dps * dt, { dot: true });
      e.burn.t -= dt; if (e.burn.t <= 0) e.burn = null;
      if (e.dead) continue;
    }
    if (e.pStacks > 0) {
      damage(e, e.pDps * e.pStacks * dt, { dot: true });
      e.pT -= dt; if (e.pT <= 0) e.pStacks = 0;
      if (e.dead) continue;
    } else if (e.regen) {
      e.hp = Math.min(e.maxHp, e.hp + e.maxHp * e.regen * dt);
    }
    e.slow = Math.max(0, e.slow - dt);
    e.flash = Math.max(0, e.flash - dt);
    e.bob += dt * 8;
    if (e.stun > 0) { e.stun -= dt; continue; }

    const target = WP[e.wp];
    const dx = target.x - e.x, dy = target.y - e.y, d = Math.hypot(dx, dy);
    const step = e.speed * (e.slow > 0 ? 0.5 : 1) * dt;
    if (d <= step) { e.x = target.x; e.y = target.y; e.wp++; e.dist += d; }
    else { e.x += dx / d * step; e.y += dy / d * step; e.dist += step; }
    if (e.wp >= WP.length) {
      e.dead = true; G.hp -= e.dmg; G.shake = 0.3; sfx.hurt();
      addFx(WP[WP.length - 1].x, WP[WP.length - 1].y, `-${e.dmg} ❤️`, '#ff6b6b');
    }
  }

  /* --- تعزيز الطوطم --- */
  for (const t of G.towers) t.buff = 0;
  for (const a of G.towers) {
    if (!a.aura) continue;
    const r = effRange(a);
    for (const b of G.towers) if (b !== a && Math.hypot(a.x - b.x, a.y - b.y) <= r) b.buff = Math.min(1, b.buff + a.aura);
  }

  /* --- الأبراج --- */
  for (const t of G.towers) {
    if (t.income) {
      t.timer += dt;
      if (t.timer >= t.def.interval) {
        t.timer -= t.def.interval;
        const g = Math.round(t.income * coinMul());
        G.coins += g; addFx(t.x, t.y - 26, `+${g}`, '#ffd54a');
      }
    }
    if (t.dmg <= 0) continue;
    t.cd -= dt;
    if (t.cd > 0) continue;
    const range = effRange(t), strong = t.def.target === 'strong';
    let target = null;
    for (const e of G.enemies) {
      if (e.dead || Math.hypot(e.x - t.x, e.y - t.y) > range) continue;
      if (!target || (strong ? e.hp > target.hp : e.dist > target.dist)) target = e;
    }
    if (target) { shoot(t, target); t.cd = effRate(t); }
  }

  /* --- الرصاص --- */
  for (const b of G.bullets) {
    if (!b.target.dead) { b.tx = b.target.x; b.ty = b.target.y; }
    const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy), step = 440 * dt;
    if (d <= step) { impact(b.s, b.target, b.tx, b.ty); b.dead = true; }
    else { b.x += dx / d * step; b.y += dy / d * step; }
  }

  /* --- المؤثرات --- */
  for (const f of G.fx) { f.life -= dt; f.y -= 28 * dt; }
  for (const r of G.rings) r.life -= dt;
  for (const b of G.bolts) b.life -= dt;
  G.shake = Math.max(0, G.shake - dt);
  if (G.flash) { G.flash.t -= dt; if (G.flash.t <= 0) G.flash = null; }

  G.enemies = G.enemies.filter(e => !e.dead);
  G.bullets = G.bullets.filter(b => !b.dead);
  G.fx = G.fx.filter(f => f.life > 0);
  G.rings = G.rings.filter(r => r.life > 0);
  G.bolts = G.bolts.filter(b => b.life > 0);

  if (G.hp <= 0) endGame();
}

function endGame() {
  if (!G || G.state === 'over') return;
  G.state = 'over'; G.paused = false;
  const gems = G.wave * 2 + Math.floor(G.kills / 15) + G.bosses * 5;
  save.gems += gems; save.stats.runs++;
  if (G.wave > save.stats.bestWave) save.stats.bestWave = G.wave;
  checkAch(); persist();
  $('overSummary').innerHTML = tr('over.summary', { w: G.wave, k: G.kills });
  $('overGems').textContent = gems;
  $('overBest').textContent = save.stats.bestWave;
  ui.perkOv.hidden = true; ui.pauseOv.hidden = true; ui.overOv.hidden = false; ui.nextBtn.hidden = true;
  hideInfo();
}

/* =====================================================
   الرسم
   ===================================================== */
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function drawRange(x, y, r, color, solid) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.setLineDash(solid ? [] : [6, 5]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawMap() {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#7ed957' : '#74cf50';
      ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
    }
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass ? '#f0b27a' : '#c98a52';
    const pad = pass ? 0 : -3;
    for (let i = 0; i < PATH_CELLS.length - 1; i++) {
      const [c1, r1] = PATH_CELLS[i], [c2, r2] = PATH_CELLS[i + 1];
      const x = Math.min(c1, c2) * TILE, y = Math.min(r1, r2) * TILE;
      const w = (Math.abs(c2 - c1) + 1) * TILE, h = (Math.abs(r2 - r1) + 1) * TILE;
      ctx.fillRect(x - pad, y - pad, w + pad * 2, h + pad * 2);
    }
  }
  ctx.font = '46px serif'; ctx.fillStyle = '#000';
  for (const [c, r] of TREES) ctx.fillText('🌳', c * TILE + TILE / 2, r * TILE + TILE / 2 + 2);
  ctx.font = '52px serif';
  ctx.fillText('🏰', WP[WP.length - 1].x, WP[WP.length - 1].y);
}

function drawSlots() {
  const T = TOWER_TYPES[G.sel];
  for (const s of G.slots) {
    if (s.tower) continue;
    const x = s.c * TILE, y = s.r * TILE, hov = G.hover === s;
    ctx.fillStyle = hov ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.32)';
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    roundRect(x + 6, y + 6, TILE - 12, TILE - 12, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 34px sans-serif';
    ctx.fillText('+', x + TILE / 2, y + TILE / 2 + 2);
    if (hov && T && T.range && !G.drag) drawRange(x + TILE / 2, y + TILE / 2, T.range * G.mods.range, T.color);
  }
}

function drawTowers() {
  const pulse = 0.5 + 0.5 * Math.sin(G.time * 8 + performance.now() / 200);
  for (const t of G.towers) {
    ctx.fillStyle = t.plate;
    roundRect(t.x - 25, t.y - 25, 50, 50, 10); ctx.fill();
    ctx.strokeStyle = t.hybrid ? '#ffd54a' : 'rgba(255,255,255,.7)';
    ctx.lineWidth = t.hybrid ? 3 : 2; ctx.stroke();
    ctx.font = '30px serif'; ctx.fillStyle = '#000';
    ctx.fillText(t.icon, t.x, t.y - 3);
    ctx.fillStyle = '#ffd54a';
    for (let i = 0; i < t.level; i++) {
      ctx.beginPath(); ctx.arc(t.x - (t.level - 1) * 3.2 + i * 6.4, t.y + 19, 2.3, 0, 7); ctx.fill();
    }
    if (t.buff > 0) { ctx.font = '12px serif'; ctx.fillStyle = '#000'; ctx.fillText('✨', t.x + 20, t.y - 20); }
    if (G.selTower === t && t.def.range) drawRange(t.x, t.y, effRange(t), t.def.buff ? '#7be0a8' : '#ffffff', true);
  }
  // مؤشرات الدمج أثناء السحب
  if (G.drag && G.drag.moved) {
    const a = G.drag.tower;
    for (const b of G.towers) {
      if (b === a) continue;
      const info = mergeInfo(a, b);
      if (info.error) continue;
      ctx.strokeStyle = info.type === 'merge' ? '#7be0a8' : '#d8a8ff';
      ctx.lineWidth = 3 + pulse * 2;
      roundRect(b.x - 28, b.y - 28, 56, 56, 12); ctx.stroke();
      ctx.font = '18px serif'; ctx.fillStyle = '#000';
      ctx.fillText(info.type === 'merge' ? '⬆️' : TOWER_TYPES[info.result].icon, b.x, b.y - 36);
    }
    if (G.mouse) {
      ctx.globalAlpha = 0.85; ctx.font = '36px serif'; ctx.fillStyle = '#000';
      ctx.fillText(a.icon, G.mouse.x, G.mouse.y - 14); ctx.globalAlpha = 1;
    }
  }
}

function drawEnemies() {
  for (const e of G.enemies) {
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.ellipse(e.x, e.y + e.size * 0.45, e.size * 0.4, 6, 0, 0, 7); ctx.fill();
    if (e.stun > 0 || e.slow > 0) { ctx.fillStyle = 'rgba(120,220,255,.45)'; ctx.beginPath(); ctx.arc(e.x, e.y, e.size * 0.6, 0, 7); ctx.fill(); }
    if (e.burn) { ctx.fillStyle = 'rgba(255,120,30,.35)'; ctx.beginPath(); ctx.arc(e.x, e.y, e.size * 0.6, 0, 7); ctx.fill(); }
    ctx.font = e.size + 'px serif'; ctx.fillStyle = '#000';
    ctx.fillText(e.icon, e.x, e.y + (e.stun > 0 ? 0 : Math.sin(e.bob) * 2));
    if (e.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(e.x, e.y, e.size * 0.5, 0, 7); ctx.fill(); }
    const bw = e.size, bx = e.x - bw / 2, by = e.y - e.size * 0.75;
    ctx.fillStyle = '#400'; ctx.fillRect(bx, by, bw, 5);
    ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#4cc26a' : '#e5484d';
    ctx.fillRect(bx, by, bw * Math.max(0, e.hp / e.maxHp), 5);
    let st = '';
    if (e.stun > 0) st += '❄️'; if (e.burn) st += '🔥'; if (e.pStacks > 0) st += '☠️';
    if (st) { ctx.font = '12px serif'; ctx.fillStyle = '#000'; ctx.fillText(st, e.x, by - 8); }
  }
}

function drawEffects() {
  for (const b of G.bullets) {
    ctx.fillStyle = b.s.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  for (const b of G.bolts) {
    ctx.strokeStyle = b.color; ctx.lineWidth = 3; ctx.globalAlpha = Math.min(1, b.life * 6);
    ctx.shadowColor = b.color; ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 1; i < b.pts.length; i++) {
      const q = b.pts[i - 1], p = b.pts[i], n = 4;
      if (i === 1) ctx.moveTo(q.x, q.y);
      for (let k = 1; k <= n; k++) {
        const f = k / n, j = k < n ? (Math.random() - 0.5) * 14 : 0;
        ctx.lineTo(q.x + (p.x - q.x) * f + j, q.y + (p.y - q.y) * f + j);
      }
    }
    ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
  for (const r of G.rings) {
    const p = 1 - r.life / r.total;
    ctx.strokeStyle = r.color; ctx.globalAlpha = 1 - p; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.max * p, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.font = 'bold 16px sans-serif';
  for (const f of (settings.floating ? G.fx : [])) {
    ctx.globalAlpha = Math.min(1, f.life * 2);
    ctx.fillStyle = '#000'; ctx.fillText(f.text, f.x + 1, f.y + 1);
    ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
  if (G.targeting === 'meteor' && G.mouse) {
    ctx.save(); ctx.strokeStyle = '#ff5a3a'; ctx.fillStyle = 'rgba(255,90,58,.2)'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.arc(G.mouse.x, G.mouse.y, 95, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.font = '28px serif'; ctx.fillStyle = '#000'; ctx.fillText('☄️', G.mouse.x, G.mouse.y);
  }
  if (G.flash) {
    ctx.fillStyle = `rgba(${G.flash.c},${0.35 * G.flash.t / G.flash.total})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (G && G.shake > 0 && settings.shake) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  drawMap();
  if (G) { drawSlots(); drawTowers(); drawEnemies(); drawEffects(); }
  ctx.restore();
}

/* =====================================================
   الواجهة
   ===================================================== */
function setHTML(el, html) { if (el._h !== html) { el._h = html; el.innerHTML = html; } }

function buildTowerBar() {
  ui.towerBar.innerHTML = '';
  G.barKeys = Object.keys(TOWER_TYPES).filter(k => !TOWER_TYPES[k].hybrid && save.unlocked[k]);
  G.barKeys.forEach((key, i) => {
    const t = TOWER_TYPES[key], b = document.createElement('button');
    b.className = 'tower-btn'; b.dataset.key = key;
    b.innerHTML = `<span class="ic">${t.icon}</span><span class="nm">${tName(key)}</span><span class="co">🪙 ${t.cost}</span>`;
    b.title = `[${i + 1}] ${tName(key)}: ${tDesc(key)}`;
    b.onclick = () => selectType(key);
    ui.towerBar.appendChild(b);
  });
}

function buildSpellBar() {
  ui.spells.innerHTML = '';
  for (const s of SPELLS) {
    const b = document.createElement('button');
    b.className = 'spell-btn'; b.dataset.id = s.id;
    b.title = `${lookup('sp', s.id)} [${s.key.toUpperCase()}]`;
    b.textContent = s.icon;
    const cd = document.createElement('span'); cd.className = 'cd';
    b.appendChild(cd); b._cd = cd;
    b.onclick = () => useSpell(s.id);
    ui.spells.appendChild(b);
  }
}

function selectType(key) { if (!G) return; G.sel = key; G.selTower = null; hideInfo(); }

let lastUI = { hp: -1, coins: -1, wave: -1 };
function refreshUI(force) {
  if (!G) return;
  if (force || lastUI.hp !== G.hp) ui.hp.textContent = Math.max(0, Math.ceil(G.hp));
  if (force || lastUI.coins !== G.coins) ui.coins.textContent = G.coins;
  if (force || lastUI.wave !== G.wave) ui.wave.textContent = G.wave;
  lastUI = { hp: G.hp, coins: G.coins, wave: G.wave };
  ui.coinStat.classList.toggle('boost', G.goldT > 0);

  for (const b of ui.towerBar.children) {
    const t = TOWER_TYPES[b.dataset.key];
    b.classList.toggle('active', !G.selTower && G.sel === b.dataset.key);
    b.classList.toggle('poor', G.coins < t.cost);
  }
  for (const b of ui.spells.children) {
    const cd = G.spellCd[b.dataset.id];
    b._cd.textContent = cd > 0 ? Math.ceil(cd) : '';
    b.classList.toggle('cooling', cd > 0);
    b.classList.toggle('armed', G.targeting === b.dataset.id);
  }

  const waiting = G.state === 'playing' && !G.paused && G.queue.length === 0 && G.enemies.length === 0;
  ui.nextBtn.hidden = !waiting;
  if (waiting) ui.nextBtn.textContent = tr('next', { n: G.wave + 1, s: Math.max(0, Math.ceil(G.countdown)) });

  if (G.selTower) {
    const t = G.selTower, D = t.def;
    ui.infoIcon.textContent = t.icon;
    ui.infoName.textContent = tName(t.key) + (t.hybrid ? ' ' + tr('i.hybrid') : '');
    ui.infoLv.textContent = tr('i.level', { n: t.level });
    const c = [];
    if (t.dmg > 0) {
      c.push(`⚔️ ${Math.round(effDmg(t))}`, `🎯 ${Math.round(effRange(t))}`, `⏱ ${(1 / effRate(t)).toFixed(1)}${tr('c.ps')}`);
      if (t.splash) c.push('💥 ' + tr('c.splash'));
      if (D.chain) c.push('⚡ ' + tr('c.chain', { n: D.chain }));
      if (D.slow) c.push('🧊 ' + tr('c.slow'));
      if (D.freeze) c.push('❄️ ' + tr('c.freeze', { n: Math.round(D.freeze * 100) }));
      if (t.burn) c.push('🔥 ' + tr('c.burn', { n: Math.round(t.burn * G.mods.burn) }));
      if (t.poison) c.push('☠️ ' + tr('c.poison', { n: Math.round(t.poison * G.mods.poison) }));
      if (D.magic) c.push('🔮 ' + tr('c.magic'));
      if (D.pierce) c.push('🗡️ ' + tr('c.pierce'));
      if (D.crit) c.push('💥 ' + tr('c.crit', { n: Math.round((D.crit + G.mods.crit) * 100) }));
      if (D.target === 'strong') c.push('🎯 ' + tr('c.strong'));
    }
    if (t.income) c.push(`💰 ${Math.round(t.income * coinMul())} ` + tr('c.every', { n: D.interval }));
    if (t.aura) c.push('🗿 ' + tr('c.aura', { n: Math.round(t.aura * 100), r: Math.round(effRange(t)) }));
    if (t.buff > 0) c.push('✨ ' + tr('c.buffed', { n: Math.round(t.buff * 100) }));
    c.push('☠ ' + tr('c.kills', { n: t.kills }));
    setHTML(ui.infoStats, c.map(x => `<span>${x}</span>`).join(''));
    const cost = upgradeCost(t);
    if (t.level >= MAX_LEVEL) { ui.btnUpgrade.textContent = tr('i.maxlv'); ui.btnUpgrade.disabled = true; }
    else { ui.btnUpgrade.textContent = tr('i.upgrade', { c: cost }); ui.btnUpgrade.disabled = G.coins < cost; }
    ui.btnSell.textContent = tr('i.sell', { c: sellValue(t) });
  }
}

function showInfo(t) { G.selTower = t; ui.info.hidden = false; refreshUI(true); }
function hideInfo() { if (G) G.selTower = null; ui.info.hidden = true; }

let toastTimer = null;
function toast(msg) {
  ui.toast.textContent = msg; ui.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 1700);
}

/* =====================================================
   البناء والتطوير والبيع
   ===================================================== */
function buildTower(slot) {
  const T = TOWER_TYPES[G.sel];
  if (G.coins < T.cost) { toast(tr('t.nocoins')); sfx.error(); return; }
  G.coins -= T.cost;
  const t = makeTower(G.sel, slot);
  slot.tower = t; G.towers.push(t);
  sfx.build();
}

function upgradeTower() {
  const t = G && G.selTower;
  if (!t || t.level >= MAX_LEVEL) return;
  const cost = upgradeCost(t);
  if (G.coins < cost) { toast(tr('t.nocoins')); sfx.error(); return; }
  G.coins -= cost; t.spent += cost; t.level++; recalc(t);
  G.rings.push({ x: t.x, y: t.y, max: 45, life: 0.35, total: 0.35, color: '#ffd54a' });
  sfx.upgrade(); refreshUI(true);
}

function sellTower() {
  const t = G && G.selTower;
  if (!t) return;
  G.coins += sellValue(t);
  removeTower(t); sfx.sell(); refreshUI(true);
}

/* =====================================================
   المتجر (ترقيات • أبراج • دليل الدمج • إنجازات)
   ===================================================== */
let hubTab = 'up';
const HUB_TABS = [['up', '⬆️', 'hub.up'], ['tw', '🗼', 'hub.tw'], ['fu', '🧬', 'hub.fu'], ['ac', '🏆', 'hub.ac']];

function openHub() { ui.hub.hidden = false; renderHub(); }
function closeHub() { ui.hub.hidden = true; $('menuBest').textContent = save.stats.bestWave; $('menuGems').textContent = save.gems; }

function renderHub() {
  ui.hubGems.textContent = save.gems;
  ui.hubTabs.innerHTML = HUB_TABS.map(([k, ic, key]) => `<button class="tab ${k === hubTab ? 'on' : ''}" data-tab="${k}">${ic} ${tr(key)}</button>`).join('');
  let h = '';
  if (hubTab === 'up') {
    for (const [k, m] of Object.entries(META)) {
      const l = upLvl(k), maxed = l >= m.max, cost = m.cost(l), [nm, ds] = lookup('m', k);
      h += `<div class="row ${maxed ? 'done' : ''}"><span class="ri">${m.icon}</span>
        <div class="rt"><b>${nm}</b><small>${l}/${m.max}</small><p>${ds}</p></div>
        ${maxed ? '✅' : `<button class="btn gold sm" data-up="${k}" ${save.gems < cost ? 'disabled' : ''}>💎 ${cost}</button>`}</div>`;
    }
  } else if (hubTab === 'tw') {
    for (const [k, t] of Object.entries(TOWER_TYPES)) {
      if (t.hybrid) continue;
      const open = save.unlocked[k], [nm, ds] = lookup('tw', k);
      h += `<div class="row ${open ? 'done' : ''}"><span class="ri">${t.icon}</span>
        <div class="rt"><b>${nm}</b><small>🪙 ${t.cost}</small><p>${ds}</p></div>
        ${open ? '✅' : `<button class="btn gold sm" data-unlock="${k}" ${save.gems < t.unlock ? 'disabled' : ''}>💎 ${t.unlock}</button>`}</div>`;
    }
  } else if (hubTab === 'fu') {
    h += `<p class="note">${tr('hub.note')}</p>`;
    for (const [k, t] of Object.entries(TOWER_TYPES)) {
      if (!t.hybrid) continue;
      const [a, b] = t.recipe.map(x => TOWER_TYPES[x]), [nm, ds] = lookup('tw', k);
      h += `<div class="row"><span class="recipe">${a.icon}+${b.icon}</span>
        <div class="rt"><b>${t.icon} ${nm}</b><p>${ds}</p></div></div>`;
    }
  } else {
    for (const a of ACH) {
      const v = Math.min(save.stats[a.stat], a.goal), done = save.ach[a.id], [nm, ds] = lookup('a', a.id);
      h += `<div class="row ${done ? 'done' : ''}"><span class="ri">${a.icon}</span>
        <div class="rt"><b>${nm}</b><small>${v}/${a.goal}</small><p>${ds} — 💎 ${a.gems}</p>
        <div class="bar"><i style="width:${v / a.goal * 100}%"></i></div></div>${done ? '✅' : ''}</div>`;
    }
  }
  ui.hubBody.innerHTML = h;
}

ui.hubTabs.onclick = e => { const b = e.target.closest('.tab'); if (b) { hubTab = b.dataset.tab; renderHub(); } };
ui.hubBody.onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.up) {
    const k = b.dataset.up, m = META[k], l = upLvl(k), cost = m.cost(l);
    if (l < m.max && save.gems >= cost) { save.gems -= cost; save.up[k] = l + 1; persist(); beep(700, .1); }
  } else if (b.dataset.unlock) {
    const k = b.dataset.unlock, t = TOWER_TYPES[k];
    if (!save.unlocked[k] && save.gems >= t.unlock) { save.gems -= t.unlock; save.unlocked[k] = 1; persist(); sfx.upgrade(); }
  }
  renderHub();
};
$('btnHub').onclick = openHub;
$('btnHub2').onclick = openHub;
$('hubClose').onclick = closeHub;

/* =====================================================
   التحكم
   ===================================================== */
function pt(ev) {
  const r = canvas.getBoundingClientRect();
  return { x: (ev.clientX - r.left) * W / r.width, y: (ev.clientY - r.top) * H / r.height };
}
const slotAt = p => G && G.slots.find(s => s.c === Math.floor(p.x / TILE) && s.r === Math.floor(p.y / TILE));

canvas.addEventListener('pointerdown', ev => {
  if (!canPlay()) return;
  const p = pt(ev); G.mouse = p;
  if (G.targeting) { const id = G.targeting; G.targeting = null; castSpell(id, p.x, p.y); refreshUI(true); return; }
  const s = slotAt(p);
  if (!s) { hideInfo(); return; }
  if (s.tower) {
    G.drag = { tower: s.tower, sx: p.x, sy: p.y, moved: false };
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    return;
  }
  hideInfo(); buildTower(s); refreshUI(true);
});
canvas.addEventListener('pointermove', ev => {
  if (!G) return;
  const p = pt(ev); G.mouse = p; G.hover = slotAt(p) || null;
  if (G.drag && !G.drag.moved && Math.hypot(p.x - G.drag.sx, p.y - G.drag.sy) > 12) G.drag.moved = true;
});
canvas.addEventListener('pointerup', ev => {
  if (!G || !G.drag) return;
  const d = G.drag; G.drag = null;
  if (!d.moved) { showInfo(d.tower); return; }
  const s = slotAt(pt(ev));
  if (s && s.tower && s.tower !== d.tower) tryMerge(d.tower, s.tower);
});
canvas.addEventListener('pointercancel', () => { if (G) G.drag = null; });
canvas.addEventListener('pointerleave', () => { if (G && !G.drag) G.hover = null; });

ui.btnUpgrade.onclick = upgradeTower;
ui.btnSell.onclick = sellTower;
$('infoClose').onclick = hideInfo;
ui.nextBtn.onclick = () => { if (G) G.countdown = 0; };

ui.btnSpeed.onclick = () => {
  if (!G) return;
  G.speed = G.speed === 1 ? 2 : G.speed === 2 ? 3 : 1;
  ui.btnSpeed.textContent = `⏩ ×${G.speed}`;
};
ui.btnSound.onclick = () => { settings.sound = !settings.sound; saveSettings(); syncSettingsUI(); };

function setPause(p) {
  if (!G || G.state !== 'playing' || G.perkOpen) return;
  G.paused = p; ui.pauseOv.hidden = !p; refreshUI(true);
}
ui.btnPause.onclick = () => setPause(true);
$('btnResume').onclick = () => setPause(false);
$('btnQuit').onclick = () => { G.paused = false; ui.pauseOv.hidden = true; endGame(); };

function startGame() {
  ui.menu.hidden = true; ui.overOv.hidden = true; ui.pauseOv.hidden = true; ui.perkOv.hidden = true; ui.hub.hidden = true;
  $('settingsOv').hidden = true; $('howtoOv').hidden = true;
  ui.btnSpeed.textContent = '⏩ ×1';
  newGame(); beep(440, .1);
}
$('btnStart').onclick = startGame;
$('btnRestart').onclick = startGame;

document.addEventListener('keydown', e => {
  if (!G || G.state !== 'playing') return;
  if (e.code === 'Space') { e.preventDefault(); setPause(!G.paused); return; }
  if (!canPlay()) return;
  const k = e.key.toLowerCase();
  const n = +e.key;
  if (n >= 1 && n <= G.barKeys.length) selectType(G.barKeys[n - 1]);
  else if (k === 'u') upgradeTower();
  else if (k === 'escape') { G.targeting = null; hideInfo(); }
  else { const s = SPELLS.find(s => s.key === k); if (s) useSpell(s.id); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) setPause(true); });

/* =====================================================
   حلقة اللعبة
   ===================================================== */
let lastT = 0;
function loop(now) {
  const dt = Math.min((now - (lastT || now)) / 1000, 0.05);
  lastT = now;
  update(dt); draw(); refreshUI();
  requestAnimationFrame(loop);
}

/* =====================================================
   الإعدادات واللغة والقائمة الرئيسية
   ===================================================== */
function updateMenuStats() {
  $('menuBest').textContent = save.stats.bestWave;
  $('menuGems').textContent = save.gems;
}

function syncSettingsUI() {
  $('setSound').checked = settings.sound;
  $('setVolume').value = settings.volume;
  $('setShake').checked = settings.shake;
  $('setFloat').checked = settings.floating;
  ui.btnSound.textContent = settings.sound ? '🔊' : '🔇';
}

function renderLangButtons() {
  for (const [box, compact] of [[$('langGrid'), false], [$('homeLang'), true]]) {
    box.innerHTML = '';
    for (const l of LANGS) {
      const b = document.createElement('button');
      b.className = 'lang-btn' + (l.code === LANG ? ' on' : '');
      b.innerHTML = compact ? l.flag : `${l.flag}<span>${l.name}</span>`;
      b.title = l.name;
      b.onclick = () => changeLang(l.code);
      box.appendChild(b);
    }
  }
}

function relocalize() {
  applyI18n();
  renderLangButtons();
  ui.infoStats._h = null;
  if (G) { buildTowerBar(); buildSpellBar(); refreshUI(true); }
  if (!ui.hub.hidden) renderHub();
  updateMenuStats();
}

function changeLang(code) {
  settings.lang = code; saveSettings();
  setLang(code); relocalize();
}

function goMenu() {
  if (G && G.state === 'playing') endGame();
  ui.overOv.hidden = true; ui.pauseOv.hidden = true; ui.perkOv.hidden = true;
  ui.menu.hidden = false; updateMenuStats();
}

$('btnSettings').onclick = () => { syncSettingsUI(); $('settingsOv').hidden = false; };
$('btnSettingsPause').onclick = () => { syncSettingsUI(); $('settingsOv').hidden = false; };
$('setClose').onclick = () => { $('settingsOv').hidden = true; };
$('btnHowto').onclick = () => { $('howtoOv').hidden = false; };
$('howtoClose').onclick = () => { $('howtoOv').hidden = true; };
$('btnMenuOver').onclick = goMenu;
$('setSound').onchange = e => { settings.sound = e.target.checked; saveSettings(); syncSettingsUI(); };
$('setVolume').oninput = e => { settings.volume = +e.target.value; saveSettings(); };
$('setVolume').onchange = () => beep(660, .1);
$('setShake').onchange = e => { settings.shake = e.target.checked; saveSettings(); };
$('setFloat').onchange = e => { settings.floating = e.target.checked; saveSettings(); };
$('btnReset').onclick = () => {
  if (!confirm(tr('set.confirm'))) return;
  try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem('td_best'); } catch (e) {}
  save = loadSave(); persist();
  updateMenuStats(); if (!ui.hub.hidden) renderHub();
  toast(tr('set.done'));
};

/* ---------- البدء ---------- */
setLang(settings.lang);
renderLangButtons();
syncSettingsUI();
updateMenuStats();
draw();
requestAnimationFrame(loop);
