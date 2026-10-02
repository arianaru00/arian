# Portfolio · Arian Martinez

Sitio de una sola página: HTML, CSS y JS puros, sin build. Se sube tal cual a GitHub Pages o Netlify.

**Diseño:** las reglas visuales (colores, tipografías, componentes, qué no hacer) están en [`DESIGN.md`](DESIGN.md).

```
index.html            estructura, SEO y Open Graph
css/styles.css        estilos (mobile-first, tema oscuro)
js/main.js            arma las tarjetas desde los datos, lite-embed de YouTube, filtros, menú
data/trabajos.js      TODO el contenido: piezas, métricas, redes, herramientas, contacto
assets/og-image.jpg   imagen que se ve al compartir el link (1200×630)
assets/thumbs/        portadas de los reels de Instagram (las agregás vos)
```

## Editar contenido (Sanity)

El contenido se edita en el Studio: **https://arian-portfolio.sanity.studio/** (proyecto Sanity "Arian", `jdyfiba6`, dataset `production`).

- **Proyecto**: cada pieza. Elegí la *Sección* (Edición / Streaming / Producción) y, si es Edición, la *Categoría*. Pegá el link, completá rol, formato, reproducciones y descripción. En Instagram subí la portada vertical.
- **Categoría de edición**: las pestañas de la sección Edición. Podés crear nuevas; el campo *Orden* define la posición.
- **Cuenta de redes**: tarjetas de community management. Las cuentas opcionales (@lacosa_, @viajerafeminista, @arianfazzari) están como borrador: publicalas para que aparezcan.
- **Ajustes del sitio**: sobre mí, showreel, números, herramientas, contacto y CV en PDF (uno solo).

El sitio muestra solo lo **publicado** (botón *Publish*). Los cambios aparecen en el sitio en menos de un minuto, sin volver a subir archivos.

La conexión está en `js/sanity.js`. Si Sanity no responde, el sitio usa `data/trabajos.js` como respaldo.
Si publicás el sitio en otro dominio, agregalo en https://www.sanity.io/manage/project/jdyfiba6/api → *CORS origins* (sin "Allow credentials"). Ya están cargados `https://arianaru00.github.io` y `http://localhost:8080`.

## Respaldo local

`data/trabajos.js` tiene el mismo contenido inicial. Para agregar una pieza, copiá un bloque `{ ... }` y cambiá los datos.
Los links de YouTube se pegan tal cual: el sitio limpia `&list=`, `&pp=`, `&start_radio=` y respeta `t=`.
Las piezas con `url: ""` no se muestran.

Para ver qué falta: buscá `TODO` en `data/trabajos.js` e `index.html`, o abrí la consola del navegador (F12): el sitio lista los campos pendientes.

## Probar en tu compu

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Publicar en GitHub Pages

1. Subí estos archivos a la rama `main` del repo (o mergeá esta rama).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guardar.
3. En 1–2 minutos queda en `https://<usuario>.github.io/<repo>/`.
4. Reemplazá `https://TU-DOMINIO/` en `index.html` (etiquetas `og:url` y `og:image`) por esa URL y volvé a subir.
5. Probá cómo se ve el link en https://www.opengraph.xyz/ o pegándolo en un chat de WhatsApp.

Netlify: entrá a https://app.netlify.com/drop y arrastrá la carpeta.
