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

export function useReadingLog() {
  const [log, setLog] = useState(() => getReadingLog())
  useEffect(() => {
    const sync = (event) => setLog(event.detail || getReadingLog())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return log
}
