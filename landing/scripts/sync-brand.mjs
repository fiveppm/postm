// postmonster: copies brand assets (favicons, logo, OG) from the app fork's
// generated set (app/apps/frontend/public, built by brand/build-assets.mjs)
// into landing/public/. If the app fork is not present, only the SVG sources
// from brand/ are copied.
//
// Usage (from landing/):
//   node scripts/sync-brand.mjs

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = join(root, 'public');
// Brand assets are generated into the app frontend's public dir by
// brand/build-assets.mjs. Path works in both layouts (app repo / workspace).
const appPublic = [
  resolve(root, '..', 'apps', 'frontend', 'public'),
  resolve(root, '..', 'app', 'apps', 'frontend', 'public'),
].find((p) => existsSync(p));
const brandDir = [
  resolve(root, '..', 'brand'),
  resolve(root, '..', '..', 'brand'),
  resolve(root, '..', 'app', 'brand'),
].find((p) => existsSync(p));

mkdirSync(out, { recursive: true });

const fromApp = [
  'favicon.ico',
  'favicon.svg',
  'favicon.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'og.png',
];

let copied = 0;
for (const f of fromApp) {
  const src = appPublic ? join(appPublic, f) : null;
  if (src && existsSync(src)) {
    copyFileSync(src, join(out, f));
    copied++;
  }
}

for (const f of ['logo-mark.svg', 'logo-lockup-light.svg', 'logo-lockup-dark.svg']) {
  const src = brandDir ? join(brandDir, f) : null;
  if (src && existsSync(src)) {
    copyFileSync(src, join(out, f));
    copied++;
  }
}

// Static robots.txt (sitemap URL is fixed: single production domain).
if (!existsSync(join(out, 'robots.txt'))) {
  writeFileSync(
    join(out, 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      '',
      'Sitemap: https://postmonster.xyz/sitemap-index.xml',
      '',
    ].join('\n')
  );
  copied++;
}

console.log(`sync-brand: ${copied} files -> landing/public`);
if (copied < 3) {
  console.warn('sync-brand: warning — app/brand assets not found, favicons may be missing');
}
