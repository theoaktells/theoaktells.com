// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://theoaktells.com',
  integrations: [
      sitemap({
          lastmod: new Date(Date.now()),
          i18n: {
            defaultLocale: 'nl',
            locales: {
              nl: 'nl-NL',
              en: 'en-US'
            },
        },
      }),
      react()
  ],
  redirects: {
    '/over': '/about'
  },
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    routing: {
      fallbackType: 'rewrite',
      prefixDefaultLocale: false
    },
    fallback: {
      en: 'nl'
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
