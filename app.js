// Plaza en Racha: camino de lecciones por tema, cinco tipos de ejercicio,
// vidas, XP, combos, racha diaria y Pildi, la mascota que reacciona.
// El progreso se guarda solo en este navegador (localStorage).

(function () {
  const KEY = "plaza-en-racha-v2";
  const MAX_HEARTS = 5;
  const HEART_MS = 20 * 60 * 1000;      // una vida nueva cada 20 minutos
  const DAILY_GOAL = 30;                // XP de la meta diaria
  const LESSONS_PER_UNIT = 5;           // 4 lecciones + 1 repaso del tema
  const LESSON_LEN = 8;
  const LETTERS = ["A", "B", "C", "D"];
  const UNIT_COLORS = ["var(--pine)", "var(--blue)", "var(--plum)"];
  const $ = (id) => document.getElementById(id);

  const PILDI = `<g class="body">
      <ellipse cx="60" cy="124" rx="26" ry="4" fill="currentColor" opacity="0.12"/>
      <path class="arm l" d="M32 72 q-12 6 -14 18" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
      <path class="arm r" d="M88 72 q12 6 14 18" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
      <rect x="44" y="108" width="10" height="12" rx="5" fill="var(--ink)"/>
      <rect x="66" y="108" width="10" height="12" rx="5" fill="var(--ink)"/>
      <path d="M30 62 V40 a30 30 0 0 1 60 0 V62 Z" fill="var(--pine)"/>
      <path d="M30 62 V84 a30 30 0 0 0 60 0 V62 Z" fill="var(--cap)"/>
      <rect x="30" y="10" width="60" height="104" rx="30" fill="none" stroke="var(--ink)" stroke-width="3.5"/>
      <line x1="30" y1="62" x2="90" y2="62" stroke="var(--ink)" stroke-width="3"/>
      <path d="M40 30 a20 20 0 0 1 12 -11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
      <g class="eyes-open">
        <circle cx="49" cy="46" r="7.5" fill="#fff"/><circle cx="71" cy="46" r="7.5" fill="#fff"/>
        <circle cx="50" cy="47" r="4" fill="#15291f"/><circle cx="72" cy="47" r="4" fill="#15291f"/>
        <circle cx="51.5" cy="45.5" r="1.4" fill="#fff"/><circle cx="73.5" cy="45.5" r="1.4" fill="#fff"/>
      </g>
      <g class="eyes-happy" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round">
        <path d="M42 49 q7 -10 14 0"/><path d="M64 49 q7 -10 14 0"/>
      </g>
      <g class="eyes-closed" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round">
        <path d="M42 47 q7 5 14 0"/><path d="M64 47 q7 5 14 0"/>
      </g>
      <g class="brows" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">
        <path d="M42 38 l12 -4"/><path d="M78 38 l-12 -4"/>
      </g>
      <ellipse cx="41" cy="72" rx="5" ry="3" fill="#f59a9a" opacity="0.8"/>
      <ellipse cx="79" cy="72" rx="5" ry="3" fill="#f59a9a" opacity="0.8"/>
      <path class="mouth-smile" d="M52 70 q8 8 16 0" fill="none" stroke="#15291f" stroke-width="3.5" stroke-linecap="round"/>
      <path class="mouth-big" d="M49 68 h22 q-2 14 -11 14 q-9 0 -11 -14 z" fill="#15291f"/>
      <path class="mouth-sad" d="M52 77 q8 -8 16 0" fill="none" stroke="#15291f" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse class="mouth-o" cx="60" cy="74" rx="4" ry="5" fill="#15291f"/>
      <path class="tear" d="M43 54 q-3 6 0 8 q3 -2 0 -8 z" fill="#7cc6f2"/>
      <g class="zz" fill="var(--muted)" font-family="sans-serif" font-weight="700"><text x="92" y="20" font-size="14">z</text><text x="102" y="8" font-size="10">z</text></g>
    </g>`;

  const SAY = {
    ok: ["¡Eso es!", "¡Plaza a la vista!", "¡Así se estudia!", "¡Muy bien!", "¡Lo clavas!", "¡De libro!"],
    bad: ["Uy, casi. Esta la repetimos al final.", "Tranqui, fallando se aprende.", "Apúntatela, que cae.", "La próxima es tuya."],
    combo: (n) => `¡${n} seguidas! Estás en racha.`,
    low: "Cuidado, te queda una vida.",
    home: {
      fresh: ["¡Hola! Soy Pildi. Vamos a por tu plaza, lección a lección.", "Una lección al día y la plaza se acerca sola."],
      risk: ["¡Hoy aún no has estudiado! No dejes que se apague la racha.", "Tu racha te espera. ¿Una lección rapidita?"],
      done: ["¡Meta diaria cumplida! Mañana más.", "Hoy ya has cumplido. Si quieres, otra lección."],
      going: ["¡Bien! Sigue un poco más hasta la meta.", "Ya queda menos para la meta de hoy."],
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
  const icon = (id, cls = "ico") => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;

  // ---------- Estado ----------
  const fresh = () => ({ xp: 0, xpDia: {}, racha: 0, mejor: 0, ultimoDia: null, progreso: {}, falladas: [], vidas: MAX_HEARTS, vidasTs: Date.now(), sonido: true });
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
  function nextHeartIn() {
    const ms = HEART_MS - (Date.now() - state.vidasTs);
    return Math.max(1, Math.ceil(ms / 60000));
  }

  // ---------- Sonido ----------
  let actx = null;
  function tone(freq, start, dur, type = "sine", vol = 0.15) {
    if (!state.sonido) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime + start;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* sin audio */ }
  }
  const sfx = {
    tap: () => tone(520, 0, 0.06, "triangle", 0.06),
    ok: () => { tone(660, 0, 0.12, "triangle"); tone(990, 0.09, 0.2, "triangle"); },
    bad: () => { tone(220, 0, 0.18, "sawtooth", 0.07); tone(170, 0.12, 0.25, "sawtooth", 0.07); },
    pair: () => tone(880, 0, 0.1, "triangle", 0.1),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle", 0.13)),
    fail: () => [392, 330, 262].forEach((f, i) => tone(f, i * 0.18, 0.35, "sine", 0.12))
  };

  // ---------- Mascota ----------
  document.querySelectorAll("[data-mascot]").forEach((s) => { s.innerHTML = PILDI; });
  const moodTimers = new WeakMap();
  function mood(svg, s, ms) {
    clearTimeout(moodTimers.get(svg));
    svg.dataset.state = "idle";
    void svg.getBoundingClientRect();     // reinicia la animación aunque se repita el estado
    svg.dataset.state = s;
    if (ms) moodTimers.set(svg, setTimeout(() => { svg.dataset.state = "idle"; }, ms));
  }
  function say(bubble, text) {
    bubble.textContent = text;
    bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
  }

  // ---------- Confeti ----------
  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = $("confetti"), ctx = cv.getContext("2d");
    const W = cv.width = innerWidth, H = cv.height = innerHeight;
    const css = getComputedStyle(document.documentElement);
    const colors = ["--flame", "--gold", "--pine", "--blue", "--plum", "--heart"].map((v) => css.getPropertyValue(v).trim());
    const parts = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.35, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, c: pick(colors)
    }));
    let frame = 0;
    (function step() {
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (++frame < 160) requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
    })();
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
    const own = shuffle(NORMAS.filter((n) => n.tema === tema));
    const rest = shuffle(NORMAS.filter((n) => n.tema !== tema));
    const set = [...own, ...rest].slice(0, 4);
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
    // Rellenamos con las mismas preguntas en el otro formato si el tema es corto.
    let k = 0;
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

  // ---------- Inicio ----------
  function show(id) {
    ["home", "lesson", "end", "rank"].forEach((s) => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function renderTopChips() {
    regenHearts();
    const r = liveStreak();
    $("hStreak").lastChild.textContent = r;
    $("hStreak").classList.toggle("cold", state.ultimoDia !== today());
    $("hXp").lastChild.textContent = state.xp;
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

  function renderHome() {
    renderTopChips();
    const x = xpToday();
    $("goalTxt").textContent = `${Math.min(x, DAILY_GOAL)} / ${DAILY_GOAL} XP`;
    $("goalBar").style.width = Math.min(100, (x / DAILY_GOAL) * 100) + "%";
    const msg = homeMessage();
    say($("homeBubble"), msg.t);
    mood($("hMascot"), msg.m);
    const nf = state.falladas.length;
    $("practiceBtn").textContent = nf ? `Repasar falladas (${nf})` : "Práctica libre";

    const units = $("units");
    units.innerHTML = "";
    const offsets = [0, 44, 66, 44, 0, -44, -66, -44];
    TEMAS.forEach((tema, u) => {
      const done = state.progreso[tema] || 0;
      const color = UNIT_COLORS[u % UNIT_COLORS.length];
      const unit = el("div", "unit");
      const head = el("div", "unit-head");
      head.style.setProperty("--c", color);
      head.innerHTML = `<span class="label">Unidad ${u + 1} · ${Math.min(done, LESSONS_PER_UNIT)}/${LESSONS_PER_UNIT}</span>`;
      head.appendChild(el("h2", null, tema));
      unit.appendChild(head);
      const path = el("div", "path");
      for (let i = 0; i < LESSONS_PER_UNIT; i++) {
        const status = i < done ? "done" : i === done ? "current" : "locked";
        const review = i === LESSONS_PER_UNIT - 1;
        const b = el("button", `node ${status}`);
        b.style.setProperty("--c", color);
        b.style.transform = `translateX(${offsets[(i + u * 2) % offsets.length]}px)`;
        b.setAttribute("aria-label", `${tema}: ${review ? "repaso del tema" : "lección " + (i + 1)} (${status === "done" ? "hecha" : status === "current" ? "siguiente" : "bloqueada"})`);
        b.innerHTML = icon(status === "locked" ? "lock" : status === "done" ? "check" : review ? "trophy" : "star");
        if (status === "current") { const tag = el("span", "tag", i === 0 && done === 0 ? "EMPEZAR" : "SIGUIENTE"); b.appendChild(tag); }
        b.onclick = () => {
          if (status === "locked") {
            b.classList.remove("nudge"); void b.offsetWidth; b.classList.add("nudge");
            say($("homeBubble"), SAY.home.locked); mood($("hMascot"), "worried", 1500); return;
          }
          startLesson({ mode: "unit", tema, idx: i, exercises: buildLesson(tema, i) });
        };
        path.appendChild(b);
      }
      unit.appendChild(path);
      units.appendChild(unit);
    });
  }

  // ---------- Lección ----------
  let L = null;   // lección en curso

  function startLesson(opts) {
    sfx.tap();
    regenHearts();
    if (opts.mode === "unit" && state.vidas <= 0) { showNoHearts(); return; }
    L = Object.assign({ queue: opts.exercises.slice(), total: opts.exercises.length, doneOk: 0, firstTry: 0, answered: 0,
      xp: 0, combo: 0, best: 0, repeated: new Set(), start: Date.now(), cur: null, checked: false, mistakes: 0 }, opts);
    show("lesson");
    mood($("lMascot"), "happy", 900);
    say($("lBubble"), opts.mode === "practice" ? "Repaso sin perder vidas. ¡Al lío!" : "¡Vamos a por ello!");
    next();
  }

  const KIND = { mc: "Elige la respuesta correcta", vf: "¿Es correcta esta respuesta?", blank: "Completa la norma", match: "Empareja cada norma", order: "Ordena por fecha" };

  function next() {
    renderLessonBar();
    if (!L.queue.length) { finishLesson(); return; }
    L.cur = L.queue.shift();
    L.checked = false;
    L.pick = null;
    L.matchErr = false;
    $("kind").textContent = KIND[L.cur.type];
    $("fb").hidden = true;
    $("sheet").className = "sheet";
    setCheck("Comprobar", true);
    const box = $("ex");
    box.innerHTML = "";
    ({ mc: renderMC, vf: renderVF, blank: renderBlank, match: renderMatch, order: renderOrder })[L.cur.type](box, L.cur);
  }

  function setCheck(label, disabled) { const b = $("checkBtn"); b.textContent = label; b.disabled = disabled; }

  function renderLessonBar() {
    $("lBar").style.width = (L.doneOk / L.total) * 100 + "%";
    $("lHearts").lastChild.textContent = L.mode === "practice" ? "∞" : state.vidas;
    $("combo").textContent = L.combo >= 2 ? `COMBO ×${L.combo}` : "";
  }

  function qHeader(box, ex) {
    const t = el("span", "label tema-tag", ex.tema);
    box.appendChild(t);
  }

  function renderMC(box, ex) {
    const wrap = el("div", "opts");
    wrap.style.gap = "1rem";
    qHeader(wrap, ex);
    wrap.appendChild(el("p", "qtext", ex.q.p));
    const opts = el("div", "opts");
    ex.options.forEach((txt, i) => {
      const b = el("button", "opt");
      b.innerHTML = `<span class="k">${i + 1}</span><span></span>`;
      b.lastChild.textContent = txt;
      b.onclick = () => { if (L.checked) return; sfx.tap(); opts.querySelectorAll(".opt").forEach((o) => o.classList.remove("sel")); b.classList.add("sel"); L.pick = i; setCheck("Comprobar", false); };
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    box.appendChild(wrap);
  }

  function renderVF(box, ex) {
    const wrap = el("div", "opts");
    wrap.style.gap = "1rem";
    qHeader(wrap, ex);
    wrap.appendChild(el("p", "qtext", ex.q.p));
    const claim = el("div", "claim");
    claim.appendChild(el("span", "label", "Respuesta propuesta"));
    claim.appendChild(el("b", null, ex.claim));
    wrap.appendChild(claim);
    const vf = el("div", "vf");
    [["Verdadero", true], ["Falso", false]].forEach(([txt, val], i) => {
      const b = el("button", "opt");
      b.innerHTML = `<span>${txt}</span>`;
      b.dataset.k = i + 1;
      b.onclick = () => { if (L.checked) return; sfx.tap(); vf.querySelectorAll(".opt").forEach((o) => o.classList.remove("sel")); b.classList.add("sel"); L.pick = val; setCheck("Comprobar", false); };
      vf.appendChild(b);
    });
    wrap.appendChild(vf);
    box.appendChild(wrap);
  }

  function renderBlank(box, ex) {
    const wrap = el("div", "opts");
    wrap.style.gap = "1.4rem";
    qHeader(wrap, ex);
    const s = el("p", "sentence");
    s.append(ex.before);
    const slot = el("span", "slot", " ");
    s.append(slot, ex.after);
    wrap.appendChild(s);
    const bank = el("div", "bank");
    ex.chips.forEach((c) => {
      const b = el("button", "tile", c);
      b.onclick = () => {
        if (L.checked) return;
        sfx.tap();
        bank.querySelectorAll(".tile").forEach((t) => t.classList.remove("used"));
        if (L.pick === c) { L.pick = null; slot.textContent = " "; slot.classList.remove("filled"); setCheck("Comprobar", true); return; }
        L.pick = c; slot.textContent = c; slot.classList.add("filled"); b.classList.add("used"); setCheck("Comprobar", false);
      };
      bank.appendChild(b);
    });
    slot.onclick = () => { if (L.checked || !L.pick) return; L.pick = null; slot.textContent = " "; slot.classList.remove("filled"); bank.querySelectorAll(".tile").forEach((t) => t.classList.remove("used")); setCheck("Comprobar", true); };
    wrap.appendChild(bank);
    box.appendChild(wrap);
  }

  function renderMatch(box, ex) {
    const grid = el("div", "match");
    const left = el("div", "col"), right = el("div", "col");
    let selL = null, selR = null, matched = 0;
    function tryPair() {
      if (!selL || !selR) return;
      const a = selL, b = selR;
      selL = selR = null;
      if (a.dataset.id === b.dataset.id) {
        sfx.pair();
        [a, b].forEach((t) => { t.classList.remove("sel"); t.classList.add("ok"); t.disabled = true; });
        if (++matched === ex.pairs.length) resolve(!L.matchErr, null);
      } else {
        sfx.bad();
        L.matchErr = true;
        [a, b].forEach((t) => { t.classList.remove("sel"); t.classList.add("no"); setTimeout(() => t.classList.remove("no"), 400); });
        mood($("lMascot"), "worried", 900);
      }
    }
    ex.left.forEach((n) => {
      const b = el("button", "tile", n.n);
      b.dataset.id = n.n;
      b.onclick = () => { sfx.tap(); left.querySelectorAll(".sel").forEach((t) => t.classList.remove("sel")); b.classList.add("sel"); selL = b; tryPair(); };
      left.appendChild(b);
    });
    ex.right.forEach((n) => {
      const b = el("button", "tile", n.t);
      b.dataset.id = n.n;
      b.onclick = () => { sfx.tap(); right.querySelectorAll(".sel").forEach((t) => t.classList.remove("sel")); b.classList.add("sel"); selR = b; tryPair(); };
      right.appendChild(b);
    });
    grid.append(left, right);
    box.appendChild(grid);
    setCheck("Empareja todas", true);
  }

  function renderOrder(box, ex) {
    const wrap = el("div", "opts");
    wrap.style.gap = "1.2rem";
    wrap.appendChild(el("p", "qtext", "De la norma más antigua a la más reciente:"));
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
      b.onclick = () => { if (L.checked || L.pick.includes(n)) return; sfx.tap(); L.pick.push(n); draw(); };
      bank.appendChild(b);
    });
    wrap.append(slots, bank);
    box.appendChild(wrap);
    draw();
  }

  // ---------- Corrección ----------
  function check() {
    const ex = L.cur;
    let ok, solution, explain;
    if (ex.type === "mc") {
      ok = L.pick === ex.correct;
      const opts = $("ex").querySelectorAll(".opts .opts .opt");
      opts.forEach((o, i) => { o.disabled = true; o.classList.remove("sel"); if (i === ex.correct) o.classList.add("right"); else if (i === L.pick) o.classList.add("wrong"); });
      solution = ex.options[ex.correct]; explain = ex.q.e;
    } else if (ex.type === "vf") {
      ok = L.pick === ex.isTrue;
      $("ex").querySelectorAll(".vf .opt").forEach((o, i) => { o.disabled = true; o.classList.remove("sel"); const val = i === 0; if (val === ex.isTrue) o.classList.add("right"); else if (val === L.pick) o.classList.add("wrong"); });
      solution = `${ex.isTrue ? "Verdadero" : "Falso"}. La respuesta correcta es: ${ex.q.o[ex.q.c]}`; explain = ex.q.e;
    } else if (ex.type === "blank") {
      ok = L.pick === ex.answer;
      $("ex").querySelectorAll(".tile").forEach((t) => { t.disabled = true; });
      solution = `${ex.norma.n}, de ${ex.norma.fecha}`; explain = ex.norma.t + ".";
    } else if (ex.type === "order") {
      ok = ex.answer.every((n, i) => L.pick[i] === n);
      $("ex").querySelectorAll(".tile").forEach((t) => { t.disabled = true; });
      solution = ex.answer.map((n) => `${n.n} (${n.f.slice(0, 4)})`).join(" → ");
    }
    resolve(ok, solution, explain);
  }

  function resolve(ok, solution, explain) {
    const ex = L.cur;
    L.checked = true;
    L.answered++;
    const fb = $("fb"), sheet = $("sheet");
    fb.hidden = false;
    if (ok) {
      L.combo++; L.best = Math.max(L.best, L.combo); L.doneOk++;
      if (!L.repeated.has(ex)) L.firstTry++;
      const gain = 2 + (L.combo >= 3 ? 1 : 0);
      L.xp += gain;
      if (ex.q) state.falladas = state.falladas.filter((id) => id !== ex.q.id);
      sfx.ok();
      sheet.className = "sheet ok";
      $("fbt").innerHTML = `${icon("check")}<span></span>`;
      $("fbt").lastChild.textContent = pick(SAY.ok);
      $("fbd").textContent = ex.type === "match" ? "Todas las parejas bien a la primera." : (explain || "");
      mood($("lMascot"), L.combo >= 3 ? "party" : "happy", 1400);
      say($("lBubble"), L.combo >= 3 ? SAY.combo(L.combo) : pick(SAY.ok));
    } else {
      L.combo = 0;
      L.mistakes++;
      if (ex.q && !state.falladas.includes(ex.q.id)) state.falladas.push(ex.q.id);
      if (L.mode !== "practice") state.vidas = Math.max(0, state.vidas - 1);
      if (state.vidas < MAX_HEARTS && L.mode !== "practice" && state.vidas === MAX_HEARTS - 1) state.vidasTs = Date.now();
      sfx.bad();
      sheet.className = "sheet bad";
      if (ex.type === "match") {
        // Emparejar con algún fallo: cuenta como hecho, pero vuelve al final de la lección.
        $("fbt").innerHTML = `${icon("x")}<span>Casi: hubo algún fallo</span>`;
        $("fbd").textContent = "Lo repetimos al final para fijarlo.";
      } else {
        $("fbt").innerHTML = `${icon("x")}<span>Solución correcta:</span>`;
        $("fbd").textContent = solution + (explain ? ` — ${explain}` : "");
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
    $("checkBtn").focus();
  }

  $("checkBtn").onclick = () => {
    if (!L) return;
    if (L.checked) {
      if (L.mode !== "practice" && state.vidas <= 0) { endFail(); return; }
      next();
    } else check();
  };

  // ---------- Fin de lección ----------
  function finishLesson() {
    const secs = Math.round((Date.now() - L.start) / 1000);
    const perfect = L.mistakes === 0;
    let bonus = 5 + (perfect ? 5 : 0);
    L.xp += bonus;
    state.xp += L.xp;
    state.xpDia[today()] = xpToday() + L.xp;

    let streakMsg = "";
    if (state.ultimoDia !== today()) {
      state.racha = state.ultimoDia === yesterday() ? state.racha + 1 : 1;
      state.ultimoDia = today();
      state.mejor = Math.max(state.mejor, state.racha);
      streakMsg = state.racha === 1 ? "¡Racha encendida! 1 día." : `¡Racha de ${state.racha} días!`;
    }
    if (L.mode === "unit") state.progreso[L.tema] = Math.max(state.progreso[L.tema] || 0, Math.min(L.idx + 1, LESSONS_PER_UNIT));
    if (L.mode === "practice" && state.vidas < MAX_HEARTS) { state.vidas++; streakMsg += (streakMsg ? " " : "") + "Has recuperado una vida."; }
    save();
    syncRanking();

    show("end");
    $("endBox").className = "wrap end";
    mood($("eMascot"), "party");
    $("eTitle").textContent = perfect ? "¡Lección perfecta!" : "¡Lección completada!";
    $("eText").textContent = streakMsg || (xpToday() >= DAILY_GOAL ? "Meta diaria cumplida." : `Te faltan ${DAILY_GOAL - xpToday()} XP para la meta de hoy.`);
    const acc = Math.round((L.firstTry / Math.max(1, L.firstTry + L.mistakes)) * 100);
    $("eTiles").innerHTML = "";
    [["XP", "+" + L.xp, "var(--gold)"], ["Precisión", acc + "%", "var(--pine)"], ["Tiempo", `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, "var(--blue)"]].forEach(([k, v, c]) => {
      const t = el("div", "stat"); t.style.setProperty("--c", c);
      t.append(el("span", "label", k), el("b", null, v));
      $("eTiles").appendChild(t);
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
    mood($("eMascot"), "sad");
    $("eTitle").textContent = "Te has quedado sin vidas";
    $("eText").textContent = `Recuperas una vida cada 20 minutos (la próxima en ${nextHeartIn()} min). O haz un repaso: no gasta vidas y te devuelve una.`;
    $("eTiles").innerHTML = "";
    endActions([["Repasar y ganar una vida", () => startLesson({ mode: "practice", exercises: buildPractice() })], ["Volver al camino", () => { renderHome(); show("home"); }, true]]);
    sfx.fail();
    L = null;
  }

  function showNoHearts() {
    show("end");
    endFail();
  }

  function endActions(list) {
    const box = $("eActions");
    box.innerHTML = "";
    list.forEach(([txt, fn, ghost]) => { const b = el("button", "btn" + (ghost ? " ghost" : ""), txt); b.onclick = fn; box.appendChild(b); });
    box.firstChild.focus();
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

  let rankSeq = 0;
  async function renderRanking() {
    const seq = ++rankSeq;
    const board = $("board"), note = $("rankNote"), bubble = $("rBubble");
    $("tabWeek").setAttribute("aria-selected", R.tab === "week");
    $("tabAll").setAttribute("aria-selected", R.tab === "all");
    board.innerHTML = "";
    $("nickForm").hidden = !(R.db && R.uid && R.canWrite);
    if (document.activeElement !== $("nickInput")) $("nickInput").value = (R.mine && R.mine.apodo) || "";

    if (!R.ready) { bubble.textContent = "Cargando el ranking…"; note.textContent = ""; return; }
    if (!R.db) {
      bubble.textContent = "El ranking no está disponible aquí.";
      note.textContent = "El ranking compartido solo funciona al abrir la app en claude.ai con la sesión iniciada. Tu progreso sigue guardándose en este navegador.";
      mood($("rMascot"), "worried");
      return;
    }

    const wk = weekKey();
    const score = (r) => (R.tab === "week" ? (r.semana === wk ? r.xpSemana || 0 : 0) : r.xp || 0);
    const rows = R.rows.filter((r) => score(r) > 0).sort((a, b) => score(b) - score(a));
    const ps = R.user ? await R.user.profiles(rows.map((r) => r.id)) : {};
    if (seq !== rankSeq) return;      // llegó una actualización más nueva mientras esperábamos
    board.innerHTML = "";

    rows.forEach((r, i) => {
      const p = ps[r.id] || {};
      const row = el("div", "row" + (r.id === R.uid ? " me" : ""));
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
      bubble.textContent = "¡Vas primera o primero! Defiende el puesto.";
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
    sfx.tap();
    show("rank");
    renderRanking();
    syncRanking();
  }

  // ---------- Eventos ----------
  $("rankBtn").onclick = openRanking;
  $("rankBack").onclick = () => { renderHome(); show("home"); };
  $("tabWeek").onclick = () => { R.tab = "week"; renderRanking(); };
  $("tabAll").onclick = () => { R.tab = "all"; renderRanking(); };
  $("nickForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const apodo = $("nickInput").value.trim().slice(0, 24);
    R.mine = Object.assign({}, R.mine, { apodo });
    syncRanking({ apodo });
    $("nickInput").blur();
    renderRanking();
  });
  $("quitBtn").onclick = () => { L = null; renderHome(); show("home"); };
  $("practiceBtn").onclick = () => startLesson({ mode: "practice", exercises: buildPractice() });
  $("soundBtn").onclick = () => { state.sonido = !state.sonido; save(); renderTopChips(); sfx.tap(); };
  $("homeMascot").onclick = () => { sfx.pair(); mood($("hMascot"), "happy", 1200); say($("homeBubble"), pick(SAY.home.tap)); };

  document.addEventListener("keydown", (e) => {
    if ($("lesson").hidden || !L) return;
    if (e.key === "Enter" && !$("checkBtn").disabled) { e.preventDefault(); $("checkBtn").click(); return; }
    const n = parseInt(e.key, 10);
    if (!L.checked && n >= 1 && n <= 4) {
      const btns = $("ex").querySelectorAll(L.cur.type === "vf" ? ".vf .opt" : L.cur.type === "mc" ? ".opts .opts .opt" : ".bank .tile:not(.used)");
      if (btns[n - 1]) btns[n - 1].click();
    }
  });

  setInterval(() => { if (!$("home").hidden) renderTopChips(); }, 60000);
  renderHome();
  initRanking();
})();
