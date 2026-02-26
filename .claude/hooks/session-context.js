#!/usr/bin/env node
// session-context.js — SessionStart hook (startup + compact)
// PURPOSE: Re-inject project memory and session handoff at the start of every
//          session and after /compact (prevents context amnesia).
// CUSTOMIZE: Only if you move the memory/ directory to a different location.

const fs = require('fs');
const path = require('path');

// __dirname = .claude/hooks/ → go up twice to reach project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MEMORY_FILE = path.join(PROJECT_ROOT, 'memory', 'MEMORY.md');
const CACHE_FILE = path.join(PROJECT_ROOT, 'memory', 'session-cache.json');

const lines = [];

// --- Inject Session Notes from MEMORY.md ---
try {
  if (fs.existsSync(MEMORY_FILE)) {
    const content = fs.readFileSync(MEMORY_FILE, 'utf8');
    const match = content.match(/## Session Notes[\s\S]*?(?=\n## |$)/);
    if (match) {
      const notes = match[0]
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.trim())
        .join('\n');
      if (notes) {
        lines.push(`Recent session notes:\n${notes}`);
      }
    }
  }
} catch (_) { /* non-blocking */ }

// --- Inject Session Handoff from cache ---
try {
  if (fs.existsSync(CACHE_FILE)) {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (cache.lastSession) {
      const s = cache.lastSession;
      const parts = [];
      if (s.done)      parts.push(`Done: ${s.done}`);
      if (s.decisions) parts.push(`Decisions: ${s.decisions}`);
      if (s.next)      parts.push(`Next: ${s.next}`);
      if (s.gotchas)   parts.push(`Gotchas: ${s.gotchas}`);
      if (parts.length > 0) {
        lines.push(`Last session handoff:\n${parts.map((p) => `  - ${p}`).join('\n')}`);
      }
    }
  }
} catch (_) { /* non-blocking */ }

if (lines.length === 0) {
  process.exit(0);
}

try {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: lines.join('\n\n'),
    },
  }));
} catch (_) { /* silent */ }
process.exit(0);
