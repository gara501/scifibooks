import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import books from '../src/data/books.json' with { type: 'json' }

const output = fileURLToPath(new URL('../public/og/', import.meta.url))
await mkdir(output, { recursive: true })
const font = await readFile(new URL('../node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff', import.meta.url))

async function render({ book, slug = 'site', title, subtitle, hue = 82 }) {
  const background = `hsl(${hue} 22% 7%)`
  const accent = `hsl(${hue} 78% 62%)`
  let cover
  if (book) {
    const bytes = await sharp(fileURLToPath(new URL(`../public${book.cover}`, import.meta.url))).png().toBuffer()
    cover = `data:image/png;base64,${bytes.toString('base64')}`
  }
  const svg = await satori(h('div', { style: { width: '1200px', height: '630px', display: 'flex', padding: '48px', gap: '44px', background, color: '#f6f1e7', fontFamily: 'Unbounded', position: 'relative' } }, [
    h('div', { key: 'grid', style: { position: 'absolute', inset: '0', opacity: 0.15, backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '32px 32px' } }),
    cover ? h('img', { key: 'cover', src: cover, width: 350, height: 525, style: { objectFit: 'cover', border: `2px solid ${accent}` } }) : null,
    h('div', { key: 'text', style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, position: 'relative' } }, [
      h('div', { key: 'brand', style: { color: accent, fontSize: 22, letterSpacing: 6, marginBottom: 30 } }, 'SCIFIUNIVERSE · ESTACIÓN K-7'),
      h('div', { key: 'code', style: { color: accent, fontSize: 18, letterSpacing: 4, marginBottom: 18 } }, book ? `${book.code}  /  ${book.tag}` : 'ARCHIVO ESTELAR · 100 VOLÚMENES'),
      h('div', { key: 'title', style: { fontSize: book ? 40 : 52, lineHeight: 1.2, fontWeight: 700 } }, title),
      h('div', { key: 'sub', style: { marginTop: 22, color: '#b9b4a8', fontSize: 22 } }, subtitle),
      book ? h('div', { key: 'year', style: { marginTop: 16, color: accent, fontSize: 18 } }, `${book.author}  ·  ${book.year}`) : null,
      h('div', { key: 'url', style: { position: 'absolute', bottom: 4, color: '#928c80', fontSize: 16, letterSpacing: 3 } }, 'SCIFIBOOKS.NETLIFY.APP'),
    ]),
  ]), { width: 1200, height: 630, fonts: [{ name: 'Unbounded', data: font, weight: 500, style: 'normal' }] })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  await sharp(png).png().toFile(`${output}/${slug}.png`)
}

for (const book of books) await render({ book, slug: book.slug, title: book.title, subtitle: book.desc, hue: book.hue })
await render({ slug: 'site', title: 'Archivo estelar de ciencia ficción', subtitle: '100 volúmenes · Una estación orbital para explorar el futuro.' })
console.log(`Tarjetas OG generadas: ${books.length + 1}`)
