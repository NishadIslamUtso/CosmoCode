# CosmoCode, Earth Analog Finder. One page.

**Team:** CosmoCode, 2nd year CSE students
**Challenge:** NASA Space Apps 2026, "Identify Earth Locations that Analog the Permanent Moon Base and Mars"
**Repo:** NishadIslamUtso/CosmoCode

## The idea

NASA needs places on Earth that feel like the Moon or Mars: astronaut training, rover and habitat testing, isolation studies. CosmoCode is a web app that ranks 24 real Earth sites against Moon base and Mars base conditions, and shows the math behind every score. No black box.

## What it does

- World map (Leaflet, free tiles, no API key) with markers colored by score; street, satellite and hillshade layers; a pure-CSS "3D peek" tilt.
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
| 1 | McMurdo Dry Valleys | 43.6 | 85 |
| 2 | Atacama Desert | 36.9 | 90 |
| 3 | Namib Desert | 34.4 | 56 |
| 4 | Craters of the Moon | 34.0 | 85 |
| 5 | East Antarctic Plateau | 32.7 | 80 |

Mars base profile (top 5 of 24):

| Rank | Site | Score | Confidence |
| --- | --- | --- | --- |
| 1 | East Antarctic Plateau | 34.4 | 80 |
| 2 | Atacama Desert | 27.0 | 90 |
| 3 | McMurdo Dry Valleys | 26.1 | 85 |
| 4 | Namib Desert | 26.0 | 56 |
| 5 | Wadi Rum | 24.5 | 85 |

Full top-10 tables and all checks: `docs/VALIDATION.md`.

## Honest limits

- Site values are curated sample data from NASA datasets and papers, labeled with completeness and resolution tier. Not a live pull (a starter script exists).
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

NASA POWER, SRTM/NASADEM, LRO Diviner/CRaTER, MGS TES, Curiosity RAD, MODIS/MERRA-2, SEDAC GPW, USGS Landsat/ASTER, MRO CRISM. Details: `docs/PROVENANCE.md`.
