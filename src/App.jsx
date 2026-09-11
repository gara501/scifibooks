import { lazy, Suspense, useEffect } from 'react'
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

function RouteScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) {
          const targetTop = target.getBoundingClientRect().top + window.scrollY - 64
          window.scrollTo({ top: targetTop, behavior: 'smooth' })
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
  return (
    <>
      <Soundscape />
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timetravel" element={<Suspense fallback={null}><TimeTravel /></Suspense>} />
        <Route path="/calculus" element={<Suspense fallback={null}><Calculus /></Suspense>} />
        <Route path="/influencias" element={<Suspense fallback={null}><Influences /></Suspense>} />
        <Route path="/navegante" element={<Navigate to="/#navegante" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
