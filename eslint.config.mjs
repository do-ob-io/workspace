import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as storybookConfigs } from 'eslint-plugin-storybook';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { configs as tseslint } from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/.*',
    '!**/.storybook',
    'next-env.d.ts',
  ]),

  js.configs.recommended,
  ...tseslint.recommended,
  ...tseslint.stylistic,

  ...storybookConfigs['flat/recommended'],

  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  eslintPluginUnicorn.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  {
    files: [ '**/*.{js,jsx,mjs,ts,tsx}' ],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },

    plugins: {
      '@stylistic': stylistic,
    },

    settings: {
      'import/resolver': {
        resolver: createTypeScriptImportResolver(),
      },
      react: {
        version: 'detect',
      },
    },

    rules: {
      // ESLint rules
      'no-param-reassign': 'error',
      // Stylistic rules
      '@stylistic/semi': [ 'error', 'always' ],
      '@stylistic/quotes': [ 'error', 'single' ],
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/eol-last': [ 'error', 'always' ],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/jsx-quotes': [ 'error', 'prefer-double' ],
      '@stylistic/key-spacing': [ 'error', { 'beforeColon': false, 'afterColon': true } ],
      '@stylistic/space-before-blocks': [ 'error', 'always' ],
      '@stylistic/arrow-spacing': [ 'error', { 'before': true, 'after': true } ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          'multiline': {
            'delimiter': 'semi',
            'requireLast': true,
          },
          'singleline': {
            'delimiter': 'semi',
            'requireLast': false,
          },
        },
      ],

      //TSESLint rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '_', varsIgnorePattern: '_' },
      ],

      // Unicorn rules
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',

      // React rules
      'react/prefer-read-only-props': 'error',
      'react/hook-use-state': 'error',

      // Import rules
      'import-x/no-cycle': 'error',
      'import-x/order': [ 'error', {
        'groups': [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object' ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@work-control/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@edctm/**',
            group: 'internal',
            position: 'after',
          },
        ],
        'pathGroupsExcludedImportTypes': [ 'builtin' ],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      } ],
    },
  },
]);
