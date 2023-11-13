const { getSpa, calcSpa } = require('./index');

const date = new Date();
console.log(date)

/* NYC - minimum params
const city = "New York"
const lat = 40.7128;
const lng = -74.006;
const tz = -5;
const params = null
const angles = []
*/

// Jakarta - all params
const city = "Jakarta"
const lat = -6.2088
const lng = 106.8456
const tz = 0
const elevation = 18
const temperature = 26.56
const pressure = 1017
const params = {elevation, temperature, pressure}
const angles = [63.435]


// Get results
const get = getSpa(date, lat, lng, tz, params, angles);
const calc = calcSpa(date, lat, lng, tz, params, angles);

// Print results
console.log(`\nTest: ${city} with current Date():\n`)
console.log("getSpa =", get, "\n");
console.log("calcSpa =", calc, "\n");
