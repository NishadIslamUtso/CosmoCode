# CosmoCode, Earth Analog Finder. One page.

**Team:** CosmoCode, 2nd year CSE students
**Challenge:** NASA Space Apps 2026, "Identify Earth Locations that Analog the Permanent Moon Base and Mars"
**Repo:** NishadIslamUtso/CosmoCode

## The idea

NASA needs places on Earth that feel like the Moon or Mars: astronaut training, rover and habitat testing, isolation studies. CosmoCode is a web app that ranks 24 real Earth sites against Moon base and Mars base conditions, and shows the math behind every score. No black box.

## What it does

- World map (Leaflet, free tiles, no API key) with markers colored by score; street, satellite and hillshade layers.
- Two built-in profiles (Moon base, Mars base) plus a custom profile builder with presets: Lunar geology, Mars arid, Mars aqueous.
- 13 parameters: temperature, temperature range, radiation, slope, soil composition, pressure, daylight, precipitation, humidity, dust, isolation, elevation, aqueous geochemistry.
- Per-site detail panel: score breakdown per parameter, confidence rating, NASA source links.
- Filter, sort, CSV export. Scoring runs fully offline.

## Scoring

```
similarity = 1 - |value - target| / tolerance    (clamped to 0..1)
score      = 100 * sum(weight * similarity) / sum(weight)
confidence = completeness * resolution tier * 100   (shown separately; dashed markers for sparse data)
```

## Results (npm run validate)

Counts: 24 sites, 13 parameters, 2 profiles. Top 5 sites per profile, matching `npm run validate` exactly:

Moon base profile (top 5 of 24):

| Rank | Site | Score | Confidence |
| --- | --- | --- | --- |
| 1 | Atacama Desert | 48.7 | 81 |
| 2 | McMurdo Dry Valleys | 46.0 | 85 |
| 3 | Devon Island | 41.4 | 85 |
| 4 | East Antarctic Plateau | 39.6 | 80 |
| 5 | Erta Ale | 38.9 | 63 |

Mars base profile (top 5 of 24):

| Rank | Site | Score | Confidence |
| --- | --- | --- | --- |
| 1 | Atacama Desert | 64.7 | 81 |
| 2 | East Antarctic Plateau | 54.5 | 80 |
| 3 | Namib Desert | 46.2 | 68 |
| 4 | McMurdo Dry Valleys | 45.6 | 85 |
| 5 | Wadi Rum | 45.1 | 85 |

Full top-10 tables and all checks: `docs/VALIDATION.md`.

## Honest limits

- **8 of 13 parameters are measured or exactly derived** (NASA POWER climatology, SRTM/ASTER 30 m DEM, and daylight computed from latitude), and you can regenerate them with `scripts/fetch_power.py` and `scripts/fetch_dem.py`. Neither needs an API key.
- **5 parameters are our estimates**: radiation, soil composition, dust activity, isolation and aqueous geochemistry. They are labelled as estimates in the app's detail panel.
- Temperature and pressure are corrected from the POWER grid elevation to the true site elevation. Without that correction Mauna Kea reads +20.9 C instead of about -2 C.
- Radiation and pressure are unreachable for every Earth site, so they are excluded from the weighted mean and reported separately rather than averaged in.
- Planetary targets are global means. Moon profile = equatorial/mare global-mean reference; south-pole (e.g. Artemis) targets are future work. Radiation targets: Moon 380 µSv/day (LRO CRaTER), Mars 210 µSv/day (Curiosity RAD).
- Radiation and pressure score 0 for every Earth site, because Earth shields the surface. Shown, not hidden.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # re-runs the scoring in the terminal
npm run build
```

## Data

Measured: NASA POWER climatology and SRTM/ASTER 30 m DEM, retrieved 2026-10-10 and reproducible from `scripts/`. Targets: LRO CRaTER and Curiosity RAD for radiation. Estimated by us: radiation site values, soil, dust, isolation and aqueous geochemistry. Full detail: `docs/PROVENANCE.md`.
