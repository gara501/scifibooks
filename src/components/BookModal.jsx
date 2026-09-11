import { AnimatePresence, motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import { X, CalendarDays, User, Tag, Users, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { books } from '@/data/books'

const panel = {
  hidden: { opacity: 0, y: 72, scale: 0.93 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 230,
      damping: 26,
      mass: 0.9,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: { opacity: 0, y: 48, scale: 0.95, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const charContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const charItem = {
  hidden: { opacity: 0, x: -14, filter: 'blur(4px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export default function BookModal({ book, onSwitch, onClose }) {
  const related = book
    ? books.filter((b) => b.tag === book.tag && b.code !== book.code).slice(0, 3)
    : []

  return (
    <Dialog.Root open={!!book} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {book && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                variants={panel}
                initial="hidden"
                animate="show"
                exit="exit"
                onClick={(e) => e.target === e.currentTarget && onClose()}
                className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto pt-12 outline-none sm:items-center sm:p-4 md:p-8"
              >
                <div className="relative w-full max-w-3xl overflow-y-auto rounded-t-xl border border-primary/30 bg-card shadow-[0_0_90px_oklch(0.84_0.165_82/18%)] max-sm:max-h-[calc(100dvh-3rem)] sm:my-auto sm:rounded-xl">
                  <div className="grid md:grid-cols-[240px_1fr]">
                    {/* columna izquierda: portada grande */}
                    <div className="relative h-44 shrink-0 sm:h-56 md:h-auto">
                      <motion.img
                        src={book.cover}
                        alt={`Ilustración de ${book.title}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card md:bg-gradient-to-b md:from-transparent md:via-transparent md:to-card/60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent md:bg-none" />

                      <span className="absolute top-4 left-4 border border-primary/40 bg-background/70 px-2.5 py-1 text-[0.65rem] tracking-[0.3em] text-primary backdrop-blur-sm">
                        {book.code}
                      </span>

                      <Dialog.Close asChild>
                        <motion.button
                          whileHover={{ rotate: 90, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                          aria-label="Cerrar expediente"
                          className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center border border-primary/40 bg-background/80 text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground sm:top-4 sm:right-4 sm:size-9"
                        >
                          <X className="size-4" />
                        </motion.button>
                      </Dialog.Close>
                    </div>

                    {/* columna derecha: expediente */}
                    <div className="space-y-4 p-4 sm:space-y-5 sm:p-6 md:p-8">
                      <motion.div variants={item} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.65rem] tracking-[0.25em] text-muted-foreground">
                        <Badge
                          variant="outline"
                          className="border-signal/40 bg-signal/5 text-[0.6rem] tracking-[0.2em] text-signal"
                        >
                          <Tag className="size-3" />
                          {book.tag.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1.5">
                          <User className="size-3 text-primary/70" />
                          {book.author.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3 text-primary/70" />
                          {book.year}
                        </span>
                      </motion.div>

                      <motion.div variants={item}>
                        <Dialog.Title asChild>
                          <h3 className="font-heading text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                            {book.title}
                          </h3>
                        </Dialog.Title>
                      </motion.div>

                      <motion.div variants={item}>
                        <Separator className="bg-primary/25" />
                      </motion.div>

                      <motion.p variants={item} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        {book.desc}
                      </motion.p>

                      {/* tripulación / personajes */}
                      <motion.div variants={item}>
                        <p className="mb-3 flex items-center gap-2 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
                          <Users className="size-3 text-primary/70" />
                          TRIPULACIÓN ({book.chars.length})
                        </p>
                        <motion.ul variants={charContainer} className="space-y-1.5">
                          {book.chars.map((c) => (
                            <motion.li
                              key={c}
                              variants={charItem}
                              className="flex items-center gap-2.5 border-l border-primary/40 bg-primary/[0.04] py-1 pl-3 text-xs text-foreground/85"
                            >
                              <ChevronRight className="size-3 shrink-0 text-primary/60" />
                              {c}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </motion.div>

                      {/* registros relacionados */}
                      {related.length > 0 && (
                        <motion.div variants={item}>
                          <p className="mb-3 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
                            REGISTROS RELACIONADOS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {related.map((r) => (
                              <button
                                key={r.code}
                                type="button"
                                onClick={() => onSwitch(r)}
                                className="cursor-pointer border border-signal/30 bg-signal/5 px-3 py-1.5 text-[0.6rem] tracking-[0.15em] text-signal transition-colors hover:bg-signal hover:text-background"
                              >
                                {r.title.length > 28 ? `${r.title.slice(0, 26)}…` : r.title}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <motion.div variants={item} className="flex items-center justify-between pt-2">
                        <Dialog.Close asChild>
                          <Button className="min-h-11 w-full font-heading text-[0.65rem] font-bold tracking-[0.18em] sm:w-auto sm:tracking-[0.2em]">
                            CERRAR EXPEDIENTE
                          </Button>
                        </Dialog.Close>
                        <span className="hidden text-[0.6rem] tracking-[0.25em] text-muted-foreground sm:block">
                          [ESC] PARA SALIR
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
