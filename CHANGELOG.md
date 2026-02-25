# Changelog

## [2.0.0] - 2026-02-25

### Added

- TypeScript wrapper (`src/index.ts`, `src/types.ts`) with full type definitions
- Dual CJS and ESM builds via tsup (`dist/index.cjs`, `dist/index.mjs`)
- TypeScript declaration files (`dist/index.d.ts`, `dist/index.d.mts`)
- `formatTime()` utility export for converting fractional hours to `HH:MM:SS`
- Input validation with descriptive `TypeError` and `RangeError` messages
- Function code exports: `SPA_ZA`, `SPA_ZA_INC`, `SPA_ZA_RTS`, `SPA_ALL`
- Test suite: 61 ESM assertions and 17 CJS assertions
- GitHub Actions CI workflow (Node 20/22/24 matrix, typecheck, pack-check)
- GitHub Wiki with architecture, API reference, twilight calculations, and algorithm documentation
- NREL attribution in `LICENSE` and `README`
- `pnpm-workspace.yaml`, `.editorconfig`, `.npmrc`, `.nvmrc` config files

### Changed

- Core algorithm moved from `dist/spa.js` to `lib/spa.js` (same code, clearer location)
- `package.json` rewritten: proper `exports` map, `files`, `engines`, `sideEffects`, all required fields
- Author corrected to "Aric Camarata"
- `repository.url` corrected to use `git+https://` prefix (no npm publish warnings)
- `engines.node` set to `>=20`
- Description expanded with full keyword coverage
- LICENSE year corrected to `2023-2026`
- README rewritten with badges, full API tables, quick start, and NREL acknowledgments

## [1.3.0] - 2025-05-04

- Major fix for discrepancies between this implementation and the original NREL C reference
- Added `bin/` folder for compiling and testing against the C reference executable
- All 10 global test cases now produce identical output to the C reference

## [1.2.2] - 2023-11-12

- Moved timezone to main function arguments and changed default behavior
- Updated test cases and README

## [1.1.0] - 2023-11-11

- Committed `dist/` folder (core algorithm) to git

## [1.0.0] - 2023-11-11

- Initial release
