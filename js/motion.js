/* Movimiento del sitio — "mesa de trabajo compartida".
   Stickers que flotan y se arrastran, cursores que deambulan, cursor "VOS",
   regla que sigue al mouse, títulos que se encienden letra por letra,
   texto que se revela con el scroll, blob que mira y parpadea.
   Todo se desactiva con prefers-reduced-motion. Guía: DESIGN.md §6. */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  if (reduce) return; // el sitio funciona igual, solo sin movimiento

  document.documentElement.classList.add("motion");

  /* ------------------------------------------------------------ Puntero */
  var mouse = { x: innerWidth / 2, y: innerHeight / 2, active: false };
  addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  }, { passive: true });
  document.addEventListener("pointerleave", function () { mouse.active = false; });
  addEventListener("blur", function () { mouse.active = false; });

  /* --------------------------------------------- Cursor "VOS" + regla */
  var you, youTag, rulerHover, rulerLabel;
  if (fine) {
    you = document.createElement("div");
    you.className = "you";
    you.setAttribute("aria-hidden", "true");
    you.innerHTML = '<span class="you__dot"></span><span class="you__tag">Vos</span>';
    document.body.appendChild(you);
    youTag = $(".you__tag", you);

    var ruler = $("#nav .ruler");
    if (ruler) {
      rulerHover = document.createElement("span");
      rulerHover.className = "ruler__hover";
      rulerHover.innerHTML = '<span class="ruler__hover-tc"></span>';
      ruler.appendChild(rulerHover);
      rulerLabel = $(".ruler__hover-tc", rulerHover);
    }

    // La etiqueta cambia según lo que hay debajo del mouse
    document.addEventListener("pointerover", function (e) {
      var t = e.target;
      var label = t.closest(".lite") ? "Play" :
        t.closest("[data-drag]") ? "Arrastrá" :
        t.closest(".reel") ? "Abrir" :
        t.closest(".side-switch__opt") ? "Cambiar" :
        t.closest("a, button") ? "Clic" : "Vos";
      if (youTag.textContent !== label) youTag.textContent = label;
      you.classList.toggle("is-action", label !== "Vos");
    });
  }
  var cur = { x: mouse.x, y: mouse.y };

  /* ------------------------------------- Stickers y cursores del hero */
  // Cada elemento flota con una mezcla de senos (nunca repite igual), se corre
  // un poco hacia el mouse y con el scroll, y con mouse se puede arrastrar.
  var floaters = [
    { sel: ".stage__a", ax: 6, ay: 5, rot: 3, sp: 0.6, depth: 10, par: 0.10 },
    { sel: ".stage__b", ax: 7, ay: 4, rot: 2.5, sp: 0.5, depth: 12, par: 0.14 },
    { sel: ".stage__hand", ax: 3, ay: 3, rot: 2, sp: 0.8, depth: 5, par: 0.04 },
    { sel: ".stage__c", ax: 14, ay: 10, rot: 8, sp: 0.7, depth: 16, par: 0.18 },
    { sel: ".stage__d", ax: 34, ay: 18, rot: 6, sp: 0.35, depth: 20, par: 0.22, cursor: true },
    { sel: ".stage__e", ax: 26, ay: 16, rot: 5, sp: 0.3, depth: 22, par: 0.26, cursor: true },
  ].map(function (f, i) {
    f.el = $(f.sel);
    f.ph = i * 1.7 + 0.4;
    f.drag = { x: 0, y: 0 };
    f.mx = 0; f.my = 0;
    return f;
  }).filter(function (f) { return f.el; });

  if (fine) {
    floaters.forEach(function (f) {
      var el = f.el, start = null;
      el.setAttribute("data-drag", "");
      el.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        start = { x: e.clientX - f.drag.x, y: e.clientY - f.drag.y };
        el.classList.add("is-dragging");
      });
      el.addEventListener("pointermove", function (e) {
        if (!start) return;
        f.drag.x = e.clientX - start.x;
        f.drag.y = e.clientY - start.y;
      });
      function end() { start = null; el.classList.remove("is-dragging"); }
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    });
  }

  var heroVisible = true;
  var hero = $(".hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(hero);
  }

  /* ------------------------------------------------- Blob de contacto */
  var blob = $(".blob"), eyes = $(".blob__eyes"), blobVisible = false;
  if (blob && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { blobVisible = es[0].isIntersecting; }).observe(blob);
  }
  var eye = { x: 0, y: 0 };

  /* ------------------------------------ Elementos ligados al scroll */
  var scrollRot = $$("[data-scroll-rot]");
  var words = []; // textos que se revelan palabra por palabra

  function splitWords(el) {
    if (!el || el.dataset.split) return;
    var text = el.textContent;
    if (!text.trim()) return;
    el.dataset.split = "1";
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/(\s+)/).map(function (w) {
      return /^\s+$/.test(w) ? w : '<span class="w" aria-hidden="true">' + w.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</span>";
    }).join("");
    words.push({ el: el, spans: $$(".w", el), last: -1 });
  }

  function progressIn(el, from, to) {
    // 0 cuando el borde superior está en `from` (fracción de alto de pantalla), 1 cuando llega a `to`
    var r = el.getBoundingClientRect();
    return clamp((innerHeight * from - r.top) / (innerHeight * (from - to)), 0, 1);
  }

  /* ----------------------------------------------------------- Loop */
  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;

    // Cursor VOS y marcador de la regla
    if (you) {
      cur.x = lerp(cur.x, mouse.x, 0.32);
      cur.y = lerp(cur.y, mouse.y, 0.32);
      you.style.transform = "translate3d(" + cur.x.toFixed(1) + "px," + cur.y.toFixed(1) + "px,0)";
      you.classList.toggle("is-on", mouse.active);
      if (rulerHover) {
        rulerHover.style.transform = "translateX(" + mouse.x.toFixed(0) + "px)";
        rulerHover.classList.toggle("is-on", mouse.active);
        var secs = Math.max(0, Math.round(mouse.x / 10));
        rulerLabel.textContent = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
      }
    }

    // Hero: flotar + mouse + scroll + arrastre
    if (heroVisible && floaters.length) {
      var cx = (mouse.x / innerWidth - 0.5) * 2, cy = (mouse.y / innerHeight - 0.5) * 2;
      floaters.forEach(function (f) {
        var s = t * f.sp + f.ph;
        var x = Math.sin(s) * f.ax + Math.sin(s * 2.3 + 1.1) * f.ax * 0.35;
        var y = Math.cos(s * 0.9) * f.ay + Math.sin(s * 1.7 + 0.5) * f.ay * 0.4;
        var r = Math.sin(s * 0.8 + 2) * f.rot;
        f.mx = lerp(f.mx, mouse.active ? cx * f.depth : 0, 0.06);
        f.my = lerp(f.my, mouse.active ? cy * f.depth : 0, 0.06);
        var py = -scrollY * f.par;
        if (f.el.classList.contains("is-dragging")) { x = 0; y = 0; }
        f.el.style.translate = (x + f.mx + f.drag.x).toFixed(1) + "px " + (y + f.my + py + f.drag.y).toFixed(1) + "px";
        f.el.style.rotate = r.toFixed(2) + "deg";
      });
    }

    // Blob: los ojos siguen al mouse
    if (eyes && blobVisible) {
      var br = blob.getBoundingClientRect();
      var dx = mouse.x - (br.left + br.width / 2), dy = mouse.y - (br.top + br.height / 2);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
      eye.x = lerp(eye.x, (dx / d) * 9 * k, 0.12);
      eye.y = lerp(eye.y, (dy / d) * 7 * k, 0.12);
      eyes.setAttribute("transform", "translate(" + eye.x.toFixed(2) + " " + eye.y.toFixed(2) + ")");
    }

    // Scroll: rotación que se endereza y palabras que se encienden
    scrollRot.forEach(function (el) {
      var p = progressIn(el, 0.95, 0.55);
      el.style.rotate = ((1 - p) * (+el.dataset.scrollRot || -10)).toFixed(2) + "deg";
    });
    words.forEach(function (w) {
      var n = Math.round(progressIn(w.el, 0.9, 0.4) * w.spans.length);
      if (n === w.last) return;
      w.last = n;
      w.spans.forEach(function (s, i) { s.classList.toggle("on", i < n); });
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ------------------------------ Títulos pixel: se encienden letra a letra */
  function prepTitle(el) {
    if (el.dataset.lit) return;
    var text = el.textContent;
    el.dataset.lit = "0";
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/(\s+)/).map(function (word) {
      if (/^\s+$/.test(word)) return " ";
      return '<span class="pw" aria-hidden="true">' + word.split("").map(function (c) {
        return '<span class="pc">' + c + "</span>";
      }).join("") + "</span>";
    }).join("");
  }
  function lightTitle(el) {
    if (el.dataset.lit === "1") return;
    el.dataset.lit = "1";
    $$(".pc", el).forEach(function (c, i) {
      setTimeout(function () { c.classList.add("on"); }, 120 + i * 55);
    });
  }

  /* ------------------------------------------- Aparición al entrar */
  var REVEAL = ".card, .account, .stat, .skill, .tool, .note, .polaroid, .tagbox, .comment, .bigbtn, .contact-sheet, .side-switch, .section__head .sticker, .showreel";
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.matches(".pixel-title, .hero__title")) lightTitle(el);
      else el.classList.add("in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }) : null;

  function wire() {
    $$(".pixel-title, .hero__title").forEach(function (el) {
      prepTitle(el);
      if (io) io.observe(el); else lightTitle(el);
    });
    $$(REVEAL).forEach(function (el) {
      if (el.classList.contains("rv")) return;
      // escalonado dentro del mismo contenedor
      var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--d", Math.min(sib, 6) * 70 + "ms");
      el.classList.add("rv");
      if (io) io.observe(el); else el.classList.add("in");
    });
    splitWords($("#sobreMi"));
    scrollRot = $$("[data-scroll-rot]");
  }

  // El contenido lo arma main.js (puede venir de Sanity): esperamos a que esté
  if (window.__portfolioRendered) wire();
  document.addEventListener("portfolio:render", wire);
  // Al cambiar de lado de la cámara aparecen tarjetas nuevas
  document.addEventListener("click", function (e) {
    if (e.target.closest(".side-switch__opt, [data-side-go]")) setTimeout(wire, 30);
  });

  /* --------------------------------- Menú: bloque que se desliza */
  var menuUl = $("#navMenu ul");
  if (menuUl && fine) {
    var pill = document.createElement("li");
    pill.className = "nav__pill";
    pill.setAttribute("aria-hidden", "true");
    menuUl.insertBefore(pill, menuUl.firstChild);
    menuUl.classList.add("has-pill");
    $$("a:not(.nav__cta)", menuUl).forEach(function (a) {
      a.addEventListener("pointerenter", function () {
        if (innerWidth < 900) return;
        var r = a.getBoundingClientRect(), u = menuUl.getBoundingClientRect();
        pill.style.width = r.width + "px";
        pill.style.transform = "translateX(" + (r.left - u.left) + "px)";
        menuUl.classList.add("pill-on");
      });
    });
    menuUl.addEventListener("pointerleave", function () { menuUl.classList.remove("pill-on"); });
  }
})();
