// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import remarkCallouts from './src/utils/remark-callouts';
import { remarkObsidianCore } from './src/utils/remark-obsidian-core';
import { remarkImageProcessing } from './src/utils/remark-image-processing';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config.ts';

import sitemap from "@astrojs/sitemap";

import expressiveCode from "astro-expressive-code";

import mdx from "@astrojs/mdx";

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

  integrations: [
    // Expressive Code must come before MDX
    expressiveCode({
      // Matches your data-theme attribute toggle
      themes: ['everforest-dark', 'everforest-light'],
      themeCssSelector: (theme) => 
        theme.name === 'everforest-dark' ? '[data-theme="dark"]' : '[data-theme="light"]',
    }),
    mdx(), 
    sitemap({
      serialize(item) {
        const base = siteConfig.url.replace(/\/$/, '');

        if (item.url === base + '/')                                     return { ...item, priority: 1.0 };
        if (/\/(travel|tech|destinations)\/$/.test(item.url))            return { ...item, priority: 0.9 };
        if (/\/destinations\/[^/]+\/$/.test(item.url))                   return { ...item, priority: 0.8 };
        if (/\/(travel|tech)\/[^/]+\/$/.test(item.url))                  return { ...item, priority: 0.7 };
        if (/\/(about|search)\/$/.test(item.url))                        return { ...item, priority: 0.5 };
        return { ...item, priority: 0.3 };
      },
    })
  ],
});