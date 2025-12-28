/// <reference types="vitest/config" />

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
const dirname = typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [ [ 'babel-plugin-react-compiler' ] ],
      },
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: [ '.localhost' ],
  },
  test: {
    projects: [
      {
        test: {
          name: { label: 'node', color: 'green' },
          environment: 'node',
          include: [ 'nodejs/**/*.test.ts' ],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }) ],
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
            instances: [ {
              browser: 'chromium',
            } ],
          },
          setupFiles: [ '.storybook/vitest.setup.ts' ],
        },
      },
    ],
  },
});
