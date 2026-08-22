# nrel-spa

[![npm version](https://img.shields.io/npm/v/nrel-spa.svg)](https://www.npmjs.com/package/nrel-spa)
[![CI](https://github.com/acamarata/nrel-spa/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/nrel-spa/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/nrel-spa.svg)](./LICENSE)
[![wiki](https://img.shields.io/badge/docs-wiki-blue)](https://github.com/acamarata/nrel-spa/wiki)

Pure JavaScript implementation of the NREL Solar Position Algorithm (SPA). Computes solar zenith angle, azimuth, sunrise, sunset, and solar noon for any location and date. Zero dependencies, synchronous. Validated to produce identical results to the original NREL C reference implementation.

## Installation

```bash
npm install nrel-spa
```

## Dates: a day or a moment

`getSpa` answers two different kinds of question, and they do not want the same input.

| You want | Depends on | Pass |
|---|---|---|
| `zenith`, `azimuth`, `incidence` | the exact moment | a `Date` |
| `sunrise`, `solarNoon`, `sunset`, custom `angles` | the calendar **day** only | `'YYYY-MM-DD'` |

Rise, transit and set are independent of the time of day: hold the date and vary the hour from
00 to 23 and all three are identical to six decimal places. So for those, what matters is only
*which day you meant* — and a `Date` cannot say. It carries no record of whether it was built
from local or UTC parts, so `new Date(2026, 7, 22)` is `2026-08-21T14:00Z` in Tokyo and
`2026-08-22T04:00Z` in New York. The Tokyo caller gets the previous day's sunrise, silently.

```js
getSpa('2026-08-22', lat, lng, tz);      // a day. same answer on every machine
getSpa(new Date(), lat, lng, tz);        // a moment. correct for position
getSpa(new Date(2026, 7, 22), ...);      // ambiguous — avoid for rise/set
```

The string form is anchored at UTC noon, the furthest point from either day boundary.


## Polar day and polar night

Sunrise and sunset genuinely stop occurring above the polar circles. On those days
`sunrise` and `sunset` are returned as `NaN`, and `calcSpa` renders them as `"N/A"`.

`solarNoon` is **always** available. The sun crosses the local meridian every day
everywhere on Earth, so solar transit is defined even when the crossing happens below the
horizon — which is what happens throughout polar night. Callers that need a time of day
during those weeks should anchor to `solarNoon` rather than treating the absent sunrise as
a failure.

The NREL reference implementation signals "no such event" with the magic number `-99999`.
That value never crosses this package's public API: it is a finite number, so it silently
passes `Number.isFinite` checks and renders as a real clock time (`-99999` reduced modulo
24 is exactly 9, so it displays as "09:00"). The internal port stays faithful to the
reference; the boundary converts it.


## Quick Start

```javascript
import { getSpa, calcSpa } from 'nrel-spa';

const date = new Date('2025-06-21T00:00:00Z');

// Raw fractional hours
const raw = getSpa(date, 40.7128, -74.006, -4); // New York, EDT
console.log(raw.sunrise);   // 5.417
console.log(raw.solarNoon); // 12.965
console.log(raw.sunset);    // 20.509

// Formatted HH:MM:SS strings
const fmt = calcSpa(date, 40.7128, -74.006, -4);
console.log(fmt.sunrise);   // "05:25:03"
console.log(fmt.solarNoon); // "12:57:56"
console.log(fmt.sunset);    // "20:30:35"
```

CommonJS:

```js
const { getSpa } = require('nrel-spa');
```

Pass a `zenith angles` array as the sixth argument to `getSpa`/`calcSpa` for civil (96°), nautical (102°), or astronomical (108°) twilight times.

## TypeScript

```typescript
import { getSpa, calcSpa, formatTime, SPA_ZA_RTS } from 'nrel-spa';
import type { SpaOptions, SpaResult, SpaFunctionCode } from 'nrel-spa';
```

## Documentation

Full API reference, algorithm notes, and twilight calculation guide: [GitHub Wiki](https://github.com/acamarata/nrel-spa/wiki)

## Related

- [solar-spa](https://www.npmjs.com/package/solar-spa): WASM build of the same algorithm, async, for high-throughput batch work
- [pray-calc](https://www.npmjs.com/package/pray-calc): Islamic prayer times built on nrel-spa

## Acknowledgments

The core algorithm is a JavaScript port of the NREL SPA by Ibrahim Reda and Afshin Andreas:

> Reda, I., Andreas, A. (2004). "Solar Position Algorithm for Solar Radiation Applications." Solar Energy, 76(5), 577-589.

## License

MIT (TypeScript wrapper and build tooling). The core algorithm in `lib/spa.js` is a port of NREL's SPA C source, subject to its own terms. See [LICENSE](./LICENSE).

## Telemetry

This package supports optional, anonymous usage telemetry via [`@acamarata/telemetry`](https://github.com/acamarata/telemetry). It is **off by default**. See [TELEMETRY.md](https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md) for what is collected and how to enable or disable it.
