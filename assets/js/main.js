/* GLOBAL MARKET INVESTMENT — scripts du site (vanilla JS, sans dépendance) */
(function () {
  "use strict";
  var C = window.GMI_CONFIG || {};
  var root = document.documentElement;
  root.classList.remove("no-js");

  /* ---------------- Langue ---------------- */
  var STORE = "gmi-lang";
  function getLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "fr" || q === "en") return q;
    try { var s = localStorage.getItem(STORE); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr";
  }
  function setLang(l) {
    root.lang = l;
    try { localStorage.setItem(STORE, l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });
    var t = root.getAttribute("data-title-" + l); if (t) document.title = t;
    var md = document.querySelector('meta[name="description"]');
    var d = root.getAttribute("data-desc-" + l); if (md && d) md.setAttribute("content", d);
    document.querySelectorAll("[data-ph-" + l + "]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-ph-" + l));
    });
    document.querySelectorAll("[data-alt-" + l + "]").forEach(function (el) {
      el.setAttribute("alt", el.getAttribute("data-alt-" + l));
    });
    document.querySelectorAll("[data-al-" + l + "]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-al-" + l));
    });
    document.querySelectorAll("option[data-" + l + "]").forEach(function (o) { o.textContent = o.getAttribute("data-" + l); });
    fillConfig(l);
    renderSessions();
    calc();
  }
  function L() { return root.lang === "en" ? "en" : "fr"; }
  function tr(fr, en) { return L() === "en" ? en : fr; }

  /* ---------------- Configuration ---------------- */
  function digits(s) { return String(s || "").replace(/[^\d+]/g, ""); }
  function fillConfig(l) {
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = C.phone || "";
      if (el.tagName === "A") el.href = "tel:" + digits(C.phone);
    });
    document.querySelectorAll("[data-phone-note]").forEach(function (el) {
      el.hidden = !!C.phoneConfirmed;
    });
    document.querySelectorAll("[data-tg-support]").forEach(function (el) {
      if (el.tagName === "A") el.href = "https://t.me/" + C.telegramSupport;
      if (el.hasAttribute("data-text")) el.textContent = "@" + C.telegramSupport;
    });
    document.querySelectorAll("[data-tg-channel]").forEach(function (el) { el.href = C.telegramChannel; });
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      if (!C.whatsapp) { el.hidden = true; return; }
      el.hidden = false; if (el.tagName === "A") el.href = "https://wa.me/" + String(C.whatsapp).replace(/\D/g, "");
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      var box = el.closest("[data-opt]");
      if (!C.email) { if (box) box.hidden = true; return; }
      if (box) box.hidden = false; el.textContent = C.email; el.href = "mailto:" + C.email;
    });
    document.querySelectorAll("[data-address]").forEach(function (el) {
      var v = C.address && C.address[l]; var box = el.closest("[data-opt]");
      if (!v) { if (box) box.hidden = true; return; } if (box) box.hidden = false; el.textContent = v;
    });
    document.querySelectorAll("[data-hours]").forEach(function (el) {
      var v = C.hours && C.hours[l]; var box = el.closest("[data-opt]");
      if (!v) { if (box) box.hidden = true; return; } if (box) box.hidden = false; el.textContent = v;
    });
    var socials = document.querySelectorAll("[data-social]"), any = false;
    socials.forEach(function (el) {
      var u = C.social && C.social[el.dataset.social];
      el.hidden = !u; if (u) { el.href = u; any = true; }
    });
    document.querySelectorAll("[data-social-wrap]").forEach(function (w) { w.hidden = !any; });
    document.querySelectorAll("[data-prog]").forEach(function (el) {
      var p = C.programs && C.programs[el.dataset.prog]; var key = el.dataset.field;
      var v = p && p[key] && p[key][l];
      if (v) { el.textContent = v; el.classList.remove("tbc"); }
      else { el.textContent = tr("À confirmer", "To be confirmed"); el.classList.add("tbc"); }
    });
  }

  /* ---------------- Header / menu ---------------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var burger = document.querySelector(".burger"), panel = document.getElementById("mobile-panel");
  function closeMenu() {
    if (!panel) return; panel.classList.remove("open"); document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.querySelector("use").setAttribute("href", "#i-menu");
  }
  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = !panel.classList.contains("open");
      panel.classList.toggle("open", open); document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    });
    panel.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1240) closeMenu(); });
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  /* ---------------- Reveal ---------------- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }

  /* Halo doré qui suit la souris sur les cartes */
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    });
  });

  /* ---------------- Ticker (duplication pour boucle) ---------------- */
  document.querySelectorAll(".ticker-track").forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------------- Sessions de marché (heure réelle) ---------------- */
  function nthSunday(y, m, n) { var d = new Date(Date.UTC(y, m, 1)); var add = (7 - d.getUTCDay()) % 7; return Date.UTC(y, m, 1 + add + 7 * (n - 1)); }
  function lastSunday(y, m) { var d = new Date(Date.UTC(y, m + 1, 0)); return Date.UTC(y, m, d.getUTCDate() - d.getUTCDay()); }
  function sessionsUTC(now) {
    var y = now.getUTCFullYear(), t = now.getTime();
    var ukDST = t >= lastSunday(y, 2) + 3600e3 && t < lastSunday(y, 9) + 3600e3;
    var usDST = t >= nthSunday(y, 2, 2) + 7 * 3600e3 && t < nthSunday(y, 10, 1) + 6 * 3600e3;
    return [
      { id: "sydney", fr: "Sydney", en: "Sydney", s: 21, e: 6 },
      { id: "tokyo", fr: "Tokyo", en: "Tokyo", s: 0, e: 9 },
      { id: "london", fr: "Londres", en: "London", s: ukDST ? 7 : 8, e: ukDST ? 16 : 17 },
      { id: "ny", fr: "New York", en: "New York", s: usDST ? 12 : 13, e: usDST ? 21 : 22 }
    ];
  }
  function fmtLocal(h) {
    var d = new Date(); d.setUTCHours(h, 0, 0, 0);
    return d.toLocaleTimeString(L() === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  function renderSessions() {
    var box = document.querySelectorAll("[data-sessions]"); if (!box.length) return;
    var now = new Date(), h = now.getUTCHours() + now.getUTCMinutes() / 60, dow = now.getUTCDay();
    var weekendClosed = (dow === 6) || (dow === 5 && h >= 22) || (dow === 0 && h < 21);
    var list = sessionsUTC(now);
    var html = list.map(function (s) {
      var open = s.s < s.e ? (h >= s.s && h < s.e) : (h >= s.s || h < s.e);
      if (weekendClosed) open = false;
      return '<div class="session' + (open ? " open" : "") + '"><div class="s-top"><b>' + s[L()] + '</b><span class="status"><i></i>' +
        (open ? tr("Ouverte", "Open") : tr("Fermée", "Closed")) + '</span></div><span class="hrs">' + fmtLocal(s.s) + " – " + fmtLocal(s.e) + "</span></div>";
    }).join("");
    box.forEach(function (b) { b.innerHTML = html; });
  }
  renderSessions(); setInterval(renderSessions, 60000);

  /* ---------------- Calculateur de taille de position ---------------- */
  function calc() {
    var f = document.getElementById("calc"); if (!f) return;
    var bal = parseFloat(f.bal.value), risk = parseFloat(f.risk.value), sl = parseFloat(f.sl.value), pv = parseFloat(f.pv.value);
    var out = document.getElementById("calc-lots"), amt = document.getElementById("calc-amt");
    if (!(bal > 0 && risk > 0 && sl > 0 && pv > 0)) { out.textContent = "—"; amt.textContent = "—"; return; }
    var money = bal * risk / 100, lots = money / (sl * pv);
    out.textContent = lots.toFixed(2);
    amt.textContent = money.toLocaleString(L() === "en" ? "en-US" : "fr-FR", { maximumFractionDigits: 2 }) + " $";
    var warn = document.getElementById("calc-warn"); if (warn) warn.hidden = risk <= 2;
  }
  var cf = document.getElementById("calc");
  if (cf) { cf.addEventListener("input", calc); cf.addEventListener("submit", function (e) { e.preventDefault(); calc(); }); }

  /* ---------------- Formulaires ---------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[\d\s().-]{8,20}$/;
  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll("[required]").forEach(function (el) {
      var wrap = el.closest(".field") || el.closest(".consent"); var bad = false;
      if (el.type === "checkbox") bad = !el.checked;
      else if (!el.value.trim()) bad = true;
      else if (el.type === "email" && !EMAIL.test(el.value.trim())) bad = true;
      else if (el.type === "tel" && !PHONE.test(el.value.trim())) bad = true;
      else if (el.minLength > 0 && el.value.trim().length < el.minLength) bad = true;
      if (wrap) wrap.classList.toggle("invalid", bad);
      el.setAttribute("aria-invalid", String(bad));
      if (bad) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }
  function summary(form) {
    var lines = [(form.dataset.subject || "Demande") + " — Global Market Investment", ""];
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      if (!el.name || el.type === "checkbox" || el.name === "_gotcha" || el.type === "hidden") return;
      var lab = form.querySelector('label[for="' + el.id + '"] .' + L());
      var v = el.tagName === "SELECT" ? (el.selectedOptions[0] ? el.selectedOptions[0].textContent.trim() : "") : el.value.trim();
      if (v) lines.push((lab ? lab.textContent.trim() : el.name) + " : " + v);
    });
    return lines.join("\n");
  }
  function result(form, type, text) {
    var box = form.parentNode.querySelector(".form-result"); if (!box) return;
    box.className = "form-result show " + type;
    var tg = "https://t.me/" + C.telegramSupport;
    if (type === "ok") {
      box.innerHTML = "<strong>" + tr("Merci ! Votre demande a bien été envoyée.", "Thank you! Your request has been sent.") +
        "</strong><p class='muted small'>" + tr("Notre équipe vous recontactera rapidement. Vous pouvez aussi nous écrire directement sur Telegram.", "Our team will get back to you shortly. You can also message us directly on Telegram.") +
        "</p><div class='acts'><a class='btn btn-tg btn-sm' target='_blank' rel='noopener' href='" + tg + "'>@" + C.telegramSupport + "</a></div>";
    } else {
      var wa = C.whatsapp ? "<a class='btn btn-ghost btn-sm' target='_blank' rel='noopener' href='https://wa.me/" + String(C.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(text) + "'>WhatsApp</a>" : "";
      box.innerHTML = "<strong>" + (type === "fail" ? tr("L'envoi automatique a échoué.", "Automatic sending failed.") + " " : "") +
        tr("Dernière étape : envoyez votre demande à notre support Telegram.", "Last step: send your request to our Telegram support.") + "</strong>" +
        "<p class='muted small'>" + tr("Votre message est prêt ci-dessous. Copiez-le, puis collez-le dans la conversation Telegram qui s'ouvre.", "Your message is ready below. Copy it, then paste it into the Telegram chat that opens.") + "</p>" +
        "<pre></pre><div class='acts'><button type='button' class='btn btn-gold btn-sm' data-copy>" + tr("Copier et ouvrir Telegram", "Copy & open Telegram") + "</button>" + wa + "</div>";
      box.querySelector("pre").textContent = text;
      box.querySelector("[data-copy]").addEventListener("click", function () {
        var done = function () { window.open(tg, "_blank", "noopener"); };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
        this.textContent = tr("Copié ✓ — ouverture de Telegram…", "Copied ✓ — opening Telegram…");
      });
    }
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  document.querySelectorAll("form[data-lead]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var w = el.closest(".field") || el.closest(".consent");
        if (w && w.classList.contains("invalid")) validate(form);
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form._gotcha && form._gotcha.value) return; // anti-spam
      if (!validate(form)) return;
      var text = summary(form);
      if (!C.formEndpoint) { result(form, "manual", text); return; }
      var btn = form.querySelector("[type=submit]"); btn.disabled = true;
      var data = {}; new FormData(form).forEach(function (v, k) { if (k !== "_gotcha") data[k] = v; });
      data._subject = form.dataset.subject; data.langue_site = L(); data.page = location.pathname;
      fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); result(form, "ok"); })
        .catch(function () { result(form, "fail", text); })
        .finally(function () { btn.disabled = false; });
    });
  });

  /* Pré-sélection d'un programme via ?programme= */
  var pq = new URLSearchParams(location.search).get("programme");
  if (pq) { var sel = document.getElementById("f-programme"); if (sel) sel.value = pq; var sj = document.getElementById("m-sujet"); if (sj && sel) sj.value = "formations"; }
  var oq = new URLSearchParams(location.search).get("objectif");
  if (oq) { var so = document.getElementById("f-objectif"); if (so) so.value = oq; }

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  setLang(getLang());
})();
