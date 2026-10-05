/* Estadísticas con GoatCounter (https://www.goatcounter.com).
   Sin cookies ni datos personales: no hace falta cartel de consentimiento.
   Panel: https://<CODIGO>.goatcounter.com  (el código es el de abajo).

   Además de las visitas, registra como "eventos":
   - play/…      videos de YouTube que se reproducen en el sitio
   - salida/…    links que se abren (Instagram, entradas, perfil actoral, YouTube…)
   - contacto/…  clics en email, WhatsApp, LinkedIn, Instagram, representación
   - cv          descargas del CV
   - lado/…      cambios entre "detrás" y "delante" de cámara */
(function () {
  "use strict";

  var GOATCOUNTER = "arianmartinez"; // código de la cuenta en goatcounter.com

  // No contar visitas propias en la compu (localhost) ni sin código
  if (!GOATCOUNTER || /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER + ".goatcounter.com/count");
  document.head.appendChild(s);

  function slug(str) {
    return String(str || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  function track(path, title) {
    var gc = window.goatcounter;
    if (gc && typeof gc.count === "function") gc.count({ path: path, title: title || path, event: true });
  }

  function cardTitle(el) {
    var card = el.closest(".card");
    var t = card && card.querySelector(".card__title");
    return t ? t.textContent.trim() : "";
  }

  // Un solo listener, en captura: funciona con el contenido que arma main.js (Sanity)
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    var el;
    if ((el = t.closest(".lite"))) {
      var title = el.getAttribute("data-title") || cardTitle(el);
      return track("play/" + slug(title), "Play: " + title);
    }
    if ((el = t.closest("#cvLink"))) return track("cv", "Descarga del CV");
    if ((el = t.closest(".contact__item, #contactBtn, #delanteRep a"))) {
      var label = el.id === "contactBtn" ? "Botón Contacto" :
        el.closest("#delanteRep") ? "Representación actoral" :
        (el.querySelector(".contact__label") || el).textContent.trim();
      return track("contacto/" + slug(label), "Contacto: " + label);
    }
    if ((el = t.closest(".side-switch__opt, [data-side-go]"))) {
      var side = el.id === "tab-delante" || el.getAttribute("data-side-go") === "delante" ? "delante" : "detras";
      return track("lado/" + side, "Lado: " + side);
    }
    if ((el = t.closest(".reel, .card__cta, .card__ext, .account a"))) {
      var name = cardTitle(el) || el.textContent.trim();
      return track("salida/" + slug(name), "Salida: " + name);
    }
  }, true);
})();
