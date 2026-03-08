# nrel-spa

[![npm version](https://img.shields.io/npm/v/nrel-spa.svg)](https://www.npmjs.com/package/nrel-spa)
[![CI](https://github.com/acamarata/nrel-spa/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/nrel-spa/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/nrel-spa.svg)](./LICENSE)

Pure JavaScript implementation of the NREL Solar Position Algorithm (SPA). Computes solar zenith angle, azimuth, sunrise, sunset, and solar noon for any location and date. Validated to produce identical results to the original NREL C reference implementation.

## Installation

```bash
npm install nrel-spa
```

## Quick Start

```javascript
import { getSpa, calcSpa } from 'nrel-spa';

const date = new Date('2025-06-21T00:00:00Z'); // UTC date/time

// Minimum required parameters
const raw = getSpa(date, 40.7128, -74.006, -4); // New York, EDT (UTC-4)
console.log(raw.sunrise);   // 5.417 (fractional hours)
console.log(raw.solarNoon); // 12.965
console.log(raw.sunset);    // 20.509

// Formatted output: same parameters, HH:MM:SS strings
const fmt = calcSpa(date, 40.7128, -74.006, -4);
console.log(fmt.sunrise);   // "05:25:03"
console.log(fmt.solarNoon); // "12:57:56"
console.log(fmt.sunset);    // "20:30:35"

// With atmospheric parameters and custom zenith angles (twilight)
const result = calcSpa(
  date,
  40.7128,          // latitude (degrees, negative = south)
  -74.006,          // longitude (degrees, negative = west)
  -4,               // timezone offset in hours from UTC
  {
    elevation: 10,  // meters above sea level
    pressure: 1013, // millibars
    temperature: 20 // degrees Celsius
  },
  [96, 102, 108],   // civil, nautical, astronomical twilight zenith angles
);
console.log(result.sunrise);        // "05:25:03"
console.log(result.angles[0]);      // { sunrise: "04:53:...", sunset: "20:02:..." }
```

## API

### `getSpa(date, latitude, longitude, timezone?, options?, angles?)`

Returns raw numerical values. Sunrise, solarNoon, and sunset are fractional hours (e.g., `5.417` for 05:25).

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | `Date` | Yes | UTC date and time for the calculation |
| `latitude` | `number` | Yes | Observer latitude in degrees (-90 to 90) |
| `longitude` | `number` | Yes | Observer longitude in degrees (-180 to 180) |
| `timezone` | `number \| null` | No | Hours from UTC. Default: `0` |
| `options` | `SpaOptions \| null` | No | Atmospheric and calculation parameters |
| `angles` | `number[]` | No | Custom zenith angles in degrees for twilight |

**Returns:** `SpaResult` (or `SpaResultWithAngles` when `angles` is provided)

```typescript
interface SpaResult {
  zenith:    number; // topocentric zenith angle (degrees)
  azimuth:   number; // topocentric azimuth, eastward from north (degrees)
  sunrise:   number; // local sunrise time (fractional hours)
  solarNoon: number; // local solar noon (fractional hours)
  sunset:    number; // local sunset time (fractional hours)
}
```

### `calcSpa(date, latitude, longitude, timezone?, options?, angles?)`

Same as `getSpa()`, but formats sunrise, solarNoon, and sunset as `HH:MM:SS` strings. Returns `"N/A"` for those fields during polar day or polar night.

### `formatTime(hours)`

Converts fractional hours to `HH:MM:SS` format. Returns `"N/A"` for negative or non-finite values.

```javascript
import { formatTime } from 'nrel-spa';
formatTime(5.417489); // "05:25:03"
formatTime(-1);       // "N/A"
```

### `SpaOptions`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `elevation` | `number` | `0` | Observer elevation in meters |
| `pressure` | `number` | `1013` | Atmospheric pressure in millibars |
| `temperature` | `number` | `15` | Temperature in degrees Celsius |
| `delta_ut1` | `number` | `0` | UT1-UTC correction in seconds |
| `delta_t` | `number` | `67` | TT-UTC difference in seconds |
| `slope` | `number` | `0` | Surface slope from horizontal (degrees) |
| `azm_rotation` | `number` | `0` | Surface azimuth rotation from south (degrees) |
| `atmos_refract` | `number` | `0.5667` | Atmospheric refraction at sunrise/sunset (degrees) |
| `function` | `SpaFunctionCode` | `SPA_ZA_RTS` | Which outputs to compute |

### Function Codes

```javascript
import { SPA_ZA, SPA_ZA_INC, SPA_ZA_RTS, SPA_ALL } from 'nrel-spa';
```

| Code | Value | Computes |
| --- | --- | --- |
| `SPA_ZA` | `0` | Zenith and azimuth only |
| `SPA_ZA_INC` | `1` | Zenith, azimuth, and incidence angle |
| `SPA_ZA_RTS` | `2` | Zenith, azimuth, sunrise, noon, sunset (default) |
| `SPA_ALL` | `3` | All outputs |

## Architecture

The core algorithm in `lib/spa.js` is a direct port of the NREL SPA C source to JavaScript, preserving the same mathematical structure: 63 periodic nutation terms, full heliocentric coordinate calculation, topocentric correction, and atmospheric refraction. It has been validated to produce output identical to the C reference within rounding.

The TypeScript wrapper in `src/` provides the public API, input validation, and the `formatTime` utility. The package ships dual CJS and ESM builds via tsup, with full TypeScript definitions.

See the [wiki](https://github.com/acamarata/nrel-spa/wiki) for a detailed breakdown of the algorithm and architecture.

## Compatibility

- **Node.js:** 20, 22, 24 (CI tested)
- **ESM:** `import { getSpa } from 'nrel-spa'`
- **CommonJS:** `const { getSpa } = require('nrel-spa')`
- **TypeScript:** Full type definitions included

Bundlers (Vite, Webpack, esbuild, Rollup) work via the `exports` map in package.json.

## TypeScript

```typescript
import {
  getSpa,
  calcSpa,
  formatTime,
  SPA_ZA,
  SPA_ZA_INC,
  SPA_ZA_RTS,
  SPA_ALL,
  type SpaOptions,
  type SpaResult,
  type SpaFormattedResult,
  type SpaAnglesResult,
  type SpaFormattedAnglesResult,
  type SpaResultWithAngles,
  type SpaFormattedResultWithAngles,
  type SpaFunctionCode,
} from 'nrel-spa';
```

## Documentation

Full documentation is available on the [GitHub Wiki](https://github.com/acamarata/nrel-spa/wiki):

- [API Reference](https://github.com/acamarata/nrel-spa/wiki/API-Reference)
- [Architecture](https://github.com/acamarata/nrel-spa/wiki/Architecture)
- [Twilight Calculations](https://github.com/acamarata/nrel-spa/wiki/Twilight-Calculations)
- [NREL SPA Algorithm](https://github.com/acamarata/nrel-spa/wiki/NREL-SPA-Algorithm)

## Related

Other packages in this collection:

- [solar-spa](https://www.npmjs.com/package/solar-spa): WASM build of the same algorithm, async, for high-throughput batch calculations
- [pray-calc](https://www.npmjs.com/package/pray-calc): Islamic prayer times built on nrel-spa

## Acknowledgments

The core algorithm is a JavaScript port of the Solar Position Algorithm (SPA) developed by Ibrahim Reda and Afshin Andreas at the National Renewable Energy Laboratory (NREL):

> Reda, I., Andreas, A. (2004). "Solar Position Algorithm for Solar Radiation Applications." Solar Energy, 76(5), 577-589. [https://doi.org/10.1016/j.solener.2003.12.003](https://doi.org/10.1016/j.solener.2003.12.003)

Original source: [https://midcdmz.nrel.gov/spa/](https://midcdmz.nrel.gov/spa/)

## License

MIT (TypeScript wrapper and build tooling). The core algorithm in `lib/spa.js` is a port of NREL's SPA C source, which is subject to its own terms. See the [LICENSE](./LICENSE) file for the full notice.
