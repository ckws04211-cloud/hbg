import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function siteOrigin(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'https://hbg-ashen.vercel.app'
}

function siteMetaPlugin(): Plugin {
  const origin = siteOrigin()

  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('__SITE_ORIGIN__', origin)
        .replaceAll('__OG_IMAGE__', `${origin}/og-image.jpg`)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetaPlugin()],
})
