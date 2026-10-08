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
| `IMAGE.JPG` sobre cada imagen | `CLIP_01.MP4` / `REEL_01.MP4` (`.cliptag`) |
| Bloques de proyecto con pestaña de carpeta | **Carpetas de color** por categoría de edición, streaming y producción (`.panel`) |
| Cursores multiplayer con nombre | Cursores con los dos roles: "Editor de video" y "Streaming en vivo" |
| Comentario de Figma | Tarjetas de cuentas de redes y comentario en Contacto |
| Notas a mano ("about me!") | `.hand` en itálica: "sobre mí!", "mirá mi trabajo!" |

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
| `--ink` (bloque) | `#16161a` | `--white` | Carpeta 2, carpeta En vivo |
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

**Dos tipografías, de la misma familia.** Antes había cuatro (pixel Silkscreen y manuscrita Caveat incluidas); se sacaron para que el sitio se vea más sobrio y menos "videojuego".

| Rol | Familia | Dónde |
|---|---|---|
| Display y texto | **IBM Plex Sans** 400–700 (+ itálica 400) | Nombre, títulos de sección (`.pixel-title`, el nombre de la clase quedó por historia), números, iniciales, botón Contacto, títulos de carpeta y tarjeta, párrafos. La itálica 400 es para las notas sueltas (`.hand`) |
| Mono / UI | **IBM Plex Mono** 500–600 | Etiquetas, tags, botones, navegación, timecode (`.mono`, siempre en MAYÚSCULAS con tracking `0.08em`) |

**Escala**
- Nombre del hero: Plex Sans 700, `clamp(3.4rem, 16vw, 7rem)`, interletrado `-0.045em`. Ocupa dos líneas en el celular y una en escritorio.
- Títulos de sección: Plex Sans 700, `clamp(2.4rem, 10vw, 4.6rem)`, interletrado `-0.04em`, en tipo oración (sin mayúsculas forzadas).
- Título de carpeta: Plex Sans 600, `clamp(1.6rem, 6vw, 2.4rem)`.
- Título de tarjeta: Plex Sans 600, `1.3rem`.
- Texto: `1rem`, interlineado `1.6`, máximo **54–60 caracteres** por línea.
- Notas (`.hand`): Plex Sans itálica 400, `1rem`, en `--ink-2`, en minúscula. Una por sección como máximo.
- Mono: `0.62–0.8rem`. Nunca menos de `0.58rem` (los números de la regla).

**Reglas**
- Los títulos grandes van en negrita con interletrado negativo; nunca en mayúsculas.
- Las mayúsculas son exclusivas de la mono.
- No sumar otra familia. Si hace falta contraste, se usa peso (400/600/700) o la mono.

---

## 4. Componentes

Todos tienen bordes rectos (`--radius: 4px` como mucho). Las únicas excepciones son la tarjeta de contacto (`24px`) y los comentarios (`14px 14px 14px 2px`).

- **Botón** (`.btn--ink` / `.btn--ghost`): borde de 2px, texto mono en mayúsculas, alto mínimo de 48px. El primario lleva un ícono `>>` en un cuadrado cyan. En hover se levanta (`translate(-2px,-2px)`) y aparece la sombra dura; en active se hunde.
- **Botón grande** (`.bigbtn`): solo uno en el sitio, en Contacto.
- **Sticker** (`.sticker--mint|butter|magenta|live`): borde de 1.5px, sombra de 2px y rotación de −7° a +12°. Lleva datos reales, nunca relleno.
- **Cursor** (`.cursor--yellow|cyan`): flecha más etiqueta mono. Solo en el hero; deambula y se arrastra (ver §6).
- **Cursor "VOS"** (`.you`): el único cursor que sigue al mouse. No reemplaza al cursor del sistema, lo acompaña.
- **Caja de selección** (`.selbox` + 4 `.h`): para un elemento protagonista por pantalla. Las tarjetas muestran sus manijas en hover o foco.
- **Carpeta** (`.panel` + `.panel__tab`): bloque de color con pestaña recortada. Adentro van `.panel__head` (contador mono, título y flechas) y una `.track`.
- **Carpetas apiladas** (`.stack > .group`, en Edición y en Delante de cámara): el efecto archivero. En "delante" el ciclo de colores arranca en magenta, para que los dos lados no se vean iguales.
  - Cada carpeta es `position: sticky` y frena **12 px más abajo** que la anterior. `main.js` calcula el `top` (`STACK_STEP`).
  - La siguiente carpeta sube y la tapa. La pestaña de cada una se ubica en `left = (100% − ancho) × i / (n − 1)`, así que al apilarse todas quedan visibles en escalera, como marcadores.
  - La carpeta que va quedando tapada se achica hasta un 3.5% y se oscurece hasta un 28% (`--cover`, de 0 a 1 según cuánto la tapa la siguiente). Las pestañas no se oscurecen.
  - La carpeta de adelante (`.is-front`) levanta su pestaña de 32 a 38 px, y la barra de marcadores (`.filters`) la marca con `aria-current`.
  - Si una carpeta no entra en pantalla, su `top` pasa a ser negativo: scrollea entera antes de frenar, para no esconder contenido.
  - En el celular la pestaña muestra solo el número (84 px); desde tablet suma el nombre (200 a 260 px).
- **Tira de piezas** (`.track`): scroll horizontal con *snap*, con flechas que solo aparecen si hay desborde. Mantiene cada carpeta más baja que la pantalla y es lo que hace posible el apilado. Columnas: 86% en el celular, 2 en tablet, 3 en escritorio (2 si son verticales). Con una sola pieza (`--solo`) ocupa el ancho completo y, en escritorio, pone el texto a la izquierda y el video a la derecha.
- **Interruptor de lado** (`.side-switch`): dos pestañas (`role="tablist"`), **Detrás de cámara** y **Delante de cámara**, con una perilla que se desliza.
  - La perilla es amarilla para "detrás" y magenta para "delante"; también se mueve con las flechas del teclado.
  - Controla dos paneles (`.side#detras` / `.side#delante`). Solo uno es visible a la vez.
  - En "delante" el estado pasa a **REC** con punto magenta titilante, y el timecode del hero suma "● REC".
  - El link `#delante` abre ese lado directo. Cualquier link interno a una sección del otro lado cambia de lado antes de navegar.
  - Al final de cada panel hay un botón para pasar al otro lado.
- **Carpeta vacía** (`.card--empty`): rayado y borde punteado con "Carpeta en preparación". Solo en "Delante de cámara". En Edición, una categoría sin piezas no se muestra.
- **Barra de marcadores** (`.filters`): links a cada carpeta (`data-jump`). Al hacer clic, la carpeta aterriza en su posición apilada, con la pestaña visible.
- **Tarjeta de trabajo** (`.card--h` 16:9 / `.card--v` 9:16):
  - Arriba: media con `.cliptag` y, si hay, `.metric`.
  - Abajo: tipo (mono con punto magenta), título, cliente, descripción, tags (rol en tinta, formato en blanco) y link "Ver en YouTube ↗".
  - Las verticales (9:16) siempre van en fila: portada al 42% y datos al costado.
- **Métrica** (`.metric`): sticker amarillo rotado −1.5° con el número en Plex Sans 700. En tarjetas verticales del celular se ve solo el número (la palabra "reproducciones" queda para lectores de pantalla).
- **Lite embed**: miniatura de YouTube con un botón de play cuadrado blanco (amarillo en hover). El iframe de `youtube-nocookie` se carga recién al hacer clic.
- **Reel de Instagram**: portada 9:16 local o de Sanity. Si no hay portada, se muestra un rayado diagonal con "9:16" y el nombre de la cuenta.
- **Comentario / cuenta** (`.account`, `.comment`): blanco, borde fino, sombra suave (la única sombra difusa del sistema), avatar circular con iniciales en Plex Sans 700 y año en etiqueta negra.
- **Herramienta** (`.tool`): chip con un cuadrado de color e iniciales (OBS, RC, FF…). Sin barras de porcentaje, nunca.
- **Nota** (`.note`): post-it manteca rotado −1.5° para el lead de cada sección.

---

## 5. Layout

- **Sin showreel:** el hero termina en los botones y "Ver trabajos" lleva directo a "Detrás de cámara". "Sobre mí" lleva una sola polaroid (foto de perfil desde Sanity).

- Contenedor `max-width: 1200px` con un gutter de 16px.
- Secciones con `padding: clamp(56px, 10vw, 104px) 0`.
- **Cabecera de sección** centrada: nota en itálica → título de sección (`.pixel-title`) → `.note`.
- **Grilla** (cuentas de redes): 1 columna en el celular, 2 desde 640px y 3 desde 1000px.
- **Piezas de video:** siempre en `.track` dentro de una carpeta, nunca en grilla suelta.
- **Hero centrado.** Es una excepción deliberada, porque la referencia es simétrica. Los stickers flotan alrededor de la caja dentro de `.stage` (max 920px). Pueden pisar el borde de la caja, pero **nunca tapar texto**.
- El arco fino (`.arc`) separa el hero del resto. Se usa una sola vez.

### Responsive
- Mobile-first. Sin scroll horizontal: es un error crítico, verificalo a 390px.
- Las tarjetas verticales van en fila (portada al 42% y datos al lado), para que un 9:16 no ocupe toda la pantalla.
- La barra de marcadores se desliza horizontalmente en el celular y se centra en tablet o más.
- Cualquier elemento con `position: absolute` dentro de una `.track` necesita un ancestro posicionado dentro de la tira. Si no, desborda la página (por eso `.track` y `.card` son `position: relative`).
- Las áreas táctiles miden 44px como mínimo.

---

## 6. Movimiento

**Idea:** el sitio es una mesa de trabajo compartida, como un archivo de Figma con gente conectada. Las cosas flotan, se pueden agarrar y reaccionan al mouse. Todo vive en `js/motion.js` y solo corre si `html` tiene la clase `.motion`, que se agrega cuando el dispositivo **no** pide movimiento reducido.

| Elemento | Animación |
|---|---|
| Stickers del hero | Flotan sin repetir el mismo recorrido: mezcla de senos de ±3 a 14 px y ±2 a 8°. Se corren un poco hacia el mouse (10–16 px) y con el scroll (parallax de 0.04 a 0.18). Entran con un pop al cargar. |
| Cursores del hero ("Editor de video", "Streaming en vivo") | Deambulan más (±26–34 px), como colaboradores moviendo el mouse |
| Arrastre (`[data-drag]`) | Con mouse, cualquier sticker o cursor del hero se agarra y queda donde lo soltás. En táctil está desactivado, para no trabar el scroll. |
| Cursor "VOS" (`.you`) | Punto y etiqueta que siguen al mouse con un leve retraso (lerp 0.32). La etiqueta cambia según lo que hay debajo: **Play** (video), **Abrir** (reel), **Arrastrá**, **Cambiar** (interruptor) o **Clic**. El cursor del sistema **se sigue viendo**. Solo en dispositivos con mouse. |
| Regla (`.ruler__hover`) | Línea cyan con el timecode de la posición del mouse (100 px = 10 s) |
| `.pixel-title` y `.hero__title` | Al entrar en pantalla, las letras pasan de `--line` a tinta en secuencia (55 ms cada una), con un fundido suave (sin destello) |
| `#sobreMi` | Las palabras pasan de gris a tinta según el avance del scroll |
| `[data-scroll-rot]` ("¿Qué onda?") | Arranca rotado −10° y se endereza al entrar |
| Tarjetas, stats, chips, notas, polaroids, comentario, botón CONTACTO | Entran con un rebote (`translate` + `scale`, curva con overshoot), escalonadas 70 ms entre hermanos |
| Menú (escritorio) | Un bloque negro (`.nav__pill`) se desliza bajo el link con hover |
| Blob | Se bambolea (6 s), parpadea cada 5 s y **mira al mouse** |
| Tarjeta de contacto | Las rayas avanzan sin fin; la baldosa mide exactamente un período, así no hay costura |
| `#tc` | Timecode real a 25 fps; 1 por segundo con movimiento reducido |
| `.ruler__head` | `translateX` según el % de scroll |
| Carpetas (Edición y Delante de cámara) | Apilado `sticky`; la de atrás escala y se oscurece (`--cover`), y la pestaña de adelante sube |
| Interruptor de lado | La perilla se desliza (0.4 s) y cambia de amarillo a magenta |
| `.dot--live` | Parpadeo `steps(2)` |
| Botones, tarjetas, cuentas | Desplazamiento de 2–3 px y sombra en hover |

**Reglas**
- Solo se animan `transform` (o `translate`/`rotate`/`scale`), `opacity` y `color`. No se animan `top`, `left`, `width` ni `height`, salvo el bloque del menú.
- Las animaciones de `motion.js` usan las propiedades individuales `translate` y `rotate`, que se suman al `transform` de CSS. Así un sticker conserva su rotación de diseño y además flota.
- Hay **un solo** `requestAnimationFrame`. El hero y el blob solo se calculan cuando están en pantalla.
- Los textos partidos en letras o palabras llevan `aria-label` con el texto completo, y sus partes van con `aria-hidden`. El lector de pantalla los lee normal.
- Con `prefers-reduced-motion` no se carga nada de esto (`motion.js` sale al principio). El apilado de carpetas se mantiene porque es layout, pero sin escala ni oscurecido.
- Si agregás un elemento que entra con rebote, sumalo al selector `REVEAL` de `motion.js`. No pongas `.rv` a mano.

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
- Las notas sueltas (en itálica) son breves y en minúscula: "sobre mí!", "mirá mi trabajo!", "detrás de cámara".
- Los stickers del hero dicen cosas verificables: dónde trabaja ahora, dónde trabajó y dónde vive.
- Los números tienen que ser reales. "+290 mil" sí; "100%" o "+1000 clientes", no.
- El contenido se edita en Sanity (https://arian-portfolio.sanity.studio/). El diseño se adapta solo a la cantidad de piezas.

---

## 9. No hacer

- Emojis en la interfaz.
- Volver a sumar tipografías decorativas (pixel, manuscrita): el sistema es Plex Sans + Plex Mono.
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

## Índice

Barra fija debajo de la regla (`.indice`, alto `--idx-h`). Solo aparece mientras se recorre el lado activo.
Detrás de cámara lista las secciones; delante de cámara, las carpetas numeradas (mismo salto que los marcadores).
El ítem activo va en negro; al final, un acceso punteado al otro lado y a Contacto.
