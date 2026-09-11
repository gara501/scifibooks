// Genera una portada SVG determinista y única para cada ficha del catálogo.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { books } from '../src/data/books.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'covers', 'unique')
const W = 800
const H = 1200

function hash(value) {
  let result = 2166136261
  for (const char of value) {
    result ^= char.charCodeAt(0)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

function random(seed) {
  return () => {
    seed += 0x6d2b79f5
    let value = seed
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function escape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function cover(book) {
  const seed = hash(`${book.code}-${book.title}-${book.author}`)
  const rnd = random(seed)
  const hue = book.hue ?? seed % 360
  const accent = (hue + 42 + seed % 74) % 360
  const motif = seed % 5
  const stars = Array.from({ length: 75 }, () => {
    const x = Math.round(rnd() * W)
    const y = Math.round(rnd() * 780)
    const radius = (0.4 + rnd() * 2).toFixed(1)
    return `<circle cx="${x}" cy="${y}" r="${radius}" opacity="${(0.18 + rnd() * 0.68).toFixed(2)}"/>`
  }).join('')
  const orbitCount = 2 + (seed % 4)
  const orbits = Array.from({ length: orbitCount }, (_, index) => {
    const rx = 130 + index * 70 + Math.round(rnd() * 45)
    const ry = 40 + index * 24 + Math.round(rnd() * 18)
    return `<ellipse cx="400" cy="520" rx="${rx}" ry="${ry}" transform="rotate(${Math.round(rnd() * 70 - 35)} 400 520)"/>`
  }).join('')
  const forms = [
    `<circle cx="400" cy="520" r="${100 + seed % 110}"/><circle class="cut" cx="${440 + seed % 55}" cy="${480 - seed % 45}" r="${75 + seed % 50}"/>`,
    `<path d="M80 720 L400 ${250 + seed % 130} L720 720 Z"/><circle class="cut" cx="400" cy="520" r="${55 + seed % 70}"/>`,
    `<rect x="${235 + seed % 80}" y="250" width="${250 + seed % 100}" height="560" rx="${seed % 45}" transform="rotate(${seed % 24 - 12} 400 530)"/>`,
    `<path d="M70 690 Q400 ${110 + seed % 150} 730 690 Q400 ${930 - seed % 90} 70 690Z"/><circle class="cut" cx="400" cy="570" r="90"/>`,
    `<polygon points="400,180 690,510 530,850 270,850 110,510"/><polygon class="cut" points="400,350 540,530 470,700 330,700 260,530"/>`,
  ][motif]

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Portada abstracta de ${escape(book.title)}">
<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="78%"><stop stop-color="hsl(${hue} 42% 20%)"/><stop offset="1" stop-color="#050507"/></radialGradient>
  <linearGradient id="shape" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 72% 64%)"/><stop offset="1" stop-color="hsl(${accent} 76% 52%)"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="13" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="grain"><feTurbulence baseFrequency=".82" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
  <style>.cut{fill:#050507}</style>
</defs>
<rect width="800" height="1200" fill="url(#bg)"/>
<g fill="hsl(${accent} 70% 84%)">${stars}</g>
<g fill="none" stroke="hsl(${accent} 75% 68%)" stroke-width="2" opacity=".45">${orbits}</g>
<g fill="url(#shape)" opacity=".82" filter="url(#glow)">${forms}</g>
<path d="M0 ${880 + seed % 130} Q200 ${800 + seed % 100} 400 ${900 + seed % 70} T800 ${850 + seed % 100}V1200H0Z" fill="#07070a" opacity=".9"/>
<g fill="none" stroke="hsl(${hue} 68% 65%)" opacity=".3"><path d="M0 980H800"/><path d="M0 1000H800"/><path d="M0 1025H800"/></g>
<rect width="800" height="1200" filter="url(#grain)" opacity=".065"/>
</svg>`
}

mkdirSync(outDir, { recursive: true })
for (const book of books) {
  if (book.code === 'SF-033') continue
  writeFileSync(join(outDir, `${book.code.toLowerCase()}.svg`), cover(book), 'utf8')
}

console.log(`Generadas ${books.length - 1} portadas únicas; SF-033 usa la ilustración raster de Mundo Anillo.`)
