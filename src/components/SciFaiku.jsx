import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, RadioTower } from 'lucide-react'

const poems = [
  ['Pasan los milenios', 'y solo miro', 'desde mi frasco.'],
  ['Rompiendo las reglas, clono a mi esposa', 'quizás esta vez mantenga su amor'],
  ['en estos radiactivos', 'páramos de la Tierra…', 'el llanto estridente de un loco'],
  ['criogenia:', 'una ligera escarcha en sus labios'],
  ['emergiendo', 'de nuestro horno secreto:', 'el primer androide de la revolución'],
  ['la nova', 'ahoga todos los gritos', 'en océanos de luz'],
  ['aguas mansas', 'un azulejo de aluminio', 'planea hacia la luz'],
  ['pantanos al anochecer:', 'plataformas de lanzamiento abandonadas', 'en campos de escombros'],
  ['acuñando una palanca', 'contra la galaxia', 'y ganando tiempo'],
  ['rocío', 'tras el cristalino ojo', 'del soldado androide'],
  ['¿qué sucede', 'cuando los fantasmas del fin de los tiempos', 'dan con el camino de regreso al ahora?'],
]

export default function SciFaiku() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  const goTo = (index) => {
    setDirection(index > active ? 1 : -1)
    setActive((index + poems.length) % poems.length)
  }

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const timer = window.setInterval(() => {
      setDirection(1)
      setActive((current) => (current + 1) % poems.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])

  return (
    <section
      id="scifaiku"
      className="relative scroll-mt-24 overflow-hidden border-t border-primary/15 py-24 md:py-32"
      aria-labelledby="scifaiku-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
            <p className="mb-3 flex items-center gap-2 text-[0.65rem] tracking-[0.35em] text-primary">
              <RadioTower className="size-3.5" />
              // TRANSMISIONES BREVES DESDE EL FUTURO
            </p>
            <h2 id="scifaiku-title" className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
              SCIF<span className="text-primary text-glow">AIKU</span>
            </h2>
            </div>
            <p className="pb-1 text-[0.65rem] tracking-[0.25em] text-muted-foreground">
              FRAGMENTO {String(active + 1).padStart(2, '0')} / {String(poems.length).padStart(2, '0')}
            </p>
          </div>

          <div className="mt-8 max-w-3xl border-l border-primary/40 pl-5 md:pl-7">
            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              El SciFaiku toma su forma del haiku internacional contemporáneo. Un poema habitual tiene 3 versos y contiene unas 17 sílabas. El tema es ciencia ficción. Se esfuerza por una franqueza de expresión y belleza en su simplicidad.
            </p>
            <p className="mt-3 text-[0.65rem] tracking-[0.25em] text-primary">
              LOS SIGUIENTES SON DE TOM BRINCK
            </p>
          </div>
        </motion.div>

        <div
          className="relative border border-primary/25 bg-card/55 shadow-[0_0_80px_oklch(0.84_0.165_82/0.07)] backdrop-blur-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <span className="absolute left-0 top-0 h-8 w-px bg-primary" />
          <span className="absolute left-0 top-0 h-px w-8 bg-primary" />
          <span className="absolute bottom-0 right-0 h-8 w-px bg-primary" />
          <span className="absolute bottom-0 right-0 h-px w-8 bg-primary" />

          <div className="grid min-h-[330px] place-items-center overflow-hidden px-8 py-16 text-center md:min-h-[410px] md:px-24">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={active}
                custom={direction}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 70, filter: 'blur(7px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -70, filter: 'blur(7px)' }}
                transition={{ duration: reduceMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
                aria-live="polite"
              >
                {poems[active].map((line, index) => (
                  <span
                    key={line}
                    className={`block font-heading text-xl leading-relaxed font-semibold tracking-tight md:text-3xl md:leading-relaxed ${index === 0 ? 'text-primary text-glow' : 'text-foreground'}`}
                  >
                    {line}
                  </span>
                ))}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-primary/15 px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="grid size-10 place-items-center border border-primary/25 text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Scifaiku anterior"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2" role="group" aria-label="Seleccionar scifaiku">
              {poems.map((poem, index) => (
                <button
                  key={poem[0]}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-1.5 transition-all duration-300 ${index === active ? 'w-7 bg-primary shadow-[0_0_10px_var(--phosphor)]' : 'w-1.5 bg-muted-foreground/35 hover:bg-primary/60'}`}
                  aria-label={`Ir al scifaiku ${index + 1}`}
                  aria-current={index === active ? 'true' : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="grid size-10 place-items-center border border-primary/25 text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Scifaiku siguiente"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
