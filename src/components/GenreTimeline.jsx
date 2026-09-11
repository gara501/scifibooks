import { motion } from 'motion/react'
import { ArrowLeft, Clock3, Orbit, RadioTower } from 'lucide-react'
import { timelineEvents } from '@/data/timeline'

export default function GenreTimeline() {
  return (
    <main className="relative z-10 overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 inline-flex min-h-11 items-center gap-2 border border-primary/25 bg-primary/5 px-4 text-[0.62rem] tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> VOLVER AL ARCHIVO
        </motion.a>

        <motion.header
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-16 border-b border-primary/20 pb-12 md:mb-24 md:pb-16"
        >
          <p className="mb-4 flex items-center gap-2 text-[0.62rem] tracking-[0.3em] text-primary">
            <RadioTower className="size-4" /> // CRONOLOGÍA DE TRANSMISIONES
          </p>
          <h1 className="max-w-5xl font-heading text-[clamp(2.2rem,7vw,5.8rem)] leading-[0.98] font-extrabold tracking-tight">
            HISTORIA DE LA <span className="text-primary text-glow">CIENCIA FICCIÓN</span>
          </h1>
          <div className="mt-8 flex max-w-3xl items-start gap-4 border-l border-primary/40 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
            <Clock3 className="mt-1 size-5 shrink-0 text-primary" />
            <p>Dos siglos de mutaciones del género: de la vida artificial de Mary Shelley a los futuros sostenibles y la nueva épica galáctica.</p>
          </div>
        </motion.header>

        <ol className="relative mx-auto max-w-6xl before:absolute before:bottom-0 before:left-[1.35rem] before:top-0 before:w-px before:bg-gradient-to-b before:from-primary before:via-primary/35 before:to-transparent md:before:left-1/2">
          {timelineEvents.map((event, index) => {
            const right = index % 2 === 0
            return (
              <motion.li
                key={`${event.era}-${event.title}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={`relative mb-10 grid pl-16 md:mb-14 md:grid-cols-2 md:pl-0 ${right ? '' : ''}`}
              >
                <span className="absolute left-0 top-5 grid size-11 place-items-center border border-primary/50 bg-background font-heading text-[0.58rem] font-bold text-primary shadow-[0_0_22px_oklch(0.84_0.165_82/18%)] md:left-1/2 md:-translate-x-1/2">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className={`${right ? 'md:col-start-2 md:pl-12' : 'md:col-start-1 md:row-start-1 md:pr-12 md:text-right'}`}>
                  <article className="group relative border border-primary/18 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/45 sm:p-6 md:p-7">
                    <span className={`absolute top-8 hidden h-px w-12 bg-primary/35 md:block ${right ? '-left-12' : '-right-12'}`} />
                    <p className="mb-3 font-heading text-xs font-bold tracking-[0.24em] text-primary">{event.era}</p>
                    <h2 className="font-heading text-lg leading-snug font-bold text-foreground sm:text-xl">{event.title}</h2>
                    <p className="mt-3 text-[0.68rem] leading-relaxed tracking-[0.12em] text-signal">{event.keyWork}</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{event.description}</p>
                  </article>
                </div>
              </motion.li>
            )
          })}
        </ol>

        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-3 border-t border-primary/15 pt-12 text-[0.62rem] tracking-[0.24em] text-primary">
          <Orbit className="size-4" /> FIN DE LA LÍNEA REGISTRADA
        </div>
      </section>
    </main>
  )
}
