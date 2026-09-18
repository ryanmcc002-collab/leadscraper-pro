/* Quick Ink — sign PDFs and photos of documents in the browser. No backend. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";

  /* ------------------------------------------------------------ storage */
  const store = {
    get(k) { try { return localStorage.getItem("quickink." + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem("quickink." + k, v); } catch { /* private mode etc. */ } },
    del(k) { try { localStorage.removeItem("quickink." + k); } catch { /* ignore */ } }
  };

  /* -------------------------------------------------------------- state */
  const state = {
    bytes: null,        // Uint8Array of the source PDF
    name: "",
    isSample: false,
    pdf: null,          // pdf.js document
    pages: [],          // { el, canvas, layer, vp1, cssW, cssH, task }
    fields: [],         // { id, page, type, x, y, w, h, text, src, aspect, color, el }
    selected: null,
    placing: null,      // 'sig' | 'ini' | 'date' | 'text' | null
    zoom: 1,
    ink: store.get("ink") || "#1c3fbf",
    dateFmt: store.get("dateFmt") || "dmy",
    sig: store.get("sig") ? JSON.parse(store.get("sig")) : null,   // { src, aspect }
    ini: store.get("ini") ? JSON.parse(store.get("ini")) : null,
    nextId: 1
  };

  const el = {
    desk: $("#desk"), pages: $("#pages"), empty: $("#empty"), docMeta: $("#docMeta"),
    fileInput: $("#fileInput"), downloadBtn: $("#downloadBtn"), placeHint: $("#placeHint"),
    placeHintText: $("#placeHintText"), placeCancel: $("#placeCancel"), dropVeil: $("#dropVeil"),
    sigPreview: $("#sigPreview"), iniPreview: $("#iniPreview"), editSigBtn: $("#editSigBtn"), editIniBtn: $("#editIniBtn"),
    fieldCount: $("#fieldCount"), clearAll: $("#clearAll"), dateFmt: $("#dateFmt"), toast: $("#toast"),
    zoomIn: $("#zoomIn"), zoomOut: $("#zoomOut"), zoomVal: $("#zoomVal"),
    modal: $("#sigModal"), modalTitle: $("#modalTitle"), modalSave: $("#modalSave"), modalCancel: $("#modalCancel"),
    pad: $("#pad"), padWrap: $(".pad-wrap"), padClear: $("#padClear"),
    typeName: $("#typeName"), fontGrid: $("#fontGrid"),
    sigUpload: $("#sigUpload"), knockout: $("#knockout"), uploadPreview: $("#uploadPreview"), uploadImg: $("#uploadImg")
  };

  /* -------------------------------------------------------------- toast */
  let toastTimer = 0;
  function toast(msg, ms = 3200) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, ms);
  }

  /* --------------------------------------------------------------- dates */
  function today() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    if (state.dateFmt === "iso") return `${yyyy}-${mm}-${dd}`;
    if (state.dateFmt === "long") return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
    return `${dd}/${mm}/${yyyy}`;
  }
  function refreshDateOptions() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0"), mm = String(d.getMonth() + 1).padStart(2, "0"), yyyy = d.getFullYear();
    const opts = { dmy: `${dd}/${mm}/${yyyy}`, long: d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }), iso: `${yyyy}-${mm}-${dd}` };
    $$("option", el.dateFmt).forEach(o => { o.textContent = opts[o.value]; });
    el.dateFmt.value = state.dateFmt;
  }

  /* ------------------------------------------------------- open a file */
  async function openFile(file) {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const isPdf = file.type === "application/pdf" || ext === "pdf";
    const isImg = file.type.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(ext);
    try {
      let bytes;
      if (isPdf) bytes = new Uint8Array(await file.arrayBuffer());
      else if (isImg) bytes = await imageToPdf(file);
      else {
        toast(`Can't open .${ext} files directly. Save it as a PDF first (File → Save as, or Export → PDF), then open that here.`, 6000);
        return;
      }
      await loadPdf(bytes, file.name, false);
    } catch (err) {
      console.error(err);
      toast("Couldn't open that file. If it's password-protected, remove the password first.", 5000);
    }
  }

  async function imageToPdf(file) {
    const { PDFDocument } = PDFLib;
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const doc = await PDFDocument.create();
      let embedded;
      if (file.type === "image/jpeg") {
        embedded = await doc.embedJpg(await file.arrayBuffer());
      } else {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        const blob = await new Promise(r => c.toBlob(r, "image/png"));
        embedded = await doc.embedPng(await blob.arrayBuffer());
      }
      // Fit the photo onto an A4 sheet, portrait or landscape to suit.
      const landscape = img.naturalWidth > img.naturalHeight;
      const [pw, ph] = landscape ? [841.89, 595.28] : [595.28, 841.89];
      const s = Math.min(pw / img.naturalWidth, ph / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      const page = doc.addPage([pw, ph]);
      page.drawImage(embedded, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      return await doc.save();
    } finally { URL.revokeObjectURL(url); }
  }

  async function loadPdf(bytes, name, isSample) {
    // pdf.js transfers the buffer to its worker, so hand it a copy.
    const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
    if (state.pdf) { try { state.pdf.destroy(); } catch { /* ignore */ } }
    state.bytes = bytes; state.name = name; state.isSample = isSample; state.pdf = pdf;
    state.fields = []; state.selected = null; state.zoom = 1;
    setPlacing(null);
    await buildPages();
    updateMeta();
    updateCount();
    el.empty.hidden = true;
    el.downloadBtn.disabled = false;
  }

  function updateMeta() {
    const n = state.pages.length;
    el.docMeta.textContent = `${state.name} · ${n} page${n === 1 ? "" : "s"}`;
    if (state.isSample) {
      const pill = document.createElement("span");
      pill.className = "pill"; pill.textContent = "sample";
      el.docMeta.appendChild(pill);
    }
  }

  /* ----------------------------------------------------------- rendering */
  async function buildPages() {
    el.pages.innerHTML = "";
    state.pages = [];
    for (let i = 1; i <= state.pdf.numPages; i++) {
      const page = await state.pdf.getPage(i);
      const vp1 = page.getViewport({ scale: 1 });
      const wrap = document.createElement("div");
      wrap.className = "page";
      const canvas = document.createElement("canvas");
      const layer = document.createElement("div");
      layer.className = "layer";
      layer.dataset.page = String(i - 1);
      const num = document.createElement("span");
      num.className = "page-num"; num.textContent = `Page ${i} of ${state.pdf.numPages}`;
      wrap.append(canvas, layer, num);
      el.pages.appendChild(wrap);
      state.pages.push({ page, el: wrap, canvas, layer, vp1, cssW: vp1.width, cssH: vp1.height, task: null });
    }
    await renderPages();
  }

  function fitScale() {
    if (!state.pages.length) return 1;
    const avail = Math.max(240, el.desk.clientWidth - (window.innerWidth <= 760 ? 32 : 48));
    const maxW = Math.max(...state.pages.map(p => p.vp1.width));
    return Math.min(avail / maxW, 1.6) * state.zoom;
  }

  async function renderPages() {
    const scale = fitScale();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    el.zoomVal.textContent = state.zoom === 1 ? "Fit" : `${Math.round(state.zoom * 100)}%`;
    for (const p of state.pages) {
      const vp = p.page.getViewport({ scale });
      p.cssW = vp.width; p.cssH = vp.height;
      p.el.style.width = `${vp.width}px`; p.el.style.height = `${vp.height}px`;
      p.canvas.style.width = `${vp.width}px`; p.canvas.style.height = `${vp.height}px`;
      positionFields(p);
    }
    for (const p of state.pages) {
      if (p.task) { try { p.task.cancel(); } catch { /* ignore */ } }
      const vp = p.page.getViewport({ scale: scale * dpr });
      const off = document.createElement("canvas");
      off.width = Math.floor(vp.width); off.height = Math.floor(vp.height);
      const task = p.page.render({ canvasContext: off.getContext("2d"), viewport: vp });
      p.task = task;
      try {
        await task.promise;
        if (p.task !== task) continue;
        p.canvas.width = off.width; p.canvas.height = off.height;
        p.canvas.getContext("2d").drawImage(off, 0, 0);
        p.task = null;
      } catch (e) {
        if (!(e && e.name === "RenderingCancelledException")) console.error(e);
      }
    }
  }

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (state.pdf) renderPages(); }, 160);
  }).observe(el.desk);

  el.zoomIn.addEventListener("click", () => { state.zoom = Math.min(3, +(state.zoom + 0.25).toFixed(2)); renderPages(); });
  el.zoomOut.addEventListener("click", () => { state.zoom = Math.max(0.5, +(state.zoom - 0.25).toFixed(2)); renderPages(); });

  /* -------------------------------------------------------------- fields */
  const pageOf = f => state.pages[f.page];

  function positionFields(p) {
    for (const f of state.fields) if (pageOf(f) === p) positionField(f);
  }

  function positionField(f) {
    const p = pageOf(f);
    if (!f.el) f.el = makeFieldEl(f);
    if (f.el.parentNode !== p.layer) p.layer.appendChild(f.el);
    const hPx = f.h * p.cssH;
    f.el.style.left = `${f.x * p.cssW}px`;
    f.el.style.top = `${f.y * p.cssH}px`;
    f.el.style.height = `${hPx}px`;
    if (f.type === "sig" || f.type === "ini") {
      f.el.style.width = `${f.w * p.cssW}px`;
    } else {
      f.el.style.width = "auto";
      f.el.style.fontSize = `${hPx * 0.6}px`;
      f.el.style.color = f.color;
      f.w = f.el.offsetWidth / p.cssW;
    }
  }

  function makeFieldEl(f) {
    const d = document.createElement("div");
    d.className = `field ${f.type}`;
    d.dataset.id = String(f.id);
    if (f.type === "sig" || f.type === "ini") {
      const img = document.createElement("img");
      img.src = f.src; img.alt = f.type === "sig" ? "Signature" : "Initials"; img.draggable = false;
      d.appendChild(img);
    } else {
      const t = document.createElement("span");
      t.className = "txt"; t.contentEditable = "true"; t.spellcheck = false; t.textContent = f.text;
      t.addEventListener("input", () => { f.text = t.textContent; positionField(f); });
      t.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); t.blur(); } e.stopPropagation(); });
      t.addEventListener("blur", () => { if (!t.textContent.trim() && f.type === "text") { t.textContent = ""; f.text = ""; } });
      d.appendChild(t);
    }
    const handle = document.createElement("span");
    handle.className = "handle";
    const del = document.createElement("button");
    del.className = "del"; del.type = "button"; del.setAttribute("aria-label", "Remove"); del.textContent = "×";
    del.addEventListener("click", e => { e.stopPropagation(); removeField(f); });
    d.append(handle, del);

    // Drag to move
    d.addEventListener("pointerdown", e => {
      if (e.target === handle || e.target === del) return;
      if (e.target.classList.contains("txt") && document.activeElement === e.target) return; // editing text
      e.preventDefault();
      select(f);
      const p = pageOf(f);
      const start = { px: e.clientX, py: e.clientY, x: f.x, y: f.y };
      let moved = false;
      d.setPointerCapture(e.pointerId);
      d.classList.add("is-dragging");
      const move = ev => {
        const dx = (ev.clientX - start.px) / p.cssW, dy = (ev.clientY - start.py) / p.cssH;
        if (Math.abs(ev.clientX - start.px) + Math.abs(ev.clientY - start.py) > 3) moved = true;
        f.x = clamp(start.x + dx, 0, 1 - f.w); f.y = clamp(start.y + dy, 0, 1 - f.h);
        positionField(f);
      };
      const up = () => {
        d.classList.remove("is-dragging");
        d.removeEventListener("pointermove", move); d.removeEventListener("pointerup", up); d.removeEventListener("pointercancel", up);
        if (!moved && (f.type === "text" || f.type === "date")) {
          const t = d.querySelector(".txt"); t.focus();
          const r = document.createRange(); r.selectNodeContents(t); r.collapse(false);
          const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        }
      };
      d.addEventListener("pointermove", move); d.addEventListener("pointerup", up); d.addEventListener("pointercancel", up);
    });

    // Resize from the corner
    handle.addEventListener("pointerdown", e => {
      e.preventDefault(); e.stopPropagation();
      select(f);
      const p = pageOf(f);
      const rect = p.layer.getBoundingClientRect();
      handle.setPointerCapture(e.pointerId);
      const move = ev => {
        const px = ev.clientX - rect.left, py = ev.clientY - rect.top;
        if (f.type === "sig" || f.type === "ini") {
          let wPx = clamp(px - f.x * p.cssW, 24, (1 - f.x) * p.cssW);
          let hPx = wPx / f.aspect;
          if (hPx > (1 - f.y) * p.cssH) { hPx = (1 - f.y) * p.cssH; wPx = hPx * f.aspect; }
          f.w = wPx / p.cssW; f.h = hPx / p.cssH;
        } else {
          const hPx = clamp(py - f.y * p.cssH, 10, (1 - f.y) * p.cssH);
          f.h = hPx / p.cssH;
        }
        positionField(f);
      };
      const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); handle.removeEventListener("pointercancel", up); };
      handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
    });
    return d;
  }

  function select(f) {
    if (state.selected && state.selected !== f && state.selected.el) state.selected.el.classList.remove("is-selected");
    state.selected = f;
    if (f && f.el) f.el.classList.add("is-selected");
  }

  function removeField(f) {
    if (f.el) f.el.remove();
    state.fields = state.fields.filter(x => x !== f);
    if (state.selected === f) state.selected = null;
    updateCount();
  }

  function updateCount() {
    el.fieldCount.textContent = String(state.fields.length);
  }

  function addField(type, pageIdx, cx, cy) {
    const p = state.pages[pageIdx];
    const f = { id: state.nextId++, page: pageIdx, type, x: 0, y: 0, w: 0, h: 0, text: "", src: null, aspect: 1, color: state.ink };
    if (type === "sig" || type === "ini") {
      const s = type === "sig" ? state.sig : state.ini;
      f.src = s.src; f.aspect = s.aspect;
      f.w = type === "sig" ? 0.28 : 0.1;
      f.h = (f.w * p.vp1.width) / f.aspect / p.vp1.height;
    } else {
      f.text = type === "date" ? today() : "";
      f.h = 20 / p.vp1.height;       // ~20pt line on the page
      f.w = 0.2;
    }
    f.x = clamp(cx - f.w / 2, 0, 1 - f.w);
    f.y = clamp(cy - f.h / 2, 0, 1 - f.h);
    state.fields.push(f);
    positionField(f);
    // width is only known once laid out (text), so re-clamp
    f.x = clamp(f.x, 0, Math.max(0, 1 - f.w));
    positionField(f);
    select(f);
    updateCount();
    if (type === "text") { const t = f.el.querySelector(".txt"); t.focus(); requestAnimationFrame(() => t.focus()); }
    return f;
  }

  /* --------------------------------------------------------- placing mode */
  const hintFor = { sig: "Tap the page where you want your signature", ini: "Tap where your initials go", date: "Tap where today's date goes", text: "Tap where the text goes" };

  function setPlacing(tool) {
    state.placing = tool;
    el.desk.classList.toggle("is-placing", !!tool);
    el.placeHint.hidden = !tool;
    if (tool) el.placeHintText.textContent = hintFor[tool];
    $$(".tool").forEach(b => b.classList.toggle("is-active", b.dataset.tool === tool));
  }

  $$(".tool").forEach(btn => btn.addEventListener("click", async () => {
    const tool = btn.dataset.tool;
    if (!state.pdf) { toast("Open a document first."); return; }
    if (state.placing === tool) { setPlacing(null); return; }
    if (tool === "sig" && !state.sig) { const ok = await openSigModal("sig"); if (!ok) return; }
    if (tool === "ini" && !state.ini) { const ok = await openSigModal("ini"); if (!ok) return; }
    setPlacing(tool);
  }));
  el.placeCancel.addEventListener("click", () => setPlacing(null));

  el.pages.addEventListener("pointerdown", e => {
    const layer = e.target.closest(".layer");
    if (!layer || e.target !== layer) return;
    if (state.placing) {
      e.preventDefault(); // keep focus where we put it (a new text box) instead of on the page
      const rect = layer.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width, cy = (e.clientY - rect.top) / rect.height;
      const tool = state.placing;
      addField(tool, +layer.dataset.page, cx, cy);
      setPlacing(null);
    } else {
      select(null);
    }
  });
  el.desk.addEventListener("pointerdown", e => { if (e.target === el.desk || e.target === el.pages) select(null); });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { if (state.placing) setPlacing(null); else select(null); }
    if ((e.key === "Delete" || e.key === "Backspace") && state.selected) {
      const ae = document.activeElement;
      const editing = ae && (ae.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName));
      if (!editing && !el.modal.open) { e.preventDefault(); removeField(state.selected); }
    }
  });

  el.clearAll.addEventListener("click", () => {
    if (!state.fields.length) return;
    state.fields.slice().forEach(removeField);
  });

  /* -------------------------------------------------------------- options */
  function setInk(c) {
    state.ink = c; store.set("ink", c);
    $$(".swatch").forEach(s => s.setAttribute("aria-checked", String(s.dataset.ink === c)));
    padCtx.strokeStyle = c;
  }
  $$(".swatch").forEach(s => s.addEventListener("click", () => {
    setInk(s.dataset.ink);
    if (s.closest("#modalSwatches")) redrawPad();
  }));
  el.dateFmt.addEventListener("change", () => {
    state.dateFmt = el.dateFmt.value; store.set("dateFmt", state.dateFmt);
    for (const f of state.fields) if (f.type === "date") { f.text = today(); f.el.querySelector(".txt").textContent = f.text; positionField(f); }
  });

  /* -------------------------------------------------------- file inputs */
  el.fileInput.addEventListener("change", () => { const f = el.fileInput.files[0]; if (f) openFile(f); el.fileInput.value = ""; });
  let dragDepth = 0;
  el.desk.addEventListener("dragenter", e => { e.preventDefault(); dragDepth++; el.dropVeil.hidden = false; });
  el.desk.addEventListener("dragover", e => { e.preventDefault(); });
  el.desk.addEventListener("dragleave", () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) el.dropVeil.hidden = true; });
  el.desk.addEventListener("drop", e => {
    e.preventDefault(); dragDepth = 0; el.dropVeil.hidden = true;
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) openFile(f);
  });

  /* ------------------------------------------------------ signature modal */
  const padCtx = el.pad.getContext("2d");
  let strokes = [];          // [{ pts: [{x,y,t}], color }]
  let current = null;
  let modalKind = "sig";
  let modalTab = "draw";
  let modalResolve = null;
  let uploadSrc = null;      // dataURL of raw upload

  function sizePad() {
    const r = el.pad.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    el.pad.width = Math.round(r.width * dpr); el.pad.height = Math.round(r.height * dpr);
    padCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawPad();
  }

  function drawStroke(ctx, s) {
    ctx.strokeStyle = s.color; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const pts = s.pts;
    if (pts.length === 1) { ctx.beginPath(); ctx.lineWidth = 2.6; ctx.arc(pts[0].x, pts[0].y, 1.3, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill(); return; }
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const v = Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t);   // px per ms
      const w = clamp(3.2 - v * 1.2, 1.4, 3.2);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const prevMid = i > 1 ? { x: (pts[i - 2].x + a.x) / 2, y: (pts[i - 2].y + a.y) / 2 } : a;
      ctx.beginPath(); ctx.lineWidth = w;
      ctx.moveTo(prevMid.x, prevMid.y); ctx.quadraticCurveTo(a.x, a.y, mid.x, mid.y); ctx.stroke();
    }
  }

  function redrawPad() {
    const r = el.pad.getBoundingClientRect();
    padCtx.clearRect(0, 0, r.width, r.height);
    strokes.forEach(s => { s.color = state.ink; drawStroke(padCtx, s); });
    el.padWrap.classList.toggle("has-ink", strokes.length > 0);
  }

  el.pad.addEventListener("pointerdown", e => {
    e.preventDefault();
    el.pad.setPointerCapture(e.pointerId);
    const r = el.pad.getBoundingClientRect();
    current = { pts: [{ x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp }], color: state.ink };
    strokes.push(current);
    el.padWrap.classList.add("has-ink");
    drawStroke(padCtx, current);
  });
  el.pad.addEventListener("pointermove", e => {
    if (!current) return;
    const r = el.pad.getBoundingClientRect();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) current.pts.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, t: ev.timeStamp });
    // redraw just the tail
    const n = current.pts.length;
    const tail = { pts: current.pts.slice(Math.max(0, n - evs.length - 2)), color: current.color };
    drawStroke(padCtx, tail);
  });
  const endStroke = () => { current = null; };
  el.pad.addEventListener("pointerup", endStroke);
  el.pad.addEventListener("pointercancel", endStroke);
  el.padClear.addEventListener("click", () => { strokes = []; redrawPad(); });

  $$(".tab").forEach(t => t.addEventListener("click", () => showTab(t.dataset.tab)));
  function showTab(tab) {
    modalTab = tab;
    $$(".tab").forEach(t => { const on = t.dataset.tab === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
    $$(".pane").forEach(p => { p.hidden = p.dataset.pane !== tab; });
    if (tab === "draw") sizePad();
    if (tab === "type") el.typeName.focus();
  }

  el.typeName.addEventListener("input", refreshFontCards);
  function refreshFontCards() {
    const v = el.typeName.value.trim() || (modalKind === "ini" ? "RM" : "Your name");
    $$(".font-card span", el.fontGrid).forEach(s => { s.textContent = v; });
  }
  $$(".font-card").forEach(c => c.addEventListener("click", () => {
    $$(".font-card").forEach(x => { const on = x === c; x.classList.toggle("is-active", on); x.setAttribute("aria-checked", String(on)); });
  }));

  el.sigUpload.addEventListener("change", () => {
    const f = el.sigUpload.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { uploadSrc = rd.result; refreshUploadPreview(); };
    rd.readAsDataURL(f);
    el.sigUpload.value = "";
  });
  el.knockout.addEventListener("change", refreshUploadPreview);
  async function refreshUploadPreview() {
    if (!uploadSrc) return;
    const out = await processUpload();
    el.uploadImg.src = out.src;
    el.uploadPreview.hidden = false;
  }

  async function processUpload() {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = uploadSrc; });
    const max = 1600;
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, c.width, c.height);
    if (el.knockout.checked) {
      const id = ctx.getImageData(0, 0, c.width, c.height), d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        // paper (bright) goes transparent, ink stays; soft ramp between
        const a = clamp((215 - lum) / 70, 0, 1);
        d[i + 3] = Math.round(d[i + 3] * a);
      }
      ctx.putImageData(id, 0, 0);
    }
    return trimCanvas(c);
  }

  function trimCanvas(c, pad = 8) {
    const ctx = c.getContext("2d");
    const { width: w, height: h } = c;
    const d = ctx.getImageData(0, 0, w, h).data;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
    if (maxX < 0) return null;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad); maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
    const out = document.createElement("canvas");
    out.width = maxX - minX + 1; out.height = maxY - minY + 1;
    out.getContext("2d").drawImage(c, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
    return { src: out.toDataURL("image/png"), aspect: out.width / out.height };
  }

  async function buildSignature() {
    if (modalTab === "draw") {
      if (!strokes.length) { toast("Draw your signature first."); return null; }
      const dpr = 3;
      const r = el.pad.getBoundingClientRect();
      const c = document.createElement("canvas");
      c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
      const ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strokes.forEach(s => drawStroke(ctx, s));
      return trimCanvas(c, 6 * dpr);
    }
    if (modalTab === "type") {
      const name = el.typeName.value.trim();
      if (!name) { toast(modalKind === "ini" ? "Type your initials first." : "Type your name first."); el.typeName.focus(); return null; }
      const font = $(".font-card.is-active").dataset.font;
      const size = 160;
      try { await document.fonts.load(`${size}px "${font}"`); } catch { /* fallback font is fine */ }
      const m = document.createElement("canvas").getContext("2d");
      m.font = `${size}px "${font}", cursive`;
      const tw = Math.ceil(m.measureText(name).width);
      const c = document.createElement("canvas");
      c.width = tw + size; c.height = size * 1.8;
      const ctx = c.getContext("2d");
      ctx.font = m.font; ctx.fillStyle = state.ink; ctx.textBaseline = "alphabetic";
      ctx.fillText(name, size / 2, size * 1.2);
      return trimCanvas(c, 10);
    }
    if (!uploadSrc) { toast("Choose an image of your signature first."); return null; }
    const out = await processUpload();
    if (!out) { toast("That image looks blank after removing the background. Try unticking the option."); return null; }
    return out;
  }

  function openSigModal(kind) {
    modalKind = kind;
    el.modalTitle.textContent = kind === "sig" ? "Your signature" : "Your initials";
    el.typeName.placeholder = kind === "sig" ? "e.g. Ryan McCarthy" : "e.g. RM";
    strokes = []; uploadSrc = null; el.uploadPreview.hidden = true;
    refreshFontCards();
    $$(".swatch").forEach(s => s.setAttribute("aria-checked", String(s.dataset.ink === state.ink)));
    el.modal.showModal();
    showTab("draw");
    return new Promise(res => { modalResolve = res; });
  }
  function closeModal(ok) { el.modal.close(); if (modalResolve) { modalResolve(ok); modalResolve = null; } }
  el.modalCancel.addEventListener("click", () => closeModal(false));
  el.modal.addEventListener("cancel", e => { e.preventDefault(); closeModal(false); });
  el.modal.addEventListener("click", e => { if (e.target === el.modal) closeModal(false); });
  el.modalSave.addEventListener("click", async () => {
    const out = await buildSignature();
    if (!out) return;
    state[modalKind] = out;
    store.set(modalKind, JSON.stringify(out));
    renderSigCards();
    closeModal(true);
    toast(modalKind === "sig" ? "Signature saved on this device." : "Initials saved on this device.");
  });
  el.editSigBtn.addEventListener("click", () => openSigModal("sig"));
  el.editIniBtn.addEventListener("click", () => openSigModal("ini"));
  window.addEventListener("resize", () => { if (el.modal.open && modalTab === "draw") sizePad(); });

  function renderSigCards() {
    const put = (box, s, btn, label) => {
      box.innerHTML = "";
      if (s) { const i = document.createElement("img"); i.src = s.src; i.alt = label; box.appendChild(i); btn.textContent = "Change"; }
      else { const n = document.createElement("span"); n.className = "sig-none"; n.textContent = `No ${label.toLowerCase()} yet`; box.appendChild(n); btn.textContent = `Create ${label.toLowerCase()}`; }
    };
    put(el.sigPreview, state.sig, el.editSigBtn, "Signature");
    put(el.iniPreview, state.ini, el.editIniBtn, "Initials");
  }

  /* --------------------------------------------------------------- export */
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return PDFLib.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  }

  async function exportSigned() {
    const { PDFDocument, StandardFonts, degrees } = PDFLib;
    const doc = await PDFDocument.load(state.bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const imgCache = new Map();
    const embed = async src => {
      if (imgCache.has(src)) return imgCache.get(src);
      const bytes = Uint8Array.from(atob(src.split(",")[1]), ch => ch.charCodeAt(0));
      const img = await doc.embedPng(bytes);
      imgCache.set(src, img);
      return img;
    };
    for (const f of state.fields) {
      const page = doc.getPage(f.page);
      const vp = state.pages[f.page].vp1;
      const W = vp.width, H = vp.height;
      const x = f.x * W, y = f.y * H, w = f.w * W, h = f.h * H;
      const BL = vp.convertToPdfPoint(x, y + h), BR = vp.convertToPdfPoint(x + w, y + h), TL = vp.convertToPdfPoint(x, y);
      const angle = Math.atan2(BR[1] - BL[1], BR[0] - BL[0]) * 180 / Math.PI;
      if (f.type === "sig" || f.type === "ini") {
        const img = await embed(f.src);
        page.drawImage(img, {
          x: BL[0], y: BL[1],
          width: Math.hypot(BR[0] - BL[0], BR[1] - BL[1]),
          height: Math.hypot(TL[0] - BL[0], TL[1] - BL[1]),
          rotate: degrees(angle)
        });
      } else if (f.text && f.text.trim()) {
        const size = h * 0.6;
        // baseline sits ~0.65 of the box down; 0.3em left padding matches the on-screen box
        const base = vp.convertToPdfPoint(x + 0.3 * size, y + 0.655 * h);
        page.drawText(f.text, { x: base[0], y: base[1], size, font, color: hexToRgb(f.color), rotate: degrees(angle) });
      }
    }
    return await doc.save();
  }

  async function deliver(bytes, filename) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    // Inside a claude.ai artifact the page can't download on its own; hand the file to the viewer.
    if (window.claude && typeof window.claude.use === "function") {
      try {
        const dl = await window.claude.use("downloads");
        if (dl) {
          try { await dl.save({ filename, data: blob }); toast("Signed PDF saved."); }
          catch (e) { if (e && e.code === "declined") return; toast("Couldn't save the file here."); }
          return;
        }
      } catch { /* fall through to a normal download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    toast("Signed PDF downloaded.");
  }

  el.downloadBtn.addEventListener("click", async () => {
    if (!state.pdf) return;
    if (!state.fields.length) { toast("Nothing placed yet. Add a signature, date or text first."); return; }
    select(null);
    el.downloadBtn.disabled = true;
    try {
      const bytes = await exportSigned();
      const base = state.name.replace(/\.[^.]+$/, "") || "document";
      await deliver(bytes, `${base}-signed.pdf`);
    } catch (err) {
      console.error(err);
      toast("Couldn't build the signed PDF. Try opening the file again.", 5000);
    } finally { el.downloadBtn.disabled = false; }
  });

  /* --------------------------------------------------------------- sample */
  async function samplePdf() {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;
    const doc = await PDFDocument.create();
    const page = doc.addPage([595.28, 841.89]);
    const reg = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const ink = rgb(0.1, 0.11, 0.14), grey = rgb(0.45, 0.48, 0.55), line = rgb(0.8, 0.82, 0.86);
    const L = 64;
    let y = 770;
    const t = (s, size, f = reg, color = ink, x = L) => { page.drawText(s, { x, y, size, font: f, color }); };
    t("SAMPLE DOCUMENT", 9, bold, grey); y -= 26;
    t("Quote acceptance", 24, bold); y -= 20;
    t("Try Quick Ink on this page, then open one of your own documents.", 11, reg, grey); y -= 36;
    page.drawLine({ start: { x: L, y }, end: { x: 595.28 - L, y }, thickness: 1, color: line }); y -= 28;

    const rows = [["Quote number", "Q-2026-0418"], ["Prepared for", "Example Pty Ltd"], ["Job", "Lead follow-up automation, 3 workflows"], ["Fixed price", "$2,400 inc. GST"], ["Delivery", "Within 7 days of acceptance"]];
    for (const [k, v] of rows) { t(k, 10.5, reg, grey); t(v, 11, reg, ink, 220); y -= 22; }
    y -= 14;
    const para = ["By signing below you accept the quote above and the terms supplied with it.", "Work starts once this signed copy is returned. There is no lock-in and no ongoing", "fee unless a support plan is chosen separately."];
    for (const l of para) { t(l, 11); y -= 17; }
    y -= 40;
    const box = (label, x, w) => {
      page.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: 1, color: ink });
      page.drawText(label, { x, y: y - 14, size: 9, font: reg, color: grey });
    };
    box("Signature", L, 250); box("Date", 360, 170);
    y -= 70;
    box("Full name", L, 250); box("Initials", 360, 80);
    page.drawText("Page 1 of 1", { x: 595.28 - L - 52, y: 40, size: 9, font: reg, color: grey });
    return await doc.save();
  }

  /* ----------------------------------------------------------------- init */
  async function init() {
    refreshDateOptions();
    setInk(state.ink);
    renderSigCards();
    try { await loadPdf(await samplePdf(), "Quote acceptance.pdf", true); }
    catch (e) { console.error(e); }
  }
  init();
})();
