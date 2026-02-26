---
name: setup
description: >
  Interactive setup wizard for claude-code-starter-kit.
  Asks for your stack (language, test runner, formatter) and automatically
  fills all {{PLACEHOLDER}} values across CLAUDE.md, skills, and hooks.
  Triggers: "setup", "configure template", "init project".
---

# Setup Wizard

## Step 1: Gather project info

Ask the user these questions (use AskUserQuestion tool):

1. **Project name** — What is your project name? (used in CLAUDE.md header and memory)
2. **Language/Stack** — Which stack?
   - Node.js (Vitest + Prettier)
   - Python (pytest + Black)
   - Go (go test + gofmt)
   - Rust (cargo test + cargo fmt)
   - Other (ask for details)
3. **Source directory** — Where is source code? (default: `src/`)
4. **Test directory** — Where are tests? (default: `tests/`)
5. **Default branch** — `main` or `master`? (default: `main`)
6. **Conversation language** — What language for conversations? (default: English)

## Step 2: Map stack to commands

Based on the stack chosen:

| Stack | TEST_COMMAND | TEST_SINGLE | TEST_COVERAGE | FORMAT_CHECK | FORMAT_FIX |
|-------|-------------|-------------|---------------|-------------|------------|
| Node.js | `npx vitest run` | `npx vitest run` | `npx vitest run --coverage` | `npx prettier --check .` | `npx prettier --write .` |
| Python | `pytest` | `pytest` | `pytest --cov` | `black --check .` | `black .` |
| Go | `go test ./...` | `go test` | `go test -cover ./...` | `gofmt -l .` | `gofmt -w .` |
| Rust | `cargo test` | `cargo test` | `cargo tarpaulin` | `cargo fmt --check` | `cargo fmt` |

## Step 3: Replace placeholders

Use the Edit tool to search-replace in these files:

### CLAUDE.md
- `{{PROJECT_NAME}}` → project name
- `{{PROJECT_DESCRIPTION}}` → ask or leave as comment
- `{{SRC_DIR}}` → source directory
- `{{TEST_DIR}}` → test directory
- `{{TEST_COMMAND}}` → from table above
- `{{FORMAT_COMMAND}}` → FORMAT_CHECK from table above
- `{{DEFAULT_BRANCH}}` → default branch
- `{{CONVERSATION_LANGUAGE}}` → conversation language

### .claude/skills/tdd/SKILL.md
- `{{TEST_COMMAND}}` → from table
- `{{TEST_COMMAND_SINGLE}}` → from table
- `{{TEST_COMMAND_COVERAGE}}` → from table

### .claude/skills/commit/SKILL.md
- `{{FORMAT_CHECK_COMMAND}}` → from table
- `{{FORMAT_FIX_COMMAND}}` → from table
- `{{TEST_COMMAND}}` → from table
- `{{DEFAULT_BRANCH}}` → default branch

### memory/MEMORY.md
- `{{PROJECT_NAME}}` → project name
- `{{PROJECT_DESCRIPTION}}` → project description

### memory/patterns.md
- `{{PROJECT_NAME}}` → project name

## Step 4: Adapt hooks

If the user chose a non-standard source directory, update `tdd-guard.js`:
- Edit the `SRC_DIRS` array to include the user's source directory path

## Step 5: Remove setup checklist

Remove the HTML comment block at the top of CLAUDE.md (the setup checklist).

## Step 6: Summary

Show the user a summary of all changes made:

```
Setup complete!

Project: {name}
Stack: {stack}
Test command: {test_command}
Formatter: {format_command}

Files modified:
- CLAUDE.md — project identity and commands filled in
- .claude/skills/tdd/SKILL.md — test commands configured
- .claude/skills/commit/SKILL.md — format and test commands configured
- memory/MEMORY.md — project identity filled in
- memory/patterns.md — project name filled in

Next steps:
1. Fill in CLAUDE.local.md with your personal preferences
2. Add project-specific secret files to block-secrets.js BLOCKED_PATHS
3. Run: git add -A && git commit -m "chore: configure claude-code-starter-kit"
```
