import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { recordVisit } from '@/lib/visitStreak'

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null)
  const [eligible, setEligible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const visit = recordVisit()
    const onPlayed = () => setEligible(true)
    let played = false
    try { played = window.localStorage.getItem('scifi:v1:diario-jugado') === '1' } catch {}
    setEligible(visit.visits >= 2 || played)
    const prompt = (event) => { event.preventDefault(); setInstallEvent(event) }
    window.addEventListener('beforeinstallprompt', prompt)
    window.addEventListener('scifi:daily-played', onPlayed)
    return () => { window.removeEventListener('beforeinstallprompt', prompt); window.removeEventListener('scifi:daily-played', onPlayed) }
  }, [])
  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
    setDismissed(true)
  }
  if (!eligible || !installEvent || dismissed) return null
  return <aside className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-xl items-center gap-3 border border-primary/40 bg-background/95 p-3 shadow-xl backdrop-blur"><Download size={18} className="shrink-0 text-primary" /><p className="flex-1 text-xs leading-5">Instala SCIFIUNIVERSE para volver al archivo sin conexión.</p><button type="button" onClick={install} className="min-h-11 border border-primary/40 px-3 text-xs text-primary">INSTALAR</button><button type="button" onClick={() => setDismissed(true)} aria-label="Cerrar aviso de instalación" className="grid size-11 place-items-center border border-primary/20"><X size={15} /></button></aside>
}
