import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import rules from './eslint-config/rules.js';

export default [
  ...tseslint.config(eslint.configs.recommended,
    ...tseslint.configs.recommended),
  stylistic.configs.customize({
    semi: true,
    jsx: true,
    indent: 2,
  }),
  {
    plugins: {
      angular: angularPlugin,
      angularTemplate: angularTemplatePlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      'prefer-const': 'error',
      ...rules,
    },
    files: ['**/*.{ts}'],
  },
  {
    ignores: [
      'dist',
    ],
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // `react` first
            ['^@angular', '^@?\\w'],
            ['^@(app|entities|features|pages|shared|widgets)(/.*|$)'],
            // Side effect imports
            ['^\\u0000'],
            // Imports starting with `../`
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports starting with `./`
            [
              '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
