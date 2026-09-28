import { useEffect, useState } from 'react'

const KEY = 'scifi:v1:bitacora'
const EVENT = 'scifi:bitacora-change'
let memoryLog = { books: {} }

export function getReadingLog() {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) || 'null')
    if (value && value.version === 1 && value.books && typeof value.books === 'object') {
      memoryLog = { books: value.books }
    }
  } catch {
    // La bitácora conserva su estado en memoria si el almacenamiento no está disponible.
  }
  return memoryLog
}

export function updateReadingLog(code, patch) {
  const current = getReadingLog()
  const previous = current.books[code] || { status: '', favorite: false }
  const next = { books: { ...current.books, [code]: { ...previous, ...patch } } }
  memoryLog = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: 1, ...next }))
  } catch {
    // La interfaz sigue operativa durante esta sesión.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
  return next
}

export function replaceReadingLog(value) {
  const books = value?.version === 1 && value.books && typeof value.books === 'object' ? value.books : null
  if (!books || Object.values(books).some((record) => !record || !['', 'read', 'reading', 'pending'].includes(record.status || '') || typeof (record.favorite || false) !== 'boolean')) {
    throw new Error('El archivo no tiene un formato de bitácora SCIFIUNIVERSE válido.')
  }
  memoryLog = { books }
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: 1, books }))
  } catch {
    // La importación actual sigue disponible en memoria.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: memoryLog }))
}

export function useReadingLog() {
  const [log, setLog] = useState(() => getReadingLog())
  useEffect(() => {
    const sync = (event) => setLog(event.detail || getReadingLog())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return log
}
