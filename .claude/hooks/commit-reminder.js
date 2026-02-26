#!/usr/bin/env node
// commit-reminder.js — PostToolUse hook for Bash
// PURPOSE: After a successful test run with uncommitted changes, gently suggest
//          committing if this is a natural breakpoint.
// BEHAVIOR: Advisory only — Claude decides whether to propose /commit based on
//           CLAUDE.md "Commit Rhythm" instructions.

const { execSync } = require('child_process');

// Common test command patterns
const TEST_PATTERNS = [
  /\bnpx\s+(vitest|jest)\b/,
  /\bpytest\b/,
  /\bgo\s+test\b/,
  /\bcargo\s+test\b/,
  /\bn(?:pm|pnpm|yarn|bun)\s+(?:run\s+)?test\b/,
  /\bmake\s+test\b/,
  /\bdotnet\s+test\b/,
  /\bmvn\s+test\b/,
  /\bgradle\s+test\b/,
];

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const command = input.tool_input?.command || '';

    // Only trigger on test commands
    if (!TEST_PATTERNS.some((p) => p.test(command))) {
      process.exit(0);
      return;
    }

    // Only trigger if tests passed (exit code 0)
    const exitCode = input.tool_result?.exitCode ?? input.tool_result?.exit_code ?? null;
    if (exitCode !== 0) {
      process.exit(0);
      return;
    }

    // Check if there are uncommitted changes
    let hasChanges = false;
    try {
      const status = execSync('git status --porcelain', {
        encoding: 'utf8',
        timeout: 3000,
      });
      hasChanges = status.trim().length > 0;
    } catch (_) {
      process.exit(0);
      return;
    }

    if (!hasChanges) {
      process.exit(0);
      return;
    }

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          'Tests passed with uncommitted changes. ' +
          'Consider suggesting /commit if this is a natural breakpoint ' +
          '(TDD GREEN, refactor complete, or logical unit done).',
      },
    }));
    process.exit(0);
  } catch (_) {
    // Non-blocking: never interrupt the workflow
    process.exit(0);
  }
});
