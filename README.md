# Portfolio · Arian Martinez

Sitio de una sola página: HTML, CSS y JS puros, sin build. Se sube tal cual a GitHub Pages o Netlify.

```
index.html            estructura, SEO y Open Graph
css/styles.css        estilos (mobile-first, tema oscuro)
js/main.js            arma las tarjetas desde los datos, lite-embed de YouTube, filtros, menú
data/trabajos.js      TODO el contenido: piezas, métricas, redes, herramientas, contacto
assets/og-image.jpg   imagen que se ve al compartir el link (1200×630)
assets/thumbs/        portadas de los reels de Instagram (las agregás vos)
```

## Editar contenido

Todo se cambia en `data/trabajos.js`. Para agregar una pieza, copiá un bloque `{ ... }` y cambiá los datos.
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
