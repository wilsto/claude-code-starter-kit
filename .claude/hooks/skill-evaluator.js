#!/usr/bin/env node
// skill-evaluator.js — PreToolUse hook for Bash
// PURPOSE: Detect when a raw command overlaps with an existing skill and
//          suggest using the skill instead.
// BEHAVIOR: Advisory only — message shown in UI, never blocks.
// CUSTOMIZE: Add entries to SKILL_TRIGGERS as you add skills.

const SKILL_TRIGGERS = [
  {
    pattern: /\bgit\s+commit\b/,
    skill: '/commit',
    message: 'Detected raw git commit. Consider using /commit for the quality-gated workflow (secret scan, slop scan, format, tests).',
  },
  {
    pattern: /\bgit\s+add\s+(-A|\.)\s*/,
    skill: '/commit',
    message: 'Detected git add -A or git add . — /commit stages files selectively and runs safety checks first.',
  },
  // CUSTOMIZE: Add more triggers here as you add skills.
  // Example:
  // {
  //   pattern: /\bnpm\s+test\b/,
  //   skill: '/tdd',
  //   message: 'Consider using /tdd for the full Red-Green-Refactor workflow.',
  // },
];

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const command = input.tool_input?.command || '';

    for (const trigger of SKILL_TRIGGERS) {
      if (trigger.pattern.test(command)) {
        process.stdout.write(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            message: `Skill suggestion: ${trigger.message}`,
          },
        }));
        break; // Only one suggestion per command
      }
    }
    process.exit(0);
  } catch (e) {
    process.stderr.write(`skill-evaluator hook error: ${e.message}\n`);
    process.exit(1);
  }
});
