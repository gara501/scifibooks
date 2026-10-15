import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeftRight, BookOpen, Check, Copy, GitCompareArrows, Plus, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Backdrop from '@/components/Backdrop'
import Footer from '@/components/Footer'
import { books } from '@/data/books'
import { comparisonPath, filterComparisonBooks, getComparisonProfile, resolveComparison } from '@/lib/bookComparison'
import { updateReadingLog, useReadingLog } from '@/lib/readingLog'

const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title, 'es'))
const controlClass = 'min-h-11 w-full min-w-0 border border-primary/30 bg-background px-3 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-primary'

function BookSelector({ book, other, side, onChange }) {
  const [query, setQuery] = useState('')
  const matches = filterComparisonBooks(sortedBooks, query, other?.code)
  const options = book && !matches.some((item) => item.code === book.code) ? [book, ...matches] : matches
  return <div className="min-w-0 border border-primary/25 bg-card/80 p-4 sm:p-6">
    <div className="mb-4 flex items-center justify-between"><p className="text-[0.6rem] tracking-[0.2em] text-primary">VOLUMEN {side.toUpperCase()}</p>{book && <button type="button" onClick={() => { onChange(null); setQuery('') }} aria-label={`Quitar ${book.title}`} className="grid size-11 place-items-center text-muted-foreground hover:text-primary"><X size={16} /></button>}</div>
    <label className="block"><span className="mb-2 block text-xs text-muted-foreground">Buscar por título o autor</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Neuromante, Huxley…" className={controlClass} /></label>
    <label className="mt-3 block"><span className="sr-only">Seleccionar volumen {side}</span><select className={controlClass} value={book?.slug || ''} onChange={(event) => { onChange(books.find((item) => item.slug === event.target.value) || null); setQuery('') }}><option value="">Elige un libro</option>{options.map((item) => <option key={item.code} value={item.slug}>{item.title} · {item.author}</option>)}</select></label>
    {matches.length === 0 && <p role="status" className="mt-2 text-xs text-muted-foreground">No hay coincidencias. Prueba otro título o autor.</p>}
    {book ? <div className="mt-5 flex gap-3 sm:gap-5"><img src={book.cover} alt={`Portada de ${book.title}`} className="h-32 w-20 shrink-0 object-cover sm:h-40 sm:w-28" /><div className="min-w-0"><p className="text-[0.6rem] tracking-[0.16em] text-signal">{book.code} · {book.year}</p><h2 className="mt-2 break-words font-heading text-sm font-bold leading-snug sm:text-lg">{book.title}</h2><p className="mt-2 text-xs text-muted-foreground">{book.author}</p><Link to={`/libro/${book.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs text-primary hover:underline"><BookOpen size={14} /> Abrir expediente</Link></div></div> : <div className="mt-5 grid min-h-40 place-items-center border border-dashed border-primary/20 text-center text-muted-foreground"><p className="px-3 text-xs">Selecciona el volumen {side} para comparar.</p></div>}
  </div>
}

function Edition({ edition }) {
  if (!edition) return <span className="text-muted-foreground">Sin edición registrada</span>
  return <><strong className="font-heading text-lg text-primary">{edition.pages} páginas</strong><span className="mt-2 block text-[0.65rem] leading-5 text-muted-foreground">{edition.publisher} · {edition.language}<br />ISBN {edition.isbn}</span><a className="mt-2 inline-block text-[0.65rem] text-signal underline underline-offset-4" href={edition.source} target="_blank" rel="noopener noreferrer">Consultar edición ↗</a></>
}

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const [left, right] = resolveComparison(books, params)
  const [notice, setNotice] = useState('')
  const log = useReadingLog()
  const profiles = [left, right].map(getComparisonProfile)
  const selected = [left, right]
  const ready = left && right
  const changePair = (a, b) => { setParams(new URLSearchParams(comparisonPath(a, b).split('?')[1])); setNotice('') }
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.origin + comparisonPath(left, right)); setNotice('Enlace de comparación copiado.') }
    catch { setNotice('No se pudo copiar. Puedes compartir la dirección del navegador.') }
  }
  const rows = [
    { label: 'Publicación original', render: (book) => book.year },
    { label: 'Subgéneros', render: (book) => book.tag },
    { label: 'Temas', render: (_book, profile) => profile.themes.join(' · ') },
    { label: 'Tono', render: (_book, profile) => profile.tone || 'Pendiente de valoración editorial' },
    { label: 'Dificultad de lectura', render: (_book, profile) => <><strong>{profile.difficulty || 'Pendiente de valoración'}</strong>{profile.reason && <span className="mt-2 block text-xs leading-6 text-muted-foreground">{profile.reason}</span>}</> },
    { label: 'Extensión por edición', render: (_book, profile) => <Edition edition={profile.edition} /> },
    { label: 'Escenario orientativo', render: (_book, profile) => profile.scenario },
    { label: 'Dureza científica orientativa', render: (_book, profile) => profile.hardness },
    { label: 'Premisa', render: (book) => book.desc },
  ]
  const common = ready ? profiles[0].themes.filter((theme) => profiles[1].themes.includes(theme)) : []
  return <div className="relative min-h-screen overflow-x-clip bg-background text-foreground"><Backdrop /><Navbar /><main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
    <header className="border-b border-primary/25 pb-7"><p className="flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-primary"><GitCompareArrows size={16} /> // LABORATORIO DE LECTURAS</p><h1 className="mt-4 break-words font-heading text-3xl font-black sm:text-5xl">DOS LIBROS.<br /><span className="text-primary">TU PRÓXIMA LECTURA.</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">Cruza dos expedientes del archivo. Compara sus universos y decide qué viaje te apetece emprender.</p></header>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{books.length} volúmenes disponibles</p><div className="flex flex-wrap gap-2"><button type="button" disabled={!left && !right} onClick={() => changePair(right, left)} className="inline-flex min-h-11 items-center gap-2 border border-primary/30 px-3 text-xs text-primary disabled:opacity-40"><ArrowLeftRight size={15} /> Intercambiar</button><button type="button" disabled={!ready} onClick={share} className="inline-flex min-h-11 items-center gap-2 border border-signal/30 px-3 text-xs text-signal disabled:opacity-40"><Copy size={15} /> Copiar enlace</button></div></div>
    {notice && <p role="status" className="mb-4 text-xs text-signal">{notice}</p>}
    <div className="grid gap-4 md:grid-cols-2"><BookSelector book={left} other={right} side="A" onChange={(book) => changePair(book, right)} /><BookSelector book={right} other={left} side="B" onChange={(book) => changePair(left, book)} /></div>
    {ready ? <>
      <section aria-label="Comparación de libros" className="mt-8 overflow-hidden border border-primary/25 bg-card/60"><div className="grid grid-cols-2 border-b border-primary/25 bg-primary/5"><p className="min-w-0 p-3 text-xs font-bold text-primary sm:p-5">A · {left.title}</p><p className="min-w-0 border-l border-primary/20 p-3 text-xs font-bold text-signal sm:p-5">B · {right.title}</p></div><dl>{rows.map((row) => <div key={row.label} className="border-b border-primary/15 last:border-0"><dt className="bg-background/50 px-3 py-2 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground sm:px-5">{row.label}</dt><dd className="grid grid-cols-2">{selected.map((book, index) => <div key={book.code} aria-label={`${row.label}: ${book.title}`} className="min-w-0 break-words p-3 text-xs leading-6 last:border-l last:border-primary/15 sm:p-5 sm:text-sm">{row.render(book, profiles[index])}</div>)}</dd></div>)}</dl></section>
      <section className="mt-6 border border-signal/30 bg-signal/[0.04] p-4 sm:p-6"><h2 className="font-heading text-lg font-bold">¿QUÉ VIAJE ELIGES?</h2>{common.length > 0 && <p className="mt-3 text-xs leading-6 text-signal">Comparten: {common.join(' · ')}.</p>}<div className="mt-4 grid gap-5 md:grid-cols-2">{selected.map((book, index) => <div key={book.code}><h3 className="text-sm font-bold">{book.title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">Para explorar {profiles[index].themes.join(', ').toLocaleLowerCase('es')}.{profiles[index].tone ? ` Con un tono ${profiles[index].tone.toLocaleLowerCase('es')}.` : ''}</p><button type="button" disabled={Boolean(log.books[book.code]?.status)} onClick={() => updateReadingLog(book.code, { status: 'pending' })} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-primary/30 px-3 text-xs text-primary disabled:opacity-60">{log.books[book.code]?.status ? <Check size={14} /> : <Plus size={14} />}{log.books[book.code]?.status ? 'Ya está en tu bitácora' : 'Añadir a pendientes'}</button></div>)}</div></section>
    </> : <p role="status" className="mt-8 border border-dashed border-primary/25 p-6 text-sm leading-7 text-muted-foreground">Elige dos libros distintos para ver la comparación. Si un enlace contiene un libro desconocido, vuelve a seleccionarlo arriba.</p>}
    <p className="mt-6 text-[0.68rem] leading-6 text-muted-foreground">El tono y la dificultad son valoraciones editoriales orientativas. Las páginas corresponden a la edición e idioma indicados; pueden variar en otras ediciones. Escenario y dureza científica se infieren de las etiquetas y la sinopsis. Los datos aún no documentados aparecen como pendientes.</p>
  </main><Footer /></div>
}
