export type {
  SpaOptions,
  SpaResult,
  SpaFormattedResult,
  SpaAnglesResult,
  SpaResultWithAngles,
  SpaFormattedResultWithAngles,
  SpaFunctionCode,
} from './types.js';

export { SPA_ZA, SPA_ZA_INC, SPA_ZA_RTS, SPA_ALL } from './types.js';

import { SPA_ZA_RTS } from './types.js';
import type {
  SpaOptions,
  SpaResult,
  SpaFormattedResult,
  SpaResultWithAngles,
  SpaFormattedResultWithAngles,
} from './types.js';

// The core SPA algorithm lives in lib/spa.js (the JS port of the NREL C source).
// In ESM builds, tsup injects a createRequire-based __require shim via the banner
// option (see tsup.config.ts). In CJS builds, require() is natively available.
declare const __require: NodeRequire;
const _load = typeof __require === 'function' ? __require : require;
const spa = _load('../lib/spa.js') as {
  SpaData: new () => SpaDataInstance;
  SPA_ZA_RTS: number;
  spa_calculate: (data: SpaDataInstance) => number;
};

/** Internal SpaData instance shape from lib/spa.js */
interface SpaDataInstance {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timezone: number;
  longitude: number;
  latitude: number;
  elevation: number;
  pressure: number;
  temperature: number;
  delta_ut1: number;
  delta_t: number;
  slope: number;
  azm_rotation: number;
  atmos_refract: number;
  function: number;
  zenith: number;
  azimuth: number;
  sunrise: number;
  sunset: number;
  suntransit: number;
  delta: number;
  [key: string]: number;
}

/**
 * Validate that a value is a finite number, throwing a clear error if not.
 * @internal
 */
function assertFiniteNumber(value: unknown, name: string): asserts value is number {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new TypeError(
      `SPA: ${name} must be a finite number, got ${typeof value === 'number' ? value : typeof value}`,
    );
  }
}

/**
 * Format fractional hours to HH:MM:SS string.
 * Returns "N/A" for non-finite or negative values (polar night/day scenarios).
 */
export function formatTime(hours: number): string {
  if (!isFinite(hours) || hours < 0) return 'N/A';

  const totalSec = Math.round(hours * 3600);
  // Wrap at 24h: values near midnight can round to 24:00:00
  const h = Math.floor(totalSec / 3600) % 24;
  const rem = totalSec - Math.floor(totalSec / 3600) * 3600;
  const m = Math.floor(rem / 60);
  const s = rem - m * 60;

  return (
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0')
  );
}

/**
 * Re-solve hour angles for a custom zenith angle (e.g., twilight calculations).
 *
 * Common angles: civil twilight 96, nautical twilight 102, astronomical twilight 108.
 *
 * @param base - SpaData instance with computed delta and suntransit
 * @param zenithAngle - Custom zenith angle in degrees
 * @returns Object with sunrise and sunset for the custom angle (NaN if no rise/set)
 * @internal
 */
function adjustForCustomAngle(
  base: SpaDataInstance,
  zenithAngle: number,
): { sunrise: number; sunset: number } {
  const phi = base.latitude * Math.PI / 180;
  const delta = base.delta * Math.PI / 180;
  const Z = zenithAngle * Math.PI / 180;
  const cosH0 =
    (Math.cos(Z) - Math.sin(phi) * Math.sin(delta)) /
    (Math.cos(phi) * Math.cos(delta));

  if (cosH0 < -1 || cosH0 > 1) {
    return { sunrise: NaN, sunset: NaN };
  }

  const H0h = (Math.acos(cosH0) * 180 / Math.PI) / 15;
  return {
    sunrise: base.suntransit - H0h,
    sunset: base.suntransit + H0h,
  };
}

/**
 * Compute solar position for the given parameters.
 *
 * @param date - JavaScript Date object (uses UTC components)
 * @param latitude - Observer latitude in degrees (-90 to 90, negative = south)
 * @param longitude - Observer longitude in degrees (-180 to 180, negative = west)
 * @param timezone - Hours from UTC (e.g., -4 for EDT). Default: 0
 * @param options - Optional atmospheric and calculation parameters
 * @param angles - Custom zenith angles in degrees for twilight calculations
 * @returns Solar position result with computed values
 */
export function getSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: number | null,
  options?: SpaOptions | null,
  angles?: number[],
): SpaResult | SpaResultWithAngles {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('SPA: date must be a valid Date object');
  }
  assertFiniteNumber(latitude, 'latitude');
  assertFiniteNumber(longitude, 'longitude');

  if (latitude < -90 || latitude > 90) {
    throw new RangeError(`SPA: latitude must be between -90 and 90, got ${latitude}`);
  }
  if (longitude < -180 || longitude > 180) {
    throw new RangeError(`SPA: longitude must be between -180 and 180, got ${longitude}`);
  }

  const tz = timezone ?? 0;
  const opts = options ?? {};

  const d = new spa.SpaData();
  d.year = date.getUTCFullYear();
  d.month = date.getUTCMonth() + 1;
  d.day = date.getUTCDate();
  d.hour = date.getUTCHours();
  d.minute = date.getUTCMinutes();
  d.second = date.getUTCSeconds();
  d.longitude = longitude;
  d.latitude = latitude;
  d.timezone = tz;

  d.elevation = opts.elevation ?? 0;
  d.pressure = opts.pressure ?? 1013;
  d.temperature = opts.temperature ?? 15;
  d.delta_ut1 = opts.delta_ut1 ?? 0;
  d.delta_t = opts.delta_t ?? 67;
  d.slope = opts.slope ?? 0;
  d.azm_rotation = opts.azm_rotation ?? 0;
  d.atmos_refract = opts.atmos_refract ?? 0.5667;
  d.function = opts.function ?? SPA_ZA_RTS;

  const rc = spa.spa_calculate(d);
  if (rc !== 0) {
    throw new Error(`SPA: calculation failed (error code ${rc})`);
  }

  const result: SpaResult = {
    zenith: d.zenith,
    azimuth: d.azimuth,
    sunrise: d.sunrise,
    solarNoon: d.suntransit,
    sunset: d.sunset,
  };

  if (angles && angles.length > 0) {
    const angleResults = angles.map((Z) => adjustForCustomAngle(d, Z));
    return {
      ...result,
      angles: angleResults,
    } as SpaResultWithAngles;
  }

  return result;
}

/**
 * Same as getSpa(), but formats sunrise, solarNoon, and sunset as HH:MM:SS strings.
 * Returns "N/A" for time fields during polar day or polar night.
 */
export function calcSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: number | null,
  options?: SpaOptions | null,
  angles?: number[],
): SpaFormattedResult | SpaFormattedResultWithAngles {
  const raw = getSpa(date, latitude, longitude, timezone, options, angles);

  const formatted: SpaFormattedResult = {
    zenith: raw.zenith,
    azimuth: raw.azimuth,
    sunrise: formatTime(raw.sunrise),
    solarNoon: formatTime(raw.solarNoon),
    sunset: formatTime(raw.sunset),
  };

  if ('angles' in raw && raw.angles) {
    return {
      ...formatted,
      angles: raw.angles.map((a) => ({
        sunrise: formatTime(a.sunrise),
        sunset: formatTime(a.sunset),
      })),
    } as SpaFormattedResultWithAngles;
  }

  return formatted;
}
