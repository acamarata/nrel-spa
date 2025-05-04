// tested.js
const { getSpa, calcSpa } = require('./index');

// Use current date/time
const date = new Date();
console.log(`Current Date: ${date.toString()}\n`);

/*
// Example: New York with minimum params
const city = "New York";
const lat = 40.7128;
const lng = -74.0060;
const tz = -5;          // Eastern Standard Time
const params = null;
const angles = [];
*/

// Jakarta with all params
const city = "Jakarta";
const lat = -6.2088;
const lng = 106.8456;
const tz = 7;           // UTC+7
const params = {
  elevation: 18,        // meters
  temperature: 26.56,   // °C
  pressure: 1017        // mbar
};
const angles = [63.435]; // example custom zenith angle

console.log(`Test: ${city} (lat: ${lat}, lng: ${lng}, UTC${tz >= 0 ? '+' : ''}${tz})\n`);

// Raw fractional outputs
const raw = getSpa(date, lat, lng, tz, params, angles);
// Formatted HH:MM:SS outputs
const formatted = calcSpa(date, lat, lng, tz, params, angles);

console.log('getSpa (raw fractional values):');
console.log(JSON.stringify(raw, null, 2), '\n');

console.log('calcSpa (formatted HH:MM:SS):');
console.log(JSON.stringify(formatted, null, 2), '\n');