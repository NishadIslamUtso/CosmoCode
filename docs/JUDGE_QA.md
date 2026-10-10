# Judge Q&A

Answers to the questions judges usually ask us.

**Q: Is the data real or made up?**
A: Both, and we label which is which. Eight of the thirteen parameters are measured or
exactly derived, and you can reproduce them with `scripts/fetch_power.py` and
`scripts/fetch_dem.py` (no API key needed). Five are our estimates, and the app's detail
panel marks every row as measured, derived or estimated. `docs/PROVENANCE.md` lists all
thirteen individually.

**Q: Which ones are real?**
A: Mean temperature, temperature range, pressure, humidity and precipitation come from the
NASA POWER annual climatology. Elevation and slope come from a 30 m SRTM or ASTER DEM.
Daylight is computed exactly from latitude. Radiation, soil composition, dust activity,
isolation and aqueous geochemistry are our estimates.

**Q: I thought POWER was coarse. How do you handle Mauna Kea?**
A: It is, and this matters. POWER's grid puts Mauna Kea at 636 m when the summit is 4147 m,
so it reports +20.9 C for a mountain that is actually about -2 C. We correct temperature
with a 6.5 C/km lapse rate and pressure with the barometric formula, both from the grid
elevation to the true DEM elevation. Wherever that correction is doing a lot of work we
lower the site's resolution tier, which lowers its confidence and dashes its map marker.
Death Valley, Danakil, Teide and Etna are the other sites affected.

**Q: Why 13 parameters?**
A: They cover the axes that matter for a habitat: temperature (mean and swing), radiation,
slope, soil, pressure, daylight, precipitation, humidity, dust, isolation, elevation, and
aqueous geochemistry. The thirteenth (aqueous) was added after early feedback, because
sites like Rio Tinto are all about water chemistry.

**Q: What does the score mean?**
A: For each parameter, similarity = 1 minus the distance to the target divided by the
tolerance, clamped to 0..1. The score is 100 times the weighted sum of those similarities
divided by the sum of the weights, taken over the axes a site can actually score on. 100
would mean a perfect match on every weighted parameter; 0 means every parameter is at
least one tolerance band away. The best site scores about 49 for the Moon and about 65 for
Mars, so no Earth site is a full stand-in. We think that is the honest headline.

**Q: Why do radiation and pressure score 0 for every site?**
A: Because they should. Earth's atmosphere and magnetic field shield the surface, so no
ground site matches the Moon (380 uSv/day, LRO CRaTER) or Mars (210 uSv/day, Curiosity
RAD) dose rate, and no Earth site has Mars-thin air. We moved these out of the weighted
mean and report them separately as structural mismatch: averaging them in only scales
every score by the same constant, which hides the finding instead of showing it. The
validator prints exactly how much weight was set aside.

**Q: If you drop the impossible axes, aren't you hiding the problem?**
A: No, and it is worth being precise about the difference. Previously they stayed in the
denominator, which silently multiplied every score by about 0.83 and told you nothing. Now
the validator prints "Moon base: no site can score on temperature range, radiation,
daylight, 1.80 of 9.50 total weight (19%) is unreachable", and the app shows the same list
above the map. The number is more visible now, not less.

**Q: Your weights look arbitrary. Why should I trust the ranking?**
A: They are our judgement, and you should not take them on faith. So we tested it: we
perturbed all 13 weights randomly by up to +/-25%, recomputed, and repeated 5,000 times.
The winner never changed for Mars and held about 89% of the time for the Moon; at least
three of the top five survived 100% of the time under both profiles. The composition of
the top five is looser, so treat third versus fourth as a tie. The full table is in
`docs/VALIDATION.md`. You can also change every weight live in the app.

**Q: What is confidence?**
A: completeness times resolution tier times 100. It is separate from score on purpose: a
site can score well on the parameters we have and still be poorly resolved. The resolution
tier is now derived from measurement, not opinion: it comes from the gap between the POWER
grid elevation and the true DEM elevation, because our elevation correction is
approximate. Low-confidence sites get a dashed marker.

**Q: Can I change the model?**
A: Yes. Every target, tolerance and weight is in `src/data/config.json`, and the app has a
custom profile builder with presets (Lunar geology, Mars arid, Mars aqueous). Rankings
recompute as you move the sliders.

**Q: Does it work offline?**
A: The scoring is local JSON plus math, so yes. Only the map tiles need the network.

**Q: How was it built?**
A: Next.js 14 + TypeScript + Tailwind + Leaflet + Recharts, by a team of 2nd year CSE
students.

**Q: What are the known limits?**
A: Five parameters are still estimates, not measurements. The elevation correction is an
approximation rather than a downscaling model. POWER is grid smoothed, so precipitation is
the weakest measured parameter. There is no uncertainty propagation, so every score is a
point estimate. Planetary targets are global means, so south-pole lunar targets are future
work. And the retrieval scripts are one-shot rather than scheduled.
