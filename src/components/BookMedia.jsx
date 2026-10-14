import { useState } from 'react'
import { ExternalLink, Play, Radio } from 'lucide-react'
import { getBookMediaUrl, getTikTokEmbedUrl } from '@/lib/bookMedia'

function MediaItem({ entry }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const embedUrl = getTikTokEmbedUrl(entry.url)
  return (
    <li className="min-w-0 border border-signal/25 bg-signal/[0.04] p-3">
      <p className="text-sm font-bold leading-5 text-foreground">{entry.title}</p>
      {entry.creator && <p className="mt-1 text-xs text-muted-foreground">{entry.creator}</p>}
      {embedUrl && (showPlayer ? (
        <iframe
          src={embedUrl}
          title={entry.title}
          loading="lazy"
          allow="fullscreen; encrypted-media"
          allowFullScreen
          className="mx-auto mt-3 aspect-[9/16] w-full max-w-80 border-0 bg-black"
        />
      ) : (
        <button type="button" onClick={() => setShowPlayer(true)} className="mt-3 inline-flex min-h-11 items-center gap-2 border border-signal/40 px-3 text-xs text-signal transition-colors hover:bg-signal/10 focus-visible:outline-2 focus-visible:outline-signal">
          <Play size={15} aria-hidden="true" /> CARGAR VIDEO DE TIKTOK
        </button>
      ))}
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 w-fit items-center gap-2 text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
        <ExternalLink size={14} aria-hidden="true" /> {embedUrl ? 'Abrir en TikTok' : 'Abrir contenido original'}
      </a>
      {showPlayer && <p className="text-[0.65rem] leading-5 text-muted-foreground">Si el video no está disponible aquí, abre el enlace en TikTok.</p>}
    </li>
  )
}

export default function BookMedia({ book }) {
  const entries = Array.isArray(book.media)
    ? book.media.filter((entry) => entry && typeof entry.title === 'string' && entry.title.trim() && getBookMediaUrl(entry.url))
    : []
  if (!entries.length) return null
  return (
    <section aria-label={`Multimedia de ${book.title}`} className="my-6 min-w-0 border-t border-primary/20 pt-5">
      <h2 className="mb-3 flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-primary"><Radio size={15} aria-hidden="true" /> ARCHIVO MULTIMEDIA</h2>
      <ul className="space-y-3">{entries.map((entry) => <MediaItem key={`${book.code}:${entry.url}`} entry={entry} />)}</ul>
    </section>
  )
}
