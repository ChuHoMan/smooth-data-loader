import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/smooth-data-loader/',
  title: 'Smooth Data Loader',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/introduction', activeMatch: '/' },
    ],
    outline: {
      level: [1, 3],
    },

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Why?', link: '/why' },
        ],
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'React',
            collapsed: true,
            items: [
              {
                text: 'Quick Start',
                link: '/react/quick-start',
              },
              {
                text: 'Base',
                link: '/react/base',
              },
            ],
          },
          {
            text: 'Vue',
            collapsed: true,
            items: [
              {
                text: 'Quick Start',
                link: '/vue/quick-start',
              },
              {
                text: 'Base',
                link: '/vue/base',
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ChuHoMan/smooth-data-loader' },
    ],

    search: {
      provider: 'local',
    },
  },
});
