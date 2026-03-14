/// <reference types="vitest/config" />

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rolldown/plugin-babel';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
const dirname = typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [ reactCompilerPreset() ],
    }),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: [ '.localhost' ],
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          name: { label: 'node', color: 'green' },
          environment: 'node',
          include: [ 'nodejs/**/*.test.ts' ],
          exclude: [ 'nodejs/**/*.browser.test.ts' ],
        },
      },
      {
        test: {
          name: { label: 'browser', color: 'green' },
          environment: 'happy-dom',
          include: [ 'nodejs/**/*.browser.test.ts' ],
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
          fileParallelism: false,
          maxWorkers: 1,
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
