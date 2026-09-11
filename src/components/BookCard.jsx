import { motion } from 'motion/react'
import { BookOpen, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 24, transition: { duration: 0.3 } },
}

export default function BookCard({ book, index, onOpen }) {
  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={{ delay: (index % 4) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir expediente de ${book.title}`}
        className="block w-full cursor-pointer rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
      >
        <Card className="gap-0 overflow-hidden border-primary/15 bg-card/70 py-0 transition-colors duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_50px_oklch(0.84_0.165_82/10%)]">
          {/* portada */}
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[2/3]">
            <img
              src={book.cover}
              alt={`Ilustración de ${book.title}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-background/40" />

            <span className="absolute top-3 left-3 border border-primary/30 bg-background/70 px-2 py-0.5 text-[0.6rem] tracking-[0.25em] text-primary backdrop-blur-sm sm:top-4 sm:left-4">
              {book.code}
            </span>
            <span className="absolute top-3 right-3 border border-foreground/15 bg-background/70 px-2 py-0.5 text-[0.6rem] tracking-[0.25em] text-foreground/70 backdrop-blur-sm sm:top-4 sm:right-4">
              {book.year}
            </span>

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-4">
              <p className="font-heading text-sm leading-snug font-bold tracking-wide text-foreground uppercase">
                {book.title}
              </p>
              <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-foreground/60 uppercase">
                {book.author}
              </p>
            </div>

            {/* overlay hover */}
            <div className="absolute inset-0 hidden flex-col items-center justify-center gap-5 bg-background/85 p-5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
              <p className="line-clamp-4 border-l-2 border-primary pl-3 text-xs leading-relaxed text-muted-foreground italic">
                “{book.desc}”
              </p>
              <span className="flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 font-heading text-[0.6rem] font-bold tracking-[0.25em] text-primary">
                <BookOpen className="size-3.5" />
                ABRIR EXPEDIENTE
              </span>
            </div>
          </div>

          {/* metadatos */}
          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className="border-signal/40 bg-signal/5 text-[0.6rem] tracking-[0.2em] text-signal"
              >
                {book.tag.split('/')[0].trim().toUpperCase()}
              </Badge>
              <span className="flex items-center gap-1 text-[0.6rem] tracking-[0.2em] text-muted-foreground">
                <Users className="size-3 text-primary/60" />
                {book.chars.length}
              </span>
            </div>
          </div>
        </Card>
      </button>
    </motion.article>
  )
}
