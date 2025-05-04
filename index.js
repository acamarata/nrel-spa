// index.js
const spa = require('./dist/spa');

/**
 * Convert fractional hours to HH:MM:SS.mmm (rounding total seconds)
 */
function fractalTime(fractionalHour) {
  const totalSec = Math.round(fractionalHour * 3600);
  const H = Math.floor(totalSec / 3600);
  const rem = totalSec - H * 3600;
  const M = Math.floor(rem / 60);
  const S = rem - M * 60;
  const ms = Math.round((fractionalHour * 3600 - Math.floor(fractionalHour * 3600)) * 1000);
  return `${H.toString().padStart(2,'0')}:` +
         `${M.toString().padStart(2,'0')}:` +
         `${S.toString().padStart(2,'0')}.` +
         `${ms.toString().padStart(3,'0')}`;
}

/**
 * Re-solve hour-angle for a custom zenith angle Zdeg (in degrees)
 */
function adjustForCustomAngle(base, Zdeg) {
  const φ = base.latitude * Math.PI/180;
  const δ = base.delta    * Math.PI/180;
  const Z = Zdeg          * Math.PI/180;
  const cosH0 = (Math.cos(Z) - Math.sin(φ) * Math.sin(δ)) /
                (Math.cos(φ) * Math.cos(δ));
  if (cosH0 < -1 || cosH0 > 1) {
    return { ...base, sunrise: NaN, sunset: NaN };
  }
  const H0h = (Math.acos(cosH0) * 180/Math.PI) / 15;
  return {
    ...base,
    sunrise:  base.suntransit - H0h,
    sunset:   base.suntransit + H0h
  };
}

/**
 * Core SPA data calculation (raw fractional hours)
 * @param {Date} date - JavaScript Date (UTC)
 * @param {number} lat
 * @param {number} lng
 * @param {number} tz - timezone offset in hours (e.g. -4 for EDT)
 * @param {object} params - { elevation, pressure, temperature, delta_ut1, delta_t, slope, azm_rotation, atmos_refract }
 * @param {number[]} angles - custom zenith angles (deg) for twilight
 */
function getSpa(date, lat, lng, tz = 0, params = {}, angles = []) {
  const d = new spa.SpaData();
  // Use UTC components and explicit tz
  d.year      = date.getUTCFullYear();
  d.month     = date.getUTCMonth() + 1;
  d.day       = date.getUTCDate();
  d.hour      = date.getUTCHours();
  d.minute    = date.getUTCMinutes();
  d.second    = date.getUTCSeconds();
  d.longitude = lng;
  d.latitude  = lat;
  d.timezone  = tz;

  // Align defaults to reference C code
  d.elevation    = params.elevation    ?? 0;
  d.pressure     = params.pressure     ?? 1013;
  d.temperature  = params.temperature  ?? 15;
  d.delta_ut1    = params.delta_ut1    ?? 0;
  d.delta_t      = params.delta_t      ?? 67;
  d.slope        = params.slope        ?? 0;
  d.azm_rotation = params.azm_rotation ?? 0;
  d.atmos_refract= params.atmos_refract?? 0.5667;

  // Only compute ZA and rise/transit/set
  d.function     = spa.SPA_ZA_RTS;

  const rc = spa.spa_calculate(d);
  if (rc !== 0) {
    throw new Error(`SPA calculation failed with code ${rc}`);
  }

  // Base outputs
  const output = {
    zenith:    d.zenith,
    azimuth:   d.azimuth,
    sunrise:   d.sunrise,
    solarNoon: d.suntransit,
    sunset:    d.sunset
  };

  // Custom angles (twilight)
  if (angles.length) {
    output.angles = angles.map(Z => {
      const c = adjustForCustomAngle(d, Z);
      return { sunrise: c.sunrise, sunset: c.sunset };
    });
  }

  return output;
}

/**
 * Same as getSpa, but formats sunrise/noon/sunset to strings
 */
function calcSpa(date, lat, lng, tz = 0, params = {}, angles = []) {
  const raw = getSpa(date, lat, lng, tz, params, angles);
  return {
    zenith:    raw.zenith,
    azimuth:   raw.azimuth,
    sunrise:   fractalTime(raw.sunrise),
    solarNoon: fractalTime(raw.solarNoon),
    sunset:    fractalTime(raw.sunset),
    angles:    raw.angles ? raw.angles.map(a => ({
      sunrise: fractalTime(a.sunrise),
      sunset:  fractalTime(a.sunset)
    })) : undefined
  };
}

module.exports = { getSpa, calcSpa, fractalTime, adjustForCustomAngle };