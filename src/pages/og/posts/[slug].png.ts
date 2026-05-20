import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPosts, getPostSlug } from '@/utils/content.utils';
import { renderOG } from '@/utils/og/render';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  return posts.map((entry) => ({
    params: { slug: getPostSlug(entry) },
    props: {
      title:       entry.data.title,
      description: entry.data.description ?? '',
      label:       entry.data.theme?.[0] ?? entry.data.category ?? '',
      tags:        entry.data.tags ?? [],
      date:        entry.data.published.toLocaleDateString('en-US', {
        year:  'numeric',
        month: 'short',
        day:   'numeric',
      }),
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, label, tags, date } = props as {
    title:        string;
    description?: string;
    label?:       string;
    tags?:        string[];
    date:         string;
  };

  return renderOG({ title, description, label, tags, date, accent: '' });
};