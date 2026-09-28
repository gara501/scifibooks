export async function shareImageCard(title, text, suffix = 'scifiuniverse') {
  const escape = (value) => String(value).replace(/[<>&\"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;', "'": '&apos;' })[char])
  const lines = String(text).split(/\r?\n/).flatMap((line) => line.match(/.{1,46}(?:\s|$)/g) || [line])
  const svgLines = lines.slice(0, 5).map((line, index) => `<text x="72" y="280" dy="${index * 58}" fill="#eee9dc" font-family="monospace" font-size="28">${escape(line.trim())}</text>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0d0b06"/><path d="M0 500h1200M0 506h1200" stroke="#d2a84a" stroke-opacity=".2"/><circle cx="1030" cy="130" r="230" fill="none" stroke="#59d9c1" stroke-opacity=".22"/><text x="72" y="90" fill="#d2a84a" font-family="monospace" font-size="24" letter-spacing="7">SCIFIUNIVERSE · ESTACIÓN K-7</text><text x="72" y="196" fill="#d2a84a" font-family="sans-serif" font-size="48" font-weight="700">${escape(title)}</text>${svgLines}<text x="72" y="575" fill="#928c80" font-family="monospace" font-size="17" letter-spacing="4">SCIFIBOOKS.NETLIFY.APP</text></svg>`
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject })
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  canvas.getContext('2d').drawImage(image, 0, 0)
  const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('No se pudo generar la tarjeta.')), 'image/png'))
  const file = new File([blob], `${suffix}.png`, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    await navigator.share({ title, text, files: [file] })
    return 'Tarjeta compartida.'
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
  try { await navigator.clipboard.writeText(text) } catch {}
  return 'Tarjeta descargada; el texto se copió si el navegador lo permite.'
}
