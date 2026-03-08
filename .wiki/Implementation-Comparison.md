# Implementation Comparison

Three implementations of the NREL Solar Position Algorithm exist in this ecosystem. This page documents their accuracy against the original C reference and their throughput on Node.js.

|                  | [NREL C reference](https://midcdmz.nrel.gov/spa/) | [nrel-spa](https://www.npmjs.com/package/nrel-spa) | [solar-spa](https://www.npmjs.com/package/solar-spa) |
| ---------------- | ------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **Language**     | C (gcc -O2)                                       | JavaScript (JS port)                               | WebAssembly (Emscripten)                             |
| **Source**       | Original C                                        | Hand-ported                                        | Compiled from same C                                 |
| **Async init**   | No                                                | No                                                 | Yes (`await init()`)                                 |
| **Dependencies** | None                                              | None                                               | None (WASM bundled)                                  |
| **Return type**  | Synchronous                                       | Synchronous                                        | Promise                                              |
| **Algorithm**    | NREL SPA 2004                                     | NREL SPA 2004                                      | NREL SPA 2004                                        |

---

## Accuracy

Tested across eight global locations and three dates spanning both hemispheres, polar regions, and all four seasons. All times are local time for the given timezone. Delta is the absolute difference in seconds from the C reference binary.

**Environment:** Node.js v24.6.0. Inputs: local midnight at each location. Atmospheric defaults: pressure 1013 mb, temperature varies by season, elevation as noted. `delta_t = 67` seconds (NREL default).

| Location               | Date   | Field      | C Reference | nrel-spa |      Δ (s) | solar-spa |      Δ (s) |
| ---------------------- | ------ | ---------- | ----------- | -------- | ---------: | --------- | ---------: |
| New York (40.7°N)      | Jun 21 | Sunrise    | 05:25:03    | 05:25:03 |       0.04 | 05:25:03  |       0.04 |
|                        |        | Solar noon | 12:57:56    | 12:57:56 |       0.40 | 12:57:56  |       0.40 |
|                        |        | Sunset     | 20:30:35    | 20:30:35 |       0.17 | 20:30:35  |       0.17 |
| New York (40.7°N)      | Dec 21 | Sunrise    | 07:16:41    | 07:16:41 |       0.35 | 07:16:41  |       0.35 |
|                        |        | Solar noon | 11:54:19    | 11:54:19 |       0.40 | 11:54:19  |       0.40 |
|                        |        | Sunset     | 16:31:56    | 16:31:56 |       0.08 | 16:31:56  |       0.08 |
| London (51.5°N)        | Jun 21 | Sunrise    | 04:43:07    | 04:43:07 |       0.20 | 04:43:07  |       0.20 |
|                        |        | Solar noon | 13:02:22    | 13:02:22 |       0.14 | 13:02:22  |       0.14 |
|                        |        | Sunset     | 21:21:37    | 21:21:37 |       0.34 | 21:21:37  |       0.34 |
| Tokyo (35.7°N)         | Jun 21 | Sunrise    | 04:25:52    | 04:25:52 |       0.09 | 04:25:52  |       0.09 |
|                        |        | Solar noon | 11:43:00    | 11:43:00 |       0.35 | 11:43:00  |       0.35 |
|                        |        | Sunset     | 19:00:22    | 19:00:22 |       0.24 | 19:00:22  |       0.24 |
| Sydney (33.9°S)        | Jun 21 | Sunrise    | 07:00:12    | 07:00:12 |       0.15 | 07:00:12  |       0.15 |
|                        |        | Solar noon | 11:56:56    | 11:56:56 |       0.29 | 11:56:56  |       0.29 |
|                        |        | Sunset     | 16:53:52    | 16:53:52 |       0.04 | 16:53:52  |       0.04 |
| Cape Town (33.9°S)     | Dec 21 | Sunrise    | 05:31:55    | 05:31:55 |       0.43 | 05:31:55  |       0.43 |
|                        |        | Solar noon | 12:44:28    | 12:44:28 |       0.31 | 12:44:28  |       0.31 |
|                        |        | Sunset     | 19:57:01    | 19:57:01 |       0.01 | 19:57:01  |       0.01 |
| Quito (0.2°S)          | Mar 20 | Sunrise    | 06:17:54    | 06:17:54 |       0.41 | 06:17:54  |       0.41 |
|                        |        | Solar noon | 12:21:10    | 12:21:10 |       0.10 | 12:21:10  |       0.10 |
|                        |        | Sunset     | 18:24:25    | 18:24:25 |       0.23 | 18:24:25  |       0.23 |
| Reykjavik (64.1°N)     | Jun 21 | Sunrise    | 02:55:10    | 02:55:10 |       0.44 | 02:55:10  |       0.44 |
|                        |        | Solar noon | 13:29:38    | 13:29:38 |       0.49 | 13:29:38  |       0.49 |
|                        |        | Sunset     | 00:03:54    | 00:03:54 |       0.20 | 00:03:54  |       0.20 |
| **Maximum divergence** |        |            |             |          | **0.49 s** |           | **0.49 s** |

Both JavaScript implementations are numerically identical to each other across all test cases. The sub-second delta from the C reference is not an algorithmic error. It comes from floating-point rounding accumulated across roughly 200 intermediate calculations in the VSOP87 series. The practical precision ceiling is the `delta_t` parameter (default 67 seconds), which is itself an approximation.

Polar night is handled correctly. Tromso in December returns the NREL sentinel value (-99999) for sunrise and sunset, indicating the sun does not cross the horizon.

---

## Performance

**Environment:** Node.js v24.6.0, macOS. 200,000 iterations per measurement, with a 2,000-iteration warm-up before each run. Test case: New York summer solstice.

| Mode                                         | Implementation |    ns/call |  calls/s |
| -------------------------------------------- | -------------- | ---------: | -------: |
| **SPA_ZA_RTS** (zenith + azimuth + rise/set) | nrel-spa       |     84,497 |   11,835 |
|                                              | solar-spa      |     45,139 |   22,154 |
| **SPA_ZA** (zenith + azimuth only)           | nrel-spa       |      9,284 |  107,711 |
|                                              | solar-spa      |      6,112 |  163,616 |
| **C reference** (native binary, estimated)   | gcc -O2        | ~500–2,000 | ~500K–2M |

**solar-spa WASM is 1.5–1.9× faster than nrel-spa JS** for sustained throughput. The WASM binary is compiled from the same C source with `-O2`, so the engine runs optimized machine code rather than interpreted JavaScript.

**SPA_ZA is roughly 9× faster than SPA_ZA_RTS** in both implementations. The three-day rise/set calculation (which interpolates solar coordinates across yesterday, today, and tomorrow) dominates runtime. If you only need zenith and azimuth for the current moment, use `SPA_ZA` and skip that computation entirely.

The C reference estimate is not directly measured here. It assumes a compiled binary called via subprocess, which adds process-spawn overhead. Pure in-process C math for this algorithm typically runs 10–100× faster than equivalent JavaScript.

---

## API Convention Difference

nrel-spa and solar-spa handle dates differently. This is the single most important thing to understand when choosing between them.

**nrel-spa** reads UTC components from the Date object:

```javascript
d.year = date.getUTCFullYear();
d.month = date.getUTCMonth() + 1;
d.day = date.getUTCDate();
d.hour = date.getUTCHours();
```

To represent "June 21 at midnight local time," you pass a Date whose UTC components match that local time:

```javascript
// UTC components = 2025-06-21 00:00 → treated as local midnight
getSpa(new Date('2025-06-21T00:00:00Z'), lat, lon, timezone, opts);
```

This is portable. The result is the same on any machine, regardless of the host's system timezone.

**solar-spa** reads LOCAL components from the Date object:

```javascript
date.getFullYear(),   // local year
date.getMonth() + 1, // local month
date.getDate(),       // local day
date.getHours(),      // local hour
```

To represent "June 21 at midnight local time," you pass a Date whose local components match:

```javascript
// Local components = 2025-06-21 00:00
spa(new Date(2025, 5, 21, 0, 0, 0), lat, lon, { timezone });
```

This works correctly on the machine where the date is constructed. On a machine in a different timezone, `new Date(2025, 5, 21, 0, 0, 0)` still creates local midnight, so it still works. The risk arises if you pass a date received as a string, an API timestamp, or any UTC-anchored value: `new Date('2025-06-21T00:00:00Z').getHours()` returns 20 on a UTC-4 machine, not 0.

In short: with nrel-spa, UTC ISO strings are safe. With solar-spa, construct dates as local time explicitly, or use the `timezone` option and always verify your date components.

---

## When to Use Each

**Use nrel-spa when:**

- You need synchronous, zero-init execution (serverless functions, edge workers, middleware)
- You are processing individual requests rather than large batches
- You want simple date handling with no machine-timezone surprises
- Bundle size matters (nrel-spa is smaller; no WASM blob)

**Use solar-spa when:**

- You are pre-computing thousands or millions of solar positions in a batch
- You have already paid the async init cost and want maximum throughput
- You need the full SPA output struct including incidence angle, equation of time, and sun transit altitude

**Use the C reference when:**

- You are writing native code or a library that wraps native code
- You need validated output for scientific publication
- Runtime performance is the primary constraint

The C reference is available from NREL at no cost: [https://midcdmz.nrel.gov/spa/](https://midcdmz.nrel.gov/spa/)

---

[Home](Home) . [API Reference](API-Reference) . [Architecture](Architecture) . [Twilight Calculations](Twilight-Calculations) . [NREL SPA Algorithm](NREL-SPA-Algorithm)
