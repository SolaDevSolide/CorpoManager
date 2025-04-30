import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'project-structure',
    'getting-started',
    'environment-variables',
    // {
    //   type: 'category',
    //   label: 'Features',
    //   collapsed: false,
    //   items: [
    //     'features/auth',
    //     'features/corp-management',
    //     'features/realtime',
    //     'features/notifications',
    //     'features/api',
    //     'features/docker-ci',
    //   ],
    // },
    'CONTRIBUTING',
  ],
};

export default sidebars;