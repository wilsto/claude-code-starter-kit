#!/usr/bin/env node
// post-commit-lessons.js — PostToolUse hook for Bash
// PURPOSE: After a successful git commit, remind Claude to evaluate if lessons
//          should be saved to memory/MEMORY.md or memory/patterns.md.
// BEHAVIOR: Advisory only — injects context, never blocks.

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const command = input.tool_input?.command || '';

    // Detect git commit commands (not amend-only edits)
    if (!/\bgit\s+commit\b/.test(command)) {
      process.exit(0);
      return;
    }

    // Only trigger if the commit succeeded
    const exitCode = input.tool_result?.exitCode ?? input.tool_result?.exit_code ?? null;
    if (exitCode !== 0 && exitCode !== null) {
      process.exit(0);
      return;
    }

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: [
          'POST-COMMIT CHECKPOINT: A commit just succeeded.',
          'Quickly evaluate:',
          '1. Did this commit reveal a non-obvious lesson, platform quirk, or debugging pattern?',
          '2. Was a key technical decision made that should be recorded in memory/MEMORY.md?',
          'If yes: update memory/MEMORY.md or memory/patterns.md now.',
          'If nothing notable: continue without interruption.',
        ].join('\n'),
      },
    }));
    process.exit(0);
  } catch (_) {
    // Non-blocking: never interrupt the workflow
    process.exit(0);
  }
});
