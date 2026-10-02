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

- **Proyecto**: cada pieza. Elegí la *Sección* (Edición / Streaming / Producción) y, si es Edición, la *Categoría*. Pegá el link, completá rol, formato, reproducciones y descripción. En Instagram subí la portada vertical.
- **Categoría de edición**: las pestañas de la sección Edición. Podés crear nuevas; el campo *Orden* define la posición.
- **Delante de cámara**: creá el proyecto con *Sección* = "Delante de cámara" y elegí una categoría cuyo *Lado de la cámara* sea "Delante de cámara" (ya hay cuatro: Creación de contenido, Conducción, Actuación y Arte). La plataforma puede ser YouTube (se reproduce en el sitio), Instagram, TikTok u otro link; para las tres últimas, subí una portada. El texto de introducción se edita en *Ajustes del sitio*. Link directo: `…/#delante`.
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
