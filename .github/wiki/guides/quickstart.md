# Quick Start

Five minutes from install to solar position.

## Install

```sh
npm install nrel-spa
```

## Basic usage

```js
import { getSpa } from 'nrel-spa';

const result = getSpa(
  new Date('2025-06-21T12:00:00Z'),
  40.7128,   // latitude
  -74.0060,  // longitude
  -4,        // UTC offset in hours (EDT)
);

console.log(result.zenith);    // solar zenith angle in degrees
console.log(result.azimuth);   // solar azimuth in degrees
console.log(result.sunrise);   // fractional hours, e.g. 5.42
console.log(result.sunset);    // fractional hours, e.g. 20.58
console.log(result.solarNoon); // fractional hours, e.g. 13.00
```

`getSpa` is synchronous. There is no initialization step, no WASM loading, no async overhead.

## Formatted output

```js
import { calcSpa } from 'nrel-spa';

const result = calcSpa(
  new Date('2025-06-21T12:00:00Z'),
  40.7128,
  -74.0060,
  -4,
);

console.log(result.sunrise);    // "05:25:12"
console.log(result.sunset);     // "20:34:47"
console.log(result.solarNoon);  // "12:59:58"
```

## Custom zenith angles (twilight)

```js
import { getSpa } from 'nrel-spa';

const civil = getSpa(date, lat, lon, tz, {}, [96]);      // civil twilight
const nautical = getSpa(date, lat, lon, tz, {}, [102]);  // nautical twilight
const astro = getSpa(date, lat, lon, tz, {}, [108]);     // astronomical twilight

console.log(civil.customAngles[0].sunrise);   // civil dawn
console.log(nautical.customAngles[0].sunrise); // nautical dawn
```

## Options

```js
const result = getSpa(date, lat, lon, tz, {
  elevation: 100,    // metres above sea level
  pressure: 1013.25, // millibars
  temperature: 15,   // Celsius
  delta_t: 67,       // ΔT in seconds
});
```

## Next steps

- [API Reference](../API-Reference) — full function signatures and return types
- [Architecture](../Architecture) — module structure and algorithm notes
- [Advanced Guide](advanced) — twilight, batch calculations, polar scenarios
