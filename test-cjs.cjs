'use strict';

const assert = require('node:assert/strict');
const {
  getSpa,
  calcSpa,
  formatTime,
  SPA_ZA,
  SPA_ZA_RTS,
  SPA_ALL,
} = require('./dist/index.cjs');

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

// ─── Exports ─────────────────────────────────────────────────────────────────

test('CJS: getSpa is a function', () => assert.equal(typeof getSpa, 'function'));
test('CJS: calcSpa is a function', () => assert.equal(typeof calcSpa, 'function'));
test('CJS: formatTime is a function', () => assert.equal(typeof formatTime, 'function'));
test('CJS: SPA_ZA === 0', () => assert.equal(SPA_ZA, 0));
test('CJS: SPA_ZA_RTS === 2', () => assert.equal(SPA_ZA_RTS, 2));
test('CJS: SPA_ALL === 3', () => assert.equal(SPA_ALL, 3));

// ─── Correctness ──────────────────────────────────────────────────────────────

const nyc = calcSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10, pressure: 1013, temperature: 20 },
);

test('CJS: NYC sunrise = 05:25:03', () => assert.equal(nyc.sunrise, '05:25:03'));
test('CJS: NYC solarNoon = 12:57:56', () => assert.equal(nyc.solarNoon, '12:57:56'));
test('CJS: NYC sunset = 20:30:35', () => assert.equal(nyc.sunset, '20:30:35'));
test('CJS: zenith is number', () => assert.equal(typeof nyc.zenith, 'number'));
test('CJS: azimuth 0-360', () => assert.ok(nyc.azimuth >= 0 && nyc.azimuth <= 360));

// ─── formatTime ───────────────────────────────────────────────────────────────

test('CJS formatTime: noon', () => assert.equal(formatTime(12), '12:00:00'));
test('CJS formatTime: negative = N/A', () => assert.equal(formatTime(-1), 'N/A'));
test('CJS formatTime: NaN = N/A', () => assert.equal(formatTime(NaN), 'N/A'));

// ─── Custom angles ────────────────────────────────────────────────────────────

const twilight = getSpa(
  new Date('2025-06-21T00:00:00Z'),
  40.7128, -74.006, -4,
  { elevation: 10 },
  [96, 102, 108],
);

test('CJS angles: has angles array', () => assert.ok(Array.isArray(twilight.angles)));
test('CJS angles: three entries', () => assert.equal(twilight.angles.length, 3));
test('CJS angles: civil < standard sunrise', () => {
  const standard = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { elevation: 10 });
  assert.ok(twilight.angles[0].sunrise < standard.sunrise);
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('---');
console.log(`${passed + failed} tests total: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
