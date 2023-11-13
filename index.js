const spa = require('./dist/spa');

function fractalTime(fractionalHour) {
    const hours = Math.floor(fractionalHour);
    const minutes = Math.floor((fractionalHour - hours) * 60);
    const seconds = Math.floor((fractionalHour * 3600) - (hours * 3600) - (minutes * 60));
    const ms = Math.floor((fractionalHour * 3600000) - (hours * 3600000) - (minutes * 60000) - (seconds * 1000));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

function adjustForCustomAngle(baseSpaData, zenithAngle) {
    let adjustedData = { ...baseSpaData };
    const standardZenith = 90.83;
    const angleDifference = zenithAngle - standardZenith;
    const timeAdjustment = angleDifference / 360 * 24;
    adjustedData.sunrise -= timeAdjustment;
    adjustedData.sunset += timeAdjustment;
    return adjustedData;
}

function getSpa(date, lat, lng, tz = 0, params = null, angles = []) {
    let data = new spa.SpaData();
    data.year = date.getFullYear();
    data.month = date.getMonth() + 1; // JavaScript months are 0-indexed
    data.day = date.getDate();
    data.hour = date.getHours();
    data.minute = date.getMinutes();
    data.second = date.getSeconds();
    data.longitude = lng;
    data.latitude = lat;
    data.timezone = tz;

    // Set default values if optional parameters are not provided
    data.elevation = params?.elevation ?? 50;
    data.pressure = params?.pressure ?? 1013.25;
    data.temperature = params?.temperature ?? 15;
    data.function = spa.SPA_ALL;

    let result = spa.spa_calculate(data);
    let output = {};

    if (result === 0) {
        output = {
            zenith: data.zenith,
            azimuth: data.azimuth,
            sunrise: data.sunrise,
            solarNoon: data.suntransit,
            sunset: data.sunset
        };

        if (angles.length > 0) {
            output.angles = angles.map(angle => {
                let customSpaData = adjustForCustomAngle({ ...data }, angle);
                return {
                    sunrise: customSpaData.sunrise,
                    sunset: customSpaData.sunset
                };
            });
        }
    } else {
        console.error('SPA Calculation failed');
    }

    return output;
}

function calcSpa(date, lat, lng, tz = 0, params = null, angles = []) {
    let rawData = getSpa(date, lat, lng, tz, params, angles);
    rawData.sunrise = fractalTime(rawData.sunrise);
    rawData.solarNoon = fractalTime(rawData.solarNoon);
    rawData.sunset = fractalTime(rawData.sunset);

    if (rawData.angles) {
        rawData.angles = rawData.angles.map(angleData => {
            return {
                sunrise: fractalTime(angleData.sunrise),
                sunset: fractalTime(angleData.sunset)
            };
        });
    }

    return rawData;
}

module.exports = {
    getSpa,
    calcSpa,
    fractalTime
};
