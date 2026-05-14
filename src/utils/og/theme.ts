/**
 * OG theme tokens
 *
 * Resolved color values for @vercel/og rendering.
 * These mirror the main site palette.
 */

export const ogTheme = {

  bg: '#faf9f5',
  surface: '#f5f4ed',

  content: '#141413',
  muted: '#5e5d59',
  minimal: '#87867f',

  border: '#d1cfc5',

  accent: '#3AA99F',

  collections: {
    travels: '#788c5d',
    tech: '#6a9bcc',
  },

} as const;

export interface CollectionTheme {
  accent: string;
  badgeBg: string;
  label?: string;
}

export function collectionTheme(collection?: string): CollectionTheme {

  switch (collection) {

    case 'travels':
      return {
        accent: ogTheme.collections.travels,
        badgeBg: `${ogTheme.collections.travels}22`,
        label: 'TRAVEL',
      };

    case 'tech':
      return {
        accent: ogTheme.collections.tech,
        badgeBg: `${ogTheme.collections.tech}22`,
        label: 'TECH',
      };

    default:
      return {
        accent: ogTheme.accent,
        badgeBg: `${ogTheme.accent}22`,
      };
  }
}