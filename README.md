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
