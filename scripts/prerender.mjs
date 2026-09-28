import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import books from '../src/data/books.json' with { type: 'json' }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const template = await readFile(resolve(root, 'index.html'), 'utf8')
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const routes = [
  { path: '/timetravel', title: 'Cronología de la ciencia ficción', description: 'Explora la evolución temporal de la ciencia ficción en SCIFIUNIVERSE.' },
  { path: '/calculus', title: 'Simuladores de ciencia ficción', description: 'Explora gravedad rotacional, dilatación temporal y escala de Kardashev.' },
  { path: '/influencias', title: 'Red de influencias', description: 'Conexiones entre obras, autores y linajes de la ciencia ficción.' },
  { path: '/diario', title: 'Descifra la transmisión', description: 'Una señal diaria de ciencia ficción te espera en la estación K-7.' },
  { path: '/bitacora', title: 'Bitácora de lectura', description: 'Registra tu rumbo entre los 100 volúmenes del archivo.' },
]

function htmlPage({ title, description, url, image = '/og/site.png', body = '' }) {
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
  html = html.replace('</head>', `<meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(description)}" /><meta property="og:image" content="https://scifibooks.netlify.app${image}" /><meta property="og:url" content="${esc(url)}" /><meta name="twitter:card" content="summary_large_image" /><link rel="canonical" href="${esc(url)}" /></head>`)
  if (body) html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  return html
}

for (const route of routes) {
  const url = `https://scifibooks.netlify.app${route.path}`
  const page = htmlPage({ ...route, url })
  const dir = resolve(root, route.path.slice(1))
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, 'index.html'), page)
}

for (const book of books) {
  const title = `${book.title} — ${book.code} | SCIFIUNIVERSE`
  const description = `${book.author} · ${book.year} · ${book.tag}. ${book.desc}`
  const url = `https://scifibooks.netlify.app/libro/${book.slug}`
  const body = `<main><article><img src="${esc(book.cover)}" alt="Portada de ${esc(book.title)}" width="360" /><p>${esc(book.code)} · ${esc(book.tag)}</p><h1>${esc(book.title)}</h1><p>${esc(book.author)} · ${esc(book.year)}</p><p>${esc(book.desc)}</p><h2>Tripulación registrada</h2><ul>${book.chars.map((name) => `<li>${esc(name)}</li>`).join('')}</ul></article></main>`
  const page = htmlPage({ title, description, url, image: `/og/${book.slug}.png`, body })
  const dir = resolve(root, 'libro', book.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, 'index.html'), page)
}

console.log(`Prerender estático: ${routes.length + books.length + 1} rutas`)
