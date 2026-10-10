// Plain-JS mirror of src/lib/scoring.ts. Keep the two in sync.
// scripts/validate.mjs runs this file so the scoring can be checked
// outside the browser without a TypeScript toolchain.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadData() {
  const config = JSON.parse(readFileSync(join(root, 'src/data/config.json'), 'utf8'));
  const sites = JSON.parse(readFileSync(join(root, 'src/data/sites.json'), 'utf8'));
  return { config, sites };
}

/** similarity = 1 - |value - target| / tolerance, clamped to 0..1 */
export function similarity(value, target, tolerance) {
  if (tolerance <= 0) return value === target ? 1 : 0;
  const s = 1 - Math.abs(value - target) / tolerance;
  return Math.max(0, Math.min(1, s));
}

/** confidence = completeness * resolution tier * 100 */
export function confidence(site) {
  return Math.round(site.completeness * site.resolutionTier * 100);
}

export function scoreSite(site, profile, parameters) {
  const breakdown = parameters.map((p) => {
    const t = profile.targets[p.key];
    const value = site.values[p.key];
    const sim = similarity(value, t.target, t.tolerance);
    return {
      key: p.key,
      label: p.label,
      unit: p.unit,
      value,
      target: t.target,
      tolerance: t.tolerance,
      weight: t.weight,
      similarity: sim,
      contribution: t.weight * sim,
    };
  });
  const weightSum = breakdown.reduce((acc, b) => acc + b.weight, 0);
  const raw = breakdown.reduce((acc, b) => acc + b.contribution, 0);
  const score = weightSum > 0 ? (100 * raw) / weightSum : 0;
  return { site, score, confidence: confidence(site), breakdown };
}

export function scoreAll(sites, profile, parameters) {
  return sites
    .map((s) => scoreSite(s, profile, parameters))
    .sort((a, b) => b.score - a.score || a.site.name.localeCompare(b.site.name));
}
