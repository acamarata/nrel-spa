import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  target: 'es2020',
  platform: 'node',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  banner({ format }) {
    if (format === 'esm') {
      return {
        js: `import { createRequire as __cr } from 'node:module';\nconst __require = __cr(import.meta.url);`,
      };
    }
    return {};
  },
  // The core SPA algorithm lives in lib/spa.js (the JS port of the NREL C source).
  // It is checked into git and ships with the package. We load it at runtime so it
  // is kept external (not bundled) and resolves via the createRequire shim in ESM.
  external: ['../lib/spa.js'],
});
