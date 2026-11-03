/**
 * VozSegura - Lógica de la landing page
 *  1. Analytics (GA4 / dataLayer)
 *  2. Menú móvil
 *  3. Simulador "Semáforo de Seguridad"
 *  4. Test de riesgo interactivo + captura de lead
 *  5. Acordeón de preguntas frecuentes
 */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------------
   * 1. Analytics: eventos definidos en la especificación
   *    click_hero_test_button, test_step_completed,
   *    lead_captured_email, app_download_click
   * ------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params = {}) {
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  }

  $$("[data-track]").forEach((el) => {
    el.addEventListener("click", () => track(el.dataset.track, { location: el.dataset.trackLocation || "" }));
  });

  /* ---------------------------------------------------------------
   * 2. Menú móvil
   * ------------------------------------------------------------- */
  const menuBtn = $("#mobile-menu-btn");
  const menu = $("#mobile-menu");
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("hidden", !open);
      menuBtn.setAttribute("aria-expanded", String(open));
      $(".material-symbols-outlined", menuBtn).textContent = open ? "close" : "menu";
    };
    menuBtn.addEventListener("click", () => setMenu(menu.classList.contains("hidden")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---------------------------------------------------------------
   * 3. Simulador del semáforo
   * ------------------------------------------------------------- */
  const SIM_STATES = {
    safe: {
      surface: "bg-traffic-safe-surface",
      text: "text-traffic-safe-border",
      icon: "verified",
      avatarIcon: "person",
      title: "Voz Verificada 100% Auténtica",
      desc: "Patrón biométrico familiar validado.",
      name: "Hijo Carlos",
      sub: "Llamada de voz entrante...",
      pulse: false,
    },
    danger: {
      surface: "bg-traffic-danger-surface",
      text: "text-traffic-danger",
      icon: "warning",
      avatarIcon: "dangerous",
      title: "¡CUIDADO! No entregues dinero ni datos",
      desc: "Voz clonada por IA. La voz no coincide (98% de probabilidad).",
      name: "Número Desconocido",
      sub: "Voz simulando ser tu familiar",
      pulse: true,
    },
  };

  const sim = {
    box: $("#sim-status-box"),
    icon: $("#sim-status-badge-icon"),
    title: $("#sim-status-badge-title"),
    desc: $("#sim-status-desc"),
    avatar: $("#sim-avatar-container"),
    avatarIcon: $("#sim-avatar-icon"),
    name: $("#sim-caller-name"),
    sub: $("#sim-caller-subtitle"),
  };
  const allSurfaces = ["bg-traffic-safe-surface", "bg-traffic-danger-surface"];
  const allTexts = ["text-traffic-safe-border", "text-traffic-danger"];

  function setSimulatorState(state) {
    const s = SIM_STATES[state];
    if (!s || !sim.box) return;

    [sim.box, sim.avatar].forEach((el) => {
      el.classList.remove(...allSurfaces);
      el.classList.add(s.surface);
    });
    [sim.icon, sim.title, sim.desc, sim.avatarIcon].forEach((el) => {
      el.classList.remove(...allTexts);
      el.classList.add(s.text);
    });
    sim.avatar.classList.toggle("animate-pulse", s.pulse);

    sim.icon.textContent = s.icon;
    sim.avatarIcon.textContent = s.avatarIcon;
    sim.title.textContent = s.title;
    sim.desc.textContent = s.desc;
    sim.name.textContent = s.name;
    sim.sub.textContent = s.sub;

    $$("[data-sim-state]").forEach((btn) => {
      const active = btn.dataset.simState === state;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("bg-surface-card", active);
      btn.classList.toggle("shadow-sm", active);
      btn.classList.toggle("text-text-muted", !active);
      btn.classList.toggle(btn.dataset.simState === "safe" ? "text-traffic-safe-border" : "text-traffic-danger", active);
    });
  }

  $$("[data-sim-state]").forEach((btn) =>
    btn.addEventListener("click", () => setSimulatorState(btn.dataset.simState))
  );

  /* ---------------------------------------------------------------
   * 4. Test de riesgo
   *    Cada respuesta suma puntos de exposición (total 100).
   * ------------------------------------------------------------- */
  const TOTAL_STEPS = 4;
  // Para cada pregunta: puntos si responde "sí" / "no"
  const RISK_WEIGHTS = {
    1: { yes: 25, no: 5 },  // contesta desconocidos
    2: { yes: 30, no: 5 },  // audios públicos
    3: { yes: 0, no: 25 },  // palabra clave
    4: { yes: 0, no: 20 },  // conoce el protocolo
  };
  const answers = {};

  const quiz = {
    label: $("#quiz-step-label"),
    percent: $("#quiz-percent-label"),
    bar: $("#quiz-progress-bar"),
    progress: $("#quiz-progress"),
  };

  function showStep(id) {
    $$(".quiz-step").forEach((el) => el.classList.add("hidden"));
    const step = $(id);
    step.classList.remove("hidden");
    const heading = $("h3", step);
    if (heading) heading.focus({ preventScroll: true });
  }

  function updateProgress(step) {
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    quiz.label.textContent = `Paso ${step} de ${TOTAL_STEPS}`;
    quiz.percent.textContent = `${pct}% completado`;
    quiz.bar.style.width = `${pct}%`;
    quiz.progress.setAttribute("aria-valuenow", String(pct));
  }

  function getRisk() {
    const score = Object.entries(answers).reduce(
      (sum, [q, yes]) => sum + RISK_WEIGHTS[q][yes ? "yes" : "no"],
      0
    );
    if (score >= 60) return { score, level: "Riesgo Alto", color: "danger",
      msg: "Eres un blanco atractivo para los estafadores. Te recomendamos crear hoy una palabra clave familiar y activar la protección de VozSegura." };
    if (score >= 35) return { score, level: "Riesgo Medio", color: "warning",
      msg: "Tienes algunas buenas prácticas, pero aún hay puntos débiles que una voz clonada podría aprovechar." };
    return { score, level: "Riesgo Bajo", color: "safe",
      msg: "¡Muy bien! Tienes buenos hábitos de seguridad. Compártelos con tu familia para protegerlos también." };
  }

  function renderResult() {
    const r = getRisk();
    const styles = {
      danger: ["bg-traffic-danger-surface", "text-traffic-danger", "bg-traffic-danger"],
      warning: ["bg-amber-50", "text-amber-800", "bg-amber-500"],
      safe: ["bg-traffic-safe-surface", "text-traffic-safe-border", "bg-traffic-safe"],
    }[r.color];

    const card = $("#risk-card");
    card.className = `w-full max-w-md rounded-2xl p-space-md mb-space-md text-left ${styles[0]}`;
    $("#risk-level").className = `font-headline-sm text-headline-sm ${styles[1]}`;
    $("#risk-level").textContent = `${r.level} - ${r.score}% expuesto`;
    $("#risk-meter").className = `h-full rounded-full transition-all duration-700 ${styles[2]}`;
    $("#risk-msg").textContent = r.msg;
    requestAnimationFrame(() => ($("#risk-meter").style.width = `${r.score}%`));

    quiz.bar.classList.replace("bg-primary", "bg-traffic-safe-border");
    return r;
  }

  $$("[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.step);
      answers[step] = btn.dataset.answer === "yes";
      track("test_step_completed", { step });

      if (step < TOTAL_STEPS) {
        updateProgress(step + 1);
        showStep(`#quiz-step-${step + 1}`);
      } else {
        quiz.label.textContent = "Resultado listo";
        quiz.percent.textContent = "100% completado";
        quiz.bar.style.width = "100%";
        quiz.progress.setAttribute("aria-valuenow", "100");
        const r = renderResult();
        track("test_completed", { risk_score: r.score, risk_level: r.level });
        showStep("#quiz-step-result");
      }
    });
  });

  $("#quiz-restart")?.addEventListener("click", () => {
    Object.keys(answers).forEach((k) => delete answers[k]);
    quiz.bar.classList.replace("bg-traffic-safe-border", "bg-primary");
    $("#lead-confirmation-msg").classList.add("hidden");
    updateProgress(1);
    showStep("#quiz-step-1");
  });

  $("#lead-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#lead-email");
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    // TODO: conectar con el backend / CRM (Mailchimp, HubSpot, Formspree, etc.)
    track("lead_captured_email", { risk_score: getRisk().score });
    $("#lead-confirmation-msg").classList.remove("hidden");
    e.target.reset();
  });

  /* ---------------------------------------------------------------
   * 5. Acordeón de FAQ
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

  /* Growth loop: mensaje de WhatsApp con el link real del sitio */
  const wa = $("#whatsapp-share");
  if (wa) {
    const url = location.origin + location.pathname;
    const text =
      "¡Hola! Hice este test rápido para medir mi riesgo ante estafas por llamadas de IA. " +
      "Te sugiero probarlo para protegernos en familia: " + url + "#test-riesgo";
    wa.href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
  }

  /* Año dinámico en el footer */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
