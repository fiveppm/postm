// postmonster: sync check for landing/src/data/networks.ts against the
// integration registry of the app fork (PRD 5.3).
//
// Usage (from landing/):
//   node scripts/sync-networks.mjs           # check, exit 1 on drift
//
// Rules:
//   - every *.provider.ts identifier must have a networks.ts entry (slug)
//   - every networks.ts entry must exist in code (no invented networks)
//   - duplicate slugs are an error
// If app/ is not cloned next to landing/, the check is skipped with a notice.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const landingRoot = resolve(__dirname, '..');
// Works both in the app repo (landing/ next to libraries/) and in a workspace
// checkout where the app fork lives in ../app.
const providersDir = [
  resolve(landingRoot, '..', 'libraries', 'nestjs-libraries', 'src', 'integrations', 'social'),
  resolve(landingRoot, '..', 'app', 'libraries', 'nestjs-libraries', 'src', 'integrations', 'social'),
].find((p) => existsSync(p));
const networksFile = join(landingRoot, 'src', 'data', 'networks.ts');

const IDENTIFIER_RE = /^\s*(?:override\s+)?identifier\s*=\s*'([^']+)'/m;

function codeIdentifiers() {
  const files = readdirSync(providersDir).filter((f) => f.endsWith('.provider.ts'));
  const ids = new Map();
  for (const f of files) {
    const src = readFileSync(join(providersDir, f), 'utf8');
    const m = src.match(IDENTIFIER_RE);
    if (!m) {
      console.error(`sync-networks: no identifier found in ${f}`);
      process.exit(1);
    }
    if (ids.has(m[1])) {
      console.error(
        `sync-networks: duplicate identifier '${m[1]}' (${f} and ${ids.get(m[1])})`
      );
      process.exit(1);
    }
    ids.set(m[1], f);
  }
  return ids;
}

function dataSlugs() {
  const src = readFileSync(networksFile, 'utf8');
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) {
    console.error(`sync-networks: duplicate slugs in networks.ts: ${[...new Set(dupes)].join(', ')}`);
    process.exit(1);
  }
  return new Set(slugs);
}

if (!providersDir) {
  console.warn(
    'sync-networks: app fork not found next to landing/ — skipping check (run it where libraries/nestjs-libraries exists)'
  );
  process.exit(0);
}

const code = codeIdentifiers();
const data = dataSlugs();

const missing = [...code.keys()].filter((id) => !data.has(id));
const extra = [...data].filter((slug) => !code.has(slug));

if (missing.length) {
  console.error('sync-networks: networks.ts is missing providers from code:');
  for (const id of missing) console.error(`  + ${id}  (${code.get(id)})`);
}
if (extra.length) {
  console.error('sync-networks: networks.ts has entries with no provider in code:');
  for (const slug of extra) console.error(`  - ${slug}`);
}
if (missing.length || extra.length) {
  process.exit(1);
}

console.log(
  `sync-networks: OK — ${data.size} networks match ${code.size} providers in ${providersDir}`
);
