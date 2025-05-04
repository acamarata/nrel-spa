// bin/test.js
// Run 10 diverse test cases through both your JS port and the C reference (spa_cli) and compare.

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const { getSpa } = require('../index');

// Constants for C invocation
const DELTA_UT1 = 0.0;
const DELTA_T   = 67.0;
const SLOPE     = 0.0;
const AZM_ROT   = 0.0;
const ATMOS_REF = 0.5667;

// Helper to format fractional hours into "HH:MM:SS" or "N/A"
function formatJS(hour) {
  if (typeof hour !== 'number' || isNaN(hour) || hour < 0 || hour >= 24) {
    return 'N/A';
  }
  const total = Math.round(hour * 3600);
  const H = Math.floor(total / 3600);
  const M = Math.floor((total % 3600) / 60);
  const S = total % 60;
  return [H, M, S]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
}

// Ten diverse test cases
const cases = [
  { label: 'New York Summer', dateUTC: new Date(Date.UTC(2025, 5, 21, 0,0,0)), lat: 40.7128, lon: -74.0060, tz: -4, elevation: 10, pressure: 1013, temperature: 20 },
  { label: 'New York Winter', dateUTC: new Date(Date.UTC(2025,11,21, 0,0,0)), lat: 40.7128, lon: -74.0060, tz: -5, elevation: 10, pressure: 1013, temperature: 5  },
  { label: 'London Summer', dateUTC: new Date(Date.UTC(2025, 5, 21, 0,0,0)), lat: 51.5074, lon: -0.1278, tz:  1, elevation: 11, pressure: 1013, temperature: 18 },
  { label: 'London Winter', dateUTC: new Date(Date.UTC(2025,11,21, 0,0,0)), lat: 51.5074, lon: -0.1278, tz:  0, elevation: 11, pressure: 1013, temperature: 7  },
  { label: 'Tokyo Summer', dateUTC: new Date(Date.UTC(2025, 5, 21, 0,0,0)), lat: 35.6895, lon: 139.6917, tz:  9, elevation: 40, pressure: 1013, temperature: 22 },
  { label: 'Sydney Winter', dateUTC: new Date(Date.UTC(2025, 5, 21, 0,0,0)), lat: -33.8688,lon: 151.2093, tz: 10, elevation: 58, pressure: 1013, temperature: 15 },
  { label: 'Reykjavik Mids', dateUTC: new Date(Date.UTC(2025, 5, 21, 0,0,0)), lat: 64.1466, lon: -21.9426,tz:  0, elevation: 0,  pressure: 1013, temperature: 10 },
  { label: 'Cape Town Summer', dateUTC: new Date(Date.UTC(2025,11,21, 0,0,0)), lat: -33.9249,lon: 18.4241, tz:  2, elevation: 25, pressure: 1013, temperature: 18 },
  { label: 'Quito Equinox', dateUTC: new Date(Date.UTC(2025, 2, 20, 0,0,0)), lat: -0.1807, lon: -78.4678,tz: -5, elevation:2850, pressure: 789,  temperature: 14 },
  { label: 'Tromso Polar',  dateUTC: new Date(Date.UTC(2025,11,21, 0,0,0)), lat: 69.6492, lon:  18.9553,tz:  1, elevation: 0,  pressure: 1013, temperature: -2 }
];

// Print header
console.log(
  'Location         | Date       | C Rise   | JS Rise  | C Noon   | JS Noon  | C Set    | JS Set'
);
console.log('-'.repeat(83));

cases.forEach(({ label, dateUTC, lat, lon, tz, elevation, pressure, temperature }) => {
  const dateStr = dateUTC.toISOString().slice(0,10);

  // JS calculation
  const jsResult = getSpa(dateUTC, lat, lon, tz, { elevation, pressure, temperature });
  const jsRise = formatJS(jsResult.sunrise);
  const jsNoon = formatJS(jsResult.solarNoon);
  const jsSet  = formatJS(jsResult.sunset);

  // C reference via spa_cli
  const cli = path.join(__dirname, 'spa_cli');
  const args = [
    dateUTC.getUTCFullYear(), dateUTC.getUTCMonth()+1, dateUTC.getUTCDate(),
    dateUTC.getUTCHours(),   dateUTC.getUTCMinutes(),   dateUTC.getUTCSeconds(),
    DELTA_UT1, DELTA_T, tz,
    lon, lat,
    elevation, pressure, temperature,
    SLOPE, AZM_ROT, ATMOS_REF
  ].map(String);

  const stdout = spawnSync(cli, args, { encoding: 'utf8' }).stdout || '';
  let cRise = 'N/A', cNoon = 'N/A', cSet = 'N/A';
  stdout.split(/\r?\n/).forEach(line => {
    const match = line.match(/(\d{2}:\d{2}:\d{2})/);
    if (match) {
      const key = line.toLowerCase();
      if (key.includes('sunrise'))      cRise = match[1];
      else if (key.includes('solar noon')) cNoon = match[1];
      else if (key.includes('sunset'))   cSet  = match[1];
    }
  });

  // Print row
  console.log(
    `${label.padEnd(16)} | ${dateStr} | ${cRise.padEnd(8)} | ${jsRise.padEnd(8)} | ` +
    `${cNoon.padEnd(8)} | ${jsNoon.padEnd(8)} | ${cSet.padEnd(8)} | ${jsSet}`
  );
});
