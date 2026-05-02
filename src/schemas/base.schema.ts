import { z } from 'astro/zod';

/**
 * Base schema — universal fields for all content collections.
 * Export this for forks and extensions to build on.
 *
 * Intentionally has no date field — date semantics differ per collection.
 * posts use `published` (required), pages use `updated` (optional).
 */
export const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional(),
  series: z.string().optional(),
  order: z.number().optional(),
  lang: z.string().optional(),
});

export type Base = z.infer<typeof baseSchema>;