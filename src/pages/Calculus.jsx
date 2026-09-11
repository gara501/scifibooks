import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Atom, Gauge, Orbit, Radio, Ruler, Zap } from 'lucide-react'
import Backdrop from '@/components/Backdrop'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Link } from 'react-router-dom'

const G = 9.80665
const LIGHT_YEAR_KM = 9.4607304725808e12
const PARSEC_IN_LY = 3.26156

const fieldClass = 'h-12 w-full border border-primary/25 bg-background/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15'
const labelClass = 'mb-2 block text-[0.62rem] tracking-[0.2em] text-muted-foreground'

function NumericField({ label, value, onChange, min, max, step = 'any', suffix }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="relative block">
        <input type="number" value={value} onChange={(event) => onChange(event.target.value)} min={min} max={max} step={step} className={`${fieldClass} pr-20`} />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[0.62rem] tracking-[0.15em] text-primary">{suffix}</span>
      </span>
    </label>
  )
}

function ResultPanel({ eyebrow, value, children }) {
  return (
    <div className="relative overflow-hidden border border-primary/30 bg-primary/[0.055] p-5 sm:p-6">
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 blur-3xl" />
      <p className="relative text-[0.6rem] tracking-[0.24em] text-primary">{eyebrow}</p>
      <p className="relative mt-3 font-heading text-2xl font-bold text-primary text-glow sm:text-3xl">{value}</p>
      <div className="relative mt-4 text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  )
}

function ModuleShell({ id, code, icon: Icon, title, concept, reference, children }) {
  return (
    <motion.section id={id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65 }} className="scroll-mt-24 border border-primary/20 bg-card/55 backdrop-blur-sm">
      <header className="flex items-start gap-4 border-b border-primary/15 p-5 sm:p-7">
        <span className="grid size-12 shrink-0 place-items-center border border-primary/35 bg-primary/10 text-primary"><Icon className="size-5" /></span>
        <div>
          <p className="mb-2 text-[0.6rem] tracking-[0.25em] text-primary">MÓDULO {code}</p>
          <h2 className="font-heading text-lg font-bold sm:text-2xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{concept}</p>
        </div>
      </header>
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_1.08fr]">{children}</div>
      <footer className="border-t border-primary/15 px-5 py-4 text-[0.62rem] leading-5 tracking-[0.12em] text-muted-foreground sm:px-7">
        REFERENCIA // <span className="text-signal">{reference}</span>
      </footer>
    </motion.section>
  )
}

function TimeDilation() {
  const [shipYears, setShipYears] = useState('5')
  const [speed, setSpeed] = useState('95')
  const result = useMemo(() => {
    const years = Math.max(0, Number(shipYears) || 0)
    const beta = Math.min(0.999999, Math.max(0, (Number(speed) || 0) / 100))
    const gamma = 1 / Math.sqrt(1 - beta ** 2)
    const earthYears = years * gamma
    const difference = earthYears - years
    return { gamma, earthYears, difference }
  }, [shipYears, speed])
  const generation = result.difference < 18 ? 'la misma generación aún te espera' : result.difference < 40 ? 'tus contemporáneos ya pertenecen a otra etapa de vida' : 'han transcurrido varias generaciones humanas'

  return (
    <ModuleShell id="dilatacion" code="A" icon={Gauge} title="Dilatación temporal" concept="Compara el tiempo propio de una tripulación con el tiempo medido desde la Tierra a velocidad relativista." reference="La guerra interminable · Joe Haldeman / Tau Zero · Poul Anderson">
      <div className="grid content-start gap-5">
        <NumericField label="TIEMPO PARA LA TRIPULACIÓN" value={shipYears} onChange={setShipYears} min="0" step="0.1" suffix="AÑOS" />
        <NumericField label="VELOCIDAD DE LA NAVE" value={speed} onChange={setSpeed} min="0" max="99.9999" step="0.1" suffix="% DE c" />
        <input aria-label="Velocidad de la nave" type="range" min="0" max="99.9" step="0.1" value={Math.min(Number(speed) || 0, 99.9)} onChange={(event) => setSpeed(event.target.value)} className="w-full accent-[var(--phosphor)]" />
      </div>
      <ResultPanel eyebrow="TIEMPO TRANSCURRIDO EN LA TIERRA" value={`${result.earthYears.toFixed(2)} años`}>
        <p>La diferencia es de <strong className="text-foreground">{result.difference.toFixed(2)} años</strong>. Factor de Lorentz γ = {result.gamma.toFixed(3)}; {generation}.</p>
        <p className="mt-3 text-xs">t Tierra = t nave / √(1 − v²/c²)</p>
      </ResultPanel>
    </ModuleShell>
  )
}

function RotationGravity() {
  const [radius, setRadius] = useState('100')
  const [gravity, setGravity] = useState('1')
  const result = useMemo(() => {
    const r = Math.max(0.1, Number(radius) || 0.1)
    const acceleration = Math.max(0, Number(gravity) || 0) * G
    const omega = Math.sqrt(acceleration / r)
    const rpm = omega * 60 / (2 * Math.PI)
    const coriolis = 2 * omega * 1.4
    return { rpm, coriolis, acceleration }
  }, [radius, gravity])
  const comfort = result.rpm < 2 ? 'rotación suave' : result.rpm < 4 ? 'Coriolis perceptible' : 'rotación intensa; posible desorientación'

  return (
    <ModuleShell id="gravedad" code="B" icon={Orbit} title="Gravedad artificial por rotación" concept="Calcula la velocidad angular necesaria para simular gravedad mediante una estación cilíndrica o toroidal." reference="Mundo Anillo · Larry Niven / Cita con Rama · Arthur C. Clarke">
      <div className="grid content-start gap-5">
        <NumericField label="RADIO DEL HÁBITAT" value={radius} onChange={setRadius} min="0.1" step="1" suffix="METROS" />
        <label><span className={labelClass}>GRAVEDAD OBJETIVO</span><select value={gravity} onChange={(event) => setGravity(event.target.value)} className={fieldClass}><option value="1">Tierra · 1 g</option><option value="0.38">Marte · 0,38 g</option><option value="0.16">Luna · 0,16 g</option><option value="0.5">Hábitat · 0,5 g</option></select></label>
      </div>
      <ResultPanel eyebrow="ROTACIÓN NECESARIA" value={`${result.rpm.toFixed(2)} RPM`}>
        <p>Aceleración objetivo: {result.acceleration.toFixed(2)} m/s². Clasificación humana aproximada: <strong className="text-foreground">{comfort}</strong>.</p>
        <p className="mt-3">Coriolis al caminar a 1,4 m/s: <strong className="text-foreground">{result.coriolis.toFixed(2)} m/s²</strong>.</p>
      </ResultPanel>
    </ModuleShell>
  )
}

function Kardashev() {
  const [power, setPower] = useState('20000000000000')
  const presets = [{ label: 'PLANETARIA', value: 1e16 }, { label: 'ESTELAR', value: 1e26 }, { label: 'GALÁCTICA', value: 1e36 }]
  const watts = Math.max(1, Number(power) || 1)
  const level = (Math.log10(watts) - 6) / 10
  const civilization = level < 1 ? 'Civilización planetaria emergente' : level < 2 ? 'Civilización Tipo I' : level < 3 ? 'Civilización Tipo II' : 'Civilización Tipo III o superior'
  const fiction = level < 1 ? 'Humanidad contemporánea / The Martian' : level < 2 ? 'Fundación temprana' : level < 3 ? 'Trisolaris / enjambres de Dyson' : 'Imperios galácticos de Fundación'

  return (
    <ModuleShell id="kardashev" code="C" icon={Zap} title="Escala de Kardašev" concept="Convierte la potencia utilizable de una civilización en el índice continuo popularizado por Carl Sagan." reference="Trilogía de la Fundación · Isaac Asimov / El problema de los tres cuerpos · Cixin Liu">
      <div className="grid content-start gap-5">
        <NumericField label="POTENCIA UTILIZADA" value={power} onChange={setPower} min="1" suffix="WATTS" />
        <div className="grid grid-cols-3 gap-2">{presets.map((preset) => <button key={preset.label} type="button" onClick={() => setPower(String(preset.value))} className="min-h-11 border border-primary/25 bg-primary/5 px-2 text-[0.55rem] tracking-[0.12em] text-primary transition hover:bg-primary hover:text-primary-foreground">{preset.label}</button>)}</div>
      </div>
      <ResultPanel eyebrow="ÍNDICE CONTINUO" value={`Tipo ${level.toFixed(2)}`}>
        <p><strong className="text-foreground">{civilization}</strong> · {watts.toExponential(2)} W.</p>
        <p className="mt-3">Afinidad narrativa: <span className="text-signal">{fiction}</span>.</p>
        <p className="mt-3 text-xs">K = (log₁₀ P − 6) / 10</p>
      </ResultPanel>
    </ModuleShell>
  )
}

function LoreConverter() {
  const [mode, setMode] = useState('distance')
  const [value, setValue] = useState('12')
  const [factor, setFactor] = useState('1000')
  const amount = Math.max(0, Number(value) || 0)
  let headline = ''
  let detail = ''
  if (mode === 'distance') {
    headline = `${(amount * PARSEC_IN_LY).toFixed(3)} años luz`
    detail = `${amount} parsecs equivalen a ${(amount * PARSEC_IN_LY * LIGHT_YEAR_KM).toExponential(3)} km. Un parsec mide distancia, no tiempo.`
  } else if (mode === 'ansible') {
    const realDelay = amount
    headline = `${(realDelay * 365.25).toLocaleString('es-ES')} días ahorrados`
    detail = `A ${amount} años luz, una señal luminosa tarda ${realDelay.toFixed(2)} años. Un ansible instantáneo tendría latencia narrativa ≈ 0.`
  } else {
    const realTime = amount * Math.max(0, Number(factor) || 0)
    headline = `${realTime.toFixed(2)} horas reales`
    detail = `${amount} horas locales × factor de salto ${Number(factor) || 0}. Este módulo es una convención de lore, no física establecida.`
  }

  return (
    <ModuleShell id="lore" code="D" icon={Ruler} title="Conversor de unidades del lore" concept="Traduce distancias reales y convenciones narrativas a magnitudes comparables." reference="Star Wars / Ciclo de Hain / tradiciones del hiperespacio">
      <div className="grid content-start gap-5">
        <label><span className={labelClass}>TIPO DE CONVERSIÓN</span><select value={mode} onChange={(event) => { setMode(event.target.value); setValue(event.target.value === 'jump' ? '2' : '12') }} className={fieldClass}><option value="distance">Parsecs → años luz</option><option value="ansible">Latencia ansible</option><option value="jump">Tiempo de salto</option></select></label>
        <NumericField label={mode === 'distance' ? 'DISTANCIA' : mode === 'ansible' ? 'DISTANCIA DEL MENSAJE' : 'TIEMPO LOCAL'} value={value} onChange={setValue} min="0" suffix={mode === 'distance' ? 'PARSECS' : mode === 'ansible' ? 'AÑOS LUZ' : 'HORAS'} />
        {mode === 'jump' ? <NumericField label="FACTOR ESPACIO REAL / HIPERESPACIO" value={factor} onChange={setFactor} min="0" suffix="×" /> : null}
      </div>
      <ResultPanel eyebrow="CONVERSIÓN" value={headline}><p>{detail}</p>{mode === 'distance' ? <p className="mt-3 text-signal">El Kessel Run usa parsecs correctamente como una ruta espacial más corta, aunque suele interpretarse como velocidad.</p> : null}</ResultPanel>
    </ModuleShell>
  )
}

export default function Calculus() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <Backdrop /><Navbar />
      <main className="relative z-10 pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link to="/" className="mb-10 inline-flex min-h-11 items-center gap-2 border border-primary/25 bg-primary/5 px-4 text-[0.62rem] tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground"><ArrowLeft className="size-4" /> VOLVER AL ARCHIVO</Link>
          <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-14 border-b border-primary/20 pb-12 md:mb-20 md:pb-16">
            <p className="mb-4 flex items-center gap-2 text-[0.62rem] tracking-[0.3em] text-primary"><Atom className="size-4" /> // LABORATORIO DE FÍSICA NARRATIVA</p>
            <h1 className="max-w-5xl font-heading text-[clamp(2.2rem,7vw,5.6rem)] leading-[0.98] font-extrabold tracking-tight">CÁLCULO <span className="text-primary text-glow">ESPECULATIVO</span></h1>
            <p className="mt-7 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Convierte ideas de ciencia ficción en magnitudes físicas. Los resultados distinguen entre teoría científica, aproximaciones humanas y licencias narrativas.</p>
            <nav className="mt-8 flex gap-2 overflow-x-auto pb-2">{[['A','DILATACIÓN','#dilatacion'],['B','GRAVEDAD','#gravedad'],['C','KARDAŠEV','#kardashev'],['D','LORE','#lore']].map(([code,label,href]) => <a key={code} href={href} className="flex min-h-11 shrink-0 items-center gap-2 border border-primary/20 px-3 text-[0.58rem] tracking-[0.16em] text-muted-foreground hover:border-primary hover:text-primary"><span className="text-primary">[{code}]</span>{label}</a>)}</nav>
          </motion.header>
          <div className="grid gap-8"><TimeDilation /><RotationGravity /><Kardashev /><LoreConverter /></div>
          <div className="mt-10 flex items-start gap-3 border border-signal/20 bg-signal/5 p-5 text-xs leading-6 text-muted-foreground"><Radio className="mt-0.5 size-4 shrink-0 text-signal" /><p>Estos cálculos son educativos. Los módulos relativista y rotacional aplican modelos físicos simplificados; ansibles e hiperespacio son convenciones narrativas.</p></div>
        </div>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  )
}
