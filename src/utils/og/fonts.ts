import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Satori requires TTF or OTF — not WOFF/WOFF2.
//
// Strategy: read from node_modules/@fontsource/rubik (already installed for
// Astro font config). Falls back to Fontsource API if files aren't present
// (e.g. in environments where devDependencies are pruned).
//
// Module-level cache — loaded once per build across all OG generations.

let _fontsCache: { regular: Buffer | ArrayBuffer; semiBold: Buffer | ArrayBuffer } | null = null;

const FONTSOURCE_API = 'https://api.fontsource.org/v1/fonts/rubik';

async function loadFromApi(): Promise<{ regular: ArrayBuffer; semiBold: ArrayBuffer }> {
  const [regular, semiBold] = await Promise.all([
    fetch(`${FONTSOURCE_API}/latin-400-normal.ttf`).then(r => r.arrayBuffer()),
    fetch(`${FONTSOURCE_API}/latin-600-normal.ttf`).then(r => r.arrayBuffer()),
  ]);
  return { regular, semiBold };
}

function loadFromNodeModules(): { regular: Buffer; semiBold: Buffer } {
  const filesDir = join(process.cwd(), 'node_modules/@fontsource/rubik/files');
  return {
    regular:  readFileSync(join(filesDir, 'rubik-latin-400-normal.ttf')),
    semiBold: readFileSync(join(filesDir, 'rubik-latin-600-normal.ttf')),
  };
}

export async function loadFonts() {
  if (_fontsCache) return _fontsCache;

  try {
    _fontsCache = loadFromNodeModules();
  } catch {
    console.warn('[og/fonts] node_modules fonts not found, falling back to Fontsource API');
    _fontsCache = await loadFromApi();
  }

  return _fontsCache;
}