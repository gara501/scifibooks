import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Manifesto() {
  return (
    <section id="manifiesto" className="relative scroll-mt-20 border-y border-primary/15 bg-card/30 py-16 md:scroll-mt-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 grid size-14 place-items-center border border-primary/40 bg-primary/10 text-primary"
        >
          <Quote className="size-6" />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-heading text-xl leading-snug font-bold tracking-tight sm:text-2xl md:text-4xl">
            “LA CIENCIA FICCIÓN NO PREDICE EL FUTURO.
            <span className="mt-2 block text-primary text-glow">LO ENSAYA.”</span>
          </p>
          <footer className="mt-8 text-[0.65rem] tracking-[0.35em] text-muted-foreground">
            — BITÁCORA DE LA ESTACIÓN K-7, CICLO 2187
          </footer>
        </motion.blockquote>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Separator className="mx-auto mt-12 w-40 bg-primary/30" />
        </motion.div>
      </div>
    </section>
  )
}
