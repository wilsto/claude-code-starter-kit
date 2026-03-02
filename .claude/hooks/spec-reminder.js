#!/usr/bin/env node
// spec-reminder.js — PreToolUse hook for Edit and Write tools
// PURPOSE: Advisory reminder to read the functional spec before editing source files.
// BEHAVIOR: Outputs a message (shown in UI) but does NOT block the operation.
// LOGIC: Discovers specs dynamically from docs/specs/*.md — no project-specific config needed.

const path = require('path');
const fs = require('fs');

// ============================================================
// CUSTOMIZE THESE ARRAYS for your project (same as tdd-guard.js)
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

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    if (!input || typeof input !== 'object' || !input.tool_input) {
      process.exit(0);
      return;
    }
    const filePath = (input.tool_input.file_path || '').replace(/\\/g, '/');

    const isSourceDir = SRC_DIRS.some((d) => filePath.includes(d));
    const isExcluded = EXCLUDED_PATTERNS.some((p) => filePath.includes(p));
    const hasSourceExt = SOURCE_EXTENSIONS.some((e) => filePath.endsWith(e));

    if (!isSourceDir || isExcluded || !hasSourceExt) {
      process.exit(0);
      return;
    }

    // Walk up from edited file to find docs/specs/ directory
    // Normalize to forward slashes after path.dirname for Windows compatibility
    let dir = path.dirname(filePath).replace(/\\/g, '/');
    let specsDir = null;
    const MAX_DEPTH = 8;

    for (let i = 0; i < MAX_DEPTH; i++) {
      const candidate = path.join(dir, 'docs', 'specs').replace(/\\/g, '/');
      if (fs.existsSync(candidate)) {
        specsDir = candidate;
        break;
      }
      const parent = path.dirname(dir).replace(/\\/g, '/');
      if (parent === dir) break;
      dir = parent;
    }

    // No docs/specs/ directory — project hasn't adopted SDD, stay silent
    if (!specsDir) {
      process.exit(0);
      return;
    }

    // Read spec filenames as lowercase stems
    let specStems = [];
    try {
      specStems = fs.readdirSync(specsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.basename(f, '.md').toLowerCase());
    } catch (_) {
      process.exit(0);
      return;
    }

    if (specStems.length === 0) {
      process.exit(0);
      return;
    }

    // Match edited file path segments against known spec stems
    const segments = filePath.toLowerCase().split('/');
    const matchedStem = specStems.find((stem) =>
      segments.some((seg) =>
        seg === stem ||
        seg.startsWith(stem + '.') ||
        seg.startsWith(stem + '_') ||
        seg.startsWith(stem + '-')
      )
    );

    const fileName = path.basename(filePath);

    if (matchedStem) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          message: `SDD reminder: spec found for this domain — read docs/specs/${matchedStem}.md before editing ${fileName}. Check behavior alignment with /tdd Step 0.`,
        },
      }));
    } else {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          message: `SDD reminder: no spec found for the domain of ${fileName}. If this is a new feature, consider running /spec-update first.`,
        },
      }));
    }

    process.exit(0);
  } catch (e) {
    process.stderr.write(`spec-reminder hook error: ${e.message}\n`);
    process.exit(0);
  }
});
