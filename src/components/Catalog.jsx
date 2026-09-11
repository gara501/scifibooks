import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { books, tags } from '@/data/books'
import BookCard from '@/components/BookCard'
import BookModal from '@/components/BookModal'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Funnel, ArrowUp } from 'lucide-react'

const PAGE_SIZE = 12

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
}

export default function Catalog() {
  const [active, setActive] = useState(null)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    if (!filter) return books
    return books.filter((b) => b.tag === filter)
  }, [filter])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = Math.min(page, Math.max(pageCount - 1, 0))

  const pageBooks = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const goTo = (p) => {
    const next = Math.max(0, Math.min(p, pageCount - 1))
    setPage(next)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setFilterAndReset = (f) => {
    setFilter(f)
    setPage(0)
  }

  return (
    <section id="catalogo" className="relative scroll-mt-20 py-16 md:scroll-mt-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="mb-3 text-[0.65rem] tracking-[0.35em] text-primary">
              // {String(filtered.length).padStart(3, '0')} REGISTROS ENCONTRADOS
            </p>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">
              CATÁLOGO <span className="text-primary text-glow">ORBITAL</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 pb-1 text-[0.65rem] tracking-[0.25em] text-muted-foreground">
            <span>
              PÁGINA {String(safePage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
            </span>
            <Separator orientation="vertical" className="h-4 bg-primary/30" />
            <span className="text-primary">SECTOR 7G</span>
          </div>
        </motion.div>

        {/* filtro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 grid gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:items-center"
        >
          <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
            <Funnel className="size-3 text-primary/70" />
            SUBGÉNERO
          </span>
          <Select value={filter || 'all'} onValueChange={(v) => setFilterAndReset(v === 'all' ? '' : v)}>
            <SelectTrigger
              className="h-9 w-full max-w-[280px] border-primary/30 bg-primary/5 text-[0.65rem] tracking-[0.15em] text-primary hover:bg-primary/10 sm:w-auto"
              aria-label="Filtrar por subgénero"
            >
              <SelectValue placeholder="TODOS" />
            </SelectTrigger>
            <SelectContent className="border-primary/30 bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="text-[0.65rem] tracking-[0.15em]">
                TODOS ({books.length})
              </SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag} className="text-[0.65rem] tracking-[0.1em]">
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[0.6rem] tracking-[0.25em] text-muted-foreground">
            {filtered.length} REGISTRO{filtered.length !== 1 ? 'S' : ''}
          </span>
        </motion.div>

        {/* grid paginado */}
        <div className="relative min-h-[24rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter}-${safePage}`}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            >
              {pageBooks.map((book, i) => (
                <BookCard key={book.code} book={book} index={i} onOpen={() => setActive(book)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* paginación */}
        {pageCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:mt-12 sm:gap-4"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 0}
              className="h-11 min-w-11 justify-self-start gap-2 px-3 font-heading text-xs font-bold tracking-[0.2em] disabled:opacity-30 sm:px-5"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">ANTERIOR</span>
            </Button>

            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
                let p
                if (pageCount <= 7) p = i
                else if (safePage < 3) p = i
                else if (safePage > pageCount - 4) p = pageCount - 7 + i
                else p = safePage - 3 + i
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goTo(p)}
                    aria-label={`Ir a la página ${p + 1}`}
                    className={`size-9 cursor-pointer text-xs font-bold tracking-[0.1em] transition-all duration-300 ${
                      p === safePage
                        ? 'border border-primary bg-primary text-primary-foreground shadow-[0_0_18px_oklch(0.84_0.165_82/30%)]'
                        : 'border border-primary/25 bg-primary/5 text-primary/70 hover:border-primary/60 hover:text-primary'
                    }`}
                  >
                    {String(p + 1).padStart(2, '0')}
                  </button>
                )
              })}
            </div>

            <span className="min-w-20 text-center text-[0.65rem] tracking-[0.18em] text-muted-foreground sm:hidden">
              {String(safePage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
            </span>

            <Button
              variant="outline"
              size="lg"
              onClick={() => goTo(safePage + 1)}
              disabled={safePage >= pageCount - 1}
              className="h-11 min-w-11 justify-self-end gap-2 px-3 font-heading text-xs font-bold tracking-[0.2em] disabled:opacity-30 sm:px-5"
            >
              <span className="hidden sm:inline">SIGUIENTE</span>
              <ChevronRight className="size-4" />
            </Button>
          </motion.div>
        )}

        {/* volver arriba */}
        {safePage > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            className="mx-auto mt-8 flex cursor-pointer items-center gap-2 border border-primary/25 bg-primary/5 px-4 py-2 text-[0.6rem] tracking-[0.25em] text-primary/70 transition-colors hover:border-primary/60 hover:text-primary"
          >
            <ArrowUp className="size-3" />
            VOLVER AL INICIO DEL CATÁLOGO
          </motion.button>
        )}
      </div>

      <BookModal book={active} onSwitch={(next) => setActive(next)} onClose={() => setActive(null)} />
    </section>
  )
}
