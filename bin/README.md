# bin/README.md

This folder contains the C reference executable (`spa_cli`) and the JavaScript test harness (`test.js`) to compare your JS port of the NREL Solar Position Algorithm (SPA) against the original C implementation.

## Prerequisites

* **Node.js** (v14+) installed on your machine.
* **C compiler** (e.g. `gcc`) supporting C99.

## Files

* `spa_cli.c` – C CLI wrapper to parse command-line arguments into the SPA structure and output Sunrise, Solar Noon, Sunset in `HH:MM:SS` format.
* `spa.c`, `spa.h` – The NREL SPA reference source (download separately).
* `test.js` – Node.js script that runs 10 diverse test cases through both `spa_cli` and your JS port (`getSpa`) and prints a side-by-side comparison.

## Setup

1. **Download the NREL SPA source**

   ```bash
   cd bin
   curl -O https://midcdmz.nrel.gov/spa/spa.c
   curl -O https://midcdmz.nrel.gov/spa/spa.h
   ```

2. **Copy or create `spa_cli.c`**
   Place the `spa_cli.c` file (provided alongside this README) into this folder.

3. **Compile the C executable**

   ```bash
   gcc -std=c99 -O2 -o spa_cli spa.c spa_cli.c -lm
   ```

   * **Do NOT** include `spa_tester.c` for this purpose.  The custom `spa_cli.c` handles all required argument parsing and output.

4. **Install Node.js dependencies**
   From the project root (one level up):

   ```bash
   npm install
   ```

   This ensures your JS port (`index.js` and `dist/spa.js`) is available.

## Running the Tests

Inside the `bin/` folder, execute:

```bash
node test.js
```

You should see a table with each city/date, and matching Sunrise, Solar Noon, and Sunset times from both the C reference and your JS implementation.

Example output:

```
Location         | Date       | C Rise   | JS Rise  | C Noon   | JS Noon  | C Set    | JS Set
-----------------------------------------------------------------------------------
New York Summer  | 2025-06-21 | 05:25:03 | 05:25:03 | 12:57:56 | 12:57:56 | 20:30:35 | 20:30:35
...
```

## Notes

* If you update your JS port (`index.js`), rerun `node test.js` to verify that drift remains within a second.
* Ensure `spa_cli` is executable (`chmod +x spa_cli`) and located in the same directory as `test.js`.

## Results

Results from my personal tests when comparing original C version to this JS version is below:

```
% node test.js
Location         | Date       | C Rise   | JS Rise  | C Noon   | JS Noon  | C Set    | JS Set
-----------------------------------------------------------------------------------
New York Summer  | 2025-06-21 | 05:25:03 | 05:25:03 | 12:57:56 | 12:57:56 | 20:30:35 | 20:30:35
New York Winter  | 2025-12-21 | 07:16:41 | 07:16:41 | 11:54:19 | 11:54:19 | 16:31:56 | 16:31:56
London Summer    | 2025-06-21 | 04:43:07 | 04:43:07 | 13:02:22 | 13:02:22 | 21:21:37 | 21:21:37
London Winter    | 2025-12-21 | 08:03:52 | 08:03:52 | 11:58:42 | 11:58:42 | 15:53:32 | 15:53:32
Tokyo Summer     | 2025-06-21 | 04:25:52 | 04:25:52 | 11:43:00 | 11:43:00 | 19:00:22 | 19:00:22
Sydney Winter    | 2025-06-21 | 07:00:12 | 07:00:12 | 11:56:56 | 11:56:56 | 16:53:52 | 16:53:52
Reykjavik Mids   | 2025-06-21 | 02:55:10 | 02:55:10 | 13:29:38 | 13:29:38 | 00:03:54 | 00:03:54
Cape Town Summer | 2025-12-21 | 05:31:55 | 05:31:55 | 12:44:28 | 12:44:28 | 19:57:01 | 19:57:01
Quito Equinox    | 2025-03-20 | 06:17:54 | 06:17:54 | 12:21:10 | 12:21:10 | 18:24:25 | 18:24:25
Tromso Polar     | 2025-12-21 | N/A      | N/A      | N/A      | N/A      | N/A      | N/A
```