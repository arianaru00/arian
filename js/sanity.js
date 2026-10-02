/* Lee el contenido del portfolio desde Sanity (proyecto "Arian").
   Editás todo en el Studio: https://arian-portfolio.sanity.studio/
   El sitio lee solo lo PUBLICADO. Si algo falta en Sanity, se usa lo de data/trabajos.js. */
(function () {
  "use strict";

  var SANITY = {
    projectId: "jdyfiba6",
    dataset: "production",
    apiVersion: "2026-10-01",
  };

  var QUERY = '{' +
    '"ajustes": *[_type == "ajustes"] | order(_updatedAt desc)[0]{' +
      'sobreMi, showreel, numeros[]{valor, texto}, streamingIntro, streamingTareas, ' +
      'herramientas[]{nombre, uso}, contacto, "cv": cv.asset->url},' +
    '"categorias": *[_type == "categoria"] | order(orden asc, title asc){_id, title},' +
    '"proyectos": *[_type == "proyecto" && defined(url)] | order(orden asc, _createdAt asc){' +
      'title, cliente, seccion, "categoria": categoria._ref, rol, tipo, formato, plataforma, url, ' +
      '"portada": portada.asset->url, metrica, descripcion},' +
    '"cuentas": *[_type == "cuenta"] | order(orden asc, desde asc){title, usuario, url, desde, destacado, tareas}' +
  '}';

  function pieza(p) {
    return {
      titulo: p.title,
      cliente: p.cliente || "",
      rol: p.rol || "",
      tipo: p.tipo || "",
      formato: p.formato === "vertical" ? "vertical" : "horizontal",
      plataforma: p.plataforma === "instagram" ? "instagram" : "youtube",
      url: p.url,
      portada: p.portada ? p.portada + "?w=720&h=1280&fit=crop&auto=format" : null,
      metrica: p.metrica || null,
      descripcion: p.descripcion || "",
    };
  }

  function hay(v) { return Array.isArray(v) ? v.length > 0 : v != null && v !== ""; }

  function mapear(r, local) {
    var D = {};
    Object.keys(local || {}).forEach(function (k) { D[k] = local[k]; });
    D._fuente = "Sanity";

    var a = r.ajustes || {};
    if (hay(a.sobreMi)) D.sobreMi = a.sobreMi;
    if (hay(a.showreel)) D.showreel = a.showreel;
    if (hay(a.numeros)) D.numeros = a.numeros;
    if (hay(a.herramientas)) D.herramientas = a.herramientas;
    if (a.contacto) {
      D.contacto = Object.assign({}, (local && local.contacto) || {}, a.contacto);
      if (a.cv) D.contacto.cv = a.cv;
    }

    var proyectos = r.proyectos || [];
    if (proyectos.length) {
      D.edicion = (r.categorias || []).map(function (c) {
        return {
          id: "cat-" + c._id,
          titulo: c.title,
          piezas: proyectos.filter(function (p) { return p.seccion === "edicion" && p.categoria === c._id; }).map(pieza),
        };
      });
      var sinCategoria = proyectos.filter(function (p) {
        return p.seccion === "edicion" && !(r.categorias || []).some(function (c) { return c._id === p.categoria; });
      });
      if (sinCategoria.length) D.edicion.push({ id: "cat-otros", titulo: "Otros trabajos", piezas: sinCategoria.map(pieza) });
      D.streaming = {
        intro: hay(a.streamingIntro) ? a.streamingIntro : (local.streaming || {}).intro,
        tareas: hay(a.streamingTareas) ? a.streamingTareas : (local.streaming || {}).tareas,
        piezas: proyectos.filter(function (p) { return p.seccion === "streaming"; }).map(pieza),
      };
      D.produccion = proyectos.filter(function (p) { return p.seccion === "produccion"; }).map(pieza);
    }

    if (hay(r.cuentas)) {
      D.redes = r.cuentas.map(function (c) {
        return { nombre: c.title, usuario: c.usuario || "", url: c.url, desde: c.desde || "", destacado: c.destacado || null, tareas: c.tareas || [] };
      });
    }
    return D;
  }

  window.cargarDesdeSanity = function (local) {
    var url = "https://" + SANITY.projectId + ".apicdn.sanity.io/v" + SANITY.apiVersion +
      "/data/query/" + SANITY.dataset + "?query=" + encodeURIComponent(QUERY) + "&perspective=published";
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 6000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(function (res) {
        if (!res.ok) throw new Error("Sanity HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        if (timer) clearTimeout(timer);
        return mapear(json.result || {}, local);
      });
  };
})();
