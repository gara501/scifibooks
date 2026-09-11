import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, BookOpen, Network, RotateCcw, Search, Sparkles, UserRound } from 'lucide-react'
import Backdrop from '@/components/Backdrop'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { books } from '@/data/books'
import { edges } from '@/utils/influences'
import { Link } from 'react-router-dom'

const WIDTH = 1540
const HEIGHT = 920
const PAD_X = 82
const PAD_Y = 82
const LANES = 10

const bookByCode = new Map(books.map((book) => [book.code, book]))
const connectedCodes = new Set(edges.flatMap((edge) => [edge.source, edge.target]))
const graphBooks = books.filter((book) => connectedCodes.has(book.code))
const years = graphBooks.map((book) => book.year)
const minYear = Math.min(...years)
const maxYear = Math.max(...years)

function hashCode(value) {
  return [...value].reduce((total, character) => ((total << 5) - total + character.charCodeAt(0)) | 0, 0)
}

const positions = new Map(
  [...graphBooks]
    .sort((a, b) => a.year - b.year || a.code.localeCompare(b.code))
    .map((book, index) => {
      const x = PAD_X + ((book.year - minYear) / (maxYear - minYear)) * (WIDTH - PAD_X * 2)
      const lane = Math.abs(hashCode(`${book.code}-${book.tag}`) + index * 3) % LANES
      const y = PAD_Y + lane * ((HEIGHT - PAD_Y * 2) / (LANES - 1))
      return [book.code, { x, y }]
    }),
)

function edgePath(edge) {
  const start = positions.get(edge.source)
  const end = positions.get(edge.target)
  if (!start || !end) return ''
  const bend = Math.max(34, Math.abs(end.x - start.x) * 0.42)
  const direction = end.x >= start.x ? 1 : -1
  return `M ${start.x} ${start.y} C ${start.x + bend * direction} ${start.y}, ${end.x - bend * direction} ${end.y}, ${end.x} ${end.y}`
}

function ConnectionCard({ edge, activeCode, onSelect }) {
  const source = bookByCode.get(edge.source)
  const target = bookByCode.get(edge.target)
  const counterpart = activeCode === edge.source ? target : source

  return (
    <button type="button" onClick={() => onSelect(counterpart?.code, edge)} className="group w-full border border-primary/15 bg-background/40 p-3 text-left transition hover:border-primary/45 hover:bg-primary/[0.06]">
      <span className="flex items-center gap-2 text-[0.58rem] tracking-[0.16em] text-primary">
        {activeCode === edge.source ? <ArrowRight className="size-3" /> : <ArrowLeft className="size-3" />}
        {edge.tipo === 'autor' ? 'CONTINUIDAD DE AUTOR' : 'INFLUENCIA'}
      </span>
      <span className="mt-2 block font-heading text-sm font-bold text-foreground group-hover:text-primary">{counterpart?.title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{edge.nota}</span>
    </button>
  )
}

export default function Influences() {
  const reduceMotion = useReducedMotion()
  const [selectedCode, setSelectedCode] = useState(graphBooks[0]?.code)
  const [hoveredCode, setHoveredCode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [typeFilter, setTypeFilter] = useState('todas')
  const [query, setQuery] = useState('')

  const activeCode = hoveredCode || selectedCode
  const selectedBook = bookByCode.get(selectedCode)
  const visibleEdges = useMemo(() => edges.filter((edge) => typeFilter === 'todas' || edge.tipo === typeFilter), [typeFilter])
  const activeEdges = useMemo(() => visibleEdges.filter((edge) => edge.source === selectedCode || edge.target === selectedCode), [selectedCode, visibleEdges])
  const neighborCodes = useMemo(() => new Set(activeEdges.flatMap((edge) => [edge.source, edge.target])), [activeEdges])
  const searchResults = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    if (!term) return []
    return graphBooks.filter((book) => `${book.title} ${book.author} ${book.code}`.toLocaleLowerCase('es').includes(term)).slice(0, 6)
  }, [query])

  const selectBook = (code, edge = null) => {
    if (!code) return
    setSelectedCode(code)
    setSelectedEdge(edge)
    setQuery('')
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <Backdrop />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-[1500px] px-4 pb-20 pt-28 sm:px-6 lg:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-muted-foreground transition hover:text-primary"><ArrowLeft className="size-4" /> VOLVER AL ARCHIVO</Link>

        <header className="mt-8 grid gap-6 border-b border-primary/20 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[0.62rem] tracking-[0.28em] text-primary"><Network className="size-4" /> CARTOGRAFÍA LITERARIA // {graphBooks.length} OBRAS</p>
            <h1 className="max-w-4xl font-heading text-4xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">GRAFO DE <span className="text-primary text-glow">INFLUENCIAS</span></h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">Explora cómo las ideas, obsesiones y universos de la ciencia ficción se propagan entre obras. Selecciona un nodo o una conexión para reconstruir su linaje.</p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-primary/20 bg-primary/20 text-center">
            <div className="bg-background/90 px-5 py-4"><strong className="block font-heading text-2xl text-primary">{visibleEdges.length}</strong><span className="text-[0.55rem] tracking-[0.18em] text-muted-foreground">CONEXIONES</span></div>
            <div className="bg-background/90 px-5 py-4"><strong className="block font-heading text-2xl text-signal">{neighborCodes.size}</strong><span className="text-[0.55rem] tracking-[0.18em] text-muted-foreground">EN FOCO</span></div>
          </div>
        </header>

        <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0">
            <div className="relative z-20 grid gap-3 border border-primary/20 bg-card/65 p-3 backdrop-blur-md sm:grid-cols-[minmax(220px,1fr)_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BUSCAR OBRA, AUTOR O CÓDIGO" className="h-11 w-full border border-primary/20 bg-background/70 pl-10 pr-3 text-xs tracking-[0.08em] outline-none transition placeholder:text-muted-foreground focus:border-primary" />
                {searchResults.length > 0 && (
                  <div className="absolute inset-x-0 top-[calc(100%+6px)] max-h-72 overflow-y-auto border border-primary/30 bg-background shadow-2xl shadow-black/60">
                    {searchResults.map((book) => <button key={book.code} type="button" onClick={() => selectBook(book.code)} className="flex w-full items-center justify-between gap-3 border-b border-primary/10 px-3 py-3 text-left last:border-0 hover:bg-primary/10"><span><strong className="block font-heading text-sm">{book.title}</strong><small className="text-muted-foreground">{book.author}</small></span><span className="text-[0.6rem] text-primary">{book.year}</span></button>)}
                  </div>
                )}
              </div>
              <div className="flex border border-primary/20">
                {[['todas', 'TODAS'], ['influencia', 'INFLUENCIA'], ['autor', 'AUTOR']].map(([value, label]) => <button key={value} type="button" onClick={() => setTypeFilter(value)} className={`min-h-11 px-3 text-[0.56rem] tracking-[0.12em] transition sm:px-4 ${typeFilter === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}>{label}</button>)}
              </div>
              <button type="button" onClick={() => { setSelectedCode(graphBooks[0]?.code); setSelectedEdge(null); setQuery('') }} className="grid size-11 place-items-center border border-primary/20 text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="Restablecer grafo"><RotateCcw className="size-4" /></button>
            </div>

            <div className="relative mt-3 overflow-hidden border border-primary/20 bg-card/35">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,.13)_50%)] bg-[length:100%_4px] opacity-30" />
              <div className="overflow-x-auto overscroll-x-contain">
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[680px] min-w-[1120px] w-full" role="img" aria-label="Grafo cronológico de influencias entre libros de ciencia ficción">
                  <defs>
                    <marker id="arrow-influence" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" /></marker>
                    <marker id="arrow-author" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--signal)" /></marker>
                    <filter id="node-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  {Array.from({ length: 9 }, (_, index) => {
                    const year = Math.round(minYear + ((maxYear - minYear) / 8) * index)
                    const x = PAD_X + index * ((WIDTH - PAD_X * 2) / 8)
                    return <g key={year}><line x1={x} y1="42" x2={x} y2={HEIGHT - 34} stroke="var(--primary)" strokeOpacity="0.08" /><text x={x} y="28" fill="var(--muted-foreground)" fontSize="11" textAnchor="middle" letterSpacing="2">{year}</text></g>
                  })}
                  {visibleEdges.map((edge, index) => {
                    const key = `${edge.source}-${edge.target}-${index}`
                    const isActive = activeCode && (edge.source === activeCode || edge.target === activeCode)
                    const dimmed = activeCode && !isActive
                    const color = edge.tipo === 'autor' ? 'var(--signal)' : 'var(--primary)'
                    return <g key={key}>
                      <path data-sound d={edgePath(edge)} fill="none" stroke="transparent" strokeWidth="15" className="cursor-pointer" onClick={() => { setSelectedEdge(edge); setSelectedCode(edge.target) }}><title>{edge.nota}</title></path>
                      <motion.path d={edgePath(edge)} fill="none" stroke={color} strokeWidth={isActive ? 2.5 : 1} strokeOpacity={dimmed ? 0.055 : isActive ? 0.95 : 0.22} strokeDasharray={edge.tipo === 'autor' ? '7 6' : undefined} markerEnd={isActive ? `url(#arrow-${edge.tipo === 'autor' ? 'author' : 'influence'})` : undefined} initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: Math.min(index * 0.008, 0.5) }} className="pointer-events-none"><title>{edge.nota}</title></motion.path>
                    </g>
                  })}
                  {graphBooks.map((book, index) => {
                    const point = positions.get(book.code)
                    const isSelected = selectedCode === book.code
                    const isHovered = hoveredCode === book.code
                    const isNeighbor = neighborCodes.has(book.code)
                    const dimmed = selectedCode && !isSelected && !isNeighbor
                    return <motion.g key={book.code} initial={reduceMotion ? false : { opacity: 0, scale: 0 }} animate={{ opacity: dimmed ? 0.22 : 1, scale: 1 }} transition={{ delay: Math.min(index * 0.009, 0.65), duration: 0.35 }} style={{ transformOrigin: `${point.x}px ${point.y}px` }} onMouseEnter={() => setHoveredCode(book.code)} onMouseLeave={() => setHoveredCode(null)} onClick={() => selectBook(book.code)} className="cursor-pointer" role="button" tabIndex="0" onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && selectBook(book.code)} aria-label={`${book.title}, ${book.author}, ${book.year}`}>
                      {(isSelected || isHovered) && <circle cx={point.x} cy={point.y} r="22" fill="none" stroke="var(--primary)" strokeOpacity="0.55"><animate attributeName="r" values="17;24;17" dur="2s" repeatCount="indefinite" /></circle>}
                      <circle cx={point.x} cy={point.y} r={isSelected ? 10 : isNeighbor ? 7 : 5} fill={isSelected ? 'var(--primary)' : isNeighbor ? 'var(--signal)' : 'var(--background)'} stroke={isSelected ? 'var(--primary)' : 'var(--primary)'} strokeWidth={isSelected ? 3 : 1.5} filter={isSelected ? 'url(#node-glow)' : undefined}><title>{book.title} — {book.author} ({book.year})</title></circle>
                      {(isSelected || isHovered) && <g pointerEvents="none"><rect x={point.x + 15} y={point.y - 24} width="190" height="45" fill="var(--background)" stroke="var(--primary)" strokeOpacity="0.5" /><text x={point.x + 25} y={point.y - 6} fill="var(--foreground)" fontSize="11" fontWeight="700">{book.title.slice(0, 27)}</text><text x={point.x + 25} y={point.y + 10} fill="var(--primary)" fontSize="9" letterSpacing="1">{book.code} // {book.year}</text></g>}
                    </motion.g>
                  })}
                </svg>
              </div>
              <div className="flex flex-wrap items-center gap-5 border-t border-primary/15 bg-background/75 px-4 py-3 text-[0.56rem] tracking-[0.14em] text-muted-foreground">
                <span className="text-primary">← DESLIZA PARA RECORRER →</span><span className="flex items-center gap-2"><i className="block h-px w-7 bg-primary" /> INFLUENCIA</span><span className="flex items-center gap-2"><i className="block h-px w-7 border-t border-dashed border-signal" /> MISMO AUTOR / SAGA</span>
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <AnimatePresence mode="wait">
              {selectedBook && <motion.div key={selectedBook.code} initial={{ opacity: 0, x: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -12 }} className="overflow-hidden border border-primary/25 bg-card/70 backdrop-blur-md">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-primary/20 bg-background">
                  <img src={selectedBook.cover} alt={`Portada ilustrada de ${selectedBook.title}`} className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                  <span className="absolute left-4 top-4 border border-primary/40 bg-background/80 px-2 py-1 text-[0.58rem] tracking-[0.18em] text-primary">{selectedBook.code}</span>
                </div>
                <div className="p-5">
                  <p className="text-[0.6rem] tracking-[0.2em] text-primary">{selectedBook.year} // {selectedBook.tag}</p>
                  <h2 className="mt-3 font-heading text-2xl font-black leading-tight">{selectedBook.title}</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs text-signal"><UserRound className="size-3.5" /> {selectedBook.author}</p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{selectedBook.desc}</p>

                  {selectedEdge && <div className="mt-5 border-l-2 border-signal bg-signal/[0.06] p-4"><p className="flex items-center gap-2 text-[0.58rem] tracking-[0.16em] text-signal"><Sparkles className="size-3.5" /> CONEXIÓN SELECCIONADA</p><p className="mt-2 text-sm leading-6 text-foreground">{selectedEdge.nota}</p></div>}

                  <div className="mt-6 flex items-center justify-between border-b border-primary/15 pb-3"><p className="flex items-center gap-2 text-[0.6rem] tracking-[0.17em] text-primary"><BookOpen className="size-3.5" /> CONEXIONES DIRECTAS</p><span className="text-xs text-muted-foreground">{activeEdges.length}</span></div>
                  <div className="mt-3 grid max-h-[330px] gap-2 overflow-y-auto pr-1">
                    {activeEdges.length ? activeEdges.map((edge, index) => <ConnectionCard key={`${edge.source}-${edge.target}-${index}`} edge={edge} activeCode={selectedCode} onSelect={selectBook} />) : <p className="py-5 text-sm text-muted-foreground">No hay conexiones visibles con este filtro.</p>}
                  </div>
                </div>
              </motion.div>}
            </AnimatePresence>
          </aside>
        </section>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  )
}
