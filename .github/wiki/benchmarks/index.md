# Benchmarks

Performance and bundle size measurements for nrel-spa, with comparisons to solar-spa.

## Bundle Size

Measured from `dist/` after `pnpm build`.

| File             | Raw   | Gzipped |
|------------------|-------|---------|
| `index.mjs` (ESM) | 5.8 KB | 2.0 KB |
| `index.cjs` (CJS) | 6.5 KB | 2.2 KB |

The package also includes `lib/spa.cjs` (the core algorithm), which adds ~38 KB raw. The full `nrel-spa` npm pack total is under 100 KB uncompressed.

solar-spa bundles a compiled WASM binary. Total npm pack size is approximately 60 KB gzipped, compared to ~40 KB for nrel-spa.

## Throughput

**Environment:** Node.js v24.6.0, macOS. 200,000 iterations per measurement with a 2,000-iteration warm-up. Test case: New York summer solstice, `SPA_ZA_RTS` (full rise/set calculation).

| Implementation | ns/call | calls/s  |
|----------------|---------|----------|
| nrel-spa        | 84,497  | 11,835   |
| solar-spa       | 45,139  | 22,154   |

**solar-spa WASM is 1.5-1.9x faster** for sustained throughput. The WASM binary is compiled from the same C source with `-O2`.

Switching to `SPA_ZA` (zenith and azimuth only, no rise/set) removes the three-day interpolation step:

| Implementation | Mode          | ns/call | calls/s |
|----------------|---------------|---------|---------|
| nrel-spa        | SPA_ZA_RTS    | 84,497  | 11,835  |
| nrel-spa        | SPA_ZA        |  9,284  | 107,711 |
| solar-spa       | SPA_ZA_RTS    | 45,139  | 22,154  |
| solar-spa       | SPA_ZA        |  6,112  | 163,616 |

`SPA_ZA` is roughly 9x faster in nrel-spa. Use it when rise/set times are not needed.

## When Each Package Fits

| Scenario | Recommendation |
|---|---|
| Serverless, edge workers, middleware | nrel-spa (synchronous, zero init, smaller) |
| Single request in a Node server | nrel-spa (no async overhead) |
| Batch pre-computation (100K+ calls) | solar-spa (1.5-1.9x faster after init) |
| Custom twilight angles | nrel-spa (solar-spa does not support custom zenith angles) |

## Methodology

Throughput numbers above come from the manual benchmark in [`bin/`](https://github.com/acamarata/nrel-spa/tree/main/bin) and the accuracy analysis in [Implementation Comparison](../Implementation-Comparison). To reproduce:

```sh
pnpm build
node bin/bench.mjs   # or see bin/README.md for full setup
```

Bundle sizes are reproducible with:

```sh
pnpm build
du -sh dist/index.mjs dist/index.cjs
gzip -c dist/index.mjs | wc -c    # gzipped ESM
gzip -c dist/index.cjs | wc -c    # gzipped CJS
```

## See Also

- [Implementation Comparison](../Implementation-Comparison) - accuracy table and full API convention analysis
- [Architecture](../Architecture) - module structure and algorithm overview
