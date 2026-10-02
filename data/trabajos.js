/* =========================================================================
   CONTENIDO DEL PORTFOLIO — Arian Martinez
   -------------------------------------------------------------------------
   Todo lo que se ve en la página sale de este archivo.
   Para agregar una pieza: copiá un bloque { ... } de la lista que corresponda,
   pegalo y cambiá los datos. Para sacarla: borrá el bloque (o comentalo con //).

   Links de YouTube: pegá el link tal cual lo copiás del navegador. El sitio
   limpia solo los parámetros &list=, &pp=, &start_radio=, etc. y respeta el
   minuto de inicio (&t=1110s, &t=18m30s, ?t=..., youtu.be/...).

   Instagram: cada reel usa una portada local en assets/thumbs/. Si la imagen
   todavía no existe, se muestra un placeholder. Exportá un frame del reel en
   vertical (ej. 720×1280, .jpg) y guardalo con el nombre que figura en "portada".

   formato: "vertical" (9:16) u "horizontal" (16:9)
   metrica: texto corto ("290 mil") o null si no hay dato.
   Buscá "TODO" en este archivo para ver lo que falta completar.
   ========================================================================= */

window.PORTFOLIO = {

  /* ---------------------------------------------------------------- HERO */
  // (El nombre y la línea de rol están fijos en index.html, por SEO.)

  // Máximo 60 palabras.
  sobreMi:
    "Soy productor audiovisual y operador de streaming en Buenos Aires. " +
    "Hace más de 7 años que edito video, opero cámaras y audio en vivo, y gestiono proyectos culturales. " +
    "Trabajé en La Cápsula Producciones y en Cátulo Casa Cultural. " +
    "Estudio la Licenciatura en Medios Audiovisuales (orientación guion) en la UNA. " +
    "Conduzco y produzco Patente Pendiente, mi propio streaming.",

  // TODO: cuando tengas el showreel (60–90 s) subido a YouTube, pegá acá el link
  // completo o solo el ID. Ej: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  showreel: "",

  /* ------------------------------------------------- NÚMEROS DESTACADOS */
  numeros: [
    { valor: "+290 mil", texto: "reproducciones en un solo reel" },
    { valor: "+7 años",  texto: "de experiencia en edición y vivo" },
    { valor: "6",        texto: "cuentas gestionadas en redes" },
    // { valor: "XX", texto: "streams en vivo operados" }, // TODO opcional
  ],

  /* ------------------------------------------------------------- EDICIÓN */
  // Cada categoría es una pestaña/filtro. El orden acá es el orden en pantalla.
  edicion: [
    {
      id: "redes",
      titulo: "Redes / vertical",
      piezas: [
        {
          titulo: "Reel para Eternos",
          cliente: "Eternos (streaming)",
          rol: "Edición",
          tipo: "Reel",
          formato: "vertical",
          plataforma: "instagram",
          url: "https://www.instagram.com/p/DcZWrHRyeNL/",
          portada: "assets/thumbs/eternos-1.jpg",
          metrica: null, // TODO: ¿"290 mil" o "275 mil"? (uno de los dos reels de Eternos tiene cada uno)
          descripcion: "TODO: una línea sobre la pieza (qué se recortó, ritmo, subtítulos, etc.).",
        },
        {
          titulo: "Reel para Eternos",
          cliente: "Eternos (streaming)",
          rol: "Edición",
          tipo: "Reel",
          formato: "vertical",
          plataforma: "instagram",
          url: "https://www.instagram.com/reel/DcO_XDRyv9j/",
          portada: "assets/thumbs/eternos-2.jpg",
          metrica: null, // TODO: ¿"290 mil" o "275 mil"?
          descripcion: "TODO: una línea sobre la pieza.",
        },
        {
          titulo: "Institucional Casa Yerbal",
          cliente: "Casa Yerbal",
          rol: "Edición",
          tipo: "Reel institucional",
          formato: "vertical",
          plataforma: "instagram",
          url: "https://www.instagram.com/reel/DN8fzlqDitT/",
          portada: "assets/thumbs/casa-yerbal-1.jpg",
          metrica: null, // TODO: reproducciones si las tenés
          descripcion: "TODO: una línea sobre la pieza.",
        },
        {
          titulo: "Institucional Casa Yerbal",
          cliente: "Casa Yerbal",
          rol: "Edición",
          tipo: "Reel institucional",
          formato: "vertical",
          plataforma: "instagram",
          url: "https://www.instagram.com/reel/DMyKNKJOzdJ/",
          portada: "assets/thumbs/casa-yerbal-2.jpg",
          metrica: null, // TODO: reproducciones si las tenés
          descripcion: "TODO: una línea sobre la pieza.",
        },
      ],
    },
    {
      id: "cine",
      titulo: "Cine y piezas largas",
      piezas: [
        {
          titulo: "La Cosa",
          cliente: "Película",
          rol: "Edición",
          tipo: "Largometraje",
          formato: "horizontal",
          plataforma: "youtube",
          url: "https://www.youtube.com/watch?v=c51-8ecv3Ec&t=1110s",
          metrica: null,
          descripcion: "TODO: una línea sobre la película (duración, año, qué hiciste en el montaje).",
        },
        {
          titulo: "Registro de obra",
          cliente: "TODO: nombre de la obra / compañía",
          rol: "Edición",
          tipo: "Registro de obra teatral",
          formato: "horizontal",
          plataforma: "youtube",
          url: "https://www.youtube.com/watch?v=xKvKm5aZP2U&t=2273s",
          metrica: null,
          descripcion: "TODO: una línea sobre el registro (cámaras, montaje, sonido).",
        },
      ],
    },
    {
      id: "videoclip",
      titulo: "Videoclip",
      piezas: [
        {
          titulo: "TODO: nombre del tema",
          cliente: "TODO: artista",
          rol: "Edición",
          tipo: "Videoclip",
          formato: "horizontal",
          plataforma: "youtube",
          url: "https://www.youtube.com/watch?v=TsAo8V9zSn8",
          metrica: null,
          descripcion: "TODO: una línea sobre el videoclip.",
        },
      ],
    },
    {
      id: "institucional",
      titulo: "Institucional y viajes",
      piezas: [
        {
          titulo: "TODO: título del institucional",
          cliente: "TODO: cliente",
          rol: "Edición",
          tipo: "Video institucional",
          formato: "horizontal",
          plataforma: "youtube",
          url: "https://www.youtube.com/watch?v=_unXoHukUkA",
          metrica: null,
          descripcion: "TODO: una línea sobre la pieza.",
        },
        // Las piezas con url vacía no se muestran. Completá el link y aparece sola.
        {
          titulo: "TODO: video de viajes",
          cliente: "TODO",
          rol: "Edición",
          tipo: "Video de viajes",
          formato: "horizontal",
          plataforma: "youtube",
          url: "", // TODO: link pendiente
          metrica: null,
          descripcion: "TODO: una línea sobre la pieza.",
        },
      ],
    },
  ],

  /* ---------------------------------------------------- STREAMING EN VIVO */
  streaming: {
    intro:
      "Opero transmisiones en vivo de punta a punta: armado de escena en OBS, switcheo de cámaras " +
      "y mezcla de audio con RodeCaster II Pro. Hice streaming para centros culturales y medios de " +
      "Buenos Aires, y conduzco y produzco Patente Pendiente.",
    tareas: ["Operación de OBS", "Switcheo de cámaras", "Mezcla de audio · RodeCaster II Pro"],
    piezas: [
      {
        titulo: "TODO: nombre del programa / transmisión",
        cliente: "TODO: canal o centro cultural",
        rol: "Operación en vivo",
        tipo: "Streaming multicámara",
        formato: "horizontal",
        plataforma: "youtube",
        url: "https://www.youtube.com/watch?v=HPJZNGRc2q4",
        metrica: null,
        descripcion: "TODO: una línea (cuántas cámaras, invitados, duración).",
      },
      {
        titulo: "TODO: nombre del programa / transmisión",
        cliente: "TODO: canal o centro cultural",
        rol: "Operación en vivo",
        tipo: "Streaming multicámara",
        formato: "horizontal",
        plataforma: "youtube",
        url: "https://www.youtube.com/watch?v=TpGf145Ulhs",
        metrica: null,
        descripcion: "TODO: una línea.",
      },
      {
        titulo: "TODO: nombre del programa / transmisión",
        cliente: "TODO: canal o centro cultural",
        rol: "Operación en vivo",
        tipo: "Streaming multicámara",
        formato: "horizontal",
        plataforma: "youtube",
        url: "https://www.youtube.com/watch?v=J_imiI0B8ck",
        metrica: null,
        descripcion: "TODO: una línea.",
      },
    ],
  },

  /* -------------------------------------------- REDES Y COMMUNITY MANAGER */
  redes: [
    {
      nombre: "Walter Rippel",
      usuario: "@walterrippel",
      url: "https://www.instagram.com/walterrippel/",
      desde: 2023,
      // TODO: confirmar redacción exacta del cargo en la Academia.
      destacado: "Miembro de la Academia de Hollywood",
      tareas: ["Edición de video", "Contenido para Instagram"],
    },
    {
      nombre: "Eternos",
      usuario: "@eternos.streamok",
      url: "https://www.instagram.com/eternos.streamok/",
      desde: 2026,
      destacado: null,
      tareas: ["Edición de reels", "Contenido", "Gestión de cuenta"],
    },
    {
      nombre: "Patente Pendiente",
      usuario: "@patente.pendienteok",
      url: "https://www.instagram.com/patente.pendienteok/",
      desde: 2025,
      destacado: "Mi streaming: conducción y producción",
      tareas: ["Edición", "Contenido", "Gestión de cuenta"],
    },
    // Opcionales: sacá las // para mostrarlas.
    // {
    //   nombre: "La Cosa",
    //   usuario: "@lacosa_",
    //   url: "https://www.instagram.com/lacosa_/",
    //   desde: 2016,
    //   destacado: null,
    //   tareas: ["Contenido", "Gestión de cuenta"],
    // },
    // {
    //   nombre: "Viajera Feminista",
    //   usuario: "@viajerafeminista",
    //   url: "https://www.instagram.com/viajerafeminista/",
    //   desde: 2025,
    //   destacado: null,
    //   tareas: ["Edición", "Contenido"],
    // },
    // {
    //   nombre: "Arian Fazzari",
    //   usuario: "@arianfazzari",
    //   url: "https://www.instagram.com/arianfazzari/",
    //   desde: 2015,
    //   destacado: null,
    //   tareas: ["Contenido"],
    // },
  ],

  /* ---------------------------------------------------------- PRODUCCIÓN */
  produccion: [
    {
      titulo: "TODO: título",
      cliente: "TODO: cliente / proyecto",
      rol: "Producción",
      tipo: "TODO: tipo de pieza",
      formato: "horizontal",
      plataforma: "youtube",
      url: "https://www.youtube.com/watch?v=ris4UdPJLsY",
      metrica: null,
      descripcion: "TODO: una línea (qué coordinaste: equipo, locación, cronograma).",
    },
    {
      titulo: "TODO: título",
      cliente: "TODO: cliente / proyecto",
      rol: "Producción",
      tipo: "TODO: tipo de pieza",
      formato: "horizontal",
      plataforma: "youtube",
      url: "https://www.youtube.com/watch?v=eVmGtOWI8RU",
      metrica: null,
      descripcion: "TODO: una línea.",
    },
    {
      // Misma obra que en Edición, vista desde la producción.
      titulo: "Registro de obra",
      cliente: "TODO: nombre de la obra / compañía",
      rol: "Producción",
      tipo: "Registro de obra teatral",
      formato: "horizontal",
      plataforma: "youtube",
      url: "https://www.youtube.com/watch?v=xKvKm5aZP2U&t=2273s",
      metrica: null,
      descripcion: "TODO: una línea sobre la producción del registro (coordinación con la sala, equipo técnico).",
    },
  ],

  /* --------------------------------------------------------- HERRAMIENTAS */
  herramientas: [
    { nombre: "Adobe Premiere Pro", uso: "Edición" },
    { nombre: "CapCut",             uso: "Edición vertical" },
    { nombre: "OBS Studio",         uso: "Streaming" },
    { nombre: "RodeCaster II Pro",  uso: "Audio en vivo" },
    { nombre: "Canva",              uso: "Diseño" },
    { nombre: "ffmpeg",             uso: "Conversión y entrega" },
  ],

  /* ------------------------------------------------------------ CONTACTO */
  contacto: {
    email: "TODO@ejemplo.com",                          // TODO
    whatsapp: "5491100000000",                          // TODO: número con código de país, sin + ni espacios
    whatsappVisible: "+54 9 11 TODO",                   // TODO: cómo se lee el número
    linkedin: "https://www.linkedin.com/in/TODO/",      // TODO
    instagram: "https://www.instagram.com/TODO/",       // TODO
    instagramUsuario: "@TODO",                          // TODO
    cv: "assets/cv-arian-martinez.pdf",                 // TODO: subir el PDF con este nombre
  },
};
