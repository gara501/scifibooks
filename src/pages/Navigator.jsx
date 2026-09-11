import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Crosshair, Radar, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import BookCard from '@/components/BookCard'
import BookModal from '@/components/BookModal'
import { books } from '@/data/books'
import { genreOptions, getBookCoordinates, scenarioOptions } from '@/lib/bookCoordinates'

const MIN_YEAR = Math.min(...books.map((book) => book.year))
const MAX_YEAR = Math.max(...books.map((book) => book.year))
const PAGE_SIZE = 12
const genres = genreOptions(books)
const selectClass = 'h-11 w-full border border-primary/25 bg-background/80 px-3 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
const labelClass = 'mb-2 flex items-center justify-between text-[0.58rem] tracking-[0.18em] text-muted-foreground'

function ConsoleField({ label, value, onChange, options }) {
  return (
    <label>
      <span className={labelClass}>{label}<span className="text-primary">◈</span></span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>
        <option value="TODOS">TODOS</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

export default function Navigator() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('TODOS')
  const [scenario, setScenario] = useState('TODOS')
  const [hardness, setHardness] = useState('TODOS')
  const [fromYear, setFromYear] = useState(MIN_YEAR)
  const [toYear, setToYear] = useState(MAX_YEAR)
  const [page, setPage] = useState(0)
  const [active, setActive] = useState(null)
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('es'))

  const filtered = useMemo(() => books.filter((book) => {
    const coordinates = getBookCoordinates(book)
    const matchesText = !deferredQuery || `${book.title} ${book.author} ${book.desc}`.toLocaleLowerCase('es').includes(deferredQuery)
    return matchesText && book.year >= fromYear && book.year <= toYear
      && (genre === 'TODOS' || coordinates.genre === genre)
      && (scenario === 'TODOS' || coordinates.scenario === scenario)
      && (hardness === 'TODOS' || coordinates.hardness === hardness)
  }), [deferredQuery, fromYear, genre, hardness, scenario, toYear])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const visibleBooks = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const update = (setter) => (value) => { setter(value); setPage(0) }
  const reset = () => {
    setQuery(''); setGenre('TODOS'); setScenario('TODOS'); setHardness('TODOS')
    setFromYear(MIN_YEAR); setToYear(MAX_YEAR); setPage(0)
  }
  const returnToNavigator = () => document.getElementById('navegante')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section id="navegante" className="relative z-10 scroll-mt-20 border-t border-primary/15 py-16 md:scroll-mt-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.header initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }} className="mb-10 border-b border-primary/20 pb-10 md:mb-14 md:pb-14">
            <p className="mb-4 flex items-center gap-2 text-[0.62rem] tracking-[0.3em] text-primary"><Radar className="size-4" /> // SISTEMA DE NAVEGACIÓN BIBLIOGRÁFICA</p>
            <h1 className="font-heading text-[clamp(2.4rem,8vw,6rem)] leading-none font-extrabold tracking-tight">NAVE<span className="text-primary text-glow">GANTE</span></h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Introduce tus coordenadas. El radar cruzará época, tradición narrativa, escenario y dureza científica para localizar tu próxima lectura.</p>
          </motion.header>

          <motion.section initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: 0.15, duration: 0.65 }} className="relative mb-12 overflow-hidden border border-primary/30 bg-card/70 shadow-[0_0_70px_oklch(0.84_0.165_82/8%)]">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
            <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 px-4 py-3 sm:px-6">
              <p className="flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-primary"><SlidersHorizontal className="size-4" /> CONSOLA DE COORDENADAS</p>
              <p className="flex items-center gap-2 text-[0.58rem] tracking-[0.18em] text-muted-foreground"><span className="size-1.5 animate-blink rounded-full bg-primary" /> RADAR ACTIVO</p>
            </header>

            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-4">
              <label className="lg:col-span-2"><span className={labelClass}>SEÑAL / TÍTULO / AUTOR<span className="text-primary">TXT</span></span><span className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/70" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0) }} placeholder="BUSCAR EN EL ARCHIVO..." className={`${selectClass} pl-10`} /></span></label>
              <ConsoleField label="SUBGÉNERO" value={genre} onChange={update(setGenre)} options={genres} />
              <ConsoleField label="ESCENARIO" value={scenario} onChange={update(setScenario)} options={scenarioOptions} />
              <ConsoleField label="DUREZA CIENTÍFICA" value={hardness} onChange={update(setHardness)} options={['HARD SF', 'HÍBRIDA', 'SOFT SF']} />

              <div className="lg:col-span-2">
                <span className={labelClass}>VENTANA TEMPORAL <span className="font-bold text-primary">{fromYear} — {toYear}</span></span>
                <div className="grid grid-cols-2 gap-3">
                  <label><span className="sr-only">Año inicial</span><input type="number" min={MIN_YEAR} max={toYear} value={fromYear} onChange={(event) => { setFromYear(Math.min(Number(event.target.value), toYear)); setPage(0) }} className={selectClass} /></label>
                  <label><span className="sr-only">Año final</span><input type="number" min={fromYear} max={MAX_YEAR} value={toYear} onChange={(event) => { setToYear(Math.max(Number(event.target.value), fromYear)); setPage(0) }} className={selectClass} /></label>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3"><input aria-label="Año inicial" type="range" min={MIN_YEAR} max={MAX_YEAR} value={fromYear} onChange={(event) => { setFromYear(Math.min(Number(event.target.value), toYear)); setPage(0) }} className="accent-[var(--phosphor)]" /><input aria-label="Año final" type="range" min={MIN_YEAR} max={MAX_YEAR} value={toYear} onChange={(event) => { setToYear(Math.max(Number(event.target.value), fromYear)); setPage(0) }} className="accent-[var(--phosphor)]" /></div>
              </div>

              <button type="button" onClick={reset} className="min-h-11 self-end border border-primary/25 bg-primary/5 px-4 text-[0.6rem] tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground"><RotateCcw className="mr-2 inline size-3.5" /> RESTABLECER RADAR</button>
            </div>
          </motion.section>

          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[0.6rem] tracking-[0.24em] text-primary">// COORDENADAS RESUELTAS</p><h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">{String(filtered.length).padStart(3, '0')} SEÑALES</h2></div>
            <p className="text-[0.6rem] tracking-[0.2em] text-muted-foreground">PÁGINA {safePage + 1} / {pageCount}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${genre}-${scenario}-${hardness}-${fromYear}-${toYear}-${deferredQuery}-${safePage}`} initial={{ opacity: 0, filter: 'blur(10px)', clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleBooks.map((book, index) => <BookCard key={book.code} book={book} index={index} onOpen={() => setActive(book)} />)}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-72 place-items-center border border-dashed border-primary/25 bg-card/30 text-center"><div><Crosshair className="mx-auto size-10 text-primary/60" /><p className="mt-5 font-heading text-sm tracking-[0.2em]">SIN SEÑALES EN ESTE SECTOR</p><button type="button" onClick={reset} className="mt-5 text-xs text-primary underline underline-offset-4">RESTABLECER COORDENADAS</button></div></motion.div> : null}

          {pageCount > 1 ? <nav aria-label="Paginación de resultados" className="mt-10 flex items-center justify-center gap-4"><button type="button" disabled={safePage === 0} onClick={() => { setPage((current) => Math.max(0, current - 1)); returnToNavigator() }} className="grid size-11 place-items-center border border-primary/25 text-primary disabled:opacity-25"><ChevronLeft className="size-4" /><span className="sr-only">Página anterior</span></button><span className="min-w-24 text-center text-xs tracking-[0.2em] text-muted-foreground">{String(safePage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span><button type="button" disabled={safePage === pageCount - 1} onClick={() => { setPage((current) => Math.min(pageCount - 1, current + 1)); returnToNavigator() }} className="grid size-11 place-items-center border border-primary/25 text-primary disabled:opacity-25"><ChevronRight className="size-4" /><span className="sr-only">Página siguiente</span></button></nav> : null}
        </div>
      <BookModal book={active} onSwitch={setActive} onClose={() => setActive(null)} />
    </section>
  )
}
