import { z } from 'astro/zod';
import { baseSchema } from './base.schema';

/**
 * Travel post schema.
 * Location fields (countries, region, places, type) are travel-specific.
 */

export const travelSchema = baseSchema.extend({

  // ── Post type ───────────────────────────────────────────────────────────
  type:      z.enum(['story', 'itinerary', 'guide', 'gallery', 'review', 'list']).optional(),

  // ── Location ─────────────────────────────────────────────────────────────
  countries: z.array(z.string()).optional(), // e.g. ["India", "Sri Lanka"]
  places:    z.array(z.string()).optional(), // e.g. ["Rajgad", "Pune"]
  region:    z.string().optional(),          // e.g. "Sahyadri"

});

export type Travel = z.infer<typeof travelSchema>;