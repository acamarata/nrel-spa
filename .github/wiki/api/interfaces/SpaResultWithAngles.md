[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / SpaResultWithAngles

# Interface: SpaResultWithAngles

Defined in: [types.ts:85](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L85)

## Extends

- [`SpaResult`](SpaResult.md)

## Properties

### angles

> **angles**: [`SpaAnglesResult`](SpaAnglesResult.md)[]

Defined in: [types.ts:87](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L87)

Custom angle results, one per angle in the input array.

***

### azimuth

> **azimuth**: `number`

Defined in: [types.ts:56](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L56)

Topocentric azimuth angle, eastward from north (navigational convention), in degrees.

#### Inherited from

[`SpaResult`](SpaResult.md).[`azimuth`](SpaResult.md#azimuth)

***

### solarNoon

> **solarNoon**: `number`

Defined in: [types.ts:60](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L60)

Local sun transit time (solar noon) as fractional hours.

#### Inherited from

[`SpaResult`](SpaResult.md).[`solarNoon`](SpaResult.md#solarnoon)

***

### sunrise

> **sunrise**: `number`

Defined in: [types.ts:58](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L58)

Local sunrise time as fractional hours.

#### Inherited from

[`SpaResult`](SpaResult.md).[`sunrise`](SpaResult.md#sunrise)

***

### sunset

> **sunset**: `number`

Defined in: [types.ts:62](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L62)

Local sunset time as fractional hours.

#### Inherited from

[`SpaResult`](SpaResult.md).[`sunset`](SpaResult.md#sunset)

***

### zenith

> **zenith**: `number`

Defined in: [types.ts:54](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/types.ts#L54)

Topocentric zenith angle in degrees.

#### Inherited from

[`SpaResult`](SpaResult.md).[`zenith`](SpaResult.md#zenith)
