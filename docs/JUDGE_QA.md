# Judge Q&A

Answers to the questions judges usually ask us.

**Q: Is the data live?**
A: No, and we say so. Site values are curated sample data based on NASA datasets and papers, labeled per site with completeness and resolution tier. `scripts/fetch_analog_data.py` sketches the live pull, and `docs/PROVENANCE.md` documents every dataset.

**Q: Why 13 parameters?**
A: They cover the axes that matter for a habitat: temperature (mean and swing), radiation, slope, soil, pressure, daylight, precipitation, humidity, dust, isolation, elevation, and aqueous geochemistry. The 13th (aqueous) was added after early feedback, because sites like Rio Tinto are all about water chemistry.

**Q: What does the score mean?**
A: For each parameter, similarity = 1 - |value - target| / tolerance, clamped to 0..1. Score = 100 * sum(weight * similarity) / sum(weight). 100 means a perfect match on every weighted parameter; 0 means every parameter is at least one tolerance band away.

**Q: Why do radiation and pressure score 0 for every site?**
A: Because they should. Earth's atmosphere and magnetic field shield the surface, so no ground site matches the Moon (380 µSv/day, LRO CRaTER) or Mars (210 µSv/day, Curiosity RAD) radiation targets, and no Earth site has Mars-thin air (0.6 kPa). The app shows this honestly instead of hiding it.

**Q: What is confidence?**
A: completeness * resolution tier * 100. It is separate from score on purpose: a site can score well on the parameters we have and still be low-confidence if the data is sparse. Low-confidence sites get a dashed marker.

**Q: Can I change the model?**
A: Yes. Every target, tolerance and weight is in `src/data/config.json`, and the app has a custom profile builder with presets (Lunar geology, Mars arid, Mars aqueous). Rankings recompute live.

**Q: Does it work offline?**
A: The scoring is local JSON plus math, so yes. Only the map tiles need the network.

**Q: How was it built?**
A: Next.js 14 + TypeScript + Tailwind + Leaflet + Recharts, by a team of 2nd year CSE students, in one weekend.

**Q: What are the known limits?**
A: Curated sample data (not live ingestion), planetary targets are global means (south-pole Moon targets are future work), and the aqueous geochemistry values are first-version literature estimates.
