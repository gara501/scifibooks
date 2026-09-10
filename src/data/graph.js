// Grafo de subgéneros de ciencia ficción.
// Las posiciones (x, y) están en coordenadas del viewBox 1200x900.

export const graphNodes = [
  {
    id: 'raiz',
    titulo: 'Ciencia Ficción',
    descripcion:
      'Género especulativo centrado en el impacto de la ciencia, la tecnología y el futuro en la sociedad y el ser humano.',
    obras_representativas: [
      'La guerra de los mundos (H.G. Wells)',
      'Yo, Robot (Isaac Asimov)',
      '2001: Una odisea del espacio (Stanley Kubrick / Arthur C. Clarke)',
    ],
    conectado_con: [
      'cf_dura',
      'cf_blanda',
      'space_opera',
      'cyberpunk',
      'apocaliptico',
      'viajes_tiempo',
      'historia_alternativa',
      'ciencia_fantasia',
    ],
    x: 600,
    y: 440,
    size: 'root',
    hue: 82,
  },
  {
    id: 'cf_dura',
    titulo: 'Ciencia Ficción Dura (Hard Sci-Fi)',
    descripcion:
      'Prioriza el rigor científico, los detalles técnicos y la exactitud en física, astronomía, química y matemáticas.',
    obras_representativas: [
      'El problema de los tres cuerpos (Cixin Liu)',
      'El marciano (Andy Weir)',
      'Citas con Rama (Arthur C. Clarke)',
      'Interstellar (Christopher Nolan)',
    ],
    conectado_con: ['raiz', 'cf_blanda', 'cyberpunk'],
    x: 330,
    y: 240,
    size: 'major',
    hue: 190,
  },
  {
    id: 'cf_blanda',
    titulo: 'Ciencia Ficción Blanda (Soft Sci-Fi)',
    descripcion:
      'Se enfoca en las ciencias sociales (sociología, psicología, antropología) y el comportamiento humano por encima del rigor técnico.',
    obras_representativas: [
      'La mano izquierda de la oscuridad (Ursula K. Le Guin)',
      'Crónicas marcianas (Ray Bradbury)',
      'La llegada / Story of Your Life (Ted Chiang / Denis Villeneuve)',
    ],
    conectado_con: ['raiz', 'cf_dura', 'distopia', 'space_opera'],
    x: 330,
    y: 660,
    size: 'major',
    hue: 320,
  },
  {
    id: 'cyberpunk',
    titulo: 'Cyberpunk',
    descripcion:
      "Mundos de 'alta tecnología y baja calidad de vida'. Se centra en la cibernética, redes de datos, megacorporaciones y distopías urbanas.",
    obras_representativas: [
      'Neuromante (William Gibson)',
      'Blade Runner / ¿Sueñan los androides con ovejas eléctricas? (Philip K. Dick)',
      'Ghost in the Shell (Mamoru Oshii)',
      'Matrix (Hermanas Wachowski)',
    ],
    conectado_con: ['raiz', 'cf_dura', 'distopia', 'biopunk', 'postcyberpunk', 'steampunk'],
    x: 880,
    y: 260,
    size: 'major',
    hue: 305,
  },
  {
    id: 'postcyberpunk',
    titulo: 'Postcyberpunk',
    descripcion:
      'Evolución del cyberpunk que analiza los mismos avances tecnológicos (IA, red, biotecnología) pero desde una perspectiva más cotidiana, crítica y no necesariamente nihilista.',
    obras_representativas: [
      'Snow Crash (Neal Stephenson)',
      'Carbono alterado / Altered Carbon (Richard K. Morgan)',
      'Ghost in the Shell: Stand Alone Complex (Kenji Kamiyama)',
    ],
    conectado_con: ['cyberpunk', 'solarpunk'],
    x: 1050,
    y: 130,
    size: 'minor',
    hue: 300,
  },
  {
    id: 'biopunk',
    titulo: 'Biopunk',
    descripcion:
      'Derivado del cyberpunk enfocado en el uso y manipulación de la biotecnología, la ingeniería genética y la biología sintética.',
    obras_representativas: [
      'Gattaca (Andrew Niccol)',
      'Oryx y Crake (Margaret Atwood)',
      'La chica mecánica (Paolo Bacigalupi)',
      'Jurassic Park (Michael Crichton)',
    ],
    conectado_con: ['cyberpunk', 'cf_dura'],
    x: 1010,
    y: 310,
    size: 'minor',
    hue: 150,
  },
  {
    id: 'steampunk',
    titulo: 'Steampunk',
    descripcion:
      'Subgénero retrofuturista ambientado en la época victoriana o el siglo XIX donde la tecnología avanzada funciona a base de vapor y engranajes.',
    conectado_con: ['cyberpunk', 'historia_alternativa'],
    x: 1030,
    y: 490,
    size: 'minor',
    hue: 36,
  },
  {
    id: 'solarpunk',
    titulo: 'Solarpunk',
    descripcion:
      'Movimiento ecológico y optimista que imagina futuros sostenibles impulsados por energías renovables y la armonía entre naturaleza y tecnología.',
    obras_representativas: [
      'A Psalm for the Wild-Built (Becky Chambers)',
      'Nausicaä del Valle del Viento (Hayao Miyazaki)',
      'Ecotopía (Ernest Callenbach)',
    ],
    conectado_con: ['postcyberpunk', 'utopia'],
    x: 1060,
    y: 630,
    size: 'minor',
    hue: 140,
  },
  {
    id: 'space_opera',
    titulo: 'Space Opera (Ópera Espacial)',
    descripcion:
      'Aventuras épicas a gran escala ambientadas en el espacio exterior, involucrando guerras galácticas, grandes imperios y melodrama.',
    obras_representativas: [
      'Dune (Frank Herbert)',
      'Fundación (Isaac Asimov)',
      'Saga Star Wars (George Lucas)',
      'Hyperion (Dan Simmons)',
    ],
    conectado_con: ['raiz', 'cf_blanda', 'cf_militar', 'space_western'],
    x: 900,
    y: 620,
    size: 'major',
    hue: 260,
  },
  {
    id: 'cf_militar',
    titulo: 'Ciencia Ficción Militar',
    descripcion:
      'Historias centradas en conflictos bélicos interestelares, estrategias militares, vida de los soldados y tecnología de armamento futurista.',
    obras_representativas: [
      'Tropas del espacio / Starship Troopers (Robert A. Heinlein)',
      'El juego de Ender (Orson Scott Card)',
      'La guerra interminable (Joe Haldeman)',
      'La vieja guardia (John Scalzi)',
    ],
    conectado_con: ['space_opera', 'cf_dura'],
    x: 1080,
    y: 760,
    size: 'minor',
    hue: 20,
  },
  {
    id: 'space_western',
    titulo: 'Space Western',
    descripcion:
      'Mezcla elementos y arquetipos del género Western (fronteras, proscritos, cazarrecompensas) en un entorno de exploración espacial.',
    obras_representativas: [
      'Cowboy Bebop (Shinichirō Watanabe)',
      'Firefly / Serenity (Joss Whedon)',
      'The Mandalorian (Jon Favreau)',
      'Trigun (Yasuhiro Nightow)',
    ],
    conectado_con: ['space_opera', 'cf_blanda'],
    x: 940,
    y: 830,
    size: 'minor',
    hue: 46,
  },
  {
    id: 'distopia',
    titulo: 'Distopía',
    descripcion:
      'Sociedades futuras deshumanizadas, totalitarias o extremadamente opresivas bajo el control de gobiernos o corporaciones.',
    obras_representativas: [
      '1984 (George Orwell)',
      'Un mundo feliz (Aldous Huxley)',
      'Fahrenheit 451 (Ray Bradbury)',
      'El cuento de la criada (Margaret Atwood)',
    ],
    conectado_con: ['raiz', 'cf_blanda', 'cyberpunk', 'apocaliptico'],
    x: 620,
    y: 750,
    size: 'major',
    hue: 12,
  },
  {
    id: 'utopia',
    titulo: 'Utopía',
    descripcion:
      'Representación de una sociedad ideal, justa y próspera gracias al avance científico, social o político.',
    obras_representativas: [
      'Noticias de ninguna parte (William Morris)',
      'Los desposeídos (Ursula K. Le Guin)',
      'Star Trek: La serie original (Gene Roddenberry)',
      'Saga de La Cultura (Iain M. Banks)',
    ],
    conectado_con: ['distopia', 'solarpunk'],
    x: 870,
    y: 780,
    size: 'minor',
    hue: 100,
  },
  {
    id: 'apocaliptico',
    titulo: 'Ciencia Ficción Apocalíptica y Postapocalíptica',
    descripcion:
      'Muestra el colapso de la civilización humana (por pandemias, guerras o desastres) y la subsiguiente lucha por la supervivencia.',
    obras_representativas: [
      'La carretera (Cormac McCarthy)',
      'Soy leyenda (Richard Matheson)',
      'Mad Max: Fury Road (George Miller)',
      'Saga Metro 2033 (Dmitry Glukhovsky)',
    ],
    conectado_con: ['raiz', 'distopia'],
    x: 420,
    y: 830,
    size: 'minor',
    hue: 8,
  },
  {
    id: 'viajes_tiempo',
    titulo: 'Viajes en el Tiempo',
    descripcion:
      'Narrativas centradas en la manipulación de la línea temporal, paradojas causales y desplazamientos al pasado o al futuro.',
    obras_representativas: [
      'La máquina del tiempo (H.G. Wells)',
      'El fin de la Eternidad (Isaac Asimov)',
      'Volver al futuro / Back to the Future (Robert Zemeckis)',
      'Looper (Rian Johnson)',
    ],
    conectado_con: ['raiz', 'historia_alternativa', 'cf_dura'],
    x: 560,
    y: 130,
    size: 'minor',
    hue: 210,
  },
  {
    id: 'historia_alternativa',
    titulo: 'Historia Alternativa (Ucronía)',
    descripcion:
      'Especula sobre cómo sería el mundo si un hecho histórico crucial hubiese ocurrido de forma distinta, derivando en tecnología o sociedades diferentes.',
    obras_representativas: [
      'El hombre en el castillo (Philip K. Dick)',
      'Patria (Robert Harris)',
      'Watchmen (Alan Moore / Dave Gibbons)',
      'La conjura contra América (Philip Roth)',
    ],
    conectado_con: ['raiz', 'viajes_tiempo', 'steampunk'],
    x: 780,
    y: 80,
    size: 'minor',
    hue: 55,
  },
  {
    id: 'ciencia_fantasia',
    titulo: 'Ciencia Fantasía',
    descripcion:
      'Híbrido que mezcla elementos tecnológicos propios de la ciencia ficción con la magia, mitología o elementos sobrenaturales de la fantasía.',
    obras_representativas: [
      'Un libro del Sol Nuevo (Gene Wolfe)',
      'John Carter / Una princesa de Marte (Edgar Rice Burroughs)',
      'Warhammer 40,000 (Games Workshop)',
      'Saga Dragonriders of Pern (Anne McCaffrey)',
    ],
    conectado_con: ['raiz', 'space_opera'],
    x: 120,
    y: 450,
    size: 'minor',
    hue: 280,
  },
]

// Aristas únicas (cada par una sola vez)
export const graphEdges = (() => {
  const seen = new Set()
  const edges = []
  for (const node of graphNodes) {
    for (const target of node.conectado_con) {
      const key = [node.id, target].sort().join('::')
      if (!seen.has(key)) {
        seen.add(key)
        edges.push({ source: node.id, target })
      }
    }
  }
  return edges
})()

export const nodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n]))
