import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Team CosmoCode, 2nd year CSE, NASA Space Apps 2026.</p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded border border-border px-2 py-1 text-xs">Light mode</span>
          <span className="rounded border border-border px-2 py-1 text-xs">
            Curated sample dataset
          </span>
          <Link href="/docs/VALIDATION.md" className="text-accent hover:underline">
            Validation
          </Link>
          <Link href="/docs/PROVENANCE.md" className="text-accent hover:underline">
            Provenance
          </Link>
        </div>
      </div>
    </footer>
  );
}
