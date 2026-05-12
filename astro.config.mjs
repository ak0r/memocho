// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import remarkCallouts from './src/utils/remark-callouts';
import { remarkObsidianCore } from './src/utils/remark-obsidian-core';
import { remarkImageProcessing } from './src/utils/remark-image-processing';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({

  site: 'https://memocho.amitkul.in',

  image: {
    responsiveStyles: true,
    // layout: "constrained"
  },

  experimental: {
    contentIntellisense: true,
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
  },

  security: {
    contentSecurityPolicy: {
      directives: {
        // 'self' covers same-origin scripts including /pagefind/pagefind-ui.js
        // Astro auto-nonces is:inline scripts when CSP is enabled
        // Cloudflare Web Analytics beacon scrip
        "script-src": ["'self'", "https://static.cloudflareinsights.com"],
        // 'unsafe-inline' needed for Pagefind UI's dynamically injected result styles
        "style-src": ["'self'", "'unsafe-inline'"],
        // Pagefind fetches the search index via XHR
        // Cloudflare Analytics reports back to cloudflareinsights.com
        "connect-src": ["'self'", "https://cloudflareinsights.com"],
        // Pagefind uses a Web Worker for indexing
        "worker-src": ["'self'", "blob:"],
      },
    },
  },

  fonts: [
    {
      name: "Newsreader",
      cssVariable: "--font-headings",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["sans-serif"],
    },
    {
      name: "Poppins",
      cssVariable: "--font-primary",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["sans-serif"],
    },
    {
      name: "Rubik",
      cssVariable: "--font-secondary",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["serif"],
    },
    {
      name: "Fira Code",
      cssVariable: "--font-code",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["monospace"],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    remarkPlugins: [
      remarkObsidianCore,
      remarkImageProcessing,
      remarkCallouts,
    ],
  },
});