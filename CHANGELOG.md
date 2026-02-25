# Changelog
<!-- markdownlint-disable MD024 -->

## [2.0.1] - 2026-02-25

### Fixed

- **Runtime crash:** `calcSpa(... , [])` with an empty angles array no longer crashes. The empty-array guard is now consistent between `getSpa` and `calcSpa`.
- **Silent wrong output:** `getSpa` with `options.function: SPA_ZA` or `SPA_ZA_INC` now returns `NaN` for `sunrise`, `solarNoon`, and `sunset` instead of silently returning `0`. `calcSpa` returns `"N/A"` for those fields. The zero values were misleading — those fields are never computed by non-RTS function codes.
- `lib/spa.js` internal file header corrected from `// dist/spa.js` to `// lib/spa.js`.
- `wiki-sync.yml`: workflow now handles first-run initialization when the GitHub Wiki repository does not yet exist. Replaces `actions/checkout@v4` for the wiki step with a `git clone || git init` pattern.
- Removed `package-import-method=hardlink` from `.npmrc` — it is pnpm's default since v7 and caused `npm warn Unknown project config` because npm reads `.npmrc` too.
- CI pack-check grep now uses a word-boundary pattern, preventing false matches on files with similar prefixes.

### Added

- **Validation:** `options.function` is now validated before the SPA calculation. Passing an invalid function code throws a descriptive `RangeError` instead of silently producing wrong results.
- **Validation:** Passing custom `angles` with a non-RTS function code (`SPA_ZA` or `SPA_ZA_INC`) now throws `RangeError`. Custom angle calculations require `suntransit`, which is only computed by `SPA_ZA_RTS` and `SPA_ALL`.
- TypeScript function overloads for `getSpa` and `calcSpa`: the `angles` parameter is typed as `[number, ...number[]]` (non-empty tuple), so TypeScript rejects empty arrays at compile time and narrows the return type automatically.
- `SpaFormattedAnglesResult` interface for the formatted angles array, consistent with the existing `SpaAnglesResult` interface on the raw side.
- CI workflows now declare explicit `permissions: contents: read` on all jobs.
- API Reference wiki updated: inline anonymous types replaced with named `SpaAnglesResult` and `SpaFormattedAnglesResult` interfaces; new Named Types import block added; `angles` parameter type and new throws documented.
- Architecture wiki updated to document all exported interfaces from `src/types.ts`.

---

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
