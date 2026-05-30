[**nrel-spa v2.0.2**](../README.md)

***

[nrel-spa](../README.md) / formatTime

# Function: formatTime()

> **formatTime**(`hours`): `string`

Defined in: [index.ts:87](https://github.com/acamarata/nrel-spa/blob/b52802f94b8c28a03228118f51c17ce21d4c14b3/src/index.ts#L87)

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
