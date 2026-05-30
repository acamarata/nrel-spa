[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / formatTime

# Function: formatTime()

> **formatTime**(`hours`): `string`

Defined in: [index.ts:87](https://github.com/acamarata/nrel-spa/blob/dea28b9262311319e14e8b9f29cb072ae4aea635/src/index.ts#L87)

Format fractional hours to HH:MM:SS string.
Returns "N/A" for non-finite or negative values (polar night/day scenarios).

## Parameters

### hours

`number`

Fractional hours (e.g., 12.5 for 12:30:00)

## Returns

`string`

Formatted time string in HH:MM:SS format, or "N/A"

## See

[Wiki: formatTime](https://github.com/acamarata/nrel-spa/wiki/api/formatTime)
