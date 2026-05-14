import type { APIRoute, GetStaticPaths } from 'astro';

import { renderOG } from '@/utils/og/render';
import { collectionTheme } from '@/utils/og/theme';

import { siteConfig } from '@/site.config';

const PAGES = {

  default: {
    title: siteConfig.title,
    description: siteConfig.description,
  },

  about: {
    title: 'About',
    description: `${siteConfig.author} — ${siteConfig.description}`,
  },

  search: {
    title: 'Search',
    description: `Search across all posts on ${siteConfig.title}`,
  },

  uses: {
    title: 'Uses',
    description: 'Hardware, software, tools, and systems used daily.',
  },

  now: {
    title: 'Now',
    description: 'What I am currently focused on, exploring, and working through.',
  },

  travels: {
    title: 'Travels',
    description:
      'Travel writing from across India and the world — forts, roads, cities, and everything in between.',
  },

  tech: {
    title: 'Tech',
    description:
      'Notes on building things — self-hosted infrastructure, developer tooling, and systems that stay out of the way.',
  },

} as const;

type PageKey = keyof typeof PAGES;

export const getStaticPaths: GetStaticPaths = () => {

  return Object.keys(PAGES).map((page) => ({
    params: { page },
  }));
};

export const GET: APIRoute = async ({ params }) => {

  const page = params.page as PageKey;

  const data = PAGES[page];

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const collection =
    page === 'travels'
      ? 'travels'
      : page === 'tech'
        ? 'tech'
        : undefined;

  const theme = collectionTheme(collection);

  return renderOG({
    title: data.title,
    description: data.description,

    accent: theme.accent,
    badgeBg: theme.badgeBg,
    label: theme.label,
  });
};