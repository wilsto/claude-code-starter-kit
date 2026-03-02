#!/usr/bin/env node
// debug-warning.js — PostToolUse hook for Edit and Write tools
// PURPOSE: Warn when an edit introduces debug artifacts (console.log, print, debugger, etc.).
// BEHAVIOR: Advisory only — injects context as a reminder, never blocks.
// COMPLEMENTS: The /commit slop scan catches these at commit time; this hook catches them immediately.

const path = require('path');

// ============================================================
// DEBUG PATTERNS per language family
// Each pattern: regex to match, label for the warning message
// ============================================================
const DEBUG_PATTERNS = [
  // JavaScript / TypeScript
  { regex: /\bconsole\.log\s*\(/, label: 'console.log' },
  { regex: /\bconsole\.debug\s*\(/, label: 'console.debug' },
  { regex: /\bdebugger\b/, label: 'debugger statement' },

  // Python
  { regex: /\bprint\s*\(/, label: 'print()' },
  { regex: /\bbreakpoint\s*\(/, label: 'breakpoint()' },
  { regex: /\bpdb\.set_trace\s*\(/, label: 'pdb.set_trace()' },
  { regex: /\bipdb\.set_trace\s*\(/, label: 'ipdb.set_trace()' },

  // Go
  { regex: /\bfmt\.Println\s*\(/, label: 'fmt.Println' },
  { regex: /\bfmt\.Printf\s*\(/, label: 'fmt.Printf' },

  // Rust
  { regex: /\bdbg!\s*\(/, label: 'dbg! macro' },

  // Java
  { regex: /\bSystem\.out\.println\s*\(/, label: 'System.out.println' },
];

// Skip these file paths entirely
const EXCLUDED_PATTERNS = [
  '/tests/', '/test/', '/__tests__/', '.test.', '.spec.',
  '/scripts/', '/memory/', '/docs/', '/plans/',
  '.config.', 'setup.', 'jest.config', 'vitest.config',
  'conftest.py', 'fixtures',
];

// Skip these extensions
const EXCLUDED_EXTENSIONS = ['.md', '.json', '.yaml', '.yml', '.toml', '.txt', '.csv', '.env'];
// ============================================================

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input?.file_path || '').replace(/\\/g, '/');

    if (!filePath) {
      process.exit(0);
      return;
    }

    // Skip excluded paths
    if (EXCLUDED_PATTERNS.some((p) => filePath.includes(p))) {
      process.exit(0);
      return;
    }

    // Skip non-source extensions
    const ext = path.extname(filePath).toLowerCase();
    if (EXCLUDED_EXTENSIONS.includes(ext)) {
      process.exit(0);
      return;
    }

    // Get the new content introduced by the edit
    // Edit tool: new_string is what was added
    // Write tool: content is the full file (check entirely)
    const newContent = input.tool_input?.new_string || input.tool_input?.content || '';

    if (!newContent) {
      process.exit(0);
      return;
    }

    // Find all matching debug patterns
    const found = [];
    for (const pattern of DEBUG_PATTERNS) {
      if (pattern.regex.test(newContent)) {
        found.push(pattern.label);
      }
    }

    if (found.length > 0) {
      const fileName = path.basename(filePath);
      const artifacts = found.join(', ');
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext:
            `Debug artifact detected in ${fileName}: ${artifacts}. ` +
            'Remember to remove before commit.',
        },
      }));
    }

    process.exit(0);
  } catch (_) {
    // Non-blocking: never interrupt the workflow
    process.exit(0);
  }
});
