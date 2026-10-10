# Storyboard: 3-minute demo

Beat-by-beat plan for the live demo. The whole demo runs offline; there are no API keys and no network calls in the scoring path.

| Time | Beat | What the judge sees |
| --- | --- | --- |
| 0:00-0:20 | Hook | "NASA needs places on Earth that feel like the Moon or Mars. We built a web app that ranks 24 real sites by how close they are to Moon base or Mars base conditions, and shows all the math." |
| 0:20-0:50 | The map | World map, markers colored by score under the Mars profile. Switch to the satellite layer, then the hillshade. Toggle the 3D peek (pure CSS tilt). |
| 0:50-1:20 | Profiles | Flip Moon base / Mars base. Rankings recompute instantly. Point out the biggest movers. |
| 1:20-1:50 | Custom builder | Open Custom, apply the "Mars aqueous" preset. Rio Tinto climbs the table. This is the "no black box" moment: every number is editable. |
| 1:50-2:20 | Site detail | Click Rio Tinto. Per-parameter breakdown, similarity chart, confidence, NASA source links. |
| 2:20-2:40 | Honesty beat | Show a dashed marker (sparse data): "The app tells you what it does not know." Show that radiation and pressure score 0 for every Earth site, because Earth shields us. |
| 2:40-3:00 | Close | Filter, sort, export CSV. Hand over docs/: PROVENANCE, VALIDATION, ONE_PAGER. |

## Backup plan

- If the projector fails: `docs/ONE_PAGER.md` plus the CSV export tells the same story.
- If the network fails: nothing breaks. Offline-capable by design; the scoring is local JSON plus math, and only the map tiles use the network.

## One-liners

- "24 sites, 13 parameters, 2 profiles, one weekend."
- "If you disagree with a weight, change it. The ranking updates live."
