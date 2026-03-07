#!/usr/bin/env node
// loop-suggest.js — PostToolUse hook for Bash
// PURPOSE: After a successful git push, suggest using /loop ci-watch to monitor CI.
// BEHAVIOR: Advisory only — never blocks. Matches pattern of all other hooks.

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data || '{}');
    const command = input.tool_input?.command || '';
    const output = input.output || '';

    // Only fire after git push commands
    if (!/git push/.test(command)) process.exit(0);

    // Only fire if push succeeded (no error keywords)
    if (/error:|fatal:|rejected|denied/.test(output.toLowerCase())) process.exit(0);

    // Only fire if push actually sent commits (not "Everything up-to-date")
    if (/everything up-to-date/i.test(output)) process.exit(0);

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          'Push succeeded. If CI is configured, monitor it with: /loop 2m ci-watch  (advisory — Ctrl+C to stop)',
      },
    }));
  } catch {
    // Silent fail — hook errors should never block the user
  }
  process.exit(0);
});
