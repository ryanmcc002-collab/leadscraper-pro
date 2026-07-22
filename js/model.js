/* Bondi Trailer CAD — project model, presets, undo history, persistence.
   Item coordinates are INTERIOR millimetres: x from the inside face of the
   left (hitch-end) wall, y from the inside face of the serving-side wall. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});
  const u = () => BFT.util;

  // Bondi Food Trailers standard build: every shell is 2100 wide and 2450
  // high with the entry door on the rear (opposite the drawbar) — only the
  // length varies between models.
  BFT.STANDARD = {
    boxWidth: 2100,
    boxHeight: 2450,
    wall: 40,             // standard wall thickness
    drawbar: 1500,        // every BFT trailer runs a 1.5m drawbar
    doorWidth: 740,
    benchDepth: 600,
    serveryFrac: 0.75,    // fallback: servery window ≈ 75% of the shell length
    // standard total serving-window opening per shell length (quote tool)
    windowBySize: { 3000: 2500, 3500: 3000, 4000: 3000, 4500: 3850, 5000: 4000, 5500: 4800, 6000: 5000 },
    hoodWidth: 2000,      // 2m range hood on the non-serving side
    hoodDepth: 200,       // hangs over only 200mm off the wall
    sinkWidth: 960,       // standard sink at the rear of the cook bench
    sinkWidthBig: 1200,   // optional upgrade
    cashDrawerWidth: 450, // standard cash drawer on the serving bench
    endBenchDepth: 600,   // optional U-shape end bench at the drawbar end
  };

  const std = (boxLength, extra) => Object.assign({
    boxLength,
    boxWidth: BFT.STANDARD.boxWidth,
    boxHeight: BFT.STANDARD.boxHeight,
    wall: BFT.STANDARD.wall, hitchLength: BFT.STANDARD.drawbar,
    interiorHeight: 2100, worktopHeight: 850,
    chassisHeight: 600, wheelDia: 620, axles: 2,
    axlePos: Math.round(boxLength * 0.55 / 10) * 10,
    tareKg: Math.round(boxLength * 0.22), // empty shell estimate, editable
  }, extra);
  BFT.stdTrailer = std;

  // BFT model range: 3.0m is single axle, everything above runs double axles.
  BFT.trailerPresets = [
    { id: 'bft30', name: 'BFT 3.0m — single axle', trailer: std(3000, { axles: 1, wheelDia: 600 }) },
    { id: 'bft35', name: 'BFT 3.5m — double axle', trailer: std(3500) },
    { id: 'bft40', name: 'BFT 4.0m — double axle', trailer: std(4000) },
    { id: 'bft45', name: 'BFT 4.5m — double axle', trailer: std(4500) },
    { id: 'bft50', name: 'BFT 5.0m — double axle', trailer: std(5000) },
    { id: 'bft55', name: 'BFT 5.5m — double axle', trailer: std(5500) },
    { id: 'bft60', name: 'BFT 6.0m — double axle', trailer: std(6000) },
  ];

  function defaultKg(c) {
    if (c.kg != null) return c.kg;
    if (c.id === 'bench') return Math.max(15, Math.round(c.w * 0.022));
    const cat = (c.cat || '') + ' ' + c.en;
    if (/fridge|freezer|refriger|cool|ice|kegerator/i.test(cat)) return 65;
    if (/oven|smoker/i.test(cat)) return 90;
    if (/Cooking|griddle|fryer|grill|stove|bain/i.test(cat)) return 35;
    if (/svc|inlet|outlet/i.test(cat)) return 2;
    return 25;
  }

  function itemFromCatalog(catId, x, y, rot) {
    const c = BFT.catalogById(catId) || BFT.catalogById('custom');
    return {
      id: u().uid(), catId: c.id,
      en: c.en, zh: c.zh,
      w: c.w, d: c.d, h: c.h,
      kg: defaultKg(c),
      x: x || 0, y: y || 0, rot: rot || 0,
      sym: c.sym, burners: c.burners, pans: c.pans, bowls: c.bowls,
      shape: c.shape, overhead: !!c.overhead,
      fixture: !!c.fixture, svc: !!c.svc, letter: c.letter,
    };
  }

  // Weight & balance: shell tare spread over the box plus every item at its
  // own position. Simple lever model about the axle group gives the ball
  // (drawbar) load; Australian guidance is roughly 5-15% of total on the ball.
  BFT.balance = function (p) {
    const t = p.trailer;
    const tare = t.tareKg != null ? t.tareKg : Math.round(t.boxLength * 0.22);
    let W = tare;
    let Mx = tare * (t.boxLength / 2);
    let servingKg = 0, roadKg = 0;
    for (const it of p.items || []) {
      const kg = it.kg || 0;
      const fp = BFT.util.footprint(it);
      const cx = t.wall + it.x + fp[0] / 2;
      const cy = t.wall + it.y + fp[1] / 2;
      W += kg;
      Mx += kg * cx;
      if (cy < t.boxWidth / 2) servingKg += kg; else roadKg += kg;
    }
    const cogX = Mx / W;
    const xBall = -t.hitchLength;
    const xAxle = t.axlePos || t.boxLength * 0.55;
    const ball = W * (xAxle - cogX) / (xAxle - xBall);
    return {
      total: Math.round(W), tare,
      equipment: Math.round(W - tare),
      ball: Math.round(ball),
      ballPct: W > 0 ? Math.round((ball / W) * 100) : 0,
      axleLoad: Math.round(W - ball),
      cogX: Math.round(cogX),
      servingKg: Math.round(servingKg), roadKg: Math.round(roadKg),
    };
  };

  // Default project reproduces the layout from the supplier's reference
  // drawing: cook line along the road side (800+1020+350/530+1000 = 3700 int
  // kitchen), fridge/counter/bench along the serving side, BBQ oven at rear.
  function defaultProject() {
    // the example layout replicates the 5.45m supplier reference drawing
    const t = BFT.stdTrailer(5450);
    const iW = t.boxWidth - 2 * t.wall; // 2060
    const topY = (d) => iW - d;
    const items = [];
    const put = (catId, x, y, over) => {
      const it = itemFromCatalog(catId, x, y, 0);
      Object.assign(it, over || {});
      items.push(it);
      return it;
    };
    // cook line (top / road side), depth 650
    put('stove4', 0, topY(650));
    put('bainmarie', 800, topY(650));
    put('fryer', 1820, topY(650), { w: 350 });
    put('bench', 2170, topY(650), { w: 530, d: 650 });
    put('sink3', 2700, topY(650));
    // exhaust hood along the cook-side wall (dashed, 200mm off the wall)
    put('hood', 0, topY(200), { w: 2200, d: 200 });
    // serving side (bottom), depth 600
    put('fridgeub', 0, 0);
    put('counter', 1200, 0, { w: 900, d: 600 });
    put('bench', 2100, 0, { w: 1600, d: 600 });
    // BBQ zone at the rear end
    put('oven', 4610, 200, { rot: 90 });

    return {
      version: 1,
      meta: {
        company: 'BONDI FOOD TRAILERS',
        contact: 'ryan@bondifoodtrailers.com.au',
        project: '5.5m Food Trailer',
        client: '',
        drawingNo: 'BFT-001',
        revision: 'A',
        date: u().todayISO(),
        lang: 'both', // item labels: 'en' | 'zh' | 'both'
      },
      trailer: t,
      items,
      features: [
        { id: u().uid(), wall: 'bottom', type: 'window', offset: 900, width: 2000, sill: 900, height: 900 },
        // entry door: always the rear end, opposite the drawbar (BFT standard)
        { id: u().uid(), wall: 'right', type: 'door', offset: Math.round((t.boxWidth - BFT.STANDARD.doorWidth) / 2), width: BFT.STANDARD.doorWidth, sill: 0, height: 2000 },
        // drawbar-end servery window (front wall, centred)
        { id: u().uid(), wall: 'left', type: 'window', offset: 450, width: 1200, sill: 900, height: 900 },
      ],
      dims: [],
      notes: [],
    };
  }

  class Store {
    constructor() {
      this.project = defaultProject();
      this.undoStack = [];
      this.redoStack = [];
      this.listeners = [];
    }
    onChange(fn) { this.listeners.push(fn); }
    emit() { for (const fn of this.listeners) fn(this.project); }

    // call BEFORE mutating
    checkpoint() {
      this.undoStack.push(JSON.stringify(this.project));
      if (this.undoStack.length > 100) this.undoStack.shift();
      this.redoStack.length = 0;
    }
    undo() {
      if (!this.undoStack.length) return;
      this.redoStack.push(JSON.stringify(this.project));
      this.project = JSON.parse(this.undoStack.pop());
      this.emit();
    }
    redo() {
      if (!this.redoStack.length) return;
      this.undoStack.push(JSON.stringify(this.project));
      this.project = JSON.parse(this.redoStack.pop());
      this.emit();
    }

    save() {
      try { localStorage.setItem('bft-project', JSON.stringify(this.project)); } catch (e) { /* private mode */ }
    }
    load() {
      try {
        const raw = localStorage.getItem('bft-project');
        if (raw) this.project = JSON.parse(raw);
      } catch (e) { /* keep default */ }
      this.migrate();
    }

    // bring designs saved by older versions up to current BFT standards
    migrate() {
      const p = this.project;
      if (!p || !p.trailer) return;
      const iW = p.trailer.boxWidth - 2 * p.trailer.wall;
      for (const it of p.items || []) {
        // standard road-side hood hangs over only 200mm off the wall
        if (it.catId === 'hood' && it.overhead && Math.abs(it.y + it.d - iW) < 1 && it.d !== 200) {
          it.d = 200;
          it.y = iW - 200;
        }
        // items saved before weights existed get their catalog default
        if (it.kg == null) {
          const c = BFT.catalogById(it.catId);
          it.kg = c ? defaultKg(Object.assign({}, c, { w: it.w })) : 25;
        }
      }
    }
    reset() {
      this.checkpoint();
      this.project = defaultProject();
      this.emit();
    }

    interior() {
      const t = this.project.trailer;
      return { iL: t.boxLength - 2 * t.wall, iW: t.boxWidth - 2 * t.wall };
    }
  }

  BFT.itemFromCatalog = itemFromCatalog;
  BFT.defaultProject = defaultProject;
  BFT.Store = Store;
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

