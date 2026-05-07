import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// ── Types ──────────────────────────────────────────────────────────────────────

/**
 * A post is either a travel or tech collection entry.
 * Using a union lets us pass either to shared helpers.
 */
export type TravelPost = CollectionEntry<"travels">;
export type TechPost   = CollectionEntry<"tech">;
export type AnyPost    = TravelPost | TechPost;
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

export async function getTravelPosts(): Promise<TravelPost[]> {
  const posts = await getCollection("travels", ({ data }) =>
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

// ── Normalisation ──────────────────────────────────────────────────────────────

/**
 * Normalise a country name to a destination collection id.
 * Mirrors what Astro's glob loader does to filenames.
 *
 * "India"     → "india"
 * "Sri Lanka" → "sri-lanka"
 */
export function toDestinationId(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Extract normalised destination ids from a travel post's countries field.
 */
export function getCountryIds(post: TravelPost): string[] {
  const countries = post.data.countries;
  if (!countries?.length) return [];
  return countries.map((c) => toDestinationId(c));
}

/**
 * Extract slug from a post id — strips folder prefix.
 * "2026-01-26-self-hosting/replacing-google-photos" → "replacing-google-photos"
 * "rajgad-trek" → "rajgad-trek"
 */
export function getPostSlug(post: AnyPost): string {
  return post.id.includes('/') ? post.id.split('/').pop()! : post.id;
}


// ── URL builder ────────────────────────────────────────────────────────────────

/**
 * Derive the canonical URL for any post.
 * Uses post.collection — no category field needed.
 */
export function getPostUrl(post: AnyPost): string {
  const slug = getPostSlug(post);
  if (post.collection === "tech") return `/tech/${slug}`;
  return `/travels/${slug}`;
}

// ── Series ─────────────────────────────────────────────────────────────────────

/**
 * Posts in a series — searches both collections, sorted by order ascending.
 * Series can span travel and tech (e.g. a homelab series under tech).
 */
export async function getSeriesPosts(series: string): Promise<AnyPost[]> {
  const all = await getPublishedPosts();
  return all
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
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
  current: AnyPost,
  allPosts: AnyPost[],
  count: number
): AnyPost[] {
  const currentTags      = current.data.tags ?? [];
  const currentCol       = current.collection;
  const currentCountries = current.collection === 'travels'
    ? getCountryIds(current as TravelPost)
    : [];

  const scored = allPosts
    .filter((p) => p.id !== current.id || p.collection !== current.collection)
    .map((post) => {
      const postCountries = post.collection === 'travels'
        ? getCountryIds(post as TravelPost)
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

// ── Reading time ───────────────────────────────────────────────────────────────

export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200
): ReadingTime {
  if (!content || typeof content !== "string") {
    return { text: "1 min read", minutes: 1, time: 60000, words: 0 };
  }

  const plainText = content
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "$1")
    .replace(/`{1,3}.*?`{1,3}/gs, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const words     = plainText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const minutes   = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60 * 1000,
    words: wordCount,
  };
}

// ── Tag Queries ───────────────────────────────────────────────────────────────

function buildTagList(posts: AnyPost[]): TagInfo[] {
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

async function getTagsFrom(source: () => Promise<AnyPost[]>) {
  return buildTagList(await source());
}

export const getTravelTags = () => getTagsFrom(getTravelPosts);
export const getTechTags   = () => getTagsFrom(getTechPosts);
export const getAllTags    = () => getTagsFrom(getPublishedPosts);