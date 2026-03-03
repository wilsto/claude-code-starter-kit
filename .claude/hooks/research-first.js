#!/usr/bin/env node
// research-first.js — PreToolUse (Bash, Agent) + PostToolUse (Bash)
// PURPOSE: Remind Claude to check official docs, forums, and community resources
//          before acting in situations prone to hallucination.
// BEHAVIOR: Advisory only — injects additionalContext, never blocks.
// SITUATIONS:
//   1. PreToolUse Bash: package install commands → check docs first
//   2. PreToolUse Agent: Plan subagent → research before designing
//   3. PostToolUse Bash: 2+ consecutive errors → stop looping, search first

const fs = require('fs');
const path = require('path');
const os = require('os');

// --- CUSTOMIZABLE ---

const INSTALL_PATTERNS = [
  { pattern: /\bnpm\s+install\b/, extractor: /\bnpm\s+install\s+(?:--save[-\w]*\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\byarn\s+add\b/, extractor: /\byarn\s+add\s+(?:--[\w-]+\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\bpnpm\s+add\b/, extractor: /\bpnpm\s+add\s+(?:--[\w-]+\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\bbun\s+add\b/, extractor: /\bbun\s+add\s+(?:--[\w-]+\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\buv\s+pip\s+install\b/, extractor: /\buv\s+pip\s+install\s+(?:--[\w-]+\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\bpip\s+install\b/, extractor: /\bpip\s+install\s+(?:--[\w-]+\s+)*([^\s-][\w@/.:-]*)/ },
  { pattern: /\bcargo\s+add\b/, extractor: /\bcargo\s+add\s+([^\s-][\w@/.:-]*)/ },
  { pattern: /\bgo\s+get\b/, extractor: /\bgo\s+get\s+([^\s-][\w@/.:-]*)/ },
  { pattern: /\bdotnet\s+add\s+package\b/, extractor: /\bdotnet\s+add\s+package\s+([^\s-][\w@/.:-]*)/ },
];

const ERROR_THRESHOLD = 2;

// --- HELPERS ---

function getStateFilePath(sessionId) {
  const tmpDir = os.tmpdir();
  const safeId = (sessionId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(tmpDir, `claude-research-${safeId}.json`);
}

function readState(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return { consecutiveErrors: 0, lastErrorSnippet: '' };
  }
}

function writeState(filePath, state) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(state), 'utf8');
  } catch (_) {
    // Non-critical — state tracking is best-effort
  }
}

function output(eventName, context) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: context,
    },
  }));
}

// --- MAIN ---

let data = '';
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const event = input.hook_event_name;
    const toolName = input.tool_name || '';

    // ---- PreToolUse: Bash (package install) ----
    if (event === 'PreToolUse' && toolName === 'Bash') {
      const command = input.tool_input?.command || '';

      for (const { pattern, extractor } of INSTALL_PATTERNS) {
        if (pattern.test(command)) {
          const match = command.match(extractor);
          const pkg = match ? match[1] : 'unknown package';
          output('PreToolUse',
            `RESEARCH FIRST: You are about to install "${pkg}". ` +
            'Before proceeding: ' +
            '1) Use context7 (resolve-library-id → query-docs) for official documentation. ' +
            '2) WebSearch for breaking changes, known issues, and recommended version. ' +
            '3) Check if the package is still actively maintained.'
          );
          break;
        }
      }
      process.exit(0);
      return;
    }

    // ---- PreToolUse: Agent (Plan mode) ----
    if (event === 'PreToolUse' && toolName === 'Agent') {
      const subagentType = input.tool_input?.subagent_type || '';
      if (subagentType === 'Plan') {
        output('PreToolUse',
          'RESEARCH FIRST: You are entering plan mode. ' +
          'Before proposing an architecture: ' +
          '1) WebSearch how others solved similar problems — look for patterns, blog posts, community discussions. ' +
          '2) Use context7 for official docs of the technologies involved. ' +
          '3) Explore alternative approaches and community best practices. ' +
          'Think about the "what" (which approach, which tool) not just the "how".'
        );
      }
      process.exit(0);
      return;
    }

    // ---- PostToolUse: Bash (error loop detection) ----
    if (event === 'PostToolUse' && toolName === 'Bash') {
      const exitCode = input.tool_result?.exitCode ?? input.tool_result?.exit_code ?? null;
      const stateFile = getStateFilePath(input.session_id);
      const state = readState(stateFile);

      if (exitCode !== 0 && exitCode !== null) {
        state.consecutiveErrors += 1;
        // Store a snippet of the error for context
        const stderr = input.tool_result?.stderr || input.tool_result?.output || '';
        state.lastErrorSnippet = stderr.slice(0, 200);
        writeState(stateFile, state);

        if (state.consecutiveErrors >= ERROR_THRESHOLD) {
          output('PostToolUse',
            `RESEARCH FIRST: You have ${state.consecutiveErrors} consecutive errors. STOP trying the same approach. ` +
            'Before retrying: ' +
            '1) WebSearch the exact error message (in quotes) to find known solutions. ' +
            '2) Use context7 for the official documentation of the library/tool involved. ' +
            '3) Check GitHub issues for known bugs. ' +
            '4) Consider an alternative approach instead of repeating the same fix.'
          );
        }
      } else if (exitCode === 0) {
        // Success — reset counter
        state.consecutiveErrors = 0;
        state.lastErrorSnippet = '';
        writeState(stateFile, state);
      }
      process.exit(0);
      return;
    }

    // No match — silent exit
    process.exit(0);
  } catch (e) {
    process.stderr.write(`research-first hook error: ${e.message}\n`);
    process.exit(0); // Non-blocking: never interrupt the workflow
  }
});
