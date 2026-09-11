import Backdrop from '@/components/Backdrop'
import Navbar from '@/components/Navbar'
import GenreTimeline from '@/components/GenreTimeline'
import Footer from '@/components/Footer'

export default function TimeTravel() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <Backdrop />
      <Navbar />
      <GenreTimeline />
      <div className="relative z-10"><Footer /></div>
    </div>
  )
}
