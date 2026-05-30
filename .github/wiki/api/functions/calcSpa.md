[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / calcSpa

# Function: calcSpa()

## Call Signature

> **calcSpa**(`date`, `latitude`, `longitude`, `timezone?`, `options?`): [`SpaFormattedResult`](../interfaces/SpaFormattedResult.md)

Defined in: [index.ts:307](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/index.ts#L307)

Same as getSpa(), but formats sunrise, solarNoon, and sunset as HH:MM:SS strings.
Returns "N/A" for time fields during polar day or polar night.

### Parameters

#### date

`Date`

JavaScript Date object (uses UTC components)

#### latitude

`number`

Observer latitude in degrees (-90 to 90, negative = south)

#### longitude

`number`

Observer longitude in degrees (-180 to 180, negative = west)

#### timezone?

`number` \| `null`

Hours from UTC (e.g., -4 for EDT). Default: 0

#### options?

[`SpaOptions`](../interfaces/SpaOptions.md) \| `null`

Optional atmospheric and calculation parameters

### Returns

[`SpaFormattedResult`](../interfaces/SpaFormattedResult.md)

Formatted solar position result with HH:MM:SS time strings

### Throws

If date, latitude, longitude, timezone, or options numeric fields are not finite numbers

### Throws

If latitude, longitude, timezone, function code, or angle values are out of range

### See

[Wiki: calcSpa](https://github.com/acamarata/nrel-spa/wiki/api/calcSpa)

## Call Signature

> **calcSpa**(`date`, `latitude`, `longitude`, `timezone`, `options`, `angles`): [`SpaFormattedResultWithAngles`](../interfaces/SpaFormattedResultWithAngles.md)

Defined in: [index.ts:321](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/index.ts#L321)

Same as getSpa() with custom angles, but formats all time values as HH:MM:SS strings.
Returns "N/A" for time fields during polar day or polar night.

### Parameters

#### date

`Date`

#### latitude

`number`

#### longitude

`number`

#### timezone

`number` \| `null` \| `undefined`

#### options

[`SpaOptions`](../interfaces/SpaOptions.md) \| `null` \| `undefined`

#### angles

\[`number`, `...number[]`\]

### Returns

[`SpaFormattedResultWithAngles`](../interfaces/SpaFormattedResultWithAngles.md)

### Throws

If date, latitude, longitude, timezone, or options numeric fields are not finite numbers

### Throws

If latitude, longitude, timezone, function code, or angle values are out of range
