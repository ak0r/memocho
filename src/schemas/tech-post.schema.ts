import { z } from 'astro/zod';
import { baseSchema } from './base.schema';

/**
 * Tech post schema.
 * No location fields — those are travel-specific.
 */
export const techSchema = z.object({
  ...baseSchema
});

export type Tech = z.infer<typeof techSchema>;