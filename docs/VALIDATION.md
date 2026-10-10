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
  [ok] moon: score equals 100 * sum(weight * similarity) / sum(weight) over scorable axes only
  [ok] moon: structurally unreachable axes score 0 for every site and are excluded
  [ok] mars: scored 24/24 sites
  [ok] mars: scores within 0..100
  [ok] mars: similarities within 0..1
  [ok] mars: confidence within 0..100
  [ok] mars: ranking sorted descending
  [ok] mars: score equals 100 * sum(weight * similarity) / sum(weight) over scorable axes only
  [ok] mars: structurally unreachable axes score 0 for every site and are excluded

Moon base profile (top 10 of 24)
rank  site                      score  confidence
   1  Atacama Desert             48.7          81
   2  McMurdo Dry Valleys        46.0          85
   3  Devon Island               41.4          85
   4  East Antarctic Plateau     39.6          80
   5  Erta Ale                   38.9          63
   6  Craters of the Moon        37.9          85
   7  Namib Desert               37.3          68
   8  Mauna Kea                  35.3          56
   9  Deception Island           35.1          69
  10  Pilbara                    34.9          80

Mars base profile (top 10 of 24)
rank  site                      score  confidence
   1  Atacama Desert             64.7          81
   2  East Antarctic Plateau     54.5          80
   3  Namib Desert               46.2          68
   4  McMurdo Dry Valleys        45.6          85
   5  Wadi Rum                   45.1          85
   6  Pilbara                    43.6          80
   7  Mojave Desert              40.8          81
   8  Ladakh                     40.1          60
   9  Negev Desert               38.9          85
  10  Death Valley               38.6          81

Structural mismatch:
Moon base: no site can score on tempRange, radiation, daylight (Temperature range, Radiation dose, Daylight)
  1.80 of 9.50 total weight (19%) is unreachable and is excluded from the mean.
Mars base: no site can score on radiation, pressure (Radiation dose, Atmospheric pressure)
  1.70 of 10.00 total weight (17%) is unreachable and is excluded from the mean.
These axes are reported separately rather than averaged in, because averaging them
would only scale every score by the same constant and hide the finding.

PASSED: all checks passed (24 sites, 13 parameters, 2 profiles).
```

## How much does the ranking depend on our weights?

The weights are our judgement, so we tested how fragile that makes the answer. We
perturbed every one of the 13 weights by a random factor between 0.75 and 1.25,
recomputed the full ranking, and repeated that 5,000 times for each profile.

| Profile | #1 stays the same | Top 5 identical | At least 3 of the top 5 survive |
| --- | --- | --- | --- |
| Moon base | 88.9% | 50.1% | 100.0% |
| Mars base | 100.0% | 86.5% | 100.0% |

The top of the ranking is stable: the winner never changes for Mars, and the Moon's
winner holds in about nine runs out of ten. The composition of the top five is
looser, especially for the Moon, so treat "site 3 versus site 4" as a tie rather
than a result. Nothing below the top five should be read as a strong claim.

## Reading the output

- Moon base: `tempRange` and `radiation` score 0 similarity for every Earth site. No Earth site reproduces the 250 °C lunar day/night swing, and Earth's atmosphere and magnetic field shield the surface from the 380 µSv/day lunar dose rate (LRO CRaTER).
- Mars base: `radiation` and `pressure` score 0 similarity for every Earth site. No ground site matches the 210 µSv/day Mars surface dose rate (Curiosity RAD), and no Earth site has Mars-thin 0.6 kPa air.
- These zeros are expected and honest. The app shows them instead of hiding them, and they are the clearest argument for why no single Earth site is a full Mars or Moon stand-in.
