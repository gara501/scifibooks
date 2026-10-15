import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Dialog } from 'radix-ui'
import { BookOpen, BookMarked, Calculator, GitCompareArrows, Map, Menu, Network, Orbit, Radio, Sparkles, Timer, X, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useVisitStreak } from '@/lib/visitStreak'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'

const groups = [
  { label: 'Biblioteca', detail: 'Encuentra tu próxima lectura', links: [
    { label: 'Catálogo', detail: 'Todos los libros del archivo estelar.', href: '/#navegante', icon: BookOpen },
    { label: 'Comparador', detail: 'Dos libros frente a frente para decidir.', href: '/comparar', icon: GitCompareArrows },
  ] },
  { label: 'Explorar', detail: 'Conecta obras, ideas y épocas', links: [
    { label: 'Mapa de subgéneros', detail: 'Recorre las regiones de la ciencia ficción.', href: '/#mapa', icon: Map },
    { label: 'Red de influencias', detail: 'Descubre conexiones entre obras y autores.', href: '/influencias', icon: Network },
    { label: 'Cronología', detail: 'Viaja por la historia del género.', href: '/timetravel', icon: Timer },
  ] },
  { label: 'Experiencias', detail: 'Juega con la ciencia y la imaginación', links: [
    { label: 'Diario', detail: 'Descifra la transmisión literaria del día.', href: '/diario', icon: Radio },
    { label: 'Scifaiku', detail: 'Consulta el oráculo de poesía espacial.', href: '/#scifaiku', icon: Sparkles },
    { label: 'Simuladores', detail: 'Experimenta con la física de otros mundos.', href: '/calculus', icon: Calculator },
  ] },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [desktopMenu, setDesktopMenu] = useState('')
  const location = useLocation()
  const visit = useVisitStreak()
  const isActive = (href) => `${location.pathname}${location.hash}` === href
  const closeMenus = () => { setOpen(false); setDesktopMenu('') }

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const resetMenus = () => { setOpen(false); setDesktopMenu('') }
    desktop.addEventListener('change', resetMenus)
    return () => desktop.removeEventListener('change', resetMenus)
  }, [])

  return <motion.header initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-0 z-50 border-b border-primary/15 bg-background/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link to="/" onClick={closeMenus} aria-label="SCIFIUNIVERSE · Inicio" className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-primary">
        <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary"><Orbit className="size-5" aria-hidden="true" /></span>
        <span className="font-heading text-xs font-bold tracking-[0.16em] text-foreground sm:text-sm sm:tracking-[0.22em]">SCIFI<span className="text-primary text-glow">UNIVERSE</span></span>
      </Link>
      <NavigationMenu aria-label="Navegación principal" value={desktopMenu} onValueChange={setDesktopMenu} className="hidden lg:block">
        <NavigationMenuList>
          {groups.map((group) => <NavigationMenuItem key={group.label} value={group.label}>
            <NavigationMenuTrigger className={group.links.some((link) => isActive(link.href)) ? 'text-primary' : ''}>{group.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <p className="border-b border-primary/15 px-3 pb-3 pt-2 text-[0.6rem] uppercase tracking-[0.16em] text-primary">{group.detail}</p>
              <ul className="mt-2 space-y-1">{group.links.map(({ icon: Icon, ...link }) => <li key={link.href}>
                <NavigationMenuLink asChild active={isActive(link.href)}>
                  <Link to={link.href} onClick={closeMenus} className="group flex items-start gap-3 p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md border border-primary/20 bg-primary/5 text-primary"><Icon size={18} aria-hidden="true" /></span>
                    <span className="flex-1"><span className="block text-sm font-bold text-foreground">{link.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{link.detail}</span></span>
                    <ArrowUpRight size={14} aria-hidden="true" className="mt-1 text-primary/40 transition-colors group-hover:text-primary" />
                  </Link>
                </NavigationMenuLink>
              </li>)}</ul>
            </NavigationMenuContent>
          </NavigationMenuItem>)}
          <NavigationMenuItem className="ml-3 border-l border-primary/20 pl-4">
            <NavigationMenuLink asChild active={isActive('/bitacora')}><Link to="/bitacora" onClick={closeMenus} className="inline-flex min-h-11 items-center gap-2 border border-primary/25 bg-primary/5 px-4 text-xs text-primary"><BookMarked size={15} aria-hidden="true" /> Mi bitácora{visit.streak > 0 && <span className="ml-1 text-[0.6rem] text-muted-foreground" aria-label={`Racha de ${visit.streak} días`}>✦ {visit.streak}d</span>}</Link></NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild><button type="button" aria-label="Abrir menú" className="grid size-11 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/5 text-primary focus-visible:outline-2 focus-visible:outline-primary lg:hidden"><Menu size={20} aria-hidden="true" /></button></Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" />
          <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-primary/25 bg-background shadow-2xl outline-none">
            <div className="flex min-h-16 shrink-0 items-center justify-between border-b border-primary/20 px-5"><Dialog.Title className="font-heading text-sm font-bold tracking-[0.12em] text-primary">EXPLORA EL ARCHIVO</Dialog.Title><Dialog.Close asChild><button type="button" aria-label="Cerrar menú" className="grid size-11 place-items-center rounded-md text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"><X size={20} aria-hidden="true" /></button></Dialog.Close></div>
            <nav aria-label="Navegación móvil" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {groups.map((group) => <section key={group.label} className="mb-6 last:mb-0"><h2 className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{group.label}</h2><ul className="space-y-1">{group.links.map(({ icon: Icon, ...link }) => <li key={link.href}><Link to={link.href} aria-current={isActive(link.href) ? 'page' : undefined} onClick={closeMenus} className="flex min-h-12 items-center gap-3 rounded-md px-3 py-3 text-sm text-foreground transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"><Icon size={17} className="shrink-0 text-primary/80" aria-hidden="true" />{link.label}</Link></li>)}</ul></section>)}
            </nav>
            <div className="shrink-0 border-t border-primary/20 p-5"><Link to="/bitacora" onClick={closeMenus} aria-current={isActive('/bitacora') ? 'page' : undefined} className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/35 bg-primary/10 px-4 text-sm text-primary focus-visible:outline-2 focus-visible:outline-primary"><BookMarked size={17} aria-hidden="true" /> Mi bitácora{visit.streak > 0 && <span className="ml-2 text-xs" aria-label={`Racha de ${visit.streak} días`}>✦ {visit.streak}d</span>}</Link></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  </motion.header>
}
