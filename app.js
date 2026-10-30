// Plaza en Racha: camino de lecciones por tema, cinco tipos de ejercicio,
// vidas, XP, combos, estrellas, racha diaria, ranking y Pildi, la mascota.
// El progreso se guarda en este navegador (localStorage); el ranking, en la base compartida del artifact.

(function () {
  const KEY = "plaza-en-racha-v2";
  const MAX_HEARTS = 5;
  const HEART_MS = 20 * 60 * 1000;      // una vida nueva cada 20 minutos
  const DAILY_GOAL = 30;                // XP de la meta diaria
  const LESSONS_PER_UNIT = 5;           // 4 lecciones + 1 repaso del tema
  const LESSON_LEN = 8;
  const UNIT_COLORS = ["var(--mint)", "var(--sky)", "var(--tang)", "var(--berry)", "var(--violet)"];
  const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
  const $ = (id) => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PILDI = `
    <defs>
      <linearGradient id="pdTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62e9b8"/><stop offset="1" stop-color="#12b27a"/></linearGradient>
      <linearGradient id="pdBot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#efe3ca"/></linearGradient>
    </defs>
    <g class="body">
      <ellipse cx="60" cy="134" rx="28" ry="4.5" fill="#000" opacity=".13"/>
      <rect x="45" y="114" width="10" height="15" rx="5" fill="#17332c"/>
      <rect x="65" y="114" width="10" height="15" rx="5" fill="#17332c"/>
      <ellipse cx="48.5" cy="129.5" rx="8.5" ry="4.8" fill="#ff7a59" stroke="#17332c" stroke-width="2.5"/>
      <ellipse cx="71.5" cy="129.5" rx="8.5" ry="4.8" fill="#ff7a59" stroke="#17332c" stroke-width="2.5"/>
      <g class="arm l"><path d="M33 80 q-11 4 -15 15" fill="none" stroke="#17332c" stroke-width="5" stroke-linecap="round"/><circle cx="18" cy="96" r="5.5" fill="#fffdf7" stroke="#17332c" stroke-width="3"/></g>
      <g class="arm r"><path d="M87 80 q11 4 15 15" fill="none" stroke="#17332c" stroke-width="5" stroke-linecap="round"/><circle cx="102" cy="96" r="5.5" fill="#fffdf7" stroke="#17332c" stroke-width="3"/></g>
      <path d="M30 68 V48 a30 30 0 0 1 60 0 V68 Z" fill="url(#pdTop)"/>
      <path d="M30 68 V92 a30 30 0 0 0 60 0 V68 Z" fill="url(#pdBot)"/>
      <rect x="30" y="18" width="60" height="104" rx="30" fill="none" stroke="#17332c" stroke-width="3.5"/>
      <line x1="30" y1="68" x2="90" y2="68" stroke="#17332c" stroke-width="3"/>
      <path d="M40 40 a22 22 0 0 1 12 -12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>
      <circle cx="38.5" cy="49" r="2.4" fill="#fff" opacity=".7"/>
      <g transform="rotate(-9 60 18)">
        <path d="M41 23 q19 -17 38 0 l-2.5 6 q-16.5 -7 -33 0 z" fill="#fff" stroke="#17332c" stroke-width="3" stroke-linejoin="round"/>
        <rect x="58" y="9.5" width="4" height="11" rx="1" fill="#ff5d7a"/><rect x="54.5" y="13" width="11" height="4" rx="1" fill="#ff5d7a"/>
      </g>
      <g class="eyes-open">
        <circle cx="48" cy="53" r="8.5" fill="#fff"/><circle cx="72" cy="53" r="8.5" fill="#fff"/>
        <circle cx="49" cy="54" r="5" fill="#17332c"/><circle cx="73" cy="54" r="5" fill="#17332c"/>
        <circle cx="51" cy="51.8" r="1.8" fill="#fff"/><circle cx="75" cy="51.8" r="1.8" fill="#fff"/>
      </g>
      <g class="eyes-happy" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M40 56 q8 -11 16 0"/><path d="M64 56 q8 -11 16 0"/></g>
      <g class="eyes-closed" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M40 53 q8 6 16 0"/><path d="M64 53 q8 6 16 0"/></g>
      <g class="brows" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"><path d="M40 43 l12 -4"/><path d="M80 43 l-12 -4"/></g>
      <ellipse cx="40" cy="77" rx="5.5" ry="3.3" fill="#ff8fa3" opacity=".75"/>
      <ellipse cx="80" cy="77" rx="5.5" ry="3.3" fill="#ff8fa3" opacity=".75"/>
      <path class="mouth-smile" d="M52 75 q8 8 16 0" fill="none" stroke="#17332c" stroke-width="3.6" stroke-linecap="round"/>
      <g class="mouth-big"><path d="M49 73 h22 q-1.5 15 -11 15 q-9.5 0 -11 -15 z" fill="#17332c"/><ellipse cx="60" cy="84" rx="5.5" ry="3" fill="#ff7a8a"/></g>
      <path class="mouth-sad" d="M52 82 q8 -8 16 0" fill="none" stroke="#17332c" stroke-width="3.6" stroke-linecap="round"/>
      <ellipse class="mouth-o" cx="60" cy="79" rx="4" ry="5" fill="#17332c"/>
      <path class="tear" d="M41 62 q-4 7 0 9.5 q4 -2.5 0 -9.5 z" fill="#7cc6f2"/>
      <path class="sweat" d="M92 34 q-5 8 0 11 q5 -3 0 -11 z" fill="#7cc6f2"/>
      <g class="sparks" fill="#ffbb26">
        <path d="M10 44 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5z"/>
        <path d="M110 30 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z"/>
        <path d="M108 108 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z"/>
        <path d="M12 112 l1.6 3.2 3.2 1.6 -3.2 1.6 -1.6 3.2 -1.6 -3.2 -3.2 -1.6 3.2 -1.6z"/>
      </g>
      <g class="zz" fill="#7a948c" font-family="sans-serif" font-weight="900"><text x="94" y="26" font-size="15">z</text><text x="105" y="13" font-size="11">z</text></g>
    </g>`;

  const SAY = {
    ok: ["¡Eso es!", "¡Plaza a la vista!", "¡Así se estudia!", "¡Muy bien!", "¡Lo clavas!", "¡De libro!", "¡Impecable!"],
    bad: ["Uy, casi. Esta la repetimos al final.", "Tranqui, fallando se aprende.", "Apúntatela, que cae.", "La próxima es tuya."],
    combo: (n) => `¡${n} seguidas! Estás que ardes.`,
    low: "Cuidado, te queda una vida.",
    home: {
      fresh: ["¡Hola! Soy Pildi. Vamos a por tu plaza, lección a lección.", "Una lección al día y la plaza se acerca sola."],
      risk: ["¡Hoy aún no has estudiado! No dejes que se apague la racha.", "Tu racha te espera. ¿Una lección rapidita?"],
      done: ["¡Meta diaria cumplida! Has abierto el cofre de hoy.", "Hoy ya has cumplido. Si quieres, otra lección."],
      going: ["¡Bien! Sigue un poco más hasta llenar el cofre.", "Ya queda menos para la meta de hoy."],
      tap: ["¡Ji, ji! Eso hace cosquillas.", "Dato: la Ley General de Sanidad es de 1986.", "Dato: el art. 43 de la Constitución protege la salud.", "Repasar las falladas es lo que más sube la nota.", "¡A por la plaza!"],
      locked: "Primero termina la lección anterior."
    }
  };

  // ---------- Utilidades ----------
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => dayKey(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const icon = (id, cls = "ico") => `<svg class="${cls}"><use href="#${id.includes("-") ? id : "i-" + id}"/></svg>`;
  const unitColor = (tema) => UNIT_COLORS[Math.max(0, TEMAS.indexOf(tema)) % UNIT_COLORS.length];
  function replay(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }

  // ---------- Estado ----------
  const fresh = () => ({ xp: 0, xpDia: {}, racha: 0, mejor: 0, ultimoDia: null, progreso: {}, estrellas: {}, falladas: [], vidas: MAX_HEARTS, vidasTs: Date.now(), sonido: true });
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return fresh(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* seguimos en memoria */ } }
  let state = load();

  const liveStreak = () => (state.ultimoDia === today() || state.ultimoDia === yesterday()) ? state.racha : 0;
  const xpToday = () => state.xpDia[today()] || 0;

  function regenHearts() {
    if (state.vidas >= MAX_HEARTS) { state.vidasTs = Date.now(); return; }
    const gained = Math.floor((Date.now() - state.vidasTs) / HEART_MS);
    if (gained > 0) {
      state.vidas = Math.min(MAX_HEARTS, state.vidas + gained);
      state.vidasTs += gained * HEART_MS;
      save();
    }
  }
  const nextHeartIn = () => Math.max(1, Math.ceil((HEART_MS - (Date.now() - state.vidasTs)) / 60000));

  // ---------- Sonido: pequeño sintetizador de campanillas y marimba ----------
  const A = { ctx: null, out: null };
  function audio() {
    if (!state.sonido) return null;
    try {
      if (!A.ctx) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const master = ctx.createGain(); master.gain.value = 0.55;
        const comp = ctx.createDynamicsCompressor();
        // Eco suave para dar espacio a las melodías
        const delay = ctx.createDelay(); delay.delayTime.value = 0.16;
        const fb = ctx.createGain(); fb.gain.value = 0.25;
        const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 2600;
        const wet = ctx.createGain(); wet.gain.value = 0.22;
        master.connect(comp);
        master.connect(delay); delay.connect(tone); tone.connect(fb); fb.connect(delay); tone.connect(wet); wet.connect(comp);
        comp.connect(ctx.destination);
        A.ctx = ctx; A.out = master;
      }
      if (A.ctx.state === "suspended") A.ctx.resume();
      return A.ctx;
    } catch (e) { return null; }
  }
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const TIMBRE = {
    bell: [[1, 1, 1], [2, 0.32, 0.6], [3.01, 0.12, 0.35], [4.2, 0.05, 0.25]],
    marimba: [[1, 1, 1], [4, 0.18, 0.18], [10, 0.04, 0.06]],
    soft: [[1, 1, 1], [2, 0.12, 0.8]]
  };
  function note(midi, at = 0, { timbre = "bell", dur = 0.6, vol = 0.18 } = {}) {
    const ctx = audio(); if (!ctx) return;
    const t = ctx.currentTime + at + 0.01, f = mtof(midi);
    TIMBRE[timbre].forEach(([ratio, gain, len]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f * ratio;
      const d = dur * len;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol * gain, t + (timbre === "soft" ? 0.04 : 0.006));
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(A.out);
      o.start(t); o.stop(t + d + 0.05);
    });
  }
  function thump(at = 0) {
    const ctx = audio(); if (!ctx) return;
    const t = ctx.currentTime + at + 0.01;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.18);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(A.out); o.start(t); o.stop(t + 0.3);
  }
  const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  const sfx = {
    tap: () => note(91, 0, { timbre: "marimba", dur: 0.15, vol: 0.08 }),
    select: () => note(79, 0, { timbre: "marimba", dur: 0.3, vol: 0.12 }),
    ok: (combo = 1) => {
      // Arpegio alegre que sube de tono con cada acierto seguido
      const base = 72 + PENTA[Math.min(combo - 1, 5)];
      [0, 4, 7, 12].forEach((s, i) => note(base + s, i * 0.075, { timbre: "bell", dur: 0.7, vol: 0.15 }));
      note(base + 19, 0.3, { timbre: "bell", dur: 0.9, vol: 0.05 });
    },
    bad: () => { note(64, 0, { timbre: "marimba", dur: 0.5, vol: 0.17 }); note(60, 0.16, { timbre: "marimba", dur: 0.7, vol: 0.17 }); },
    heart: () => thump(0.12),
    pair: (n) => note(76 + PENTA[Math.min(n, 8)], 0, { timbre: "bell", dur: 0.55, vol: 0.14 }),
    combo: () => [0, 2, 4, 7, 9, 12, 14].forEach((s, i) => note(84 + s, i * 0.045, { timbre: "bell", dur: 0.4, vol: 0.06 })),
    star: (i) => { note([79, 83, 88][i], 0, { timbre: "bell", dur: 1, vol: 0.17 }); note([91, 95, 100][i], 0.05, { timbre: "bell", dur: 0.8, vol: 0.05 }); },
    win: () => {
      const mel = [[72, 0], [76, 0.12], [79, 0.24], [84, 0.36], [79, 0.52], [84, 0.64], [88, 0.76]];
      mel.forEach(([m, t]) => note(m, t, { timbre: "bell", dur: 0.6, vol: 0.14 }));
      [60, 64, 67, 72].forEach((m) => note(m, 0.76, { timbre: "soft", dur: 1.6, vol: 0.07 }));
    },
    streak: () => [67, 71, 74, 79].forEach((m, i) => note(m, i * 0.09, { timbre: "soft", dur: 1.2, vol: 0.09 })),
    fail: () => [67, 64, 62, 60].forEach((m, i) => note(m, i * 0.2, { timbre: "marimba", dur: 0.8, vol: 0.14 })),
    open: () => { note(72, 0, { timbre: "marimba", dur: 0.3, vol: 0.1 }); note(79, 0.07, { timbre: "marimba", dur: 0.4, vol: 0.1 }); }
  };

  // ---------- Mascota ----------
  // Cada copia lleva sus propios degradados: los de una pantalla oculta no se pintan en las demás.
  document.querySelectorAll("[data-mascot]").forEach((s, i) => { s.innerHTML = PILDI.replace(/pd(Top|Bot)/g, `pd$1${i}`); });
  const moodTimers = new WeakMap();
  function mood(svg, s, ms) {
    clearTimeout(moodTimers.get(svg));
    svg.dataset.state = "idle";
    void svg.getBoundingClientRect();     // reinicia la animación aunque se repita el estado
    svg.dataset.state = s;
    if (ms) moodTimers.set(svg, setTimeout(() => { svg.dataset.state = "idle"; }, ms));
  }
  function say(bubble, text) { bubble.textContent = text; replay(bubble, "pop"); }

  // ---------- Efectos: partículas, confeti, textos flotantes ----------
  const fx = { cv: $("fx"), ctx: $("fx").getContext("2d"), parts: [], running: false };
  function cssColor(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#ffbb26"; }
  function fxLoop() {
    const { cv, ctx } = fx;
    const W = cv.width = innerWidth, H = cv.height = innerHeight;
    ctx.clearRect(0, 0, W, H);
    fx.parts = fx.parts.filter((p) => p.life > 0);
    fx.parts.forEach((p) => {
      p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 25); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if (p.kind === "star") {
        ctx.beginPath();
        for (let k = 0; k < 8; k++) { const rad = k % 2 ? p.s * 0.4 : p.s; const a = (k * Math.PI) / 4; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
        ctx.closePath(); ctx.fill();
      } else if (p.kind === "dot") { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s * 0.35, p.s, p.s * 0.7);
      ctx.restore();
    });
    if (fx.parts.length) requestAnimationFrame(fxLoop); else { fx.running = false; ctx.clearRect(0, 0, W, H); }
  }
  function addParts(list) {
    if (reduced) return;
    fx.parts.push(...list);
    if (!fx.running) { fx.running = true; requestAnimationFrame(fxLoop); }
  }
  function burst(node, colorVars = ["--mint", "--sun", "--sky"]) {
    if (!node) return;
    const r = node.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const colors = colorVars.map(cssColor);
    addParts(Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2 + Math.random() * 0.3, sp = 3 + Math.random() * 4;
      return { x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, g: 0.12, drag: 0.94, r: Math.random() * 3, vr: 0.1, s: 3 + Math.random() * 4, c: pick(colors), life: 40 + Math.random() * 15, kind: i % 3 ? "star" : "dot" };
    }));
  }
  function confetti() {
    const colors = ["--tang", "--sun", "--mint", "--sky", "--violet", "--berry"].map(cssColor);
    const W = innerWidth;
    addParts(Array.from({ length: 160 }, (_, i) => ({
      x: i % 2 ? -10 : W + 10, y: innerHeight * 0.55, vx: (i % 2 ? 1 : -1) * (5 + Math.random() * 9), vy: -10 - Math.random() * 10,
      g: 0.32, drag: 0.985, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, s: 7 + Math.random() * 7, c: pick(colors), life: 150 + Math.random() * 50, kind: "rect"
    })));
  }
  function floatText(node, text) {
    if (!node) return;
    const r = node.getBoundingClientRect();
    const f = el("div", "floater", text);
    f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.top - 6 + "px";
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1100);
  }
  function countUp(node, from, to, ms = 700) {
    if (reduced || from === to) { node.textContent = to; return; }
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ---------- Generación de ejercicios ----------
  const normaParts = (n) => { const m = n.n.match(/^(.*) (\d+)\/(\d{4})$/); return m && { pre: m[1], num: m[2], year: m[3] }; };

  function exFromQuestion(q, kind) {
    if (kind === "vf") {
      const isTrue = Math.random() < 0.5;
      const wrong = shuffle(q.o.map((_, i) => i).filter((i) => i !== q.c))[0];
      return { type: "vf", q, tema: q.tema, claim: q.o[isTrue ? q.c : wrong], isTrue };
    }
    const order = shuffle([0, 1, 2, 3]);
    return { type: "mc", q, tema: q.tema, options: order.map((i) => q.o[i]), correct: order.indexOf(q.c) };
  }
  function exBlank(norma) {
    const p = normaParts(norma);
    const others = shuffle([...new Set(NORMAS.map(normaParts).filter(Boolean).map((x) => x.num).filter((x) => x !== p.num))]).slice(0, 3);
    return { type: "blank", tema: norma.tema, norma, before: `${p.pre} `, after: `/${p.year}, de ${norma.fecha}, ${norma.t}`, answer: p.num, chips: shuffle([p.num, ...others]) };
  }
  function exMatch(tema) {
    const set = [...shuffle(NORMAS.filter((n) => n.tema === tema)), ...shuffle(NORMAS.filter((n) => n.tema !== tema))].slice(0, 4);
    return { type: "match", tema, pairs: set, left: shuffle(set), right: shuffle(set) };
  }
  function exOrder(tema) {
    const pool = [...shuffle(NORMAS.filter((n) => n.tema === tema)), ...shuffle(NORMAS.filter((n) => n.tema !== tema))];
    const set = [];
    pool.forEach((n) => { if (set.length < 4 && !set.some((s) => s.f.slice(0, 4) === n.f.slice(0, 4))) set.push(n); });
    return { type: "order", tema, items: shuffle(set), answer: set.slice().sort((a, b) => a.f.localeCompare(b.f)) };
  }
  function buildLesson(tema, idx) {
    const qs = shuffle(PREGUNTAS.filter((q) => q.tema === tema));
    const ns = shuffle(NORMAS.filter((n) => n.tema === tema && normaParts(n)));
    const review = idx === LESSONS_PER_UNIT - 1;
    const ex = [];
    qs.forEach((q, i) => ex.push(exFromQuestion(q, (i + idx) % 2 ? "vf" : "mc")));
    if (ns.length) ex.push(exBlank(ns[0]));
    if (ns.length > 1 && review) ex.push(exBlank(ns[1]));
    ex.push(exMatch(tema));
    if (idx >= 1) ex.push(exOrder(tema));
    let k = 0;   // si el tema es corto, repetimos preguntas en el otro formato
    while (ex.length < LESSON_LEN && qs.length) { const q = qs[k++ % qs.length]; ex.push(exFromQuestion(q, Math.random() < 0.5 ? "vf" : "mc")); }
    return shuffle(ex).slice(0, review ? LESSON_LEN + 2 : LESSON_LEN);
  }
  function buildPractice() {
    const failed = PREGUNTAS.filter((q) => state.falladas.includes(q.id));
    const pool = shuffle(failed.length ? failed : PREGUNTAS).slice(0, 6);
    const ex = pool.map((q) => exFromQuestion(q, Math.random() < 0.4 ? "vf" : "mc"));
    ex.push(exMatch(pick(TEMAS)));
    return shuffle(ex);
  }

  // ---------- Pantallas ----------
  function show(id) {
    ["home", "lesson", "end", "rank"].forEach((s) => { const n = $(s); n.hidden = s !== id; if (s === id) replay(n, "screen"); });
    window.scrollTo(0, 0);
  }

  let shownXp = null;
  function renderHud() {
    regenHearts();
    const r = liveStreak();
    $("hStreak").lastChild.textContent = r;
    $("hStreak").classList.toggle("cold", state.ultimoDia !== today());
    const xpNode = $("hXp").lastChild;
    if (shownXp !== null && shownXp !== state.xp) { countUp(xpNode, shownXp, state.xp, 900); replay($("hXp"), "bump"); }
    else xpNode.textContent = state.xp;
    shownXp = state.xp;
    $("hHearts").lastChild.textContent = state.vidas;
    $("hHearts").title = state.vidas < MAX_HEARTS ? `Vidas · próxima en ${nextHeartIn()} min` : "Vidas al máximo";
    $("soundBtn").innerHTML = icon(state.sonido ? "sound" : "mute");
    $("soundBtn").setAttribute("aria-label", state.sonido ? "Silenciar sonido" : "Activar sonido");
  }

  function homeMessage() {
    const x = xpToday();
    if (x >= DAILY_GOAL) return { t: pick(SAY.home.done), m: "happy" };
    if (x > 0) return { t: pick(SAY.home.going), m: "idle" };
    if (liveStreak() > 0) return { t: pick(SAY.home.risk), m: "worried" };
    if (state.xp > 0) return { t: pick(SAY.home.risk), m: "sleep" };
    return { t: pick(SAY.home.fresh), m: "idle" };
  }

  function renderWeek() {
    const box = $("week");
    box.innerHTML = "";
    const now = new Date();
    const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const k = dayKey(d);
      const lit = (state.xpDia[k] || 0) > 0;
      const c = el("div", "day" + (lit ? " lit" : "") + (k === today() ? " today" : ""));
      c.innerHTML = `<span class="f">${icon("flame")}</span>${DAYS[i]}`;
      box.appendChild(c);
    }
  }

  function renderHome() {
    renderHud();
    renderWeek();
    const x = xpToday();
    $("goalTxt").textContent = `${Math.min(x, DAILY_GOAL)} / ${DAILY_GOAL} XP`;
    requestAnimationFrame(() => { $("goalBar").style.width = Math.min(100, (x / DAILY_GOAL) * 100) + "%"; });
    $("goalChest").classList.toggle("full", x >= DAILY_GOAL);
    const msg = homeMessage();
    say($("homeBubble"), msg.t);
    mood($("hMascot"), msg.m);
    const nf = state.falladas.length;
    $("practiceSub").textContent = nf ? `${nf} ${nf === 1 ? "fallada" : "falladas"} por repasar` : "Sin gastar vidas";

    const units = $("units");
    units.innerHTML = "";
    const STEP = 108, TOP = 40, NODE = 72, W = 260;
    TEMAS.forEach((tema, u) => {
      const done = Math.min(state.progreso[tema] || 0, LESSONS_PER_UNIT);
      const stars = state.estrellas[tema] || [];
      const color = UNIT_COLORS[u % UNIT_COLORS.length];
      const unit = el("div", "unit");

      const banner = el("div", "banner");
      banner.style.setProperty("--c", color);
      banner.innerHTML = `<span class="label">Unidad ${u + 1}</span>${icon("u-" + (u % 9), "big")}`;
      banner.appendChild(el("h2", null, tema));
      const totalStars = stars.reduce((a, b) => a + (b || 0), 0);
      const prog = el("div", "prog");
      prog.innerHTML = `<span class="bar"><i style="width:${(done / LESSONS_PER_UNIT) * 100}%"></i></span><span>${done}/${LESSONS_PER_UNIT}</span>${icon("star")}<span>${totalStars}</span>`;
      banner.appendChild(prog);
      unit.appendChild(banner);

      // Mapa: monedas unidas por un camino curvo
      const sign = u % 2 ? -1 : 1;
      const offs = [0, 56, 72, 30, -30].map((o) => o * sign);
      const pts = offs.map((o, i) => [W / 2 + o, TOP + i * STEP + NODE / 2]);
      const H = TOP + (LESSONS_PER_UNIT - 1) * STEP + NODE + 46;
      const curve = (list) => list.map((p, i) => i === 0 ? `M${p[0]} ${p[1]}` : `C${list[i - 1][0]} ${list[i - 1][1] + STEP / 2} ${p[0]} ${p[1] - STEP / 2} ${p[0]} ${p[1]}`).join(" ");
      const map = el("div", "map");
      map.style.height = H + "px";
      map.innerHTML = `<svg class="road" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <path d="${curve(pts)}" fill="none" stroke="var(--line)" stroke-width="20" stroke-linecap="round"/>
        ${done > 0 ? `<path d="${curve(pts.slice(0, Math.min(done, LESSONS_PER_UNIT - 1) + 1))}" fill="none" stroke="${color}" stroke-opacity=".45" stroke-width="20" stroke-linecap="round"/>` : ""}
        <path d="${curve(pts)}" fill="none" stroke="var(--surface)" stroke-width="3" stroke-dasharray="1 14" stroke-linecap="round"/>
      </svg>`;
      for (let i = 0; i < LESSONS_PER_UNIT; i++) {
        const status = i < done ? "done" : i === done ? "current" : "locked";
        const review = i === LESSONS_PER_UNIT - 1;
        const b = el("button", `node ${status}${review ? " review" : ""}`);
        b.style.setProperty("--c", color);
        b.style.left = `calc(50% + ${offs[i]}px)`;
        b.style.top = TOP + i * STEP - (review ? 4 : 0) + "px";
        b.setAttribute("aria-label", `${tema}: ${review ? "repaso del tema" : "lección " + (i + 1)} (${status === "done" ? "hecha" : status === "current" ? "siguiente" : "bloqueada"})`);
        b.innerHTML = icon(status === "locked" ? "lock" : status === "done" ? (review ? "trophy" : "check") : review ? "trophy" : i === 0 && done === 0 ? "play" : "star");
        if (status === "current") b.appendChild(el("span", "tag", done === 0 ? "EMPEZAR" : "SIGUIENTE"));
        if (status === "done") {
          const st = el("span", "stars");
          st.innerHTML = [0, 1, 2].map((k) => icon("star", "ico" + (k < (stars[i] || 1) ? " on" : ""))).join("");
          b.appendChild(st);
        }
        b.onclick = () => {
          if (status === "locked") {
            replay(b, "nudge"); sfx.bad();
            say($("homeBubble"), SAY.home.locked); mood($("hMascot"), "worried", 1500); return;
          }
          startLesson({ mode: "unit", tema, idx: i, exercises: buildLesson(tema, i) });
        };
        map.appendChild(b);
      }
      unit.appendChild(map);
      units.appendChild(unit);
    });
  }

  // ---------- Lección ----------
  let L = null;   // lección en curso
  const KIND = { mc: "Elige la respuesta", vf: "¿Verdadero o falso?", blank: "Completa la norma", match: "Empareja las normas", order: "Ordena por fecha" };

  function startLesson(opts) {
    sfx.open();
    regenHearts();
    if (opts.mode === "unit" && state.vidas <= 0) { endFail(); return; }
    L = Object.assign({ queue: opts.exercises.slice(), total: opts.exercises.length, doneOk: 0, firstTry: 0,
      xp: 0, combo: 0, best: 0, repeated: new Set(), start: Date.now(), cur: null, checked: false, mistakes: 0 }, opts);
    show("lesson");
    mood($("lMascot"), "happy", 900);
    say($("lBubble"), opts.mode === "practice" ? "Repaso sin perder vidas. ¡Al lío!" : "¡Vamos a por ello!");
    next();
  }

  function next() {
    renderLessonBar();
    if (!L.queue.length) { finishLesson(); return; }
    L.cur = L.queue.shift();
    L.checked = false; L.pick = null; L.matchErr = false;
    $("kind").textContent = KIND[L.cur.type];
    $("fb").hidden = true;
    $("sheet").className = "sheet";
    setCheck("Comprobar", true);
    const box = $("ex");
    box.innerHTML = "";
    const card = el("div", "card");
    card.style.setProperty("--c", unitColor(L.cur.tema));
    ({ mc: renderMC, vf: renderVF, blank: renderBlank, match: renderMatch, order: renderOrder })[L.cur.type](card, L.cur);
    box.appendChild(card);
    replay(box, "ex-in");
  }

  function setCheck(label, disabled) { const b = $("checkBtn"); b.textContent = label; b.disabled = disabled; }

  function renderLessonBar() {
    $("lBar").style.width = Math.max(4, (L.doneOk / L.total) * 100) + "%";
    $("lBarBox").classList.toggle("hot", L.combo >= 3);
    $("lHearts").lastChild.textContent = L.mode === "practice" ? "∞" : state.vidas;
    const c = $("combo");
    c.hidden = L.combo < 2;
    c.innerHTML = `${icon("flame")}×${L.combo}`;
  }

  const tag = (ex) => { const t = el("span", "tema-tag", ex.tema); return t; };

  function selectIn(container, node, value) {
    if (L.checked) return;
    sfx.select();
    container.querySelectorAll(".sel").forEach((o) => o.classList.remove("sel"));
    node.classList.add("sel");
    L.pick = value;
    setCheck("Comprobar", false);
  }

  function renderMC(card, ex) {
    card.append(tag(ex), el("p", "qtext", ex.q.p));
    const opts = el("div", "opts");
    ex.options.forEach((txt, i) => {
      const b = el("button", "opt");
      b.innerHTML = `<span class="k">${i + 1}</span><span></span>`;
      b.lastChild.textContent = txt;
      b.onclick = () => selectIn(opts, b, i);
      opts.appendChild(b);
    });
    card.appendChild(opts);
  }

  function renderVF(card, ex) {
    card.append(tag(ex), el("p", "qtext", ex.q.p));
    const claim = el("div", "claim");
    claim.append(el("span", "label", "Respuesta propuesta"), el("b", null, ex.claim));
    card.appendChild(claim);
    const vf = el("div", "vf");
    [["Verdadero", true, "v", "check"], ["Falso", false, "f", "x"]].forEach(([txt, val, cls, ic]) => {
      const b = el("button", "opt " + cls);
      b.innerHTML = `${icon(ic)}<span>${txt}</span>`;
      b.onclick = () => selectIn(vf, b, val);
      vf.appendChild(b);
    });
    card.appendChild(vf);
  }

  function renderBlank(card, ex) {
    card.appendChild(tag(ex));
    const s = el("p", "sentence");
    s.append(ex.before);
    const slot = el("span", "slot", " ");
    s.append(slot, ex.after);
    card.appendChild(s);
    const bank = el("div", "bank");
    const clear = () => { L.pick = null; slot.textContent = " "; slot.classList.remove("filled"); bank.querySelectorAll(".tile").forEach((t) => t.classList.remove("used")); setCheck("Comprobar", true); };
    ex.chips.forEach((c) => {
      const b = el("button", "tile", c);
      b.onclick = () => {
        if (L.checked) return;
        sfx.select();
        if (L.pick === c) { clear(); return; }
        bank.querySelectorAll(".tile").forEach((t) => t.classList.remove("used"));
        L.pick = c; slot.textContent = c; replay(slot, "filled"); b.classList.add("used"); setCheck("Comprobar", false);
      };
      bank.appendChild(b);
    });
    slot.onclick = () => { if (!L.checked && L.pick) { sfx.tap(); clear(); } };
    card.appendChild(bank);
  }

  function renderMatch(card, ex) {
    const grid = el("div", "match");
    const left = el("div", "col"), right = el("div", "col");
    let selL = null, selR = null, matched = 0;
    function tryPair() {
      if (!selL || !selR) return;
      const a = selL, b = selR;
      selL = selR = null;
      if (a.dataset.id === b.dataset.id) {
        sfx.pair(matched);
        [a, b].forEach((t) => { t.classList.remove("sel"); t.classList.add("ok"); t.disabled = true; });
        burst(b, ["--mint", "--sun"]);
        if (++matched === ex.pairs.length) setTimeout(() => resolve(!L.matchErr, null), 250);
      } else {
        sfx.bad();
        L.matchErr = true;
        [a, b].forEach((t) => { t.classList.remove("sel"); replay(t, "no"); setTimeout(() => t.classList.remove("no"), 400); });
        mood($("lMascot"), "worried", 900);
      }
    }
    const side = (list, col, text, set) => list.forEach((n) => {
      const b = el("button", "tile", text(n));
      b.dataset.id = n.n;
      b.onclick = () => { sfx.select(); col.querySelectorAll(".sel").forEach((t) => t.classList.remove("sel")); b.classList.add("sel"); set(b); tryPair(); };
      col.appendChild(b);
    });
    side(ex.left, left, (n) => n.n, (b) => { selL = b; });
    side(ex.right, right, (n) => n.t, (b) => { selR = b; });
    grid.append(left, right);
    card.appendChild(grid);
    setCheck("Empareja todas", true);
  }

  function renderOrder(card, ex) {
    card.appendChild(el("p", "qtext", "De la norma más antigua a la más reciente:"));
    const slots = el("div", "order-slots");
    const bank = el("div", "bank");
    L.pick = [];
    function draw() {
      slots.innerHTML = "";
      ex.items.forEach((_, i) => {
        const row = el("div", "order-slot");
        row.appendChild(el("span", "num", String(i + 1)));
        const n = L.pick[i];
        if (n) {
          const t = el("button", "tile", n.t);
          t.onclick = () => { if (L.checked) return; sfx.tap(); L.pick.splice(i, 1); draw(); };
          row.appendChild(t);
        } else row.appendChild(el("div", "ph"));
        slots.appendChild(row);
      });
      bank.querySelectorAll(".tile").forEach((t) => t.classList.toggle("used", L.pick.some((p) => p.n === t.dataset.id)));
      setCheck("Comprobar", L.pick.length !== ex.items.length);
    }
    ex.items.forEach((n) => {
      const b = el("button", "tile", n.t);
      b.dataset.id = n.n;
      b.onclick = () => { if (L.checked || L.pick.includes(n)) return; sfx.select(); L.pick.push(n); draw(); };
      bank.appendChild(b);
    });
    card.append(slots, bank);
    draw();
  }

  // ---------- Corrección ----------
  function check() {
    const ex = L.cur, box = $("ex");
    let ok, solution, explain, focus = box.querySelector(".sel");
    if (ex.type === "mc") {
      ok = L.pick === ex.correct;
      box.querySelectorAll(".opts .opt").forEach((o, i) => { o.disabled = true; o.classList.remove("sel"); if (i === ex.correct) { o.classList.add("right"); focus = o; } else if (i === L.pick) o.classList.add("wrong"); });
      solution = ex.options[ex.correct]; explain = ex.q.e;
    } else if (ex.type === "vf") {
      ok = L.pick === ex.isTrue;
      box.querySelectorAll(".vf .opt").forEach((o, i) => { o.disabled = true; o.classList.remove("sel"); const val = i === 0; if (val === ex.isTrue) { o.classList.add("right"); focus = o; } else if (val === L.pick) o.classList.add("wrong"); });
      solution = `${ex.isTrue ? "Verdadero" : "Falso"}. La respuesta correcta es: ${ex.q.o[ex.q.c]}`; explain = ex.q.e;
    } else if (ex.type === "blank") {
      ok = L.pick === ex.answer;
      box.querySelectorAll(".tile").forEach((t) => { t.disabled = true; });
      focus = box.querySelector(".slot");
      solution = `${ex.norma.n}, de ${ex.norma.fecha}`; explain = ex.norma.t + ".";
    } else if (ex.type === "order") {
      ok = ex.answer.every((n, i) => L.pick[i] === n);
      box.querySelectorAll(".tile").forEach((t) => { t.disabled = true; });
      focus = box.querySelector(".order-slots");
      solution = ex.answer.map((n) => `${n.n} (${n.f.slice(0, 4)})`).join(" → ");
    }
    resolve(ok, solution, explain, focus);
  }

  function resolve(ok, solution, explain, focus) {
    const ex = L.cur;
    L.checked = true;
    const sheet = $("sheet");
    $("fb").hidden = false;
    if (ok) {
      L.combo++; L.best = Math.max(L.best, L.combo); L.doneOk++;
      if (!L.repeated.has(ex)) L.firstTry++;
      const gain = 2 + (L.combo >= 3 ? 1 : 0);
      L.xp += gain;
      if (ex.q) state.falladas = state.falladas.filter((id) => id !== ex.q.id);
      sfx.ok(L.combo);
      sheet.className = "sheet ok";
      $("fbIcon").innerHTML = icon("check");
      $("fbt").textContent = pick(SAY.ok);
      $("fbd").textContent = ex.type === "match" ? "Todas las parejas bien a la primera." : (explain || "");
      burst(focus || $("ex"));
      floatText($("lBar"), `+${gain} XP`);
      const milestone = L.combo === 3 || L.combo === 5 || L.combo % 10 === 0;
      if (milestone) { setTimeout(sfx.combo, 380); replay($("combo"), "bump"); }
      mood($("lMascot"), L.combo >= 3 ? "party" : "happy", 1400);
      say($("lBubble"), L.combo >= 3 ? SAY.combo(L.combo) : pick(SAY.ok));
    } else {
      L.combo = 0;
      L.mistakes++;
      if (ex.q && !state.falladas.includes(ex.q.id)) state.falladas.push(ex.q.id);
      if (L.mode !== "practice") {
        if (state.vidas === MAX_HEARTS) state.vidasTs = Date.now();
        state.vidas = Math.max(0, state.vidas - 1);
        sfx.heart(); replay($("lHearts"), "bump");
      }
      sfx.bad();
      replay($("lbody"), "shake");
      sheet.className = "sheet bad";
      $("fbIcon").innerHTML = icon("x");
      if (ex.type === "match") {
        $("fbt").textContent = "Casi: hubo algún fallo";
        $("fbd").textContent = "Lo repetimos al final para fijarlo.";
      } else {
        $("fbt").textContent = "Solución correcta:";
        $("fbd").textContent = solution + (explain ? ` · ${explain}` : "");
      }
      if (!L.repeated.has(ex)) {
        const again = ex.type === "match" ? exMatch(ex.tema) : ex.type === "order" ? exOrder(ex.tema) : ex.type === "blank" ? ex : exFromQuestion(ex.q, ex.type);
        L.repeated.add(again);
        L.queue.push(again);
        L.total++;
      } else {
        L.doneOk++;   // segundo fallo: no lo repetimos más para no bloquear la lección
      }
      mood($("lMascot"), "sad", 1600);
      say($("lBubble"), state.vidas === 1 && L.mode !== "practice" ? SAY.low : pick(SAY.bad));
    }
    save();
    renderLessonBar();
    setCheck("Continuar", false);
    $("checkBtn").focus({ preventScroll: true });
  }

  $("checkBtn").onclick = () => {
    if (!L) return;
    if (L.checked) {
      sfx.tap();
      if (L.mode !== "practice" && state.vidas <= 0) { endFail(); return; }
      next();
    } else check();
  };

  // ---------- Fin de lección ----------
  function finishLesson() {
    const secs = Math.round((Date.now() - L.start) / 1000);
    const perfect = L.mistakes === 0;
    const stars = perfect ? 3 : L.mistakes <= 2 ? 2 : 1;
    L.xp += 5 + (perfect ? 5 : 0);
    state.xp += L.xp;
    state.xpDia[today()] = xpToday() + L.xp;

    let newStreak = false;
    if (state.ultimoDia !== today()) {
      state.racha = state.ultimoDia === yesterday() ? state.racha + 1 : 1;
      state.ultimoDia = today();
      state.mejor = Math.max(state.mejor, state.racha);
      newStreak = true;
    }
    if (L.mode === "unit") {
      state.progreso[L.tema] = Math.max(state.progreso[L.tema] || 0, Math.min(L.idx + 1, LESSONS_PER_UNIT));
      const arr = state.estrellas[L.tema] || (state.estrellas[L.tema] = []);
      arr[L.idx] = Math.max(arr[L.idx] || 0, stars);
    }
    let extra = "";
    if (L.mode === "practice" && state.vidas < MAX_HEARTS) { state.vidas++; extra = "Has recuperado una vida. "; }
    save();
    syncRanking();

    show("end");
    $("endBox").className = "wrap end";
    mood($("eMascot"), "party");
    $("eTitle").textContent = perfect ? "¡Lección perfecta!" : stars === 2 ? "¡Muy bien hecho!" : "¡Lección completada!";
    $("eText").textContent = extra + (xpToday() >= DAILY_GOAL ? "Meta diaria cumplida: cofre abierto." : `Te faltan ${DAILY_GOAL - xpToday()} XP para la meta de hoy.`);

    const sBox = $("eStars");
    sBox.hidden = false;
    sBox.innerHTML = [0, 1, 2].map(() => icon("star")).join("");
    [...sBox.children].forEach((s, i) => setTimeout(() => {
      s.classList.add("in");
      if (i < stars) { s.classList.add("on"); sfx.star(i); burst(s, ["--sun", "--tang"]); }
    }, 450 + i * 380));

    const sc = $("eStreak");
    sc.hidden = !newStreak;
    if (newStreak) {
      $("eStreakT").textContent = state.racha === 1 ? "¡Racha encendida!" : `¡Racha de ${state.racha} días!`;
      $("eStreakS").textContent = state.racha === 1 ? "Vuelve mañana para que crezca." : "No la dejes apagar mañana.";
      setTimeout(sfx.streak, 1700);
    }

    const acc = Math.round((L.firstTry / Math.max(1, L.firstTry + L.mistakes)) * 100);
    $("eTiles").innerHTML = "";
    const tiles = [["XP ganados", L.xp, "var(--sun)", "bolt", ""], ["Precisión", acc, "var(--mint)", "check", "%"], ["Tiempo", null, "var(--sky)", null, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`]];
    tiles.forEach(([k, v, c, ic, suf]) => {
      const t = el("div", "stat"); t.style.setProperty("--c", c);
      const b = el("b");
      if (ic) b.innerHTML = icon(ic);
      const num = el("span", null, v == null ? suf : "0");
      b.appendChild(num);
      if (v != null && suf) b.append(suf);
      t.append(el("span", "label", k), b);
      $("eTiles").appendChild(t);
      if (v != null) setTimeout(() => countUp(num, 0, v, 900), 1500);
    });
    endActions([["Continuar", () => { renderHome(); show("home"); }]]);
    sfx.win();
    confetti();
    L = null;
  }

  function endFail() {
    save();
    show("end");
    $("endBox").className = "wrap end fail";
    $("eStars").hidden = true;
    $("eStreak").hidden = true;
    mood($("eMascot"), "sad");
    $("eTitle").textContent = "Te has quedado sin vidas";
    $("eText").textContent = `Recuperas una vida cada 20 minutos (la próxima en ${nextHeartIn()} min). O haz un repaso: no gasta vidas y te devuelve una.`;
    $("eTiles").innerHTML = "";
    endActions([["Repasar y ganar una vida", () => startLesson({ mode: "practice", exercises: buildPractice() })], ["Volver al mapa", () => { renderHome(); show("home"); }, true]]);
    sfx.fail();
    L = null;
  }

  function endActions(list) {
    const box = $("eActions");
    box.innerHTML = "";
    list.forEach(([txt, fn, ghost]) => { const b = el("button", "btn" + (ghost ? " ghost" : ""), txt); b.onclick = () => { sfx.tap(); fn(); }; box.appendChild(b); });
    box.firstChild.focus({ preventScroll: true });
  }

  // ---------- Ranking compartido ----------
  // Cada persona escribe solo su propio documento ranking/<id>; todos leen la lista.
  const R = { db: null, user: null, uid: null, rows: [], tab: "week", canWrite: true, mine: null, ready: false, lastSent: "" };

  function weekKey(d = new Date()) {
    const x = new Date(d); x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));   // lunes de esta semana
    return dayKey(x);
  }
  function xpThisWeek() {
    const start = weekKey();
    return Object.entries(state.xpDia).reduce((sum, [k, v]) => (k >= start ? sum + v : sum), 0);
  }

  async function initRanking() {
    if (!window.claude || !window.claude.use) { R.ready = true; return; }
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    R.db = db; R.user = user; R.ready = true;
    if (!db) { if (!$("rank").hidden) renderRanking(); return; }
    R.uid = user ? await user.id() : null;
    const can = user ? await user.can("data.write") : null;
    if (can === false || !R.uid) R.canWrite = false;
    db.collection("ranking").orderBy("xp", "desc").limit(200).onSnapshot((snap) => {
      R.rows = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      R.mine = R.rows.find((r) => r.id === R.uid) || R.mine;
      updateRankSub();
      if (!$("rank").hidden) renderRanking();
    }, () => { R.db = null; if (!$("rank").hidden) renderRanking(); });
  }

  async function syncRanking(extra) {
    if (!R.db || !R.uid || !R.canWrite) return;
    const body = {
      xp: state.xp, semana: weekKey(), xpSemana: xpThisWeek(), racha: liveStreak(),
      apodo: (extra && extra.apodo != null ? extra.apodo : (R.mine && R.mine.apodo)) || ""
    };
    const sig = JSON.stringify(body);
    if (sig === R.lastSent) return;
    R.lastSent = sig;
    try {
      await R.db.collection("ranking").doc(R.uid).set(Object.assign({ actualizado: new Date().toISOString() }, body));
    } catch (e) {
      R.lastSent = "";
      if (e && e.code === "invalid_argument") { R.canWrite = false; if (!$("rank").hidden) renderRanking(); }
    }
  }

  const weekScore = (r) => (r.semana === weekKey() ? r.xpSemana || 0 : 0);
  function updateRankSub() {
    const rows = R.rows.filter((r) => weekScore(r) > 0).sort((a, b) => weekScore(b) - weekScore(a));
    const pos = rows.findIndex((r) => r.id === R.uid);
    $("rankSub").textContent = pos >= 0 ? `Vas en el puesto ${pos + 1}` : "Compite cada semana";
  }

  let rankSeq = 0;
  async function renderRanking() {
    const seq = ++rankSeq;
    const board = $("board"), note = $("rankNote"), bubble = $("rBubble");
    $("tabWeek").setAttribute("aria-selected", R.tab === "week");
    $("tabAll").setAttribute("aria-selected", R.tab === "all");
    $("nickForm").hidden = !(R.db && R.uid && R.canWrite);
    if (document.activeElement !== $("nickInput")) $("nickInput").value = (R.mine && R.mine.apodo) || "";

    if (!R.ready) { board.innerHTML = ""; bubble.textContent = "Cargando el ranking…"; note.textContent = ""; return; }
    if (!R.db) {
      board.innerHTML = "";
      bubble.textContent = "El ranking no está disponible aquí.";
      note.textContent = "El ranking compartido solo funciona al abrir la app en claude.ai con la sesión iniciada. Tu progreso sigue guardándose en este navegador.";
      mood($("rMascot"), "worried");
      return;
    }

    const score = (r) => (R.tab === "week" ? weekScore(r) : r.xp || 0);
    const rows = R.rows.filter((r) => score(r) > 0).sort((a, b) => score(b) - score(a));
    const ps = R.user ? await R.user.profiles(rows.map((r) => r.id)) : {};
    if (seq !== rankSeq) return;      // llegó una actualización más nueva mientras esperábamos
    board.innerHTML = "";

    rows.forEach((r, i) => {
      const p = ps[r.id] || {};
      const row = el("div", "row" + (r.id === R.uid ? " me" : ""));
      row.style.animationDelay = Math.min(i, 10) * 40 + "ms";
      row.appendChild(el("span", `pos${i < 3 ? " p" + (i + 1) : ""}`, String(i + 1)));
      const img = el("img"); img.alt = ""; if (p.avatarUrl) img.src = p.avatarUrl;
      row.appendChild(img);
      const who = el("div", "who");
      const nm = r.apodo || p.name || "Opositor/a";
      who.appendChild(el("b", null, r.id === R.uid ? `${nm} (tú)` : nm));
      const sub = el("span");
      if (r.racha > 0) { sub.innerHTML = icon("flame"); sub.append(`${r.racha} ${r.racha === 1 ? "día" : "días"}`); }
      else sub.textContent = "Sin racha activa";
      who.appendChild(sub);
      row.appendChild(who);
      row.appendChild(el("span", "pts", `${score(r)} XP`));
      board.appendChild(row);
    });

    const pos = rows.findIndex((r) => r.id === R.uid);
    if (!rows.length) {
      bubble.textContent = R.tab === "week" ? "Esta semana aún no hay nadie. ¡Termina una lección y estrena el ranking!" : "Todavía no hay nadie. ¡Sé la primera persona!";
      mood($("rMascot"), "idle");
    } else if (pos === 0) {
      bubble.textContent = "¡Vas en cabeza! Defiende el puesto.";
      mood($("rMascot"), "party");
    } else if (pos > 0) {
      const gap = score(rows[pos - 1]) - score(rows[pos]) + 1;
      bubble.textContent = `Vas en el puesto ${pos + 1}. Con ${gap} XP adelantas al siguiente.`;
      mood($("rMascot"), "happy", 1400);
    } else {
      bubble.textContent = R.canWrite ? "Termina una lección para entrar en el ranking." : "Puedes ver el ranking, pero no aparecer en él.";
      mood($("rMascot"), "idle");
    }
    note.textContent = R.canWrite
      ? (R.tab === "week" ? "El ranking semanal empieza de cero cada lunes." : "Puntos acumulados desde que empezaste.")
      : "Para aparecer en el ranking, pide a quien comparte la app que te dé permiso para participar.";
  }

  function openRanking() {
    sfx.open();
    show("rank");
    renderRanking();
    syncRanking();
  }

  // ---------- Eventos ----------
  $("rankBtn").onclick = openRanking;
  $("rankBack").onclick = () => { sfx.tap(); renderHome(); show("home"); };
  $("tabWeek").onclick = () => { sfx.select(); R.tab = "week"; renderRanking(); };
  $("tabAll").onclick = () => { sfx.select(); R.tab = "all"; renderRanking(); };
  $("nickForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const apodo = $("nickInput").value.trim().slice(0, 24);
    R.mine = Object.assign({}, R.mine, { apodo });
    syncRanking({ apodo });
    $("nickInput").blur();
    sfx.ok(1);
    renderRanking();
  });
  $("quitBtn").onclick = () => { sfx.tap(); L = null; renderHome(); show("home"); };
  $("practiceBtn").onclick = () => startLesson({ mode: "practice", exercises: buildPractice() });
  $("soundBtn").onclick = () => { state.sonido = !state.sonido; save(); renderHud(); sfx.select(); };
  $("homeMascot").onclick = () => { sfx.ok(Math.ceil(Math.random() * 4)); mood($("hMascot"), "happy", 1200); say($("homeBubble"), pick(SAY.home.tap)); burst($("homeMascot"), ["--sun", "--mint"]); };

  document.addEventListener("keydown", (e) => {
    if ($("lesson").hidden || !L) return;
    if (e.key === "Enter" && !$("checkBtn").disabled) { e.preventDefault(); $("checkBtn").click(); return; }
    const n = parseInt(e.key, 10);
    if (!L.checked && n >= 1 && n <= 4) {
      const btns = $("ex").querySelectorAll(L.cur.type === "vf" ? ".vf .opt" : L.cur.type === "mc" ? ".opts .opt" : ".bank .tile:not(.used)");
      if (btns[n - 1]) btns[n - 1].click();
    }
  });

  setInterval(() => { if (!$("home").hidden) renderHud(); }, 60000);
  renderHome();
  initRanking();
})();
