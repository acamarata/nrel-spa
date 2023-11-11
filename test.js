const { getSpa, calcSpa } = require('./index');

// Constants for testing
const myLat = 40.7128; // Latitude for New York City
const myLng = -74.006; // Longitude for New York City
const nyDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
const myDate = new Date(); // Date object for today with NY time zone
const myAngles = [63.435]; // Custom angles for twilight calculations

// Get results
const get = getSpa(myDate, myLat, myLng, null, myAngles);
const calc = calcSpa(myDate, myLat, myLng, null, myAngles);

// Print results
console.log("\nTest: Using NYC and current time:\n")
console.log("getSpa =", JSON.stringify(get, null, 2), "\n");
console.log("calcSpa =", JSON.stringify(calc, null, 2), "\n");
