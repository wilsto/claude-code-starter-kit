#!/usr/bin/env node
// ux-guard.js — PreToolUse hook for Edit and Write tools
// PURPOSE: Advisory reminder to run /ux workflow before editing UI files.
// BEHAVIOR: Outputs a message (shown in UI) but does NOT block the operation.
// TRIGGERS: .tsx/.jsx files in app/ or components/ directories
// SILENT ON: test files, shadcn ui/ primitives, Next.js convention files, hooks, lib, types

const path = require('path');

const UI_DIRS = ['/app/', '/components/', '/pages/', 'app/', 'components/', 'pages/'];

const EXCLUDED_PATTERNS = [
  '/ui/',           // shadcn primitives — never guard generated components
  '.test.', '.spec.',
  '/stories.',
  'layout.tsx',     // Next.js convention files
  'loading.tsx',
  'error.tsx',
  'not-found.tsx',
  '/hooks/',
  '/lib/',
  '/types/',
  '/memory/',
  '/docs/',
];

const UI_EXTENSIONS = ['.tsx', '.jsx'];

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input?.file_path || '').replace(/\\/g, '/');

    const isUiDir = UI_DIRS.some((d) => filePath.includes(d));
    const isUiExt = UI_EXTENSIONS.some((e) => filePath.endsWith(e));
    const isExcluded = EXCLUDED_PATTERNS.some((p) => filePath.includes(p));

    if (isUiDir && isUiExt && !isExcluded) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          message: `UX reminder: editing ${path.basename(filePath)} — did you run /ux first? The 3-phase workflow (clarify → wireframe → implement) prevents rebuilding the wrong UI.`,
        },
      }));
    }

    process.exit(0);
  } catch (e) {
    process.stderr.write(`ux-guard hook error: ${e.message}\n`);
    process.exit(1);
  }
});
