## 2.2.0 — 2026-08-22

### Added
- **Every entry point accepts a `'YYYY-MM-DD'` string as well as a `Date`,** along with the exported `SpaDateInput` type and `toSpaInstant` helper.

  `getSpa` answers two different kinds of question from one argument, and they do not want the same input. Instantaneous position (`zenith`, `azimuth`, `incidence`) depends on the exact moment, and a `Date` is exactly right for it. Rise, transit and set depend only on the calendar **day** — verified: holding the date fixed and varying the hour from 00 to 23 leaves `sunrise`, `solarNoon` and `sunset` identical to six decimal places.

  That second case is where a bare `Date` is a trap. A `Date` carries no record of whether it was built from local or UTC parts, so `new Date(2026, 7, 22)` is `2026-08-21T14:00Z` in Tokyo and `2026-08-22T04:00Z` in New York — two different UTC calendar days for what the author wrote as one date. The Tokyo caller silently got the previous day's sunrise. This is the same defect fixed one layer up in `pray-calc` 2.4.0; `pray-calc`'s own callers were shielded by that release, but anyone using this package directly was not.

  A `'YYYY-MM-DD'` string names a calendar day outright, with no instant involved and no host timezone able to shift it. It is anchored at UTC noon: the furthest point from either day boundary, so no rounding or delta-T correction can push it into an adjacent day, and a reasonable instant for the position outputs.

### Changed
- Nothing. The `Date` path is byte-identical to 2.1.0 — verified across 1620 output fields spanning five locations, twelve months and three hours per day, with zero differences. Instantaneous position still varies with the time of day, and a test now guards that so a future change cannot normalise it away.

### Notes on upgrading
Purely additive; no action required. If you use this package to ask about a **day** rather than a moment, prefer the string form:

```js
getSpa('2026-08-22', lat, lng, tz)   // unambiguous
getSpa(new Date(2026, 7, 22), ...)   // depends on where the machine is
```

## 2.1.0 — 2026-08-19

### Fixed
- **The NREL "no such event" sentinel no longer crosses the public API.** The reference implementation writes `-99999` into `srha`, `ssha`, `sta`, `suntransit`, `sunrise` and `sunset` when the sun does not cross the horizon on the requested day, and that value was returned to callers unchanged. Because `-99999` is a *finite* number it passed every `Number.isFinite` guard downstream and rendered as a confident clock time — reduced modulo 24 it is exactly 9, so consumers displayed "09:00" for both sunrise and sunset on an Arctic summer day. `getSpa` now returns `NaN` for events that do not occur. Two leak paths were closed: the raw result fields, and `adjustForCustomAngle`, which offsets from solar transit and so produced plausible-looking values such as `-100001.38` for a twilight angle that was itself reachable.
- **`solarNoon` survives polar day and polar night.** The sun crosses the local meridian every day everywhere on Earth, so solar transit is always defined, but the reference blanks it alongside the genuinely absent sunrise and sunset. It is now recovered from the equation of time, which the reference computes unconditionally. Where the reference produces a transit that value is passed through untouched, so no existing result moves; the two agree to within about a second.

### Notes
- `lib/spa.js` remains a faithful port of the NREL reference, sentinel included. The conversion happens at the API boundary.
- During polar night the recovered transit occurs below the horizon (about -11.7 degrees at Longyearbyen in December). That is the correct astronomical answer; whether a below-horizon transit is usable for a given purpose is the caller's decision.

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
