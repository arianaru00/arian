# Portfolio · Arian Martinez

Sitio de una sola página: HTML, CSS y JS puros, sin build. Se sube tal cual a GitHub Pages o Netlify.

**Diseño:** las reglas visuales (colores, tipografías, componentes, qué no hacer) están en [`DESIGN.md`](DESIGN.md).

```
index.html            estructura, SEO y Open Graph
css/styles.css        estilos (mobile-first, ver DESIGN.md)
js/main.js            arma las tarjetas desde los datos, lite-embed de YouTube, filtros, menú
data/trabajos.js      respaldo local del contenido (el principal está en Sanity)
assets/og-image.jpg   imagen que se ve al compartir el link (1200×630)
assets/thumbs/        portadas locales de reels (o subilas en Sanity)
assets/fotos/         polaroids de "Sobre mí": arian.jpg y setup.jpg
```

## Editar contenido (Sanity)

El contenido se edita en el Studio: **https://arian-portfolio.sanity.studio/** (proyecto Sanity "Arian", `jdyfiba6`, dataset `production`).

El Studio está dividido en dos lados que no se mezclan:

- **Detrás de cámara · Trabajos**: cada pieza laboral. Elegí la *Sección* (Edición / Streaming / Producción) y, si es Edición, la *Carpeta*.
- **Detrás de cámara · Carpetas**: las pestañas de Edición (Redes / vertical, Institucional y viajes…). El campo *Orden* define la posición.
- **Detrás de cámara · Cuentas de redes**: las cuentas que manejás.
- **Delante de cámara · Proyectos** y **Delante de cámara · Carpetas**: lo artístico (Conducción, Teatro, Actuación, Música, Creación de contenido). El texto de introducción se edita en *Ajustes del sitio*. Link directo: `…/#delante`.

En cada trabajo o proyecto:

- **Link**: YouTube (video o playlist; se reproduce en el sitio), Instagram, TikTok u otra web.
- **Subir video**: si el video no está en ninguna red, subilo directo (mp4, idealmente menos de 50 MB). Se reproduce en el sitio y el link pasa a ser opcional.
- **Portada (foto)**: sirve para todo (reels, obras, links, videos subidos). En YouTube reemplaza la miniatura automática. Con el punto de foco elegís qué parte de la foto se ve.
- **Sumar otro a una carpeta** (ej. un 3er institucional): creá un trabajo nuevo y elegí esa carpeta. Atajo: abrí uno parecido → menú `⋯` arriba a la derecha → *Duplicate*, y cambiá título y link.
- **Cuenta de redes**: tarjetas de community management. Las cuentas opcionales (@lacosa_, @viajerafeminista, @arianfazzari) están como borrador: publicalas para que aparezcan.
- **Ajustes del sitio** (uno solo): sobre mí, **la foto de perfil** (polaroid de "Sobre mí", con su texto al pie; se recorta cuadrada según el punto de interés), números, herramientas, contacto, representación actoral y CV en PDF.

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

## Estadísticas

Con [GoatCounter](https://www.goatcounter.com): gratis, sin cookies, sin cartel de consentimiento. La configuración está en `js/stats.js` (código `arianmartinez`).

- **Panel:** https://arianmartinez.goatcounter.com
- **Visitas:** páginas vistas, de dónde llega la gente (LinkedIn, WhatsApp, Google…), país y dispositivo.
- **Eventos:**
  - `play/…`: videos reproducidos.
  - `salida/…`: links abiertos (reels, entradas, perfil actoral).
  - `contacto/…`: clics en email, WhatsApp, LinkedIn y representación.
  - `cv`: descargas del CV.
  - `lado/delante` y `lado/detras`: cambios entre los dos lados de la cámara.
- **Visitas propias:** no se cuentan las de tu compu (`localhost`). Para no contar tus visitas al sitio publicado, en el panel andá a *Settings → Ignore IPs*.

## Ramas y publicación

| Rama | Para qué | ¿Se publica? |
|---|---|---|
| `main` | La versión oficial | Sí: cada push a `main` corre `.github/workflows/pages.yml` y actualiza https://arianaru00.github.io/arian/ en 1–2 minutos |
| `pruebas` | Probar cambios de diseño o código | No. El workflow solo escucha `main` |

**Cómo probar algo:**
1. Trabajá en `pruebas` (`git checkout pruebas`) y subí ahí los cambios.
2. Miralo en tu compu con `python3 -m http.server 8080` → http://localhost:8080
3. Cuando te guste, pasalo a la versión oficial: `git checkout main && git merge pruebas && git push`. Ese push publica.
4. Para empezar de nuevo desde lo publicado: `git checkout pruebas && git reset --hard origin/main && git push --force`.

**Ojo con el contenido:** los proyectos y textos vienen de Sanity, que es uno solo para las dos ramas. Lo que publiques en el Studio aparece en el sitio oficial aunque estés probando en `pruebas`. Para probar contenido sin que se vea, dejalo como borrador (sin *Publish*).

La primera configuración de Pages ya está hecha (Settings → Pages → Source: GitHub Actions; entorno `github-pages` con permiso para `main`).

Netlify: entrá a https://app.netlify.com/drop y arrastrá la carpeta.
