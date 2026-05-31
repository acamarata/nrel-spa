import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { typescript } from '@acamarata/eslint-config';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  ...typescript.map((c) => ({
    ...c,
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ...(c.languageOptions ?? {}),
      parser: tsParser,
      parserOptions: {
        ...((c.languageOptions ?? {}).parserOptions ?? {}),
        project: './tsconfig.json',
      },
    },
  })),
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/', 'test.mjs', 'test-cjs.cjs', 'lib/'],
  },
];
