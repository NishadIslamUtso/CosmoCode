# Data dictionary

Every field in `src/data/sites.json` and `src/data/config.json`: what it means, its unit, and where it comes from. When a field is a judgement call rather than a measurement, it says so.

## Site record

Each entry in `src/data/sites.json` describes one Earth analog site.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable slug. Used in the CSV export and in URLs. |
| `name` | string | Display name. |
| `country` | string | Country or territory the site sits in. |
| `lat`, `lon` | number | Site centre in decimal degrees, WGS84. |
| `values` | object | The 13 parameter values, keyed by parameter key (below). |
| `completeness` | number | 0 to 1. How much of the site's data we hold. Assigned per site, not computed. |
| `resolutionTier` | number | 0.7 to 1.0. How well the gridded climate data resolves the site. See PROVENANCE.md. |
| `sources` | string[] | Keys into `config.sources`. Which datasets the site draws on. |

## Parameter keys

| Key | Label | Unit | Source | What it is |
| --- | --- | --- | --- | --- |
| `temperature` | Mean temperature | °C | measured | Annual mean air temperature at the site. |
| `tempRange` | Temperature range | °C | measured | Typical day-to-night swing, annual climatology. |
| `radiation` | Radiation dose | µSv/day | derived | Surface cosmic dose rate, modelled from elevation and geomagnetic latitude. |
| `slope` | Terrain slope | ° | derived | Mean local slope over a patch about 250 m across. |
| `soil` | Soil composition | % sand | measured | Sand fraction of the surface soil (0–5 cm), a regolith proxy. |
| `pressure` | Atmospheric pressure | kPa | measured | Mean surface atmospheric pressure. |
| `daylight` | Daylight | h/day | derived | Hours of daylight on the longest day of the year, from latitude. |
| `precipitation` | Precipitation | mm/yr | measured | Mean annual precipitation, rain plus snow water equivalent. |
| `humidity` | Relative humidity | % | measured | Mean annual relative humidity. |
| `dust` | Dust activity | AOD | measured | Aerosol optical depth at 550 nm. |
| `isolation` | Isolation | km | measured | Distance to the nearest settlement of 15,000 people or more. |
| `elevation` | Elevation | m | measured | Elevation above sea level. |
| `aqueous` | Aqueous geochemistry | index | estimated | 0 to 100 index of aqueous-environment match. The only estimated parameter. |

`source` is one of **measured** (retrieved from a named dataset), **derived** (calculated from measured inputs with a published method) or **estimated** (judgement).

## Profile record

`config.profiles` holds the built-in profiles. Each profile has an `id`, a `name`, a `description`, and a `targets` object keyed by parameter key.

Each target has three numbers:

| Field | Meaning |
| --- | --- |
| `target` | The planetary value a site is compared against. |
| `tolerance` | How far a site can sit from the target before it scores zero on that axis. |
| `weight` | How much the axis counts in the weighted mean. |

The built-in profiles are `moon` (equatorial / mare global-mean reference) and `mars` (global-mean reference). Targets trace to the instruments cited in PROVENANCE.md; tolerances and weights are the team's judgement and are editable.

## Preset record

`config.presets` holds the starting points for the custom profile builder. A preset carries a full set of `weights` and may override one or more `targets`. The three presets are `lunar-geology`, `mars-arid` and `mars-aqueous`.

## Sources

`config.sources` maps a short source name to its homepage. The `sources` array on each site lists which of these the site draws on. The full endpoint list and retrieval scripts are in PROVENANCE.md.
