export type DateVariant = 'archive' | 'post' | 'seo';

export function formatDate(date: Date, variant: DateVariant): string {
  switch (variant) {
    case 'archive':
      return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
      }).format(date);

    case 'post':
      return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);

    case 'seo':
      return date.toISOString().split('T')[0]; // YYYY-MM-DD

    default:
      return '';
  }
}

/**
 * String Utilities
 *
 * Centralized string transformation operations.
 */

/**
 * Convert text to URL-friendly slug
 */
export function slugify(inputText?: string): string {
  if (!inputText) return '';

  return inputText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Humanize a string (convert slugs/underscores to readable text)
 */
export function humanize(content: string): string {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}

/**
 * Title case a string (capitalize first letter of each word)
 */
export function titleify(content: string): string {
  const humanized = humanize(content);
  return humanized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert slug to title (dashes to spaces, capitalize)
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length).trim() + suffix;
}

/**
 * Strip Obsidian wikilink brackets from a string
 */
export function stripObsidianBrackets(value: string): string {
  if (value.startsWith('[[') && value.endsWith(']]')) {
    return value.slice(2, -2);
  }
  return value;
}

/**
 * Add ordinal suffix to a day number.
 * e.g. 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", 11 → "11th"
 */
export function ordinalSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

/**
 * Normalise a string with spaces to include '-'.
 * Mirrors what Astro's glob loader does to filenames.
 *
 * "India"     → "india"
 * "Sri Lanka" → "sri-lanka"
 */

export function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
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