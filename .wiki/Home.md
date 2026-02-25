# nrel-spa

Pure JavaScript implementation of the NREL Solar Position Algorithm (SPA). Computes solar zenith angle, azimuth, sunrise, sunset, and solar noon for any location and date. Validated to produce identical output to the original NREL C reference implementation.

## Overview

**Package:** [nrel-spa on npm](https://www.npmjs.com/package/nrel-spa)
**Repository:** [acamarata/nrel-spa on GitHub](https://github.com/acamarata/nrel-spa)
**License:** MIT (wrapper). NREL SPA C source: see LICENSE for third-party notice.

## Pages

- [API Reference](API-Reference) - Full function signatures, parameters, return types
- [Architecture](Architecture) - How the algorithm is structured and validated
- [Twilight Calculations](Twilight-Calculations) - Custom zenith angles for civil, nautical, astronomical twilight
- [NREL SPA Algorithm](NREL-SPA-Algorithm) - The algorithm background, accuracy, and reference
- [Implementation Comparison](Implementation-Comparison) - Accuracy and performance: nrel-spa vs solar-spa vs C reference

## Quick Example

```javascript
import { calcSpa } from 'nrel-spa';

const result = calcSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128,  // New York latitude
  -74.006,  // New York longitude
  -4,       // EDT (UTC-4)
);

console.log(result.sunrise);   // "05:25:03"
console.log(result.solarNoon); // "12:57:56"
console.log(result.sunset);    // "20:30:35"
```

## Key Facts

- Zero runtime dependencies
- Synchronous: no async, no WASM, no loading delay
- Dual CJS and ESM, full TypeScript definitions
- Matches NREL C reference output within one second across all tested locations

---

[API Reference](API-Reference) . [Architecture](Architecture) . [Twilight Calculations](Twilight-Calculations) . [NREL SPA Algorithm](NREL-SPA-Algorithm) . [Implementation Comparison](Implementation-Comparison)
