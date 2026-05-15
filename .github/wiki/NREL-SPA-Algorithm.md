# NREL SPA Algorithm

## Background

The Solar Position Algorithm (SPA) was developed by Ibrahim Reda and Afshin Andreas at the National Renewable Energy Laboratory (NREL) and published in 2004. It is the reference algorithm for solar position calculation in scientific and engineering applications.

**Citation:**

> Reda, I., Andreas, A. (2004). "Solar Position Algorithm for Solar Radiation Applications." Solar Energy, 76(5), 577-589. https://doi.org/10.1016/j.solener.2003.12.003

**Original C source:** https://midcdmz.nrel.gov/spa/

The C source has not changed since its last release in September 2014. This JavaScript port is validated against that version.

## Accuracy

The algorithm achieves uncertainty of +/- 0.0003 degrees in solar zenith and azimuth angles. For sunrise, solar noon, and sunset, results match the C reference to within one second across all tested locations and dates.

Validation test cases from `bin/test.js`:

| Location  | Date       | Sunrise (C) | Sunrise (JS) | Noon (C) | Noon (JS) | Sunset (C) | Sunset (JS) |
| --------- | ---------- | ----------- | ------------ | -------- | --------- | ---------- | ----------- |
| New York  | 2025-06-21 | 05:25:03    | 05:25:03     | 12:57:56 | 12:57:56  | 20:30:35   | 20:30:35    |
| New York  | 2025-12-21 | 07:16:41    | 07:16:41     | 11:54:19 | 11:54:19  | 16:31:56   | 16:31:56    |
| London    | 2025-06-21 | 04:43:07    | 04:43:07     | 13:02:22 | 13:02:22  | 21:21:37   | 21:21:37    |
| London    | 2025-12-21 | 08:03:52    | 08:03:52     | 11:58:42 | 11:58:42  | 15:53:32   | 15:53:32    |
| Tokyo     | 2025-06-21 | 04:25:52    | 04:25:52     | 11:43:00 | 11:43:00  | 19:00:22   | 19:00:22    |
| Sydney    | 2025-06-21 | 07:00:12    | 07:00:12     | 11:56:56 | 11:56:56  | 16:53:52   | 16:53:52    |
| Reykjavik | 2025-06-21 | 02:55:10    | 02:55:10     | 13:29:38 | 13:29:38  | 00:03:54   | 00:03:54    |
| Cape Town | 2025-12-21 | 05:31:55    | 05:31:55     | 12:44:28 | 12:44:28  | 19:57:01   | 19:57:01    |
| Quito     | 2025-03-20 | 06:17:54    | 06:17:54     | 12:21:10 | 12:21:10  | 18:24:25   | 18:24:25    |
| Tromso    | 2025-12-21 | N/A         | N/A          | N/A      | N/A       | N/A        | N/A         |

Zero drift in all cases with sun (Tromso is polar night in December).

## Algorithm Outline

The SPA computes solar position through a chain of coordinate transformations:

1. **Julian Day (JD)** from the input date and time, accounting for the timezone offset and DUT1 correction.

2. **Earth Heliocentric Coordinates** using Variations Seculaires des Orbites Planetaires (VSOP87) truncated to 63 periodic terms for longitude (L), 5 terms for latitude (B), and 40 terms for radius (R).

3. **Geocentric Coordinates** by converting heliocentric L to geocentric longitude (theta) and negating the latitude (beta = -B).

4. **Nutation** in longitude (del_psi) and obliquity (del_epsilon) from 63 periodic terms in the IAU 1980 nutation model.

5. **Apparent Sun Longitude** by adding aberration correction and nutation to theta.

6. **Greenwich Sidereal Time** and then the **Observer Hour Angle** (H).

7. **Topocentric Correction** using the observer's elevation, converting geocentric right ascension and declination to topocentric values (alpha_prime, delta_prime, h_prime).

8. **Zenith and Azimuth** from topocentric elevation angle corrected for atmospheric refraction.

9. **Rise/Transit/Set** via a three-day calculation: the algorithm solves for sunrise, solar noon, and sunset by interpolating right ascension and declination across the previous, current, and next day, then iterating to correct the approximate times.

## Key Parameters

**delta_t** (TT-UTC, default 67 seconds): the accumulated difference between Terrestrial Time (an ideal clock) and UTC (subject to leap seconds). The NREL bulletin value for 2025 is approximately 68-70 seconds. The default of 67 is suitable for dates within a few years of 2020.

**delta_ut1** (UT1-UTC, default 0): a sub-second correction published by the IERS. For most applications, the default of 0 is acceptable.

**atmos_refract** (default 0.5667 degrees): atmospheric refraction at the horizon. This shifts the apparent sunrise earlier and sunset later than geometric calculations. The NREL default matches standard atmospheric conditions.

## Comparison with solar-spa

[solar-spa](https://www.npmjs.com/package/solar-spa) compiles the same NREL C source to WebAssembly via Emscripten. The two packages share the same algorithm and produce numerically identical results.

- **nrel-spa** is synchronous, requires no init, and uses UTC date components (portable across all machines)
- **solar-spa** requires an async `init()` call, reads local date components, and runs 1.5–1.9× faster for sustained batch throughput

For the full accuracy and performance comparison, including benchmarks across eight global locations and both SPA function codes, see the [Implementation Comparison](Implementation-Comparison) page.

---

[Home](Home) . [API Reference](API-Reference) . [Architecture](Architecture) . [Twilight Calculations](Twilight-Calculations) . [Implementation Comparison](Implementation-Comparison)
