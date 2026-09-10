import { motion } from 'motion/react'
import { Rocket, Radio, SatelliteDish } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

const reveal = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const logLines = [
  '> escaneando sector 7G ...',
  '> 3 señales nuevas detectadas',
  '> descifrando: DUNE [HERBERT, F.]',
  '> integridad del archivo: 99.7%',
]

const stats = [
  { value: '100', label: 'VOLÚMENES' },
  { value: '142', label: 'MUNDOS MAPEADOS' },
  { value: '09', label: 'SEÑALES ACTIVAS' },
  { value: '99.7%', label: 'INTEGRIDAD' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.35fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={fade} className="mb-8 flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/5 px-3 py-1 text-[0.65rem] tracking-[0.3em] text-primary"
            >
              <SatelliteDish className="size-3.5" />
              TRANSMISIÓN ENTRANTE
            </Badge>
            <span className="text-[0.65rem] tracking-[0.3em] text-muted-foreground">
              // SECTOR 7G · ÓRBITA K-7
            </span>
          </motion.div>

          <h1 className="font-heading text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={reveal} className="block">
                LA BIBLIOTECA
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span variants={reveal} className="block">
                AL FINAL DE
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={reveal} className="block text-primary text-glow animate-flicker">
                LA GALAXIA
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            100 volúmenes de ciencia ficción catalogados desde la estación orbital.
            Cada señal interceptada es un mundo; cada mundo, un libro esperando
            ser abierto.
            <span className="ml-2 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-primary" />
          </motion.p>

          <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-12 px-7 font-heading text-xs font-bold tracking-[0.2em]">
              <a href="#catalogo">
                <Rocket className="size-4" />
                EXPLORAR CATÁLOGO
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 font-heading text-xs font-bold tracking-[0.2em] hover:text-primary"
            >
              <a href="#manifiesto">
                <Radio className="size-4" />
                SEÑALES ACTIVAS
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* terminal de registro */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          {/* anillo orbital */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
            className="absolute -top-14 -right-10 size-40 rounded-full border border-dashed border-primary/30"
          >
            <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_oklch(0.84_0.165_82/80%)]" />
          </motion.div>

          <div className="relative border border-primary/25 bg-card/80 shadow-[0_0_60px_oklch(0.84_0.165_82/8%)]">
            <div className="flex items-center justify-between border-b border-primary/20 px-5 py-3">
              <span className="text-[0.65rem] tracking-[0.3em] text-primary">
                REGISTRO DE TRANSMISIÓN
              </span>
              <div className="flex gap-1.5">
                <span className="size-2 rounded-full bg-primary/80" />
                <span className="size-2 rounded-full bg-primary/40" />
                <span className="size-2 rounded-full bg-primary/20" />
              </div>
            </div>
            <div className="space-y-3 px-5 py-6 text-xs text-muted-foreground">
              {logLines.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.55 }}
                >
                  <span className="text-primary/70">{line.slice(0, 1)}</span>
                  {line.slice(1)}
                </motion.p>
              ))}
              <p className="text-primary">
                {'> '}<span className="inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-primary" />
              </p>
            </div>
            <div className="border-t border-primary/20 px-5 py-3 text-[0.6rem] tracking-[0.25em] text-muted-foreground">
              ENLACE: ESTABLE · CIFRADO: AES-4096 · LAT 0.42s
            </div>
          </div>
        </motion.div>
      </div>

      {/* estadísticas */}
      <motion.dl
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-20 grid max-w-7xl grid-cols-2 border-y border-primary/15 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col border-primary/15 px-6 py-8 not-last:border-r max-md:nth-[2]:border-r-0 max-md:nth-[3]:border-t max-md:nth-[3]:border-r max-md:nth-[4]:border-t max-md:nth-[4]:border-r-0"
          >
            <dd className="order-1 font-heading text-3xl font-bold text-primary text-glow md:text-4xl">
              {stat.value}
            </dd>
            <dt className="order-2 mt-2 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
              {stat.label}
            </dt>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}
