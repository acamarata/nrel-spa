# Contributing

## Prerequisites

- Node.js 20 or later
- pnpm (enabled via corepack: `corepack enable`)

## Setup

```sh
git clone https://github.com/acamarata/nrel-spa.git
cd nrel-spa
pnpm install
```

## Development

Build and test:

```sh
pnpm build          # compile TypeScript
pnpm test           # run full test suite (ESM + CJS)
pnpm run typecheck  # type-check without emitting
pnpm run lint       # ESLint
pnpm run format     # Prettier format
```

The build output goes to `dist/`. It is gitignored; do not commit it.

## Project Structure

```
src/
  index.ts      exports and public API wrappers
  types.ts      all TypeScript types and constants
lib/
  spa.js        core SPA algorithm (JS port of NREL C source, tracked in git)
dist/           tsup build output (gitignored)
test.mjs        full ESM test suite
test-cjs.cjs    CJS test subset
bin/            C reference testing infrastructure
```

## Making Changes

1. Keep `lib/spa.js` in git. It is the core algorithm and must stay tracked.
2. All new exports go through `src/index.ts` and `src/types.ts`.
3. Add tests in `test.mjs` for any new behavior. The test suite uses Node's built-in `node:test` runner.
4. Run `pnpm test` before submitting. All tests must pass on Node 20, 22, and 24.

## Validation Against C Reference

The `bin/` directory contains infrastructure for comparing output against the original NREL C implementation. See `bin/README.md` for setup instructions. Use this when changing anything in `lib/spa.js`.

## Pull Requests

- One logical change per PR
- Include tests for new behavior
- Update `CHANGELOG.md` under `[Unreleased]`
- Do not bump the version number
