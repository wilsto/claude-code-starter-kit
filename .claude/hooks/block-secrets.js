#!/usr/bin/env node
// block-secrets.js — PreToolUse hook for Edit and Write tools
// PURPOSE: Prompts for confirmation before writing to sensitive files.
// BEHAVIOR: Returns permissionDecision:"ask" — the user is asked to confirm.
// CUSTOMIZE: Add project-specific secret file names to SENSITIVE_PATHS below.

// ============================================================
// CUSTOMIZE THIS ARRAY for your project
// ============================================================
const SENSITIVE_PATHS = [
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

    const isSensitive =
      SENSITIVE_PATHS.some((s) => basename === s) ||
      basename.startsWith('.env');

    if (isSensitive) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason: `${basename} is a sensitive file. Please confirm this edit.`,
        },
      }));
    }
    process.exit(0);
  } catch (e) {
    process.stderr.write(`block-secrets hook error: ${e.message}\n`);
    process.exit(1);
  }
});
