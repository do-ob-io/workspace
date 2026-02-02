import { defineConfig } from 'eslint/config';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import config from '../../eslint.config.mjs';

export default defineConfig([
  ...config,
  {
    files: [ '**/*.{ts,tsx}' ],
    extends: [
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
