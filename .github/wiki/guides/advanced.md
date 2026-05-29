# Advanced Usage

## Twilight calculations

Pass an array of custom zenith angles to compute additional rise/set events beyond the default solar disk (90.833°).

```js
import { getSpa } from 'nrel-spa';

const result = getSpa(date, lat, lon, tz, {}, [96, 102, 108]);

for (const ca of result.customAngles) {
  const label = ca.angle === 96 ? 'Civil' : ca.angle === 102 ? 'Nautical' : 'Astronomical';
  console.log(`${label} dawn: ${ca.sunrise.toFixed(4)} hours`);
  console.log(`${label} dusk: ${ca.sunset.toFixed(4)} hours`);
}
```

Zenith reference:
- 90.833° — standard solar disk (default)
- 96° — civil twilight
- 102° — nautical twilight
- 108° — astronomical twilight

## Batch processing

`getSpa` is synchronous, making batch work straightforward without async coordination.

```js
import { getSpa } from 'nrel-spa';

const lat = 51.5074; // London
const lon = -0.1278;
const tz = 0;

let totalDaylight = 0;
for (let doy = 0; doy < 365; doy++) {
  const d = new Date(Date.UTC(2025, 0, 1 + doy, 12, 0, 0));
  const r = getSpa(d, lat, lon, tz);
  if (isFinite(r.sunrise)) {
    totalDaylight += r.sunset - r.sunrise;
  }
}
console.log(`Annual daylight: ${totalDaylight.toFixed(0)} hours`);
```

## Polar scenarios

At high latitudes, `sunrise` and `sunset` are `NaN` when the sun does not cross the horizon. Check with `isFinite()`.

```js
const r = getSpa(new Date('2025-12-21T12:00:00Z'), 89, 0, 0);
console.log(isFinite(r.sunrise)); // false — polar night
```

`calcSpa` returns `"N/A"` strings in these cases.

## vs solar-spa

Both packages implement the same NREL SPA algorithm. Key differences:

| | nrel-spa | solar-spa |
|---|---|---|
| Runtime | Pure JS | WebAssembly |
| API | Synchronous | Async (Promise) |
| Custom zenith | Yes | No |
| Bundle size | ~38 KB | ~60 KB |
| Init latency | None | First call |

Use `nrel-spa` when you need synchronous calls or custom twilight angles. Use `solar-spa` when throughput for very large batches matters.

## Delta-T

The default `delta_t` is 67 seconds, accurate for dates near 2025. For historical dates or high-precision work, provide a value from the IERS or USNO tables.

```js
getSpa(new Date('1900-01-01T12:00:00Z'), lat, lon, tz, { delta_t: -2.72 });
```
