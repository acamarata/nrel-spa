[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / SpaOptions

# Interface: SpaOptions

Defined in: [types.ts:31](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L31)

## Properties

### atmos\_refract?

> `optional` **atmos\_refract?**: `number`

Defined in: [types.ts:47](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L47)

Atmospheric refraction at sunrise/sunset in degrees. Default: 0.5667.

***

### azm\_rotation?

> `optional` **azm\_rotation?**: `number`

Defined in: [types.ts:45](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L45)

Surface azimuth rotation in degrees from south. Default: 0.

***

### delta\_t?

> `optional` **delta\_t?**: `number`

Defined in: [types.ts:41](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L41)

TT-UTC difference in seconds. Default: 67.

***

### delta\_ut1?

> `optional` **delta\_ut1?**: `number`

Defined in: [types.ts:39](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L39)

UT1-UTC correction in seconds. Default: 0.

***

### elevation?

> `optional` **elevation?**: `number`

Defined in: [types.ts:33](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L33)

Observer elevation in meters above sea level. Default: 0.

***

### function?

> `optional` **function?**: [`SpaFunctionCode`](../type-aliases/SpaFunctionCode.md)

Defined in: [types.ts:49](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L49)

SPA function code. Default: SPA_ZA_RTS (2).

***

### pressure?

> `optional` **pressure?**: `number`

Defined in: [types.ts:35](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L35)

Atmospheric pressure in millibars. Default: 1013.

***

### slope?

> `optional` **slope?**: `number`

Defined in: [types.ts:43](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L43)

Surface slope in degrees from horizontal. Default: 0.

***

### temperature?

> `optional` **temperature?**: `number`

Defined in: [types.ts:37](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/types.ts#L37)

Temperature in degrees Celsius. Default: 15.
