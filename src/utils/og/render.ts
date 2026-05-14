import { ImageResponse } from '@vercel/og';

import { siteConfig } from '@/site.config';

import { ogTheme } from './theme';
import { loadFonts } from './fonts';

interface RenderOGProps {
  title: string;

  description?: string;

  accent: string;
  badgeBg?: string;
  label?: string;

  date?: string;
}

export async function renderOG({
  title,
  description,
  accent,
  badgeBg,
  label,
  date,
}: RenderOGProps) {

  const fonts = await loadFonts();

  const truncatedDesc = description && description.length > 140
    ? `${description.slice(0, 140)}…`
    : description;

  return new ImageResponse(
    {
      type: 'div',

      props: {
        style: {
          width: '100%',
          height: '100%',

          display: 'flex',
          flexDirection: 'row',

          background: ogTheme.bg,
          fontFamily: 'Rubik',
        },

        children: [

          // Accent rail
          {
            type: 'div',

            props: {
              style: {
                width: '12px',
                height: '100%',
                background: accent,
                flexShrink: 0,
              },
            },
          },

          // Main content
          {
            type: 'div',

            props: {
              style: {
                flex: 1,

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',

                padding: '64px 72px 56px 68px',
              },

              children: [

                // Top
                {
                  type: 'div',

                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },

                    children: [

                      // Label
                      ...(label ? [{
                        type: 'div',

                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',

                            alignSelf: 'flex-start',

                            marginBottom: '28px',

                            padding: '6px 16px',

                            borderRadius: '999px',

                            background: badgeBg,
                            color: accent,

                            fontSize: '18px',
                            fontWeight: 600,

                            letterSpacing: '0.05em',
                          },

                          children: label,
                        },
                      }] : []),

                      // Title
                      {
                        type: 'div',

                        props: {
                          style: {
                            maxWidth: '920px',

                            display: 'flex',

                            color: ogTheme.content,

                            fontSize: '64px',
                            fontWeight: 600,

                            lineHeight: 1.15,
                          },

                          children: title,
                        },
                      },

                      // Description
                      ...(truncatedDesc ? [{
                        type: 'div',

                        props: {
                          style: {
                            maxWidth: '860px',

                            marginTop: '22px',

                            display: 'flex',

                            color: ogTheme.muted,

                            fontSize: '26px',
                            lineHeight: 1.5,
                          },

                          children: truncatedDesc,
                        },
                      }] : []),

                    ],
                  },
                },

                // Bottom
                {
                  type: 'div',

                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    },

                    children: [

                      // Divider
                      {
                        type: 'div',

                        props: {
                          style: {
                            width: '100%',
                            height: '1px',
                            background: ogTheme.border,
                          },
                        },
                      },

                      // Footer row
                      {
                        type: 'div',

                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          },

                          children: [

                            // Author/date
                            {
                              type: 'div',

                              props: {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                },

                                children: [

                                  {
                                    type: 'div',

                                    props: {
                                      style: {
                                        color: ogTheme.content,

                                        fontSize: '20px',
                                        fontWeight: 600,
                                      },

                                      children: siteConfig.author,
                                    },
                                  },

                                  ...(date ? [{
                                    type: 'div',

                                    props: {
                                      style: {
                                        color: ogTheme.minimal,

                                        fontSize: '18px',
                                      },

                                      children: date,
                                    },
                                  }] : []),

                                ],
                              },
                            },

                            // Site title
                            {
                              type: 'div',

                              props: {
                                style: {
                                  color: accent,

                                  fontSize: '22px',
                                  fontWeight: 600,
                                },

                                children: siteConfig.title,
                              },
                            },

                          ],
                        },
                      },

                    ],
                  },
                },

              ],
            },
          },

        ],
      },
    },

    {
      width: 1200,
      height: 630,

      fonts: [
        {
          name: 'Rubik',
          data: fonts.regular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Rubik',
          data: fonts.semiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
}