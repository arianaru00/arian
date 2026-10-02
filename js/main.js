/* Portfolio Arian Martinez — render del contenido.
   Fuente: Sanity (js/sanity.js). Si Sanity no responde, usa data/trabajos.js.
   Guía visual: DESIGN.md */
(function () {
  "use strict";

  var $ = function (sel) { return document.querySelector(sel); };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function isTodo(str) { return typeof str === "string" && /TODO/.test(str); }
  function todoClass(str) { return isTodo(str) ? " is-todo" : ""; }
  function pad(n) { return String(n).padStart(2, "0"); }

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
    return { id: id, start: parseTime(u.searchParams.get("t") || u.searchParams.get("start")) };
  }

  function ytWatchUrl(yt) {
    return "https://www.youtube.com/watch?v=" + yt.id + (yt.start ? "&t=" + yt.start + "s" : "");
  }

  function fmtTime(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + pad(m) : m) + ":" + pad(sec);
  }

  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';
  var HANDLES = '<span class="h h--tl" aria-hidden="true"></span><span class="h h--tr" aria-hidden="true"></span>' +
                '<span class="h h--bl" aria-hidden="true"></span><span class="h h--br" aria-hidden="true"></span>';

  function liteYouTube(yt, title) {
    var label = "Reproducir video: " + title + (yt.start ? " (desde " + fmtTime(yt.start) + ")" : "");
    return (
      '<button type="button" class="lite" data-yt="' + esc(yt.id) + '" data-start="' + yt.start +
        '" data-title="' + esc(title) + '" aria-label="' + esc(label) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(yt.id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360" onerror="this.remove()">' +
        '<span class="lite__play">' + PLAY_ICON + "</span>" +
        (yt.start ? '<span class="lite__tc mono" aria-hidden="true">IN ' + fmtTime(yt.start) + "</span>" : "") +
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
  var clipCount = 0;

  function metricBadge(metrica) {
    if (!metrica) return "";
    return '<span class="metric"><strong>' + esc(metrica) + '</strong><span class="metric__label"> reproducciones</span></span>';
  }

  function instagramMedia(p) {
    // Si la portada no existe, el onerror deja ver el placeholder.
    return (
      '<a class="reel" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="Ver ' +
        esc(p.titulo) + ' en Instagram (se abre en una pestaña nueva)">' +
        '<span class="reel__ph" aria-hidden="true"><span class="mono">9:16</span><span>' + esc(p.cliente) + "</span></span>" +
        (p.portada
          ? '<img src="' + esc(p.portada) + '" alt="Portada del reel ' + esc(p.titulo) + '" loading="lazy" decoding="async" width="720" height="1280" onerror="this.remove()">'
          : "") +
        '<span class="reel__cta mono">Ver en Instagram <span aria-hidden="true">↗</span></span>' +
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
      extLink = '<a class="card__ext mono" href="' + ytWatchUrl(yt) + '" target="_blank" rel="noopener">Ver en YouTube<span class="sr-only"> (pestaña nueva)</span> <span aria-hidden="true">↗</span></a>';
    }
    clipCount++;
    var clip = (p.plataforma === "instagram" ? "REEL_" : "CLIP_") + pad(clipCount) + ".MP4";
    return (
      '<article class="card ' + (vertical ? "card--v" : "card--h") + '">' +
        '<div class="card__media">' + media +
          '<span class="cliptag mono" aria-hidden="true">' + PLAY_ICON + clip + "</span>" +
          metricBadge(p.metrica) + HANDLES +
        "</div>" +
        '<div class="card__body">' +
          '<p class="card__meta mono"><span class="dot" aria-hidden="true"></span>' + esc(p.tipo) + "</p>" +
          "<" + h + ' class="card__title' + todoClass(p.titulo) + '">' + esc(p.titulo) + "</" + h + ">" +
          '<p class="card__client' + todoClass(p.cliente) + '">' + esc(p.cliente) + "</p>" +
          (p.descripcion ? '<p class="card__desc' + todoClass(p.descripcion) + '">' + esc(p.descripcion) + "</p>" : "") +
          '<ul class="tags tags--card"><li class="tag tag--ink"><span class="sr-only">Rol: </span>' + esc(p.rol) + '</li>' +
            '<li class="tag">' + (vertical ? "9:16 vertical" : "16:9 horizontal") + "</li></ul>" +
          extLink +
        "</div>" +
      "</article>"
    );
  }

  function visible(list) { return (list || []).filter(function (p) { return p && p.url; }); }

  var PANEL_COLORS = ["cyan", "ink", "yellow", "magenta"];
  var TAB_POS = ["left", "center", "right"];
  var AVATAR_COLORS = ["cyan", "yellow", "magenta", "green"];

  // "OBS Studio" → OBS · "RodeCaster II Pro" → RC · "Walter Rippel" → WR · "ffmpeg" → FF
  function initials(name) {
    var parts = String(name).replace(/[^\wÀ-ÿ ]/g, " ").trim().split(/\s+/), w = parts[0] || "";
    var caps = w.match(/[A-ZÀ-Ý]/g) || [];
    if (w.length <= 4 && w === w.toUpperCase()) return w;
    if (caps.length >= 2) return caps.slice(0, 2).join("");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return w.slice(0, 2).toUpperCase();
  }

  /* ---------------------------------------------------------- Render */
  function render(D) {
    if (!D) return;

    // Hero: showreel
    var reel = parseYouTube(D.showreel);
    $("#showreel").innerHTML =
      '<div class="showreel__frame' + (reel ? "" : " showreel__frame--empty") + '">' +
        (reel
          ? liteYouTube(reel, "Showreel de Arian Martinez")
          : '<div class="showreel__ph" role="img" aria-label="Espacio reservado para el showreel">' +
              '<span class="showreel__label">Showreel</span>' +
              '<span class="mono">60–90 s · próximamente</span>' +
            "</div>") +
        '<span class="cliptag mono" aria-hidden="true">' + PLAY_ICON + "SHOWREEL.MP4</span>" + HANDLES +
      "</div>";

    $("#sobreMi").textContent = D.sobreMi || "";

    // Números
    $("#numeros").innerHTML = (D.numeros || []).map(function (n, i) {
      return '<li class="stat stat--' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '"><span class="stat__value">' + esc(n.valor) +
        '</span><span class="stat__text">' + esc(n.texto) + "</span></li>";
    }).join("");

    // Edición: una carpeta de color por categoría
    var grupos = (D.edicion || []).filter(function (g) { return visible(g.piezas).length; });

    $("#edicionGrupos").innerHTML = grupos.map(function (g, i) {
      var piezas = visible(g.piezas);
      var vertical = piezas.every(function (p) { return p.formato === "vertical"; });
      return (
        '<div class="group panel panel--' + PANEL_COLORS[i % PANEL_COLORS.length] + " panel--tab-" + TAB_POS[i % TAB_POS.length] +
          '" data-group="' + esc(g.id) + '">' +
          '<p class="panel__tab mono">Categoría ' + pad(i + 1) + "</p>" +
          '<div class="panel__head"><p class="mono"><span class="dot" aria-hidden="true"></span>' + piezas.length +
            (piezas.length === 1 ? " pieza" : " piezas") + "</p>" +
            '<h3 class="panel__title">' + esc(g.titulo) + "</h3></div>" +
          '<div class="grid' + (vertical ? " grid--v" : "") + '">' + piezas.map(function (p) { return workCard(p, 4); }).join("") + "</div>" +
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

    // Streaming
    var st = D.streaming || {};
    $("#streamingIntro").textContent = st.intro || "";
    $("#streamingTareas").innerHTML = (st.tareas || []).map(function (t) { return '<li class="tag tag--light">' + esc(t) + "</li>"; }).join("");
    $("#streamingGrid").innerHTML = visible(st.piezas).map(function (p) { return workCard(p); }).join("");

    // Redes: tarjetas tipo comentario
    $("#redesGrid").innerHTML = (D.redes || []).map(function (r, i) {
      return (
        '<article class="account">' +
          '<div class="account__top">' +
            '<span class="avatar avatar--' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '" aria-hidden="true">' + esc(initials(r.nombre)) + "</span>" +
            '<div class="account__id"><h3 class="account__name"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nombre) +
              '<span class="sr-only"> en Instagram (pestaña nueva)</span></a></h3>' +
            '<p class="account__user mono">' + esc(r.usuario) + "</p></div>" +
            '<p class="account__since mono">Desde ' + esc(r.desde) + "</p>" +
          "</div>" +
          (r.destacado ? '<p class="account__highlight' + todoClass(r.destacado) + '"><mark>' + esc(r.destacado) + "</mark></p>" : "") +
          '<ul class="tags" aria-label="Qué hago">' + (r.tareas || []).map(function (t) { return '<li class="tag">' + esc(t) + "</li>"; }).join("") + "</ul>" +
          '<span class="account__cta mono" aria-hidden="true">Ver perfil ↗</span>' +
        "</article>"
      );
    }).join("");

    // Producción
    $("#produccionGrid").innerHTML = visible(D.produccion).map(function (p) { return workCard(p); }).join("");

    // Herramientas
    $("#herramientasLista").innerHTML = (D.herramientas || []).map(function (h, i) {
      return '<li class="tool"><span class="tool__ico tool__ico--' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '" aria-hidden="true">' +
        esc(initials(h.nombre)) + '</span><span class="tool__txt"><span class="tool__name">' + esc(h.nombre) +
        '</span><span class="tool__use mono">' + esc(h.uso) + "</span></span></li>";
    }).join("");

    // Contacto
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
          '<span class="contact__value' + todoClass(it.value) + '">' + esc(it.value) + "</span>" +
          (it.ext ? '<span class="sr-only"> (pestaña nueva)</span>' : "") +
        "</a></li>"
      );
    }).join("");
    if (c.email) $("#contactBtn").setAttribute("href", "mailto:" + c.email);
    if (c.cv) $("#cvLink").setAttribute("href", c.cv);

    $("#year").textContent = new Date().getFullYear();

    // Aviso TODO (solo consola)
    var todos = [];
    (function walk(o, path) {
      if (typeof o === "string") { if (isTodo(o)) todos.push(path); return; }
      if (o && typeof o === "object") Object.keys(o).forEach(function (k) { walk(o[k], path ? path + "." + k : k); });
    })(D, "");
    if (todos.length && console && console.info) {
      console.info("[portfolio] Quedan " + todos.length + " campos con TODO (fuente: " + (D._fuente || "data/trabajos.js") + "):\n- " + todos.join("\n- "));
    }
  }

  /* ------------------------------------------------------- Navegación */
  var toggle = $("#navToggle"), menu = $("#navMenu");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open);
    $("#navToggleSr").textContent = open ? "Cerrar menú" : "Abrir menú";
    document.body.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  menu.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
  });

  // Regla de timecode: una marca cada 100 px, como la regla de una línea de tiempo
  function buildRulers() {
    document.querySelectorAll("[data-ruler]").forEach(function (el) {
      var n = Math.ceil(el.offsetWidth / 100) + 1, html = "";
      for (var i = 0; i < n; i++) html += '<span style="left:' + i * 100 + 'px">' + pad(Math.floor(i / 6)) + ":" + pad((i % 6) * 10) + "</span>";
      el.innerHTML = html;
    });
  }
  buildRulers();
  var rt;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildRulers, 150); });

  // Cabezal de reproducción = progreso del scroll
  var head = $("#playhead");
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    head.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max) : 0);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Timecode en vivo (25 fps)
  var tc = $("#tc");
  function tick() {
    if (document.hidden) return;
    var d = new Date();
    var ff = reduceMotion ? 0 : Math.floor(d.getMilliseconds() / 40);
    tc.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + ":" + pad(ff);
  }
  tick();
  setInterval(tick, reduceMotion ? 1000 : 40);

  // Sección activa en el menú
  if ("IntersectionObserver" in window) {
    var links = {};
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (a && e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------- Boot */
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
