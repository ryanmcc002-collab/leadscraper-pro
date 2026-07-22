/* Bondi Trailer CAD — equipment catalog.
   Sizes are typical commercial catering equipment footprints in mm:
   w = width along the wall, d = depth from the wall, h = overall height.
   Every size is editable per-item after placing. Labels are bilingual so
   exported drawings are readable by Chinese manufacturers. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  BFT.catalog = [
    { id: 'stove4',    en: '4-Burner Stove',   zh: '四眼灶',   w: 800,  d: 650, h: 850,  sym: 'burners', burners: 4, cat: 'Cooking' },
    { id: 'stove6',    en: '6-Burner Stove',   zh: '六眼灶',   w: 1100, d: 650, h: 850,  sym: 'burners', burners: 6, cat: 'Cooking' },
    { id: 'bainmarie', en: 'Bain Marie',       zh: '保温汤池', w: 1020, d: 650, h: 850,  sym: 'pans', pans: 4, cat: 'Cooking' },
    { id: 'fryer',     en: 'Deep Fryer',       zh: '炸炉',     w: 400,  d: 650, h: 850,  sym: 'pans', pans: 1, cat: 'Cooking' },
    { id: 'fryer2',    en: 'Double Fryer',     zh: '双缸炸炉', w: 700,  d: 650, h: 850,  sym: 'pans', pans: 2, cat: 'Cooking' },
    { id: 'griddle',   en: 'Griddle / Hotplate', zh: '扒炉',   w: 600,  d: 650, h: 850,  sym: 'plain', cat: 'Cooking' },
    { id: 'chargrill', en: 'Char Grill',       zh: '烧烤炉',   w: 600,  d: 650, h: 850,  sym: 'grill', cat: 'Cooking' },
    { id: 'oven',      en: 'BBQ Oven / Smoker', zh: '烤炉',    w: 1600, d: 740, h: 1200, sym: 'oven', cat: 'Cooking' },
    { id: 'hood',      en: 'Exhaust Hood (overhead)', zh: '排烟罩', w: 2000, d: 200, h: 500, sym: 'hood', overhead: true, cat: 'Cooking' },

    { id: 'bench',     en: 'Bench Space',      zh: '工作台',   w: 900,  d: 650, h: 850,  sym: 'plain', cat: 'Benches' },
    { id: 'counter',   en: 'Cash Counter',     zh: '收银台',   w: 900,  d: 600, h: 850,  sym: 'plain', cat: 'Benches' },
    { id: 'shelf',     en: 'Shelf Unit',       zh: '货架',     w: 900,  d: 450, h: 1800, sym: 'cross', cat: 'Benches' },

    { id: 'sink3',     en: 'Triple Sink',      zh: '三星水槽', w: 1000, d: 650, h: 850,  sym: 'sink', bowls: 3, cat: 'Plumbing' },
    { id: 'cashdrawer', en: 'Cash Drawer',     zh: '钱箱',     w: 450,  d: 450, h: 150,  sym: 'plain', cat: 'Benches' },
    { id: 'sink2',     en: 'Double Sink',      zh: '双星水槽', w: 800,  d: 650, h: 850,  sym: 'sink', bowls: 2, cat: 'Plumbing' },
    { id: 'sink1',     en: 'Single Sink',      zh: '单星水槽', w: 500,  d: 600, h: 850,  sym: 'sink', bowls: 1, cat: 'Plumbing' },
    { id: 'handwash',  en: 'Hand Wash Basin',  zh: '洗手池',   w: 350,  d: 350, h: 850,  sym: 'sink', bowls: 1, cat: 'Plumbing' },
    { id: 'watertank', en: 'Water Tank',       zh: '水箱',     w: 600,  d: 400, h: 500,  sym: 'cross', cat: 'Plumbing' },

    { id: 'fridgeub',  en: 'Underbench Fridge', zh: '工作台冷柜', w: 1200, d: 600, h: 850, sym: 'fridge', cat: 'Refrigeration' },
    { id: 'fridge',    en: 'Upright Fridge',   zh: '立式冰箱', w: 700,  d: 800, h: 2000, sym: 'fridge', cat: 'Refrigeration' },
    { id: 'freezer',   en: 'Chest Freezer',    zh: '卧式冰柜', w: 1100, d: 700, h: 850,  sym: 'fridge', cat: 'Refrigeration' },
    { id: 'coldwell',  en: 'Cold Display Well', zh: '冷藏展示柜', w: 1200, d: 700, h: 1200, sym: 'pans', pans: 3, cat: 'Refrigeration' },

    { id: 'gas',       en: 'Gas Bottle 9kg',   zh: '煤气瓶',   w: 310,  d: 310, h: 580,  sym: 'circle', shape: 'circle', cat: 'Services', svc: true },
    { id: 'gas45',     en: 'Gas Bottle 45kg',  zh: '煤气瓶45kg', w: 375, d: 375, h: 1250, sym: 'circle', shape: 'circle', cat: 'Services', svc: true },
    { id: 'generator', en: 'Generator',        zh: '发电机',   w: 700,  d: 500, h: 550,  sym: 'cross', cat: 'Services' },
    { id: 'switchbd',  en: 'Switchboard',      zh: '配电箱',   w: 400,  d: 150, h: 600,  sym: 'plain', fixture: true, cat: 'Services' },
    // connection points: where the factory fits gas/power/water services.
    // Marked with a letter symbol; put them on the wall they penetrate.
    { id: 'pwr15',     en: 'Power Inlet 15A',  zh: '15A电源接口', w: 150, d: 150, h: 300, sym: 'svc', letter: 'P', fixture: true, svc: true, cat: 'Services' },
    { id: 'pwr32',     en: 'Power Inlet 32A',  zh: '32A电源接口', w: 150, d: 150, h: 300, sym: 'svc', letter: 'P', fixture: true, svc: true, cat: 'Services' },
    { id: 'gasbay',    en: 'Gas Inlet Point',  zh: '燃气接口',  w: 150, d: 150, h: 300,  sym: 'svc', letter: 'G', fixture: true, svc: true, cat: 'Services' },
    { id: 'waterin',   en: 'Water Inlet',      zh: '进水口',    w: 150, d: 150, h: 300,  sym: 'svc', letter: 'W', fixture: true, svc: true, cat: 'Services' },
    { id: 'waterout',  en: 'Waste Water Outlet', zh: '排水口',  w: 150, d: 150, h: 300,  sym: 'svc', letter: 'D', fixture: true, svc: true, cat: 'Services' },

    { id: 'custom',    en: 'Custom Item',      zh: '自定义',   w: 600,  d: 600, h: 850,  sym: 'plain', cat: 'Custom' },
  ];

  BFT.catalogById = function (id) {
    return BFT.catalog.find((c) => c.id === id) || null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

