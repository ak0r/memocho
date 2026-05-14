import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { slugify } from "./text.utils";

const isDev = import.meta.env.DEV;

// ── Types ──────────────────────────────────────────────────────────────────────

export type Post = CollectionEntry<"posts">;
export type TagInfo = {
  key:   string;
  label: string;
  count: number;
};

export const collectionColors = {
  tech: {
    text: "var(--ks-sky)",
    bg:   "var(--ks-heather)",
  },
  travels: {
    text: "var(--ks-olive)",
    bg:   "var(--ks-cactus)",
  },
};

// ── Draft filter ───────────────────────────────────────────────────────────────

function isDraftVisible(draft: boolean): boolean {
  return isDev || !draft;
}

// ── Post queries ───────────────────────────────────────────────────────────────

// 3.4: Module-level cache — getAllPosts() is called multiple times per build
// (PostLayout: related posts, series, prev/next). One getCollection() call total.
let _postsCache: Post[] | null = null;

export async function getAllPosts(): Promise<Post[]> {
  if (_postsCache) return _postsCache;

  const all = await getCollection("posts", ({ data }) =>
    isDraftVisible(data.draft)
  );

  _postsCache = all.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );

  return _postsCache;
}

// ── Grouping ───────────────────────────────────────────────────────────────────

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

// ── Destination helpers ────────────────────────────────────────────────────────

/**
 * Extract normalised destination ids from a post's countries field.
 */
export function getCountryIds(post: Post): string[] {
  const countries = post.data.countries;
  if (!countries?.length) return [];
  return countries.map((c) => slugify(c));
}

// ── URL / slug helpers ─────────────────────────────────────────────────────────

/**
 * Extract slug from a post id — strips folder prefix.
 * "2026-01-26-self-hosting/replacing-google-photos" → "replacing-google-photos"
 * "rajgad-trek" → "rajgad-trek"
 */
export function getPostSlug(post: Post): string {
  return post.id.includes("/") ? post.id.split("/").pop()! : post.id;
}

/**
 * Canonical URL for any post.
 */
export function getPostUrl(post: Post): string {
  return `/${getPostSlug(post)}`;
}

// ── Series ─────────────────────────────────────────────────────────────────────

/**
 * Posts belonging to a series, sorted by seriesOrder ascending.
 */
export async function getSeriesPosts(series: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

// ── Related posts ──────────────────────────────────────────────────────────────

/**
 * Related posts scored by countries + tag overlap.
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
  const currentCountries = getCountryIds(current);

  const scored = allPosts
    .filter((p) => p.id !== current.id)
    .map((post) => {
      const postCountries = getCountryIds(post);
      const sharedCountry =
        currentCountries.length > 0 &&
        postCountries.some((id) => currentCountries.includes(id));
      const sameCollection = post.collection === currentCol;
      const sharedTag = (post.data.tags ?? []).some((t) =>
        currentTags.includes(t)
      );

      let score = 0;
      if (sharedCountry && sharedTag)       score = 4;
      else if (sameCollection && sharedTag) score = 3;
      else if (sameCollection)              score = 2;
      else if (sharedTag)                   score = 1;

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
          p.id !== current.id &&
          !scored.find((r) => r.id === p.id)
      )
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
      .slice(0, count - scored.length);

    return [...scored, ...recent];
  }

  return scored;
}

// ── Tag queries ────────────────────────────────────────────────────────────────

function buildTagList(posts: Post[]): TagInfo[] {
  const map = new Map<string, TagInfo>();
  const normalize = (t: string) => t.trim().toLowerCase();

  for (const post of posts) {
    for (const raw of post.data.tags ?? []) {
      const key = normalize(raw);
      if (!map.has(key)) map.set(key, { key, label: raw, count: 0 });
      map.get(key)!.count++;
    }
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  );
}

// 3.2: Removed getTagsFrom wrapper — getAllTags calls buildTagList directly.
export async function getAllTags(): Promise<TagInfo[]> {
  return buildTagList(await getAllPosts());
}

// ── Filter dimension helpers ───────────────────────────────────────────────────

export const getDistinctYears = (posts: Post[]): number[] =>
  [...new Set(posts.map((p) => p.data.published.getFullYear()))].sort(
    (a, b) => b - a
  );

/**
 * Distinct theme values across all posts, sorted alphabetically.
 */
export function getDistinctThemes(posts: Post[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const t of post.data.theme ?? []) set.add(t.trim());
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Distinct country display names across all posts, sorted alphabetically.
 */
export function getDistinctCountries(posts: Post[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const c of post.data.countries ?? []) set.add(c.trim());
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}