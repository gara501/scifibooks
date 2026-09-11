import { lazy, Suspense } from 'react'
import Backdrop from '@/components/Backdrop'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Catalog from '@/components/Catalog'
import SciFiGraph from '@/components/SciFiGraph'
import SciFaiku from '@/components/SciFaiku'
import Manifesto from '@/components/Manifesto'
import Footer from '@/components/Footer'
import { Route, Routes } from 'react-router-dom'
const TimeTravel = lazy(() => import('@/pages/TimeTravel'))
const Calculus = lazy(() => import('@/pages/Calculus'))

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <Backdrop />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Catalog />
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timetravel" element={<Suspense fallback={null}><TimeTravel /></Suspense>} />
      <Route path="/calculus" element={<Suspense fallback={null}><Calculus /></Suspense>} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
