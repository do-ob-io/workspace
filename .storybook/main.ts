import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nodejsDir = path.resolve(__dirname, '../nodejs');

/**
 * Declares an array that contains all the paths for `public` folders under the
 * `../nodejs/<project>` directory. Paths are relative to this file.
 */
const staticDirs = fs.readdirSync(nodejsDir)
  .filter((project) => {
    const publicPath = path.join(nodejsDir, project, 'public');
    return fs.existsSync(publicPath) && fs.statSync(publicPath).isDirectory();
  })
  .map((project) => `../nodejs/${project}/public`);

const resolveExtensions = [ '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs' ];

function resolveProjectSrcImport(project: string, request: string): string | null {
  const cleanedRequest = request.replace(/^[@]\//, '');
  const extension = path.extname(cleanedRequest);
  const extensionlessRequest = extension
    ? cleanedRequest.slice(0, cleanedRequest.length - extension.length)
    : cleanedRequest;

  const candidates = [
    path.resolve(nodejsDir, project, 'src', cleanedRequest),
    path.resolve(nodejsDir, project, 'src', extensionlessRequest),
    ...resolveExtensions.map((item) => path.resolve(nodejsDir, project, 'src', `${extensionlessRequest}${item}`)),
    ...resolveExtensions.map((item) => path.resolve(nodejsDir, project, 'src', cleanedRequest, `index${item}`)),
    ...resolveExtensions.map((item) => path.resolve(nodejsDir, project, 'src', extensionlessRequest, `index${item}`)),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function createWorkspaceAtAliasPlugin() {
  return {
    name: 'workspace-project-at-alias-resolver',
    resolveId(source: string, importer?: string) {
      if (!source.startsWith('@/') || !importer) {
        return null;
      }

      const normalizedImporter = importer.split('?')[0].replaceAll('\\', '/');
      const match = normalizedImporter.match(/\/nodejs\/([^/]+)\//);

      if (!match) {
        return null;
      }

      return resolveProjectSrcImport(match[1], source);
    },
  };
}


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
    '../nodejs/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  'staticDirs': staticDirs,
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
      plugins: [ createWorkspaceAtAliasPlugin() ],
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
