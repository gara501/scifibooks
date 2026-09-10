// Convierte el JSON del usuario (100 libros) en el módulo src/data/books.js
// asignando a cada libro una escena procedural (cover) y un tono OKLCH (hue).
// Uso: node scripts/convert-books.mjs <ruta-del-json> [| node ...]

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Escena procedural por coincidencia de título → portada dedicada
const TITLE_SCENES = {
  dune: 'dune',
  'neuromante (neuromancer)': 'neuromante',
  'el problema de los tres cuerpos': 'trisolaris',
  'la mano izquierda de la oscuridad': 'oscuridad',
  fundación: 'fundacion',
  hyperion: 'hyperion',
  '2001: una odisea del espacio': 'odisea',
  solaris: 'solaris',
  'red mars (marte rojo)': 'marte',
  'el marciano (the martian)': 'marte',
  'crónicas marcianas': 'marte',
  '1984': 'distopia',
  'un mundo feliz (brave new world)': 'distopia',
  'el cuento de la criada (the handmaid\'s tale)': 'distopia',
  'rascacielos (high-rise)': 'distopia',
  'soy leyenda': 'vampiros',
  'el planeta de los simios': 'simios',
  'mundo anillo (ringworld)': 'anillo',
  'citas con rama': 'cilindro',
  'mundo disco: el color de la magia (crossover sci-fi/fantasía)': 'disco',
  'en las montañas de la locura': 'antartida',
  'el día de los trífidos (the day of the triffids)': 'trifidos',
  'la sombra del torturador (the shadow of the torturer)': 'urnas',
  'atrápame ese mono (children of time)': 'aranas',
  'la era del diamante (the diamond age)': 'nano',
  'el juego de ender': 'flota',
  'el despertar del leviatán (leviathan wakes)': 'flota',
  'tropas del espacio (starship troopers)': 'flota',
  'fahrenheit 451': 'llamas',
}

// Mapeo semántico ad-hoc por título → última mención como fallback
const SEMANTIC_SCENES = {
  ciudad: 'urnas',
  'bóvedas de acero (the caves of steel)': 'urnas',
  'el sol desnudo (the naked sun)': 'urnas',
  'la guerra de los mundos': 'distopia',
  'forastero en tierra extraña (stranger in a strange land)': 'solar',
  contacto: 'anillo',
  'picnic junto al camino (stalker)': 'distopia',
  'estación de la calle perdido (perdido street station)': 'urnas',
  'las sirenas de titán': 'solar',
  'un viaje a la luna (de la tierra a la luna)': 'solar',
  'la máquina del tiempo': 'reloj',
  'veinte mil leguas de viaje submarino': 'solar',
  'el nombre del mundo es bosque': 'solar',
  'sistemas de visión (blindsight)': 'nano',
  'la nube negra (the black cloud)': 'fundacion',
  'mundo muerto (deathworld)': 'trifidos',
  'la invención de morel (the invention of morel)': 'urnas',
  'la invención de morel': 'urnas',
  "el fin de la infancia (childhood's end)": 'solar',
  'anatema (anathem)': 'urnas',
  'estación de tránsito (way station)': 'solar',
  'babel-17': 'solar',
  'la intersección de einstein (the einstein intersection)': 'urnas',
  'axiomático (axiomatic)': 'nano',
  'exhalación (exhalation)': 'urnas',
  "el fin de la muerte (death's end)": 'urnas',
  'el bosque oscuro (the dark forest)': 'urnas',
  'la guía del autoestopista galáctico': 'solar',
  'el restaurante del fin del mundo': 'solar',
  'vencer al dragón (norstrilia)': 'urnas',
  'la guerra de los cielos (out of the silent planet)': 'urnas',
  diáspora: 'nano',
  'metro 2033': 'distopia',
  'los navegantes del espacio (star maker)': 'fundacion',
  'las primeras y las últimas personas (last and first men)': 'urnas',
  'axioma de la nada (la física de las calamidades)': 'distopia',
}

// Fallback por categoría
const CATEGORY_SCENES = [
  [/distop|antiutop|totalitar/i, 'distopia'],
  [/cyberpunk|proto-cyberpunk|noir/i, 'neuromante'],
  [/postcyberpunk|criptopunk|nanopunk/i, 'nano'],
  [/viajes en el tiempo|paradoja|tiempo non-lineal|ucronía|historia alternativa/i, 'reloj'],
  [/space opera|ópera|galáctica|militar|tropas/i, 'fundacion'],
  [/postapocal|apocal|desastre/i, 'trifidos'],
  [/solarpunk|hopepunk|utop/i, 'solar'],
  [/biopunk|bio-horror|biotecnolog|genética/i, 'trifidos'],
  [/terraform|marte|marcian/i, 'marte'],
  [/ciencia fantas|crossover|fantasía/i, 'disco'],
  [/terror|lovecraft|gótico|horror/i, 'antartida'],
  [/vampiro/i, 'vampiros'],
  [/tiempo|time/i, 'reloj'],
]

// Hue por palabra clave de categoría (para libros que usan fallback)
function pickScene(title, category) {
  const normalized = title.toLowerCase().trim()
  const key = TITLE_SCENES[normalized] || SEMANTIC_SCENES[normalized]
  if (key) return key
  for (const [re, scene] of CATEGORY_SCENES) {
    if (re.test(category)) return scene
  }
  return 'estatico'
}

function pickHue(title, category) {
  if (/distop|antiutop|totalitar/i.test(category)) return 12
  if (/cyberpunk|criptopunk|nanopunk|noir/i.test(category)) return 305
  if (/postcyberpunk/i.test(category)) return 190
  if (/viajes en el tiempo|paradoja|ucronía|historia alternativa|time|tiempo/i.test(category)) return 210
  if (/space opera|ópera|galáctica/i.test(category)) return 260
  if (/militar|tropas/i.test(category)) return 20
  if (/postapocal|apocal|desastre/i.test(category)) return 8
  if (/solarpunk|hopepunk|utop/i.test(category)) return 140
  if (/biopunk|bio-horror|genética|vampiro/i.test(category)) return 150
  if (/terraform|marte|marcian/i.test(category)) return 30
  if (/ciencia fantas|crossover|fantasía/i.test(category)) return 280
  if (/terror|lovecraft|gótico|horror/i.test(category)) return 200
  if (/blanda|soft|antropol|sociolog|filosof/i.test(category)) return 320
  return 82
}

const rawFile = process.argv[2]
if (!rawFile) {
  console.error('Uso: node scripts/convert-books.mjs <ruta-json>')
  process.exit(1)
}

const { libros } = JSON.parse(readFileSync(rawFile, 'utf8'))

const entries = libros
  .map((l) => {
    const scene = pickScene(l.titulo, l.categoria)
    const hue = pickHue(l.titulo, l.categoria)
    return `  {
    code: '${l.id.replace('scifi_', 'SF-')}',
    title: ${JSON.stringify(l.titulo)},
    author: ${JSON.stringify(l.autor)},
    year: ${l.año_publicacion},
    tag: ${JSON.stringify(l.categoria)},
    desc: ${JSON.stringify(l.descripcion)},
    chars: ${JSON.stringify(l.personajes_principales)},
    cover: '/covers/${scene}.svg',
    hue: ${hue},
  }`
  })
  .join(',\n')

const out = `// Los 100 libros canónicos de ciencia ficción del archivo.
// cover: escena procedural asignada. hue: tono del acento.
export const books = [
${entries},
]

// Categorías únicas para el filtro del catálogo
export const tags = [...new Set(books.map((b) => b.tag))].sort()
`

writeFileSync(join(ROOT, 'src', 'data', 'books.js'), out, 'utf8')
console.log(`✓ ${libros.length} libros escritos en src/data/books.js`)
