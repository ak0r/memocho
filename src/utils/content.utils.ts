import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { slugify } from "./text.utils";

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// ── Types ──────────────────────────────────────────────────────────────────────

/**
 * A post is either a travel or tech collection entry.
 * Using a union lets us pass either to shared helpers.
 */
export type Post = CollectionEntry<"posts">;
export type TagInfo = {
  key: string;
  label: string;
  count: number;
};

export const collectionColors = {
  tech: {
    text: "var(--ks-sky)",
    bg: "var(--ks-heather)"
  },
  travels: {
    text: "var(--ks-olive)",
    bg: "var(--ks-cactus)"
  }
};

// ── Draft filter ───────────────────────────────────────────────────────────────

function isDraftVisible(draft: boolean): boolean {
  return isDev || !draft;
}

// ── Post queries ───────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const allPosts = await getCollection("posts", ({ data }) =>
    isDraftVisible(data.draft)
  );
  return allPosts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}


// ── Grouping ───────────────────────────────────────────────────────────────────

export function groupPostsByYear(
  entries: Post[]
): Map<number, Post[]> {
  const groups = new Map<number, Post[]>();
  for (const post of entries) {
    const year = new Date(post.data.published).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
}

export async function getPostsByYear(): Promise<Map<number, Post[]>> {
  const posts = await getAllPosts();
  return groupPostsByYear(posts);
}

export function getPostsGroupedByYear(
  entries: Post[]
): [string, Post[]][] {
  const grouped = entries.reduce<Record<string, Post[]>>((acc, entry) => {
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


/**
 * Extract normalised destination ids from a travel post's countries field.
 */
export function getCountryIds(post: Post): string[] {
  const countries = post.data.countries;
  if (!countries?.length) return [];
  return countries.map((c) => slugify(c));
}

/**
 * Extract slug from a post id — strips folder prefix.
 * "2026-01-26-self-hosting/replacing-google-photos" → "replacing-google-photos"
 * "rajgad-trek" → "rajgad-trek"
 */
export function getPostSlug(post: Post): string {
  return post.id.includes('/') ? post.id.split('/').pop()! : post.id;
}


// ── URL builder ────────────────────────────────────────────────────────────────

/**
 * Derive the canonical URL for any post.
 * Uses post.collection — no category field needed.
 */
export function getPostUrl(post: Post): string {
  const slug = getPostSlug(post);
  return `/${slug}`;
}

// ── Series ─────────────────────────────────────────────────────────────────────

/**
 * Posts in a series — searches both collections, sorted by order ascending.
 * Series can span travel and tech (e.g. a homelab series under tech).
 */
export async function getSeriesPosts(series: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}


// ── Related posts ──────────────────────────────────────────────────────────────

/**
 * Related posts — scored by countries + collection + tag overlap.
 *
 * Scoring:
 *   shared country + shared tag  → 4
 *   same collection + shared tag → 3
 *   same collection only         → 2
 *   shared tag only              → 1
 */
export function getRelatedPosts(
  current: Post,
  allPosts: Post[],
  count: number
): Post[] {
  const currentTags      = current.data.tags ?? [];
  const currentCol       = current.collection;
  const currentCountries = current.collection === 'posts'
    ? getCountryIds(current as Post)
    : [];

  const scored = allPosts
    .filter((p) => p.id !== current.id || p.collection !== current.collection)
    .map((post) => {
      const postCountries = post.collection === 'posts'
        ? getCountryIds(post as Post)
        : [];
      const sharedCountry =
        currentCountries.length > 0 &&
        postCountries.some((id) => currentCountries.includes(id));
      const sameCollection = post.collection === currentCol;
      const sharedTag = (post.data.tags ?? []).some((t) =>
        currentTags.includes(t)
      );

      let score = 0;
      if (sharedCountry && sharedTag)    score = 4;
      else if (sameCollection && sharedTag) score = 3;
      else if (sameCollection)           score = 2;
      else if (sharedTag)                score = 1;

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.published.valueOf() - a.post.data.published.valueOf()
    )
    .slice(0, count)
    .map(({ post }) => post);

  if (scored.length < count) {
    const recent = allPosts
      .filter(
        (p) =>
          (p.id !== current.id || p.collection !== current.collection) &&
          !scored.find((r) => r.id === p.id && r.collection === p.collection)
      )
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
      .slice(0, count - scored.length);

    return [...scored, ...recent];
  }

  return scored;
}

// ── Tag Queries ───────────────────────────────────────────────────────────────

function buildTagList(posts: Post[]): TagInfo[] {
  const map = new Map<string, TagInfo>();

  const normalize = (t: string) => t.trim().toLowerCase();

  for (const post of posts) {
    for (const raw of post.data.tags ?? []) {
      const key = normalize(raw);

      if (!map.has(key)) {
        map.set(key, { key, label: raw, count: 0 });
      }

      map.get(key)!.count++;
    }
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  );
}

async function getTagsFrom(source: () => Promise<Post[]>) {
  return buildTagList(await source());
}

export const getAllTags    = () => getTagsFrom(getAllPosts);


export const getDistinctYears = (posts: Post[]): number[] =>
  [...new Set(posts.map(p => p.data.published.getFullYear()))]
    .sort((a, b) => b - a);