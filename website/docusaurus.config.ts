import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Star Citizen Corp Manager',
  tagline: 'Manage your corp like a true Retribution captain',
  favicon: 'img/favicon.ico',

  // Production site URL
  url: 'https://SolaDevSolide.github.io',
  baseUrl: '/CorpoManager/',

  // GitHub pages deployment config
  organizationName: 'SolaDevSolide', // GitHub org/user
  projectName: 'CorpoManager', // GitHub repo
  deploymentBranch: 'gh-pages', // The default

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl:
            'https://github.com/SolaDevSolide/CorpoManager/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/SolaDevSolide/CorpoManager/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Corp Manager Docs',
      logo: {
        alt: 'Corp Manager Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/SolaDevSolide/CorpoManager',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/CorpoManager/docs/getting-started',
            },
            {
              label: 'Environment Variables',
              to: '/CorpoManager/docs/environment-variables',
            },
            // {
            //   label: 'Feature Docs',
            //   to: '/CorpoManager/docs/features/auth',
            // },
          ],
        },
        {
          title: 'Project Links',
          items: [
            {
              label: 'GitHub Repo',
              href: 'https://github.com/SolaDevSolide/CorpoManager',
            },
            {
              label: 'Main README',
              href: 'https://github.com/SolaDevSolide/CorpoManager#readme',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Corp Manager`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
