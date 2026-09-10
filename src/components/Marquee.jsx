import { Sparkle } from 'lucide-react'
import { books } from '@/data/books'

export default function Marquee() {
  const items = [...books, ...books]
  const sample = items.filter((_, i) => i % 10 === 0)

  return (
    <div className="relative z-10 overflow-hidden border-y border-primary/20 bg-primary/[0.04] py-4">
      <div className="flex w-max animate-marquee items-center gap-10 pr-10">
        {sample.map((book, i) => (
          <span
            key={`${book.code}-${i}`}
            className="flex items-center gap-10 text-xs tracking-[0.35em] whitespace-nowrap text-muted-foreground"
          >
            {book.title.toUpperCase()}
            <Sparkle className="size-3.5 text-primary" />
          </span>
        ))}
      </div>
    </div>
  )
}
