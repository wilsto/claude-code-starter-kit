#!/usr/bin/env node
// session-context.js — SessionStart hook (startup + compact)
// PURPOSE: Re-inject project memory and session handoff at the start of every
//          session and after /compact (prevents context amnesia).
// CUSTOMIZE: Only if you move the memory/ directory to a different location.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// __dirname = .claude/hooks/ → go up twice to reach project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MEMORY_FILE = path.join(PROJECT_ROOT, 'memory', 'MEMORY.md');
const CACHE_FILE = path.join(PROJECT_ROOT, 'memory', 'session-cache.json');

const lines = [];

// --- Inject Environment Context (~40 tokens) ---
try {
  const parts = [];
  parts.push(`Working directory: ${PROJECT_ROOT}`);

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8', timeout: 3000, cwd: PROJECT_ROOT,
    }).trim();
    parts.push(`Branch: ${branch}`);
  } catch (_) { /* not a git repo */ }

  try {
    const status = execSync('git status --porcelain', {
      encoding: 'utf8', timeout: 3000, cwd: PROJECT_ROOT,
    }).trim();
    if (status) {
      const sl = status.split('\n');
      const modified = sl.filter((l) => /^ ?M/.test(l)).length;
      const untracked = sl.filter((l) => l.startsWith('??')).length;
      parts.push(`Git: ${modified} modified, ${untracked} untracked`);
    } else {
      parts.push('Git: clean');
    }
  } catch (_) { /* silent */ }

  try {
    const indicators = [
      { files: ['pyproject.toml', 'requirements.txt', 'setup.py'], stack: 'Python' },
      { files: ['next.config.ts', 'next.config.mjs', 'next.config.js'], stack: 'Next.js' },
      { files: ['go.mod'], stack: 'Go' },
      { files: ['Cargo.toml'], stack: 'Rust' },
      { files: ['package.json'], stack: 'Node.js' },
    ];
    const detected = indicators
      .filter((i) => i.files.some((f) => fs.existsSync(path.join(PROJECT_ROOT, f))))
      .map((i) => i.stack);
    if (detected.length) parts.push(`Stack(s): ${detected.join(', ')}`);
  } catch (_) { /* silent */ }

  if (parts.length) {
    lines.push(`Environment:\n${parts.map((p) => `  - ${p}`).join('\n')}`);
  }
} catch (_) { /* non-blocking */ }

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

// --- Inject Polaris / North Star (~100 tokens) ---
const POLARIS_FILE = path.join(PROJECT_ROOT, 'memory', 'polaris.md');
try {
  if (fs.existsSync(POLARIS_FILE)) {
    const raw = fs.readFileSync(POLARIS_FILE, 'utf8');
    const sections = [];
    const tomMatch = raw.match(/## Top of Mind\n([\s\S]*?)(?=\n## |$)/);
    if (tomMatch) {
      const content = tomMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
      if (content) sections.push(`Top of mind: ${content}`);
    }
    const goalsMatch = raw.match(/## Goals & Direction\n([\s\S]*?)(?=\n## |$)/);
    if (goalsMatch) {
      const content = goalsMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
      if (content) sections.push(`Goals: ${content}`);
    }
    const valuesMatch = raw.match(/## Values & Principles\n([\s\S]*?)(?=\n## |$)/);
    if (valuesMatch) {
      const content = valuesMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
      if (content) sections.push(`Values: ${content}`);
    }
    if (sections.length) {
      lines.push(`Polaris (north star):\n${sections.join('\n')}`);
    }
  }
} catch (_) { /* non-blocking */ }

// --- Inject Active Context (truncated: focus + next steps only, ~150 tokens) ---
const ACTIVE_CONTEXT_FILE = path.join(PROJECT_ROOT, 'memory', 'active-context.md');
try {
  if (fs.existsSync(ACTIVE_CONTEXT_FILE)) {
    const raw = fs.readFileSync(ACTIVE_CONTEXT_FILE, 'utf8');
    const sections = [];
    const focusMatch = raw.match(/## Current Focus\n([\s\S]*?)(?=\n## |$)/);
    if (focusMatch) {
      const content = focusMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
      if (content) sections.push(`Focus: ${content}`);
    }
    const nextMatch = raw.match(/## Immediate Next Steps\n([\s\S]*?)(?=\n## |$)/);
    if (nextMatch) {
      const content = nextMatch[1].replace(/<!--[\s\S]*?-->/g, '').trim();
      if (content) sections.push(`Next: ${content}`);
    }
    if (sections.length) {
      lines.push(`Active context:\n${sections.join('\n')}`);
    }
  }
} catch (_) { /* non-blocking */ }

// --- Inject Scratchpad (last 30 lines, survives /compact, ~500 tokens max) ---
const MAX_SCRATCHPAD_LINES = 30;
const SCRATCHPAD_FILE = path.join(PROJECT_ROOT, 'memory', 'scratchpad.md');
try {
  if (fs.existsSync(SCRATCHPAD_FILE)) {
    const raw = fs.readFileSync(SCRATCHPAD_FILE, 'utf8').trim();
    // Strip HTML comments, then split into lines
    const cleaned = raw.replace(/<!--[\s\S]*?-->/g, '');
    const allLines = cleaned.split('\n');
    // Skip header lines (# and > lines) and empty lines
    const contentLines = allLines.filter((l) => !l.startsWith('#') && !l.startsWith('>'));
    const meaningful = contentLines.filter((l) => l.trim().length > 0);
    if (meaningful.length > 0) {
      const tail = meaningful.slice(-MAX_SCRATCHPAD_LINES).join('\n');
      const count = Math.min(meaningful.length, MAX_SCRATCHPAD_LINES);
      lines.push(`Scratchpad (last ${count} entries):\n${tail}`);
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
