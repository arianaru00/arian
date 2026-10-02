# Design System: Portfolio Arian Martinez

Guía visual del sitio. Antes de agregar una sección, un componente o cambiar estilos, leé esto. Los tokens están en `css/styles.css` (`:root`) y los nombres de clase son los de esta guía.

---

## 1. Concepto y atmósfera

**"Mesa de edición."** La referencia era la interfaz de una herramienta de diseño: regla de píxeles, cajas de selección con manijas, stickers, cursores con nombre y comentarios. Acá la traducimos al oficio de Arian, que es editar video y operar en vivo:

| Referencia (herramienta de diseño) | Adaptación (edición y vivo) |
|---|---|
| Regla de píxeles arriba y abajo | **Regla de timecode** (`00:00`, `00:10`…) con un **cabezal de reproducción** magenta que avanza con el scroll |
| Reloj `8:01:17 PM` | **Timecode en vivo** `TC HH:MM:SS:FF` a 25 fps |
| Caja de selección con manijas sobre el nombre | Igual (`.selbox` + `.h`): el nombre es el "clip seleccionado" |
| `IMAGE.JPG` sobre cada imagen | `CLIP_01.MP4` / `REEL_01.MP4` / `SHOWREEL.MP4` (`.cliptag`) |
| Bloques de proyecto con pestaña de carpeta | **Carpetas de color** por categoría de edición, streaming y producción (`.panel`) |
| Cursores multiplayer con nombre | Cursores con los dos roles: "Editor de video" y "Streaming en vivo" |
| Comentario de Figma | Tarjetas de cuentas de redes y comentario en Contacto |
| Notas a mano ("about me!") | `.hand` en español: "sobre mí!", "mirá mi trabajo!" |

- **Tono:** lúdico y artesanal, pero ordenado. Se tiene que ver como el escritorio de alguien que edita, no como una plantilla.
- **Densidad:** media-baja (4/10). Mucho aire entre secciones y bloques grandes.
- **Variación:** alta en los detalles (rotaciones, stickers, pestañas que alternan izquierda/centro/derecha) y estricta en la estructura (grilla, tipografía, bordes).
- **Movimiento:** contenido (3/10). Solo timecode, cabezal, parpadeo "on air", blob flotando y hovers. Todo se apaga con `prefers-reduced-motion`.

---

## 2. Color

Fondo claro, tinta casi negra y **cuatro colores de bloque** saturados. Es una excepción deliberada a la regla de "un solo acento": la referencia funciona porque cada proyecto tiene su color.

### Base
| Token | Hex | Uso |
|---|---|---|
| `--paper` | `#f6f5f0` | Fondo del sitio (nunca blanco puro de fondo) |
| `--paper-2` | `#ecebe4` | Rayado de placeholders, hovers suaves |
| `--white` | `#ffffff` | Tarjetas, stickers blancos, hoja de contacto |
| `--ink` | `#16161a` | Texto, bordes, sombras duras (nunca `#000`) |
| `--ink-2` | `#55565e` | Texto secundario (contraste 6.5:1 sobre `--paper`) |
| `--line` | `#d6d5cc` | Divisores y regla |

### Bloques
| Token | Hex | Texto encima | Uso típico |
|---|---|---|---|
| `--cyan` | `#34c3ee` | `--ink` | Carpeta 1, botón CONTACTO, ícono `>>` |
| `--yellow` | `#f0b429` | `--ink` | Carpeta 3, métricas, cursor "Editor de video" |
| `--magenta` | `#d6245c` | `--white` | Carpeta 4, cabezal de la regla, "on air" |
| `--green` | `#2fb36d` | `--ink` | Carpeta Producción, blob, "disponible" |
| `--ink` (bloque) | `#16161a` | `--white` | Carpeta 2, carpeta En vivo, showreel |
| `--brown` | `#6e3b1c` | — | Solo en el rayado de la tarjeta de contacto |

### Stickers y sistema
| Token | Hex | Uso |
|---|---|---|
| `--mint` | `#b6e8c9` | Sticker verde pastel |
| `--butter` | `#f7e3a1` | Sticker amarillo, notas (`.note`), resaltador |
| `--sel` | `#1b8fe0` | Manijas, caja de selección y **foco de teclado** |

**Reglas**
- El texto sobre cyan, amarillo y verde va en `--ink`. El texto sobre magenta y tinta va en `--white`. No hay otras combinaciones.
- Las carpetas de Edición rotan en este orden: cyan → tinta → amarillo → magenta. Lo resuelve `PANEL_COLORS` en `js/main.js`; no elijas el color a mano.
- Nada de degradados, glow ni neón. La profundidad sale de **bordes de 2px y sombras duras desplazadas** (`4px 4px 0 var(--ink)`).

---

## 3. Tipografía

| Rol | Familia | Dónde |
|---|---|---|
| Display pixel | **Silkscreen** 700 | Nombre, títulos de sección (`.pixel-title`), valores de números, botón CONTACTO, iniciales |
| Manuscrita | **Caveat** 600 | Notas sueltas (`.hand`): una por sección, como máximo |
| Texto | **IBM Plex Sans** 400–700 | Párrafos, títulos de tarjeta, títulos de carpeta |
| Mono / UI | **IBM Plex Mono** 500–600 | Etiquetas, tags, botones, navegación, timecode (`.mono`, siempre en MAYÚSCULAS con tracking `0.08em`) |

**Escala**
- Nombre del hero: `clamp(2.1rem, 10.5vw, 6.6rem)`, en dos líneas.
- `.pixel-title`: `clamp(2.4rem, 11vw, 5rem)`. La versión chica (`--sm`) es para secciones secundarias.
- Título de carpeta: Plex Sans 600, `clamp(1.6rem, 6vw, 2.4rem)`.
- Título de tarjeta: Plex Sans 600, `1.3rem`.
- Texto: `1rem`, interlineado `1.6`, máximo **54–60 caracteres** por línea.
- Mono: `0.62–0.8rem`. Nunca menos de `0.58rem` (los números de la regla).

**Reglas**
- La pixel **solo va en títulos cortos** (1–2 palabras). Nunca en párrafos, descripciones ni texto de más de ~16 caracteres por línea.
- No mezclar dos display en la misma línea.

---

## 4. Componentes

Todos tienen bordes rectos (`--radius: 4px` como mucho). Las únicas excepciones son la tarjeta de contacto (`24px`) y los comentarios (`14px 14px 14px 2px`).

- **Botón** (`.btn--ink` / `.btn--ghost`): borde de 2px, texto mono en mayúsculas, alto mínimo de 48px. El primario lleva un ícono `>>` en un cuadrado cyan. En hover se levanta (`translate(-2px,-2px)`) y aparece la sombra dura; en active se hunde.
- **Botón grande** (`.bigbtn`): solo uno en el sitio, en Contacto.
- **Sticker** (`.sticker--mint|butter|magenta|live`): borde de 1.5px, sombra de 2px y rotación de −7° a +12°. Lleva datos reales, nunca relleno.
- **Cursor** (`.cursor--yellow|cyan`): flecha más etiqueta mono. Solo en el hero.
- **Caja de selección** (`.selbox` + 4 `.h`): para un elemento protagonista por pantalla. Las tarjetas muestran sus manijas en hover o foco.
- **Carpeta** (`.panel` + `.panel__tab`): bloque de color con pestaña recortada y posición alternada (`--tab-left|center|right`). Adentro van `.panel__head` (contador mono + título) y una `.grid`.
- **Tarjeta de trabajo** (`.card--h` 16:9 / `.card--v` 9:16):
  - Arriba: media con `.cliptag` y, si hay, `.metric`.
  - Abajo: tipo (mono con punto magenta), título, cliente, descripción, tags (rol en tinta, formato en blanco) y link "Ver en YouTube ↗".
  - Si es la única pieza horizontal de su carpeta, en escritorio pasa a layout horizontal (texto a la izquierda, video a la derecha).
- **Métrica** (`.metric`): sticker amarillo rotado −3° con el número en pixel. En tarjetas verticales del celular se ve solo el número (la palabra "reproducciones" queda para lectores de pantalla).
- **Lite embed**: miniatura de YouTube con un botón de play cuadrado blanco (amarillo en hover). El iframe de `youtube-nocookie` se carga recién al hacer clic.
- **Reel de Instagram**: portada 9:16 local o de Sanity. Si no hay portada, se muestra un rayado diagonal con "9:16" y el nombre de la cuenta.
- **Comentario / cuenta** (`.account`, `.comment`): blanco, borde fino, sombra suave (la única sombra difusa del sistema), avatar circular con iniciales en pixel y año en etiqueta negra.
- **Herramienta** (`.tool`): chip con un cuadrado de color e iniciales (OBS, RC, FF…). Sin barras de porcentaje, nunca.
- **Nota** (`.note`): post-it manteca rotado −1.5° para el lead de cada sección.

---

## 5. Layout

- Contenedor `max-width: 1200px` con un gutter de 16px.
- Secciones con `padding: clamp(56px, 10vw, 104px) 0`.
- **Cabecera de sección** centrada: nota a mano → `.pixel-title` → `.note`.
- **Grilla:** 1 columna en el celular, 2 desde 640px y 3 desde 1000px. En carpetas solo verticales hay 4 columnas en escritorio.
- **Hero centrado.** Es una excepción deliberada, porque la referencia es simétrica. Los stickers flotan alrededor de la caja dentro de `.stage` (max 920px). Pueden pisar el borde de la caja, pero **nunca tapar texto**.
- El arco fino (`.arc`) separa el hero del resto. Se usa una sola vez.

### Responsive
- Mobile-first. Sin scroll horizontal: es un error crítico, verificalo a 390px.
- En el celular, las tarjetas verticales se ponen en fila (portada al 42% y datos al lado), para que un 9:16 no ocupe toda la pantalla.
- Los filtros se deslizan horizontalmente en el celular y se centran en tablet o más.
- Las áreas táctiles miden 44px como mínimo.

---

## 6. Movimiento

| Elemento | Animación |
|---|---|
| `#tc` | Timecode real a 25 fps; 1 por segundo con movimiento reducido |
| `.ruler__head` | `translateX` según el % de scroll |
| `.dot--live` | Parpadeo `steps(2)` |
| `.blob` | Flotación de 5s |
| Botones, tarjetas, cuentas | Desplazamiento de 2–3px y sombra en hover |

Solo se animan `transform` y `opacity`. Con `prefers-reduced-motion` todo queda quieto.

---

## 7. Accesibilidad (no negociable)

- Foco visible: `outline: 3px solid var(--sel)` en todo lo interactivo.
- Las manijas, la regla, los cursores decorativos y el blob llevan `aria-hidden="true"`. Los stickers con datos son texto real.
- Toda imagen tiene `alt`; si es decorativa, `alt=""`.
- Los links externos avisan "(pestaña nueva)" para lectores de pantalla.
- Contrastes verificados: texto sobre papel, tinta sobre cyan, amarillo y verde, y blanco sobre magenta y tinta.
- Hay un link "Saltar al contenido", y el menú se cierra con Escape.

---

## 8. Contenido y tono

- Español rioplatense, profesional y cercano, con frases cortas.
- Las notas a mano son breves y en minúscula: "sobre mí!", "mirá mi trabajo!", "detrás de cámara".
- Los stickers del hero dicen cosas verificables: dónde trabaja ahora, dónde trabajó y dónde vive.
- Los números tienen que ser reales. "+290 mil" sí; "100%" o "+1000 clientes", no.
- El contenido se edita en Sanity (https://arian-portfolio.sanity.studio/). El diseño se adapta solo a la cantidad de piezas.

---

## 9. No hacer

- Emojis en la interfaz.
- Usar la pixel en párrafos o en botones con texto largo.
- Fondo blanco puro o texto `#000`.
- Degradados de color, glow, neón o glassmorphism.
- Bordes redondeados grandes en tarjetas de trabajo.
- Más de una nota a mano por sección, o stickers sin información.
- Barras de porcentaje de "habilidad".
- Autoplay con sonido, o cargar iframes antes del clic.
- Frases de relleno: "apasionado por contar historias", "llevá tu marca al siguiente nivel", "scrolleá para descubrir".
- Agregar un color de bloque nuevo sin sumarlo a esta guía y a `:root`.

---

## Archivos

- `css/styles.css`: tokens y componentes.
- `js/main.js`: el markup de tarjetas, carpetas, cuentas y herramientas, la regla y el timecode.
- `index.html`: la estructura y el hero (stickers y cursores).
- `assets/fotos/arian.jpg` y `assets/fotos/setup.jpg`: polaroids de "Sobre mí". Van cuadradas, mínimo 600×600; si no están, se ve un placeholder.
- `assets/og-image.jpg`: imagen para compartir, en el mismo estilo.
