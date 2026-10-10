# Judging criteria mapping

How CosmoCode maps to the NASA Space Apps judging criteria.

| Criterion | What we built | Where to see it |
| --- | --- | --- |
| Impact | A reusable, open ranking of 24 analog sites with a transparent scoring model a mission planner could actually edit | Live app, `src/data/config.json`, CSV export |
| Creativity | Custom profile builder with presets and live "biggest movers" feedback; the aqueous geochemistry axis (13th parameter) added after early feedback | Profile builder on the main page |
| Validity | Every target traceable to a NASA instrument or dataset; a validation script re-runs the scoring and checks the math | `docs/PROVENANCE.md`, `docs/VALIDATION.md`, `npm run validate` |
| Relevance | Directly answers the challenge: "Identify Earth Locations that Analog the Permanent Moon Base and Mars" | The whole app |
| Presentation | 3-minute storyboard, demo script, judge Q&A, one-pager, all docs served from the app at `/docs/` | `docs/` |

## Use of data

All inputs are free/open: NASA POWER, SRTM/NASADEM, LRO (Diviner, CRaTER), MGS (TES), Curiosity RAD, MODIS/MERRA-2, SEDAC GPW, USGS Landsat/ASTER, MRO CRISM. No API keys, no paid tiers.
