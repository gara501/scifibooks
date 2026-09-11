import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Orbit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { id: '01', label: 'CATÁLOGO', href: '#catalogo' },
  { id: '02', label: 'MAPA', href: '#mapa' },
  { id: '03', label: 'SCIFAIKU', href: '#scifaiku' },
  { id: '04', label: 'MANIFIESTO', href: '#manifiesto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navigateTo = (event, href) => {
    event.preventDefault()
    setOpen(false)

    window.setTimeout(() => {
      const target = document.querySelector(href)
      if (!target) return

      const headerOffset = 64
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset
      window.history.pushState(null, '', href)
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }, 260)
  }

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-primary/15 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary">
            <Orbit className="size-5" />
          </span>
          <span className="font-heading text-xs font-bold tracking-[0.24em] text-foreground sm:text-sm sm:tracking-[0.3em]">
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

        <Button className="hidden font-heading text-[0.65rem] tracking-[0.2em] md:inline-flex">
          ACCEDER AL ARCHIVO
        </Button>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="grid size-11 place-items-center border border-primary/35 bg-primary/5 text-primary md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-primary/15 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto grid max-w-7xl px-4 py-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(event) => navigateTo(event, link.href)}
                  className="flex min-h-12 items-center border-b border-primary/10 text-xs tracking-[0.22em] text-foreground last:border-0"
                >
                  <span className="mr-3 text-primary/70">[{link.id}]</span>
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-3 min-h-11 font-heading text-[0.65rem] tracking-[0.18em]">
                <a href="#catalogo" onClick={(event) => navigateTo(event, '#catalogo')}>ACCEDER AL ARCHIVO</a>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
