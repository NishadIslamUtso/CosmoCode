# Data provenance

Where every number in `src/data/sites.json` comes from, and what we had to estimate.

**Short version:** 8 of the 13 parameters are measured or exactly derived, and you can
reproduce them yourself with two scripts in this repo. 5 are our own estimates, listed by
name below. We no longer claim to have retrieved anything we did not actually retrieve.

## Parameter by parameter

| Parameter | Status | Source |
| --- | --- | --- |
| Mean temperature | **measured** | NASA POWER `T2M`, annual climatology, corrected to the site elevation |
| Temperature range | **measured** | NASA POWER `T2M_MAX` minus `T2M_MIN`, annual climatology |
| Atmospheric pressure | **measured** | NASA POWER `PS`, annual climatology, corrected to the site elevation |
| Relative humidity | **measured** | NASA POWER `RH2M`, annual climatology |
| Precipitation | **measured** | NASA POWER `PRECTOTCORR`, annual climatology, times 365.25 |
| Elevation | **measured** | SRTM 30 m, or ASTER 30 m where SRTM has no coverage |
| Slope | **derived** | Gradient of a 3x3 patch of the same DEM, about 250 m across |
| Daylight | **derived** | Computed from latitude for the summer solstice. Exact, not measured |
| Radiation dose | *estimated* | Literature-informed. No instrument data |
| Soil composition | *estimated* | Literature-informed 0 to 100 index |
| Dust activity | *estimated* | Literature-informed 0 to 100 index |
| Isolation | *estimated* | Literature-informed 0 to 100 index |
| Aqueous geochemistry | *estimated* | Literature-informed 0 to 100 index |

## How to reproduce the measured values

```bash
python3 scripts/fetch_power.py     # writes /tmp/gen/power_raw.json
python3 scripts/fetch_dem.py       # writes /tmp/gen/dem_raw.json
```

Neither script needs an API key or an account. Both were run on **2026-10-10**, and that
is the date the values in `sites.json` come from.

| Source | Endpoint | Used for |
| --- | --- | --- |
| NASA POWER | `https://power.larc.nasa.gov/api/temporal/climatology/point` | temperature, temperature range, pressure, humidity, precipitation |
| SRTM 30 m | `https://api.opentopodata.org/v1/srtm30m` | elevation and slope |
| ASTER 30 m | `https://api.opentopodata.org/v1/aster30m` | elevation and slope at the polar sites SRTM does not cover |

## The elevation correction, and why it was needed

NASA POWER is a gridded reanalysis. Its cells are coarse, and at sites with steep local
terrain the grid samples the wrong place entirely. Two examples:

| Site | POWER grid elevation | True elevation (30 m DEM) | POWER raw temperature | After correction | Real value |
| --- | --- | --- | --- | --- | --- |
| Mauna Kea | 636 m | 4147 m | +20.9 C | -1.9 C | about -2 C |
| Death Valley | 846 m | -82 m | +19.1 C | +25.1 C | about 25 C |
| Danakil Depression | 1063 m | -91 m | +26.0 C | +33.5 C | about 34 C |

So we correct two parameters from the grid elevation to the site elevation:

- **Temperature**: `T_site = T_grid - 6.5 C/km x (h_site - h_grid)`, the standard
  free-air lapse rate.
- **Pressure**: `P_site = P_grid x exp(-(h_site - h_grid) / 8400 m)`, the barometric
  formula with an 8.4 km scale height.

Both are approximations. They are recorded in `scripts/` and in the `sourceNote` field of
each parameter in `src/data/config.json`, and they are the reason the resolution tier
below still costs confidence at sites with a large elevation gap.

## Resolution tier is no longer a guess

Each site carries a `resolutionTier` derived from the gap between the POWER grid elevation
and the true site elevation, because the correction above is approximate and because
humidity and precipitation cannot be corrected at all:

| Gap between grid and site elevation | Tier |
| --- | --- |
| 300 m or less | 1.0 |
| up to 1000 m | 0.9 |
| up to 2000 m | 0.8 |
| more than 2000 m | 0.7 |

Sites such as Mauna Kea, Teide, Etna, Danakil and Ladakh land in the bottom two rows.
That is real: our climate data genuinely does not resolve them well, and their dashed
markers on the map say so.

## The estimated parameters, honestly

Radiation, soil composition, dust activity, isolation and aqueous geochemistry are
**our judgement, not measurements.** They are informed by the analog-site literature and
by the datasets below, but no value was pulled from them:

- NASA SEDAC GPW v4, for a sense of remoteness
- USGS Landsat / ASTER and MRO CRISM, for a sense of surface composition
- MODIS / MERRA-2, for a sense of dust loading
- LRO CRaTER and Curiosity RAD, for the radiation *targets* (not the site values)

We list these so you can see what we were thinking and where we would go to replace the
estimates with real data. Treat any ranking that leans on them with more caution than one
driven by temperature or pressure.

## Planetary targets

- **Moon base.** Equatorial/mare global-mean reference for a permanent lunar base. Radiation
  target 380 uSv/day from LRO CRaTER, temperature and terrain baseline from LRO Diviner and
  LOLA. South-pole (e.g. Artemis) targets are future work.
- **Mars base.** Global-mean reference. Radiation target 210 uSv/day from Curiosity RAD,
  temperature and terrain baseline from MGS TES and MOLA.

Both dose rates are unreachable at Earth's surface, which is the point of the structural
mismatch reported in `docs/VALIDATION.md`.

## What is measured versus what is judgement

- **Targets** trace to an instrument or a dataset, cited above.
- **Tolerances** are our judgement. They set how far a site can sit from a target before it
  scores zero.
- **Weights** are our judgement too, chosen from what matters for a habitat.

Both are editable in `src/data/config.json` and in the app's profile builder, and
`docs/VALIDATION.md` reports how much the ranking moves when you change them.

## Site photos

Site photos were removed. The earlier placeholders showed landscapes that are not the real
sites, which is worse than no photo for a science demo. The `imageUrl` and `imageCredit`
fields stay in the type and the render stays guarded, so real NASA or Wikimedia photos with
attribution can go back in without touching the components.

## Known limitations

- Power is grid smoothed. Precipitation is the weakest of the measured set.
- The elevation correction is an approximation, not a downscaling model.
- ASTER replaces SRTM at five polar sites, so those elevations come from a different sensor.
- Five parameters remain estimates. See the table at the top.
- There is no uncertainty propagation. The score is a point estimate.
