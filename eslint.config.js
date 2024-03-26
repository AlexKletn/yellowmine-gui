import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

import eslint from '@eslint/js';
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
];
