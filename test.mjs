import assert from 'node:assert/strict';
import {
  getSpa,
  calcSpa,
  formatTime,
  SPA_ZA,
  SPA_ZA_INC,
  SPA_ZA_RTS,
  SPA_ALL,
} from './dist/index.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${name}... PASS`);
    passed++;
  } catch (err) {
    console.error(`${name}... FAIL: ${err.message}`);
    failed++;
  }
}

function close(actual, expected, tolerance = 0.001, label = '') {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ± ${tolerance}, got ${actual}`,
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

test('exports: getSpa is a function', () => assert.equal(typeof getSpa, 'function'));
test('exports: calcSpa is a function', () => assert.equal(typeof calcSpa, 'function'));
test('exports: formatTime is a function', () => assert.equal(typeof formatTime, 'function'));
test('exports: SPA_ZA === 0', () => assert.equal(SPA_ZA, 0));
test('exports: SPA_ZA_INC === 1', () => assert.equal(SPA_ZA_INC, 1));
test('exports: SPA_ZA_RTS === 2', () => assert.equal(SPA_ZA_RTS, 2));
test('exports: SPA_ALL === 3', () => assert.equal(SPA_ALL, 3));

// ─── formatTime ──────────────────────────────────────────────────────────────

test('formatTime: zero', () => assert.equal(formatTime(0), '00:00:00'));
test('formatTime: noon', () => assert.equal(formatTime(12), '12:00:00'));
test('formatTime: 23:59:59', () => assert.equal(formatTime(23 + 59/60 + 59/3600), '23:59:59'));
test('formatTime: fractional rounding', () => assert.equal(formatTime(5.4174893), '05:25:03'));
test('formatTime: negative returns N/A', () => assert.equal(formatTime(-1), 'N/A'));
test('formatTime: NaN returns N/A', () => assert.equal(formatTime(NaN), 'N/A'));
test('formatTime: Infinity returns N/A', () => assert.equal(formatTime(Infinity), 'N/A'));
test('formatTime: midnight wrap (24h)', () => {
  // A time of exactly 24.0 rounds to 00:00:00
  assert.equal(formatTime(24), '00:00:00');
});

// ─── getSpa: New York summer solstice (validated against NREL C reference) ───

const NYC_SUMMER = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10, pressure: 1013, temperature: 20 },
);

test('NYC summer: sunrise ~05:25:03', () => close(NYC_SUMMER.sunrise, 5.417, 0.001, 'sunrise'));
test('NYC summer: solarNoon ~12:57:56', () => close(NYC_SUMMER.solarNoon, 12.965, 0.001, 'solarNoon'));
test('NYC summer: sunset ~20:30:35', () => close(NYC_SUMMER.sunset, 20.509, 0.001, 'sunset'));
test('NYC summer: zenith is a number', () => assert.equal(typeof NYC_SUMMER.zenith, 'number'));
test('NYC summer: azimuth 0-360', () => {
  assert.ok(NYC_SUMMER.azimuth >= 0 && NYC_SUMMER.azimuth <= 360, `azimuth ${NYC_SUMMER.azimuth}`);
});

// ─── getSpa: New York winter solstice ────────────────────────────────────────

const NYC_WINTER = getSpa(
  new Date('2025-12-21T00:00:00Z'),
  40.7128, -74.006, -5,
  { elevation: 10, pressure: 1013, temperature: 5 },
);

test('NYC winter: sunrise ~07:16:41', () => close(NYC_WINTER.sunrise, 7.278, 0.001, 'sunrise'));
test('NYC winter: solarNoon ~11:54:19', () => close(NYC_WINTER.solarNoon, 11.905, 0.001, 'solarNoon'));
test('NYC winter: sunset ~16:31:56', () => close(NYC_WINTER.sunset, 16.532, 0.001, 'sunset'));

// ─── getSpa: London summer ───────────────────────────────────────────────────

const LONDON_SUMMER = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  51.5074, -0.1278, 1,
  { elevation: 11, pressure: 1013, temperature: 18 },
);

test('London summer: sunrise ~04:43:07', () => close(LONDON_SUMMER.sunrise, 4.718, 0.001, 'sunrise'));
test('London summer: sunset ~21:21:37', () => close(LONDON_SUMMER.sunset, 21.360, 0.001, 'sunset'));

// ─── getSpa: Tokyo ───────────────────────────────────────────────────────────

const TOKYO_SUMMER = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  35.6895, 139.6917, 9,
  { elevation: 40, pressure: 1013, temperature: 22 },
);

test('Tokyo summer: sunrise ~04:25:52', () => close(TOKYO_SUMMER.sunrise, 4.431, 0.001, 'sunrise'));
test('Tokyo summer: sunset ~19:00:22', () => close(TOKYO_SUMMER.sunset, 19.006, 0.001, 'sunset'));

// ─── getSpa: Sydney winter (southern hemisphere) ─────────────────────────────

const SYDNEY_WINTER = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  -33.8688, 151.2093, 10,
  { elevation: 58, pressure: 1013, temperature: 15 },
);

test('Sydney winter: sunrise ~07:00:12', () => close(SYDNEY_WINTER.sunrise, 7.003, 0.001, 'sunrise'));
test('Sydney winter: sunset ~16:53:52', () => close(SYDNEY_WINTER.sunset, 16.898, 0.001, 'sunset'));

// ─── getSpa: Quito (equator, equinox) ────────────────────────────────────────

const QUITO_EQUINOX = getSpa(
  new Date('2025-03-20T00:00:00Z'),
  -0.1807, -78.4678, -5,
  { elevation: 2850, pressure: 789, temperature: 14 },
);

test('Quito equinox: sunrise ~06:17:54', () => close(QUITO_EQUINOX.sunrise, 6.298, 0.001, 'sunrise'));
test('Quito equinox: sunset ~18:24:25', () => close(QUITO_EQUINOX.sunset, 18.407, 0.001, 'sunset'));

// ─── getSpa: polar night (Tromso, arctic winter) ─────────────────────────────

const TROMSO_POLAR = getSpa(
  new Date('2025-12-21T00:00:00Z'),
  69.6492, 18.9553, 1,
  { elevation: 0, pressure: 1013, temperature: -2 },
);

test('Tromso polar: sunrise is NaN (polar night)', () => assert.ok(isNaN(TROMSO_POLAR.sunrise) || TROMSO_POLAR.sunrise < 0 || TROMSO_POLAR.sunrise > 24));
test('Tromso polar: zenith > 90 (sun below horizon)', () => assert.ok(TROMSO_POLAR.zenith > 90));

// ─── calcSpa: formatted output ───────────────────────────────────────────────

const NYC_FMT = calcSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10, pressure: 1013, temperature: 20 },
);

test('calcSpa: sunrise is string', () => assert.equal(typeof NYC_FMT.sunrise, 'string'));
test('calcSpa: solarNoon is string', () => assert.equal(typeof NYC_FMT.solarNoon, 'string'));
test('calcSpa: sunset is string', () => assert.equal(typeof NYC_FMT.sunset, 'string'));
test('calcSpa: sunrise format HH:MM:SS', () => assert.match(NYC_FMT.sunrise, /^\d{2}:\d{2}:\d{2}$/));
test('calcSpa: NYC summer sunrise = 05:25:03', () => assert.equal(NYC_FMT.sunrise, '05:25:03'));
test('calcSpa: NYC summer noon = 12:57:56', () => assert.equal(NYC_FMT.solarNoon, '12:57:56'));
test('calcSpa: NYC summer sunset = 20:30:35', () => assert.equal(NYC_FMT.sunset, '20:30:35'));
test('calcSpa: zenith is number', () => assert.equal(typeof NYC_FMT.zenith, 'number'));

// ─── Custom angles (twilight) ────────────────────────────────────────────────

const NYC_TWILIGHT = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10 },
  [96, 102, 108],
);

test('custom angles: result has angles array', () => assert.ok(Array.isArray(NYC_TWILIGHT.angles)));
test('custom angles: three entries', () => assert.equal(NYC_TWILIGHT.angles.length, 3));
test('custom angles: civil twilight rise < standard rise', () => {
  assert.ok(NYC_TWILIGHT.angles[0].sunrise < NYC_SUMMER.sunrise, 'civil rises before standard');
});
test('custom angles: nautical rise < civil rise', () => {
  assert.ok(NYC_TWILIGHT.angles[1].sunrise < NYC_TWILIGHT.angles[0].sunrise);
});
test('custom angles: astronomical rise < nautical rise', () => {
  assert.ok(NYC_TWILIGHT.angles[2].sunrise < NYC_TWILIGHT.angles[1].sunrise);
});

const NYC_TWILIGHT_FMT = calcSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10 },
  [96, 102, 108],
);

test('calcSpa angles: formatted sunrise is string', () => {
  assert.equal(typeof NYC_TWILIGHT_FMT.angles[0].sunrise, 'string');
});
test('calcSpa angles: HH:MM:SS format', () => {
  assert.match(NYC_TWILIGHT_FMT.angles[0].sunrise, /^\d{2}:\d{2}:\d{2}$/);
});

// ─── Input validation ─────────────────────────────────────────────────────────

test('validation: invalid Date throws TypeError', () => {
  assert.throws(() => getSpa(new Date('invalid'), 40, -74, 0), TypeError);
});
test('validation: non-number latitude throws TypeError', () => {
  assert.throws(() => getSpa(new Date(), 'bad', -74, 0), TypeError);
});
test('validation: latitude > 90 throws RangeError', () => {
  assert.throws(() => getSpa(new Date(), 91, -74, 0), RangeError);
});
test('validation: latitude < -90 throws RangeError', () => {
  assert.throws(() => getSpa(new Date(), -91, -74, 0), RangeError);
});
test('validation: longitude > 180 throws RangeError', () => {
  assert.throws(() => getSpa(new Date(), 40, 181, 0), RangeError);
});
test('validation: longitude < -180 throws RangeError', () => {
  assert.throws(() => getSpa(new Date(), 40, -181, 0), RangeError);
});

// ─── Defaults ────────────────────────────────────────────────────────────────

test('defaults: tz=null uses 0', () => {
  const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, null);
  assert.equal(typeof r.zenith, 'number');
});
test('defaults: no options arg', () => {
  const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006);
  assert.equal(typeof r.sunrise, 'number');
});
test('defaults: empty angles array returns no angles key', () => {
  const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, {}, []);
  assert.ok(!('angles' in r));
});

// ─── Cape Town (southern hemisphere, summer) ──────────────────────────────────

const CAPE_TOWN = getSpa(
  new Date('2025-12-21T00:00:00Z'),
  -33.9249, 18.4241, 2,
  { elevation: 25, pressure: 1013, temperature: 18 },
);

test('Cape Town summer: sunrise ~05:31:55', () => close(CAPE_TOWN.sunrise, 5.532, 0.001, 'sunrise'));
test('Cape Town summer: sunset ~19:57:01', () => close(CAPE_TOWN.sunset, 19.950, 0.001, 'sunset'));

// ─── Reykjavik (midnight sun) ─────────────────────────────────────────────────

const REYKJAVIK = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  64.1466, -21.9426, 0,
  { elevation: 0, pressure: 1013, temperature: 10 },
);

test('Reykjavik midsummer: sunrise ~02:55', () => close(REYKJAVIK.sunrise, 2.919, 0.001, 'sunrise'));
// Sunset wraps past midnight, so the raw value > 24 or suntransit is reliable
test('Reykjavik midsummer: solarNoon in range', () => {
  assert.ok(REYKJAVIK.solarNoon > 12 && REYKJAVIK.solarNoon < 15);
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('---');
console.log(`${passed + failed} tests total: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
