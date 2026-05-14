import { ImageResponse } from '@vercel/og';
import { siteConfig } from '@/site.config';
import { loadFonts } from './fonts';

// ── Palette ───────────────────────────────────────────────────────────────────
// Light mode values matching tokens.css --ks-* primitives.

const C = {
  // Gradient background — warm clay brand tones
  gradStart: '#5a3e28',   // deep clay
  gradMid:   '#7B5C42',   // --brand-light
  gradEnd:   '#9e7a58',   // lighter clay

  // Card
  card:      '#faf9f5',   // --page-light
  divider:   '#d6d0c2',   // --border-light

  // Text
  title:     '#22201c',   // --content-light
  body:      '#6f6a60',   // --muted-light
  subtle:    '#9a9488',   // --minimal-light

  // Accent — brand
  accent:    '#7B5C42',   // --brand-light
  accentBg:  '#e8d9cc',   // brand tint for badges

  // Tag pills
  tagBg:     '#ece7dc',   // --surface-light
  tagText:   '#6f6a60',   // --muted-light
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface RenderOGProps {
  title:        string;
  description?: string;
  accent?:      string;   // kept for API compat, unused — palette is fixed
  badgeBg?:     string;
  label?:       string;   // theme value from frontmatter
  date?:        string;
  tags?:        string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const titleSize = (t: string) =>
  t.length > 70 ? '38px' :
  t.length > 50 ? '46px' : '54px';

const siteUrl = siteConfig.url.replace(/^https?:\/\//, '');

// ── Renderer ──────────────────────────────────────────────────────────────────

export async function renderOG({
  title,
  description,
  label,
  date,
  tags = [],
}: RenderOGProps) {
  const fonts = await loadFonts();

  const truncatedDesc =
    description && description.length > 115
      ? `${description.slice(0, 115)}…`
      : description;

  // Bottom right — up to 3 tags, or site URL if no tags
  const bottomRight =
    tags.length > 0
      ? tags.slice(0, 3).map((tag) => ({
          type: 'div',
          props: {
            style: {
              display:         'flex',
              fontSize:        '16px',
              color:           C.tagText,
              backgroundColor: C.tagBg,
              padding:         '4px 12px',
              borderRadius:    '12px',
            },
            children: `#${tag}`,
          },
        }))
      : [{
          type: 'div',
          props: {
            style: {
              display:  'flex',
              fontSize: '18px',
              color:    C.subtle,
            },
            children: siteUrl,
          },
        }];

  return new ImageResponse(
    {
      type: 'div',
      props: {
        // Outer wrapper — gradient background
        style: {
          width:           '100%',
          height:          '100%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          background:      `linear-gradient(135deg, ${C.gradStart} 0%, ${C.gradMid} 50%, ${C.gradEnd} 100%)`,
          padding:         '40px',
          fontFamily:      'Rubik',
        },
        children: {
          // White card
          type: 'div',
          props: {
            style: {
              display:         'flex',
              flexDirection:   'column',
              justifyContent:  'space-between',
              width:           '100%',
              height:          '100%',
              backgroundColor: C.card,
              borderRadius:    '16px',
              padding:         '48px 56px',
            },
            children: [

              // ── Top row — theme badge + date ────────────────────────
              {
                type: 'div',
                props: {
                  style: {
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    width:          '100%',
                  },
                  children: [

                    // Theme badge (or empty spacer)
                    {
                      type: 'div',
                      props: {
                        style: {
                          display:         'flex',
                          backgroundColor: label ? C.accentBg : 'transparent',
                          color:           C.accent,
                          fontSize:        '17px',
                          fontWeight:      600,
                          padding:         label ? '7px 18px' : '0',
                          borderRadius:    '999px',
                          letterSpacing:   '0.05em',
                        },
                        children: label?.toUpperCase() ?? '',
                      },
                    },

                    // Date
                    {
                      type: 'div',
                      props: {
                        style: {
                          display:  'flex',
                          color:    C.subtle,
                          fontSize: '18px',
                        },
                        children: date ?? '',
                      },
                    },

                  ],
                },
              },

              // ── Middle — title + description ─────────────────────────
              {
                type: 'div',
                props: {
                  style: {
                    display:        'flex',
                    flexDirection:  'column',
                    gap:            '16px',
                    flex:           '1',
                    justifyContent: 'center',
                  },
                  children: [

                    // Title
                    {
                      type: 'div',
                      props: {
                        style: {
                          display:    'flex',
                          fontSize:   titleSize(title),
                          fontWeight: 600,
                          color:      C.title,
                          lineHeight: 1.2,
                        },
                        children: title,
                      },
                    },

                    // Description
                    ...(truncatedDesc ? [{
                      type: 'div',
                      props: {
                        style: {
                          display:    'flex',
                          fontSize:   '22px',
                          fontWeight: 400,
                          color:      C.body,
                          lineHeight: 1.45,
                        },
                        children: truncatedDesc,
                      },
                    }] : []),

                  ],
                },
              },

              // ── Bottom row — branding + tags ─────────────────────────
              {
                type: 'div',
                props: {
                  style: {
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    width:          '100%',
                    borderTop:      `1.5px solid ${C.divider}`,
                    paddingTop:     '24px',
                  },
                  children: [

                    // Left — dot + site name
                    {
                      type: 'div',
                      props: {
                        style: {
                          display:     'flex',
                          alignItems:  'center',
                          gap:         '12px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display:         'flex',
                                width:           '12px',
                                height:          '12px',
                                borderRadius:    '50%',
                                backgroundColor: C.accent,
                              },
                              children: '',
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                display:    'flex',
                                fontSize:   '21px',
                                fontWeight: 600,
                                color:      C.accent,
                              },
                              children: siteConfig.title,
                            },
                          },
                        ],
                      },
                    },

                    // Right — tags or hostname
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          gap:     '8px',
                        },
                        children: bottomRight,
                      },
                    },

                  ],
                },
              },

            ],
          },
        },
      },
    },
    {
      width:  1200,
      height: 630,
      fonts: [
        { name: 'Rubik', data: fonts.regular,  style: 'normal', weight: 400 },
        { name: 'Rubik', data: fonts.semiBold, style: 'normal', weight: 600 },
      ],
    }
  );
}