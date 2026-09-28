import { Link } from 'react-router-dom'
import { Orbit, RadioTower } from 'lucide-react'
import { getHomeTransmission, todayInBogota } from '@/lib/dailyTransmission'
import { poems } from '@/components/SciFaiku'

export default function HomeTransmission() {
  const transmission = getHomeTransmission(todayInBogota())
  if (!transmission) return null
  const poemId = 'poem-' + String(transmission.day % poems.length + 1).padStart(2, '0')
  return <section className="relative z-10 border-y border-primary/20 bg-card/40 py-8"><div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2"><Link to={'/libro/' + transmission.book.slug} className="group border border-primary/25 p-5 hover:border-primary/60"><p className="flex items-center gap-2 text-[0.58rem] tracking-[0.2em] text-primary"><Orbit size={14} /> TRANSMISIÓN ORBITAL DEL DÍA</p><h2 className="mt-3 font-heading text-xl font-bold group-hover:text-primary">{transmission.book.title}</h2><p className="mt-2 text-xs text-muted-foreground">{transmission.book.author} · {transmission.book.year}</p></Link><Link to={'/#scifaiku-' + poemId} className="border border-signal/25 p-5 hover:border-signal/60"><p className="flex items-center gap-2 text-[0.58rem] tracking-[0.2em] text-signal"><RadioTower size={14} /> FRAGMENTO SCIFAIKU</p>{poems[transmission.day % poems.length].map((line) => <span key={line} className="mt-2 block text-sm">{line}</span>)}</Link></div></section>
}
