# Data provenance

Where every number in CosmoCode comes from. The app serves this file at `/docs/PROVENANCE.md`.

## Important context

The site values in `src/data/sites.json` are **curated sample data**. They are realistic estimates assembled from the public datasets below and from the analog-site literature, not a live pull for every parameter of every site. Each site carries a `completeness` (0..1) and a `resolutionTier` (0.5 coarse, 0.75 regional, 1.0 site-scale) so you can see how much to trust it. A live NASA data pipeline is planned; `scripts/fetch_analog_data.py` is a starter sketch for it.

## Datasets

| Dataset | Used for | Product / version | URL | Access date |
| --- | --- | --- | --- | --- |
| NASA POWER | temperature, precipitation, humidity, pressure, daylight | POWER climatology API, 1991-2020 baseline | https://power.larc.nasa.gov/ | 2026-10-10 |
| NASA SRTM / NASADEM | elevation, slope | NASADEM HGT v001, 1 arc-second | https://lpdaac.usgs.gov/products/nasadem_hgtv001/ | 2026-10-10 |
| LRO Diviner / LOLA | Moon temperature and terrain baseline | Diviner level-2 products via PDS | https://pds-geosciences.wustl.edu/missions/lro/diviner.htm | 2026-10-10 |
| MGS TES / MOLA | Mars temperature and terrain baseline | TES level-2 via PDS | https://pds-geosciences.wustl.edu/missions/mgs/tes.htm | 2026-10-10 |
| LRO CRaTER | Moon radiation target | CRaTER dose measurements via PDS | https://pds-geosciences.wustl.edu/missions/lro/crater.htm | 2026-10-10 |
| Curiosity RAD | Mars radiation target | RAD surface dose via PDS | https://pds-geosciences.wustl.edu/missions/msl/ | 2026-10-10 |
| MODIS / MERRA-2 | dust activity proxy | MODIS aerosol and MERRA-2 via NASA Earthdata | https://earthdata.nasa.gov/ | 2026-10-10 |
| NASA SEDAC GPW | isolation index | Gridded Population of the World v4 | https://sedac.ciesin.columbia.edu/data/collection/gpw-v4 | 2026-10-10 |
| USGS Landsat / ASTER | soil composition proxy | Landsat 8/9 and ASTER via EarthExplorer | https://earthexplorer.usgs.gov/ | 2026-10-10 |
| MRO CRISM | aqueous geochemistry reference | CRISM via PDS | https://pds-geosciences.wustl.edu/missions/mro/crism.htm | 2026-10-10 |

Map tiles: OpenStreetMap, OpenTopoMap and Esri World Imagery (all free tiers, no API key).

## Planetary targets (src/data/config.json)

- **Moon base profile.** Equatorial/mare global-mean reference for a permanent lunar base. Radiation target 380 µSv/day, from LRO CRaTER measurements of the lunar surface dose rate. South-pole (e.g. Artemis) targets are future work; the current profile is not a south-pole model.
- **Mars base profile.** Global-mean reference for a permanent Mars base. Radiation target 210 µSv/day, from Curiosity RAD surface measurements.

Radiation is stored in µSv/day (microsieverts per day).

## What is measured and what is judgement

- **Targets** are traceable to an instrument or a dataset. See the table above, and the planetary targets section below, for the citation behind each one.
- **Tolerances** are how far a site can sit from a target before it scores zero. These are our judgement, not a published number. They are set so that each axis still separates the 24 sites instead of flattening them all to 0 or 1.
- **Weights** say how much an axis counts. These are our judgement too, chosen from what matters for a habitat: thermal, terrain, water and dust. Every weight is editable in `src/data/config.json` and in the app's custom profile builder, and the ranking recomputes as you change it.

Because tolerances and weights are judgement, we publish them rather than bury them, and `npm run validate` re-runs the whole model so anybody can check the arithmetic.

## Site photos

Site photos were removed. The picsum.photos placeholders showed landscapes that are not the actual sites, which is worse than no photo for a science demo. Real NASA/Wikimedia photos with attribution go back here; the `imageUrl` / `imageCredit` fields are still in the type and guarded in the UI.

## Handling of estimates

- Values with low completeness (below 0.8) or a coarse resolution tier (0.5) are rougher; those sites get a dashed marker on the map and a lower confidence score.
- Where a site-level measurement was unavailable, a regional or literature value was used and the completeness was lowered.
- All 24 sites and 13 parameters are listed in `src/data/sites.json`; the scoring re-run is `scripts/validate.mjs` (see `docs/VALIDATION.md`).
