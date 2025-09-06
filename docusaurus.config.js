// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Документация для Po-Signals',
  tagline: 'Pocket Signals — твоя экосистема трейдинга',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://learn.po-signals.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
    localeConfigs: { ru: { label: 'Русский' } }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/po-signals-social-card.jpg',
      navbar: {
        title: 'Pocket Signals Docs',
        logo: {
          alt: 'Pocket Signals Logo',
          src: 'img/logo.svg',
          href: '/docs/', // 👈 сюда отправляем при клике
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
          },
          {
            href: 'https://po-signals.com',
            label: 'Pocket Signals',
            position: 'left',
          },
          { type: 'search', position: 'right' }, // 🔎 добавляем поиск справа
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Документация',
                to: '/docs/',
              },
            ],
          },
          {
            title: 'Ресурсы',
            items: [
              {
                label: 'YouTube канал',
                href: 'https://www.youtube.com/channel/UC2xapcQRPujbzjIvmRSQNbg/',
              },
              {
                label: 'Телеграм канал',
                href: 'https://t.me/mnogodeneg111',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Телеграм бот',
                href: 'https://t.me/posignalsrobot',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Все права защищены`,
      },

      // ✅ Algolia Search
      algolia: {
        appId: '2C9CBPPHSF',
        apiKey: '64f77c0fc8cd44220c5ce2c959ec0568', // search-only
        indexName: 'learn_po_signals_com_2c9cbpphsf_pages',
        contextualSearch: true,
        placeholder: 'Поиск по документации',
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
