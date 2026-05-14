export interface NavItem {
  title: string;
  url: string;
}

export interface SocialItem {
  title: string;
  url: string;
  icon?: string;
}

export interface SiteConfig {
  url: string;
  title: string;
  description: string;
  author: string;
  avatar?: string;
  logo?: string;       // path to logo image in public/ e.g. '/logo.svg'
  tagline?: string;
  social: SocialItem[];
  navigation: NavItem[];
  recentPosts: number;
  relatedPosts: number;
  postsPerPage: number;
}

export const siteConfig: SiteConfig = {
  url: "https://amitkul.in",
  title: "Amit K",
  description: "Building systems by day, exploring streets around the world whenever possible.Sharing tech articles, travel guides, and photo galleries.",
  author: "Amit K",
  avatar: "/avatar.png",
  logo: '/logo.svg',
  tagline: "Amit K",
  social: [
    {
      title: "GitHub",
      url: "https://github.com/ak0r/memocho",
      icon: "github",
    },
    {
      title: "X",
      url: "https://x.com/trekography",
      icon: "X",
    },
    {
      title: "Instagram",
      url: "https://instagram.com/trekography",
      icon: "instagram",
    },
  ],
  navigation: [
    { title: "Archive", url: "/archive" },
    { title: "Now", url: "/now" },
    { title: "Uses", url: "/uses" },
    { title: "About", url: "/about" },
  ],
  recentPosts: 6,
  relatedPosts: 4,
  postsPerPage: 8,
};