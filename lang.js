'use strict';
/* =====================================================
   الترجمة — أضف لغة جديدة بنسخ كتلة إحدى اللغات أدناه
   وإضافة سطر لها في LANGS. أي نص ناقص يُعرض بالإنجليزية.
   ===================================================== */
/* أعلام SVG مدمجة (إيموجي الأعلام لا يظهر في ويندوز/Chrome) */
const FLAG = (body) => `<svg class="flag" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
const FLAGS = {
  ar: FLAG('<rect width="60" height="40" fill="#006C35"/><rect x="14" y="10" width="32" height="3.5" rx="1.5" fill="#fff"/><rect x="18" y="16" width="24" height="3" rx="1.5" fill="#fff"/><rect x="11" y="27" width="38" height="2.6" rx="1.3" fill="#fff"/><rect x="11" y="26" width="6" height="4.6" rx="1" fill="#fff"/>'),
  en: FLAG('<rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="12"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="7"/>'),
  fr: FLAG('<rect width="20" height="40" fill="#0055A4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#EF4135"/>'),
  es: FLAG('<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/>'),
  tr: FLAG('<rect width="60" height="40" fill="#E30A17"/><circle cx="22" cy="20" r="10" fill="#fff"/><circle cx="25" cy="20" r="8" fill="#E30A17"/><polygon points="38,15 39.2,18.4 42.8,18.5 40,20.7 41,24.1 38,22.1 35,24.1 36,20.7 33.2,18.5 36.8,18.4" fill="#fff"/>'),
};

const LANGS = [
  { code: 'ar', flag: FLAGS.ar, name: 'العربية',  dir: 'rtl' },
  { code: 'en', flag: FLAGS.en, name: 'English',  dir: 'ltr' },
  { code: 'fr', flag: FLAGS.fr, name: 'Français', dir: 'ltr' },
  { code: 'es', flag: FLAGS.es, name: 'Español',  dir: 'ltr' },
  { code: 'tr', flag: FLAGS.tr, name: 'Türkçe',   dir: 'ltr' },
];

const I18N = {

/* ===================== العربية ===================== */
ar: {
  ui: {
    'app.title': 'دفاع الأبراج', 'menu.sub': 'أوقف جيش الوحوش قبل أن يصل إلى برجك!',
    'menu.play': 'ابدأ اللعب', 'menu.shop': 'المتجر والترقيات', 'menu.settings': 'الإعدادات', 'menu.howto': 'طريقة اللعب', 'menu.best': 'أفضل موجة',
    'how.title': 'طريقة اللعب',
    'how.1': 'اختر برجاً من الشريط السفلي وانقر على مربع <b>+</b>',
    'how.2': 'اسحب برجاً فوق برج مماثل لدمجهما، أو فوق برج مختلف لصنع برج هجين',
    'how.3': 'استخدم القدرات الخاصة على الجانب: تجميد ❄️ حريق 🔥 نيزك ☄️',
    'how.4': 'كل 3 موجات تختار مكافأة تدعمك حتى نهاية الجولة',
    'how.5': 'اجمع 💎 من كل جولة لتطوير قدراتك وفتح أبراج جديدة',
    'ok': 'حسناً',
    'set.title': 'الإعدادات', 'set.lang': 'اللغة', 'set.sound': 'الصوت', 'set.volume': 'مستوى الصوت', 'set.shake': 'اهتزاز الشاشة', 'set.floating': 'الأرقام العائمة',
    'set.reset': 'مسح التقدم', 'set.confirm': 'هل تريد حذف كل تقدمك (الجواهر والترقيات والإنجازات)؟', 'set.done': 'تم مسح التقدم',
    'hud.hp': 'صحة البرج', 'hud.coins': 'العملات', 'hud.wave': 'الموجة',
    'pause.title': 'إيقاف مؤقت', 'pause.resume': 'متابعة', 'pause.quit': 'إنهاء الجولة', 'pause.settings': 'الإعدادات',
    'over.title': 'انتهت الجولة', 'over.summary': 'وصلت إلى الموجة <b>{w}</b> • قتلت <b>{k}</b> وحشاً', 'over.best': 'أفضل موجة',
    'over.again': 'العب من جديد', 'over.shop': 'المتجر', 'over.menu': 'القائمة الرئيسية',
    'perk.title': 'اختر مكافأة', 'perk.sub': 'تبقى فعّالة حتى نهاية الجولة',
    'hub.title': 'المتجر', 'hub.up': 'ترقيات', 'hub.tw': 'الأبراج', 'hub.fu': 'الدمج', 'hub.ac': 'إنجازات',
    'hub.note': '🔹 برجان من <b>نفس النوع والمستوى</b> ← برج أقوى بمستوى أعلى (+10% قوة).<br>🔹 برجان <b>مختلفان</b> (مستوى 2+) ← برج هجين بقدرات جديدة.<br>اسحب برجاً فوق آخر داخل اللعبة لدمجهما.',
    'next': '⏭ ابدأ الموجة {n} ({s})',
    'i.hybrid': '(هجين)', 'i.level': 'مستوى {n}', 'i.hint': '💡 اسحب البرج فوق برج آخر لدمجهما', 'i.upgrade': '⬆ تطوير 🪙 {c}', 'i.maxlv': 'أقصى مستوى ⭐', 'i.sell': 'بيع 🪙 {c}',
    'c.splash': 'انفجار', 'c.chain': 'سلسلة {n}', 'c.slow': 'إبطاء', 'c.freeze': 'تجميد {n}%', 'c.burn': 'حرق {n}/ث', 'c.poison': 'سم {n}/ث', 'c.magic': 'سحري',
    'c.pierce': 'يخترق الدروع', 'c.crit': 'حرجة {n}%', 'c.strong': 'يستهدف الأقوى', 'c.aura': 'يعزز +{n}% (مدى {r})', 'c.buffed': 'معزَّز +{n}%', 'c.kills': 'قتل {n}', 'c.ps': '/ث', 'c.every': 'كل {n}ث',
    't.wave': '🌊 الموجة {n}', 't.boss': '⚠️ الموجة {n} — زعيم قادم!', 't.cleared': '✅ تم صد الموجة! +{n} 🪙', 't.nocoins': '🪙 عملات غير كافية',
    't.cd': '⏳ القدرة قيد الانتظار', 't.noenemies': 'لا يوجد أعداء', 't.fullhp': '❤️ الصحة كاملة', 't.freeze': '❄️ تم تجميد الجميع!', 't.fire': '🔥 اشتعل الجميع!',
    't.gold': '💰 عملات مضاعفة لمدة 15 ثانية!', 't.meteor': '☄️ انقر على موقع النيزك',
    't.mergeLvl': 'يجب أن يكون للبرجين المستوى نفسه', 't.mergeMax': 'وصل البرج لأقصى مستوى', 't.mergeNone': 'لا توجد وصفة دمج لهذين البرجين (راجع المتجر ← الدمج)',
    't.mergeLv2': 'ارفع كلا البرجين إلى المستوى 2 على الأقل', 't.fused': '✨ برج هجين جديد: {name}', 't.ach': '🏆 {name}! +{g} 💎',
    'fx.level': '⬆ مستوى {n}',
  },
  tw: {
    archer: ['رامي', 'سريع ودقيق مع فرصة ضربة حرجة'], mage: ['ساحر', 'انفجار سحري يتجاوز الدروع'], ice: ['جليد', 'يبطئ الأعداء وقد يجمّدهم'], cannon: ['مدفع', 'ضرر ثقيل على المجموعات'],
    fire: ['نار', 'لهب سريع يحرق الأعداء'], poison: ['سم', 'سم متراكم يتجاوز الدروع ويوقف التجدد'], lightning: ['صاعقة', 'برق يقفز بين عدة أعداء'],
    sniper: ['قناص', 'مدى هائل، يستهدف الأقوى ويخترق الدروع'], bank: ['بنك', 'ينتج عملات باستمرار'], totem: ['طوطم', 'يزيد ضرر الأبراج القريبة'],
    flamearrow: ['سهم ناري', 'سهام تحرق الهدف'], froststorm: ['عاصفة جليدية', 'صواعق تجمّد وتقفز'], volcano: ['بركان', 'انفجارات هائلة تحرق المنطقة'],
    plague: ['طاعون', 'سم سحري ينتشر في المنطقة'], thundergod: ['رعد الآلهة', 'صاعقة هائلة تضرب الأقوى وتقفز'], frostsniper: ['قناص الجليد', 'يجمّد الأقوى غالباً'],
    toxiccloud: ['سحابة سامة', 'حرق وسم معاً'], arcane: ['نبال سحرية', 'سهام سحرية تتجاوز الدروع'], temple: ['معبد الذهب', 'دخل ضخم + تعزيز للأبراج'],
  },
  sp: { freeze: 'تجميد شامل', fire: 'حريق شامل', meteor: 'نيزك', gold: 'ثروة مضاعفة', heal: 'ترميم البرج' },
  p: {
    dmg: ['سلاح حاد', '+15% ضرر جميع الأبراج'], range: ['منظار', '+12% مدى جميع الأبراج'], speed: ['تسارع', '+12% سرعة الهجوم'], coin: ['جشع', '+25% عملات القتل'],
    spell: ['سحر متدفق', '-20% وقت انتظار القدرات'], crit: ['ضربات قاضية', '+8% فرصة ضربة حرجة'], burn: ['جحيم', '+50% ضرر الحرق'], poison: ['سم قاتل', '+50% ضرر السم'],
    hp: ['ترميم', '+5 صحة قصوى مع علاج'], gold: ['كنز', '+100 عملة فوراً'], free: ['ترقية مجانية', 'يرتقي برج عشوائي مستوى'],
  },
  m: {
    startCoins: ['عملات البداية', '+25 عملة في بداية كل جولة'], baseHp: ['صحة البرج', '+2 صحة قصوى'], damage: ['قوة الأبراج', '+4% ضرر جميع الأبراج'],
    coin: ['غنائم أكبر', '+5% عملات القتل'], spell: ['سحر أسرع', '-4% وقت انتظار القدرات'], sell: ['سعر البيع', '+3% استرجاع عند البيع'], merge: ['قوة الدمج', '+3% قوة إضافية لكل دمج'],
  },
  a: {
    k100: ['صائد الوحوش', 'اقتل 100 وحش'], k1000: ['سفّاح', 'اقتل 1000 وحش'], w10: ['صامد', 'صِل إلى الموجة 10'], w20: ['أسطورة', 'صِل إلى الموجة 20'], b5: ['قاتل الزعماء', 'اهزم 5 زعماء'],
    m20: ['مهندس الدمج', 'نفّذ 20 عملية دمج'], f5: ['كيميائي', 'اصنع 5 أبراج هجينة'], s30: ['ساحر', 'استخدم القدرات 30 مرة'], r10: ['مثابر', 'العب 10 جولات'],
  },
},

/* ===================== English ===================== */
en: {
  ui: {
    'app.title': 'Tower Defense', 'menu.sub': 'Stop the monster army before it reaches your tower!',
    'menu.play': 'Play', 'menu.shop': 'Shop & Upgrades', 'menu.settings': 'Settings', 'menu.howto': 'How to play', 'menu.best': 'Best wave',
    'how.title': 'How to play',
    'how.1': 'Pick a tower from the bottom bar and tap a <b>+</b> tile',
    'how.2': 'Drag a tower onto an identical one to merge, or onto a different one to create a hybrid',
    'how.3': 'Use the special abilities on the side: Freeze ❄️ Fire 🔥 Meteor ☄️',
    'how.4': 'Every 3 waves you choose a perk that lasts until the run ends',
    'how.5': 'Earn 💎 each run to upgrade your power and unlock new towers',
    'ok': 'Got it',
    'set.title': 'Settings', 'set.lang': 'Language', 'set.sound': 'Sound', 'set.volume': 'Volume', 'set.shake': 'Screen shake', 'set.floating': 'Floating numbers',
    'set.reset': 'Reset progress', 'set.confirm': 'Delete all your progress (gems, upgrades, achievements)?', 'set.done': 'Progress reset',
    'hud.hp': 'Tower health', 'hud.coins': 'Coins', 'hud.wave': 'Wave',
    'pause.title': 'Paused', 'pause.resume': 'Resume', 'pause.quit': 'End run', 'pause.settings': 'Settings',
    'over.title': 'Run over', 'over.summary': 'You reached wave <b>{w}</b> • defeated <b>{k}</b> monsters', 'over.best': 'Best wave',
    'over.again': 'Play again', 'over.shop': 'Shop', 'over.menu': 'Main menu',
    'perk.title': 'Choose a perk', 'perk.sub': 'Lasts until the end of the run',
    'hub.title': 'Shop', 'hub.up': 'Upgrades', 'hub.tw': 'Towers', 'hub.fu': 'Fusion', 'hub.ac': 'Goals',
    'hub.note': '🔹 Two towers of the <b>same type and level</b> → a stronger tower, one level higher (+10% power).<br>🔹 Two <b>different</b> towers (level 2+) → a hybrid tower with new abilities.<br>Drag one tower onto another in-game to merge them.',
    'next': '⏭ Start wave {n} ({s})',
    'i.hybrid': '(hybrid)', 'i.level': 'Level {n}', 'i.hint': '💡 Drag this tower onto another to merge', 'i.upgrade': '⬆ Upgrade 🪙 {c}', 'i.maxlv': 'Max level ⭐', 'i.sell': 'Sell 🪙 {c}',
    'c.splash': 'Splash', 'c.chain': 'Chain {n}', 'c.slow': 'Slows', 'c.freeze': 'Freeze {n}%', 'c.burn': 'Burn {n}/s', 'c.poison': 'Poison {n}/s', 'c.magic': 'Magic',
    'c.pierce': 'Pierces armor', 'c.crit': 'Crit {n}%', 'c.strong': 'Targets strongest', 'c.aura': 'Buffs +{n}% (range {r})', 'c.buffed': 'Buffed +{n}%', 'c.kills': 'Kills {n}', 'c.ps': '/s', 'c.every': 'every {n}s',
    't.wave': '🌊 Wave {n}', 't.boss': '⚠️ Wave {n} — boss incoming!', 't.cleared': '✅ Wave cleared! +{n} 🪙', 't.nocoins': '🪙 Not enough coins',
    't.cd': '⏳ Ability on cooldown', 't.noenemies': 'No enemies', 't.fullhp': '❤️ Health is full', 't.freeze': '❄️ Everyone is frozen!', 't.fire': '🔥 Everyone is burning!',
    't.gold': '💰 Double coins for 15 seconds!', 't.meteor': '☄️ Tap where the meteor should land',
    't.mergeLvl': 'Both towers must be the same level', 't.mergeMax': 'Tower is already max level', 't.mergeNone': 'No fusion recipe for these towers (see Shop → Fusion)',
    't.mergeLv2': 'Raise both towers to level 2 or higher', 't.fused': '✨ New hybrid tower: {name}', 't.ach': '🏆 {name}! +{g} 💎',
    'fx.level': '⬆ Level {n}',
  },
  tw: {
    archer: ['Archer', 'Fast and precise with a chance to crit'], mage: ['Mage', 'Magic blast that ignores armor'], ice: ['Ice', 'Slows enemies and may freeze them'], cannon: ['Cannon', 'Heavy damage against groups'],
    fire: ['Fire', 'Rapid flames that burn enemies'], poison: ['Poison', 'Stacking poison that ignores armor and stops regen'], lightning: ['Lightning', 'Bolts that jump between enemies'],
    sniper: ['Sniper', 'Huge range, targets the strongest, pierces armor'], bank: ['Bank', 'Produces coins over time'], totem: ['Totem', 'Boosts damage of nearby towers'],
    flamearrow: ['Flame Arrow', 'Arrows that set the target ablaze'], froststorm: ['Frost Storm', 'Chain lightning that freezes'], volcano: ['Volcano', 'Huge blasts that burn the area'],
    plague: ['Plague', 'Magic poison that spreads in an area'], thundergod: ['Thunder God', 'Massive bolt on the strongest, then chains'], frostsniper: ['Frost Sniper', 'Often freezes the strongest enemy'],
    toxiccloud: ['Toxic Cloud', 'Burn and poison together'], arcane: ['Arcane Arrows', 'Magic arrows that ignore armor'], temple: ['Gold Temple', 'Big income + buffs towers'],
  },
  sp: { freeze: 'Mass Freeze', fire: 'Firestorm', meteor: 'Meteor', gold: 'Double Coins', heal: 'Repair Tower' },
  p: {
    dmg: ['Sharp Weapons', '+15% damage for all towers'], range: ['Scope', '+12% range for all towers'], speed: ['Haste', '+12% attack speed'], coin: ['Greed', '+25% kill coins'],
    spell: ['Flowing Magic', '-20% ability cooldowns'], crit: ['Deadly Blows', '+8% critical chance'], burn: ['Inferno', '+50% burn damage'], poison: ['Deadly Venom', '+50% poison damage'],
    hp: ['Repairs', '+5 max health and heal'], gold: ['Treasure', '+100 coins now'], free: ['Free Upgrade', 'A random tower gains a level'],
  },
  m: {
    startCoins: ['Starting Coins', '+25 coins at the start of each run'], baseHp: ['Tower Health', '+2 max health'], damage: ['Tower Power', '+4% damage for all towers'],
    coin: ['Bigger Loot', '+5% kill coins'], spell: ['Faster Magic', '-4% ability cooldowns'], sell: ['Sell Price', '+3% refund when selling'], merge: ['Fusion Power', '+3% extra power per merge'],
  },
  a: {
    k100: ['Monster Hunter', 'Defeat 100 monsters'], k1000: ['Slayer', 'Defeat 1000 monsters'], w10: ['Survivor', 'Reach wave 10'], w20: ['Legend', 'Reach wave 20'], b5: ['Boss Slayer', 'Defeat 5 bosses'],
    m20: ['Fusion Engineer', 'Perform 20 merges'], f5: ['Alchemist', 'Create 5 hybrid towers'], s30: ['Wizard', 'Use abilities 30 times'], r10: ['Persistent', 'Play 10 runs'],
  },
},

/* ===================== Français ===================== */
fr: {
  ui: {
    'app.title': 'Défense de Tours', 'menu.sub': "Arrêtez l'armée de monstres avant qu'elle n'atteigne votre tour !",
    'menu.play': 'Jouer', 'menu.shop': 'Boutique et améliorations', 'menu.settings': 'Paramètres', 'menu.howto': 'Comment jouer', 'menu.best': 'Meilleure vague',
    'how.title': 'Comment jouer',
    'how.1': 'Choisissez une tour dans la barre du bas et touchez une case <b>+</b>',
    'how.2': 'Glissez une tour sur une identique pour fusionner, ou sur une autre pour créer un hybride',
    'how.3': 'Utilisez les pouvoirs sur le côté : Gel ❄️ Feu 🔥 Météore ☄️',
    'how.4': 'Toutes les 3 vagues, choisissez un bonus valable jusqu\'à la fin de la partie',
    'how.5': 'Gagnez des 💎 à chaque partie pour vous améliorer et débloquer de nouvelles tours',
    'ok': 'Compris',
    'set.title': 'Paramètres', 'set.lang': 'Langue', 'set.sound': 'Son', 'set.volume': 'Volume', 'set.shake': "Tremblement de l'écran", 'set.floating': 'Nombres flottants',
    'set.reset': 'Réinitialiser la progression', 'set.confirm': 'Supprimer toute votre progression (gemmes, améliorations, succès) ?', 'set.done': 'Progression réinitialisée',
    'hud.hp': 'Santé de la tour', 'hud.coins': 'Pièces', 'hud.wave': 'Vague',
    'pause.title': 'Pause', 'pause.resume': 'Reprendre', 'pause.quit': 'Terminer la partie', 'pause.settings': 'Paramètres',
    'over.title': 'Partie terminée', 'over.summary': 'Vous avez atteint la vague <b>{w}</b> • <b>{k}</b> monstres vaincus', 'over.best': 'Meilleure vague',
    'over.again': 'Rejouer', 'over.shop': 'Boutique', 'over.menu': 'Menu principal',
    'perk.title': 'Choisissez un bonus', 'perk.sub': 'Actif jusqu\'à la fin de la partie',
    'hub.title': 'Boutique', 'hub.up': 'Amélio.', 'hub.tw': 'Tours', 'hub.fu': 'Fusion', 'hub.ac': 'Succès',
    'hub.note': '🔹 Deux tours de <b>même type et même niveau</b> → une tour plus forte, un niveau au-dessus (+10 % de puissance).<br>🔹 Deux tours <b>différentes</b> (niveau 2+) → une tour hybride aux nouveaux pouvoirs.<br>Glissez une tour sur une autre en jeu pour les fusionner.',
    'next': '⏭ Lancer la vague {n} ({s})',
    'i.hybrid': '(hybride)', 'i.level': 'Niveau {n}', 'i.hint': '💡 Glissez cette tour sur une autre pour fusionner', 'i.upgrade': '⬆ Améliorer 🪙 {c}', 'i.maxlv': 'Niveau max ⭐', 'i.sell': 'Vendre 🪙 {c}',
    'c.splash': 'Zone', 'c.chain': 'Chaîne {n}', 'c.slow': 'Ralentit', 'c.freeze': 'Gel {n}%', 'c.burn': 'Brûlure {n}/s', 'c.poison': 'Poison {n}/s', 'c.magic': 'Magique',
    'c.pierce': "Perce l'armure", 'c.crit': 'Critique {n}%', 'c.strong': 'Cible le plus fort', 'c.aura': 'Renforce +{n}% (portée {r})', 'c.buffed': 'Renforcée +{n}%', 'c.kills': 'Victimes {n}', 'c.ps': '/s', 'c.every': 'toutes les {n}s',
    't.wave': '🌊 Vague {n}', 't.boss': '⚠️ Vague {n} — un boss arrive !', 't.cleared': '✅ Vague repoussée ! +{n} 🪙', 't.nocoins': '🪙 Pas assez de pièces',
    't.cd': '⏳ Pouvoir en recharge', 't.noenemies': "Pas d'ennemis", 't.fullhp': '❤️ Santé au maximum', 't.freeze': '❄️ Tout le monde est gelé !', 't.fire': '🔥 Tout le monde brûle !',
    't.gold': '💰 Pièces doublées pendant 15 secondes !', 't.meteor': '☄️ Touchez où doit tomber la météorite',
    't.mergeLvl': 'Les deux tours doivent avoir le même niveau', 't.mergeMax': 'La tour est déjà au niveau max', 't.mergeNone': 'Aucune recette pour ces tours (voir Boutique → Fusion)',
    't.mergeLv2': 'Montez les deux tours au niveau 2 minimum', 't.fused': '✨ Nouvelle tour hybride : {name}', 't.ach': '🏆 {name} ! +{g} 💎',
    'fx.level': '⬆ Niveau {n}',
  },
  tw: {
    archer: ['Archer', 'Rapide et précis, peut infliger un critique'], mage: ['Mage', "Explosion magique qui ignore l'armure"], ice: ['Glace', 'Ralentit les ennemis et peut les geler'], cannon: ['Canon', 'Gros dégâts sur les groupes'],
    fire: ['Feu', 'Flammes rapides qui brûlent'], poison: ['Poison', "Poison cumulable qui ignore l'armure et stoppe la régénération"], lightning: ['Foudre', "Éclairs qui rebondissent d'un ennemi à l'autre"],
    sniper: ['Sniper', "Portée énorme, vise le plus fort, perce l'armure"], bank: ['Banque', 'Produit des pièces en continu'], totem: ['Totem', 'Augmente les dégâts des tours proches'],
    flamearrow: ['Flèche enflammée', 'Flèches qui enflamment la cible'], froststorm: ['Tempête de givre', 'Foudre en chaîne qui gèle'], volcano: ['Volcan', 'Explosions géantes qui brûlent la zone'],
    plague: ['Peste', "Poison magique qui se propage dans la zone"], thundergod: ['Dieu du tonnerre', 'Foudre massive sur le plus fort, puis en chaîne'], frostsniper: ['Sniper de glace', 'Gèle souvent le plus fort'],
    toxiccloud: ['Nuage toxique', 'Brûlure et poison combinés'], arcane: ['Flèches arcaniques', "Flèches magiques qui ignorent l'armure"], temple: ['Temple d\'or', 'Gros revenus + renforce les tours'],
  },
  sp: { freeze: 'Gel total', fire: 'Tempête de feu', meteor: 'Météorite', gold: 'Pièces doublées', heal: 'Réparer la tour' },
  p: {
    dmg: ['Armes aiguisées', '+15 % de dégâts pour toutes les tours'], range: ['Lunette', '+12 % de portée pour toutes les tours'], speed: ['Célérité', "+12 % de vitesse d'attaque"], coin: ['Cupidité', '+25 % de pièces par victime'],
    spell: ['Magie fluide', '-20 % de recharge des pouvoirs'], crit: ['Coups mortels', '+8 % de chance de critique'], burn: ['Fournaise', '+50 % de dégâts de brûlure'], poison: ['Venin mortel', '+50 % de dégâts de poison'],
    hp: ['Réparations', '+5 santé max et soin'], gold: ['Trésor', '+100 pièces immédiatement'], free: ['Amélioration gratuite', 'Une tour au hasard gagne un niveau'],
  },
  m: {
    startCoins: ['Pièces de départ', '+25 pièces au début de chaque partie'], baseHp: ['Santé de la tour', '+2 santé max'], damage: ['Puissance des tours', '+4 % de dégâts pour toutes les tours'],
    coin: ['Plus de butin', '+5 % de pièces par victime'], spell: ['Magie rapide', '-4 % de recharge des pouvoirs'], sell: ['Prix de vente', '+3 % de remboursement'], merge: ['Puissance de fusion', '+3 % de puissance par fusion'],
  },
  a: {
    k100: ['Chasseur de monstres', 'Vaincre 100 monstres'], k1000: ['Massacreur', 'Vaincre 1000 monstres'], w10: ['Survivant', 'Atteindre la vague 10'], w20: ['Légende', 'Atteindre la vague 20'], b5: ['Tueur de boss', 'Vaincre 5 boss'],
    m20: ['Ingénieur de fusion', 'Effectuer 20 fusions'], f5: ['Alchimiste', 'Créer 5 tours hybrides'], s30: ['Sorcier', 'Utiliser les pouvoirs 30 fois'], r10: ['Persévérant', 'Jouer 10 parties'],
  },
},

/* ===================== Español ===================== */
es: {
  ui: {
    'app.title': 'Defensa de Torres', 'menu.sub': '¡Detén al ejército de monstruos antes de que llegue a tu torre!',
    'menu.play': 'Jugar', 'menu.shop': 'Tienda y mejoras', 'menu.settings': 'Ajustes', 'menu.howto': 'Cómo jugar', 'menu.best': 'Mejor oleada',
    'how.title': 'Cómo jugar',
    'how.1': 'Elige una torre en la barra inferior y toca una casilla <b>+</b>',
    'how.2': 'Arrastra una torre sobre otra igual para fusionarlas, o sobre una distinta para crear un híbrido',
    'how.3': 'Usa las habilidades laterales: Hielo ❄️ Fuego 🔥 Meteoro ☄️',
    'how.4': 'Cada 3 oleadas eliges una mejora que dura hasta el final de la partida',
    'how.5': 'Gana 💎 en cada partida para mejorar y desbloquear nuevas torres',
    'ok': 'Entendido',
    'set.title': 'Ajustes', 'set.lang': 'Idioma', 'set.sound': 'Sonido', 'set.volume': 'Volumen', 'set.shake': 'Temblor de pantalla', 'set.floating': 'Números flotantes',
    'set.reset': 'Borrar progreso', 'set.confirm': '¿Borrar todo tu progreso (gemas, mejoras y logros)?', 'set.done': 'Progreso borrado',
    'hud.hp': 'Salud de la torre', 'hud.coins': 'Monedas', 'hud.wave': 'Oleada',
    'pause.title': 'Pausa', 'pause.resume': 'Continuar', 'pause.quit': 'Terminar partida', 'pause.settings': 'Ajustes',
    'over.title': 'Fin de la partida', 'over.summary': 'Llegaste a la oleada <b>{w}</b> • derrotaste <b>{k}</b> monstruos', 'over.best': 'Mejor oleada',
    'over.again': 'Jugar de nuevo', 'over.shop': 'Tienda', 'over.menu': 'Menú principal',
    'perk.title': 'Elige una mejora', 'perk.sub': 'Dura hasta el final de la partida',
    'hub.title': 'Tienda', 'hub.up': 'Mejoras', 'hub.tw': 'Torres', 'hub.fu': 'Fusión', 'hub.ac': 'Logros',
    'hub.note': '🔹 Dos torres del <b>mismo tipo y nivel</b> → una torre más fuerte, un nivel más (+10 % de poder).<br>🔹 Dos torres <b>distintas</b> (nivel 2+) → una torre híbrida con nuevas habilidades.<br>Arrastra una torre sobre otra en el juego para fusionarlas.',
    'next': '⏭ Iniciar oleada {n} ({s})',
    'i.hybrid': '(híbrida)', 'i.level': 'Nivel {n}', 'i.hint': '💡 Arrastra esta torre sobre otra para fusionar', 'i.upgrade': '⬆ Mejorar 🪙 {c}', 'i.maxlv': 'Nivel máximo ⭐', 'i.sell': 'Vender 🪙 {c}',
    'c.splash': 'Área', 'c.chain': 'Cadena {n}', 'c.slow': 'Ralentiza', 'c.freeze': 'Congela {n}%', 'c.burn': 'Quema {n}/s', 'c.poison': 'Veneno {n}/s', 'c.magic': 'Mágico',
    'c.pierce': 'Perfora armadura', 'c.crit': 'Crítico {n}%', 'c.strong': 'Ataca al más fuerte', 'c.aura': 'Potencia +{n}% (alcance {r})', 'c.buffed': 'Potenciada +{n}%', 'c.kills': 'Bajas {n}', 'c.ps': '/s', 'c.every': 'cada {n}s',
    't.wave': '🌊 Oleada {n}', 't.boss': '⚠️ Oleada {n} — ¡viene un jefe!', 't.cleared': '✅ ¡Oleada superada! +{n} 🪙', 't.nocoins': '🪙 Monedas insuficientes',
    't.cd': '⏳ Habilidad en recarga', 't.noenemies': 'No hay enemigos', 't.fullhp': '❤️ Salud completa', 't.freeze': '❄️ ¡Todos congelados!', 't.fire': '🔥 ¡Todos en llamas!',
    't.gold': '💰 ¡Monedas dobles durante 15 segundos!', 't.meteor': '☄️ Toca donde caerá el meteoro',
    't.mergeLvl': 'Ambas torres deben tener el mismo nivel', 't.mergeMax': 'La torre ya está al nivel máximo', 't.mergeNone': 'No hay receta para estas torres (ver Tienda → Fusión)',
    't.mergeLv2': 'Sube ambas torres al nivel 2 o más', 't.fused': '✨ Nueva torre híbrida: {name}', 't.ach': '🏆 ¡{name}! +{g} 💎',
    'fx.level': '⬆ Nivel {n}',
  },
  tw: {
    archer: ['Arquero', 'Rápido y preciso, puede dar golpe crítico'], mage: ['Mago', 'Explosión mágica que ignora la armadura'], ice: ['Hielo', 'Ralentiza a los enemigos y puede congelarlos'], cannon: ['Cañón', 'Daño pesado contra grupos'],
    fire: ['Fuego', 'Llamas rápidas que queman'], poison: ['Veneno', 'Veneno acumulable que ignora armadura y frena la regeneración'], lightning: ['Rayo', 'Relámpagos que saltan entre enemigos'],
    sniper: ['Francotirador', 'Alcance enorme, ataca al más fuerte y perfora armadura'], bank: ['Banco', 'Produce monedas continuamente'], totem: ['Tótem', 'Aumenta el daño de las torres cercanas'],
    flamearrow: ['Flecha ardiente', 'Flechas que incendian al objetivo'], froststorm: ['Tormenta helada', 'Rayos en cadena que congelan'], volcano: ['Volcán', 'Explosiones enormes que queman la zona'],
    plague: ['Plaga', 'Veneno mágico que se extiende por la zona'], thundergod: ['Dios del trueno', 'Rayo enorme al más fuerte y luego en cadena'], frostsniper: ['Francotirador gélido', 'Suele congelar al más fuerte'],
    toxiccloud: ['Nube tóxica', 'Quemadura y veneno a la vez'], arcane: ['Flechas arcanas', 'Flechas mágicas que ignoran la armadura'], temple: ['Templo dorado', 'Grandes ingresos + potencia las torres'],
  },
  sp: { freeze: 'Congelación total', fire: 'Tormenta de fuego', meteor: 'Meteoro', gold: 'Monedas dobles', heal: 'Reparar torre' },
  p: {
    dmg: ['Armas afiladas', '+15 % de daño en todas las torres'], range: ['Mira', '+12 % de alcance en todas las torres'], speed: ['Prisa', '+12 % de velocidad de ataque'], coin: ['Codicia', '+25 % de monedas por baja'],
    spell: ['Magia fluida', '-20 % de recarga de habilidades'], crit: ['Golpes mortales', '+8 % de probabilidad de crítico'], burn: ['Infierno', '+50 % de daño por quemadura'], poison: ['Veneno letal', '+50 % de daño por veneno'],
    hp: ['Reparaciones', '+5 de salud máx. y curación'], gold: ['Tesoro', '+100 monedas ahora'], free: ['Mejora gratis', 'Una torre al azar sube de nivel'],
  },
  m: {
    startCoins: ['Monedas iniciales', '+25 monedas al empezar cada partida'], baseHp: ['Salud de la torre', '+2 de salud máx.'], damage: ['Poder de las torres', '+4 % de daño en todas las torres'],
    coin: ['Más botín', '+5 % de monedas por baja'], spell: ['Magia veloz', '-4 % de recarga de habilidades'], sell: ['Precio de venta', '+3 % de reembolso al vender'], merge: ['Poder de fusión', '+3 % de poder extra por fusión'],
  },
  a: {
    k100: ['Cazamonstruos', 'Derrota 100 monstruos'], k1000: ['Exterminador', 'Derrota 1000 monstruos'], w10: ['Superviviente', 'Llega a la oleada 10'], w20: ['Leyenda', 'Llega a la oleada 20'], b5: ['Mata jefes', 'Derrota 5 jefes'],
    m20: ['Ingeniero de fusión', 'Realiza 20 fusiones'], f5: ['Alquimista', 'Crea 5 torres híbridas'], s30: ['Hechicero', 'Usa habilidades 30 veces'], r10: ['Perseverante', 'Juega 10 partidas'],
  },
},

/* ===================== Türkçe ===================== */
tr: {
  ui: {
    'app.title': 'Kule Savunması', 'menu.sub': 'Canavar ordusunu kuleye ulaşmadan durdur!',
    'menu.play': 'Oyna', 'menu.shop': 'Mağaza ve Geliştirmeler', 'menu.settings': 'Ayarlar', 'menu.howto': 'Nasıl oynanır', 'menu.best': 'En iyi dalga',
    'how.title': 'Nasıl oynanır',
    'how.1': 'Alt çubuktan bir kule seç ve bir <b>+</b> karesine dokun',
    'how.2': 'Aynı kuleyle birleştirmek için üzerine sürükle, farklı kuleyle melez kule oluştur',
    'how.3': 'Yandaki özel yetenekleri kullan: Dondur ❄️ Ateş 🔥 Göktaşı ☄️',
    'how.4': 'Her 3 dalgada oyun sonuna kadar süren bir ödül seçersin',
    'how.5': 'Her oyunda 💎 kazan, gücünü artır ve yeni kuleler aç',
    'ok': 'Anladım',
    'set.title': 'Ayarlar', 'set.lang': 'Dil', 'set.sound': 'Ses', 'set.volume': 'Ses düzeyi', 'set.shake': 'Ekran sarsıntısı', 'set.floating': 'Uçuşan sayılar',
    'set.reset': 'İlerlemeyi sıfırla', 'set.confirm': 'Tüm ilerlemen (elmaslar, geliştirmeler, başarılar) silinsin mi?', 'set.done': 'İlerleme sıfırlandı',
    'hud.hp': 'Kule canı', 'hud.coins': 'Altın', 'hud.wave': 'Dalga',
    'pause.title': 'Duraklatıldı', 'pause.resume': 'Devam et', 'pause.quit': 'Oyunu bitir', 'pause.settings': 'Ayarlar',
    'over.title': 'Oyun bitti', 'over.summary': '<b>{w}</b>. dalgaya ulaştın • <b>{k}</b> canavar yendin', 'over.best': 'En iyi dalga',
    'over.again': 'Tekrar oyna', 'over.shop': 'Mağaza', 'over.menu': 'Ana menü',
    'perk.title': 'Bir ödül seç', 'perk.sub': 'Oyun sonuna kadar etkili',
    'hub.title': 'Mağaza', 'hub.up': 'Geliştir', 'hub.tw': 'Kuleler', 'hub.fu': 'Birleştir', 'hub.ac': 'Başarılar',
    'hub.note': '🔹 <b>Aynı tür ve seviyedeki</b> iki kule → bir seviye yukarıda daha güçlü kule (+%10 güç).<br>🔹 İki <b>farklı</b> kule (seviye 2+) → yeni yetenekli melez kule.<br>Oyunda bir kuleyi diğerinin üzerine sürükleyerek birleştir.',
    'next': '⏭ {n}. dalgayı başlat ({s})',
    'i.hybrid': '(melez)', 'i.level': 'Seviye {n}', 'i.hint': '💡 Birleştirmek için kuleyi başka bir kulenin üzerine sürükle', 'i.upgrade': '⬆ Geliştir 🪙 {c}', 'i.maxlv': 'Maks. seviye ⭐', 'i.sell': 'Sat 🪙 {c}',
    'c.splash': 'Alan hasarı', 'c.chain': 'Zincir {n}', 'c.slow': 'Yavaşlatır', 'c.freeze': 'Dondurma %{n}', 'c.burn': 'Yanma {n}/sn', 'c.poison': 'Zehir {n}/sn', 'c.magic': 'Büyülü',
    'c.pierce': 'Zırh deler', 'c.crit': 'Kritik %{n}', 'c.strong': 'En güçlüyü hedefler', 'c.aura': 'Güçlendirir +%{n} (menzil {r})', 'c.buffed': 'Güçlendi +%{n}', 'c.kills': 'Öldürme {n}', 'c.ps': '/sn', 'c.every': 'her {n} sn',
    't.wave': '🌊 Dalga {n}', 't.boss': '⚠️ Dalga {n} — patron geliyor!', 't.cleared': '✅ Dalga püskürtüldü! +{n} 🪙', 't.nocoins': '🪙 Yeterli altın yok',
    't.cd': '⏳ Yetenek bekleme süresinde', 't.noenemies': 'Düşman yok', 't.fullhp': '❤️ Can dolu', 't.freeze': '❄️ Herkes dondu!', 't.fire': '🔥 Herkes yanıyor!',
    't.gold': '💰 15 saniye boyunca çift altın!', 't.meteor': '☄️ Göktaşının düşeceği yere dokun',
    't.mergeLvl': 'İki kule de aynı seviyede olmalı', 't.mergeMax': 'Kule zaten maksimum seviyede', 't.mergeNone': 'Bu kuleler için tarif yok (Mağaza → Birleştir)',
    't.mergeLv2': 'İki kuleyi de en az seviye 2 yap', 't.fused': '✨ Yeni melez kule: {name}', 't.ach': '🏆 {name}! +{g} 💎',
    'fx.level': '⬆ Seviye {n}',
  },
  tw: {
    archer: ['Okçu', 'Hızlı ve isabetli, kritik vurabilir'], mage: ['Büyücü', 'Zırhı yok sayan büyülü patlama'], ice: ['Buz', 'Düşmanları yavaşlatır, dondurabilir'], cannon: ['Top', 'Gruplara ağır hasar'],
    fire: ['Ateş', 'Düşmanları yakan hızlı alevler'], poison: ['Zehir', 'Birikir, zırhı yok sayar, yenilenmeyi durdurur'], lightning: ['Yıldırım', 'Düşmanlar arasında zıplayan şimşek'],
    sniper: ['Nişancı', 'Devasa menzil, en güçlüyü vurur, zırh deler'], bank: ['Banka', 'Sürekli altın üretir'], totem: ['Totem', 'Yakındaki kulelerin hasarını artırır'],
    flamearrow: ['Ateş Oku', 'Hedefi tutuşturan oklar'], froststorm: ['Buz Fırtınası', 'Donduran zincir şimşek'], volcano: ['Volkan', 'Alanı yakan dev patlamalar'],
    plague: ['Veba', 'Alanda yayılan büyülü zehir'], thundergod: ['Gök Tanrısı', 'En güçlüye dev yıldırım, sonra zincirleme'], frostsniper: ['Buz Nişancısı', 'En güçlüyü sık sık dondurur'],
    toxiccloud: ['Zehirli Bulut', 'Yanma ve zehir bir arada'], arcane: ['Büyülü Oklar', 'Zırhı yok sayan büyülü oklar'], temple: ['Altın Tapınak', 'Yüksek gelir + kuleleri güçlendirir'],
  },
  sp: { freeze: 'Toplu Dondurma', fire: 'Ateş Fırtınası', meteor: 'Göktaşı', gold: 'Çift Altın', heal: 'Kuleyi Onar' },
  p: {
    dmg: ['Keskin Silahlar', 'Tüm kulelere +%15 hasar'], range: ['Dürbün', 'Tüm kulelere +%12 menzil'], speed: ['Acele', '+%12 saldırı hızı'], coin: ['Açgözlülük', '+%25 öldürme altını'],
    spell: ['Akışkan Büyü', '-%20 yetenek bekleme süresi'], crit: ['Ölümcül Vuruş', '+%8 kritik şansı'], burn: ['Cehennem', '+%50 yanma hasarı'], poison: ['Ölümcül Zehir', '+%50 zehir hasarı'],
    hp: ['Onarım', '+5 maks. can ve iyileşme'], gold: ['Hazine', 'Hemen +100 altın'], free: ['Bedava Geliştirme', 'Rastgele bir kule seviye atlar'],
  },
  m: {
    startCoins: ['Başlangıç Altını', 'Her oyun başında +25 altın'], baseHp: ['Kule Canı', '+2 maks. can'], damage: ['Kule Gücü', 'Tüm kulelere +%4 hasar'],
    coin: ['Daha Çok Ganimet', '+%5 öldürme altını'], spell: ['Hızlı Büyü', '-%4 yetenek bekleme süresi'], sell: ['Satış Fiyatı', 'Satışta +%3 iade'], merge: ['Birleştirme Gücü', 'Her birleştirmede +%3 ek güç'],
  },
  a: {
    k100: ['Canavar Avcısı', '100 canavar yen'], k1000: ['Katliamcı', '1000 canavar yen'], w10: ['Hayatta Kalan', '10. dalgaya ulaş'], w20: ['Efsane', '20. dalgaya ulaş'], b5: ['Patron Avcısı', '5 patron yen'],
    m20: ['Birleştirme Ustası', '20 birleştirme yap'], f5: ['Simyacı', '5 melez kule oluştur'], s30: ['Büyücü', 'Yetenekleri 30 kez kullan'], r10: ['Azimli', '10 oyun oyna'],
  },
},
};

/* ---------- أدوات الترجمة ---------- */
let LANG = 'en';

function lookup(group, key) {
  const L = I18N[LANG] && I18N[LANG][group];
  return (L && L[key]) || (I18N.en[group] && I18N.en[group][key]) || (group === 'sp' ? key : [key, '']);
}

function tr(key, vars) {
  let s = lookup('ui', key);
  if (typeof s !== 'string') s = key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  return s;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = tr(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = tr(el.getAttribute('data-i18n-title')); });
  document.title = tr('app.title');
}

function setLang(code) {
  LANG = I18N[code] ? code : 'en';
  const l = LANGS.find(x => x.code === LANG);
  document.documentElement.lang = LANG;
  document.documentElement.dir = l.dir || 'ltr';
  applyI18n();
}
