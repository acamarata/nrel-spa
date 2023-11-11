# nrel-spa

NREL SPA (Solar Position Algorithm) native implementation in JavaScript. This package allows for precise calculations of solar positions and phases based on geographical coordinates and time.

## Installation

```bash
npm install nrel-spa
```

## Usage

Basic usage examples:

```javascript
const { calcSpa } = require('nrel-spa');

const myLat = 40.7128; // Latitude for New York City
const myLng = -74.006; // Longitude for New York City
const myDate = new Date(); // Current date

const solarData = calcSpa(myDate, myLat, myLng);
console.log(solarData);
```

## API

Describe the functions and their parameters briefly.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
