import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// postmonster: public marketing site (PRD A1). Fully static, no adapters.
export default defineConfig({
  site: 'https://postmonster.xyz',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /login is a redirect stub (noindex) — not for crawlers
      filter: (page) => !new URL(page).pathname.startsWith('/login'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // no data: URIs in CSS — strict CSP (font-src/img-src 'self') stays clean
      assetsInlineLimit: 0,
    },
  },
});
