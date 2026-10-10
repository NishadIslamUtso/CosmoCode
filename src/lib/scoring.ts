// src/lib/scoring.ts
//
// The whole scoring model. It is short on purpose: if you disagree with a
// number you should be able to read this file and change it.
//
//   similarity = 1 - |value - target| / tolerance      (clamped to 0..1)
//   score      = 100 * sum(weight * similarity) / sum(weight)
//   confidence = completeness * resolution tier * 100
//
// scripts/scoring.mjs is a plain-JS mirror of this file so that
// `npm run validate` can re-run the same maths in the terminal. Keep the
// two in sync if you change anything here.

import type {
  BreakdownRow,
  Parameter,
  ParameterKey,
  Profile,
  ScoredSite,
  Site,
  TargetOverride,
} from './types';

/** How close one value is to its target, on a 0..1 scale. */
export function similarity(value: number, target: number, tolerance: number): number {
  if (tolerance <= 0) return value === target ? 1 : 0;
  const s = 1 - Math.abs(value - target) / tolerance;
  return Math.max(0, Math.min(1, s));
}

/**
 * How much to trust a site, 0..100. This is deliberately separate from the
 * score: a site can rank well on the axes we have and still be poorly
 * measured, and the app says so instead of hiding it.
 */
export function confidence(site: Site): number {
  return Math.round(site.completeness * site.resolutionTier * 100);
}

/** Score one site against one profile, keeping every intermediate number. */
export function scoreSite(site: Site, profile: Profile, parameters: Parameter[]): ScoredSite {
  const breakdown: BreakdownRow[] = parameters.map((p) => {
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

/** Score every site, best first. Ties break alphabetically. */
export function scoreAll(sites: Site[], profile: Profile, parameters: Parameter[]): ScoredSite[] {
  return sites
    .map((s) => scoreSite(s, profile, parameters))
    .sort((a, b) => b.score - a.score || a.site.name.localeCompare(b.site.name));
}

/**
 * Copy a profile with new weights, and optionally with one or more targets or
 * tolerances moved. This is what the custom profile builder and the presets
 * are built on: the built-in profiles are never edited in place.
 */
export function applyOverrides(
  profile: Profile,
  weights: Record<ParameterKey, number>,
  overrides?: Partial<Record<ParameterKey, TargetOverride>>
): Profile {
  const targets = { ...profile.targets };
  for (const key of Object.keys(targets) as ParameterKey[]) {
    const base = targets[key];
    const o = overrides?.[key];
    targets[key] = {
      target: o?.target ?? base.target,
      tolerance: o?.tolerance ?? base.tolerance,
      weight: weights[key],
    };
  }
  return { ...profile, targets };
}

/** The weights of a profile, ready to hand to the builder sliders. */
export function weightsOf(profile: Profile): Record<ParameterKey, number> {
  const out = {} as Record<ParameterKey, number>;
  for (const key of Object.keys(profile.targets) as ParameterKey[]) {
    out[key] = profile.targets[key].weight;
  }
  return out;
}
