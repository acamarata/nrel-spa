[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / SpaFormattedResultWithAngles

# Interface: SpaFormattedResultWithAngles

Defined in: [types.ts:97](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L97)

## Extends

- [`SpaFormattedResult`](SpaFormattedResult.md)

## Properties

### angles

> **angles**: [`SpaFormattedAnglesResult`](SpaFormattedAnglesResult.md)[]

Defined in: [types.ts:99](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L99)

Custom angle results with formatted times.

***

### azimuth

> **azimuth**: `number`

Defined in: [types.ts:69](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L69)

Topocentric azimuth angle, eastward from north (navigational convention), in degrees.

#### Inherited from

[`SpaFormattedResult`](SpaFormattedResult.md).[`azimuth`](SpaFormattedResult.md#azimuth)

***

### solarNoon

> **solarNoon**: `string`

Defined in: [types.ts:73](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L73)

Local sun transit time as HH:MM:SS string. "N/A" during polar day/night.

#### Inherited from

[`SpaFormattedResult`](SpaFormattedResult.md).[`solarNoon`](SpaFormattedResult.md#solarnoon)

***

### sunrise

> **sunrise**: `string`

Defined in: [types.ts:71](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L71)

Local sunrise time as HH:MM:SS string. "N/A" during polar day/night.

#### Inherited from

[`SpaFormattedResult`](SpaFormattedResult.md).[`sunrise`](SpaFormattedResult.md#sunrise)

***

### sunset

> **sunset**: `string`

Defined in: [types.ts:75](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L75)

Local sunset time as HH:MM:SS string. "N/A" during polar day/night.

#### Inherited from

[`SpaFormattedResult`](SpaFormattedResult.md).[`sunset`](SpaFormattedResult.md#sunset)

***

### zenith

> **zenith**: `number`

Defined in: [types.ts:67](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L67)

Topocentric zenith angle in degrees.

#### Inherited from

[`SpaFormattedResult`](SpaFormattedResult.md).[`zenith`](SpaFormattedResult.md#zenith)
