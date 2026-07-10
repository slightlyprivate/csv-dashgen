import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
) as { version: string }

const APP_TITLE = 'Spread Your Sheets — Private CSV Explorer'
const APP_DESCRIPTION =
  'Upload a CSV or TSV file and quickly explore summaries, column profiles, and chart ideas. Spread Your Sheets processes your data locally in your browser.'

/**
 * Bakes environment-driven SEO tags (canonical/robots/OG/Twitter/JSON-LD)
 * into the built index.html at build time, since social/crawler bots don't
 * execute the app's JS to pick up tags set at runtime.
 */
function seoHtmlPlugin(env: Record<string, string>): Plugin {
  const isIndexable = env.VITE_INDEXABLE === 'true'
  const canonicalUrl = (
    env.VITE_CANONICAL_URL || 'http://localhost:5174'
  ).replace(/\/+$/, '')
  const ogImage = `${canonicalUrl}/og-image.png`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Spread Your Sheets',
    description: APP_DESCRIPTION,
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    creator: { '@type': 'Person', name: 'Matt Hall' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const tags = [
    `<meta name="robots" content="${isIndexable ? 'index, follow' : 'noindex, nofollow'}">`,
    `<link rel="canonical" href="${canonicalUrl}/">`,
    `<meta name="application-name" content="Spread Your Sheets">`,
    `<meta name="apple-mobile-web-app-title" content="Spread Your Sheets">`,
    `<meta name="apple-mobile-web-app-capable" content="yes">`,
    `<meta name="mobile-web-app-capable" content="yes">`,
    `<meta name="theme-color" content="#f8f9fb" media="(prefers-color-scheme: light)">`,
    `<meta name="theme-color" content="#0c0e13" media="(prefers-color-scheme: dark)">`,
    `<link rel="manifest" href="/manifest.webmanifest">`,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Spread Your Sheets">`,
    `<meta property="og:title" content="${APP_TITLE}">`,
    `<meta property="og:description" content="${APP_DESCRIPTION}">`,
    `<meta property="og:url" content="${canonicalUrl}/">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Spread Your Sheets — private CSV explorer">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${APP_TITLE}">`,
    `<meta name="twitter:description" content="${APP_DESCRIPTION}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join('\n    ')

  return {
    name: 'seo-meta-inject',
    transformIndexHtml(html) {
      return html.replace('</title>', `</title>\n    ${tags}`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), seoHtmlPlugin(env)],
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || pkg.version),
    },
  }
})
