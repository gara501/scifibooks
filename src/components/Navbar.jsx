import { motion } from 'motion/react'
import { Orbit } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { id: '01', label: 'CATÁLOGO', href: '#catalogo' },
  { id: '02', label: 'MAPA', href: '#mapa' },
  { id: '03', label: 'SCIFAIKU', href: '#scifaiku' },
  { id: '04', label: 'MANIFIESTO', href: '#manifiesto' },
]

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-primary/15 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary">
            <Orbit className="size-5" />
          </span>
          <span className="font-heading text-sm font-bold tracking-[0.3em] text-foreground">
            SCIFI<span className="text-primary text-glow">BOOKS</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="group text-xs tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="mr-1.5 text-primary/60">[{link.id}]</span>
              {link.label}
            </a>
          ))}
        </nav>

        <Button className="font-heading text-[0.65rem] tracking-[0.2em]">
          ACCEDER AL ARCHIVO
        </Button>
      </div>
    </motion.header>
  )
}
