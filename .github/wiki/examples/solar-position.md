# Example: Solar Position Logger

Print solar position every 30 minutes throughout a day.

```js
import { calcSpa } from 'nrel-spa';

const LAT = 40.7128;  // New York
const LON = -74.0060;
const TZ = -4;        // EDT

const date = new Date('2025-06-21T00:00:00-04:00');

console.log('Time (local)  Zenith    Azimuth');
console.log('────────────  ────────  ────────');

for (let hour = 4; hour <= 21; hour++) {
  for (const min of [0, 30]) {
    const d = new Date(date);
    d.setHours(hour, min, 0, 0);
    const r = calcSpa(d, LAT, LON, TZ);
    const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    const zenith = Number(r.zenith).toFixed(1).padStart(7);
    const azimuth = Number(r.azimuth).toFixed(1).padStart(7);
    console.log(`${timeStr}          ${zenith}°  ${azimuth}°`);
  }
}
```

Sample output (abbreviated):

```
Time (local)  Zenith    Azimuth
────────────  ────────  ────────
05:30           89.3°     60.2°
06:00           83.1°     68.4°
12:00           24.6°    185.1°
13:00           26.1°    212.3°
20:00           83.8°    293.7°
```
