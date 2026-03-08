'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  getSpa,
  calcSpa,
  formatTime,
  SPA_ZA,
  SPA_ZA_RTS,
  SPA_ALL,
} = require('./dist/index.cjs');

describe('CJS exports', () => {
  it('getSpa is a function', () => assert.equal(typeof getSpa, 'function'));
  it('calcSpa is a function', () => assert.equal(typeof calcSpa, 'function'));
  it('formatTime is a function', () => assert.equal(typeof formatTime, 'function'));
  it('SPA_ZA === 0', () => assert.equal(SPA_ZA, 0));
  it('SPA_ZA_RTS === 2', () => assert.equal(SPA_ZA_RTS, 2));
  it('SPA_ALL === 3', () => assert.equal(SPA_ALL, 3));
});

describe('CJS correctness', () => {
  const nyc = calcSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10, pressure: 1013, temperature: 20 },
  );

  it('NYC sunrise = 05:25:03', () => assert.equal(nyc.sunrise, '05:25:03'));
  it('NYC solarNoon = 12:57:56', () => assert.equal(nyc.solarNoon, '12:57:56'));
  it('NYC sunset = 20:30:35', () => assert.equal(nyc.sunset, '20:30:35'));
  it('zenith is number', () => assert.equal(typeof nyc.zenith, 'number'));
  it('azimuth 0-360', () => assert.ok(nyc.azimuth >= 0 && nyc.azimuth <= 360));
});

describe('CJS formatTime', () => {
  it('noon', () => assert.equal(formatTime(12), '12:00:00'));
  it('negative = N/A', () => assert.equal(formatTime(-1), 'N/A'));
  it('NaN = N/A', () => assert.equal(formatTime(NaN), 'N/A'));
});

describe('CJS custom angles', () => {
  const twilight = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10 },
    [96, 102, 108],
  );

  it('has angles array', () => assert.ok(Array.isArray(twilight.angles)));
  it('three entries', () => assert.equal(twilight.angles.length, 3));
  it('civil < standard sunrise', () => {
    const standard = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { elevation: 10 });
    assert.ok(twilight.angles[0].sunrise < standard.sunrise);
  });
});

describe('CJS input validation', () => {
  it('invalid latitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 'bad', -74, 0), TypeError);
  });
  it('NaN latitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), NaN, -74, 0), TypeError);
  });
  it('Infinity longitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, Infinity, 0), TypeError);
  });
  it('timezone > 18 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 19), RangeError);
  });
  it('timezone < -18 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, -19), RangeError);
  });
  it('NaN timezone throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, NaN), TypeError);
  });
  it('non-finite option field throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, { elevation: Infinity }), TypeError);
  });
  it('angle out of range throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, null, [200]), RangeError);
  });
  it('NaN angle throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, null, [NaN]), TypeError);
  });
});
