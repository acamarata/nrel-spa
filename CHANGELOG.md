# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] - 2026-05-28

### Fixed
- Reverted `"type": "module"` addition that broke CJS lib loading. `lib/spa.js` is compiled CommonJS output and uses `exports.*` assignments. Adding `"type": "module"` to the package root caused Node.js to parse it as ESM, resulting in `ReferenceError: exports is not defined in ES module scope`. The package already ships proper `.mjs` and `.cjs` dist files via the exports map, so the package-level `type` field is not required. A full ESM-native source rewrite is planned for a future major version.

## [2.0.1] - 2026-05-28

### Added
- Initial release
