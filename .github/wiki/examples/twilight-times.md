# Example: Twilight Times

Compute civil, nautical, and astronomical twilight for a location.

```js
import { getSpa, formatTime } from 'nrel-spa';

const LAT = 34.0522;  // Los Angeles
const LON = -118.2437;
const TZ = -7;        // PDT

const date = new Date('2025-09-15T12:00:00-07:00');

const r = getSpa(date, LAT, LON, TZ, {}, [90.833, 96, 102, 108]);

const labels = ['Sunrise/Sunset', 'Civil', 'Nautical', 'Astronomical'];

for (let i = 0; i < r.customAngles.length; i++) {
  const ca = r.customAngles[i];
  const rise = formatTime(ca.sunrise);
  const set  = formatTime(ca.sunset);
  console.log(`${labels[i].padEnd(16)} dawn: ${rise}  dusk: ${set}`);
}
```

Sample output:

```
Sunrise/Sunset   dawn: 06:30:42  dusk: 19:12:18
Civil            dawn: 06:04:11  dusk: 19:38:49
Nautical         dawn: 05:33:07  dusk: 20:09:53
Astronomical     dawn: 05:01:19  dusk: 20:41:41
```
