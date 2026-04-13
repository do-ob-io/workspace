import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const nodejsDir = path.resolve(dirname, 'nodejs');
const resolveExtensions = [ '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs' ];

/**
 * Resolves an `@/` prefixed import to a file within a project's `src` directory.
 *
 * @param project - The nodejs project folder name.
 * @param request - The import specifier (e.g. `@/utils/helper`).
 * @returns The absolute path to the resolved file, or null if not found.
 */
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

/**
 * Creates a Vite plugin that resolves `@/` imports to the correct project's `src` directory
 * based on the importer's location under `nodejs/<project>/`.
 *
 * @returns A Vite plugin for workspace `@` alias resolution.
 */
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

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [ createWorkspaceAtAliasPlugin() ],
        test: {
          name: { label: 'node', color: 'green' },
          environment: 'node',
          include: [ 'nodejs/*/src/**/*.test.ts' ],
          exclude: [
            '**/*.browser.test.ts',
          ],
        },
      },
      {
        plugins: [ createWorkspaceAtAliasPlugin() ],
        test: {
          name: { label: 'browser', color: 'red' },
          environment: 'happy-dom',
          include: [ 'nodejs/*/src/**/*.browser.test.ts' ],
        },
      },
      {
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          env: {
            HEADLESS: 'true',
          },
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                headless: true,
              },
            }),
            instances: [ { browser: 'chromium' } ],
          },
        },
      },
    ],
  },
});
