export type {
  SpaOptions,
  SpaResult,
  SpaFormattedResult,
  SpaAnglesResult,
  SpaFormattedAnglesResult,
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
  SpaFormattedAnglesResult,
} from './types.js';

/** Degrees-to-radians conversion factor. */
const DEG = Math.PI / 180;

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
 *
 * @param hours - Fractional hours (e.g., 12.5 for 12:30:00)
 * @returns Formatted time string in HH:MM:SS format, or "N/A"
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
    String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
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
  const phi = base.latitude * DEG;
  const delta = base.delta * DEG;
  const Z = zenithAngle * DEG;
  const cosH0 = (Math.cos(Z) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));

  if (cosH0 < -1 || cosH0 > 1) {
    return { sunrise: NaN, sunset: NaN };
  }

  const H0h = Math.acos(cosH0) / DEG / 15;
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
 * @returns Solar position result with raw numerical values
 * @throws {TypeError} If date, latitude, longitude, timezone, or options numeric fields are not finite numbers
 * @throws {RangeError} If latitude, longitude, timezone, function code, or angle values are out of range
 */
export function getSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: number | null,
  options?: SpaOptions | null,
): SpaResult;
/**
 * Compute solar position and resolve custom zenith angles (e.g., twilight).
 *
 * @param date - JavaScript Date object (uses UTC components)
 * @param latitude - Observer latitude in degrees (-90 to 90, negative = south)
 * @param longitude - Observer longitude in degrees (-180 to 180, negative = west)
 * @param timezone - Hours from UTC (e.g., -4 for EDT). Default: 0
 * @param options - Atmospheric and calculation parameters (pass null for defaults)
 * @param angles - Custom zenith angles in degrees. Common: 96 civil, 102 nautical, 108 astronomical
 * @returns Solar position result including an angles array
 */
export function getSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number | null | undefined,
  options: SpaOptions | null | undefined,
  angles: [number, ...number[]],
): SpaResultWithAngles;
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
  assertFiniteNumber(tz, 'timezone');
  if (tz < -18 || tz > 18) {
    throw new RangeError(`SPA: timezone must be between -18 and 18, got ${tz}`);
  }

  const opts = options ?? {};

  const optNumericFields = [
    'elevation',
    'pressure',
    'temperature',
    'delta_t',
    'slope',
    'azm_rotation',
    'atmos_refract',
  ] as const;
  for (const field of optNumericFields) {
    if (opts[field] !== undefined) {
      assertFiniteNumber(opts[field], `options.${field}`);
    }
  }

  const fnCode = opts.function ?? SPA_ZA_RTS;
  if (fnCode !== 0 && fnCode !== 1 && fnCode !== 2 && fnCode !== 3) {
    throw new RangeError(
      `SPA: options.function must be 0 (SPA_ZA), 1 (SPA_ZA_INC), 2 (SPA_ZA_RTS), or 3 (SPA_ALL), got ${fnCode}`,
    );
  }

  // Validate custom angle values before checking function code compatibility.
  if (angles && angles.length > 0) {
    for (let i = 0; i < angles.length; i++) {
      const a = angles[i];
      if (typeof a !== 'number' || !isFinite(a)) {
        throw new TypeError(
          `SPA: angles[${i}] must be a finite number, got ${typeof a === 'number' ? a : typeof a}`,
        );
      }
      if (a < 0 || a > 180) {
        throw new RangeError(`SPA: angles[${i}] must be between 0 and 180, got ${a}`);
      }
    }
  }

  // Custom angle calculations depend on suntransit, which requires an RTS function code.
  if (angles && angles.length > 0 && fnCode !== 2 && fnCode !== 3) {
    throw new RangeError(
      'SPA: custom zenith angle calculations require an RTS function code (SPA_ZA_RTS or SPA_ALL)',
    );
  }

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
  d.function = fnCode;

  const rc = spa.spa_calculate(d);
  if (rc !== 0) {
    throw new Error(`SPA: calculation failed (error code ${rc})`);
  }

  // sunrise, solarNoon, sunset are only computed for SPA_ZA_RTS (2) and SPA_ALL (3).
  // For SPA_ZA and SPA_ZA_INC, those fields are never populated — return NaN so
  // callers and formatTime() handle them correctly rather than silently returning 0.
  const hasRts = fnCode === 2 || fnCode === 3;
  const result: SpaResult = {
    zenith: d.zenith,
    azimuth: d.azimuth,
    sunrise: hasRts ? d.sunrise : NaN,
    solarNoon: hasRts ? d.suntransit : NaN,
    sunset: hasRts ? d.sunset : NaN,
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
 *
 * @throws {TypeError} If date, latitude, longitude, timezone, or options numeric fields are not finite numbers
 * @throws {RangeError} If latitude, longitude, timezone, function code, or angle values are out of range
 */
export function calcSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: number | null,
  options?: SpaOptions | null,
): SpaFormattedResult;
/**
 * Same as getSpa() with custom angles, but formats all time values as HH:MM:SS strings.
 * Returns "N/A" for time fields during polar day or polar night.
 *
 * @throws {TypeError} If date, latitude, longitude, timezone, or options numeric fields are not finite numbers
 * @throws {RangeError} If latitude, longitude, timezone, function code, or angle values are out of range
 */
export function calcSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number | null | undefined,
  options: SpaOptions | null | undefined,
  angles: [number, ...number[]],
): SpaFormattedResultWithAngles;
export function calcSpa(
  date: Date,
  latitude: number,
  longitude: number,
  timezone?: number | null,
  options?: SpaOptions | null,
  angles?: number[],
): SpaFormattedResult | SpaFormattedResultWithAngles {
  if (angles !== undefined && angles.length > 0) {
    const raw = getSpa(
      date,
      latitude,
      longitude,
      timezone,
      options,
      angles as [number, ...number[]],
    );
    return {
      zenith: raw.zenith,
      azimuth: raw.azimuth,
      sunrise: formatTime(raw.sunrise),
      solarNoon: formatTime(raw.solarNoon),
      sunset: formatTime(raw.sunset),
      angles: raw.angles.map(
        (a): SpaFormattedAnglesResult => ({
          sunrise: formatTime(a.sunrise),
          sunset: formatTime(a.sunset),
        }),
      ),
    };
  }

  const raw = getSpa(date, latitude, longitude, timezone, options);
  return {
    zenith: raw.zenith,
    azimuth: raw.azimuth,
    sunrise: formatTime(raw.sunrise),
    solarNoon: formatTime(raw.solarNoon),
    sunset: formatTime(raw.sunset),
  };
}
