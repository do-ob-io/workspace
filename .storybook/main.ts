import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return path.dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  'stories': [
    // '../nodejs/**/*.mdx',
    '../nodejs/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  'addons': [
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  'framework': getAbsolutePath('@storybook/react-vite'),
  async viteFinal(config) {
    const codespaceName = process.env.CODESPACE_NAME;
    const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
    const headless = process.env.HEADLESS === 'true';

    const isCodespaces = !!(codespaceName && domain);
    const isCodespacesHeadless = isCodespaces && headless;

    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      server: {
        host: true,
        allowedHosts: isCodespacesHeadless ? true : (config.server as any)?.allowedHosts,
        hmr: isCodespacesHeadless
          ? {
            protocol: 'wss',
            host: `${codespaceName}-6006.${domain}`,
            clientPort: 443,
          }
          : (config.server as any)?.hmr,
      },
    });
  },
};
export default config;
