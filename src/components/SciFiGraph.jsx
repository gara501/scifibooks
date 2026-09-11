import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Network, MousePointerClick, X, LibraryBig } from 'lucide-react'
import { graphNodes, graphEdges, nodeById } from '@/data/graph'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const VB_W = 1200
const VB_H = 900

const RADII = { root: 52, major: 36, minor: 24 }

const EDGE_DASH = { strong: undefined, weak: '2 7' }

function edgeWeight(source, target) {
  const a = nodeById[source]
  const b = nodeById[target]
  return a.size !== 'minor' && b.size !== 'minor' ? 'strong' : 'weak'
}

export default function SciFiGraph() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const focusId = hovered ?? selected

  // vecinos del nodo en foco (para resaltar aristas y atenuar el resto)
  const focusNeighbors = useMemo(() => {
    if (!focusId) return null
    return new Set([focusId, ...nodeById[focusId].conectado_con])
  }, [focusId])

  const isNodeDimmed = (id) => focusNeighbors && !focusNeighbors.has(id)
  const isEdgeHot = (e) => focusId && (e.source === focusId || e.target === focusId)
  const isEdgeDimmed = (e) => focusId && !isEdgeHot(e)

  return (
    <section id="mapa" className="relative scroll-mt-20 border-t border-primary/15 py-16 md:scroll-mt-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-12 md:gap-6"
        >
          <div>
            <p className="mb-3 flex items-center gap-2 text-[0.65rem] tracking-[0.35em] text-primary">
              <Network className="size-3.5" />
              // CARTOGRAFÍA DEL GÉNERO
            </p>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">
              MAPA DE <span className="text-primary text-glow">SUBGÉNEROS</span>
            </h2>
          </div>
          <p className="flex items-center gap-2 pb-2 text-[0.65rem] tracking-[0.25em] text-muted-foreground">
            <MousePointerClick className="size-3.5 text-primary/70" />
            SELECCIONA UN NODO PARA EXPLORAR
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* lienzo del grafo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-x-auto overflow-y-hidden rounded-xl border border-primary/20 bg-card/40 [scrollbar-color:var(--phosphor)_transparent]"
          >
            <div className="absolute inset-0 bg-grid opacity-60" />
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="relative h-auto min-w-[700px] lg:min-w-0 lg:w-full"
              role="img"
              aria-label="Grafo interactivo de subgéneros de la ciencia ficción"
            >
              <defs>
                <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* aristas */}
              <g>
                {graphEdges.map((edge, i) => {
                  const a = nodeById[edge.source]
                  const b = nodeById[edge.target]
                  const weight = edgeWeight(edge.source, edge.target)
                  const hot = isEdgeHot(edge)
                  const dimmed = isEdgeDimmed(edge)
                  return (
                    <g key={`${edge.source}-${edge.target}`}>
                      <motion.line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={hot ? 'oklch(0.84 0.165 82)' : 'oklch(0.84 0.165 82 / 35%)'}
                        strokeWidth={hot ? 2.5 : weight === 'strong' ? 1.5 : 1}
                        strokeDasharray={EDGE_DASH[weight]}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: dimmed ? 0.12 : hot ? 1 : 0.7 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{
                          pathLength: { duration: 1.1, delay: 0.4 + i * 0.04, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.3 },
                        }}
                      />
                      {/* pulso de señal viajando por la arista activa */}
                      {hot && (
                        <motion.circle
                          r="4"
                          fill="oklch(0.84 0.165 82)"
                          filter="url(#nodeGlow)"
                          initial={{ offsetDistance: '0%' }}
                          animate={{ offsetDistance: ['0%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                          style={{
                            offsetPath: `path('M ${a.x} ${a.y} L ${b.x} ${b.y}')`,
                          }}
                        />
                      )}
                    </g>
                  )
                })}
              </g>

              {/* nodos */}
              {graphNodes.map((node, i) => {
                const r = RADII[node.size]
                const color = `oklch(0.75 0.14 ${node.hue})`
                const dimmed = isNodeDimmed(node.id)
                const active = selected === node.id || hovered === node.id
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: dimmed ? 0.25 : 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      scale: { type: 'spring', stiffness: 200, damping: 16, delay: 0.2 + i * 0.06 },
                      opacity: { duration: 0.3 },
                    }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: 'pointer' }}
                    onClick={() => setSelected(selected === node.id ? null : node.id)}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Nodo ${node.titulo}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelected(selected === node.id ? null : node.id)
                      }
                    }}
                  >
                    {/* halo pulsante del nodo raíz */}
                    {node.size === 'root' && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 14}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        animate={{ r: [r + 10, r + 26], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut' }}
                      />
                    )}
                    {/* anillo exterior */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r + 7}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      opacity={active ? 0.9 : 0.35}
                    />
                    {/* cuerpo del nodo */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill="oklch(0.15 0.02 88)"
                      stroke={color}
                      strokeWidth={active ? 3 : 1.5}
                      filter={active ? 'url(#nodeGlow)' : undefined}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.94 }}
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                    {/* núcleo */}
                    <circle cx={node.x} cy={node.y} r={r * 0.28} fill={color} opacity={active ? 1 : 0.75} />
                    {/* etiqueta */}
                    <text
                      x={node.x}
                      y={node.y + r + 24}
                      textAnchor="middle"
                      fill={active ? color : 'oklch(0.75 0.02 90)'}
                      fontSize={node.size === 'minor' ? 12 : 14}
                      fontFamily="'Space Mono', monospace"
                      letterSpacing="1"
                    >
                      {node.titulo.length > 26 ? `${node.titulo.slice(0, 24)}…` : node.titulo}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </motion.div>

          <p className="-mt-3 flex items-center gap-2 text-[0.58rem] tracking-[0.16em] text-muted-foreground lg:hidden">
            <span className="text-primary">←</span> DESLIZA EL MAPA PARA EXPLORAR <span className="text-primary">→</span>
          </p>

          {/* panel de detalle */}
          <div className="relative min-h-0 lg:min-h-80">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.aside
                  key={selected}
                  initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full max-h-[52rem] flex-col overflow-y-auto rounded-xl border border-primary/30 bg-card/80 p-5 shadow-[0_0_50px_oklch(0.84_0.165_82/8%)] md:p-8"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/5 text-[0.6rem] tracking-[0.25em] text-primary"
                    >
                      NODO / {nodeById[selected].id.toUpperCase()}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="Cerrar detalle"
                      className="grid size-11 cursor-pointer place-items-center border border-primary/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:size-9"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  <h3 className="font-heading text-xl leading-tight font-bold text-foreground md:text-2xl">
                    {nodeById[selected].titulo}
                  </h3>

                  <Separator className="my-5 bg-primary/25" />

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {nodeById[selected].descripcion}
                  </p>

                  {/* obras representativas */}
                  {nodeById[selected].obras_representativas && (
                    <div className="mt-6">
                      <p className="mb-3 flex items-center gap-2 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
                        <LibraryBig className="size-3.5 text-primary/70" />
                        OBRAS REPRESENTATIVAS ({nodeById[selected].obras_representativas.length})
                      </p>
                      <ul className="space-y-2">
                        {nodeById[selected].obras_representativas.map((obra, i) => (
                          <motion.li
                            key={obra}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-start gap-2.5 border-l-2 border-primary/40 bg-primary/[0.04] py-1.5 pr-2 pl-3 text-xs leading-relaxed text-foreground/85"
                          >
                            <span className="mt-0.5 shrink-0 text-[0.6rem] text-primary/70">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {obra}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <p className="mb-3 text-[0.6rem] tracking-[0.3em] text-muted-foreground">
                      CONEXIONES ({nodeById[selected].conectado_con.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {nodeById[selected].conectado_con.map((id, i) => (
                        <motion.button
                          key={id}
                          type="button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                          onClick={() => setSelected(id)}
                          className="cursor-pointer border border-signal/40 bg-signal/5 px-2.5 py-1 text-[0.6rem] tracking-[0.15em] text-signal transition-colors hover:bg-signal hover:text-background"
                        >
                          {nodeById[id].titulo.length > 22
                            ? `${nodeById[id].titulo.slice(0, 20)}…`
                            : nodeById[id].titulo}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              ) : (
                <motion.aside
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-primary/25 bg-card/30 p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                    className="grid size-14 place-items-center rounded-full border border-dashed border-primary/40 text-primary"
                  >
                    <Network className="size-6" />
                  </motion.div>
                  <p className="max-w-56 text-xs leading-relaxed tracking-[0.15em] text-muted-foreground">
                    SELECCIONA UN NODO DEL MAPA PARA LEER SU EXPEDIENTE
                  </p>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
