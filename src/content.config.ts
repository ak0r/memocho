import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().optional(),
    theme: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    countries: z.array(z.string()).optional(),
    region: z.string().optional(),
    places: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    lang: z.string().optional(),
  })
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.string().optional(),
  })
});

export const collections = {
   posts: postsCollection,
  pages: pagesCollection,
};