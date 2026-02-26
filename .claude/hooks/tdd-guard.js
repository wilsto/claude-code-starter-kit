#!/usr/bin/env node
// tdd-guard.js — PreToolUse hook for Edit and Write tools
// PURPOSE: Soft reminder to follow TDD when editing source files.
// BEHAVIOR: Outputs a message (shown in UI) but does NOT block the operation.
// CUSTOMIZE: Update SRC_DIRS and SOURCE_EXTENSIONS for your project layout.

// ============================================================
// CUSTOMIZE THESE ARRAYS for your project
// ============================================================
const SRC_DIRS = ['/src/', '/lib/', '/app/', 'src/', 'lib/', 'app/'];

const EXCLUDED_PATTERNS = [
  '/tests/', '/test/', '/__tests__/',
  '.test.', '.spec.',
  '.config.', 'setup.',
  '/docs/', '/scripts/', '/memory/',
];

const SOURCE_EXTENSIONS = ['.ts', '.js', '.py', '.go', '.rs', '.java', '.tsx', '.jsx'];
// ============================================================

const path = require('path');

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input?.file_path || '').replace(/\\/g, '/');

    const isSourceDir = SRC_DIRS.some((d) => filePath.includes(d));
    const isExcluded = EXCLUDED_PATTERNS.some((p) => filePath.includes(p));
    const hasSourceExt = SOURCE_EXTENSIONS.some((e) => filePath.endsWith(e));

    if (isSourceDir && !isExcluded && hasSourceExt) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          message: `TDD reminder: editing ${path.basename(filePath)} — have you written a failing test first? Use /tdd for the Red-Green-Refactor workflow.`,
        },
      }));
    }
    process.exit(0);
  } catch (e) {
    process.stderr.write(`tdd-guard hook error: ${e.message}\n`);
    process.exit(1);
  }
});
