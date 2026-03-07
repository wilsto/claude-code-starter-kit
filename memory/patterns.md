# Patterns — {{PROJECT_NAME}}

> Read this file when debugging or implementing new features.
> NOT auto-injected. Claude reads it on demand.

## Debugging Patterns

### CRLF conversion can empty files on Windows

**Symptom**: After `git add` + `git commit`, a file (CHANGELOG.md) becomes 0 bytes on disk and in the commit.
**Root Cause**: Git's CRLF auto-conversion (`LF will be replaced by CRLF`) can corrupt files when the Edit tool writes content and git immediately stages it. The file ends up empty in the working tree.
**Fix**: Restore from `git show HEAD~1:<file>`, re-apply changes, amend the commit.
**Prevention**: After editing files that trigger CRLF warnings, verify file content before staging (`wc -l <file>`). Consider adding `*.md text eol=lf` to `.gitattributes`.

### PostToolUse auto-format hook can empty files

**Symptom**: After Edit/Write, files become 0 bytes. In coachbywill, 5/7 files were emptied by the formatter.
**Root Cause**: The `auto-format.js` PostToolUse hook runs `npx prettier --write` (or ruff/gofmt) after every Edit/Write. On Windows, formatter subprocesses can race with Claude's file writes, resulting in empty files. Backup/restore logic was added but proved insufficient.
**Fix**: Hook removed entirely from global settings.json and template. Files deleted.
**Prevention**: Never auto-run formatters as PostToolUse hooks. Use format-on-save in IDE or format explicitly before commit (quality gate in `/commit` skill). The risk of data loss outweighs the convenience.

## Reusable Solutions

<!-- Code snippets or approaches that worked and are worth repeating -->

## Anti-Patterns Discovered

### GitHub Issue Creation: 3 Steps, Not 1

**Symptom**: Issue created via `gh issue create` but invisible on the GitHub Project board.
**Root Cause**: `gh issue create` only creates the issue in the repo. It does NOT add it to the GitHub Project, and does NOT set project fields (Status, Phase, Priority, Size, Type, Start date). These are 3 separate API operations.
**Fix**: Always follow the 3-step procedure in `workflow.md` → Issue Creation Procedure:

1. `gh issue create` — creates the issue
2. `gh project item-add` — adds to project board (returns item ID)
3. GraphQL mutations — sets all project fields (Status, Phase, Priority, Size, Type, Start date)
**Prevention**: Field/option IDs cached in `CLAUDE.local.md`. Rule in workflow.md: "Never consider an issue created until all 3 steps are complete." Dates are auto-derived from status (see Date rules in workflow.md) — never ask the PO for dates.

## Agent Orchestration Patterns (from wshobson/agents evaluation)

> Source: `agent-orchestration` plugin — evaluated 2026-02-28, not integrated (too theoretical/enterprise)

### Patterns worth remembering

1. **Failure mode classification** (6 categories for agent issues):
   - Instruction misunderstanding
   - Output format errors
   - Context loss (long conversations)
   - Tool misuse
   - Constraint violations
   - Edge case handling
   → Useful for improving skill prompts and debugging agent behavior.

2. **File-based context between steps** (also seen in incident-response):
   - Write intermediate outputs to files, read them back in next step
   - Survives `/compact` and context window limits
   - Pattern: `state.json` + numbered output files (`01-step.md`, `02-step.md`)
   → Already used in `/incident-response` skill. Consider for other long workflows.

3. **Agent versioning** (MAJOR.MINOR.PATCH for skill prompts):
   - Track skill prompt changes with semantic versioning
   - Rollback triggers: success rate drops >10%, critical errors >5%
   → Premature for now, but worth considering if skills grow complex.

### Not adopted (too complex for our use case)

- Vector databases / knowledge graphs for context (our `memory/` system is simpler and sufficient)
- Dynamic model selection per task complexity (our Model Selection table in CLAUDE.md is manual but adequate)
- A/B testing framework for agents (interesting but premature)

## Learnings

> Cross-session corrections captured via the `[LEARN]` protocol (see `.claude/rules/self-correction.md`).
> Format: `[LEARN] Category: Rule` → user approves → appended here.

### [Architecture] Claude Code hooks must use process.stdout.write JSON, not console.log

- **Mistake**: Used `console.log(message)` in `loop-suggest.js` hook for advisory output
- **Correction**: Use `process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext } }))` — `debug-warning.js` flags `console.log` as a debug artifact, and all hooks use the structured JSON format
- **Project**: Template-claude
- **Date**: 2026-03-07
