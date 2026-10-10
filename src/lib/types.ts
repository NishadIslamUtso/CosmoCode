// src/lib/types.ts
//
// Shared shapes for the CosmoCode Earth Analog Finder.

/** The 13 parameter keys, in display order. */
export type ParameterKey =
  | 'temperature'
  | 'tempRange'
  | 'radiation'
  | 'slope'
  | 'soil'
  | 'pressure'
  | 'daylight'
  | 'precipitation'
  | 'humidity'
  | 'dust'
  | 'isolation'
  | 'elevation'
  | 'aqueous';

/** One Earth analog site. */
export interface Site {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  values: Record<ParameterKey, number>;
  /** 0..1. How much of the site's data we actually have. */
  completeness: number;
  /** 0.5 coarse, 0.75 regional, 1.0 site-scale measurement. */
  resolutionTier: number;
  /** Keys into Config.sources. */
  sources: string[];

  // Site photos. Both fields are optional and the UI checks for them.
  //
  // They are empty today on purpose. The first version filled them with
  // random landscape placeholders, which showed scenery that is not the
  // real sites, which is worse than no photo for a science demo.
  // photos removed - placeholders showed wrong landscapes; real NASA/Wikimedia photos with attribution go back here
  imageUrl?: string;
  imageCredit?: string;
}

/** One measured axis, for example mean temperature in degrees Celsius. */
export interface Parameter {
  key: ParameterKey;
  label: string;
  unit: string;
  description: string;
}

/** What a profile wants on one axis, and how much that axis counts. */
export interface Target {
  target: number;
  tolerance: number;
  weight: number;
}

/** A scoring profile: Moon base, Mars base, or one you build yourself. */
export interface Profile {
  id: string;
  name: string;
  description: string;
  targets: Record<ParameterKey, Target>;
}

/** A partial change to one target or tolerance. */
export interface TargetOverride {
  target?: number;
  tolerance?: number;
}

/** A starting point for the custom profile builder. */
export interface Preset {
  id: string;
  name: string;
  description: string;
  weights: Record<ParameterKey, number>;
  /** Some presets move a target as well as the weights. */
  targets?: Partial<Record<ParameterKey, TargetOverride>>;
}

/** The contents of src/data/config.json. */
export interface Config {
  parameters: Parameter[];
  profiles: Record<string, Profile>;
  presets: Preset[];
  sources: Record<string, string>;
}

/** One row of the per-parameter breakdown shown in the detail panel. */
export interface BreakdownRow {
  key: ParameterKey;
  label: string;
  unit: string;
  value: number;
  target: number;
  tolerance: number;
  weight: number;
  similarity: number;
  contribution: number;
}

/** A site after scoring: the number, the confidence, and the working. */
export interface ScoredSite {
  site: Site;
  score: number;
  confidence: number;
  breakdown: BreakdownRow[];
}
