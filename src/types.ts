/** SPA function codes. Control which outputs are computed. */
export const SPA_ZA = 0 as const;
export const SPA_ZA_INC = 1 as const;
export const SPA_ZA_RTS = 2 as const;
export const SPA_ALL = 3 as const;

export type SpaFunctionCode = typeof SPA_ZA | typeof SPA_ZA_INC | typeof SPA_ZA_RTS | typeof SPA_ALL;

export interface SpaOptions {
  /** Observer elevation in meters above sea level. Default: 0. */
  elevation?: number;
  /** Atmospheric pressure in millibars. Default: 1013. */
  pressure?: number;
  /** Temperature in degrees Celsius. Default: 15. */
  temperature?: number;
  /** UT1-UTC correction in seconds. Default: 0. */
  delta_ut1?: number;
  /** TT-UTC difference in seconds. Default: 67. */
  delta_t?: number;
  /** Surface slope in degrees from horizontal. Default: 0. */
  slope?: number;
  /** Surface azimuth rotation in degrees from south. Default: 0. */
  azm_rotation?: number;
  /** Atmospheric refraction at sunrise/sunset in degrees. Default: 0.5667. */
  atmos_refract?: number;
  /** SPA function code. Default: SPA_ZA_RTS (2). */
  function?: SpaFunctionCode;
}

export interface SpaResult {
  /** Topocentric zenith angle in degrees. */
  zenith: number;
  /** Topocentric azimuth angle, eastward from north (navigational convention), in degrees. */
  azimuth: number;
  /** Local sunrise time as fractional hours. */
  sunrise: number;
  /** Local sun transit time (solar noon) as fractional hours. */
  solarNoon: number;
  /** Local sunset time as fractional hours. */
  sunset: number;
}

export interface SpaFormattedResult {
  /** Topocentric zenith angle in degrees. */
  zenith: number;
  /** Topocentric azimuth angle, eastward from north (navigational convention), in degrees. */
  azimuth: number;
  /** Local sunrise time as HH:MM:SS string. "N/A" during polar day/night. */
  sunrise: string;
  /** Local sun transit time as HH:MM:SS string. "N/A" during polar day/night. */
  solarNoon: string;
  /** Local sunset time as HH:MM:SS string. "N/A" during polar day/night. */
  sunset: string;
}

export interface SpaAnglesResult {
  /** Sunrise time for this custom zenith angle. */
  sunrise: number;
  /** Sunset time for this custom zenith angle. */
  sunset: number;
}

export interface SpaResultWithAngles extends SpaResult {
  /** Custom angle results, one per angle in the input array. */
  angles: SpaAnglesResult[];
}

export interface SpaFormattedAnglesResult {
  /** Sunrise time for this custom zenith angle, formatted as HH:MM:SS. */
  sunrise: string;
  /** Sunset time for this custom zenith angle, formatted as HH:MM:SS. */
  sunset: string;
}

export interface SpaFormattedResultWithAngles extends SpaFormattedResult {
  /** Custom angle results with formatted times. */
  angles: SpaFormattedAnglesResult[];
}
