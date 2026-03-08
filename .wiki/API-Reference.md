# API Reference

## Functions

### `getSpa(date, latitude, longitude, timezone?, options?, angles?)`

Computes solar position for the given date and location. Returns raw numerical values.

**Parameters:**

| Parameter   | Type                    | Required | Description                                                                                      |
| ----------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `date`      | `Date`                  | Yes      | UTC date and time. Uses UTC components internally.                                               |
| `latitude`  | `number`                | Yes      | Observer latitude, -90 to 90. Negative = south.                                                  |
| `longitude` | `number`                | Yes      | Observer longitude, -180 to 180. Negative = west.                                                |
| `timezone`  | `number \| null`        | No       | Hours from UTC (e.g., -4 for EDT). Default: `0`.                                                 |
| `options`   | `SpaOptions \| null`    | No       | Atmospheric and calculation parameters.                                                          |
| `angles`    | `[number, ...number[]]` | No       | One or more custom zenith angles in degrees. See [Twilight Calculations](Twilight-Calculations). |

**Returns:** `SpaResult`

```typescript
interface SpaResult {
  zenith: number; // topocentric zenith angle (degrees)
  azimuth: number; // topocentric azimuth, eastward from north (degrees)
  sunrise: number; // local sunrise (fractional hours, e.g. 5.417 = 05:25)
  solarNoon: number; // local solar noon (fractional hours)
  sunset: number; // local sunset (fractional hours)
}
```

`sunrise`, `solarNoon`, and `sunset` are `NaN` when `options.function` is `SPA_ZA` or `SPA_ZA_INC` (those codes skip the rise/set calculation).

When `angles` is provided, returns `SpaResultWithAngles`:

```typescript
interface SpaResultWithAngles extends SpaResult {
  angles: SpaAnglesResult[];
}

interface SpaAnglesResult {
  sunrise: number; // rise time for this zenith angle (fractional hours)
  sunset: number; // set time for this zenith angle (fractional hours)
}
```

**Throws:**

- `TypeError` if `date` is not a valid Date, or `latitude`/`longitude` are not finite numbers
- `RangeError` if `latitude` is outside [-90, 90] or `longitude` outside [-180, 180]
- `RangeError` if `options.function` is not 0, 1, 2, or 3
- `RangeError` if `angles` is provided with a non-RTS function code (`SPA_ZA` or `SPA_ZA_INC`)
- `Error` if the internal SPA calculation returns a non-zero error code

---

### `calcSpa(date, latitude, longitude, timezone?, options?, angles?)`

Same parameters as `getSpa()`. Formats `sunrise`, `solarNoon`, and `sunset` as `HH:MM:SS` strings.

**Returns:** `SpaFormattedResult`

```typescript
interface SpaFormattedResult {
  zenith: number; // same as SpaResult
  azimuth: number; // same as SpaResult
  sunrise: string; // "HH:MM:SS" or "N/A" during polar day/night, or when using SPA_ZA/SPA_ZA_INC
  solarNoon: string; // "HH:MM:SS" or "N/A"
  sunset: string; // "HH:MM:SS" or "N/A"
}
```

When `angles` is provided, returns `SpaFormattedResultWithAngles`:

```typescript
interface SpaFormattedResultWithAngles extends SpaFormattedResult {
  angles: SpaFormattedAnglesResult[];
}

interface SpaFormattedAnglesResult {
  sunrise: string; // "HH:MM:SS" or "N/A"
  sunset: string; // "HH:MM:SS" or "N/A"
}
```

---

### `formatTime(hours)`

Converts a fractional hour value to `HH:MM:SS` format.

```javascript
formatTime(5.417489); // "05:25:03"
formatTime(12); // "12:00:00"
formatTime(23.9997); // "23:59:59"
formatTime(-1); // "N/A"
formatTime(NaN); // "N/A"
formatTime(Infinity); // "N/A"
```

---

## SpaOptions

All options are optional. Defaults match the NREL C reference implementation.

| Option          | Type              | Default      | Description                                                                               |
| --------------- | ----------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `elevation`     | `number`          | `0`          | Observer elevation above sea level in meters.                                             |
| `pressure`      | `number`          | `1013`       | Annual average atmospheric pressure in millibars.                                         |
| `temperature`   | `number`          | `15`         | Annual average temperature in degrees Celsius.                                            |
| `delta_ut1`     | `number`          | `0`          | Fractional second difference between UTC and UT1. Valid range: (-1, 1).                   |
| `delta_t`       | `number`          | `67`         | Difference between Terrestrial Time and UTC in seconds.                                   |
| `slope`         | `number`          | `0`          | Surface slope from horizontal in degrees. Used for incidence angle (SPA_ZA_INC, SPA_ALL). |
| `azm_rotation`  | `number`          | `0`          | Surface azimuth rotation from south in degrees.                                           |
| `atmos_refract` | `number`          | `0.5667`     | Atmospheric refraction at sunrise/sunset in degrees.                                      |
| `function`      | `SpaFunctionCode` | `SPA_ZA_RTS` | Which outputs to compute.                                                                 |

---

## Function Codes

```javascript
import { SPA_ZA, SPA_ZA_INC, SPA_ZA_RTS, SPA_ALL } from 'nrel-spa';
```

| Constant     | Value | Outputs Computed                                                           |
| ------------ | ----- | -------------------------------------------------------------------------- |
| `SPA_ZA`     | `0`   | `zenith`, `azimuth`                                                        |
| `SPA_ZA_INC` | `1`   | `zenith`, `azimuth`, incidence angle (for solar panels on sloped surfaces) |
| `SPA_ZA_RTS` | `2`   | `zenith`, `azimuth`, `sunrise`, `solarNoon`, `sunset`                      |
| `SPA_ALL`    | `3`   | All outputs from SPA_ZA_INC and SPA_ZA_RTS combined                        |

The default is `SPA_ZA_RTS`. Use `SPA_ZA` for zenith/azimuth-only calculations if you do not need rise/set times; it skips the three-day calculation that rise/set requires and is slightly faster. Custom zenith `angles` require `SPA_ZA_RTS` or `SPA_ALL`.

---

## SpaFunctionCode Type

```typescript
type SpaFunctionCode = 0 | 1 | 2 | 3;
```

---

## Named Types

All interfaces and types are exported from `nrel-spa` and can be imported in TypeScript:

```typescript
import type {
  SpaOptions,
  SpaResult,
  SpaFormattedResult,
  SpaAnglesResult,
  SpaFormattedAnglesResult,
  SpaResultWithAngles,
  SpaFormattedResultWithAngles,
  SpaFunctionCode,
} from 'nrel-spa';
```

---

[Home](Home) . [Architecture](Architecture) . [Twilight Calculations](Twilight-Calculations) . [NREL SPA Algorithm](NREL-SPA-Algorithm)
