import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = resolve('src/data/books.json')
const books = JSON.parse(readFileSync(file, 'utf8'))
const errors = []
const seen = new Set()
const required = ['code', 'slug', 'title', 'author', 'year', 'tag', 'desc', 'chars', 'cover', 'hue']

for (const [index, book] of books.entries()) {
  const row = `libro ${index + 1}${book.code ? ` (${book.code})` : ''}`
  for (const field of required) {
    if (book[field] === undefined || book[field] === null || book[field] === '') {
      errors.push(`${row}: falta el campo requerido "${field}"`)
    }
  }
  if (!Array.isArray(book.chars)) errors.push(`${row}: "chars" debe ser un arreglo`)
  if (book.code) {
    if (seen.has(book.code)) errors.push(`${row}: code duplicado`)
    seen.add(book.code)
    const match = /^SF-(\d{3})$/.exec(book.code)
    if (!match || Number(match[1]) !== index + 1) {
      errors.push(`${row}: code debe ser SF-${String(index + 1).padStart(3, '0')} para mantener la secuencia`)
    }
    if (book.slug !== book.code.toLowerCase()) errors.push(`${row}: slug debe derivarse del code en minúsculas`)
  }
  if (book.cover && !existsSync(resolve('public', book.cover.replace(/^\//, '')))) {
    errors.push(`${row}: no existe la portada "${book.cover}"`)
  }
}

if (errors.length) {
  console.error(`Validación fallida: ${errors.length} error(es)`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Validación correcta: ${books.length} libros, codes únicos y consecutivos, campos y portadas presentes.`)
}
