export function getBookMediaUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url : null
  } catch {
    return null
  }
}

export function getTikTokEmbedUrl(value) {
  const url = getBookMediaUrl(value)
  if (!url || !['www.tiktok.com', 'tiktok.com'].includes(url.hostname)) return null
  const match = /^\/@[\w.-]+\/(?:video|photo)\/(\d+)\/?$/.exec(url.pathname)
  return match ? `https://www.tiktok.com/player/v1/${match[1]}?autoplay=0&rel=0&description=1` : null
}
