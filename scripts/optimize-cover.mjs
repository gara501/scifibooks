import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const [, , input, output] = process.argv
if (!input || !output) throw new Error('Uso: node scripts/optimize-cover.mjs <entrada> <salida.webp>')

mkdirSync(dirname(output), { recursive: true })
await sharp(input)
  .resize(800, 1200, { fit: 'cover', position: 'centre' })
  .webp({ quality: 84, effort: 5, smartSubsample: true })
  .toFile(output)
