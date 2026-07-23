/* Stowly — single-page app (mock data, no backend) */
"use strict";

/* ---------------------------------------------------------------- icons */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.3V21h13V9.3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5"/>',
  plane: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
  box: '<path d="M21 8.2 12 3 3 8.2v7.6l9 5.2 9-5.2V8.2z"/><path d="m3 8.2 9 5.2 9-5.2"/><path d="M12 13.4V21"/>',
  chat: '<path d="M4 4h16v12H10l-4.5 4V16H4V4z"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  star: '<path d="m12 2.5 2.9 6.2 6.6.7-4.9 4.5 1.4 6.6L12 17l-6 3.5 1.4-6.6L2.5 9.4l6.6-.7L12 2.5z"/>',
  shield: '<path d="M12 2.5 20 5.5v5.7c0 4.8-3.4 8.3-8 9.8-4.6-1.5-8-5-8-9.8V5.5l8-3z"/><path d="m8.5 11.5 2.5 2.5 4.5-4.5"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12.5h.01"/><path d="M3 9.5h18"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  weight: '<path d="M8 7a4 4 0 1 1 8 0"/><path d="M5 7h14l2 13H3L5 7z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
  alert: '<path d="M12 3 1.8 20.2h20.4L12 3z"/><path d="M12 10v4.5M12 17.6h.01"/>',
  id: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.5-1.6 1.7-2.3 3-2.3s2.5.7 3 2.3M14.5 9.5H19M14.5 13H19"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7a4 4 0 1 1 8 0v3.5"/>'
};
const icon = (n, cls) =>
  `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
const starFill = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6.2 6.6.7-4.9 4.5 1.4 6.6L12 17l-6 3.5 1.4-6.6L2.5 9.4l6.6-.7L12 2.5z"/></svg>';

/* ---------------------------------------------------------------- data */
const CITY = {
  SYD: "Sydney", MEL: "Melbourne", BNE: "Brisbane", LAX: "Los Angeles",
  SIN: "Singapore", NRT: "Tokyo", LHR: "London", AKL: "Auckland",
  DPS: "Denpasar", HKG: "Hong Kong", DXB: "Dubai", SFO: "San Francisco"
};
const DB = {
  user: { name: "Ryan", initials: "RM", rating: 4.9, trips: 23 },
  earnings: [
    { m: "Feb", v: 210 }, { m: "Mar", v: 345 }, { m: "Apr", v: 290 },
    { m: "May", v: 460 }, { m: "Jun", v: 585 }, { m: "Jul", v: 640 }
  ],
  carriers: [
    { id: "c1", name: "Sofia L.", av: 1, rating: 4.9, trips: 41, from: "SYD", to: "LAX", date: "Aug 2", airline: "QF 11 · Qantas", kg: 14, price: 22, bag: "Checked" },
    { id: "c2", name: "Marcus W.", av: 2, rating: 4.8, trips: 27, from: "SYD", to: "SIN", date: "Jul 29", airline: "SQ 232 · Singapore Air", kg: 8, price: 18, bag: "Checked" },
    { id: "c3", name: "Aiko T.", av: 3, rating: 5.0, trips: 63, from: "MEL", to: "NRT", date: "Aug 5", airline: "JL 774 · JAL", kg: 10, price: 20, bag: "Carry-on + checked" },
    { id: "c4", name: "Priya N.", av: 4, rating: 4.7, trips: 19, from: "SYD", to: "LHR", date: "Aug 9", airline: "QF 1 · Qantas", kg: 16, price: 26, bag: "Checked" },
    { id: "c5", name: "Daniel K.", av: 5, rating: 4.9, trips: 34, from: "BNE", to: "AKL", date: "Jul 27", airline: "NZ 146 · Air NZ", kg: 6, price: 12, bag: "Carry-on" },
    { id: "c6", name: "Emma R.", av: 0, rating: 4.8, trips: 22, from: "SYD", to: "DPS", date: "Aug 12", airline: "JQ 37 · Jetstar", kg: 12, price: 15, bag: "Checked" }
  ],
  myTrips: [
    { id: "t1", from: "SYD", to: "LAX", date: "Aug 14", airline: "QF 11 · Qantas", kg: 12, kgLeft: 7, price: 22, requests: 3, status: "live" },
    { id: "t2", from: "SYD", to: "SIN", date: "Sep 2", airline: "QF 81 · Qantas", kg: 10, kgLeft: 10, price: 18, requests: 1, status: "live" },
    { id: "t3", from: "MEL", to: "SYD", date: "Jul 12", airline: "VA 838 · Virgin", kg: 8, kgLeft: 0, price: 10, requests: 0, status: "done" }
  ],
  shipments: [
    { id: "s1", role: "carrying", other: "Jess P.", av: 4, item: "Sealed camera lens box", kg: 3.2, fee: 70, from: "SYD", to: "LAX", date: "Aug 14", status: "accepted",
      steps: ["Requested Jul 18", "Accepted Jul 19", "Escrow payment held", "Hand-off & in transit", "Delivered", "Payment released"], step: 2 },
    { id: "s2", role: "carrying", other: "Tom H.", av: 5, item: "Vitamins & skincare (sealed)", kg: 2.0, fee: 44, from: "SYD", to: "LAX", date: "Aug 14", status: "transit",
      steps: ["Requested Jul 15", "Accepted Jul 16", "Escrow payment held", "Hand-off & in transit", "Delivered", "Payment released"], step: 3 },
    { id: "s3", role: "sending", other: "Aiko T.", av: 3, item: "Gift box for family", kg: 4.5, fee: 90, from: "MEL", to: "NRT", date: "Aug 5", status: "pending",
      steps: ["Requested Jul 22", "Awaiting acceptance", "Escrow payment", "Hand-off & in transit", "Delivered", "Payment released"], step: 0 },
    { id: "s4", role: "sending", other: "Daniel K.", av: 5, item: "Documents folder", kg: 0.8, fee: 15, from: "BNE", to: "AKL", date: "Jul 10", status: "done",
      steps: ["Requested Jul 2", "Accepted Jul 3", "Escrow payment held", "Hand-off & in transit", "Delivered Jul 10", "Payment released Jul 11"], step: 5 }
  ],
  activity: [
    { t: "Escrow released — $15.00 from Daniel K.", s: "Documents delivered to Auckland", when: "2d", ic: "wallet" },
    { t: "New space request from Jess P.", s: "3.2 kg on SYD → LAX, Aug 14", when: "4d", ic: "box" },
    { t: "Tom H. rated you 5.0", s: "“Fast hand-off, super communicative.”", when: "5d", ic: "star" },
    { t: "Trip published", s: "SYD → SIN on Sep 2 · 10 kg available", when: "1w", ic: "plane" }
  ],
  convos: [
    { id: "m1", name: "Jess P.", av: 4, last: "Perfect, see you at the Kingsford Smith T1 café ☕", when: "09:41", msgs: [
      { me: false, t: "Hi Ryan! I saw you have 7 kg spare on the LAX flight — could you take a sealed camera lens box? 3.2 kg.", at: "Mon 18:02" },
      { me: true, t: "Hey Jess — sure, that works. It'll need to stay sealed and I'll check the contents at hand-off per Stowly rules.", at: "Mon 18:20" },
      { me: false, t: "Of course! Escrow's paid. Where should we meet before the flight?", at: "Tue 08:55" },
      { me: true, t: "T1 international, the café near check-in row F. 2 hours before boarding?", at: "Tue 09:12" },
      { me: false, t: "Perfect, see you at the Kingsford Smith T1 café ☕", at: "Tue 09:41" }
    ]},
    { id: "m2", name: "Aiko T.", av: 3, last: "I can take up to 5 kg — the gift box sounds fine.", when: "Tue", msgs: [
      { me: true, t: "Hi Aiko — I'd love to send a 4.5 kg gift box to family in Tokyo on your Aug 5 flight.", at: "Mon 14:10" },
      { me: false, t: "I can take up to 5 kg — the gift box sounds fine.", at: "Tue 07:32" }
    ]},
    { id: "m3", name: "Tom H.", av: 5, last: "Landed! Handing off tomorrow 10am as planned.", when: "Sun", msgs: [
      { me: false, t: "Landed! Handing off tomorrow 10am as planned.", at: "Sun 21:04" },
      { me: true, t: "Great flight-tracking, thanks Tom. See you then.", at: "Sun 21:15" }
    ]}
  ]
};
const STATUS = {
  pending: { cls: "p-pending", label: "Awaiting acceptance" },
  accepted: { cls: "p-accepted", label: "Accepted · escrow held" },
  transit: { cls: "p-transit", label: "In transit" },
  done: { cls: "p-done", label: "Delivered · released" },
  live: { cls: "p-accepted", label: "Live" }
};

/* ---------------------------------------------------------------- utils */
const $ = (s, r) => (r || document).querySelector(s);
const money = (n) => "$" + n.toLocaleString("en-AU");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const avatar = (initialsOrName, av, sm) => {
  const parts = initialsOrName.split(" ");
  const ini = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  return `<span class="avatar av-${av} ${sm ? "sm" : ""}" aria-hidden="true">${ini}</span>`;
};
const route = (from, to, lg) => `
  <div class="route ${lg ? "route-lg" : ""}">
    <div class="port"><b>${from}</b><span>${CITY[from] || ""}</span></div>
    <div class="path">${icon("plane")}</div>
    <div class="port"><b>${to}</b><span>${CITY[to] || ""}</span></div>
  </div>`;
const pill = (status) => `<span class="pill ${STATUS[status].cls}">${STATUS[status].label}</span>`;

let toastTimer;
function toast(msg) {
  const old = $(".toast"); if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast"; el.setAttribute("role", "status");
  el.innerHTML = icon("check") + esc(msg);
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2600);
}
function openModal(html) {
  closeModal();
  const veil = document.createElement("div");
  veil.className = "modal-veil";
  veil.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  veil.addEventListener("click", (e) => { if (e.target === veil) closeModal(); });
  document.body.appendChild(veil);
  const first = veil.querySelector("input, select, button");
  if (first) first.focus();
}
function closeModal() { const v = $(".modal-veil"); if (v) v.remove(); }
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ---------------------------------------------------------------- chart */
function earningsChart() {
  const d = DB.earnings, W = 560, H = 210, padL = 38, padB = 26, padT = 14;
  const max = 700, innerW = W - padL - 8, innerH = H - padT - padB;
  const bw = Math.min(34, (innerW / d.length) * 0.5);
  const x = (i) => padL + (innerW / d.length) * (i + 0.5);
  const y = (v) => padT + innerH * (1 - v / max);
  const gridVals = [0, 175, 350, 525, 700];
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Earnings by month, February to July">`;
  gridVals.forEach((v) => {
    s += `<line x1="${padL}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" stroke="var(--grid-line)" stroke-width="1"/>` +
         `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--ink-3)" style="font-variant-numeric:tabular-nums">${v ? "$" + v : "0"}</text>`;
  });
  d.forEach((p, i) => {
    const bh = innerH * (p.v / max), last = i === d.length - 1;
    s += `<g class="bar-g" data-i="${i}">` +
         `<rect class="bar-fill" x="${x(i) - bw / 2}" y="${y(p.v)}" width="${bw}" height="${Math.max(bh, 3)}" rx="4" fill="var(--accent)" opacity="${last ? 1 : 0.55}"/>` +
         `<rect class="bar-hit" x="${x(i) - bw}" y="${padT}" width="${bw * 2}" height="${innerH}"/>` +
         `</g>` +
         `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--ink-2)">${p.m}</text>`;
    if (last) s += `<text x="${x(i)}" y="${y(p.v) - 8}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)" style="font-variant-numeric:tabular-nums">$${p.v}</text>`;
  });
  s += "</svg>";
  return s;
}
function wireChart(wrap) {
  const tip = document.createElement("div");
  tip.className = "chart-tip"; wrap.appendChild(tip);
  wrap.querySelectorAll(".bar-g").forEach((g) => {
    const i = +g.dataset.i, p = DB.earnings[i];
    const fill = g.querySelector(".bar-fill");
    g.addEventListener("mouseenter", () => {
      fill.classList.add("hot");
      const r = fill.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      tip.style.left = r.left - w.left + r.width / 2 + "px";
      tip.style.top = r.top - w.top + "px";
      tip.innerHTML = `${money(p.v)}<small>${p.m} 2026 earnings</small>`;
      tip.style.opacity = 1;
    });
    g.addEventListener("mouseleave", () => { fill.classList.remove("hot"); tip.style.opacity = 0; });
  });
}

/* ---------------------------------------------------------------- views */
function topbar(eyebrow, title, sub, actions) {
  return `<div class="topbar">
    <div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ""}</div>
    <div class="topbar-actions">${actions || ""}</div>
  </div>`;
}

function viewDashboard() {
  const total = DB.earnings.reduce((a, b) => a + b.v, 0);
  const nextTrip = DB.myTrips[0];
  const active = DB.shipments.filter((s) => s.status !== "done");
  return `
  ${topbar("Overview", "Good morning, Ryan", "Here's how your spare kilos are working for you.",
    `<button class="btn btn-quiet" data-act="new-request">${icon("box")} Send something</button>
     <button class="btn btn-primary" data-act="new-trip">${icon("plus")} List a trip</button>`)}
  <div class="grid grid-stats">
    <div class="card stat"><div class="label">${icon("wallet")} Total earned</div>
      <div class="value">${money(total)}<small> AUD</small></div>
      <span class="delta up">↑ 9.4% vs last 6 mo</span></div>
    <div class="card stat"><div class="label">${icon("weight")} Space shared</div>
      <div class="value">46<small> kg</small></div>
      <span class="delta up">↑ 12 kg this quarter</span></div>
    <div class="card stat"><div class="label">${icon("box")} Active shipments</div>
      <div class="value">${active.length}</div>
      <span class="delta flat">1 awaiting your reply</span></div>
    <div class="card stat"><div class="label">${icon("star")} Carrier rating</div>
      <div class="value">${DB.user.rating}</div>
      <span class="delta flat">${DB.user.trips} trips completed</span></div>
  </div>
  <div class="grid grid-2 mt">
    <div class="stack">
      <div class="card">
        <div class="card-head"><span class="card-title">Earnings</span><span class="hint">Feb – Jul 2026 · released escrow</span></div>
        <div class="chart-wrap" id="chart"></div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-title">Active shipments</span>
          <button class="btn-ghost btn btn-sm" data-nav="shipments">View all ${icon("arrow")}</button></div>
        <div class="rowlist">${active.map((s) => `
          <div class="rowitem">
            ${avatar(s.other, s.av, true)}
            <div class="grow"><div class="t">${esc(s.item)}</div>
            <div class="s">${s.role === "carrying" ? "Carrying for" : "Sent with"} ${esc(s.other)} · ${s.from} → ${s.to} · ${s.kg} kg</div></div>
            ${pill(s.status)}
            <div class="end"><div class="t">${money(s.fee)}</div></div>
          </div>`).join("")}
        </div>
      </div>
    </div>
    <div class="stack">
      <div class="card">
        <div class="card-head"><span class="card-title">Next trip</span>${pill("live")}</div>
        ${route(nextTrip.from, nextTrip.to, true)}
        <div class="trip-meta mt">
          <span class="chip">${icon("cal")} ${nextTrip.date}</span>
          <span class="chip">${icon("plane")} ${nextTrip.airline}</span>
          <span class="chip">${icon("weight")} ${nextTrip.kgLeft} of ${nextTrip.kg} kg left</span>
        </div>
        <div class="notice">${icon("shield")}<span><b>${nextTrip.requests} space requests</b> waiting on this trip. Accepting all three earns an estimated <b>$129</b>.</span></div>
        <div class="modal-actions" style="margin-top:14px">
          <button class="btn btn-primary btn-sm" data-nav="trips">Review requests</button>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-title">Recent activity</span></div>
        <div class="rowlist">${DB.activity.map((a) => `
          <div class="rowitem">
            <span class="verify-ic" style="width:32px;height:32px;flex-basis:32px">${icon(a.ic)}</span>
            <div class="grow"><div class="t">${esc(a.t)}</div><div class="s">${esc(a.s)}</div></div>
            <span class="tiny muted" style="font-variant-numeric:tabular-nums">${a.when}</span>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function carrierCard(c) {
  return `<div class="card trip-card">
    <div class="trip-top">
      ${avatar(c.name, c.av)}
      <div class="who"><b>${esc(c.name)} ${icon("shield")}</b>
        <span>${starFill} ${c.rating} · ${c.trips} trips</span></div>
      ${pill("live")}
    </div>
    ${route(c.from, c.to)}
    <div class="trip-meta">
      <span class="chip">${icon("cal")} ${c.date}</span>
      <span class="chip">${icon("plane")} ${c.airline}</span>
      <span class="chip">${icon("weight")} ${c.kg} kg spare · ${c.bag.toLowerCase()}</span>
    </div>
    <div class="trip-foot">
      <span class="price">${money(c.price)}<small> / kg</small></span>
      <button class="btn btn-primary btn-sm" data-book="${c.id}">Request space</button>
    </div>
  </div>`;
}

function viewFind() {
  return `
  ${topbar("Marketplace", "Find spare space", "Verified travellers with unused baggage allowance on upcoming flights.")}
  <div class="searchbar">
    <div class="field"><label for="sf">From</label><input id="sf" placeholder="Sydney (SYD)" value="Sydney (SYD)"></div>
    <div class="field"><label for="st">To</label><input id="st" placeholder="Anywhere"></div>
    <div class="field"><label for="sd">Departing</label><input id="sd" placeholder="Any date"></div>
    <button class="btn btn-primary" data-act="search">${icon("search")} Search</button>
  </div>
  <div class="grid grid-cards">${DB.carriers.map(carrierCard).join("")}</div>`;
}

function viewTrips() {
  return `
  ${topbar("Carrier mode", "My trips", "List a flight, set a price per kilo, and earn from allowance you'd otherwise waste.",
    `<button class="btn btn-primary" data-act="new-trip">${icon("plus")} List a trip</button>`)}
  <div class="grid grid-cards">
    ${DB.myTrips.map((t) => `
    <div class="card trip-card">
      <div class="trip-top">
        <div class="who"><b>${t.airline}</b><span>${t.date} · listed ${money(t.price)}/kg</span></div>
        ${pill(t.status === "done" ? "done" : "live")}
      </div>
      ${route(t.from, t.to)}
      <div class="trip-meta">
        <span class="chip">${icon("weight")} ${t.kgLeft} of ${t.kg} kg unsold</span>
        <span class="chip">${icon("box")} ${t.requests} request${t.requests === 1 ? "" : "s"}</span>
      </div>
      <div class="trip-foot">
        <span class="price">${money(Math.round((t.kg - t.kgLeft) * t.price))}<small> booked</small></span>
        ${t.requests ? `<button class="btn btn-quiet btn-sm" data-act="review-req">Review requests</button>` : `<span class="tiny muted">No pending requests</span>`}
      </div>
    </div>`).join("")}
  </div>`;
}

function shipmentCard(s) {
  return `<div class="card">
    <div class="card-head"><span class="card-title">${esc(s.item)}</span>${pill(s.status)}</div>
    <div class="trip-top" style="margin-bottom:12px">
      ${avatar(s.other, s.av, true)}
      <div class="who"><span>${s.role === "carrying" ? "Carrying for" : "Sent with"} ${esc(s.other)} · ${s.kg} kg · ${s.from} → ${s.to} · ${s.date}</span></div>
    </div>
    <div class="timeline">
      ${s.steps.map((st, i) => `
        <div class="tl-step ${i < s.step ? "done" : i === s.step ? "now" : "todo"}">
          <span class="tl-dot"></span>
          <div class="tl-body"><b>${esc(st)}</b>${i === s.step && s.status !== "done" ? `<span>Current step</span>` : ""}</div>
        </div>`).join("")}
    </div>
    <div class="trip-foot" style="margin-top:14px">
      <span class="price">${money(s.fee)}<small> ${s.status === "done" ? "released" : "in escrow"}</small></span>
      <button class="btn btn-quiet btn-sm" data-nav="messages">Message ${esc(s.other.split(" ")[0])}</button>
    </div>
  </div>`;
}

function viewShipments(tab) {
  tab = tab || "all";
  const list = DB.shipments.filter((s) => tab === "all" || s.role === tab);
  return `
  ${topbar("Escrow protected", "Shipments", "Every hand-off is ID-checked, sealed-contents verified, and paid through escrow.",
    `<div class="seg" role="tablist">
      <button role="tab" class="${tab === "all" ? "active" : ""}" data-tab="all">All</button>
      <button role="tab" class="${tab === "carrying" ? "active" : ""}" data-tab="carrying">Carrying</button>
      <button role="tab" class="${tab === "sending" ? "active" : ""}" data-tab="sending">Sending</button>
    </div>`)}
  <div class="grid grid-cards">${list.map(shipmentCard).join("") || `
    <div class="card empty">${icon("box")}<b>Nothing here yet</b><p>Shipments you ${tab === "carrying" ? "carry" : "send"} will appear here.</p></div>`}
  </div>`;
}

function viewMessages(activeId) {
  const convo = DB.convos.find((c) => c.id === (activeId || state.convo)) || DB.convos[0];
  state.convo = convo.id;
  return `
  ${topbar("Inbox", "Messages", "Coordinate hand-offs without sharing your phone number.")}
  <div class="chat-layout">
    <div class="card" style="padding:10px">
      ${DB.convos.map((c) => `
        <button class="convo ${c.id === convo.id ? "active" : ""}" data-convo="${c.id}">
          ${avatar(c.name, c.av, true)}
          <span class="grow"><b>${esc(c.name)}</b><p>${esc(c.last)}</p></span>
          <time>${c.when}</time>
        </button>`).join("")}
    </div>
    <div class="card chat-pane">
      <div class="chat-head">${avatar(convo.name, convo.av, true)}
        <div class="who"><b style="font-size:14.5px;letter-spacing:-0.01em">${esc(convo.name)}</b>
        <div class="tiny muted">Verified traveller ${icon("shield", "ic-mini")}</div></div>
      </div>
      <div class="chat-scroll" id="chat-scroll">
        ${convo.msgs.map((m) => `<div class="msg ${m.me ? "me" : "them"}">${esc(m.t)}<time>${m.at}</time></div>`).join("")}
      </div>
      <form class="chat-input" data-chat="${convo.id}">
        <input placeholder="Message ${esc(convo.name.split(" ")[0])}…" aria-label="Message" autocomplete="off">
        <button class="btn btn-primary btn-sm" type="submit">${icon("send")} Send</button>
      </form>
    </div>
  </div>`;
}

function viewProfile() {
  return `
  ${topbar("Account", "Profile & trust", "Verification is what lets carriers and senders trust each other with their bags.")}
  <div class="grid grid-2">
    <div class="stack">
      <div class="card">
        <div class="trip-top" style="margin-bottom:6px">
          <span class="avatar av-0" style="width:52px;height:52px;flex-basis:52px;font-size:18px">RM</span>
          <div class="who"><b style="font-size:17px">Ryan M. ${icon("shield")}</b>
            <span>${starFill} 4.9 · 23 trips · Sydney, Australia · member since 2024</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-title">Verification</span><span class="pill p-done">Level 3 · Trusted</span></div>
        <div class="verify-row"><span class="verify-ic">${icon("id")}</span>
          <div class="grow"><b>Government ID</b><span>Passport verified · expires 2031</span></div>${icon("check", "ic-inline")}</div>
        <div class="verify-row"><span class="verify-ic">${icon("phone")}</span>
          <div class="grow"><b>Phone & email</b><span>+61 ••• ••• 482 · ryan@…com.au</span></div>${icon("check", "ic-inline")}</div>
        <div class="verify-row"><span class="verify-ic">${icon("plane")}</span>
          <div class="grow"><b>Frequent flyer link</b><span>Qantas FF connected · flights auto-verified</span></div>${icon("check", "ic-inline")}</div>
        <div class="verify-row"><span class="verify-ic">${icon("wallet")}</span>
          <div class="grow"><b>Payout method</b><span>NAB ••6021 · payouts within 24 h of release</span></div>
          <button class="btn btn-ghost btn-sm">Edit</button></div>
      </div>
    </div>
    <div class="stack">
      <div class="card">
        <div class="card-head"><span class="card-title">Safety rules</span></div>
        <p class="tiny muted" style="line-height:1.6">Every Stowly hand-off follows three non-negotiables:</p>
        <div class="verify-row"><span class="verify-ic">${icon("search")}</span>
          <div class="grow"><b>Inspect everything you carry</b><span>Open and check contents together at hand-off — you pack it, you own it.</span></div></div>
        <div class="verify-row"><span class="verify-ic">${icon("alert")}</span>
          <div class="grow"><b>Prohibited items are auto-declined</b><span>No liquids over limits, batteries, restricted or dutiable goods.</span></div></div>
        <div class="verify-row"><span class="verify-ic">${icon("lock")}</span>
          <div class="grow"><b>Escrow until delivery</b><span>Payment only releases when the receiver confirms with a one-time code.</span></div></div>
      </div>
      <div class="card">
        <div class="card-head"><span class="card-title">Payouts</span><span class="hint">Last 30 days</span></div>
        <div class="rowlist">
          <div class="rowitem"><div class="grow"><div class="t">Escrow release — Daniel K.</div><div class="s">Jul 11 · documents, 0.8 kg</div></div><div class="end"><div class="t" style="color:var(--good)">+$15.00</div></div></div>
          <div class="rowitem"><div class="grow"><div class="t">Escrow release — Mia S.</div><div class="s">Jul 4 · sealed retail goods, 5 kg</div></div><div class="end"><div class="t" style="color:var(--good)">+$110.00</div></div></div>
          <div class="rowitem"><div class="grow"><div class="t">Service fee (10%)</div><div class="s">Jul 4</div></div><div class="end"><div class="t">−$11.00</div></div></div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------------------------------------------------------- modals */
function modalNewTrip() {
  openModal(`
    <h2>List a trip</h2>
    <p class="sub">Turn your unused allowance into earnings. Flights are auto-verified against the airline.</p>
    <form id="f-trip" class="form-grid">
      <div class="f"><label for="nt-from">From</label><input id="nt-from" placeholder="SYD" required></div>
      <div class="f"><label for="nt-to">To</label><input id="nt-to" placeholder="LAX" required></div>
      <div class="f"><label for="nt-date">Departure</label><input id="nt-date" type="date" required></div>
      <div class="f"><label for="nt-flight">Flight no.</label><input id="nt-flight" placeholder="QF 11"></div>
      <div class="f"><label for="nt-kg">Spare space (kg)</label><input id="nt-kg" type="number" min="1" max="30" value="10" required></div>
      <div class="f"><label for="nt-price">Price per kg (AUD)</label><input id="nt-price" type="number" min="1" value="20" required></div>
      <div class="f wide"><label for="nt-bag">Where it travels</label>
        <select id="nt-bag"><option>Checked bag</option><option>Carry-on</option><option>Carry-on + checked</option></select></div>
    </form>
    <div class="notice">${icon("shield")}<span>You'll inspect every item at hand-off and can decline anything on the spot. Escrow pays out 24 h after confirmed delivery.</span></div>
    <div class="modal-actions">
      <button class="btn btn-quiet" data-act="close">Cancel</button>
      <button class="btn btn-primary" data-act="save-trip">Publish trip</button>
    </div>`);
}
function modalNewRequest() {
  openModal(`
    <h2>Send something</h2>
    <p class="sub">Tell carriers what you're sending — matching trips will be suggested instantly.</p>
    <form class="form-grid">
      <div class="f"><label for="nr-from">From</label><input id="nr-from" placeholder="SYD" required></div>
      <div class="f"><label for="nr-to">To</label><input id="nr-to" placeholder="NRT" required></div>
      <div class="f wide"><label for="nr-item">What is it?</label><input id="nr-item" placeholder="e.g. Sealed gift box — clothes and books" required></div>
      <div class="f"><label for="nr-kg">Weight (kg)</label><input id="nr-kg" type="number" min="0.1" step="0.1" value="2" required></div>
      <div class="f"><label for="nr-by">Needed by</label><input id="nr-by" type="date"></div>
    </form>
    <div class="notice">${icon("alert")}<span>Restricted items (batteries, liquids over limits, dutiable goods) are automatically declined at review.</span></div>
    <div class="modal-actions">
      <button class="btn btn-quiet" data-act="close">Cancel</button>
      <button class="btn btn-primary" data-act="save-request">Post request</button>
    </div>`);
}
function modalBook(c) {
  openModal(`
    <h2>Request space with ${esc(c.name)}</h2>
    <p class="sub">${c.from} → ${c.to} · ${c.date} · ${c.airline}</p>
    ${route(c.from, c.to)}
    <form class="form-grid" style="margin-top:16px">
      <div class="f wide"><label for="bk-item">What are you sending?</label><input id="bk-item" placeholder="e.g. Sealed box of skincare products" required></div>
      <div class="f"><label for="bk-kg">Weight (kg)</label><input id="bk-kg" type="number" min="0.1" step="0.1" max="${c.kg}" value="2" required></div>
      <div class="f"><label>Estimated fee</label><input id="bk-fee" value="${money(c.price * 2)} + 10% service" disabled></div>
    </form>
    <div class="notice">${icon("lock")}<span>Your payment is held in escrow and only released to ${esc(c.name.split(" ")[0])} once delivery is confirmed with your one-time code.</span></div>
    <div class="modal-actions">
      <button class="btn btn-quiet" data-act="close">Cancel</button>
      <button class="btn btn-primary" data-act="send-book" data-name="${esc(c.name.split(" ")[0])}">Send request</button>
    </div>`);
  const kg = $("#bk-kg"), fee = $("#bk-fee");
  if (kg) kg.addEventListener("input", () => { fee.value = money(Math.round((+kg.value || 0) * c.price)) + " + 10% service"; });
}

/* ---------------------------------------------------------------- router */
const VIEWS = {
  dashboard: { label: "Dashboard", ic: "home", render: viewDashboard },
  find: { label: "Find space", ic: "search", render: viewFind },
  trips: { label: "My trips", ic: "plane", render: viewTrips },
  shipments: { label: "Shipments", ic: "box", render: viewShipments, badge: 3 },
  messages: { label: "Messages", ic: "chat", render: viewMessages, badge: 2 },
  profile: { label: "Profile", ic: "person", render: viewProfile }
};
const state = { view: "dashboard", tab: "all", convo: "m1" };

function render() {
  const app = $("#app");
  app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon("plane")}</span><span class="brand-name">Stowly</span></div>
      ${Object.entries(VIEWS).map(([k, v]) => `
        <button class="nav-item ${state.view === k ? "active" : ""}" data-nav="${k}">
          ${icon(v.ic)}<span class="nav-label">${v.label}</span>${v.badge ? `<span class="badge">${v.badge}</span>` : ""}
        </button>`).join("")}
      <div class="sidebar-foot">
        <div class="me-chip">${avatar("Ryan M", 0, true)}
          <span class="who"><b>Ryan M.</b><span>Trusted · Level 3</span></span></div>
      </div>
    </aside>
    <main class="main"><div class="main-inner">
      ${VIEWS[state.view].render(state.view === "shipments" ? state.tab : undefined)}
    </div></main>
  </div>`;
  const chart = $("#chart");
  if (chart) { chart.innerHTML = earningsChart(); wireChart(chart); }
  const scroll = $("#chat-scroll");
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}

/* ---------------------------------------------------------------- events */
document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) { state.view = nav.dataset.nav; render(); window.scrollTo(0, 0); return; }
  const tab = e.target.closest("[data-tab]");
  if (tab) { state.tab = tab.dataset.tab; render(); return; }
  const convo = e.target.closest("[data-convo]");
  if (convo) { state.convo = convo.dataset.convo; render(); return; }
  const book = e.target.closest("[data-book]");
  if (book) { modalBook(DB.carriers.find((c) => c.id === book.dataset.book)); return; }
  const act = e.target.closest("[data-act]");
  if (!act) return;
  switch (act.dataset.act) {
    case "new-trip": modalNewTrip(); break;
    case "new-request": modalNewRequest(); break;
    case "close": closeModal(); break;
    case "save-trip": closeModal(); toast("Trip published — you're live in the marketplace"); break;
    case "save-request": closeModal(); toast("Request posted — 4 matching carriers notified"); break;
    case "send-book": closeModal(); toast(`Request sent to ${act.dataset.name} — escrow reserved`); break;
    case "review-req": state.view = "shipments"; state.tab = "carrying"; render(); break;
    case "search": toast("6 carriers found on your route"); break;
  }
});
document.addEventListener("submit", (e) => {
  const form = e.target.closest("[data-chat]");
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector("input");
  const text = input.value.trim();
  if (!text) return;
  const convo = DB.convos.find((c) => c.id === form.dataset.chat);
  convo.msgs.push({ me: true, t: text, at: "Now" });
  convo.last = text;
  render();
});

render();
