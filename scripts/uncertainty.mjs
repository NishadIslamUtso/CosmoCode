// Monte Carlo score ranges, plain-JS mirror of src/lib/scoring.ts scoreRange.
// Usage: npm run uncertainty
import {
  loadData,
  structuralMismatch,
  similarity,
} from './scoring.mjs';

// mulberry32: same seeded generator the app uses, so the two agree.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scoreRange(site, profile, parameters, structural, trials = 400, seed = 20261105) {
  const rand = mulberry32(seed);
  const blocked = new Set(structural.keys);
  const scores = [];

  for (let i = 0; i < trials; i += 1) {
    const targets = {};
    for (const p of parameters) {
      const t = profile.targets[p.key];
      targets[p.key] = {
        target: t.target,
        tolerance: t.tolerance * (0.9 + 0.2 * rand()),
        weight: t.weight * (0.9 + 0.2 * rand()),
      };
    }
    const rows = parameters.map((p) => {
      const t = targets[p.key];
      const sim = similarity(site.values[p.key], t.target, t.tolerance);
      return { key: p.key, weight: t.weight, contribution: t.weight * sim };
    });
    const usable = rows.filter((r) => !blocked.has(r.key));
    const weightSum = usable.reduce((acc, r) => acc + r.weight, 0);
    const raw = usable.reduce((acc, r) => acc + r.contribution, 0);
    scores.push(weightSum > 0 ? (100 * raw) / weightSum : 0);
  }

  scores.sort((a, b) => a - b);
  const quantile = (q) => scores[Math.min(scores.length - 1, Math.floor(q * scores.length))];
  const round = (v) => Math.round(v * 10) / 10;
  return { low: round(quantile(0.05)), mid: round(quantile(0.5)), high: round(quantile(0.95)) };
}

const { config, sites } = loadData();
const parameters = config.parameters;

for (const [id, profile] of Object.entries(config.profiles)) {
  const structural = structuralMismatch(sites, profile, parameters);
  const ranked = sites
    .map((s) => ({ site: s, range: scoreRange(s, profile, parameters, structural) }))
    .sort((a, b) => b.range.mid - a.range.mid);

  console.log(`\n${profile.name}: Monte Carlo score range (5th-95th percentile)`);
  console.log(`${'site'.padEnd(26)}  ${'low'.padStart(6)}  ${'mid'.padStart(6)}  ${'high'.padStart(6)}`);
  for (const r of ranked.slice(0, 10)) {
    console.log(
      `${r.site.name.padEnd(26)}  ${r.range.low.toFixed(1).padStart(6)}  ${r.range.mid.toFixed(1).padStart(6)}  ${r.range.high.toFixed(1).padStart(6)}`
    );
  }
}
