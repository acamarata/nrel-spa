# Twilight Calculations

Standard sunrise and sunset use a zenith angle of approximately 90.833 degrees (90 degrees plus atmospheric refraction and solar disc radius). Twilight is defined by the sun's position below the horizon, expressed as the zenith angle it occupies.

## Standard Twilight Definitions

| Type | Zenith Angle | Description |
| --- | --- | --- |
| Sunrise / Sunset | ~90.833 | Center of sun at horizon (accounting for refraction) |
| Civil twilight | 96 | Sufficient light for outdoor activities without artificial light |
| Nautical twilight | 102 | Horizon visible; used for celestial navigation |
| Astronomical twilight | 108 | Sky fully dark enough for astronomical observation |

## Usage

Pass an array of zenith angles as the sixth argument to `getSpa()` or `calcSpa()`. The function returns an `angles` array, one entry per input angle, each with `sunrise` and `sunset` for that zenith threshold.

```javascript
import { calcSpa } from 'nrel-spa';

const result = calcSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128,  // New York
  -74.006,
  -4,       // EDT
  {},       // default options
  [96, 102, 108], // civil, nautical, astronomical
);

console.log(result.sunrise);          // "05:25:03" (standard)
console.log(result.angles[0].sunrise); // civil twilight begin
console.log(result.angles[1].sunrise); // nautical twilight begin
console.log(result.angles[2].sunrise); // astronomical twilight begin
```

Expected output for New York, June 21, 2025:

| Event | Time |
| --- | --- |
| Astronomical twilight begin | ~03:57 |
| Nautical twilight begin | ~04:28 |
| Civil twilight begin | ~04:53 |
| Sunrise | ~05:25 |
| Sunset | ~20:30 |
| Civil twilight end | ~21:02 |
| Nautical twilight end | ~21:27 |
| Astronomical twilight end | ~21:58 |

## How It Works

The base `getSpa()` calculation computes the sun's declination (`delta`) and solar noon (`suntransit`) for the given date and location. For each custom zenith angle `Z`, the function solves the hour angle equation:

```
cos(H0) = (cos(Z) - sin(lat) * sin(delta)) / (cos(lat) * cos(delta))
```

where `H0` is the hour angle at the zenith crossing. The rise and set times follow from:

```
sunrise = suntransit - H0 / 15   (H0 in degrees, result in hours)
sunset  = suntransit + H0 / 15
```

If `|cos(H0)| > 1`, the sun never crosses that zenith angle at the given latitude and date. The function returns `NaN` for sunrise and sunset in that case.

## Polar Cases

At high latitudes during summer (midnight sun), the sun may not set even at the standard horizon. It certainly will not cross deeper zenith angles like 96 or 102 degrees. Check for `NaN` or `isFinite()` on the result:

```javascript
import { getSpa } from 'nrel-spa';

const r = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  71, 25, 2, {}, [96],
);

if (r.angles && !isFinite(r.angles[0].sunrise)) {
  console.log('No civil twilight at this latitude/date');
}
```

## Islamic Prayer Application

This twilight mechanism is used by [pray-calc](https://www.npmjs.com/package/pray-calc) to compute Fajr and Isha prayer times, which are defined by the sun's position below the horizon at specific angles (typically 15-18 degrees below, equivalent to zenith angles of 105-108 degrees).

---

[Home](Home) . [API Reference](API-Reference) . [Architecture](Architecture) . [NREL SPA Algorithm](NREL-SPA-Algorithm)
