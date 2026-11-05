# Frequently asked questions

## What is a score?

A score is a comparative similarity to a stated profile, on a 0 to 100 scale. For each parameter it measures how close the site is to the planetary target, then takes a weighted mean. It is not a probability, and it is not a go/no-go engineering criterion. See METHODOLOGY.md for the formula.

## Why is the Moon profile equatorial?

The built-in Moon profile is an equatorial / mare global-mean reference. A south-pole profile (the Artemis region, for example) would have different targets, and that is future work. The custom profile builder lets you move any target today.

## Why is radiation calculated rather than measured?

No instrument reports ground-level cosmic dose rate for every site on Earth. Instead of guessing, we calculate it from two things we do measure for every site: elevation and geomagnetic latitude. The model uses the Störmer dipole cutoff and an altitude fit to Lindborg et al. (2004). It is labelled **derived**, and it covers cosmic dose only, not the terrestrial dose from local rock.

## Why is aqueous geochemistry an estimate?

We looked for an open, queryable dataset and did not find one. GLORICH and GEMStat hold water chemistry but require an account; HydroSHEDS covers flow, not chemistry; MRO CRISM orbits Mars and cannot measure an Earth site. Rather than derive the parameter from precipitation (which would double-count rainfall) we left it as a labelled estimate. See PROVENANCE.md.

## What is the confidence rating?

Confidence is `completeness × resolutionTier × 100`. It is reported separately from the score on purpose: a site can rank well on the axes we have and still be poorly measured. Sites with confidence below 75 get a dashed marker on the map.

## What are the "impossible axes"?

Some axes cannot be matched by any Earth site. For the Moon profile these are temperature range, radiation dose and daylight (a 336-hour lunar day). For Mars they are radiation dose and atmospheric pressure. The model detects them automatically, leaves them out of the weighted mean, and reports them on screen instead. Averaging them in would only scale every score by the same constant.

## Can I add my own site?

Not yet. The candidate set is a fixed list of 24 curated sites. A broader candidate set or a grid scan is future work. You can, however, move any weight or target in the custom profile builder and watch the ranking recompute.

## How do I reproduce the data?

Four scripts pull 12 of the 13 parameters from public sources, no API key needed:

```bash
python3 scripts/fetch_power.py
python3 scripts/fetch_dem.py
python3 scripts/fetch_extra.py
python3 scripts/fetch_soil.py
```

`scripts/refresh_data.py` runs the whole pipeline and rebuilds `src/data/sites.json`. See PROVENANCE.md for the endpoints and the elevation correction.

## How do I check the scoring?

```bash
npm run validate      # re-runs the scoring in plain Node and checks the rankings
npm run sensitivity   # 5,000 random weight perturbations per profile
npm run uncertainty   # Monte Carlo score ranges
```

## Is this affiliated with NASA?

No. CosmoCode is an independent team entry for the NASA Space Apps Challenge 2026. We use open NASA and other public datasets, and we credit them in PROVENANCE.md, but the project is not affiliated with or endorsed by NASA.

## Where does the data come from?

NASA POWER (climate), SRTM / ASTER (terrain), GeoNames (settlements), ISRIC SoilGrids (soil), and the planetary targets cited in PROVENANCE.md. All sources are listed with endpoints.
