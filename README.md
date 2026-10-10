> This is a frontend prototype. It runs on a curated sample dataset bundled with the app. A live NASA data pipeline, with automatic retrieval and validation scripts, is our next step.

# CosmoCode - Earth Analog Finder

Hi! We are CosmoCode, a team of 2nd year CSE students, and we built this for the
**NASA Space Apps Challenge 2026**. The challenge: *"Identify Earth Locations that
Analog the Permanent Moon Base and Mars."*

Basically NASA needs places on Earth that feel like the Moon or Mars: for astronaut
training, rover and habitat testing, and isolation studies. So we made a little web
app that ranks 24 real Earth sites by how close they are to Moon or Mars conditions,
and shows all of the math behind every score. No black box, promise.

btw we had limited time (like, one weekend limited), so the site values are curated
sample data based on NASA datasets and papers, not live pulls for every parameter.
It is all clearly labeled in the app and in `docs/PROVENANCE.md`.

## What it does

- World map with all 24 sites (Leaflet + free tiles, no API key). Markers are colored
  by score, and you can switch to a satellite layer or a hillshade overlay. There is
  also a fun "3D peek" toggle that tilts the map with pure CSS (off by default).
- Toggle between **Moon base** and **Mars base** profiles, or build your own.
- **Custom profile builder** with presets: Lunar geology, Mars arid, and Mars aqueous
  (this one lifts Rio Tinto). You can see little "biggest movers" pills showing which
  sites go up or down while you tweak.
- Click any site for a detail panel: score breakdown per parameter, confidence
  rating, and links to the NASA sources.
- 13 parameters total: temperature, temp range, radiation, slope, soil composition,
  pressure, daylight, precipitation, humidity, dust, isolation, elevation, and
  aqueous geochemistry (the 13th one, added after early feedback, since sites like
  Rio Tinto are all about water chemistry).
- Filter, sort, and export the results as CSV.

## How to run

You need Node.js 18.17 or newer (we tested on Node 20.20 on Linux).

```bash
npm install
npm run dev
```

Then open http://localhost:3000. That is it. No API keys, no accounts, no paid
services. The scoring also works offline since the data is just JSON in the repo.

Two more useful commands:

```bash
npm run build     # production build (96.6 kB first load JS for /, it is small)
npm run validate  # reruns the scoring in the terminal and checks the rankings
```

## Scoring (simple)

We kept the math as simple as we could. For each parameter, we ask "how close is
this site to the planet's value?":

```
similarity = 1 - |value - target| / tolerance      (clamped to 0..1)
score = 100 * sum(weight * similarity) / sum(weight)
```

We used this because it is easy to understand, not z-score or anything fancy.
A site that exactly matches the Mars temperature gets similarity 1.0 for that
parameter; a site that is one tolerance-band away gets 0. Every weight, target and
tolerance lives in `src/data/config.json`, so if you disagree with one you can just
edit it (or use the profile builder in the app).

Confidence is separate from score: `completeness * resolution tier * 100`. Sites
with sparse data get a dashed marker on the map so you know not to trust them fully.

## Datasets we used

All free/open. Full details (versions, URLs, access dates, how we handled estimates)
are in `docs/PROVENANCE.md`, which the app also serves at `/docs/PROVENANCE.md`.

- [NASA POWER](https://power.larc.nasa.gov/) - temperature, precipitation, humidity, pressure, daylight
- [NASA SRTM / NASADEM](https://lpdaac.usgs.gov/products/nasadem_hgtv001/) - elevation, slope
- [LRO Diviner / LOLA](https://pds-geosciences.wustl.edu/missions/lro/diviner.htm) - Moon temperature and terrain baseline
- [MGS TES / MOLA](https://pds-geosciences.wustl.edu/missions/mgs/tes.htm) - Mars temperature and terrain baseline
- [LRO CRaTER / Curiosity RAD](https://pds-geosciences.wustl.edu/missions/lro/crater.htm) - radiation targets (Moon 380 µSv/day, Mars 210 µSv/day)
- [MODIS / MERRA-2](https://earthdata.nasa.gov/) - dust activity proxy
- [NASA SEDAC GPW](https://sedac.ciesin.columbia.edu/data/collection/gpw-v4) - isolation index
- [USGS Landsat / ASTER](https://earthexplorer.usgs.gov/) - soil composition proxy
- [MRO CRISM](https://pds-geosciences.wustl.edu/missions/mro/crism.htm) - aqueous geochemistry reference

Map tiles are OpenStreetMap, OpenTopoMap and Esri World Imagery (all free tiers).
Site photos were removed: the picsum.photos placeholders showed landscapes that are
not the real sites, so we took them out. Real NASA/Wikimedia photos with attribution
go back in the same spot (`imageUrl` / `imageCredit`).

## Project layout

```
src/
  app/page.tsx          # main page, holds state
  app/layout.tsx        # root layout (system font stack, no webfonts)
  app/docs/             # serves the markdown in docs/ at /docs/<file>
  components/           # map, filters, ranked table, detail panel, profile builder
  lib/scoring.ts        # the scoring math (short, please read it)
  lib/data.ts           # loads the json + filter/sort/csv helpers
  data/config.json      # parameters, targets, weights, tolerances
  data/sites.json       # the 24 sites
scripts/validate.mjs    # re-runs the scoring outside the browser
scripts/scoring.mjs     # plain-JS mirror of the scoring for validate.mjs
scripts/fetch_analog_data.py  # starter for live NASA POWER pulls
docs/                   # provenance, validation, storyboard, judge Q&A etc.
```

## Known issues / future work

- Live NASA data pipeline (automatic retrieval and validation scripts): **planned**, not built yet.
  The app runs on a curated sample dataset bundled with the app; `scripts/fetch_analog_data.py`
  is a starter for pulling live NASA POWER values.
- Site photos are removed for now; we want real NASA/Wikimedia field photos with
  attribution before any real use.
- The 3D peek is just CSS. We thought about a full 3D globe (Cesium etc.) but it
  slowed everything down and honestly did not add much, so we skipped it.
- Planetary targets are global means. The Moon profile is an equatorial/mare
  global-mean reference; south-pole (e.g. Artemis) targets are future work.
- The aqueous geochemistry values are our best literature estimates, first version
  of that axis, we know it can be sharper.

## Docs

Everything the judges might ask is in `docs/` (also served from the app at `/docs/`):
`PROVENANCE.md`, `VALIDATION.md`, `STORYBOARD.md`, `JUDGING_MAPPING.md`,
`JUDGE_QA.md`, `ONE_PAGER.md`, `DEMO_SCRIPT.md`.

---

Team CosmoCode, 2nd year CSE, NASA Space Apps 2026

we stayed up way too late on this, hope it is useful. if the scores look weird,
check the per-parameter breakdown first, it is usually one parameter dragging a site down.
