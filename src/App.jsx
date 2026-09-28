import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Backdrop from '@/components/Backdrop'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Navigator from '@/pages/Navigator'
import SciFiGraph from '@/components/SciFiGraph'
import SciFaiku from '@/components/SciFaiku'
import Manifesto from '@/components/Manifesto'
import Footer from '@/components/Footer'
import Soundscape from '@/components/Soundscape'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
const TimeTravel = lazy(() => import('@/pages/TimeTravel'))
const Calculus = lazy(() => import('@/pages/Calculus'))
const Influences = lazy(() => import('@/pages/Influences'))
const BookPage = lazy(() => import('@/pages/BookPage'))
const BookRouteModal = lazy(() => import('@/pages/BookPage').then((module) => ({ default: module.BookRouteModal })))
const Bitacora = lazy(() => import('@/pages/Bitacora'))

const routeMeta = {
  '/': ['SCIFIUNIVERSE — Archivo Estelar', 'Archivo orbital de ciencia ficción: explora 100 volúmenes y sus universos.'],
  '/timetravel': ['Cronología — SCIFIUNIVERSE', 'Recorre la historia y las épocas de la ciencia ficción.'],
  '/calculus': ['Simuladores — SCIFIUNIVERSE', 'Calcula gravedad rotacional, dilatación temporal y escala de Kardashev.'],
  '/influencias': ['Red de influencias — SCIFIUNIVERSE', 'Explora conexiones entre obras y autores de ciencia ficción.'],
  '/diario': ['Diario — SCIFIUNIVERSE', 'Descifra la transmisión literaria del día desde la estación K-7.'],
  '/bitacora': ['Bitácora — SCIFIUNIVERSE', 'Registra tus lecturas y tu rumbo por el archivo estelar.'],
}

function RouteMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/libro/')) return
    const [title, description] = routeMeta[pathname] || routeMeta['/']
    const url = `${window.location.origin}${pathname}`
    document.title = title
    const set = (selector, attribute, value, create) => {
      let node = document.head.querySelector(selector)
      if (!node) {
        node = document.createElement(create)
        if (selector.includes('property=')) node.setAttribute('property', selector.match(/property="([^"]+)/)[1])
        if (selector.includes('name=')) node.setAttribute('name', selector.match(/name="([^"]+)/)[1])
        if (create === 'link') node.rel = 'canonical'
        document.head.appendChild(node)
      }
      node.setAttribute(attribute, value)
    }
    set('meta[name="description"]', 'content', description, 'meta')
    set('meta[property="og:title"]', 'content', title, 'meta')
    set('meta[property="og:description"]', 'content', description, 'meta')
    set('meta[property="og:image"]', 'content', `${window.location.origin}/og/site.png`, 'meta')
    set('meta[property="og:url"]', 'content', url, 'meta')
    set('meta[name="twitter:card"]', 'content', 'summary_large_image', 'meta')
    set('link[rel="canonical"]', 'href', url, 'link')
    return undefined
  }, [pathname])
  return null
}

function RouteScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) {
          const targetTop = target.getBoundingClientRect().top + window.scrollY - 64
          window.scrollTo({ top: targetTop, behavior: reduceMotion ? 'instant' : 'smooth' })
          return
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <Backdrop />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Navigator />
        <SciFiGraph />
        <SciFaiku />
        <Manifesto />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const backgroundLocation = location.state?.background
  return (
    <MotionConfig reducedMotion="user">
      <Soundscape />
      <RouteMetadata />
      <RouteScrollManager />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/timetravel" element={<Suspense fallback={null}><TimeTravel /></Suspense>} />
        <Route path="/calculus" element={<Suspense fallback={null}><Calculus /></Suspense>} />
        <Route path="/influencias" element={<Suspense fallback={null}><Influences /></Suspense>} />
        <Route path="/libro/:slug" element={<Suspense fallback={null}><BookPage /></Suspense>} />
        <Route path="/bitacora" element={<Suspense fallback={null}><Bitacora /></Suspense>} />
        <Route path="/navegante" element={<Navigate to="/#navegante" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {backgroundLocation && <Routes><Route path="/libro/:slug" element={<Suspense fallback={null}><BookRouteModal /></Suspense>} /></Routes>}
    </MotionConfig>
  )
}


export default App
