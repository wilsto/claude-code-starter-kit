#!/usr/bin/env node
// block-secrets.js — PreToolUse hook for Edit and Write tools
// PURPOSE: Hard-blocks writing to files that should never be committed.
// BEHAVIOR: Returns permissionDecision:"deny" — the operation is cancelled.
// CUSTOMIZE: Add project-specific secret file names to BLOCKED_PATHS below.

// ============================================================
// CUSTOMIZE THIS ARRAY for your project
// ============================================================
const BLOCKED_PATHS = [
  'secrets.yaml',
  'secrets.json',
  'config.json',
  '.claude.json',
];
// ============================================================

const path = require('path');

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = input.tool_input?.file_path || '';
    const basename = path.basename(filePath);

    const isBlocked =
      BLOCKED_PATHS.some((s) => basename === s) ||
      basename.startsWith('.env');

    if (isBlocked) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `Blocked: ${basename} is a protected secret file. Edit manually if needed.`,
        },
      }));
    }
    process.exit(0);
  } catch (e) {
    process.stderr.write(`block-secrets hook error: ${e.message}\n`);
    process.exit(1);
  }
});
