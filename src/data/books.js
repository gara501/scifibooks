import records from './books.json'

export const books = records
export const tags = [...new Set(books.map((book) => book.tag))].sort((a, b) => a.localeCompare(b, 'es'))
