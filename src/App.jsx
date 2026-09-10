import Backdrop from '@/components/Backdrop'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Catalog from '@/components/Catalog'
import SciFiGraph from '@/components/SciFiGraph'
import SciFaiku from '@/components/SciFaiku'
import Manifesto from '@/components/Manifesto'
import Footer from '@/components/Footer'

function App() {
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

export default App
