[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / getSpa

# Function: getSpa()

## Call Signature

> **getSpa**(`date`, `latitude`, `longitude`, `timezone?`, `options?`): [`SpaResult`](../interfaces/SpaResult.md)

Defined in: [index.ts:145](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/index.ts#L145)

Compute solar position for the given parameters.

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

[`SpaResult`](../interfaces/SpaResult.md)

Solar position result with raw numerical values

### Throws

If date, latitude, longitude, timezone, or options numeric fields are not finite numbers

### Throws

If latitude, longitude, timezone, function code, or angle values are out of range

### See

[Wiki: getSpa](https://github.com/acamarata/nrel-spa/wiki/api/getSpa)

## Call Signature

> **getSpa**(`date`, `latitude`, `longitude`, `timezone`, `options`, `angles`): [`SpaResultWithAngles`](../interfaces/SpaResultWithAngles.md)

Defined in: [index.ts:163](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/index.ts#L163)

Compute solar position and resolve custom zenith angles (e.g., twilight).

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

#### timezone

`number` \| `null` \| `undefined`

Hours from UTC (e.g., -4 for EDT). Default: 0

#### options

[`SpaOptions`](../interfaces/SpaOptions.md) \| `null` \| `undefined`

Atmospheric and calculation parameters (pass null for defaults)

#### angles

\[`number`, `...number[]`\]

Custom zenith angles in degrees. Common: 96 civil, 102 nautical, 108 astronomical

### Returns

[`SpaResultWithAngles`](../interfaces/SpaResultWithAngles.md)

Solar position result including an angles array
