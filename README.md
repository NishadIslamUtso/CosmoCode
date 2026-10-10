> This is a frontend prototype. It runs on a curated sample dataset bundled with the app: eight of the thirteen parameters are measured and reproducible from the scripts in this repo, five are our own estimates. A live NASA data pipeline, with automatic retrieval and validation scripts, is our next step.

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
  by score, and you can switch to a satellite layer or a hillshade overlay.
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
- Each parameter is labelled measured, derived or estimated in the detail panel, so
  you can see which numbers are real and which are our judgement.
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
npm run build     # production build (about 97 kB first load JS for /, it is small)
npm run validate  # reruns the scoring in the terminal and checks the rankings
```

## Scoring (simple)

We kept the math as simple as we could. For each parameter, we ask "how close is
this site to the planet's value?":

```
similarity = 1 - |value - target| / tolerance      (clamped to 0..1)
score = 100 * sum(weight * similarity) / sum(weight)   over scorable axes only
```

We used this because it is easy to understand, not z-score or anything fancy.

Some axes are impossible for any Earth site: Earth's atmosphere and magnetic field shield
the surface, so nothing matches the lunar or Martian radiation dose, and no Earth day
lasts 336 hours. Those are excluded from the weighted mean and reported separately as
structural mismatch. Averaging them in would only scale every score by the same constant
and hide the finding, so we show it instead.
A site that exactly matches the Mars temperature gets similarity 1.0 for that
parameter; a site that is one tolerance-band away gets 0. Every weight, target and
tolerance lives in `src/data/config.json`, so if you disagree with one you can just
edit it (or use the profile builder in the app).

Confidence is separate from score: `completeness * resolution tier * 100`. Sites
with sparse data get a dashed marker on the map so you know not to trust them fully.

## Where the numbers come from

8 of the 13 parameters are measured or exactly derived, and you can regenerate them
yourself. 5 are our estimates and are labelled as such everywhere.

**Measured** (retrieved 2026-10-10, reproducible, no API key):

- [NASA POWER](https://power.larc.nasa.gov/) - temperature, temperature range, pressure, humidity, precipitation
- [SRTM 30 m](https://api.opentopodata.org/) and [ASTER 30 m](https://asterweb.jpl.nasa.gov/) - elevation and slope

**Derived:** daylight hours at the summer solstice, computed exactly from latitude.

**Estimated by us:** radiation, soil composition, dust activity, isolation and aqueous
geochemistry. See `docs/PROVENANCE.md`.

Run the retrieval yourself:

```bash
python3 scripts/fetch_power.py
python3 scripts/fetch_dem.py
```

One thing worth knowing: POWER is a coarse grid, so at steep sites it samples the wrong
elevation. Mauna Kea's grid cell sits at 636 m while the summit is 4147 m, which makes
POWER report +20.9 C for a mountain that is actually about -2 C. We correct temperature
with a 6.5 C/km lapse rate and pressure with the barometric formula, and we lower the
resolution tier wherever that correction is doing a lot of work. Both corrections are in
`scripts/` and in `docs/PROVENANCE.md`.

Radiation targets only: [LRO CRaTER](https://pds-geosciences.wustl.edu/missions/lro/crater.htm)
(Moon 380 µSv/day) and [Curiosity RAD](https://pds-geosciences.wustl.edu/missions/msl/)
(Mars 210 µSv/day).

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

- Live NASA data pipeline: **planned**. The two retrieval scripts in `scripts/` are one-shot
  and write JSON to a temporary folder; they are not wired into a scheduler or a validation
  loop yet, and the values in `src/data/sites.json` were generated by running them by hand.
- Five parameters (radiation, soil, dust, isolation, aqueous geochemistry) are our estimates,
  not measurements. Replacing them with real retrievals is the next scientific step.
- Site photos are removed for now; we want real NASA/Wikimedia field photos with
  attribution before any real use.
- A tilted "3D" view of the map was tried as a pure-CSS effect and did not behave
  well in use, so it is switched off. We also looked at a full 3D globe (Cesium
  etc.), but it slowed everything down and did not add much, so we skipped that.
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
