// The documents served at /docs/<file>. This is the single list used by the
// docs index page and by the route handler that serves them, so adding a file
// to docs/ means adding one entry here.

export interface DocEntry {
  file: string;
  title: string;
  description: string;
}

export const DOCS: DocEntry[] = [
  {
    file: 'METHODOLOGY.md',
    title: 'Methodology',
    description:
      'The scoring model: similarity, weighting, structural mismatch, confidence, profiles, assumptions and limitations.',
  },
  {
    file: 'PROVENANCE.md',
    title: 'Data provenance',
    description:
      'Where every number comes from, which values are measured, derived or estimated, and how to regenerate them.',
  },
  {
    file: 'VALIDATION.md',
    title: 'Validation',
    description:
      'What the automated checks verify, their latest output, and how sensitive the ranking is to the weights.',
  },
  {
    file: 'DATA_DICTIONARY.md',
    title: 'Data dictionary',
    description:
      'Every field in sites.json and config.json: what it means, its unit, and where it comes from.',
  },
  {
    file: 'FAQ.md',
    title: 'FAQ',
    description:
      'Common questions about the score, the profiles, the estimates and how to reproduce the data.',
  },
];

export function docTitle(file: string): string | null {
  return DOCS.find((d) => d.file === file)?.title ?? null;
}
