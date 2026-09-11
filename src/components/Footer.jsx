import { Orbit } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-10 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary">
            <Orbit className="size-5" />
          </span>
          <div>
            <p className="font-heading text-xs font-bold tracking-[0.3em]">
              SCIFI<span className="text-primary">BOOKS</span>
            </p>
            <p className="mt-1 text-[0.6rem] tracking-[0.25em] text-muted-foreground">
              ESTACIÓN ORBITAL K-7 · SECTOR 7G
            </p>
          </div>
        </div>

        <p className="text-[0.6rem] tracking-[0.25em] text-muted-foreground">
          RA 05h 35m · DEC −05° 23′ · ÓRBITA SINCRÓNICA
        </p>

        <p className="flex items-center gap-2 text-[0.6rem] tracking-[0.3em] text-primary">
          <span className="inline-block size-1.5 animate-blink rounded-full bg-primary" />
          FIN DE TRANSMISIÓN
        </p>
      </div>
    </footer>
  )
}
