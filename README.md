# nrel-spa

NREL SPA (Solar Position Algorithm) native implementation in JavaScript. This package allows for precise calculations of solar positions and phases based on geographical coordinates and time.

## Installation

```bash
npm install nrel-spa
```

## Usage

Basic usage examples:

```javascript
const { getSpa, calcSpa } = require('./index');

const date = new Date();
console.log(date)

// NYC - minimum params
const city = "New York"
const lat = 40.7128;
const lng = -74.006;
const tz = null     // optional
const params = null // optional
const angles = []   // optional

/* Jakarta - all params
const city = "Jakarta"
const lat = -6.2088
const lng = 106.8456
const tz = 0
const elevation = 18
const temperature = 26.56
const pressure = 1017
const params = {elevation, temperature, pressure}
const angles = [63.435] */

// Get results
const get = getSpa(date, lat, lng); // minimum args
const calc = calcSpa(date, lat, lng, tz, params, angles);

// Print results
console.log(`\nTest: ${city} with current Date():\n`)
console.log("getSpa =", get, "\n");
console.log("calcSpa =", calc, "\n");
```

## API

Exporting getSpa, calcSpa, and fractalTime.  Only date, lat, lng are required but if timezone (tz) is null, will return in UTC.

- getSpa(date, lat, lng, tz, params, angles) // returns SPA results in fractal times
- getSpa(date, lat, lng, tz, params, angles) // returns SPA results in formatted times
- fractalTime(fractionalHour) // formats time from 10.767407706732804 to 10:46:02.667

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
