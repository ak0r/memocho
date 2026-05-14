import type { APIRoute, GetStaticPaths } from 'astro';

import { getCollection } from 'astro:content';

import { renderOG } from '@/utils/og/render';
import { collectionTheme } from '@/utils/og/theme';

const COLLECTIONS = ['travels', 'tech'] as const;

export const getStaticPaths: GetStaticPaths = async () => {

  const allEntries = await Promise.all(
    COLLECTIONS.map((collection) => getCollection(collection))
  );

  return allEntries.flat().map((entry) => ({
    params: {
      collection: entry.collection,
      slug: entry.id,
    },

    props: {
      collection: entry.collection,

      title: entry.data.title,

      description: entry.data.description ?? '',

      date: entry.data.published.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {

  const {
    collection,
    title,
    description,
    date,
  } = props as {
    collection: string;

    title: string;
    description?: string;

    date: string;
  };

  const theme = collectionTheme(collection);

  return renderOG({
    title,
    description,
    date,

    accent: theme.accent,
    badgeBg: theme.badgeBg,
    label: theme.label,
  });
};