import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Radio, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Backdrop from '@/components/Backdrop'
import Footer from '@/components/Footer'
import BookModal from '@/components/BookModal'
import { books } from '@/data/books'
import { edges } from '@/utils/influences'

function Meta({ book }) {
  useEffect(() => {
    if (!book) return undefined
    const origin = window.location.origin
    const url = `${origin}/libro/${book.slug}`
    const description = `${book.author} · ${book.year} · ${book.tag}. ${book.desc}`
    const entries = {
      title: `${book.title} — ${book.code} | SCIFIUNIVERSE`,
      description,
      'og:title': `${book.title} — ${book.code}`,
      'og:description': description,
      'og:image': `${origin}/og/${book.slug}.png`,
      'og:url': url,
      'twitter:card': 'summary_large_image',
      canonical: url,
    }
    for (const [key, content] of Object.entries(entries)) {
      const isCanonical = key === 'canonical'
      const selector = isCanonical ? 'link[rel="canonical"]' : key === 'title' ? 'title' : `meta[property="${key}"],meta[name="${key}"]`
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement(isCanonical ? 'link' : key === 'title' ? 'title' : 'meta')
        if (isCanonical) element.rel = 'canonical'
        else if (key !== 'title') (key.startsWith('og:') ? element.setAttribute('property', key) : element.setAttribute('name', key))
        document.head.appendChild(element)
      }
      if (isCanonical) element.href = content
      else if (key === 'title') element.textContent = content
      else element.content = content
    }
    return undefined
  }, [book])
  return null
}

export function BookRouteModal() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const book = books.find((item) => item.slug === slug)
  return <><Meta book={book} /><BookModal book={book} onSwitch={(next) => navigate(`/libro/${next.slug}`, { replace: true, state: location.state })} onClose={() => navigate(-1)} /></>
}

export default function BookPage() {
  const { slug } = useParams()
  const book = books.find((item) => item.slug === slug)
  const relatedCodes = new Set(edges.flatMap((edge) => edge.source === book?.code ? [edge.target] : edge.target === book?.code ? [edge.source] : []))
  const related = book ? books.filter((item) => item.code !== book.code).map((item) => ({ item, score: (item.tag === book.tag ? 5 : item.tag.split(' / ')[0] === book.tag.split(' / ')[0] ? 2 : 0) + (relatedCodes.has(item.code) ? 4 : 0) - Math.abs(item.year - book.year) / 100 })).sort((a, b) => b.score - a.score).slice(0, 4).map(({ item }) => item) : []

  if (!book) return <main className="grid min-h-screen place-items-center bg-background px-5 text-center text-foreground"><div><p className="text-[0.65rem] tracking-[0.3em] text-primary">ESTACIÓN K-7 // ARCHIVO</p><h1 className="mt-5 font-heading text-3xl font-black">Volumen no encontrado en el archivo</h1><Link className="mt-7 inline-flex min-h-11 items-center gap-2 border border-primary/40 px-4 text-xs text-primary" to="/#navegante"><ArrowLeft size={16} /> VOLVER AL CATÁLOGO</Link></div></main>

  return <div className="relative min-h-screen overflow-x-clip bg-background text-foreground"><Meta book={book} /><Backdrop /><Navbar /><main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28"><Link to="/#navegante" className="inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.16em] text-primary"><ArrowLeft size={16} /> VOLVER AL ARCHIVO</Link><article className="mt-6 grid overflow-hidden border border-primary/25 bg-card/70 md:grid-cols-[minmax(260px,0.8fr)_1.2fr]"><div className="relative min-h-64 sm:min-h-96"><img src={book.cover} alt={`Portada de ${book.title}`} className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" /><span className="absolute left-4 top-4 border border-primary/50 bg-background/80 px-3 py-2 text-xs tracking-[0.2em] text-primary">{book.code}</span></div><div className="p-5 sm:p-8 lg:p-10"><p className="text-[0.65rem] tracking-[0.2em] text-signal">{book.tag.toUpperCase()}</p><h1 className="mt-4 font-heading text-3xl font-black leading-tight sm:text-4xl">{book.title}</h1><p className="mt-3 text-xs tracking-[0.16em] text-muted-foreground">{book.author} · {book.year}</p><p className="mt-6 text-sm leading-7 text-muted-foreground">{book.desc}</p><h2 className="mt-8 flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-primary"><Users size={15} /> TRIPULACIÓN REGISTRADA</h2><ul className="mt-3 grid gap-2 sm:grid-cols-2">{book.chars.map((character) => <li key={character} className="border-l border-primary/40 bg-primary/[0.04] px-3 py-2 text-xs">{character}</li>)}</ul>{relatedCodes.size > 0 && <Link to={`/influencias?book=${book.code}`} className="mt-7 inline-flex min-h-11 items-center gap-2 border border-signal/40 px-4 text-[0.65rem] tracking-[0.12em] text-signal"><Radio size={15} /> VER EN LA RED DE INFLUENCIAS</Link>}</div></article><section className="mt-12"><p className="text-[0.6rem] tracking-[0.24em] text-primary">// EN LA MISMA ÓRBITA</p><h2 className="mt-2 font-heading text-2xl font-bold">LIBROS RELACIONADOS</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.code} to={`/libro/${item.slug}`} className="group border border-primary/20 bg-card/60 p-4 hover:border-primary/60"><span className="text-[0.58rem] tracking-[0.15em] text-primary">{item.code} · {item.year}</span><h3 className="mt-3 font-heading text-sm font-bold leading-snug group-hover:text-primary">{item.title}</h3><p className="mt-2 text-xs text-muted-foreground">{item.author}</p></Link>)}</div></section></main><Footer /></div>
}
