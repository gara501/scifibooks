import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Orbit, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const links = [
  { id: '01', label: 'NAVEGANTE', detail: 'Catálogo de libros', href: '/#navegante' },
  { id: '02', label: 'MAPA', detail: 'Mapa de subgéneros', href: '/#mapa' },
  { id: '03', label: 'SCIFAIKU', detail: 'Oráculo literario', href: '/#scifaiku' },
  { id: '04', label: 'TIEMPO', detail: 'Cronología del género', href: '/timetravel' },
  { id: '05', label: 'CÁLCULO', detail: 'Simuladores de física', href: '/calculus' },
  { id: '06', label: 'INFLUENCIAS', detail: 'Red de obras y autores', href: '/influencias' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

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
        <Link to="/" onClick={() => setOpen(false)} className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary">
            <Orbit className="size-5" />
          </span>
          <span className="font-heading text-xs font-bold tracking-[0.24em] text-foreground sm:text-sm sm:tracking-[0.3em]">
            SCIFI<span className="text-primary text-glow">UNIVERSE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex xl:gap-5">
          {links.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              title={`${link.label}: ${link.detail}`}
              aria-label={`${link.label}: ${link.detail}`}
              className="group flex flex-col gap-0.5 text-[0.58rem] tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary xl:text-[0.65rem]"
            >
              <span><span className="mr-1.5 text-primary/60">[{link.id}]</span>{link.label}</span>
              <span className="pl-6 text-[0.45rem] tracking-[0.08em] text-muted-foreground/70 xl:text-[0.5rem]">{link.detail.toUpperCase()}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="grid size-11 place-items-center border border-primary/35 bg-primary/5 text-primary lg:hidden"
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
            className="overflow-hidden border-t border-primary/15 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.id}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center border-b border-primary/10 text-xs tracking-[0.22em] text-foreground last:border-0"
                >
                  <span className="mr-3 text-primary/70">[{link.id}]</span>
                  <span className="flex flex-col gap-1 py-2">
                    <span>{link.label}</span>
                    <span className="text-[0.55rem] tracking-[0.12em] text-muted-foreground">{link.detail.toUpperCase()}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
