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
    // Playlist (youtube.com/playlist?list=…): se embebe como lista completa
    var list = u.searchParams.get("list");
    if (u.pathname === "/playlist" && list && /^[\w-]+$/.test(list)) return { list: list, start: 0 };
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
    if (yt.list) return "https://www.youtube.com/playlist?list=" + yt.list;
    return "https://www.youtube.com/watch?v=" + yt.id + (yt.start ? "&t=" + yt.start + "s" : "");
  }

  function fmtTime(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + pad(m) : m) + ":" + pad(sec);
  }

  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';
  var HANDLES = '<span class="h h--tl" aria-hidden="true"></span><span class="h h--tr" aria-hidden="true"></span>' +
                '<span class="h h--bl" aria-hidden="true"></span><span class="h h--br" aria-hidden="true"></span>';

  function liteYouTube(yt, title, portada) {
    var label = (yt.list ? "Reproducir playlist: " : "Reproducir video: ") + title + (yt.start ? " (desde " + fmtTime(yt.start) + ")" : "");
    return (
      '<button type="button" class="lite' + (yt.list && !portada ? " lite--list" : "") + '"' +
        (yt.list ? ' data-list="' + esc(yt.list) + '"' : ' data-yt="' + esc(yt.id) + '"') + ' data-start="' + yt.start +
        '" data-title="' + esc(title) + '" aria-label="' + esc(label) + '">' +
        (portada
          ? '<img src="' + esc(portada) + '" alt="" loading="lazy" decoding="async" width="1280" height="720" onerror="this.remove()">'
          : yt.list
          // Una playlist no tiene miniatura fija: placeholder con el título
          ? '<span class="lite__list" aria-hidden="true"><span class="mono">Playlist</span><span>' + esc(title) + '</span><span class="lite__list-play">' + PLAY_ICON + "</span></span>"
          : '<img src="https://i.ytimg.com/vi/' + esc(yt.id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360" onerror="this.remove()">') +
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
    iframe.src = btn.dataset.list
      ? "https://www.youtube-nocookie.com/embed/videoseries?list=" + btn.dataset.list + "&" + params
      : "https://www.youtube-nocookie.com/embed/" + btn.dataset.yt + "?" + params;
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

  var PLATAFORMAS = {
    instagram: { nombre: "Instagram", clip: "REEL_" },
    tiktok: { nombre: "TikTok", clip: "TIKTOK_" },
    link: { nombre: "el sitio", clip: "LINK_" },
    youtube: { nombre: "YouTube", clip: "CLIP_" },
  };

  // Portada + link externo (Instagram, TikTok u otro). Si la portada no existe, se ve el placeholder.
  function coverMedia(p) {
    var plat = PLATAFORMAS[p.plataforma] || PLATAFORMAS.link;
    var vertical = p.formato === "vertical";
    // Portada subida, o la miniatura de un video de YouTube (el clic igual va al link)
    var pv = !p.portada && parseYouTube(p.portadaVideo);
    var cover = p.portada || (pv && pv.id ? "https://i.ytimg.com/vi/" + pv.id + "/hqdefault.jpg" : null);
    return (
      '<a class="reel" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="Ver ' +
        esc(p.titulo) + " en " + plat.nombre + ' (se abre en una pestaña nueva)">' +
        '<span class="reel__ph" aria-hidden="true"><span class="mono">' + (vertical ? "9:16" : "16:9") + "</span><span>" + esc(p.cliente) + "</span></span>" +
        (cover
          ? '<img src="' + esc(cover) + '" alt="Portada de ' + esc(p.titulo) + '" loading="lazy" decoding="async" width="' +
            (vertical ? "720\" height=\"1280" : "1280\" height=\"720") + '" onerror="this.remove()">'
          : "") +
        '<span class="reel__cta mono">' + esc(p.cta || "Ver en " + plat.nombre) + ' <span aria-hidden="true">↗</span></span>' +
      "</a>"
    );
  }

  // Reel o post de Instagram sin portada: el reproductor oficial de Instagram, recortado al 9:16
  // (se esconde el encabezado con el usuario). Se escala con fitInstagram() porque Instagram no baja de 326 px.
  function igCode(url) {
    var m = /instagram\.com\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/.exec(url || "");
    return m ? { tipo: m[1] === "p" ? "p" : "reel", code: m[2] } : null;
  }
  function igEmbed(p) {
    var ig = igCode(p.url);
    return '<div class="igwrap"><iframe class="igwrap__frame" src="https://www.instagram.com/' + ig.tipo + "/" + esc(ig.code) +
      '/embed/" title="' + esc(p.titulo) + ' en Instagram" loading="lazy" scrolling="no" allowtransparency="true"' +
      ' allow="autoplay; encrypted-media; picture-in-picture"></iframe></div>';
  }
  var IG_MIN = 326, IG_HEAD = 54; // ancho mínimo del reproductor y alto del encabezado que se recorta
  function fitInstagram(root) {
    (root || document).querySelectorAll(".igwrap").forEach(function (w) {
      var cw = w.clientWidth, ch = w.clientHeight;
      if (!cw) return; // pestaña oculta
      var fw = Math.max(IG_MIN, cw), s = cw / fw, f = w.firstElementChild;
      f.style.width = fw + "px";
      f.style.height = Math.ceil(ch / s + IG_HEAD + 320) + "px";
      f.style.transform = "translateY(" + (-IG_HEAD * s) + "px) scale(" + s + ")";
    });
  }
  var igRt;
  addEventListener("resize", function () { clearTimeout(igRt); igRt = setTimeout(fitInstagram, 120); });

  // Sitio web: marco de navegador con la captura (si se subió) o el nombre del sitio
  function dominio(url) { return String(url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, ""); }
  function browserMedia(p) {
    return '<a class="browser" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="Visitar ' + esc(p.titulo) + ' (pestaña nueva)">' +
      '<span class="browser__bar" aria-hidden="true"><span class="browser__dots"><i></i><i></i><i></i></span>' +
        '<span class="browser__url mono">' + esc(dominio(p.url)) + "</span></span>" +
      '<span class="browser__view">' + (p.portada
        ? '<img src="' + esc(p.portada) + '" alt="Captura de ' + esc(p.titulo) + '" loading="lazy" decoding="async" width="1280" height="720" onerror="this.remove()">'
        : "") +
        '<span class="browser__ph" aria-hidden="true"><span class="browser__name">' + esc(p.titulo) + '</span><span class="mono">' + esc(dominio(p.url)) + "</span></span>" +
      "</span></a>";
  }

  // Video subido a Sanity: se reproduce acá mismo, sin cargar nada hasta el play
  function fileVideo(p) {
    return '<video class="vfile" controls playsinline preload="none"' + (p.portada ? ' poster="' + esc(p.portada) + '"' : "") +
      ' aria-label="' + esc(p.titulo) + '"><source src="' + esc(p.video) + '"></video>';
  }

  function workCard(p, lvl) {
    var h = "h" + (lvl || 3);
    var vertical = p.formato === "vertical";
    var media, extLink = "";
    if (p.seccion === "web") {
      media = browserMedia(p);
      extLink = '<a class="card__cta" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.cta || "Visitar sitio") +
        ' <span aria-hidden="true">↗</span><span class="sr-only"> (pestaña nueva)</span></a>';
    } else if (p.video) {
      media = fileVideo(p);
      if (p.url) extLink = '<a class="card__cta" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.cta || "Ver más") +
        ' <span aria-hidden="true">↗</span><span class="sr-only"> (pestaña nueva)</span></a>';
    } else if (p.plataforma === "instagram" && !p.portada && !p.portadaVideo && igCode(p.url)) {
      media = igEmbed(p);
      extLink = '<a class="card__ext mono" href="' + esc(p.url) + '" target="_blank" rel="noopener">Ver en Instagram<span class="sr-only"> (pestaña nueva)</span> <span aria-hidden="true">↗</span></a>';
    } else if (p.plataforma && p.plataforma !== "youtube") {
      media = coverMedia(p);
      // Con texto de botón propio ("Comprar entradas"), también va un botón visible en la tarjeta
      if (p.cta) extLink = '<a class="card__cta" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.cta) +
        ' <span aria-hidden="true">↗</span><span class="sr-only"> (pestaña nueva)</span></a>';
    } else {
      var yt = parseYouTube(p.url);
      if (!yt) return "";
      media = liteYouTube(yt, p.titulo, p.portada);
      extLink = '<a class="card__ext mono" href="' + ytWatchUrl(yt) + '" target="_blank" rel="noopener">Ver en YouTube<span class="sr-only"> (pestaña nueva)</span> <span aria-hidden="true">↗</span></a>';
    }
    clipCount++;
    var clip = p.seccion === "web" ? "WEB_" + pad(clipCount) : ((p.video ? "CLIP_" : (PLATAFORMAS[p.plataforma] || PLATAFORMAS.youtube).clip) + pad(clipCount) +
      (p.plataforma === "link" && !p.video ? "" : ".MP4"));
    return (
      '<article class="card ' + (vertical ? "card--v" : "card--h") + '">' +
        '<div class="card__media">' + media +
          (p.seccion === "web" ? "" : '<span class="cliptag mono" aria-hidden="true">' + PLAY_ICON + clip + "</span>") +
          metricBadge(p.metrica) + HANDLES +
        "</div>" +
        '<div class="card__body">' +
          '<p class="card__meta mono"><span class="dot" aria-hidden="true"></span>' + esc(p.tipo) + "</p>" +
          "<" + h + ' class="card__title' + todoClass(p.titulo) + '">' + esc(p.titulo) + "</" + h + ">" +
          '<p class="card__client' + todoClass(p.cliente) + '">' + esc(p.cliente) + "</p>" +
          (p.descripcion ? '<p class="card__desc' + todoClass(p.descripcion) + '">' + esc(p.descripcion) + "</p>" : "") +
          '<ul class="tags tags--card"><li class="tag tag--ink"><span class="sr-only">Rol: </span>' + esc(p.rol) + '</li>' +
            (p.seccion === "web" ? "" : '<li class="tag">' + (vertical ? "9:16 vertical" : "16:9 horizontal") + "</li>") + "</ul>" +
          extLink +
        "</div>" +
      "</article>"
    );
  }

  function visible(list) { return (list || []).filter(function (p) { return p && (p.url || p.video); }); }

  var PANEL_COLORS = ["cyan", "ink", "yellow", "magenta"];
  var AVATAR_COLORS = ["cyan", "yellow", "magenta", "green"];

  // Logos reales de las herramientas más comunes (assets/logos). En Sanity se puede subir uno propio.
  var LOGOS = [
    [/premiere/i, "premiere.svg"], [/\bobs\b/i, "obs.svg"], [/capcut/i, "capcut.jpg"], [/canva/i, "canva.jpg"],
    [/vmix/i, "vmix.svg"], [/ableton/i, "ableton.png"], [/ffmpeg/i, "ffmpeg.svg"],
  ];
  function logoDe(nombre) {
    for (var i = 0; i < LOGOS.length; i++) if (LOGOS[i][0].test(nombre || "")) return "assets/logos/" + LOGOS[i][1];
    return null;
  }

  // "OBS Studio" → OBS · "RodeCaster II Pro" → RC · "Walter Rippel" → WR · "ffmpeg" → FF
  function initials(name) {
    var parts = String(name).replace(/[^\wÀ-ÿ ]/g, " ").trim().split(/\s+/), w = parts[0] || "";
    var caps = w.match(/[A-ZÀ-Ý]/g) || [];
    if (w.length <= 4 && w === w.toUpperCase()) return w;
    if (caps.length >= 2) return caps.slice(0, 2).join("");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return w.slice(0, 2).toUpperCase();
  }

  function slug(str) { return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  var NAV_BTNS =
    '<div class="track__nav" hidden>' +
      '<button type="button" class="track__btn" data-dir="-1" aria-label="Piezas anteriores"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" class="track__btn" data-dir="1" aria-label="Piezas siguientes"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg></button>' +
    "</div>";

  function panelHead(count, title) {
    return '<div class="panel__head"><div><p class="mono"><span class="dot" aria-hidden="true"></span>' + count + "</p>" + (title || "") + "</div>" + NAV_BTNS + "</div>";
  }

  // Tira horizontal de piezas: mantiene cada carpeta baja para que el apilado no tape nada
  function trackClass(piezas) {
    var vertical = piezas.every(function (p) { return p.formato === "vertical"; });
    return "track" + (vertical ? " track--v" : "") + (piezas.length === 1 ? " track--solo" : "");
  }
  function track(piezas, lvl) {
    return '<div class="' + trackClass(piezas) + '">' + piezas.map(function (p) { return workCard(p, lvl); }).join("") + "</div>";
  }
  function fillTrack(el, piezas) {
    el.className = trackClass(piezas);
    el.innerHTML = piezas.map(function (p) { return workCard(p); }).join("");
  }

  var EMPTY_CARD =
    '<div class="card card--empty"><span class="mono">Carpeta en preparación</span>' +
    '<p>Muy pronto, material nuevo acá.</p></div>';

  // Arma una pila de carpetas en `sel` y su barra de marcadores en `navSel`.
  // `offset` corre el ciclo de colores para que cada lado de la cámara arranque distinto.
  function renderStack(sel, navSel, grupos, offset) {
    var n1 = Math.max(grupos.length - 1, 1);
    $(sel).innerHTML = grupos.map(function (g, i) {
      var piezas = visible(g.piezas);
      var anchor = "carpeta-" + slug(g.id);
      var count = piezas.length ? piezas.length + (piezas.length === 1 ? " pieza" : " piezas") : "Próximamente";
      return (
        '<div class="group__gap" id="' + anchor + '"></div>' +
        '<div class="group panel panel--' + PANEL_COLORS[(i + offset) % PANEL_COLORS.length] + '" data-group="' + esc(g.id) +
          '" style="--i:' + i + ";--n1:" + n1 + '">' +
          '<a class="panel__tab mono" href="#' + anchor + '" data-jump><span class="panel__tab-n">' + pad(i + 1) + "</span>" +
            '<span class="panel__tab-name">' + esc(g.titulo) + "</span></a>" +
          panelHead(count, '<h3 class="panel__title">' + esc(g.titulo) + "</h3>") +
          (piezas.length ? track(piezas, 4) : '<div class="track track--solo">' + EMPTY_CARD + "</div>") +
        "</div>"
      );
    }).join("");
    $(navSel).innerHTML = grupos.map(function (g, i) {
      return '<a class="filter" href="#carpeta-' + slug(g.id) + '" data-jump data-i="' + i + '">' +
        '<span class="filter__n">' + pad(i + 1) + "</span>" + esc(g.titulo) + "</a>";
    }).join("");
  }

  /* ---------------------------------------------------------- Render */
  function render(D) {
    if (!D) return;

    $("#sobreMi").textContent = D.sobreMi || "";

    // Polaroids de "Sobre mí": fotos y textos desde Sanity (Ajustes del sitio)
    var fotos = D.fotos || {};
    ["perfil"].forEach(function (k) {
      var fig = document.querySelector('[data-foto="' + k + '"]');
      if (!fig) return;
      if (fotos[k + "Texto"]) fig.querySelector("figcaption").textContent = fotos[k + "Texto"];
      if (!fotos[k]) return;
      var hot = fotos[k + "Hot"], url = fotos[k] + "?w=600&h=600&fit=crop&auto=format" +
        (hot ? "&crop=focalpoint&fp-x=" + hot.x + "&fp-y=" + hot.y : "");
      var box = fig.querySelector(".polaroid__img"), old = box.querySelector("img");
      var img = document.createElement("img");
      img.src = url; img.alt = old ? old.alt : ""; img.width = 600; img.height = 600; img.loading = "lazy";
      img.onerror = function () { img.remove(); };
      if (old) old.replaceWith(img); else box.appendChild(img);
    });

    // Números
    $("#numeros").innerHTML = (D.numeros || []).map(function (n, i) {
      return '<li class="stat stat--' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '"><span class="stat__value">' + esc(n.valor) +
        '</span><span class="stat__text">' + esc(n.texto) + "</span></li>";
    }).join("");

    // Edición (detrás de cámara): carpetas apiladas; se ocultan las vacías
    renderStack("#edicionGrupos", "#edicionFiltros",
      (D.edicion || []).filter(function (g) { return visible(g.piezas).length; }), 0);

    // Delante de cámara: mismas carpetas; las vacías quedan "en preparación"
    var dl = D.delante || {};
    $("#delanteIntro").textContent = dl.intro || "";
    var rep = (D.contacto || {}).representacion;
    $("#delanteRep").innerHTML = rep
      ? '<a class="sticker sticker--rep" href="' + esc(rep) + '" target="_blank" rel="noopener">Representación actoral: ' +
        esc((D.contacto || {}).representacionNombre || "ver perfil") + ' <span aria-hidden="true">↗</span><span class="sr-only"> (pestaña nueva)</span></a>'
      : "";
    renderStack("#delanteGrupos", "#delanteFiltros", dl.categorias || [], 3);

    // Streaming
    var st = D.streaming || {};
    $("#streamingIntro").textContent = st.intro || "";
    $("#streamingTareas").innerHTML = (st.tareas || []).map(function (t) { return '<li class="tag tag--light">' + esc(t) + "</li>"; }).join("");
    fillTrack($("#streamingGrid"), visible(st.piezas));

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
    fillTrack($("#produccionGrid"), visible(D.produccion));
    var web = visible(D.web);
    $("#web").hidden = !web.length;
    fillTrack($("#webGrid"), web);

    // Herramientas
    $("#herramientasLista").innerHTML = (D.herramientas || []).map(function (h, i) {
      var logo = h.logo || logoDe(h.nombre);
      return '<li class="tool">' + (logo
        ? '<span class="tool__ico tool__ico--logo" aria-hidden="true"><img src="' + esc(logo) + '" alt="" width="42" height="42" loading="lazy" decoding="async"></span>'
        : '<span class="tool__ico tool__ico--' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '" aria-hidden="true">' + esc(initials(h.nombre)) + "</span>") +
        '<span<span class="tool__txt"><span class="tool__name">' + esc(h.nombre) +
        '</span><span class="tool__use mono">' + esc(h.uso) + "</span></span></li>";
    }).join("");

    // Contacto
    var c = D.contacto || {};
    var items = [
      c.email && { label: "Email", value: c.email, href: "mailto:" + c.email },
      c.whatsapp && { label: "WhatsApp", value: c.whatsappVisible || c.whatsapp, href: "https://wa.me/" + String(c.whatsapp).replace(/\D/g, ""), ext: true },
      c.linkedin && { label: "LinkedIn", value: c.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: c.linkedin, ext: true },
      c.instagram && { label: "Instagram", value: c.instagramUsuario || c.instagram, href: c.instagram, ext: true },
      c.representacion && { label: "Representación actoral", value: c.representacionNombre || "Ver perfil", href: c.representacion, ext: true },
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

    setupTracks();
    setupStack();
    sideFromHash();

    // Aviso para js/motion.js (animaciones que dependen del contenido)
    window.__portfolioRendered = true;
    buildIndice();
    fitInstagram();
    document.dispatchEvent(new CustomEvent("portfolio:render"));

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

  /* ------------------------------------------------------ Tiras (track) */
  function setupTracks() {
    document.querySelectorAll(".panel").forEach(function (panel) {
      var tr = panel.querySelector(".track"), nav = panel.querySelector(".track__nav");
      if (!tr || !nav) return;
      function update() {
        var over = tr.scrollWidth > tr.clientWidth + 4;
        nav.hidden = !over;
        if (!over) return;
        nav.querySelector('[data-dir="-1"]').disabled = tr.scrollLeft < 4;
        nav.querySelector('[data-dir="1"]').disabled = tr.scrollLeft + tr.clientWidth > tr.scrollWidth - 4;
      }
      nav.addEventListener("click", function (ev) {
        var b = ev.target.closest(".track__btn");
        if (b) tr.scrollBy({ left: +b.dataset.dir * tr.clientWidth * 0.85, behavior: reduceMotion ? "auto" : "smooth" });
      });
      tr.addEventListener("scroll", update, { passive: true });
      addEventListener("resize", update);
      update();
    });
  }

  /* ------------------------------------- Carpetas apiladas (marcadores) */
  // Cada carpeta queda pegada 12 px más abajo que la anterior; la siguiente la tapa
  // y deja a la vista su pestaña. Si una carpeta no entra en pantalla, scrollea
  // entera antes de frenar (top negativo) para no esconder contenido.
  var STACK_STEP = 12;
  var stacks = []; // [{ groups: [...], nav: elemento de marcadores }]

  function layoutStack() {
    var base = $("#nav").offsetHeight + $("#indice").offsetHeight + 44;
    stacks.forEach(function (st) {
      st.groups.forEach(function (g, i) {
        var want = base + i * STACK_STEP, h = g.offsetHeight;
        if (!h) return; // pila oculta (el otro lado de la cámara)
        g._top = h > innerHeight - want - 16 ? Math.round(innerHeight - h - 16) : want;
        g.style.top = g._top + "px";
      });
    });
    updateStack();
  }

  function updateStack() {
    stacks.forEach(function (st) {
      var groups = st.groups;
      if (!groups.length || !groups[0].offsetHeight) return;
      var front = 0;
      groups.forEach(function (g, i) {
        if (g.getBoundingClientRect().top <= g._top + 2) front = i;
        var next = groups[i + 1], cover = 0;
        if (next && !reduceMotion) {
          var dist = next.getBoundingClientRect().top - next._top;
          cover = Math.max(0, Math.min(1, 1 - dist / (innerHeight * 0.6)));
        }
        g.style.setProperty("--cover", cover.toFixed(3));
      });
      groups.forEach(function (g, i) { g.classList.toggle("is-front", i === front); });
      st.nav.querySelectorAll(".filter").forEach(function (a) {
        if (+a.dataset.i === front) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    });
  }

  function setupStack() {
    stacks = [].map.call(document.querySelectorAll(".stack"), function (el) {
      return { groups: [].slice.call(el.querySelectorAll(":scope > .group")), nav: el.parentElement.querySelector(".filters") };
    });
    layoutStack();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutStack);
  }

  var stackRaf = 0;
  addEventListener("scroll", function () {
    if (stackRaf) return;
    stackRaf = requestAnimationFrame(function () { stackRaf = 0; updateStack(); });
  }, { passive: true });
  var stackRt;
  addEventListener("resize", function () { clearTimeout(stackRt); stackRt = setTimeout(layoutStack, 120); });

  // Saltar a una carpeta: la deja en su posición apilada, con la pestaña a la vista
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-jump]");
    if (!a) return;
    var gap = document.getElementById(a.getAttribute("href").slice(1));
    var g = gap && gap.nextElementSibling;
    if (!g) return;
    ev.preventDefault();
    var y = gap.getBoundingClientRect().bottom + scrollY - (g._top || 0);
    scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    var first = g.querySelector(".lite, .reel, a, button");
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
  });

  /* ------------------------------------------------ Lado de la cámara */
  // Dos paneles: "detrás" (edición, vivo, producción…) y "delante" (contenido, actuación, música…).
  // El link #delante abre directamente ese lado.
  var sideTabs = { detras: $("#tab-detras"), delante: $("#tab-delante") };
  var STATUS = { detras: "Edit · lo que hago detrás de cámara", delante: "Rec · lo que hago delante de cámara" };

  function currentSide() { return $("#delante").hidden ? "detras" : "delante"; }

  function setSide(side, opts) {
    opts = opts || {};
    if (!sideTabs[side]) return;
    Object.keys(sideTabs).forEach(function (k) {
      var on = k === side;
      sideTabs[k].setAttribute("aria-selected", on);
      sideTabs[k].tabIndex = on ? 0 : -1;
      document.getElementById(k).hidden = !on;
    });
    $(".side-switch").setAttribute("data-active", side);
    document.body.classList.toggle("is-delante", side === "delante");
    $("#ladoStatus").textContent = STATUS[side];
    if (opts.focus) sideTabs[side].focus();
    if (opts.scroll) {
      var sw = $(".lado");
      scrollTo({ top: sw.getBoundingClientRect().top + scrollY - $("#nav").offsetHeight - 8, behavior: reduceMotion ? "auto" : "smooth" });
    }
    if (opts.hash !== false && history.replaceState) history.replaceState(null, "", "#" + side);
    layoutStack();
    updateIndice();
    fitInstagram();
    dispatchEvent(new Event("resize")); // recalcula flechas de las tiras del panel que apareció
  }

  Object.keys(sideTabs).forEach(function (k) {
    sideTabs[k].addEventListener("click", function () { setSide(k); });
  });
  // Flechas del teclado entre las dos pestañas (patrón tablist)
  $(".side-switch").addEventListener("keydown", function (ev) {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(ev.key) < 0) return;
    ev.preventDefault();
    var next = ev.key === "Home" ? "detras" : ev.key === "End" ? "delante" : currentSide() === "detras" ? "delante" : "detras";
    setSide(next, { focus: true });
  });
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-side-go]");
    if (b) setSide(b.dataset.sideGo, { scroll: true });
  });

  // Cualquier link interno que apunte al otro lado, primero cambia de lado
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-jump")) return;
    var id = a.getAttribute("href").slice(1);
    if (id === "detras" || id === "delante") {
      ev.preventDefault();
      setSide(id, { scroll: true });
      return;
    }
    var target = id && document.getElementById(id);
    var panel = target && target.closest(".side");
    if (panel && panel.hidden) setSide(panel.id, { hash: false });
  }, true);

  function sideFromHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    var panel = el && (el.classList.contains("side") ? el : el.closest(".side"));
    if (panel) setSide(panel.id, { hash: false, scroll: id === "detras" || id === "delante" });
  }
  addEventListener("hashchange", sideFromHash);

  /* ----------------------------------------------------------- Índice */
  // Un índice por lado. Detrás: las secciones. Delante: las carpetas (saltan como los marcadores).
  function buildIndice() {
    var otro = '<span class="indice__sep" aria-hidden="true"></span>';
    $("#indiceDetras").innerHTML = [].map.call(document.querySelectorAll("#detras > section[id]"), function (s) {
      var h = s.querySelector("h2");
      return '<a class="indice__item" href="#' + s.id + '" data-spy="' + s.id + '">' + esc(h ? h.textContent.trim() : s.id) + "</a>";
    }).join("") + otro +
      '<a class="indice__item indice__item--otro" href="#delante">Delante de cámara →</a>' +
      '<a class="indice__item" href="#contacto">Contacto</a>';
    $("#indiceDelante").innerHTML = [].map.call(document.querySelectorAll("#delanteGrupos > .group"), function (g, i) {
      var tab = g.querySelector(".panel__tab");
      return '<a class="indice__item" href="' + tab.getAttribute("href") + '" data-jump data-i="' + i + '"><span class="indice__n">' + pad(i + 1) +
        "</span>" + esc(g.querySelector(".panel__tab-name").textContent) + "</a>";
    }).join("") + otro +
      '<a class="indice__item indice__item--otro" href="#detras">← Detrás de cámara</a>' +
      '<a class="indice__item" href="#contacto">Contacto</a>';
    updateIndice();
  }

  function updateIndice() {
    var nav = $("#nav"), side = currentSide(), panel = document.getElementById(side);
    var top = nav.offsetHeight, r = panel.getBoundingClientRect();
    var show = r.top <= top + $("#indice").offsetHeight + 24 && r.bottom > top + 160;
    nav.classList.toggle("has-indice", show);
    $("#indiceDetras").hidden = side !== "detras";
    $("#indiceDelante").hidden = side !== "delante";
    if (!show) return;
    var list = side === "detras" ? $("#indiceDetras") : $("#indiceDelante");
    var items = list.querySelectorAll("[data-spy], [data-i]"), active = -1;
    if (side === "detras") {
      var line = top + $("#indice").offsetHeight + 80;
      items.forEach(function (a, i) { var s = document.getElementById(a.dataset.spy); if (s && s.getBoundingClientRect().top <= line) active = i; });
    } else {
      var front = $("#delanteGrupos > .group.is-front");
      active = front ? [].indexOf.call(front.parentElement.querySelectorAll(":scope > .group"), front) : 0;
    }
    items.forEach(function (a, i) {
      if (i === active) {
        if (a.getAttribute("aria-current") !== "true") {
          a.setAttribute("aria-current", "true");
          // que el activo quede a la vista en la tira (sin mover la página)
          var lr = list.getBoundingClientRect(), ar = a.getBoundingClientRect();
          if (ar.left < lr.left || ar.right > lr.right) list.scrollLeft += ar.left - lr.left - 16;
        }
      } else a.removeAttribute("aria-current");
    });
  }

  var idxRaf = 0;
  addEventListener("scroll", function () {
    if (idxRaf) return;
    idxRaf = requestAnimationFrame(function () { idxRaf = 0; updateIndice(); });
  }, { passive: true });
  addEventListener("resize", updateIndice);

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
