/**
 * VozSegura - Lógica de la landing page
 *  1. Analytics (GA4 / dataLayer)
 *  2. Menú móvil
 *  3. Simulador "Semáforo de Seguridad"
 *  4. Test de Riesgo Familiar (modal) + envío del informe
 *  5. Formulario de prueba gratis de 14 días
 *  6. Acordeón de preguntas frecuentes
 *  7. Asistente Vozy (chat)
 *  8. Blog (últimas entradas desde Blogger)
 */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const show = (el, display = "flex") => { el.classList.remove("hidden"); el.classList.add(display); };
  const hide = (el, display = "flex") => { el.classList.add("hidden"); el.classList.remove(display); };

  const SUPPORT_PHONE = "900 834 221";
  const SITE_URL = location.origin + location.pathname;

  /* ---------------------------------------------------------------
   * 1. Analytics
   * ------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params = {}) {
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, { location: el.dataset.trackLocation || "" });
  });

  /* ---------------------------------------------------------------
   * 2. Menú móvil
   * ------------------------------------------------------------- */
  const menuBtn = $("#mobile-menu-btn");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    menu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    $(".material-symbols-outlined", menuBtn).textContent = open ? "close" : "menu";
  };
  menuBtn.addEventListener("click", () => setMenu(menu.classList.contains("hidden")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------------------------------------------------------------
   * 3. Simulador del semáforo
   * ------------------------------------------------------------- */
  const WAVE_DANGER = [24, 36, 16, 32, 40, 28, 12, 32];
  const sim = {
    danger: $("#sim-danger-panel"),
    safe: $("#sim-safe-panel"),
    badge: $("#sim-badge"),
    quote: $("#sim-quote"),
    waves: $$(".sim-wave"),
    toggles: $$('[role="group"] [data-sim-state]'),
  };

  function setSimulatorState(state) {
    const safe = state === "safe";
    safe ? (hide(sim.danger), show(sim.safe)) : (hide(sim.safe), show(sim.danger));

    sim.badge.textContent = safe ? "Auténtico 99.4%" : "Alerta 98.7%";
    sim.badge.classList.toggle("bg-error-container", !safe);
    sim.badge.classList.toggle("text-on-error-container", !safe);
    sim.badge.classList.toggle("bg-secondary-container", safe);
    sim.badge.classList.toggle("text-on-secondary-fixed", safe);
    sim.quote.textContent = safe ? "“Hola mamá, ¿almorzamos el domingo?”" : "“¿Mamá, me transfieres dinero urgente?”";

    sim.waves.forEach((w, i) => {
      w.classList.toggle("bg-error", !safe);
      w.classList.toggle("bg-secondary", safe);
      w.style.height = (safe ? 22 + (i % 2) * 6 : WAVE_DANGER[i]) + "px";
    });

    sim.toggles.forEach((btn) => {
      const active = btn.dataset.simState === state;
      const on = btn.dataset.simState === "safe" ? ["bg-secondary", "text-on-secondary"] : ["bg-error", "text-on-error"];
      btn.setAttribute("aria-pressed", String(active));
      on.concat("shadow-sm").forEach((c) => btn.classList.toggle(c, active));
      btn.classList.toggle("text-on-surface-variant", !active);
    });
  }
  $$("[data-sim-state]").forEach((btn) =>
    btn.addEventListener("click", () => setSimulatorState(btn.dataset.simState))
  );

  /* ---------------------------------------------------------------
   * 4. Test de Riesgo Familiar
   *    4 preguntas, cada opción suma puntos de exposición (máx. 100).
   *    Bajo < 35 · Medio 35-59 · Alto >= 60
   * ------------------------------------------------------------- */
  const QUESTIONS = [
    {
      title: "Cuando suena el teléfono con un número desconocido, ¿qué suele hacer tu familiar mayor?",
      tip: "“Responde pensando en un día cualquiera. No hay respuestas buenas ni malas: solo queremos saber cómo protegerlos mejor.”",
      alert: "La mayoría de estafas con voz clonada llegan desde números que no están en la agenda.",
      options: [
        { text: "Contesta siempre, por si es algo importante", sub: "Atiende cualquier llamada, aunque no reconozca el número.", pts: 25 },
        { text: "Contesta a veces, según la hora o el número", sub: "Suele responder si la llamada insiste varias veces.", pts: 15 },
        { text: "Casi nunca contesta números que no conoce", sub: "Deja que suene y espera un mensaje o devuelve la llamada.", pts: 0 },
        { text: "No estoy seguro de cómo actúa", sub: "No hemos conversado sobre esto en la familia.", pts: 20 },
      ],
    },
    {
      title: "¿Tienes audios públicos o videos familiares en redes sociales (Facebook, Instagram, TikTok o WhatsApp)?",
      tip: "“No te preocupes si no dominas las redes. Piensa simplemente si tus nietos o hijos suben historias familiares donde se escuche cómo hablas.”",
      alert: "Los delincuentes solo necesitan 3 segundos de audio nítido para clonar una voz a la perfección.",
      options: [
        { text: "Sí, publicamos videos y audios familiares frecuentemente", sub: "En muros públicos de Facebook, reels de Instagram o historias abiertas.", pts: 30 },
        { text: "A veces, en cuentas privadas o grupos familiares", sub: "Compartimos notas de voz y saludos en grupos de WhatsApp de parientes.", pts: 15 },
        { text: "No compartimos audios ni videos con voz", sub: "Solo mensajes de texto o fotografías sin contenido de audio audible.", pts: 0 },
        { text: "No estoy seguro / No sé qué publican mis hijos o nietos", sub: "Mis familiares más jóvenes usan muchas redes y desconocemos su privacidad.", pts: 20 },
      ],
    },
    {
      title: "¿Tu familia tiene una “palabra clave secreta” para confirmar la identidad en una emergencia?",
      tip: "“Una palabra clave es como una contraseña hablada que solo conoce la familia. Puede ser el nombre de una mascota o un recuerdo especial.”",
      alert: "Una voz clonada puede imitar el tono y el llanto, pero no conoce la palabra secreta de tu familia.",
      options: [
        { text: "No tenemos ninguna palabra clave", sub: "Nunca lo habíamos pensado hasta ahora.", pts: 25 },
        { text: "Lo conversamos alguna vez, pero no quedó definida", sub: "No todos la recuerdan o no la hemos practicado.", pts: 15 },
        { text: "Sí, tenemos una y todos la conocen", sub: "La usamos o repasamos de vez en cuando.", pts: 0 },
        { text: "No estoy seguro de si mis familiares la recuerdan", sub: "Algunos la saben y otros probablemente no.", pts: 20 },
      ],
    },
    {
      title: "Si un “familiar” llama llorando y pide dinero urgente, ¿qué haría hoy tu familiar mayor?",
      tip: "“Imagina la situación con calma. Lo importante es saber cómo reaccionaría en ese primer minuto de susto.”",
      alert: "El estafador siempre apura: “no cuelgues”, “no le digas a nadie”, “transfiere ahora”.",
      options: [
        { text: "Enviaría el dinero de inmediato para ayudar", sub: "Por amor y preocupación actuaría sin pensarlo.", pts: 20 },
        { text: "Dudaría, pero podría ceder ante la presión", sub: "Sobre todo si la voz suena idéntica y desesperada.", pts: 12 },
        { text: "Colgaría y llamaría al número habitual del familiar", sub: "Verifica siempre antes de entregar dinero o datos.", pts: 0 },
        { text: "No lo sé, nunca lo hemos conversado", sub: "No tenemos un plan familiar para estos casos.", pts: 16 },
      ],
    },
  ];
  const TOTAL = QUESTIONS.length;
  const LEVELS = {
    low: {
      label: "Riesgo Bajo", range: "Menor a 35 puntos",
      pill: ["bg-secondary-container", "text-on-secondary-fixed"], dot: ["bg-secondary"],
      card: ["bg-secondary-container/50", "text-on-secondary-fixed"],
      note: "Tu familia mantiene buenos hábitos de seguridad. Sigue respondiendo para confirmar el diagnóstico.",
      msg: "¡Muy bien! Tu familia tiene buenos hábitos de seguridad. Compártelos con todos tus parientes para que nadie quede desprotegido.",
    },
    med: {
      label: "Riesgo Medio", range: "35 a 59 puntos",
      pill: ["bg-amber-100", "text-amber-900"], dot: ["bg-amber-500", "animate-pulse"],
      card: ["bg-amber-100", "text-amber-900"],
      note: "Tu familia posee filtros de privacidad parciales, pero existe vulnerabilidad por llamadas entrantes no verificadas.",
      msg: "Tienen algunas buenas prácticas, pero aún hay puntos débiles que una voz clonada podría aprovechar. Con un par de ajustes pueden estar mucho más tranquilos.",
    },
    high: {
      label: "Riesgo Alto", range: "60 puntos o más",
      pill: ["bg-error-container", "text-on-error-container"], dot: ["bg-error", "animate-pulse"],
      card: ["bg-error-container", "text-on-error-container"],
      note: "Tu familia es un blanco atractivo para una estafa con voz clonada. Conviene actuar hoy mismo.",
      msg: "Tu familia es un blanco atractivo para los estafadores. No es culpa de nadie: te recomendamos crear hoy una palabra clave familiar y activar la protección de VozSegura.",
    },
  };
  const ALL_LEVEL_CLASSES = Object.values(LEVELS).flatMap((l) => [...l.pill, ...l.dot, ...l.card]);

  const answers = new Array(TOTAL).fill(null); // índice de la opción elegida por pregunta
  let current = 0;
  let lastFocus = null;

  const quiz = {
    modal: $("#test-modal"),
    title: $("#test-modal-title"),
    stepLabel: $("#quiz-step-label"),
    percent: $("#quiz-percent-label"),
    bar: $("#quiz-progress-bar"),
    progress: $("#quiz-progress"),
    question: $("#quiz-question"),
    result: $("#quiz-result"),
    tip: $("#quiz-tip"),
    counter: $("#quiz-counter"),
    qTitle: $("#quiz-title"),
    alert: $("#quiz-alert"),
    options: $("#quiz-options"),
    prev: $("#quiz-prev"),
    next: $("#quiz-next"),
    nextLabel: $("#quiz-next-label"),
    time: $("#quiz-time"),
  };

  const getScore = () => answers.reduce((sum, a, q) => sum + (a === null ? 0 : QUESTIONS[q].options[a].pts), 0);
  const getLevel = (score) => (score >= 60 ? "high" : score >= 35 ? "med" : "low");

  function swapClasses(el, classes) {
    el.classList.remove(...ALL_LEVEL_CLASSES);
    el.classList.add(...classes);
  }

  function renderSemaphore() {
    const score = getScore();
    const key = getLevel(score);
    const lvl = LEVELS[key];
    $("#score-counter").textContent = score;
    swapClasses($("#risk-pill"), lvl.pill);
    swapClasses($("#risk-dot"), lvl.dot);
    $("#risk-label").textContent = lvl.label;
    $("#risk-range").textContent = lvl.range;
    $("#risk-note").textContent = answers.every((a) => a === null)
      ? "Responde las preguntas y verás cómo cambia el nivel de riesgo de tu familia."
      : lvl.note;
    ["low", "med", "high"].forEach((k) => $("#bar-" + k).classList.toggle("opacity-30", k !== key));
  }

  function setProgress(pct, label) {
    quiz.stepLabel.textContent = label;
    quiz.percent.textContent = `${pct}% completado`;
    quiz.bar.style.width = `${pct}%`;
    quiz.progress.setAttribute("aria-valuenow", String(pct));
  }

  function pointsBadge(pts) {
    if (pts === 0) return ["bg-secondary-container", "text-on-secondary-fixed", "0 pts"];
    if (pts >= 25) return ["bg-error-container", "text-on-error-container", `+${pts} pts`];
    return ["bg-surface-container-lowest", "text-on-surface-variant", `+${pts} pts`];
  }

  function renderQuestion(focus = true) {
    const q = QUESTIONS[current];
    hide(quiz.result);
    show(quiz.question);
    setProgress(Math.round(((current + 1) / TOTAL) * 100), `Paso ${current + 1} de ${TOTAL}`);
    quiz.tip.textContent = q.tip;
    quiz.counter.textContent = `Pregunta ${current + 1} de ${TOTAL}`;
    quiz.qTitle.textContent = q.title;
    quiz.alert.textContent = q.alert;
    quiz.time.textContent = `Tiempo estimado: ${(TOTAL - current) * 15}s restantes`;

    quiz.options.replaceChildren(
      ...q.options.map((opt, i) => {
        const selected = answers[current] === i;
        const [bg, fg, text] = pointsBadge(opt.pts);
        const label = document.createElement("label");
        label.className =
          "cursor-pointer rounded-xl p-space-sm sm:p-space-md flex items-center justify-between gap-space-sm transition-all " +
          (selected ? "bg-surface-container-high shadow-md ring-2 ring-primary-container" : "bg-surface shadow-sm hover:bg-surface-container-low");
        label.innerHTML = `
          <span class="flex items-center gap-space-sm sm:gap-space-md min-w-0">
            <span class="w-9 h-9 rounded-full flex items-center justify-center font-bold font-label-md text-label-md shrink-0 ${selected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"}" aria-hidden="true">${"ABCD"[i]}</span>
            <span class="flex flex-col min-w-0">
              <span class="font-label-lg text-label-md sm:text-label-lg font-bold leading-tight ${selected ? "text-primary" : "text-on-surface"}"></span>
              <span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5"></span>
            </span>
          </span>
          <span class="flex items-center gap-space-xs shrink-0">
            <span class="${bg} ${fg} font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold whitespace-nowrap">${text}</span>
            <input class="sr-only" type="radio" name="quiz-option" value="${i}" ${selected ? "checked" : ""} />
            <span class="material-symbols-outlined icon-fill text-primary text-[26px] hidden sm:inline ${selected ? "" : "opacity-0"}" aria-hidden="true">check_circle</span>
          </span>`;
        const [t, s] = label.querySelectorAll(".flex-col > span");
        t.textContent = opt.text;
        s.textContent = opt.sub;
        label.querySelector("input").addEventListener("change", () => {
          answers[current] = i;
          renderSemaphore();
          renderQuestion(false);
          $(`input[value="${i}"]`, quiz.options).focus();
        });
        return label;
      })
    );

    quiz.prev.disabled = current === 0;
    quiz.next.disabled = answers[current] === null;
    quiz.nextLabel.textContent = current === TOTAL - 1 ? "Ver mi resultado" : "Siguiente pregunta";
    if (focus) quiz.qTitle.focus({ preventScroll: true });
  }

  function renderResult() {
    const score = getScore();
    const lvl = LEVELS[getLevel(score)];
    hide(quiz.question);
    show(quiz.result);
    setProgress(100, "Resultado listo");
    quiz.time.textContent = "Test completado";
    swapClasses($("#result-card"), lvl.card);
    $("#result-title").textContent = `${lvl.label}: ${score} de 100 puntos`;
    $("#result-msg").textContent = lvl.msg;

    // Recomendaciones según las respuestas que suman riesgo
    const ADVICE = [
      "Acuerden no dar información ni dinero a números desconocidos: colgar y devolver la llamada al número de siempre.",
      "Revisen la privacidad de sus redes y eviten publicar audios o videos con voz en perfiles abiertos.",
      "Definan hoy una palabra clave familiar secreta y practíquenla juntos.",
      "Ensayen el Protocolo de 60 segundos: Respira, Cuelga y Verifica antes de transferir dinero.",
    ];
    const items = ADVICE.filter((_, q) => QUESTIONS[q].options[answers[q]].pts > 0);
    if (!items.length) items.push("Repasen su palabra clave cada cierto tiempo y compartan este test con otros familiares.");
    $("#result-actions").replaceChildren(
      ...items.map((text, i) => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-space-sm";
        li.innerHTML = `<span class="w-7 h-7 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span><span></span>`;
        li.lastElementChild.textContent = text;
        return li;
      })
    );
    track("test_completed", { risk_score: score, risk_level: lvl.label });
    $("#result-title").focus({ preventScroll: true });
    quiz.modal.scrollTo({ top: 0, behavior: "smooth" });
  }

  quiz.next.addEventListener("click", () => {
    if (answers[current] === null) return;
    track("test_step_completed", { step: current + 1 });
    if (current < TOTAL - 1) {
      current += 1;
      renderQuestion();
    } else {
      renderResult();
    }
  });
  quiz.prev.addEventListener("click", () => {
    if (current > 0) {
      current -= 1;
      renderQuestion();
    }
  });
  $("#quiz-restart").addEventListener("click", () => {
    answers.fill(null);
    current = 0;
    hide($("#lead-confirmation-msg"));
    renderSemaphore();
    renderQuestion();
  });

  function openTest() {
    lastFocus = document.activeElement;
    setMenu(false);
    closeVozy();
    quiz.modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    quiz.modal.scrollTop = 0;
    quiz.title.focus({ preventScroll: true });
  }
  function closeTest() {
    quiz.modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  $$("[data-open-test]").forEach((el) => el.addEventListener("click", openTest));
  $$("[data-close-test]").forEach((el) => el.addEventListener("click", closeTest));
  quiz.modal.addEventListener("click", (e) => {
    // clic en el fondo oscuro (fuera de la tarjeta)
    if (e.target === quiz.modal || e.target === quiz.modal.firstElementChild) closeTest();
  });
  // Mantiene el foco del teclado dentro del modal
  quiz.modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = $$("a[href], button:not([disabled]), input:not([disabled])", quiz.modal).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === quiz.title)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Envío del informe
  $("#lead-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#family-contact");
    const value = input.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^\+?[\d\s-]{9,15}$/.test(value);
    input.setCustomValidity(isEmail || isPhone ? "" : "Escribe un correo válido o un número de celular.");
    if (!input.reportValidity()) return;
    // TODO: conectar con el backend / CRM (WhatsApp Business API, Mailchimp, HubSpot, Formspree, etc.)
    track("lead_captured", { channel: isEmail ? "email" : "phone", risk_score: getScore() });
    show($("#lead-confirmation-msg"));
    e.target.reset();
  });
  $("#family-contact").addEventListener("input", (e) => e.target.setCustomValidity(""));

  // Growth loop: compartir el test por WhatsApp
  $("#whatsapp-share").href =
    "https://api.whatsapp.com/send?text=" +
    encodeURIComponent(
      "¡Hola! Hice este test rápido para medir nuestro riesgo ante estafas por llamadas con voz clonada por IA. " +
        "Te sugiero probarlo para protegernos en familia: " + SITE_URL + "#test-riesgo"
    );

  renderSemaphore();
  renderQuestion(false);

  /* ---------------------------------------------------------------
   * 5. Prueba gratis de 14 días
   * ------------------------------------------------------------- */
  $("#free-trial-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = $("#trial-submit-btn");
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin" aria-hidden="true">sync</span> Activando…';
    // TODO: enviar los datos al backend / CRM antes de mostrar la confirmación
    track("trial_activated", { target_user: new FormData(form).get("target_user") });
    setTimeout(() => {
      form.classList.add("hidden");
      show($("#trial-success-msg"));
    }, 900);
  });

  /* ---------------------------------------------------------------
   * 6. Acordeón de FAQ
   * ------------------------------------------------------------- */
  $$("[data-accordion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("hidden", open);
      $(".material-symbols-outlined", btn).textContent = open ? "add" : "remove";
    });
  });

  /* ---------------------------------------------------------------
   * 7. Asistente Vozy (respuestas guiadas, sin backend)
   * ------------------------------------------------------------- */
  const vozy = {
    panel: $("#vozy-panel"),
    toggle: $("#vozy-toggle"),
    tooltip: $("#vozy-tooltip"),
    log: $("#vozy-log"),
    quick: $("#vozy-quick"),
    form: $("#vozy-form"),
    input: $("#vozy-input"),
    mic: $("#vozy-mic"),
  };

  const VOZY_TOPICS = [
    {
      id: "emergency", urgent: true, label: "¡Recibí una llamada sospechosa ahora!",
      keywords: ["sospech", "estafa", "urgente", "dinero", "transfer", "llamaron", "llamada", "secuestr", "extors", "clon"],
      answer: [
        "Tranquilo, estoy contigo. Sigue estos 3 pasos con calma:",
        "1. Respira. La urgencia es la herramienta del estafador.\n2. Cuelga la llamada, sin vergüenza.\n3. Verifica: llama tú mismo al número de siempre de tu familiar o pídele la palabra clave secreta.",
        `No transfieras dinero ni des datos hasta confirmar. Si necesitas hablar con una persona, llama gratis al ${SUPPORT_PHONE}.`,
      ],
    },
    {
      id: "trial", label: "¿Cómo funciona la prueba de 14 días?",
      keywords: ["prueba", "14", "gratis", "trial", "tarjeta", "cobr", "cancel"],
      answer: [
        "La prueba te da SMART PRO completo durante 14 días, sin tarjeta de crédito y sin cobros automáticos.",
        "Al terminar, eliges: continuar por S/ 19.90 al mes o quedarte en el plan Freemium gratuito.",
      ],
      action: { label: "Ir a activar mi prueba gratis", href: "#prueba-gratis" },
    },
    {
      id: "keyword", label: "¿Cómo creo una palabra clave familiar?",
      keywords: ["palabra", "clave", "secreta", "contrase"],
      answer: [
        "Es muy sencillo: elijan en familia una palabra que solo ustedes conozcan, como el nombre de una mascota o un recuerdo especial.",
        "No la publiquen ni la envíen por mensajes. Si alguien llama pidiendo ayuda urgente, pídele la palabra. Si no la sabe, cuelga.",
      ],
    },
    {
      id: "test", label: "Quiero saber qué tan expuesta está mi familia",
      keywords: ["test", "riesgo", "expuest", "diagn"],
      answer: ["Tenemos un test gratuito de 4 preguntas. Toma un minuto y te indica el nivel de riesgo de tu familia."],
      action: { label: "Hacer el test de riesgo", test: true },
    },
    {
      id: "plans", label: "¿Cuánto cuesta VozSegura?",
      keywords: ["precio", "cuesta", "costo", "plan", "pagar", "soles", "cuanto"],
      answer: [
        "Hay tres opciones: Freemium (S/ 0 de por vida), SMART PRO (S/ 19.90 al mes, con 14 días gratis) y ELITE Familiar (S/ 39.90 al mes, hasta 5 adultos mayores).",
      ],
      action: { label: "Ver los planes", href: "#planes" },
    },
    {
      id: "human", label: "Quiero hablar con una persona",
      keywords: ["persona", "humano", "asesor", "telefono", "llamar", "ayuda", "soporte"],
      answer: [`Con gusto. Nuestra línea gratuita atiende las 24 horas, con paciencia y sin tecnicismos: ${SUPPORT_PHONE}.`],
      action: { label: `Llamar al ${SUPPORT_PHONE}`, href: "tel:" + SUPPORT_PHONE.replace(/\s/g, "") },
    },
  ];
  const VOZY_FALLBACK = [
    "Gracias por escribirme. Todavía estoy aprendiendo y no quiero darte una respuesta equivocada.",
    `Puedes tocar una de las opciones de abajo o llamar gratis al ${SUPPORT_PHONE} para hablar con una persona.`,
  ];

  const clock = () => new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function addMessage(from, paragraphs, action) {
    const wrap = document.createElement("div");
    const bot = from === "vozy";
    wrap.className = "fade-in flex items-start gap-2 " + (bot ? "" : "flex-row-reverse");
    wrap.innerHTML = bot
      ? '<img src="assets/img/vozy-mascota.png" alt="" class="w-10 h-10 rounded-full bg-white object-cover object-top shadow-sm shrink-0" width="40" height="40" />'
      : "";
    const col = document.createElement("div");
    col.className = "flex flex-col gap-1 max-w-[85%] " + (bot ? "items-start" : "items-end");
    const bubble = document.createElement("div");
    bubble.className =
      "px-space-md py-space-sm rounded-2xl shadow-sm font-body-md text-body-md flex flex-col gap-2 " +
      (bot ? "bg-surface-container-lowest text-on-surface" : "bg-primary-container text-on-primary");
    paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.className = "whitespace-pre-line";
      p.textContent = text;
      bubble.appendChild(p);
    });
    if (action) {
      const el = document.createElement(action.href ? "a" : "button");
      if (action.href) el.href = action.href;
      else el.type = "button";
      el.className =
        "mt-1 min-h-[48px] px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center text-center hover:bg-primary-container";
      el.textContent = action.label;
      el.addEventListener("click", () => (action.test ? openTest() : action.href.startsWith("#") && closeVozy()));
      bubble.appendChild(el);
    }
    const meta = document.createElement("span");
    meta.className = "font-label-sm text-label-sm text-on-surface-variant px-1";
    meta.textContent = `${bot ? "Vozy" : "Tú"} • ${clock()}`;
    col.append(bubble, meta);
    wrap.appendChild(col);
    vozy.log.appendChild(wrap);
    vozy.log.scrollTop = vozy.log.scrollHeight;
  }

  function reply(topic) {
    track("vozy_question", { topic: topic ? topic.id : "fallback" });
    setTimeout(() => addMessage("vozy", topic ? topic.answer : VOZY_FALLBACK, topic && topic.action), 500);
  }

  function ask(text) {
    const clean = text.trim();
    if (!clean) return;
    addMessage("user", [clean]);
    const words = normalize(clean);
    const scored = VOZY_TOPICS.map((t) => ({ t, n: t.keywords.filter((k) => words.includes(k)).length }))
      .sort((a, b) => b.n - a.n)[0];
    reply(scored.n > 0 ? scored.t : null);
  }

  vozy.quick.append(
    ...VOZY_TOPICS.map((topic) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-full min-h-[52px] px-space-md py-2 rounded-xl text-left font-label-md text-label-md font-bold flex items-center gap-space-sm shrink-0 transition-colors " +
        (topic.urgent
          ? "bg-error-container text-on-error-container hover:brightness-95"
          : "bg-surface-container-low text-primary hover:bg-surface-container-high");
      btn.innerHTML = `<span class="material-symbols-outlined shrink-0" aria-hidden="true">${topic.urgent ? "emergency" : "chat_bubble"}</span><span></span>`;
      btn.lastElementChild.textContent = topic.label;
      btn.addEventListener("click", () => {
        addMessage("user", [topic.label]);
        reply(topic);
      });
      return btn;
    })
  );

  let greeted = false;
  function openVozy() {
    show(vozy.panel);
    hide(vozy.tooltip, "sm:flex");
    vozy.toggle.setAttribute("aria-expanded", "true");
    $(".material-symbols-outlined", vozy.toggle).textContent = "close";
    if (!greeted) {
      greeted = true;
      addMessage("vozy", [
        "¡Hola! Soy Vozy, tu compañero de seguridad telefónica.",
        "Estoy aquí para ayudarte a ti y a tu familia a evitar estafas con voces creadas por inteligencia artificial. ¿En qué puedo apoyarte hoy?",
      ]);
    }
    track("vozy_opened");
    vozy.input.focus({ preventScroll: true });
  }
  function closeVozy() {
    if (vozy.panel.classList.contains("hidden")) return;
    hide(vozy.panel);
    vozy.toggle.setAttribute("aria-expanded", "false");
    $(".material-symbols-outlined", vozy.toggle).textContent = "support_agent";
  }
  vozy.toggle.addEventListener("click", () => (vozy.panel.classList.contains("hidden") ? openVozy() : closeVozy()));
  $("#vozy-close").addEventListener("click", () => { closeVozy(); vozy.toggle.focus(); });
  $("#vozy-tooltip-close").addEventListener("click", () => hide(vozy.tooltip, "sm:flex"));
  vozy.form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(vozy.input.value);
    vozy.input.value = "";
  });

  // Dictado por voz (solo en navegadores compatibles)
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (Recognition) {
    const rec = new Recognition();
    rec.lang = "es-PE";
    rec.interimResults = false;
    let listening = false;
    const setListening = (on) => {
      listening = on;
      vozy.mic.setAttribute("aria-pressed", String(on));
      vozy.mic.classList.toggle("bg-error-container", on);
      vozy.mic.classList.toggle("text-error", on);
      vozy.input.placeholder = on ? "Te escucho, habla con calma…" : "Escribe tu pregunta aquí…";
    };
    rec.onresult = (e) => ask(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    vozy.mic.addEventListener("click", () => {
      if (listening) return rec.stop();
      try { rec.start(); setListening(true); } catch (_) { setListening(false); }
    });
    show(vozy.mic);
  }

  /* ---------------------------------------------------------------
   * 8. Blog: últimas entradas desde Blogger (feed JSONP)
   *    Si el feed no responde, queda la tarjeta con el enlace al blog.
   * ------------------------------------------------------------- */
  const BLOG_URL = "https://vozsegurape.blogspot.com/";
  const blogGrid = $("#blog-posts");
  const safeUrl = (u) => (typeof u === "string" && /^https?:\/\//i.test(u) ? u : null);

  window.__vozseguraBlog = (data) => {
    const entries = ((data && data.feed && data.feed.entry) || []).slice(0, 3);
    const cards = entries
      .map((entry) => {
        const link = safeUrl(((entry.link || []).find((l) => l.rel === "alternate") || {}).href);
        if (!link) return null;
        // DOMParser no ejecuta scripts ni carga recursos del HTML de la entrada
        const tmp = new DOMParser().parseFromString((entry.summary || entry.content || {}).$t || "", "text/html").body;
        const summary = tmp.textContent.replace(/\s+/g, " ").trim();
        const thumb = safeUrl(entry.media$thumbnail && entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//, "/w640-h360-c/"));
        const date = new Date((entry.published || {}).$t);

        const card = document.createElement("a");
        card.href = link;
        card.target = "_blank";
        card.rel = "noopener";
        card.dataset.track = "click_blog";
        card.dataset.trackLocation = "blog_post";
        card.className = "fade-in rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow";
        card.innerHTML = `
          <span class="aspect-video w-full bg-surface-container-high text-primary flex items-center justify-center overflow-hidden">
            <span class="material-symbols-outlined text-[48px]" aria-hidden="true">article</span>
          </span>
          <span class="p-space-md flex flex-col gap-space-xs flex-1">
            <span class="font-label-sm text-label-sm text-on-surface-variant"></span>
            <span class="font-headline-sm text-headline-sm font-bold text-on-surface"></span>
            <span class="font-body-sm text-body-sm text-on-surface-variant"></span>
            <span class="mt-auto pt-space-sm font-label-md text-label-md text-primary font-bold flex items-center gap-1">Leer artículo <span class="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span></span>
          </span>`;
        if (thumb) {
          const img = document.createElement("img");
          img.src = thumb;
          img.alt = "";
          img.loading = "lazy";
          img.className = "w-full h-full object-cover";
          img.onerror = () => img.remove();
          card.firstElementChild.replaceChildren(img);
        }
        const [dateEl, titleEl, sumEl] = card.lastElementChild.children;
        dateEl.textContent = isNaN(date) ? "" : date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
        titleEl.textContent = (entry.title || {}).$t || "Artículo del blog";
        sumEl.textContent = summary.length > 150 ? summary.slice(0, 150).trimEnd() + "…" : summary;
        return card;
      })
      .filter(Boolean);
    if (cards.length) blogGrid.replaceChildren(...cards);
  };
  const feed = document.createElement("script");
  feed.src = BLOG_URL + "feeds/posts/summary?alt=json-in-script&max-results=3&callback=__vozseguraBlog";
  feed.async = true;
  document.head.appendChild(feed);

  /* Esc cierra primero el test y luego el chat */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!quiz.modal.classList.contains("hidden")) closeTest();
    else closeVozy();
  });

  /* Año dinámico en el footer */
  $("#year").textContent = new Date().getFullYear();
})();
