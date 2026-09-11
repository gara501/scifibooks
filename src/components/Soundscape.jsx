import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const MUSIC_PATH = '/sounds/music.mp3'
const EFFECT_PATHS = ['/sounds/swipe.mp3', '/sounds/transition.mp3']
const INTERACTIVE_SELECTOR = 'button, a, [role="button"], [data-sound]'
const STORAGE_KEY = 'scifiuniverse-audio-muted'

function storedMutePreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export default function Soundscape() {
  const [muted, setMuted] = useState(storedMutePreference)
  const musicRef = useRef(null)
  const effectsRef = useRef([])
  const unlockedRef = useRef(false)
  const mutedRef = useRef(muted)
  const lastEffectAtRef = useRef(0)

  useEffect(() => {
    mutedRef.current = muted
    try {
      window.localStorage.setItem(STORAGE_KEY, String(muted))
    } catch {
      // El audio sigue funcionando aunque el almacenamiento esté bloqueado.
    }

    const music = musicRef.current
    if (!music) return
    music.muted = muted
    if (muted) {
      music.pause()
    } else if (unlockedRef.current) {
      music.play().catch(() => {})
    }
  }, [muted])

  useEffect(() => {
    const music = new Audio(MUSIC_PATH)
    music.loop = true
    music.preload = 'auto'
    music.volume = 0.16
    music.muted = mutedRef.current
    musicRef.current = music

    const effectPools = EFFECT_PATHS.map((path) => Array.from({ length: 3 }, () => {
      const audio = new Audio(path)
      audio.preload = 'auto'
      audio.volume = 0.28
      return audio
    }))
    effectsRef.current = effectPools

    const handleInteraction = (event) => {
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null
      if (!target || target.dataset.sound === 'none') return

      if (!unlockedRef.current) {
        unlockedRef.current = true
        if (!mutedRef.current) music.play().catch(() => {})
      }

      if (mutedRef.current) return
      const now = performance.now()
      if (now - lastEffectAtRef.current < 90) return
      lastEffectAtRef.current = now

      const pool = effectPools[Math.floor(Math.random() * effectPools.length)]
      const effect = pool.find((audio) => audio.paused || audio.ended) || pool[0]
      effect.currentTime = 0
      effect.play().catch(() => {})
    }

    document.addEventListener('click', handleInteraction)
    return () => {
      document.removeEventListener('click', handleInteraction)
      music.pause()
      effectPools.flat().forEach((effect) => effect.pause())
      musicRef.current = null
      effectsRef.current = []
    }
  }, [])

  return (
    <button
      type="button"
      data-sound="none"
      onClick={() => setMuted((current) => !current)}
      className="fixed bottom-4 right-4 z-[70] grid size-11 place-items-center border border-primary/40 bg-background/85 text-primary shadow-[0_0_28px_oklch(0.84_0.165_82/12%)] backdrop-blur-md transition hover:border-primary hover:bg-primary hover:text-primary-foreground sm:bottom-6 sm:right-6"
      aria-label={muted ? 'Activar música y sonidos' : 'Silenciar música y sonidos'}
      aria-pressed={muted}
      title={muted ? 'Activar audio' : 'Silenciar audio'}
    >
      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      <span className="sr-only">{muted ? 'Audio desactivado' : 'Audio activado'}</span>
    </button>
  )
}
