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
  site: 'https://amitkul.in',

  image: {
    responsiveStyles: true,
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
        "script-src": ["'self'", "https://static.cloudflareinsights.com"],
        "style-src":  ["'self'", "'unsafe-inline'"],
        "connect-src":["'self'", "https://cloudflareinsights.com"],
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
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [
      remarkObsidianCore,
      remarkImageProcessing,
      remarkCallouts,
    ],
  },

  integrations: [
    expressiveCode({
      themes: ['everforest-dark', 'everforest-light'],
      themeCssSelector: (theme) =>
        theme.name === 'everforest-dark' ? '[data-theme="dark"]' : '[data-theme="light"]',
    }),
    mdx(),
    sitemap({
      // Exclude OG image routes — not content pages
      filter: (page) => !page.includes('/og/'),

      serialize(item) {
        const base = siteConfig.url.replace(/\/$/, '');

        // Home
        if (item.url === base + '/')
          return { ...item, priority: 1.0, changefreq: 'weekly' };

        // Archive listing
        if (item.url === base + '/archive/')
          return { ...item, priority: 0.9, changefreq: 'weekly' };

        // Static pages
        if (/\/(about|now|uses|search)\/$/.test(item.url))
          return { ...item, priority: 0.5, changefreq: 'monthly' };

        // Individual posts — everything else at root slug level
        return { ...item, priority: 0.7, changefreq: 'monthly' };
      },
    }),
  ],
});
