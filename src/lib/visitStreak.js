import { useEffect, useState } from 'react'

const KEY = 'scifi:v1:visitas'
const EVENT = 'scifi:visit-change'
let memory = { visits: 0, streak: 0, lastDate: '' }

function bogotaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return `${parts.find((part) => part.type === 'year').value}-${parts.find((part) => part.type === 'month').value}-${parts.find((part) => part.type === 'day').value}`
}

export function recordVisit() {
  const today = bogotaToday()
  let saved = memory
  try {
    const candidate = JSON.parse(window.localStorage.getItem(KEY) || 'null')
    if (candidate?.version === 1) saved = candidate
  } catch {}
  if (saved.lastDate !== today) {
    const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10)
    memory = { visits: (saved.visits || 0) + 1, streak: saved.lastDate === yesterday ? (saved.streak || 0) + 1 : 1, lastDate: today }
    try { window.localStorage.setItem(KEY, JSON.stringify({ version: 1, ...memory })) } catch {}
  } else memory = saved
  window.dispatchEvent(new CustomEvent(EVENT, { detail: memory }))
  return memory
}

export function useVisitStreak() {
  const [state, setState] = useState(memory)
  useEffect(() => {
    const sync = (event) => setState(event.detail || memory)
    window.addEventListener(EVENT, sync)
    setState(recordVisit())
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return state
}
