import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// ── Types ──────────────────────────────────────────────────────────────────────

/**
 * A post is either a travel or tech collection entry.
 * Using a union lets us pass either to shared helpers.
 */
export type TravelPost = CollectionEntry<"travel">;
export type TechPost   = CollectionEntry<"tech">;
export type AnyPost    = TravelPost | TechPost;

// ── Draft filter ───────────────────────────────────────────────────────────────

function isDraftVisible(draft: boolean): boolean {
  return isDev || !draft;
}

// ── Post queries ───────────────────────────────────────────────────────────────

export async function getTravelPosts(): Promise<TravelPost[]> {
  const posts = await getCollection("travel", ({ data }) =>
    isDraftVisible(data.draft)
  );
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}

export async function getTechPosts(): Promise<TechPost[]> {
  const posts = await getCollection("tech", ({ data }) =>
    isDraftVisible(data.draft)
  );
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}

/**
 * All published posts from both collections, sorted by date descending.
 * Used for PostNav, related posts, RSS, OG images.
 */
export async function getPublishedPosts(): Promise<AnyPost[]> {
  const [travel, tech] = await Promise.all([getTravelPosts(), getTechPosts()]);
  return [...travel, ...tech].sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}

// ── Grouping ───────────────────────────────────────────────────────────────────

export function groupPostsByYear(
  posts: AnyPost[]
): Map<number, AnyPost[]> {
  const groups = new Map<number, AnyPost[]>();
  for (const post of posts) {
    const year = new Date(post.data.published).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
}

export async function getPostsByYear(): Promise<Map<number, AnyPost[]>> {
  const posts = await getPublishedPosts();
  return groupPostsByYear(posts);
}

export function getPostsGroupedByYear(
  entries: AnyPost[]
): [string, AnyPost[]][] {
  const grouped = entries.reduce<Record<string, AnyPost[]>>((acc, entry) => {
    const year = entry.data.published.getFullYear().toString();
    (acc[year] ??= []).push(entry);
    return acc;
  }, {});

  for (const year in grouped) {
    grouped[year].sort(
      (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
    );
  }

  return Object.entries(grouped).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
}