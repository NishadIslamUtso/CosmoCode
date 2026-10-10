import Link from 'next/link';

const DOCS = [
  'PROVENANCE.md',
  'VALIDATION.md',
  'STORYBOARD.md',
  'JUDGING_MAPPING.md',
  'JUDGE_QA.md',
  'ONE_PAGER.md',
  'DEMO_SCRIPT.md',
];

export default function DocsIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Docs</h1>
      <p className="mt-2 text-muted">
        Raw markdown. The same files live in the repo under <code>docs/</code>.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-6">
        {DOCS.map((d) => (
          <li key={d}>
            <Link href={`/docs/${d}`} className="text-accent hover:underline">
              {d}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
