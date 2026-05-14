import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOG } from '@/utils/og/render';
import { siteConfig } from '@/site.config';

const PAGES = {
  default: {
    title:       siteConfig.title,
    description: siteConfig.description,
  },
  about: {
    title:       'About',
    description: `${siteConfig.author} — ${siteConfig.description}`,
  },
  search: {
    title:       'Search',
    description: `Search across all posts on ${siteConfig.title}`,
  },
  uses: {
    title:       'Uses',
    description: 'Hardware, software, tools, and systems used daily.',
  },
  now: {
    title:       'Now',
    description: 'What I am currently focused on, exploring, and working through.',
  },
  archive: {
    title:       'Archive',
    description: 'Travel writing from across India and the world — forts, roads, cities, and everything in between.',
  },
} as const;

type PageKey = keyof typeof PAGES;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(PAGES).map((page) => ({ params: { page } }));

export const GET: APIRoute = async ({ params }) => {
  const page = params.page as PageKey;
  const data = PAGES[page];

  if (!data) return new Response('Not found', { status: 404 });

  return renderOG({
    title:       data.title,
    description: data.description,
  });
};