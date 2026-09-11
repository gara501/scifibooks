const scenarioRules = [
  ['CIBERESPACIO', /cyber|hacker|matriz|digital|implante|datos|simstim|cibern/i],
  ['MARTE', /marte|marcian|malacandra/i],
  ['NAVE / ESTACIÓN', /nave|estación|carguero|acorazado|tripulación|astronauta|órbita|asteroide/i],
  ['POSTAPOCALIPSIS', /postapocal|holocausto|pandemia|colapso|guerra nuclear|superviv|tierra moribunda|cataclismo/i],
  ['FUTURO URBANO', /ciudad|megacorpor|distop|totalitari|sociedad futura|rascacielos|metro/i],
  ['TIEMPO ALTERADO', /tiempo|temporal|ucronía|historia alternativa|universo paralelo|época/i],
  ['PLANETA ALIENÍGENA', /planeta|mundo alien|terraform|colonia|extraterrestre|alienígena/i],
  ['ESPACIO PROFUNDO', /galax|interestelar|cosmos|sistema solar|estrella|universo|space opera/i],
]

const hardSignals = /dura|hard sci-fi|astrofísica|cosmología|terraformación|ingenier|nanopunk|supervivencia espacial|artefacto alienígena/i
const softSignals = /blanda|sociológica|antropológica|filosófica|poética|lingüística|satírica|utopía|distopía feminista|new wave/i

export const scenarioOptions = [...scenarioRules.map(([name]) => name), 'TIERRA / OTRO']

export function getBookCoordinates(book) {
  const corpus = `${book.title} ${book.tag} ${book.desc}`
  const scenario = scenarioRules.find(([, pattern]) => pattern.test(corpus))?.[0] ?? 'TIERRA / OTRO'
  const hard = hardSignals.test(book.tag)
  const soft = softSignals.test(book.tag)
  const hardness = hard && !soft ? 'HARD SF' : soft && !hard ? 'SOFT SF' : 'HÍBRIDA'
  const genre = book.tag.split('/')[0].trim()
  return { scenario, hardness, genre }
}

export const genreOptions = (books) => [...new Set(books.map((book) => getBookCoordinates(book).genre))].sort()
