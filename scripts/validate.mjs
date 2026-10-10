#!/usr/bin/env node
// Re-runs the CosmoCode scoring outside the browser and checks the rankings.
// Usage: npm run validate
import { loadData, scoreAll } from './scoring.mjs';

const { config, sites } = loadData();
const parameters = config.parameters;
const parameterKeys = parameters.map((p) => p.key);
const profileEntries = Object.entries(config.profiles);

let failures = 0;
function check(name, ok) {
  if (!ok) failures += 1;
  console.log(`  [${ok ? 'ok' : 'FAIL'}] ${name}`);
}

console.log('CosmoCode scoring validation');
console.log('============================');
console.log(`Sites: ${sites.length}`);
console.log(`Parameters: ${parameters.length}`);
console.log(`Profiles: ${profileEntries.map(([id]) => id).join(', ')}`);
console.log('');
console.log('Invariants:');
check('parameter count is 13', parameters.length === 13);
check('every site has a finite value for all 13 parameters', sites.every((s) => parameterKeys.every((k) => Number.isFinite(s.values[k]))));
for (const [id, profile] of profileEntries) {
  check(`${id}: defines all 13 parameters`, parameterKeys.every((k) => k in profile.targets) && Object.keys(profile.targets).length === 13);
  check(`${id}: targets finite, tolerances and weights positive`, parameterKeys.every((k) => {
    const t = profile.targets[k];
    return Number.isFinite(t.target) && t.tolerance > 0 && t.weight > 0;
  }));
}
check('all sites have completeness and resolution tier in range', sites.every((s) => s.completeness >= 0 && s.completeness <= 1 && s.resolutionTier > 0 && s.resolutionTier <= 1));
check('no placeholder photo fields remain in sites.json', sites.every((s) => s.imageUrl === undefined && s.imageCredit === undefined));
console.log('');

const results = {};
for (const [id, profile] of profileEntries) {
  const scored = scoreAll(sites, profile, parameters);
  results[id] = scored;
  check(`${id}: scored ${sites.length}/${sites.length} sites`, scored.length === sites.length);
  check(`${id}: scores within 0..100`, scored.every((s) => s.score >= 0 && s.score <= 100));
  check(`${id}: similarities within 0..1`, scored.every((s) => s.breakdown.every((b) => b.similarity >= 0 && b.similarity <= 1)));
  check(`${id}: confidence within 0..100`, scored.every((s) => s.confidence >= 0 && s.confidence <= 100));
  check(`${id}: ranking sorted descending`, scored.every((s, i) => i === 0 || scored[i - 1].score >= s.score));
  check(`${id}: score equals 100 * sum(weight * similarity) / sum(weight)`, scored.every((s) => {
    const w = s.breakdown.reduce((acc, b) => acc + b.weight, 0);
    const raw = s.breakdown.reduce((acc, b) => acc + b.contribution, 0);
    return Math.abs(s.score - (100 * raw) / w) < 1e-9;
  }));
}
console.log('');

function printTable(title, scored) {
  const n = Math.min(10, scored.length);
  console.log(`${title} (top ${n} of ${scored.length})`);
  console.log(`${'rank'.padStart(4)}  ${'site'.padEnd(24)}  ${'score'.padStart(5)}  ${'confidence'.padStart(10)}`);
  scored.slice(0, n).forEach((s, i) => {
    console.log(
      `${String(i + 1).padStart(4)}  ${s.site.name.padEnd(24)}  ${s.score.toFixed(1).padStart(5)}  ${String(s.confidence).padStart(10)}`
    );
  });
  console.log('');
}

for (const [id, profile] of profileEntries) {
  printTable(`${profile.name} profile`, results[id]);
}

for (const [id, profile] of profileEntries) {
  const zeros = parameters
    .filter((p) => results[id].every((s) => s.breakdown.find((b) => b.key === p.key).similarity === 0))
    .map((p) => p.key);
  console.log(`${profile.name}: parameters where every site scores 0 similarity: ${zeros.length > 0 ? zeros.join(', ') : 'none'}`);
}
console.log('(expected: radiation everywhere, since Earth shields the surface; plus tempRange for the Moon,');
console.log(' since no Earth site reproduces the 250 C lunar day/night swing, and pressure for Mars,');
console.log(' since no Earth site has 0.6 kPa air)');
console.log('');

if (failures > 0) {
  console.log(`FAILED: ${failures} check(s) did not pass.`);
  process.exit(1);
}
console.log(`PASSED: all checks passed (${sites.length} sites, ${parameters.length} parameters, ${profileEntries.length} profiles).`);
