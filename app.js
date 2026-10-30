// Plaza en Racha: reto diario de 10 preguntas, racha de días seguidos y práctica por tema.
// El progreso se guarda solo en este navegador (localStorage).

(function () {
  const KEY = "plaza-en-racha-v1";
  const DAILY_SIZE = 10;
  const LETTERS = ["a", "b", "c", "d"];
  const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
  const $ = (id) => document.getElementById(id);

  // ---------- Estado ----------
  const empty = () => ({ racha: 0, mejor: 0, ultimoDia: null, dias: {}, temas: {}, falladas: [] });

  function load() {
    try { return Object.assign(empty(), JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return empty(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento: seguimos en memoria */ }
  }
  let state = load();

  // ---------- Fechas ----------
  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => dayKey(new Date());
  const yesterday = () => dayKey(addDays(new Date(), -1));

  // La racha sigue viva si el último reto fue hoy o ayer.
  const liveStreak = () => (state.ultimoDia === today() || state.ultimoDia === yesterday()) ? state.racha : 0;

  // ---------- Selección del reto diario (misma para todo el día) ----------
  function seeded(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const dailySet = () => shuffle(PREGUNTAS, seeded(today())).slice(0, DAILY_SIZE);

  // ---------- Inicio ----------
  function renderHome() {
    const r = liveStreak();
    const doneToday = state.ultimoDia === today();
    $("streakNum").textContent = r;
    $("streakNum").classList.toggle("cold", r === 0);
    $("streakWord").textContent = r === 1 ? "día seguido" : "días seguidos";
    $("streakMsg").textContent = doneToday
      ? "Reto de hoy hecho. Vuelve mañana para seguir sumando."
      : r > 0 ? "Haz el reto de hoy para no perder la racha." : "Haz el reto de hoy para encender la racha.";

    const week = $("week");
    week.innerHTML = "";
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      const k = dayKey(d);
      const done = !!state.dias[k];
      const el = document.createElement("div");
      el.className = "day" + (i === 0 ? " is-today" : "");
      el.innerHTML = `<div class="dot${done ? " done" : ""}${i === 0 ? " today" : ""}">${done ? "✓" : ""}</div>${DAYS[(d.getDay() + 6) % 7]}`;
      el.title = k + (done ? ` · ${state.dias[k].ok}/${state.dias[k].total}` : "");
      week.appendChild(el);
    }

    $("startDaily").textContent = doneToday ? "Repetir el reto de hoy" : `Empezar el reto de hoy · ${DAILY_SIZE} preguntas`;
    $("startFailed").disabled = state.falladas.length === 0;
    $("startFailed").textContent = state.falladas.length ? `Repasar falladas (${state.falladas.length})` : "Repasar falladas (ninguna aún)";

    let ok = 0, total = 0;
    Object.values(state.temas).forEach((t) => { ok += t.ok; total += t.total; });
    $("bestStreak").textContent = state.mejor;
    $("totalAns").textContent = total;
    $("pctOk").textContent = total ? Math.round((ok / total) * 100) + "%" : "–";

    const box = $("temas");
    box.innerHTML = "";
    TEMAS.forEach((tema) => {
      const n = PREGUNTAS.filter((q) => q.tema === tema).length;
      const t = state.temas[tema] || { ok: 0, total: 0 };
      const pct = t.total ? Math.round((t.ok / t.total) * 100) : 0;
      const b = document.createElement("button");
      b.className = "tema";
      b.innerHTML = `<span class="tema-name">${tema}</span><span class="tema-meta">${t.total ? pct + "% · " : ""}${n} preg.</span><span class="bar"><i style="width:${pct}%"></i></span>`;
      b.onclick = () => startQuiz("tema", shuffle(PREGUNTAS.filter((q) => q.tema === tema), Math.random), tema);
      box.appendChild(b);
    });
  }

  // ---------- Test ----------
  let quiz = null;

  function show(id) {
    ["home", "quiz", "result"].forEach((s) => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  function startQuiz(mode, questions, label) {
    quiz = { mode, questions, i: 0, ok: 0 };
    $("qMode").textContent = mode === "daily" ? "Reto de hoy" : mode === "failed" ? "Repaso de falladas" : label;
    show("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.i];
    $("qCount").textContent = `${quiz.i + 1} / ${quiz.questions.length}`;
    $("qBar").style.width = (quiz.i / quiz.questions.length) * 100 + "%";
    $("qTema").textContent = q.tema;
    $("qText").textContent = q.p;
    $("fb").hidden = true;
    $("next").hidden = true;
    const opts = $("opts");
    opts.innerHTML = "";
    q.o.forEach((text, idx) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = `<span class="k">${LETTERS[idx]})</span><span></span>`;
      b.lastChild.textContent = text;
      b.onclick = () => answer(idx);
      opts.appendChild(b);
    });
  }

  function answer(idx) {
    const q = quiz.questions[quiz.i];
    const right = idx === q.c;
    const buttons = $("opts").children;
    Array.from(buttons).forEach((b, i) => {
      b.disabled = true;
      if (i === q.c) b.classList.add("right");
      else if (i === idx) b.classList.add("wrong");
    });

    const t = state.temas[q.tema] || (state.temas[q.tema] = { ok: 0, total: 0 });
    t.total++;
    if (right) { t.ok++; quiz.ok++; state.falladas = state.falladas.filter((id) => id !== q.id); }
    else if (!state.falladas.includes(q.id)) state.falladas.push(q.id);
    save();

    const fb = $("fb");
    fb.className = "fb" + (right ? "" : " bad");
    fb.innerHTML = `<strong></strong><span class="muted"></span>`;
    fb.firstChild.textContent = right ? "¡Correcta!" : `Incorrecta. La buena es la ${LETTERS[q.c]}).`;
    fb.lastChild.textContent = q.e;
    fb.hidden = false;

    const last = quiz.i === quiz.questions.length - 1;
    $("next").textContent = last ? "Ver resultado" : "Siguiente";
    $("next").hidden = false;
    $("next").focus();
  }

  function finish() {
    const total = quiz.questions.length;
    let title = `${quiz.ok} de ${total} aciertos`;
    let text = "";

    if (quiz.mode === "daily") {
      const t = today();
      if (state.ultimoDia !== t) {
        state.racha = state.ultimoDia === yesterday() ? state.racha + 1 : 1;
        state.ultimoDia = t;
        state.mejor = Math.max(state.mejor, state.racha);
        text = state.racha === 1
          ? "Racha encendida: 1 día. Mañana tienes un reto nuevo."
          : `Llevas ${state.racha} días seguidos. Mañana tienes un reto nuevo.`;
      } else {
        text = "Ya habías completado el reto de hoy: tu racha sigue igual.";
      }
      state.dias[t] = { ok: quiz.ok, total };
      $("rLabel").textContent = "Reto completado";
    } else {
      $("rLabel").textContent = "Práctica terminada";
      text = state.falladas.length
        ? `Te quedan ${state.falladas.length} preguntas falladas por repasar.`
        : "No te queda ninguna pregunta fallada.";
    }
    save();
    $("rTitle").textContent = title;
    $("rText").textContent = text;
    show("result");
  }

  // ---------- Eventos ----------
  $("startDaily").onclick = () => startQuiz("daily", dailySet());
  $("startFailed").onclick = () => {
    const qs = PREGUNTAS.filter((q) => state.falladas.includes(q.id));
    if (qs.length) startQuiz("failed", shuffle(qs, Math.random));
  };
  $("next").onclick = () => {
    if (quiz.i === quiz.questions.length - 1) finish();
    else { quiz.i++; renderQuestion(); }
  };
  $("quit").onclick = () => { renderHome(); show("home"); };
  $("back").onclick = () => { renderHome(); show("home"); };

  renderHome();
})();
