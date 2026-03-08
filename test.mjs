import { describe, it } from 'node:test';
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

function close(actual, expected, tolerance = 0.001, label = '') {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ± ${tolerance}, got ${actual}`,
  );
}

describe('exports', () => {
  it('getSpa is a function', () => assert.equal(typeof getSpa, 'function'));
  it('calcSpa is a function', () => assert.equal(typeof calcSpa, 'function'));
  it('formatTime is a function', () => assert.equal(typeof formatTime, 'function'));
  it('SPA_ZA === 0', () => assert.equal(SPA_ZA, 0));
  it('SPA_ZA_INC === 1', () => assert.equal(SPA_ZA_INC, 1));
  it('SPA_ZA_RTS === 2', () => assert.equal(SPA_ZA_RTS, 2));
  it('SPA_ALL === 3', () => assert.equal(SPA_ALL, 3));
});

describe('formatTime', () => {
  it('zero', () => assert.equal(formatTime(0), '00:00:00'));
  it('noon', () => assert.equal(formatTime(12), '12:00:00'));
  it('23:59:59', () => assert.equal(formatTime(23 + 59/60 + 59/3600), '23:59:59'));
  it('fractional rounding', () => assert.equal(formatTime(5.4174893), '05:25:03'));
  it('negative returns N/A', () => assert.equal(formatTime(-1), 'N/A'));
  it('NaN returns N/A', () => assert.equal(formatTime(NaN), 'N/A'));
  it('Infinity returns N/A', () => assert.equal(formatTime(Infinity), 'N/A'));
  it('midnight wrap (24h)', () => assert.equal(formatTime(24), '00:00:00'));
});

describe('getSpa: NYC summer solstice', () => {
  const NYC_SUMMER = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10, pressure: 1013, temperature: 20 },
  );

  it('sunrise ~05:25:03', () => close(NYC_SUMMER.sunrise, 5.417, 0.001, 'sunrise'));
  it('solarNoon ~12:57:56', () => close(NYC_SUMMER.solarNoon, 12.965, 0.001, 'solarNoon'));
  it('sunset ~20:30:35', () => close(NYC_SUMMER.sunset, 20.509, 0.001, 'sunset'));
  it('zenith is a number', () => assert.equal(typeof NYC_SUMMER.zenith, 'number'));
  it('azimuth 0-360', () => {
    assert.ok(NYC_SUMMER.azimuth >= 0 && NYC_SUMMER.azimuth <= 360, `azimuth ${NYC_SUMMER.azimuth}`);
  });
});

describe('getSpa: NYC winter solstice', () => {
  const NYC_WINTER = getSpa(
    new Date('2025-12-21T00:00:00Z'),
    40.7128, -74.006, -5,
    { elevation: 10, pressure: 1013, temperature: 5 },
  );

  it('sunrise ~07:16:41', () => close(NYC_WINTER.sunrise, 7.278, 0.001, 'sunrise'));
  it('solarNoon ~11:54:19', () => close(NYC_WINTER.solarNoon, 11.905, 0.001, 'solarNoon'));
  it('sunset ~16:31:56', () => close(NYC_WINTER.sunset, 16.532, 0.001, 'sunset'));
});

describe('getSpa: London summer', () => {
  const LONDON_SUMMER = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    51.5074, -0.1278, 1,
    { elevation: 11, pressure: 1013, temperature: 18 },
  );

  it('sunrise ~04:43:07', () => close(LONDON_SUMMER.sunrise, 4.718, 0.001, 'sunrise'));
  it('sunset ~21:21:37', () => close(LONDON_SUMMER.sunset, 21.360, 0.001, 'sunset'));
});

describe('getSpa: Tokyo', () => {
  const TOKYO_SUMMER = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    35.6895, 139.6917, 9,
    { elevation: 40, pressure: 1013, temperature: 22 },
  );

  it('sunrise ~04:25:52', () => close(TOKYO_SUMMER.sunrise, 4.431, 0.001, 'sunrise'));
  it('sunset ~19:00:22', () => close(TOKYO_SUMMER.sunset, 19.006, 0.001, 'sunset'));
});

describe('getSpa: Sydney winter (southern hemisphere)', () => {
  const SYDNEY_WINTER = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    -33.8688, 151.2093, 10,
    { elevation: 58, pressure: 1013, temperature: 15 },
  );

  it('sunrise ~07:00:12', () => close(SYDNEY_WINTER.sunrise, 7.003, 0.001, 'sunrise'));
  it('sunset ~16:53:52', () => close(SYDNEY_WINTER.sunset, 16.898, 0.001, 'sunset'));
});

describe('getSpa: Quito (equator, equinox)', () => {
  const QUITO_EQUINOX = getSpa(
    new Date('2025-03-20T00:00:00Z'),
    -0.1807, -78.4678, -5,
    { elevation: 2850, pressure: 789, temperature: 14 },
  );

  it('sunrise ~06:17:54', () => close(QUITO_EQUINOX.sunrise, 6.298, 0.001, 'sunrise'));
  it('sunset ~18:24:25', () => close(QUITO_EQUINOX.sunset, 18.407, 0.001, 'sunset'));
});

describe('getSpa: polar night (Tromso, arctic winter)', () => {
  const TROMSO_POLAR = getSpa(
    new Date('2025-12-21T00:00:00Z'),
    69.6492, 18.9553, 1,
    { elevation: 0, pressure: 1013, temperature: -2 },
  );

  it('sunrise < 0 (polar night sentinel)', () => assert.ok(TROMSO_POLAR.sunrise < 0));
  it('zenith > 90 (sun below horizon)', () => assert.ok(TROMSO_POLAR.zenith > 90));
});

describe('calcSpa: formatted output', () => {
  const NYC_FMT = calcSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10, pressure: 1013, temperature: 20 },
  );

  it('sunrise is string', () => assert.equal(typeof NYC_FMT.sunrise, 'string'));
  it('solarNoon is string', () => assert.equal(typeof NYC_FMT.solarNoon, 'string'));
  it('sunset is string', () => assert.equal(typeof NYC_FMT.sunset, 'string'));
  it('sunrise format HH:MM:SS', () => assert.match(NYC_FMT.sunrise, /^\d{2}:\d{2}:\d{2}$/));
  it('NYC summer sunrise = 05:25:03', () => assert.equal(NYC_FMT.sunrise, '05:25:03'));
  it('NYC summer noon = 12:57:56', () => assert.equal(NYC_FMT.solarNoon, '12:57:56'));
  it('NYC summer sunset = 20:30:35', () => assert.equal(NYC_FMT.sunset, '20:30:35'));
  it('zenith is number', () => assert.equal(typeof NYC_FMT.zenith, 'number'));
});

describe('custom angles (twilight)', () => {
  const NYC_SUMMER = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10, pressure: 1013, temperature: 20 },
  );

  const NYC_TWILIGHT = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10 },
    [96, 102, 108],
  );

  it('result has angles array', () => assert.ok(Array.isArray(NYC_TWILIGHT.angles)));
  it('three entries', () => assert.equal(NYC_TWILIGHT.angles.length, 3));
  it('civil twilight rise < standard rise', () => {
    assert.ok(NYC_TWILIGHT.angles[0].sunrise < NYC_SUMMER.sunrise, 'civil rises before standard');
  });
  it('nautical rise < civil rise', () => {
    assert.ok(NYC_TWILIGHT.angles[1].sunrise < NYC_TWILIGHT.angles[0].sunrise);
  });
  it('astronomical rise < nautical rise', () => {
    assert.ok(NYC_TWILIGHT.angles[2].sunrise < NYC_TWILIGHT.angles[1].sunrise);
  });

  const NYC_TWILIGHT_FMT = calcSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { elevation: 10 },
    [96, 102, 108],
  );

  it('calcSpa angles: formatted sunrise is string', () => {
    assert.equal(typeof NYC_TWILIGHT_FMT.angles[0].sunrise, 'string');
  });
  it('calcSpa angles: HH:MM:SS format', () => {
    assert.match(NYC_TWILIGHT_FMT.angles[0].sunrise, /^\d{2}:\d{2}:\d{2}$/);
  });
});

describe('input validation', () => {
  it('invalid Date throws TypeError', () => {
    assert.throws(() => getSpa(new Date('invalid'), 40, -74, 0), TypeError);
  });
  it('non-number latitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 'bad', -74, 0), TypeError);
  });
  it('latitude > 90 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 91, -74, 0), RangeError);
  });
  it('latitude < -90 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), -91, -74, 0), RangeError);
  });
  it('longitude > 180 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, 181, 0), RangeError);
  });
  it('longitude < -180 throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -181, 0), RangeError);
  });
  it('NaN latitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), NaN, -74, 0), TypeError);
  });
  it('Infinity latitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), Infinity, -74, 0), TypeError);
  });
  it('NaN longitude throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, NaN, 0), TypeError);
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
  it('NaN option field throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, { pressure: NaN }), TypeError);
  });
  it('angle out of range throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, null, [200]), RangeError);
  });
  it('negative angle throws RangeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, null, [-1]), RangeError);
  });
  it('NaN angle throws TypeError', () => {
    assert.throws(() => getSpa(new Date(), 40, -74, 0, null, [NaN]), TypeError);
  });
});

describe('defaults', () => {
  it('tz=null uses 0', () => {
    const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, null);
    assert.equal(typeof r.zenith, 'number');
  });
  it('no options arg', () => {
    const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006);
    assert.equal(typeof r.sunrise, 'number');
  });
});

describe('Cape Town (southern hemisphere, summer)', () => {
  const CAPE_TOWN = getSpa(
    new Date('2025-12-21T00:00:00Z'),
    -33.9249, 18.4241, 2,
    { elevation: 25, pressure: 1013, temperature: 18 },
  );

  it('sunrise ~05:31:55', () => close(CAPE_TOWN.sunrise, 5.532, 0.001, 'sunrise'));
  it('sunset ~19:57:01', () => close(CAPE_TOWN.sunset, 19.950, 0.001, 'sunset'));
});

describe('Reykjavik (midnight sun)', () => {
  const REYKJAVIK = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    64.1466, -21.9426, 0,
    { elevation: 0, pressure: 1013, temperature: 10 },
  );

  it('sunrise ~02:55', () => close(REYKJAVIK.sunrise, 2.919, 0.001, 'sunrise'));
  it('solarNoon in range', () => {
    assert.ok(REYKJAVIK.solarNoon > 12 && REYKJAVIK.solarNoon < 15);
  });
});

describe('SPA_ZA function code (zenith/azimuth only)', () => {
  const ZA_ONLY = getSpa(
    new Date('2025-06-21T00:00:00Z'),
    40.7128, -74.006, -4,
    { function: SPA_ZA },
  );

  it('zenith is a finite number', () => assert.ok(isFinite(ZA_ONLY.zenith)));
  it('azimuth is a finite number', () => assert.ok(isFinite(ZA_ONLY.azimuth)));
  it('sunrise is NaN (not computed)', () => assert.ok(isNaN(ZA_ONLY.sunrise)));
  it('solarNoon is NaN (not computed)', () => assert.ok(isNaN(ZA_ONLY.solarNoon)));
  it('sunset is NaN (not computed)', () => assert.ok(isNaN(ZA_ONLY.sunset)));

  it('calcSpa: sunrise is N/A', () => {
    const r = calcSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { function: SPA_ZA });
    assert.equal(r.sunrise, 'N/A');
    assert.equal(r.solarNoon, 'N/A');
    assert.equal(r.sunset, 'N/A');
  });
});

describe('function code validation', () => {
  it('invalid function code throws RangeError', () => {
    assert.throws(
      () => getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { function: 99 }),
      RangeError,
    );
  });
  it('angles + SPA_ZA throws RangeError', () => {
    assert.throws(
      () => getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { function: SPA_ZA }, [96, 102]),
      RangeError,
    );
  });
  it('angles + SPA_ZA_INC throws RangeError', () => {
    assert.throws(
      () => getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, { function: SPA_ZA_INC }, [96]),
      RangeError,
    );
  });
  it('empty angles array returns plain SpaResult', () => {
    const r = getSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, {}, []);
    assert.ok(!('angles' in r));
  });
  it('calcSpa with empty angles does not crash', () => {
    const r = calcSpa(new Date('2025-06-21T00:00:00Z'), 40.7128, -74.006, -4, {}, []);
    assert.equal(typeof r.sunrise, 'string');
    assert.ok(!('angles' in r));
  });
});
