// Serves the markdown in docs/ as plain text.
//
// The public address is /docs/<file>, for example /docs/VALIDATION.md. A
// rewrite in next.config.mjs maps that here, so the pretty address stays
// stable while this file lives in a plain folder with no square brackets
// in its name. (Next.js catch-all folders need brackets, and some hosting
// and upload tools handle those poorly.)
//
// The file is read from disk at request time, so a serverless host only
// ships what it is told to trace. next.config.mjs lists docs/*.md in
// outputFileTracingIncludes for exactly that reason: without it the links
// work locally and 404 once deployed.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set([
  'PROVENANCE.md',
  'VALIDATION.md',
  'STORYBOARD.md',
  'JUDGING_MAPPING.md',
  'JUDGE_QA.md',
  'ONE_PAGER.md',
  'DEMO_SCRIPT.md',
]);

export async function GET(request: Request) {
  // src/middleware.ts sets x-doc-name when it rewrites /docs/<file> here.
  // The query string still works, so /api/docs?name=VALIDATION.md is valid too.
  const requested =
    request.headers.get('x-doc-name') ??
    new URL(request.url).searchParams.get('name') ??
    '';

  // Path traversal guard: strip any directory part, then allowlist the name.
  const name = path.basename(requested);
  if (!ALLOWED.has(name)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const text = await readFile(path.join(process.cwd(), 'docs', name), 'utf8');
    return new NextResponse(text, {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
