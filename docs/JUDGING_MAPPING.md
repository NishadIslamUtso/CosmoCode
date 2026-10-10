# Judging criteria mapping

How CosmoCode maps to the NASA Space Apps judging criteria.

| Criterion | What we built | Where to see it |
| --- | --- | --- |
| Impact | A reusable, open ranking of 24 analog sites with a transparent scoring model a mission planner could actually edit | Live app, `src/data/config.json`, CSV export |
| Creativity | Custom profile builder with presets and live "biggest movers" feedback; the aqueous geochemistry axis (13th parameter) added after early feedback | Profile builder on the main page |
| Validity | Every target traceable to a NASA instrument or dataset; which parameters are measured and which are estimated is labelled in the app; a validation script re-runs the scoring and checks the math; the ranking is stress-tested against weight changes | `docs/PROVENANCE.md`, `docs/VALIDATION.md`, `npm run validate` |
| Relevance | Directly answers the challenge: "Identify Earth Locations that Analog the Permanent Moon Base and Mars" | The whole app |
| Presentation | 3-minute storyboard, demo script, judge Q&A, one-pager, all docs served from the app at `/docs/` | `docs/` |

## Use of data

All sources are free and open. No API keys, no paid tiers.

**Retrieved, and reproducible from `scripts/`:** NASA POWER (temperature, temperature
range, pressure, humidity, precipitation) and SRTM 30 m / ASTER 30 m (elevation, slope).

**Used for targets only:** LRO CRaTER (Moon radiation), Curiosity RAD (Mars radiation),
LRO Diviner and LOLA (Moon baseline), MGS TES and MOLA (Mars baseline).

**Estimated by us, not retrieved:** radiation site values, soil composition, dust activity,
isolation and aqueous geochemistry. These five are informed by the literature and labelled
"estimated" in the app. See `docs/PROVENANCE.md`.

That split is deliberate. We would rather show a judge five honest estimates than imply we
measured thirteen parameters when we measured eight.
