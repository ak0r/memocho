import { z } from 'astro/zod';
import { baseSchema } from './base.schema';

/**
 * Page schema — extends base with optional updated date.
 * Used for static pages: about, now, uses, etc.
 * updated renders in PageHeader meta slot when present.
 */
export const pageSchema =   baseSchema;

export type Page = z.infer<typeof pageSchema>;