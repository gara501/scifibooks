// Generador de portadas procedurales para SCIFIBOOKS.
// Cada libro recibe una escena SVG única relacionada con su universo.
// Uso: node scripts/generate-covers.mjs

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'covers')
const W = 800
const H = 1200

// RNG determinista para que las portadas sean reproducibles
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function starField(seed, count, { ymax = H, rMax = 1.6 } = {}) {
  const rnd = mulberry32(seed)
  let s = ''
  for (let i = 0; i < count; i++) {
    const cx = (rnd() * W).toFixed(1)
    const cy = (rnd() * ymax).toFixed(1)
    const r = (0.3 + rnd() * rMax).toFixed(2)
    const o = (0.15 + rnd() * 0.75).toFixed(2)
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="${o}"/>`
  }
  return s
}

const COMMON_DEFS = `
<filter id="soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="soft2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity="0.14"/></pattern>
<radialGradient id="vig" cx="50%" cy="42%" r="78%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient>`

function doc(defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<defs>${COMMON_DEFS}${defs}</defs>
${body}
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.07"/>
<rect width="${W}" height="${H}" fill="url(#scan)" opacity="0.5"/>
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>
`
}

/* ---------------------------------- DUNE ---------------------------------- */
function dune() {
  const defs = `
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#170b03"/><stop offset="0.55" stop-color="#7a3c12"/><stop offset="1" stop-color="#e8963f"/></linearGradient>
<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9b8"/><stop offset="0.55" stop-color="#ffcf7d"/><stop offset="1" stop-color="#ff9d3f"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${starField(11, 45, { ymax: 420 })}
<circle cx="620" cy="180" r="26" fill="#f8e3c0" opacity="0.85"/>
<circle cx="150" cy="120" r="14" fill="#f8e3c0" opacity="0.5"/>
<circle cx="400" cy="600" r="240" fill="#ffb45f" opacity="0.35" filter="url(#soft)"/>
<circle cx="400" cy="600" r="150" fill="url(#sun)"/>
<path d="M0,760 C180,690 320,720 460,760 C600,800 720,760 800,730 L800,1200 L0,1200 Z" fill="#a5571f"/>
<ellipse cx="560" cy="880" rx="90" ry="22" fill="none" stroke="#e8963f" stroke-width="2" opacity="0.4"/>
<ellipse cx="560" cy="880" rx="130" ry="34" fill="none" stroke="#e8963f" stroke-width="1.5" opacity="0.22"/>
<ellipse cx="560" cy="880" rx="180" ry="48" fill="none" stroke="#e8963f" stroke-width="1" opacity="0.12"/>
<path d="M0,880 C220,820 420,860 560,900 C680,930 760,900 800,880 L800,1200 L0,1200 Z" fill="#7a3c12"/>
<path d="M0,1010 C260,950 480,1000 640,1040 C720,1060 780,1040 800,1030 L800,1200 L0,1200 Z" fill="#452206"/>
<g fill="#1c0d02"><circle cx="297" cy="846" r="4"/><rect x="294" y="850" width="6" height="16" rx="3"/></g>`
  return doc(defs, body)
}

/* -------------------------------- FUNDACIÓN -------------------------------- */
function fundacion() {
  const rnd = mulberry32(22)
  let cluster = ''
  for (let i = 0; i < 90; i++) {
    const nx = (rnd() + rnd() + rnd()) / 3 - 0.5
    const ny = (rnd() + rnd() + rnd()) / 3 - 0.5
    cluster += `<circle cx="${(400 + nx * 560).toFixed(1)}" cy="${(480 + ny * 170).toFixed(1)}" r="${(0.4 + rnd() * 1.4).toFixed(2)}" fill="#cfc2ff" opacity="${(0.3 + rnd() * 0.7).toFixed(2)}"/>`
  }
  let grid = ''
  for (let x = 0; x <= W; x += 80) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`
  for (let y = 0; y <= H; y += 80) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`
  const defs = `
<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="#2a1e5c"/><stop offset="0.6" stop-color="#140b33"/><stop offset="1" stop-color="#070417"/></radialGradient>
<radialGradient id="core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#efeaff"/><stop offset="0.4" stop-color="#b7a6ff" stop-opacity="0.8"/><stop offset="1" stop-color="#b7a6ff" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g stroke="#8f7bff" stroke-width="1" opacity="0.06">${grid}</g>
${starField(21, 130)}
<g transform="rotate(-22 400 480)" fill="none">
<ellipse cx="400" cy="480" rx="300" ry="90" stroke="#8f7bff" stroke-width="1.5" opacity="0.5"/>
<ellipse cx="400" cy="480" rx="230" ry="64" stroke="#a78bfa" stroke-width="1.5" opacity="0.45"/>
<ellipse cx="400" cy="480" rx="160" ry="42" stroke="#a78bfa" stroke-width="1.5" opacity="0.4"/>
<ellipse cx="400" cy="480" rx="95" ry="24" stroke="#cfc2ff" stroke-width="1.5" opacity="0.35"/>
</g>
${cluster}
<circle cx="400" cy="480" r="95" fill="url(#core)"/>
<circle cx="620" cy="290" r="26" fill="#4f3fa8"/>
<ellipse cx="620" cy="290" rx="44" ry="10" fill="none" stroke="#a78bfa" opacity="0.6" transform="rotate(-18 620 290)"/>`
  return doc(defs, body)
}

/* -------------------------------- NEUROMANTE -------------------------------- */
function neuromante() {
  let rays = ''
  for (let x = -200; x <= 1000; x += 100) {
    rays += `<line x1="400" y1="650" x2="${x}" y2="1200" stroke="#22d3ee" stroke-width="1" opacity="0.35"/>`
  }
  let rows = ''
  for (let i = 1; i <= 10; i++) {
    const y = 650 + i * i * 5.5
    rows += `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="${i % 2 ? '#e879f9' : '#22d3ee'}" stroke-width="1" opacity="${(0.45 - i * 0.03).toFixed(2)}"/>`
  }
  const rnd = mulberry32(33)
  let rain = ''
  for (let i = 0; i < 14; i++) {
    const x = (rnd() * W).toFixed(0)
    rain += `<line x1="${x}" y1="${(680 + rnd() * 100).toFixed(0)}" x2="${x}" y2="${(1000 + rnd() * 180).toFixed(0)}" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="3 12" opacity="0.25"/>`
  }
  const defs = `
<linearGradient id="hor" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee"/><stop offset="0.5" stop-color="#e879f9"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="#050208"/>
${starField(31, 60, { ymax: 500 })}
<rect x="0" y="628" width="800" height="44" fill="url(#hor)" opacity="0.7" filter="url(#soft)"/>
<rect x="0" y="648" width="800" height="3" fill="url(#hor)"/>
${rays}${rows}${rain}
<circle cx="400" cy="330" r="130" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 10" opacity="0.9"/>
<circle cx="400" cy="330" r="152" fill="none" stroke="#f472b6" stroke-width="1" opacity="0.25"/>
<g fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.8">
<rect x="120" y="470" width="90" height="180"/>
<path d="M120,470 L160,432 L250,432 L210,470"/>
<line x1="160" y1="432" x2="160" y2="650" opacity="0.5"/>
<rect x="590" y="500" width="110" height="150"/>
<path d="M590,500 L630,462 L740,462 L700,500"/>
</g>
<g fill="none" stroke="#e879f9" stroke-width="1.5" opacity="0.8">
<rect x="330" y="520" width="140" height="130"/>
<line x1="400" y1="520" x2="400" y2="650" opacity="0.5"/>
</g>`
  return doc(defs, body)
}

/* --------------------------------- SOLARIS --------------------------------- */
function solaris() {
  let waves = ''
  for (let i = 0; i < 8; i++) {
    const y = 560 + i * 72
    waves += `<path d="M-20,${y} C180,${y - 26} 380,${y + 22} 560,${y - 14} S780,${y + 8} 820,${y - 4}" fill="none" stroke="#5eead4" stroke-width="2" opacity="${(0.16 + i * 0.045).toFixed(2)}"/>`
  }
  const defs = `
<linearGradient id="bgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#010c10"/><stop offset="1" stop-color="#04303a"/></linearGradient>
<radialGradient id="planet" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#0e6577"/><stop offset="0.5" stop-color="#093d49"/><stop offset="1" stop-color="#052228"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#bgs)"/>
${starField(41, 70, { ymax: 480 })}
<circle cx="140" cy="150" r="58" fill="#fda4af" opacity="0.35" filter="url(#soft)"/>
<circle cx="140" cy="150" r="30" fill="#fda4af" opacity="0.9"/>
<circle cx="660" cy="110" r="34" fill="#bae6fd" opacity="0.3" filter="url(#soft)"/>
<circle cx="660" cy="110" r="17" fill="#bae6fd" opacity="0.9"/>
<circle cx="400" cy="1500" r="980" fill="url(#planet)"/>
<ellipse cx="400" cy="522" rx="500" ry="26" fill="#5eead4" opacity="0.22" filter="url(#soft)"/>
${waves}
<path d="M300,780 a70,40 0 1,1 60,60 a50,28 0 1,0 -60,-60" fill="none" stroke="#99f6e4" stroke-width="2" opacity="0.5" filter="url(#soft2)"/>
<path d="M520,950 a55,32 0 1,1 46,46 a38,22 0 1,0 -46,-46" fill="none" stroke="#99f6e4" stroke-width="2" opacity="0.4" filter="url(#soft2)"/>
<ellipse cx="600" cy="1080" rx="80" ry="36" fill="#0b5563" stroke="#5eead4" stroke-width="1.5" opacity="0.7"/>`
  return doc(defs, body)
}

/* ----------------------------- 2001: ODISEA ----------------------------- */
function odisea() {
  let dots = ''
  for (let i = 0; i < 5; i++) {
    dots += `<circle cx="${140 + i * 120}" cy="${300 - i * 26}" r="3" fill="#c4b5fd" opacity="${0.25 + i * 0.15}"/>`
  }
  const defs = `
<radialGradient id="neb" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#4c1d95" stop-opacity="0.5"/><stop offset="1" stop-color="#4c1d95" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a78bfa" stop-opacity="0"/><stop offset="0.5" stop-color="#ddd6fe"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient>
<linearGradient id="face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a14"/><stop offset="0.85" stop-color="#05050a"/><stop offset="1" stop-color="#1b1b30"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="#030309"/>
<rect width="${W}" height="${H}" fill="url(#neb)"/>
${starField(51, 220)}
${dots}
<circle cx="150" cy="1010" r="150" fill="#0b0b18" stroke="#818cf8" stroke-width="1.5" opacity="0.9"/>
<circle cx="195" cy="985" r="150" fill="#030309" opacity="0.85"/>
<rect x="0" y="624" width="800" height="28" fill="url(#beam)" opacity="0.5" filter="url(#soft)"/>
<rect x="0" y="636" width="800" height="4" fill="url(#beam)"/>
<ellipse cx="400" cy="892" rx="120" ry="14" fill="#000" opacity="0.6" filter="url(#soft)"/>
<rect x="340" y="400" width="120" height="480" fill="url(#face)" stroke="#262640" stroke-width="1"/>
<line x1="460" y1="400" x2="460" y2="880" stroke="#c4b5fd" stroke-width="2" opacity="0.9" filter="url(#soft2)"/>`
  return doc(defs, body)
}

/* -------------------- LA MANO IZQUIERDA DE LA OSCURIDAD -------------------- */
function oscuridad() {
  const defs = `
<linearGradient id="ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1620"/><stop offset="0.5" stop-color="#27485c"/><stop offset="0.78" stop-color="#b7d4e2"/><stop offset="1" stop-color="#e8f3f8"/></linearGradient>
<linearGradient id="aur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7dd3fc" stop-opacity="0"/><stop offset="0.5" stop-color="#a5f3fc" stop-opacity="0.8"/><stop offset="1" stop-color="#7dd3fc" stop-opacity="0"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#ice)"/>
${starField(61, 40, { ymax: 300 })}
<path d="M-20,220 C200,140 420,260 640,180 S860,220 860,200" stroke="url(#aur)" stroke-width="26" fill="none" opacity="0.35" filter="url(#soft)"/>
<path d="M-20,330 C220,270 460,360 700,300 S880,330 880,330" stroke="url(#aur)" stroke-width="16" fill="none" opacity="0.25" filter="url(#soft)"/>
<polygon points="0,760 120,640 220,720 340,600 470,730 580,640 700,740 800,660 800,1200 0,1200" fill="#a9cbdc"/>
<polygon points="0,860 150,760 260,830 400,730 540,840 680,770 800,850 800,1200 0,1200" fill="#6d93a8"/>
<polygon points="0,980 180,900 340,960 520,890 700,970 800,920 800,1200 0,1200" fill="#33505f"/>
<path d="M0,1060 C300,1030 500,1070 800,1050 L800,1200 L0,1200 Z" fill="#dceef5"/>
<path d="M400,1200 C390,1140 420,1100 400,1056" stroke="#33505f" stroke-width="3" fill="none" stroke-dasharray="1 10" stroke-linecap="round" opacity="0.6"/>
<g fill="#16222c"><circle cx="392" cy="1056" r="4"/><rect x="389" y="1060" width="6" height="14" rx="3"/><circle cx="412" cy="1051" r="4"/><rect x="409" y="1055" width="6" height="14" rx="3"/></g>`
  return doc(defs, body)
}

/* -------------------------------- HYPERION -------------------------------- */
function hyperion() {
  const birds = [[180, 300], [230, 260], [290, 310], [560, 240], [620, 290], [670, 250]]
    .map(([x, y]) => `<path d="M${x},${y} l7,-6 l7,6" stroke="#1a0508" stroke-width="2" fill="none"/>`)
    .join('')
  const defs = `
<linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150509"/><stop offset="0.6" stop-color="#571118"/><stop offset="1" stop-color="#a33025"/></linearGradient>
<radialGradient id="giant" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd9c2"/><stop offset="0.5" stop-color="#ff6b4a"/><stop offset="1" stop-color="#c22f1d"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#hsky)"/>
${starField(71, 50, { ymax: 380 })}
<circle cx="560" cy="660" r="290" fill="#ff6b4a" opacity="0.4" filter="url(#soft)"/>
<circle cx="560" cy="660" r="190" fill="url(#giant)"/>
<g fill="none" stroke="#ff8a5c" stroke-width="2" opacity="0.35">
<path d="M140,820 C160,700 220,660 200,560"/>
<path d="M200,830 C240,720 300,700 290,600"/>
<path d="M660,840 C640,720 700,680 680,580"/>
</g>
${birds}
<g fill="#14050a">
<polygon points="80,880 200,760 320,880"/>
<polygon points="360,880 470,720 580,880"/>
<rect x="620" y="740" width="46" height="140"/>
<polygon points="620,740 643,700 666,740"/>
</g>
<polygon points="360,880 470,720 580,880" fill="none" stroke="#ff8a5c" stroke-width="1.5" opacity="0.6"/>
<rect x="0" y="838" width="800" height="18" fill="#ffb199" opacity="0.08" filter="url(#soft)"/>
<rect x="0" y="900" width="800" height="14" fill="#ffb199" opacity="0.06" filter="url(#soft)"/>
<path d="M0,880 C260,860 540,870 800,860 L800,1200 L0,1200 Z" fill="#1c070b"/>
<path d="M0,1000 C300,960 520,1010 800,980 L800,1200 L0,1200 Z" fill="#120408"/>`
  return doc(defs, body)
}

/* ------------------------------- TRISOLARIS ------------------------------- */
function trisolaris() {
  const defs = `
<linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03110b"/><stop offset="1" stop-color="#0a2418"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#tsky)"/>
${starField(81, 90)}
<g fill="none" stroke-width="1.5">
<ellipse cx="400" cy="470" rx="330" ry="120" stroke="#ffd166" opacity="0.5" transform="rotate(-18 400 470)" stroke-dasharray="4 8"/>
<ellipse cx="400" cy="470" rx="260" ry="150" stroke="#06d6a0" opacity="0.45" transform="rotate(24 400 470)" stroke-dasharray="3 9"/>
<ellipse cx="400" cy="470" rx="180" ry="200" stroke="#ef476f" opacity="0.4" transform="rotate(60 400 470)" stroke-dasharray="2 8"/>
</g>
<circle cx="240" cy="430" r="110" fill="#ffd166" opacity="0.35" filter="url(#soft)"/>
<circle cx="240" cy="430" r="66" fill="#ffd166"/>
<circle cx="540" cy="300" r="70" fill="#06d6a0" opacity="0.3" filter="url(#soft)"/>
<circle cx="540" cy="300" r="38" fill="#06d6a0"/>
<circle cx="450" cy="610" r="50" fill="#ef476f" opacity="0.3" filter="url(#soft)"/>
<circle cx="450" cy="610" r="22" fill="#ef476f"/>
<path d="M0,980 C220,950 460,990 800,960 L800,1200 L0,1200 Z" fill="#1c1206"/>
<g stroke="#ef476f" stroke-width="1.5" opacity="0.4" fill="none">
<path d="M120,1020 l60,26 l-20,30 l70,20"/>
<path d="M420,1010 l-40,34 l50,18 l-10,34"/>
<path d="M660,1000 l30,30 l-40,22"/>
</g>`
  return doc(defs, body)
}

/* -------------------------------- DISTOPÍA -------------------------------- */
function distopia() {
  const defs = `
<linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a12"/><stop offset="1" stop-color="#1a1220"/></linearGradient>
<radialGradient id="eye" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff6b6b"/><stop offset="0.3" stop-color="#c22f3d"/><stop offset="1" stop-color="#c22f3d" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#dsky)"/>
${starField(101, 30, { ymax: 250 })}
<g fill="#0d0916"><rect x="60" y="200" width="120" height="400"/><rect x="200" y="140" width="90" height="460"/><rect x="320" y="80" width="140" height="520"/><rect x="490" y="180" width="110" height="420"/><rect x="630" y="100" width="130" height="500"/></g>
<g stroke="#ff6b6b" stroke-width="1" opacity="0.12" fill="none">
<path d="M120,600 L120,160"/><path d="M245,600 L245,110"/><path d="M390,600 L390,60"/><path d="M545,600 L545,155"/><path d="M695,600 L695,80"/>
</g>
<g fill="#ff8a8a" font-family="monospace" font-size="8" opacity="0.25">
<text x="140" y="180">▓▓</text><text x="265" y="220">▓▓▓</text><text x="520" y="150">▓</text><text x="645" y="90">▓▓▓▓</text><text x="160" y="340">▓▓</text><text x="430" y="280">▓▓▓</text>
</g>
<circle cx="400" cy="420" r="130" fill="url(#eye)"/>
<circle cx="400" cy="420" r="70" fill="#c22f3d" opacity="0.9"/>
<circle cx="400" cy="420" r="30" fill="#ff6b6b"/>
<path d="M0,760 C200,740 500,770 800,750 L800,1200 L0,1200 Z" fill="#050308"/>
<path d="M0,680 C240,720 560,700 800,660" stroke="#ff6b6b" stroke-width="2" fill="none" opacity="0.4" filter="url(#soft2)"/>`
  return doc(defs, body)
}

/* -------------------------------- LLAMAS -------------------------------- */
function llamas() {
  const defs = `
<radialGradient id="fire" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#ffd166"/><stop offset="0.5" stop-color="#ef476f"/><stop offset="1" stop-color="#7a0e1e" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="#140206"/>
${starField(102, 40, { ymax: 300 })}
<circle cx="400" cy="800" r="280" fill="url(#fire)"/>
<path d="M0,1200 L0,700 C140,780 200,860 400,830 C600,800 700,880 800,760 L800,1200 Z" fill="#1c0507"/>
<g transform="translate(0,1200) scale(1,-1)">
<g fill="none" stroke-width="2">
<path d="M100,1200 Q200,900 400,1050 Q600,1180 700,980" stroke="#ef476f" opacity="0.6"/>
<path d="M200,1200 Q350,980 550,1080 Q700,1160 760,1020" stroke="#ffd166" opacity="0.4"/>
</g>
</g>
<g fill="#ef476f" opacity="0.7" filter="url(#soft)">
<ellipse cx="160" cy="620" rx="60" ry="24"/>
<ellipse cx="480" cy="690" rx="80" ry="30"/>
<ellipse cx="690" cy="580" rx="50" ry="18"/>
</g>`
  return doc(defs, body)
}

/* -------------------------------- RELOJ / TIEMPO -------------------------------- */
function reloj() {
  const gears = [
    { cx: 180, cy: 300, r: 90 },
    { cx: 620, cy: 480, r: 120 },
    { cx: 280, cy: 700, r: 70 },
  ]
  const defs = gears
    .map(
      (g, i) => `
<radialGradient id="gear${i}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5eead4" stop-opacity="0.6"/><stop offset="1" stop-color="#0e7490" stop-opacity="0"/></radialGradient>`
    )
    .join('')
  const body = `
<rect width="${W}" height="${H}" fill="#05070e"/>
${starField(103, 50, { ymax: 500 })}
${gears
  .map(
    (g, i) => `
<circle cx="${g.cx}" cy="${g.cy}" r="${g.r}" fill="url(#gear${i})" opacity="0.7"/>
<circle cx="${g.cx}" cy="${g.cy}" r="${g.r * 0.6}" fill="none" stroke="#5eead4" stroke-width="1.5" opacity="0.5" stroke-dasharray="8 6"/>`
  )
  .join('')}
<g fill="none" stroke="#67e8f9" stroke-width="2">
<circle cx="400" cy="520" r="160" opacity="0.6"/>
<circle cx="400" cy="520" r="130" opacity="0.4"/>
<path d="M400,380 L400,520 L470,560" opacity="0.8"/>
<path d="M400,410 L400,520 L330,560" opacity="0.5" stroke-width="1.5"/>
</g>
<path d="M280,1200 Q400,900 400,760 Q400,620 520,520" stroke="none" fill="none" opacity="0.3"/>
<circle cx="400" cy="520" r="10" fill="#67e8f9" opacity="0.9"/>
<path d="M0,1000 C200,940 500,1020 800,960 L800,1200 L0,1200 Z" fill="#0d1220"/>`
  return doc(defs, body)
}

/* -------------------------------- MARTE -------------------------------- */
function marte() {
  const defs = `
<linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0507"/><stop offset="0.55" stop-color="#7a2c1a"/><stop offset="1" stop-color="#ff7a3f"/></linearGradient>
<radialGradient id="msun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffefe0"/><stop offset="0.6" stop-color="#ff9a4a"/><stop offset="1" stop-color="#ff5a26"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#msky)"/>
${starField(106, 35, { ymax: 400 })}
<circle cx="160" cy="150" r="18" fill="#ffd6b0" opacity="0.7"/>
<circle cx="650" cy="120" r="12" fill="#ffd6b0" opacity="0.5"/>
<circle cx="400" cy="640" r="220" fill="#ff8a4a" opacity="0.4" filter="url(#soft)"/>
<circle cx="400" cy="640" r="130" fill="url(#msun)"/>
<path d="M0,780 C160,720 340,760 500,800 C640,830 740,780 800,750 L800,1200 L0,1200 Z" fill="#b3471c"/>
<path d="M0,880 C220,820 420,870 580,910 C700,940 770,890 800,870 L800,1200 L0,1200 Z" fill="#7a2c1a"/>
<path d="M0,1030 C260,970 480,1020 640,1060 L800,1020 L800,1200 L0,1200 Z" fill="#3d1509"/>
<g fill="#2a0d06"><rect x="330" y="828" width="14" height="30" rx="4"/><circle cx="337" cy="826" r="5"/></g>`
  return doc(defs, body)
}

/* -------------------------------- SOLAR -------------------------------- */
function solar() {
  const defs = `
<linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05231a"/><stop offset="1" stop-color="#0a4a2a"/></linearGradient>
<radialGradient id="leaf" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="#6ee7a0" stop-opacity="0.6"/><stop offset="1" stop-color="#0a4a2a" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#ssky)"/>
${starField(107, 25, { ymax: 350 })}
<circle cx="400" cy="380" r="140" fill="#a5d6a7" opacity="0.35" filter="url(#soft)"/>
<circle cx="400" cy="380" r="90" fill="url(#leaf)"/>
<path d="M0,820 C180,700 340,780 520,820 C640,850 740,780 800,750 L800,1200 L0,1200 Z" fill="#0d3a24"/>
<path d="M0,900 C220,840 420,900 580,950 L800,900 L800,1200 L0,1200 Z" fill="#1a5a34"/>
<path d="M0,1050 L120,880 L240,1020 L400,860 L560,1030 L700,880 L800,1050 L800,1200 L0,1200 Z" fill="#0a2e18"/>
<circle cx="200" cy="880" r="30" fill="#6ee7a0" opacity="0.5"/>
<circle cx="600" cy="860" r="20" fill="#6ee7a0" opacity="0.4"/>`
  return doc(defs, body)
}

/* -------------------------------- TRIFIDOS -------------------------------- */
function trifidos() {
  const defs = `
<linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d0a"/><stop offset="1" stop-color="#14210e"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#tsky)"/>
${starField(108, 30, { ymax: 400 })}
<circle cx="400" cy="500" r="150" fill="#84cc16" opacity="0.2" filter="url(#soft)"/>
<g fill="#0f1e0b">
<path d="M100,900 Q200,600 400,750 Q480,810 500,750 Q560,600 700,800 L700,1200 L100,1200 Z"/>
</g>
<g fill="none" stroke="#84cc16" stroke-width="1.5" opacity="0.4">
<path d="M200,600 Q300,400 400,500 Q480,600 500,480"/>
<path d="M500,750 Q600,600 650,700"/>
</g>
<circle cx="400" cy="500" r="90" fill="#365314"/>
<circle cx="400" cy="500" r="40" fill="#84cc16" opacity="0.5"/>
<path d="M0,1000 C200,960 500,1010 800,970 L800,1200 L0,1200 Z" fill="#0e1a0b"/>`
  return doc(defs, body)
}

/* -------------------------------- VAMPIROS -------------------------------- */
function vampiros() {
  const defs = `
<linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070310"/><stop offset="1" stop-color="#16091d"/></linearGradient>
<radialGradient id="moon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fbf0d0"/><stop offset="0.6" stop-color="#f0c9a0"/><stop offset="1" stop-color="#e07e6e"/></radialGradient>
<circle id="bat" cx="0" cy="0" r="1" fill="none"/>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#vsky)"/>
${starField(109, 25, { ymax: 380 })}
<circle cx="620" cy="200" r="80" fill="url(#moon)" opacity="0.8"/>
<circle cx="620" cy="200" r="50" fill="#fbf0d0" opacity="0.9"/>
<g fill="#0a0514"><path d="M0,900 Q150,720 300,850 Q450,980 600,820 Q700,750 800,900 L800,1200 L0,1200 Z"/></g>
<path d="M100,980 Q250,900 400,940 Q550,980 700,920" stroke="#f0c9a0" stroke-width="2" fill="none" opacity="0.3" filter="url(#soft2)"/>
<path d="M50,940 Q180,880 320,920" stroke="#e07e6e" stroke-width="1.5" fill="none" opacity="0.25"/>
<g fill="#1e0d26"><circle cx="150" cy="950" r="40"/><path d="M150,990 Q200,1000 250,950 Q220,1030 150,1030 Q80,1030 50,950 Z"/></g>`
  return doc(defs, body)
}

/* -------------------------------- NANO -------------------------------- */
function nano() {
  const defs = `
<linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030a10"/><stop offset="1" stop-color="#0e1c28"/></linearGradient>
<radialGradient id="particle" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#22d3ee"/><stop offset="0.5" stop-color="#0e7490"/><stop offset="1" stop-color="#0e7490" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#nsky)"/>
${starField(110, 45, { ymax: 500 })}
<rect width="${W}" height="${H}" fill="none"/>
<g stroke="#22d3ee" stroke-width="1" opacity="0.12" fill="none">
<path d="M0,400 L800,400"/><path d="M0,600 L800,600"/><path d="M0,800 L800,800"/>
<path d="M200,0 L200,1200"/><path d="M400,0 L400,1200"/><path d="M600,0 L600,1200"/>
</g>
<g fill="url(#particle)" opacity="0.5">
<circle cx="200" cy="400" r="6"/><circle cx="400" cy="400" r="6"/><circle cx="600" cy="400" r="6"/>
<circle cx="200" cy="600" r="6"/><circle cx="400" cy="600" r="6"/><circle cx="600" cy="600" r="6"/>
<circle cx="300" cy="500" r="4"/><circle cx="500" cy="500" r="4"/>
</g>
<g fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.4">
<path d="M200,400 L400,600 L600,400"/><path d="M400,400 L400,600"/>
<circle cx="400" cy="500" r="80"/>
</g>
<circle cx="400" cy="500" r="10" fill="#22d3ee" opacity="0.8"/>
<path d="M0,1000 C200,960 500,1020 800,960 L800,1200 L0,1200 Z" fill="#060d14"/>`
  return doc(defs, body)
}

/* -------------------------------- ANTARTIDA -------------------------------- */
function antartida() {
  const defs = `
<linearGradient id="asky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1014"/><stop offset="0.5" stop-color="#152a30"/><stop offset="0.8" stop-color="#2a4e58"/><stop offset="1" stop-color="#c2dfe4"/></linearGradient>
<linearGradient id="ice99" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0e2e38"/><stop offset="1" stop-color="#cfe8ee" stop-opacity="0.3"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#asky)"/>
${starField(111, 30, { ymax: 280 })}
<path d="M-20,180 C180,120 400,260 620,160 S800,190 800,180" stroke="#a5d9e2" stroke-width="18" fill="none" opacity="0.3" filter="url(#soft)"/>
<polygon points="0,760 100,620 220,700 350,580 500,720 640,600 760,700 800,620 800,1200 0,1200" fill="#a9c9d4"/>
<polygon points="0,860 140,750 280,820 420,700 580,830 720,750 800,830 800,1200 0,1200" fill="#6d95a5"/>
<polygon points="0,1000 C200,940 420,990 600,960 L800,980 L800,1200 L0,1200 Z" fill="#dcf0f5"/>
<g fill="#16222c"><circle cx="385" cy="1096" r="4"/><rect x="382" y="1100" width="6" height="14" rx="3"/><circle cx="402" cy="1092" r="4"/><rect x="399" y="1096" width="6" height="14" rx="3"/></g>`
  return doc(defs, body)
}

/* -------------------------------- URNAS / ARCHIVO -------------------------------- */
function urnas() {
  const defs = `
<linearGradient id="usky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0606"/><stop offset="1" stop-color="#1c0e0e"/></linearGradient>
<radialGradient id="urn" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#d4a24a" stop-opacity="0.4"/><stop offset="1" stop-color="#d4a24a" stop-opacity="0"/></radialGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#usky)"/>
${starField(112, 25, { ymax: 300 })}
<g fill="#1e0e0c"><rect x="80" y="350" width="140" height="550"/><rect x="260" y="280" width="110" height="620"/><rect x="430" y="320" width="150" height="580"/><rect x="610" y="380" width="130" height="520"/></g>
<g stroke="#d4a24a" stroke-width="1.5" opacity="0.2" fill="none">
<path d="M150,350 L150,900"/><path d="M315,280 L315,900"/><path d="M505,320 L505,900"/><path d="M675,380 L675,900"/>
</g>
<g fill="none" stroke="#d4a24a" stroke-width="1" opacity="0.15">
<rect x="200" y="450" width="60" height="400"/><rect x="420" y="420" width="80" height="480"/>
</g>
<circle cx="400" cy="600" r="130" fill="url(#urn)"/>
<path d="M370,700 L430,700 L410,760 L390,760 Z" fill="#1e0e0c" stroke="#d4a24a" stroke-width="1.5"/>
<path d="M0,1050 C300,1020 500,1050 800,1020 L800,1200 L0,1200 Z" fill="#0e0606"/>`
  return doc(defs, body)
}

/* -------------------------------- ARANAS -------------------------------- */
function aranas() {
  const defs = `
<linearGradient id="arask" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#09060f"/><stop offset="1" stop-color="#14102a"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#arask)"/>
${starField(113, 35, { ymax: 400 })}
<g stroke="#a5b4fc" stroke-width="1" opacity="0.3" fill="none">
<line x1="400" y1="200" x2="200" y2="500"/><line x1="400" y1="200" x2="600" y2="500"/><line x1="400" y1="200" x2="100" y2="700"/><line x1="400" y1="200" x2="700" y2="700"/>
</g>
<g fill="#1a1426">
<ellipse cx="400" cy="520" rx="90" ry="60"/>
<ellipse cx="400" cy="440" rx="55" ry="40"/>
<ellipse cx="400" cy="380" rx="25" ry="20"/>
<path d="M330,540 Q180,640 120,800 M340,560 Q220,720 180,880 M370,570 Q280,780 250,920 M430,570 Q520,780 550,920 M460,560 Q580,720 620,880 M470,540 Q620,640 680,800" stroke="#1a1426" stroke-width="18" fill="none"/>
</g>
<g fill="none" stroke="#818cf8" stroke-width="1" opacity="0.35">
<circle cx="400" cy="520" r="120"/><circle cx="400" cy="520" r="90"/>
</g>
<circle cx="400" cy="520" r="10" fill="#818cf8" opacity="0.6"/>
${starField(114, 20, { ymax: 900 })}`
  return doc(defs, body)
}

/* -------------------------------- SIMIOS -------------------------------- */
function simios() {
  const defs = `
<linearGradient id="smsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0706"/><stop offset="1" stop-color="#1a0e07"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#smsky)"/>
${starField(115, 25, { ymax: 380 })}
<circle cx="400" cy="400" r="140" fill="#d4885a" opacity="0.25" filter="url(#soft)"/>
<circle cx="400" cy="400" r="90" fill="#d4885a" opacity="0.4"/>
<path d="M0,800 C150,700 300,780 480,800 C600,820 700,740 800,760 L800,1200 L0,1200 Z" fill="#1a0e07"/>
<g fill="#120a04">
<path d="M400,660 Q360,560 400,480 Q440,560 400,660"/>
<path d="M340,700 Q300,580 340,500 Q380,580 340,700"/>
<path d="M460,700 Q420,580 460,500 Q500,580 460,700"/>
</g>
<g stroke="#d4885a" stroke-width="1.5" opacity="0.3" fill="none">
<path d="M300,700 Q350,600 400,620"/><path d="M500,700 Q450,600 400,620"/>
</g>
<path d="M0,1020 C200,980 500,1010 800,980 L800,1200 L0,1200 Z" fill="#0e0703"/>`
  return doc(defs, body)
}

/* -------------------------------- DISCO / FLANAGA -------------------------------- */
function disco() {
  const defs = `
<radialGradient id="ssky" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#1c1b5c"/><stop offset="1" stop-color="#070413"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#ssky)"/>
${starField(116, 60, { ymax: 400 })}
<ellipse cx="400" cy="480" rx="280" ry="80" fill="none" stroke="#7dd3fc" stroke-width="2" opacity="0.5" filter="url(#soft2)"/>
<g fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.8">
<path d="M180,420 Q200,460 400,470 Q600,480 620,420" stroke="#7dd3fc" stroke-width="1.5" opacity="0.4"/>
</g>
<g fill="#0e0a1e">
<rect x="360" y="380" width="80" height="100" rx="4"/>
<rect x="330" y="330" width="140" height="60" rx="2"/>
</g>
<ellipse cx="400" cy="340" rx="140" ry="40" fill="#0e0a1e"/>
<g fill="#a78bfa" opacity="0.7">
<ellipse cx="360" cy="480" rx="30" ry="14"/><ellipse cx="440" cy="470" rx="26" ry="12"/>
<ellipse cx="340" cy="490" rx="20" ry="10"/><ellipse cx="460" cy="460" rx="22" ry="10"/>
</g>
<path d="M360,420 Q400,440 440,420" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M0,1000 C200,960 500,1010 800,960 L800,1200 L0,1200 Z" fill="#070413"/>`
  return doc(defs, body)
}

/* -------------------------------- ANILLO -------------------------------- */
function anillo() {
  const defs = `
<radialGradient id="rsky" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1a0b33"/><stop offset="1" stop-color="#060312"/></linearGradient>
<linearGradient id="ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7dd3fc" stop-opacity="0"/><stop offset="0.5" stop-color="#93c5fd"/><stop offset="1" stop-color="#7dd3fc" stop-opacity="0"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#rsky)"/>
${starField(117, 70, { ymax: 600 })}
<g fill="none" stroke="url(#ring)" stroke-width="2" opacity="0.7">
<ellipse cx="400" cy="480" rx="340" ry="100"/><ellipse cx="400" cy="480" rx="300" ry="85"/><ellipse cx="400" cy="480" rx="260" ry="72"/>
</g>
<circle cx="400" cy="480" r="60" fill="#93c5fd" opacity="0.6" filter="url(#soft)"/>
<circle cx="400" cy="480" r="30" fill="#93c5fd"/>
<path d="M0,1050 C300,1010 500,1020 800,1000 L800,1200 L0,1200 Z" fill="#060312"/>`
  return doc(defs, body)
}

/* -------------------------------- CILINDRO -------------------------------- */
function cilindro() {
  const defs = ''
  const body = `
<rect width="${W}" height="${H}" fill="#040309"/>
${starField(118, 80)}
<ellipse cx="400" cy="480" rx="380" ry="120" fill="none" stroke="#d8b4fe" stroke-width="2.5" opacity="0.8"/>
<ellipse cx="400" cy="480" rx="300" ry="92" fill="none" stroke="#d8b4fe" stroke-width="1.5" opacity="0.4"/>
<g fill="none" stroke="#d8b4fe" stroke-width="2" opacity="0.8">
<path d="M20,480 L780,480" stroke-width="0.8" opacity="0.3"/>
</g>
<path d="M0,1050 C400,1020 600,1020 800,1000 L800,1200 L0,1200 Z" fill="#0a0612"/>`
  return doc(defs, body)
}

/* -------------------------------- FLOTA -------------------------------- */
function flota() {
  const defs = ''
  const ships = [[200, 450], [380, 520], [560, 480], [700, 560]]
  const body = `
<rect width="${W}" height="${H}" fill="#050410"/>
${starField(119, 60)}
${ships
  .map(
    ([x, y], i) => `
<g transform="translate(${x},${y}) scale(${0.6 + i * 0.15})">
<polygon points="0,0 30,8 0,16 0,0" fill="#f472b6" opacity="0.8"/>
<polygon points="0,4 20,8 0,12" fill="#1a0a1c"/>
<ellipse cx="15" cy="8" rx="18" ry="5" fill="none" stroke="#f472b6" stroke-width="0.8" opacity="0.4"/>
</g>`
  )
  .join('')}
<ellipse cx="400" cy="520" rx="360" ry="60" fill="none" stroke="#f472b6" stroke-width="1" opacity="0.3" filter="url(#soft2)"/>`
  return doc(defs, body)
}

/* -------------------------------- ESTATICO / FALLBACK -------------------------------- */
function estatico() {
  const defs = `
<radialGradient id="esk" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#1a1c33"/><stop offset="1" stop-color="#070912"/></linearGradient>`
  const body = `
<rect width="${W}" height="${H}" fill="url(#esk)"/>
${starField(120, 100)}
<circle cx="400" cy="480" r="140" fill="none" stroke="#c4b5fd" stroke-width="1.5" opacity="0.3" filter="url(#soft2)"/>
<circle cx="400" cy="480" r="80" fill="none" stroke="#c4b5fd" stroke-width="1" opacity="0.2"/>
<path d="M0,1050 C300,1020 500,1030 800,1010 L800,1200 L0,1200 Z" fill="#070912"/>`
  return doc(defs, body)
}

/* --------------------------------- runner --------------------------------- */
const scenes = {
  dune, fundacion, neuromante, solaris, odisea, oscuridad, hyperion, trisolaris,
  distopia, llamas, reloj, marte, solar, trifidos, vampiros, nano, antartida,
  urnas, aranas, simios, disco, anillo, cilindro, flota, estatico,
}

mkdirSync(OUT_DIR, { recursive: true })
for (const [name, scene] of Object.entries(scenes)) {
  writeFileSync(join(OUT_DIR, `${name}.svg`), scene(), 'utf8')
  console.log(`✓ covers/${name}.svg`)
}
console.log(`\n${Object.keys(scenes).length} portadas generadas en public/covers/`)
