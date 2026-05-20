import { z } from "astro/zod";
import { baseSchema } from "./base.schema";

export const postSchema =
  baseSchema.extend({

    category: z.string().optional(), // travels, tech, thoughts anything
    theme: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    countries: z.array(z.string()).optional(),
    region: z.string().optional(),
    places: z.array(z.string()).optional(),

  });

export type Post = z.infer<typeof postSchema>;