# Validation

How we check the scoring, and the exact output of the check.

## Run it

```bash
npm run validate
```

`scripts/validate.mjs` re-runs the full scoring outside the browser (plain Node, no build step) and checks the rankings for both profiles. It exits non-zero if anything fails, so it works in CI too.

## What it checks

- 13 parameters defined, and both profiles (Moon base, Mars base) define all 13 targets, tolerances and weights.
- Every site has a finite value for all 13 parameters, plus completeness and resolution tier in range.
- No placeholder photo fields remain in `src/data/sites.json`.
- Scores stay within 0..100, similarities within 0..1, confidence within 0..100.
- Rankings are sorted descending, and every score equals `100 * sum(weight * similarity) / sum(weight)` (checked to 1e-9).

## Counts

- Sites: 24
- Parameters: 13
- Profiles: 2 (Moon base, Mars base), plus the in-app custom profile builder

## Latest output

Exact output of `npm run validate` (2026-10-10):

```text
CosmoCode scoring validation
============================
Sites: 24
Parameters: 13
Profiles: moon, mars

Invariants:
  [ok] parameter count is 13
  [ok] every site has a finite value for all 13 parameters
  [ok] moon: defines all 13 parameters
  [ok] moon: targets finite, tolerances and weights positive
  [ok] mars: defines all 13 parameters
  [ok] mars: targets finite, tolerances and weights positive
  [ok] all sites have completeness and resolution tier in range
  [ok] no placeholder photo fields remain in sites.json

  [ok] moon: scored 24/24 sites
  [ok] moon: scores within 0..100
  [ok] moon: similarities within 0..1
  [ok] moon: confidence within 0..100
  [ok] moon: ranking sorted descending
  [ok] moon: score equals 100 * sum(weight * similarity) / sum(weight)
  [ok] mars: scored 24/24 sites
  [ok] mars: scores within 0..100
  [ok] mars: similarities within 0..1
  [ok] mars: confidence within 0..100
  [ok] mars: ranking sorted descending
  [ok] mars: score equals 100 * sum(weight * similarity) / sum(weight)

Moon base profile (top 10 of 24)
rank  site                      score  confidence
   1  McMurdo Dry Valleys        43.6          85
   2  Atacama Desert             36.9          90
   3  Namib Desert               34.4          56
   4  Craters of the Moon        34.0          85
   5  East Antarctic Plateau     32.7          80
   6  Devon Island               30.6          85
   7  Deception Island           28.6          52
   8  Sonoran Desert             28.1          60
   9  Lanzarote                  27.8          85
  10  Death Valley               26.4          90

Mars base profile (top 10 of 24)
rank  site                      score  confidence
   1  East Antarctic Plateau     34.4          80
   2  Atacama Desert             27.0          90
   3  McMurdo Dry Valleys        26.1          85
   4  Namib Desert               26.0          56
   5  Wadi Rum                   24.5          85
   6  Death Valley               21.8          90
   7  Danakil Depression         19.7          52
   8  Negev Desert               19.5          85
   9  Mojave Desert              17.9          90
  10  Rio Tinto                  17.6          90

Moon base: parameters where every site scores 0 similarity: tempRange, radiation
Mars base: parameters where every site scores 0 similarity: radiation, pressure
(expected: radiation everywhere, since Earth shields the surface; plus tempRange for the Moon,
 since no Earth site reproduces the 250 C lunar day/night swing, and pressure for Mars,
 since no Earth site has 0.6 kPa air)

PASSED: all checks passed (24 sites, 13 parameters, 2 profiles).
```

## Reading the output

- Moon base: `tempRange` and `radiation` score 0 similarity for every Earth site. No Earth site reproduces the 250 °C lunar day/night swing, and Earth's atmosphere and magnetic field shield the surface from the 380 µSv/day lunar dose rate (LRO CRaTER).
- Mars base: `radiation` and `pressure` score 0 similarity for every Earth site. No ground site matches the 210 µSv/day Mars surface dose rate (Curiosity RAD), and no Earth site has Mars-thin 0.6 kPa air.
- These zeros are expected and honest. The app shows them instead of hiding them, and they are the clearest argument for why no single Earth site is a full Mars or Moon stand-in.
