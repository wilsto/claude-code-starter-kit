#!/usr/bin/env node
// auto-format.js — PostToolUse hook for Edit and Write tools
// PURPOSE: Run the project's formatter automatically after each file edit.
// BEHAVIOR: Advisory only — injects context about formatting result, never blocks.
// CUSTOMIZE: Update FORMATTERS for your preferred tools per extension.

const { execSync } = require('child_process');
const path = require('path');

// ============================================================
// CUSTOMIZE THESE FORMATTERS for your project
// Each entry: extensions → [command candidates in priority order]
// The first command found on PATH will be used.
// ============================================================
const FORMATTERS = [
  {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md', '.yaml', '.yml'],
    commands: ['npx prettier --write'],
  },
  {
    extensions: ['.py'],
    commands: ['ruff format', 'black'],
  },
  {
    extensions: ['.go'],
    commands: ['gofmt -w'],
  },
  {
    extensions: ['.rs'],
    commands: ['rustfmt'],
  },
];

// Skip formatting for these paths
const EXCLUDED_PATTERNS = [
  '/node_modules/', '/.git/', '/dist/', '/build/', '/.next/',
  '/memory/', '/plans/', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
];
// ============================================================

function findFormatter(ext) {
  for (const entry of FORMATTERS) {
    if (entry.extensions.includes(ext)) {
      return entry.commands;
    }
  }
  return null;
}

function tryFormat(commands, filePath) {
  for (const cmd of commands) {
    try {
      execSync(`${cmd} "${filePath}"`, {
        encoding: 'utf8',
        timeout: 4000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return { success: true, command: cmd.split(' ')[0] };
    } catch (_) {
      // Command not found or failed — try next
      continue;
    }
  }
  return { success: false };
}

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

    const ext = path.extname(filePath).toLowerCase();
    const commands = findFormatter(ext);

    if (!commands) {
      process.exit(0);
      return;
    }

    const result = tryFormat(commands, filePath);

    if (result.success) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `Auto-formatted ${path.basename(filePath)} with ${result.command}.`,
        },
      }));
    }

    process.exit(0);
  } catch (_) {
    // Non-blocking: never interrupt the workflow
    process.exit(0);
  }
});
