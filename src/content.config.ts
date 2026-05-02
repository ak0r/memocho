import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { travelSchema, techSchema, pageSchema } from '@/schemas';

const travel = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/travels' }),
  schema: travelSchema,
});

const tech = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tech' }),
  schema: techSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: pageSchema,
});

export const collections = { travel, tech, pages };