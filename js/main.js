/* Portfolio Arian Martinez — render del contenido.
   Fuente: Sanity (js/sanity.js). Si Sanity no responde, usa data/trabajos.js. */
(function () {
  "use strict";

  function render(D) {
  if (!D) return;

  var $ = function (sel) { return document.querySelector(sel); };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function isTodo(str) { return typeof str === "string" && /TODO/.test(str); }

  /* ---------------------------------------------------------- YouTube */
  // "1110s" | "1110" | "18m30s" | "1h2m3s" → segundos
  function parseTime(t) {
    if (!t) return 0;
    if (/^\d+s?$/.test(t)) return parseInt(t, 10);
    var m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    if (!m) return 0;
    return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
  }

  // Acepta un ID suelto o cualquier link de YouTube. Descarta list/pp/start_radio, etc.
  function parseYouTube(input) {
    if (!input) return null;
    input = String(input).trim();
    if (/^[\w-]{11}$/.test(input)) return { id: input, start: 0 };
    var u;
    try { u = new URL(input); } catch (e) { return null; }
    var id = null;
    if (/youtu\.be$/.test(u.hostname)) {
      id = u.pathname.slice(1).split("/")[0];
    } else if (u.pathname === "/watch") {
      id = u.searchParams.get("v");
    } else {
      var m = u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
      id = m && m[1];
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    var start = parseTime(u.searchParams.get("t") || u.searchParams.get("start"));
    return { id: id, start: start };
  }

  function ytWatchUrl(yt) {
    return "https://www.youtube.com/watch?v=" + yt.id + (yt.start ? "&t=" + yt.start + "s" : "");
  }

  function fmtTime(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var mm = (h ? String(m).padStart(2, "0") : m), ss = String(sec).padStart(2, "0");
    return (h ? h + ":" : "") + mm + ":" + ss;
  }

  var PLAY_ICON =
    '<svg viewBox="0 0 68 48" aria-hidden="true" focusable="false"><rect width="68" height="48" rx="12"/><path d="M27 15v18l16-9z"/></svg>';

  function liteYouTube(yt, title) {
    var label = "Reproducir video: " + title + (yt.start ? " (desde " + fmtTime(yt.start) + ")" : "");
    return (
      '<button type="button" class="lite" data-yt="' + esc(yt.id) + '" data-start="' + yt.start +
        '" data-title="' + esc(title) + '" aria-label="' + esc(label) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(yt.id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360" onerror="this.remove()">' +
        '<span class="lite__play">' + PLAY_ICON + "</span>" +
        (yt.start ? '<span class="lite__tc mono" aria-hidden="true">▶ ' + fmtTime(yt.start) + "</span>" : "") +
      "</button>"
    );
  }

  // Click en la miniatura → recién ahí se carga el iframe.
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".lite");
    if (!btn) return;
    var params = "autoplay=1&rel=0&modestbranding=1&playsinline=1";
    if (+btn.dataset.start) params += "&start=" + btn.dataset.start;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + btn.dataset.yt + "?" + params;
    iframe.title = btn.dataset.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.className = "lite__frame";
    btn.replaceWith(iframe);
    iframe.focus();
  });

  /* ------------------------------------------------------------ Cards */
  function metricBadge(metrica) {
    if (!metrica) return "";
    return '<span class="metric"><strong>' + esc(metrica) + "</strong> reproducciones</span>";
  }

  function instagramMedia(p) {
    // Si la portada no existe, el onerror muestra el placeholder.
    return (
      '<a class="reel" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="Ver ' +
        esc(p.titulo) + " en Instagram (se abre en una pestaña nueva)" + '">' +
        '<span class="reel__ph" aria-hidden="true"><span class="mono">9:16</span><span>' + esc(p.cliente) + "</span></span>" +
        (p.portada
          ? '<img src="' + esc(p.portada) + '" alt="Portada del reel ' + esc(p.titulo) + '" loading="lazy" decoding="async" width="720" height="1280" onerror="this.remove()">'
          : "") +
        '<span class="reel__cta">Ver en Instagram <span aria-hidden="true">↗</span></span>' +
      "</a>"
    );
  }

  function workCard(p, lvl) {
    var h = "h" + (lvl || 3);
    var vertical = p.formato === "vertical";
    var media, extLink = "";
    if (p.plataforma === "instagram") {
      media = instagramMedia(p);
    } else {
      var yt = parseYouTube(p.url);
      if (!yt) return "";
      media = liteYouTube(yt, p.titulo);
      extLink = '<a class="card__ext" href="' + ytWatchUrl(yt) + '" target="_blank" rel="noopener">Ver en YouTube<span class="sr-only"> (pestaña nueva)</span> <span aria-hidden="true">↗</span></a>';
    }
    return (
      '<article class="card ' + (vertical ? "card--v" : "card--h") + '">' +
        '<div class="card__media">' + media + metricBadge(p.metrica) + "</div>" +
        '<div class="card__body">' +
          '<p class="card__meta mono"><span>' + esc(p.tipo) + '</span><span class="fmt">' +
            (vertical ? "9:16 vertical" : "16:9 horizontal") + "</span></p>" +
          '<' + h + ' class="card__title' + (isTodo(p.titulo) ? " is-todo" : "") + '">' + esc(p.titulo) + "</" + h + ">" +
          '<p class="card__client' + (isTodo(p.cliente) ? " is-todo" : "") + '">' + esc(p.cliente) + "</p>" +
          '<p class="card__role"><span class="sr-only">Rol: </span>' + esc(p.rol) + "</p>" +
          (p.descripcion ? '<p class="card__desc' + (isTodo(p.descripcion) ? " is-todo" : "") + '">' + esc(p.descripcion) + "</p>" : "") +
          extLink +
        "</div>" +
      "</article>"
    );
  }

  function visible(list) { return (list || []).filter(function (p) { return p && p.url; }); }

  /* ------------------------------------------------------------- Hero */
  var reel = parseYouTube(D.showreel);
  $("#showreel").innerHTML = reel
    ? '<div class="showreel__frame">' + liteYouTube(reel, "Showreel de Arian Martinez") + "</div>"
    : '<div class="showreel__frame showreel__frame--empty" role="img" aria-label="Espacio reservado para el showreel">' +
        '<span class="mono showreel__tc">00:00:00:00</span>' +
        '<span class="showreel__label">Showreel 60–90 s</span>' +
        '<span class="mono showreel__sub">Próximamente</span>' +
      "</div>";

  $("#sobreMi").textContent = D.sobreMi || "";

  /* ---------------------------------------------------------- Números */
  $("#numeros").innerHTML = (D.numeros || []).map(function (n) {
    return '<li class="stat"><span class="stat__value">' + esc(n.valor) + '</span><span class="stat__text">' + esc(n.texto) + "</span></li>";
  }).join("");

  /* ---------------------------------------------------------- Edición */
  var grupos = (D.edicion || []).filter(function (g) { return visible(g.piezas).length; });

  $("#edicionGrupos").innerHTML = grupos.map(function (g) {
    var vertical = visible(g.piezas).every(function (p) { return p.formato === "vertical"; });
    return (
      '<div class="group" data-group="' + esc(g.id) + '">' +
        '<h3 class="group__title"><span class="mono">' + visible(g.piezas).length + " ·</span> " + esc(g.titulo) + "</h3>" +
        '<div class="grid' + (vertical ? " grid--v" : "") + '">' + visible(g.piezas).map(function (p) { return workCard(p, 4); }).join("") + "</div>" +
      "</div>"
    );
  }).join("");

  var filtros = $("#edicionFiltros");
  filtros.innerHTML = [{ id: "todo", titulo: "Todo" }].concat(grupos).map(function (g, i) {
    return '<button type="button" class="filter" data-filter="' + esc(g.id) + '" aria-pressed="' + (i === 0) + '">' + esc(g.titulo) + "</button>";
  }).join("");

  filtros.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".filter");
    if (!btn) return;
    var f = btn.dataset.filter;
    filtros.querySelectorAll(".filter").forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
    document.querySelectorAll("#edicionGrupos .group").forEach(function (g) {
      g.hidden = f !== "todo" && g.dataset.group !== f;
    });
  });

  /* -------------------------------------------------------- Streaming */
  var st = D.streaming || {};
  $("#streamingIntro").textContent = st.intro || "";
  $("#streamingTareas").innerHTML = (st.tareas || []).map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("");
  $("#streamingGrid").innerHTML = visible(st.piezas).map(function (p) { return workCard(p); }).join("");

  /* ------------------------------------------------------------ Redes */
  $("#redesGrid").innerHTML = (D.redes || []).map(function (r) {
    return (
      '<article class="account">' +
        '<p class="account__since mono">Desde ' + esc(r.desde) + "</p>" +
        '<h3 class="account__name"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nombre) +
          '<span class="sr-only"> en Instagram (pestaña nueva)</span></a></h3>' +
        '<p class="account__user mono">' + esc(r.usuario) + "</p>" +
        (r.destacado ? '<p class="account__highlight">' + esc(r.destacado) + "</p>" : "") +
        '<ul class="chips chips--sm" aria-label="Qué hago">' + (r.tareas || []).map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<span class="account__cta" aria-hidden="true">Ver perfil ↗</span>' +
      "</article>"
    );
  }).join("");

  /* ------------------------------------------------------- Producción */
  $("#produccionGrid").innerHTML = visible(D.produccion).map(function (p) { return workCard(p); }).join("");

  /* ----------------------------------------------------- Herramientas */
  $("#herramientasLista").innerHTML = (D.herramientas || []).map(function (h) {
    return '<li class="tool"><span class="tool__name">' + esc(h.nombre) + '</span><span class="tool__use mono">' + esc(h.uso) + "</span></li>";
  }).join("");

  /* --------------------------------------------------------- Contacto */
  var c = D.contacto || {};
  var items = [
    c.email && { label: "Email", value: c.email, href: "mailto:" + c.email },
    c.whatsapp && { label: "WhatsApp", value: c.whatsappVisible || c.whatsapp, href: "https://wa.me/" + String(c.whatsapp).replace(/\D/g, ""), ext: true },
    c.linkedin && { label: "LinkedIn", value: c.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: c.linkedin, ext: true },
    c.instagram && { label: "Instagram", value: c.instagramUsuario || c.instagram, href: c.instagram, ext: true },
  ].filter(Boolean);
  $("#contactoLista").innerHTML = items.map(function (it) {
    return (
      '<li><a class="contact__item" href="' + esc(it.href) + '"' + (it.ext ? ' target="_blank" rel="noopener"' : "") + ">" +
        '<span class="contact__label mono">' + esc(it.label) + "</span>" +
        '<span class="contact__value' + (isTodo(it.value) ? " is-todo" : "") + '">' + esc(it.value) + "</span>" +
        (it.ext ? '<span class="sr-only"> (pestaña nueva)</span>' : "") +
      "</a></li>"
    );
  }).join("");
  if (c.cv) $("#cvLink").setAttribute("href", c.cv);

  $("#year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------- Navegación */
  var toggle = $("#navToggle"), menu = $("#navMenu");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open);
    toggle.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
    document.body.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  menu.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
  });

  // Barra de progreso tipo cabezal de reproducción
  var head = $("#playhead");
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    head.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Sección activa en el menú
  if ("IntersectionObserver" in window) {
    var links = {};
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------- Aviso TODO */
  // Solo en la consola del navegador: cuántos campos quedan por completar.
  var todos = [];
  (function walk(o, path) {
    if (typeof o === "string") { if (isTodo(o)) todos.push(path); return; }
    if (o && typeof o === "object") Object.keys(o).forEach(function (k) { walk(o[k], path ? path + "." + k : k); });
  })(D, "");
  if (todos.length && console && console.info) {
    console.info("[portfolio] Quedan " + todos.length + " campos con TODO (fuente: " + (D._fuente || "data/trabajos.js") + "):\n- " + todos.join("\n- "));
  }
  }

  var local = window.PORTFOLIO;
  if (window.cargarDesdeSanity) {
    window.cargarDesdeSanity(local).then(render, function (err) {
      if (console && console.warn) console.warn("[portfolio] Sanity no respondió, uso data/trabajos.js.", err);
      render(local);
    });
  } else {
    render(local);
  }
})();
