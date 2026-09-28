import { useMemo, useRef, useState } from 'react'
import { Download, FileUp, Orbit, Share2, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Backdrop from '@/components/Backdrop'
import Footer from '@/components/Footer'
import { books } from '@/data/books'
import challenges from '@/data/challenges.json'
import { getReadingLog, replaceReadingLog, useReadingLog } from '@/lib/readingLog'

const statusLabels = { read: 'LEÍDO', reading: 'LEYENDO', pending: 'PENDIENTE' }

function rankFor(count) {
  if (count >= 90) return 'Tipo III'
  if (count >= 60) return 'Archivista'
  if (count >= 30) return 'Explorador'
  if (count >= 10) return 'Navegante'
  return 'Cadete'
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char])
}

async function makeCrewCard({ rank, read, genre, favorites }) {
  const favLines = favorites.length ? favorites.map((book) => book.title).join(' · ') : 'Sin favoritos registrados'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0d0b06"/><path d="M0 490h1200M0 500h1200M800 0v630" stroke="#d2a84a" stroke-opacity=".2"/><circle cx="980" cy="270" r="190" fill="none" stroke="#d2a84a" stroke-opacity=".25" stroke-width="2"/><circle cx="980" cy="270" r="145" fill="none" stroke="#59d9c1" stroke-opacity=".24"/><text x="64" y="92" fill="#d2a84a" font-family="monospace" font-size="25" letter-spacing="8">SCIFIUNIVERSE · ESTACIÓN K-7</text><text x="64" y="190" fill="#f6f1e7" font-family="sans-serif" font-weight="700" font-size="64">CARNET DE TRIPULANTE</text><text x="64" y="294" fill="#59d9c1" font-family="monospace" font-size="42">RANGO // ${escapeXml(rank)}</text><text x="64" y="370" fill="#f6f1e7" font-family="monospace" font-size="34">${read} / 100 VOLÚMENES LEÍDOS</text><text x="64" y="430" fill="#d2a84a" font-family="monospace" font-size="22">SUBGÉNERO DOMINANTE  ·  ${escapeXml(genre || 'SIN REGISTRO')}</text><text x="64" y="548" fill="#c2bcae" font-family="monospace" font-size="20">FAVORITOS  ·  ${escapeXml(favLines.slice(0, 92))}</text><text x="64" y="590" fill="#8e887e" font-family="monospace" font-size="16" letter-spacing="4">SCIFIBOOKS.NETLIFY.APP/BITACORA</text></svg>`
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject })
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  canvas.getContext('2d').drawImage(image, 0, 0)
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen.')), 'image/png'))
}

export default function Bitacora() {
  const log = useReadingLog()
  const [notice, setNotice] = useState('')
  const fileRef = useRef(null)
  const records = books.map((book) => ({ book, ...(log.books[book.code] || {}) }))
  const readBooks = records.filter((item) => item.status === 'read')
  const favorites = records.filter((item) => item.favorite).map((item) => item.book).slice(0, 3)
  const genreCounts = useMemo(() => readBooks.reduce((counts, item) => {
    const genre = item.book.tag.split(' / ')[0].trim()
    counts[genre] = (counts[genre] || 0) + 1
    return counts
  }, {}), [readBooks])
  const genres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  const dominantGenre = genres[0]?.[0] || ''
  const rank = rankFor(readBooks.length)
  const challengeRows = challenges.map((challenge) => {
    if (challenge.criterion === 'distinct-tags') { const count = new Set(readBooks.map((item) => item.book.tag.split(' / ')[0].trim())).size; return { ...challenge, count, target: challenge.target, done: count >= challenge.target } }
    const eligible = books.filter((book) => challenge.criterion === 'author' ? book.author === challenge.value : new RegExp(challenge.value, 'i').test(book.tag))
    const count = eligible.filter((book) => log.books[book.code]?.status === 'read').length
    return { ...challenge, count, target: eligible.length, done: eligible.length > 0 && count >= eligible.length }
  })

  const exportLog = () => {
    const blob = new Blob([JSON.stringify({ version: 1, ...getReadingLog() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'scifiuniverse-bitacora.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importLog = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      replaceReadingLog(JSON.parse(await file.text()))
      setNotice('Bitácora importada.')
    } catch (error) {
      setNotice(error.message || 'No se pudo importar el archivo.')
    }
    event.target.value = ''
  }

  const shareCrewCard = async () => {
    try {
      const blob = await makeCrewCard({ rank, read: readBooks.length, genre: dominantGenre, favorites })
      const file = new File([blob], 'carnet-scifiuniverse.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] }) && navigator.share) await navigator.share({ title: 'Carnet de tripulante SCIFIUNIVERSE', files: [file] })
      else {
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = file.name
        anchor.click()
        URL.revokeObjectURL(url)
        setNotice('Carnet descargado.')
      }
    } catch {
      setNotice('No se pudo generar o compartir el carnet en este navegador.')
    }
  }

  return <div className="relative min-h-screen overflow-x-clip bg-background text-foreground"><Backdrop /><Navbar /><main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28"><header className="border-b border-primary/20 pb-7"><p className="flex items-center gap-2 text-[0.62rem] tracking-[0.28em] text-primary"><Orbit size={15} /> // ARCHIVO PERSONAL DE TRIPULACIÓN</p><h1 className="mt-3 font-heading text-4xl font-black sm:text-6xl">BITÁCORA</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Tu ruta de lectura queda guardada en este dispositivo. Marca un volumen desde sus tarjetas o su expediente.</p></header>
    <section className="mt-7 grid gap-4 sm:grid-cols-3"><article className="border border-primary/25 bg-card/60 p-5"><p className="text-[0.6rem] tracking-[0.2em] text-muted-foreground">PROGRESO DE ARCHIVO</p><p className="mt-3 font-heading text-3xl font-black text-primary">{readBooks.length}<span className="text-lg text-muted-foreground"> / 100</span></p><div className="mt-4 h-2 border border-primary/20 bg-background"><div className="h-full bg-primary" style={{ width: `${readBooks.length}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">{readBooks.length}% de los volúmenes leídos</p></article><article className="border border-signal/25 bg-card/60 p-5"><p className="text-[0.6rem] tracking-[0.2em] text-muted-foreground">RANGO ACTUAL</p><p className="mt-3 font-heading text-2xl font-black text-signal">{rank.toUpperCase()}</p><p className="mt-3 text-xs text-muted-foreground">{readBooks.length < 10 ? `${10 - readBooks.length} lecturas para Navegante` : `${readBooks.length} volúmenes completados`}</p></article><article className="border border-primary/25 bg-card/60 p-5"><p className="text-[0.6rem] tracking-[0.2em] text-muted-foreground">SUBGÉNERO DOMINANTE</p><p className="mt-3 font-heading text-lg font-bold">{dominantGenre || 'SIN DATOS'}</p><p className="mt-2 text-xs text-muted-foreground">{genres[0]?.[1] || 0} volumen(es) leídos</p></article></section>
    <section className="mt-10"><h2 className="font-heading text-xl font-bold">MAPA DE SUBGÉNEROS</h2><div className="mt-4 space-y-3">{genres.length ? genres.map(([genre, count]) => <div key={genre} className="grid grid-cols-[minmax(0,1fr)_2fr_2rem] items-center gap-3 text-xs"><span>{genre}</span><div className="h-2 bg-primary/10"><div className="h-full bg-signal" style={{ width: `${(count / readBooks.length) * 100}%` }} /></div><span className="text-right text-muted-foreground">{count}</span></div>) : <p className="border border-dashed border-primary/25 p-5 text-sm text-muted-foreground">Marca libros como leídos para revelar tu cartografía.</p>}</div></section>
    <section className="mt-10 grid gap-6 lg:grid-cols-3">{Object.entries(statusLabels).map(([status, label]) => <div key={status}><h2 className="border-b border-primary/20 pb-3 font-heading text-sm font-bold tracking-[0.12em]">{label} <span className="text-primary">({records.filter((item) => item.status === status).length})</span></h2><ul className="mt-3 space-y-2">{records.filter((item) => item.status === status).map(({ book }) => <li key={book.code}><a href={`/libro/${book.slug}`} className="block border border-primary/15 bg-card/40 p-3 hover:border-primary/45"><span className="text-[0.55rem] tracking-[0.14em] text-primary">{book.code} · {book.year}</span><span className="mt-1 block text-sm">{book.title}</span></a></li>)}{!records.some((item) => item.status === status) && <li className="py-3 text-xs text-muted-foreground">Sin volúmenes en esta lista.</li>}</ul></div>)}</section>
    <section className="mt-10"><h2 className="font-heading text-xl font-bold">RETOS DE EXPLORACIÓN</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{challengeRows.map((challenge) => <article key={challenge.id} className="border border-primary/20 bg-card/50 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-heading text-sm font-bold">{challenge.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{challenge.description}</p></div>{challenge.done && <span aria-label="Insignia obtenida" className="shrink-0 border border-signal/40 bg-signal/10 px-2 py-1 text-[0.52rem] tracking-[0.08em] text-signal">✦ INSIGNIA</span>}</div><div className="mt-4 flex items-center gap-3"><div className="h-2 flex-1 bg-primary/10"><div className="h-full bg-signal" style={{ width: `${Math.min(100, challenge.target ? challenge.count / challenge.target * 100 : 0)}%` }} /></div><span className="min-w-12 text-right text-xs text-primary">{challenge.count}/{challenge.target}</span></div></article>)}</div></section>
    <section className="mt-10 border border-primary/25 bg-card/50 p-5 sm:p-7"><p className="flex items-center gap-2 text-[0.6rem] tracking-[0.25em] text-primary"><Star size={14} /> CARNET DE TRIPULANTE</p><p className="mt-3 text-sm text-muted-foreground">Rango {rank} · {readBooks.length}/100 leídos · {dominantGenre || 'sin subgénero dominante'}.</p><p className="mt-3 text-xs text-muted-foreground">Favoritos: {favorites.length ? favorites.map((book) => book.title).join(' · ') : 'todavía sin favoritos'}</p><button type="button" onClick={shareCrewCard} className="mt-5 inline-flex min-h-11 items-center gap-2 border border-primary/40 px-4 text-xs tracking-[0.12em] text-primary hover:bg-primary/10"><Share2 size={15} /> DESCARGAR / COMPARTIR CARNET</button></section>
    <section className="mt-10 flex flex-wrap gap-3 border-t border-primary/15 pt-6"><button type="button" onClick={exportLog} className="inline-flex min-h-11 items-center gap-2 border border-primary/30 px-4 text-xs text-primary"><Download size={15} /> EXPORTAR BITÁCORA</button><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 border border-primary/30 px-4 text-xs text-primary"><FileUp size={15} /> IMPORTAR JSON</button><input ref={fileRef} type="file" accept="application/json,.json" onChange={importLog} className="sr-only" />{notice && <p role="status" className="self-center text-xs text-signal">{notice}</p>}</section>
  </main><Footer /></div>
}
