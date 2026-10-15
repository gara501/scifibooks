import { readingProfiles } from '../data/readingProfiles.js'
import { getBookCoordinates } from './bookCoordinates.js'

export function getComparisonProfile(book) {
  if (!book) return null
  return { ...getBookCoordinates(book), themes: book.tag.split('/').map((tag) => tag.trim()), ...readingProfiles[book.code] }
}

export function resolveComparison(books, params) {
  const defaults = !params.has('a') && !params.has('b')
  const find = (value) => books.find((book) => book.slug === value) || null
  const left = find(defaults ? 'sf-002' : params.get('a'))
  const right = find(defaults ? 'sf-005' : params.get('b'))
  return [left, right?.code === left?.code ? null : right]
}

export function comparisonPath(left, right) {
  const params = new URLSearchParams({ a: left?.slug || '', b: right?.slug || '' })
  return `/comparar?${params}`
}

export function filterComparisonBooks(books, query, excludedCode) {
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
  const needle = normalize(query.trim())
  return books.filter((book) => book.code !== excludedCode && normalize(`${book.title} ${book.author} ${book.code}`).includes(needle))
}
