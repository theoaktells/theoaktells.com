// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://theoaktells.com',
  integrations: [sitemap({
    lastmod: new Date(Date.now())
  })],
  redirects: {
    '/over': '/about'
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
