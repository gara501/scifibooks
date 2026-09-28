import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Radio, Share2, Signal, Trophy } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Backdrop from '@/components/Backdrop'
import Footer from '@/components/Footer'
import { books } from '@/data/books'
import { LAUNCH_DATE, dailyHints, getDailyGames, getDailyStats, getTransmission, nextTransmissionAt, normalizeTitle, saveDailyGame, todayInBogota } from '@/lib/dailyTransmission'

const EMPTY_GAME = { guesses: [], complete: false, won: false }
const dateDiff = (a, b) => Math.floor((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000)

export default function Diario() {
  const today = todayInBogota()
  const [date, setDate] = useState(today)
  const [game, setGame] = useState(() => getDailyGames().games[today] || EMPTY_GAME)
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState(() => getDailyStats())
  const [countdown, setCountdown] = useState('')
  const [shareNotice, setShareNotice] = useState('')
  const statsDialog = useRef(null)
  const archive = date < today
  const transmission = getTransmission(date)
  const answer = transmission?.book
  const hints = useMemo(() => answer ? dailyHints(answer) : [], [answer])
  const misses = game.guesses.filter((guess) => !guess.correct).length
  const visibleHints = Math.min(misses + 1, hints.length)
  const finished = game.complete

  useEffect(() => {
    if (date !== today) return
    const tick = () => {
      const remaining = Math.max(0, nextTransmissionAt().getTime() - Date.now())
      const hours = String(Math.floor(remaining / 3600000)).padStart(2, '0')
      const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0')
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')
      setCountdown(`${hours}:${minutes}:${seconds}`)
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [date, today])

  const selectDate = (next) => {
    setDate(next)
    setGame(next === today ? (getDailyGames().games[next] || EMPTY_GAME) : EMPTY_GAME)
    setInput('')
    setMessage('')
  }

  const submitGuess = (event) => {
    event.preventDefault()
    if (!answer || finished) return
    const normalized = normalizeTitle(input)
    const match = books.find((book) => normalizeTitle(book.title) === normalized)
    if (!match) { setMessage('Selecciona uno de los títulos del archivo.'); return }
    if (game.guesses.some((guess) => normalizeTitle(guess.title) === normalized)) { setMessage('Esa señal ya fue transmitida. Prueba otro título.'); return }
    const correct = match.code === answer.code
    const guesses = [...game.guesses, { title: match.title, correct }]
    const nextGame = { guesses, complete: correct || guesses.length === 6, won: correct }
    setGame(nextGame)
    setInput('')
    setMessage(correct ? 'Señal descifrada.' : guesses.length === 6 ? 'Se agotaron los intentos. Expediente desbloqueado.' : 'No coincide. Nueva pista recibida.')
    if (!archive) {
      saveDailyGame(date, nextGame)
      setStats(getDailyStats())
    }
  }

  const shareResult = async () => {
    if (!transmission) return
    const squares = Array.from({ length: 6 }, (_, index) => game.guesses[index] ? (game.guesses[index].correct ? '🟩' : '🟥') : '⬛').join('')
    const score = game.won ? `${game.guesses.length}/6` : 'X/6'
    const text = `SCIFIUNIVERSE · Transmisión #${transmission.number}\n🛰️ ${score}\n${squares}\nscifibooks.netlify.app/diario`
    try {
      if (navigator.share) await navigator.share({ title: 'Descifra la transmisión', text })
      else {
        await navigator.clipboard.writeText(text)
        setShareNotice('Resultado copiado al portapapeles.')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShareNotice('No se pudo compartir este resultado.')
    }
  }

  const openStats = () => statsDialog.current?.showModal()
  const archiveRange = useMemo(() => {
    const count = Math.max(0, dateDiff(LAUNCH_DATE, today))
    return Array.from({ length: Math.min(count + 1, 3650) }, (_, index) => {
      const value = new Date(Date.parse(`${today}T00:00:00Z`) - index * 86400000)
      return value.toISOString().slice(0, 10)
    })
  }, [today])

  return <div className="relative min-h-screen overflow-x-clip bg-background text-foreground"><Backdrop /><Navbar /><main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28"><header className="border-b border-primary/20 pb-7"><p className="flex items-center gap-2 text-[0.62rem] tracking-[0.28em] text-primary"><Radio size={15} /> // ENLACE DE DESCIFRADO · ESTACIÓN K-7</p><h1 className="mt-3 font-heading text-3xl font-black sm:text-5xl">DESCIFRA LA TRANSMISIÓN</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Una señal literaria nueva cada día. Lee la pista inicial y prueba hasta seis títulos; cada error revela otra pista.</p></header>
    <section className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-primary/25 bg-card/50 p-4 sm:p-5"><div><label htmlFor="archive-date" className="flex items-center gap-2 text-[0.6rem] tracking-[0.18em] text-muted-foreground"><CalendarClock size={14} /> FECHA DE TRANSMISIÓN</label><select id="archive-date" value={date} onChange={(event) => selectDate(event.target.value)} className="mt-2 min-h-11 w-full min-w-56 border border-primary/30 bg-background px-3 text-xs text-foreground">{archiveRange.map((day) => <option key={day} value={day}>{day === today ? `${day} · EN VIVO` : day}</option>)}</select></div><div className="text-right"><p className="text-[0.58rem] tracking-[0.2em] text-primary">TRANSMISIÓN N.º</p><p className="mt-1 font-heading text-2xl font-bold">{transmission ? String(transmission.number).padStart(3, '0') : '—'}</p></div>{archive && <p className="w-full border-l-2 border-signal px-3 py-2 text-xs text-signal">MODO ARCHIVO · Esta partida no modifica tu racha ni tus estadísticas.</p>}</section>
    {!answer ? <section className="mt-6 border border-primary/25 bg-card/50 p-6 text-sm text-muted-foreground">Esta fecha es anterior al inicio de transmisiones configurado.</section> : <>
      <section className="mt-6 grid gap-5 border border-primary/25 bg-card/50 p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><h2 className="font-heading text-sm font-bold tracking-[0.16em]">SEÑAL INTERCEPTADA</h2><span className="flex items-center gap-2 text-[0.58rem] tracking-[0.16em] text-signal"><Signal size={13} /> {finished ? 'DESCIFRADA' : 'CIFRADO ACTIVO'}</span></div>
        <ol aria-label="Intentos realizados" className="grid grid-cols-6 gap-2">{Array.from({ length: 6 }, (_, index) => <li key={index} className={`grid aspect-square place-items-center border text-sm sm:text-base ${game.guesses[index] ? game.guesses[index].correct ? 'border-signal/60 bg-signal/15 text-signal' : 'border-red-400/40 bg-red-500/10 text-red-200' : 'border-primary/20 bg-background/50 text-muted-foreground'}`} aria-label={game.guesses[index] ? `${game.guesses[index].title}: ${game.guesses[index].correct ? 'correcto' : 'incorrecto'}` : `Intento ${index + 1} disponible`}>{game.guesses[index] ? game.guesses[index].correct ? '✓' : '×' : index + 1}</li>)}</ol>
        {!finished && <form onSubmit={submitGuess} className="grid gap-3 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="daily-guess">Escribe el título del libro</label><input id="daily-guess" list="book-title-options" value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" placeholder="ESCRIBE EL TÍTULO DEL VOLUMEN..." className="min-h-12 min-w-0 border border-primary/30 bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /><datalist id="book-title-options">{books.map((book) => <option key={book.code} value={book.title} />)}</datalist><button className="min-h-12 border border-primary/50 bg-primary/10 px-5 font-heading text-xs font-bold tracking-[0.14em] text-primary hover:bg-primary hover:text-background">TRANSMITIR RESPUESTA</button></form>}
        {message && <p role="status" className="text-sm text-signal">{message}</p>}
        <div className="border-t border-primary/15 pt-4"><h3 className="text-[0.6rem] tracking-[0.22em] text-primary">PISTAS RECIBIDAS · {visibleHints}/{hints.length}</h3><ol className="mt-3 space-y-2">{hints.slice(0, visibleHints).map((hint, index) => <li key={index} className="flex gap-3 border-l border-primary/30 bg-background/30 px-3 py-2 text-xs leading-5"><span className="shrink-0 text-primary">0{index + 1}</span><span>{hint}</span></li>)}</ol></div>
      </section>
      {finished && <section className="mt-6 border border-signal/35 bg-signal/[0.04] p-5 sm:p-7"><p className="text-[0.6rem] tracking-[0.2em] text-signal">{game.won ? 'TRANSMISIÓN DESCIFRADA' : 'EXPEDIENTE DESCLASIFICADO'}</p><h2 className="mt-2 font-heading text-2xl font-black">{answer.title}</h2><p className="mt-2 text-xs text-muted-foreground">{answer.author} · {answer.year} · {answer.tag}</p><p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{answer.desc}</p><div className="mt-5 flex flex-wrap gap-3"><Link to={`/libro/${answer.slug}`} className="inline-flex min-h-11 items-center border border-primary/40 px-4 text-xs tracking-[0.12em] text-primary">ABRIR EXPEDIENTE</Link><button type="button" onClick={shareResult} className="inline-flex min-h-11 items-center gap-2 border border-signal/40 px-4 text-xs tracking-[0.12em] text-signal"><Share2 size={14} /> COMPARTIR RESULTADO</button>{shareNotice && <span role="status" className="self-center text-xs text-signal">{shareNotice}</span>}</div><p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><CalendarClock size={14} /> {archive ? 'Modo archivo · sin efecto en racha' : `Próxima transmisión en ${countdown || '…'}`}</p></section>}
    </>}
    <section className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-primary/15 pt-5"><p className="text-xs text-muted-foreground">{stats.played} partidas diarias registradas · racha actual {stats.currentStreak}</p><button type="button" onClick={openStats} className="inline-flex min-h-11 items-center gap-2 border border-primary/30 px-4 text-xs text-primary"><Trophy size={14} /> ESTADÍSTICAS</button></section>
  </main><Footer /><dialog ref={statsDialog} aria-labelledby="daily-stats-title" className="m-auto w-[calc(100%-2rem)] max-w-lg border border-primary/35 bg-background p-0 text-foreground backdrop:bg-black/75"><div className="flex items-center justify-between border-b border-primary/20 p-5"><h2 id="daily-stats-title" className="font-heading text-lg font-bold">REGISTRO DE TRANSMISIONES</h2><button type="button" onClick={() => statsDialog.current?.close()} aria-label="Cerrar estadísticas" className="grid size-11 place-items-center border border-primary/25 text-primary">×</button></div><div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">{[['JUGADAS', stats.played], ['VICTORIAS', stats.winRate + '%'], ['RACHA ACTUAL', stats.currentStreak], ['RACHA MÁXIMA', stats.maxStreak]].map(([label, value]) => <div key={label} className="border border-primary/20 p-3 text-center"><p className="text-[0.53rem] tracking-[0.1em] text-muted-foreground">{label}</p><p className="mt-2 font-heading text-xl text-primary">{value}</p></div>)}</div><div className="px-5 pb-6"><p className="text-[0.58rem] tracking-[0.18em] text-primary">DISTRIBUCIÓN DE INTENTOS GANADORES</p><div className="mt-3 space-y-2">{stats.distribution.map((count, index) => <div key={index} className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs"><span>{index + 1}/6</span><div className="h-5 bg-primary/10"><div className="grid h-full min-w-7 place-items-center bg-primary/70 text-background" style={{ width: `${Math.max(count ? 10 : 0, stats.wins ? count / stats.wins * 100 : 0)}%` }}>{count}</div></div><span className="text-right">{count}</span></div>)}</div></div></dialog></div>
}
