import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['favicon.svg', 'pwa-icon.svg', 'covers/**/*'],
    manifest: {
      name: 'SCIFIUNIVERSE', short_name: 'SCIFIUNIVERSE', description: 'Archivo estelar de ciencia ficción · Estación K-7',
      start_url: '/', display: 'standalone', background_color: '#0d0b06', theme_color: '#0d0b06',
      icons: [{ src: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
    },
    workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webp,woff,woff2,json}'], globIgnores: ['og/**'], runtimeCaching: [{
      urlPattern: ({ request }) => request.mode === 'navigate', handler: 'NetworkFirst', options: { cacheName: 'scifi-pages', networkTimeoutSeconds: 3, expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 } },
    }] },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
