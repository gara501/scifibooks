import { books } from '@/data/books'

export const LAUNCH_DATE = import.meta.env.VITE_LAUNCH_DATE || '2026-09-28'
const STORAGE_KEY = 'scifi:v1:diario'
let memory = { games: {} }

function hashSeed(seed) {
  let value = seed >>> 0
  return () => {
    value += 0x6D2B79F5
    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

const dailyOrder = [...books]
const random = hashSeed(0x4B3707)
for (let index = dailyOrder.length - 1; index > 0; index -= 1) {
  const other = Math.floor(random() * (index + 1))
  ;[dailyOrder[index], dailyOrder[other]] = [dailyOrder[other], dailyOrder[index]]
}

export function dateInBogota(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  return `${parts.find((part) => part.type === 'year').value}-${parts.find((part) => part.type === 'month').value}-${parts.find((part) => part.type === 'day').value}`
}

export function getTransmission(dateKey) {
  const day = Math.floor((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${LAUNCH_DATE}T00:00:00Z`)) / 86400000)
  if (!Number.isFinite(day) || day < 0) return null
  return { book: dailyOrder[day % dailyOrder.length], number: day + 1, day }
}

export function todayInBogota() {
  return dateInBogota()
}

export function getHomeTransmission(dateKey) {
  const day = Math.floor((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${LAUNCH_DATE}T00:00:00Z`)) / 86400000)
  if (!Number.isFinite(day) || day < 0) return null
  return { book: dailyOrder[(day + 37) % dailyOrder.length], day }
}

export function nextTransmissionAt(now = new Date()) {
  const today = dateInBogota(now)
  const [year, month, day] = today.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + 1, 5, 0, 0))
}

export function getDailyGames() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.version === 1 && saved.games && typeof saved.games === 'object') memory = { games: saved.games }
  } catch {
    // Las partidas se mantienen durante la sesión si localStorage no está disponible.
  }
  return memory
}

export function saveDailyGame(dateKey, game) {
  memory = { games: { ...getDailyGames().games, [dateKey]: game } }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...memory }))
    window.localStorage.setItem('scifi:v1:diario-jugado', '1')
  } catch {
    // El juego permanece operativo durante esta sesión.
  }
  window.dispatchEvent(new Event('scifi:daily-played'))
  return memory
}

export function getDailyStats() {
  const finished = Object.entries(getDailyGames().games).filter(([, game]) => game.complete).sort(([a], [b]) => a.localeCompare(b))
  const wins = finished.filter(([, game]) => game.won)
  const dates = new Set(wins.map(([date]) => date))
  const today = todayInBogota()
  let currentStreak = 0
  const resultToday = finished.find(([date]) => date === today)?.[1]
  let cursor = resultToday && !resultToday.won ? null : Date.parse(`${today}T00:00:00Z`) - (dates.has(today) ? 0 : 86400000)
  while (cursor !== null && dates.has(new Date(cursor).toISOString().slice(0, 10))) {
    currentStreak += 1
    cursor -= 86400000
  }
  let maxStreak = 0
  let run = 0
  let previous = null
  for (const date of [...dates].sort()) {
    const day = Date.parse(`${date}T00:00:00Z`)
    run = previous !== null && day - previous === 86400000 ? run + 1 : 1
    maxStreak = Math.max(maxStreak, run)
    previous = day
  }
  const distribution = Array(6).fill(0)
  for (const [, game] of wins) distribution[Math.max(0, Math.min(5, game.guesses.length - 1))] += 1
  return { played: finished.length, wins: wins.length, winRate: finished.length ? Math.round((wins.length / finished.length) * 100) : 0, currentStreak, maxStreak, distribution }
}

export function normalizeTitle(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim().replace(/\s+/g, ' ')
}

export function dailyHints(book) {
  const decade = `${Math.floor(book.year / 10) * 10}s`
  const censor = (value) => {
    let result = book.desc
    for (const name of [book.title, ...book.chars].sort((a, b) => b.length - a.length)) {
      result = result.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '█████')
    }
    return result
  }
  return [book.tag, decade, String(book.year), book.chars[0], censor(), book.author]
}
