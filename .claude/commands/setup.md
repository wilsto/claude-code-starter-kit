# Setup Wizard

Interactive setup for claude-code-starter-kit. Asks for your stack(s) and fills all placeholders.

## Step 1: Gather project info

Ask the user these questions (use AskUserQuestion tool):

1. **Project name** — What is your project name? (used in CLAUDE.md header and memory)
2. **Language/Stack(s)** — Which stack(s) does this project use? (multi-select: select all that apply)
   - Python (pytest + ruff)
   - Next.js (vitest + prettier + eslint)
   - Node.js (vitest + prettier)
   - Go (go test + gofmt)
   - Rust (cargo test + cargo fmt)
   - Other (ask for details)
3. **Default branch** — `main` or `master`? (default: `main`)
4. **Conversation language** — What language for conversations? (default: English)

## Step 1b: Per-stack directories

For each selected stack, ask:

- **Root directory** — Where does this stack live? (default: `.` for single-stack, or ask for each if multi-stack, e.g., `backend/`, `frontend/`)
- **Source directory** — Where is source code relative to root? (default: from stack file `SRC_DIR`)
- **Test directory** — Where are tests relative to root? (default: from stack file `TEST_DIR`)

## Step 2: Load stack defaults

For each selected stack:

1. Read `.claude/stacks/<stack>.md` (e.g., `.claude/stacks/python.md`)
2. Parse the `## Defaults` table to get placeholder values:
   - TEST_COMMAND, TEST_COMMAND_SINGLE, TEST_COMMAND_COVERAGE
   - FORMAT_CHECK_COMMAND, FORMAT_FIX_COMMAND
   - SRC_DIR, TEST_DIR
3. If the stack root is not `.`, prefix commands with `cd <root> && ` (e.g., `cd backend && pytest`)

**Fallback** — If the stack file is not found, use this mapping:

| Stack | TEST_COMMAND | TEST_SINGLE | TEST_COVERAGE | FORMAT_CHECK | FORMAT_FIX |
|-------|-------------|-------------|---------------|-------------|------------|
| Python | `pytest` | `pytest` | `pytest --cov` | `ruff check . && ruff format --check .` | `ruff check --fix . && ruff format .` |
| Next.js | `npx vitest run` | `npx vitest run` | `npx vitest run --coverage` | `npx prettier --check . && npx eslint .` | `npx prettier --write . && npx eslint --fix .` |
| Node.js | `npx vitest run` | `npx vitest run` | `npx vitest run --coverage` | `npx prettier --check .` | `npx prettier --write .` |
| Go | `go test ./...` | `go test` | `go test -cover ./...` | `gofmt -l . && go vet ./...` | `gofmt -w .` |
| Rust | `cargo test` | `cargo test` | `cargo tarpaulin` | `cargo fmt --check && cargo clippy -- -D warnings` | `cargo fmt` |

## Step 3: Replace placeholders

Use the Edit tool to search-replace based on the number of stacks selected:

### Single-stack mode (1 stack selected)

Standard placeholder replacement:

#### CLAUDE.md
- `{{PROJECT_NAME}}` → project name
- `{{PROJECT_DESCRIPTION}}` → ask or leave as comment
- `{{SRC_DIR}}` → source directory
- `{{TEST_DIR}}` → test directory
- `{{TEST_COMMAND}}` → from stack defaults
- `{{FORMAT_COMMAND}}` → FORMAT_CHECK_COMMAND from stack defaults
- `{{DEFAULT_BRANCH}}` → default branch
- `{{CONVERSATION_LANGUAGE}}` → conversation language
- Remove the `<!-- MULTI-STACK ... -->` comment block from CLAUDE.md

### Multi-stack mode (2+ stacks selected)

1. Replace `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{DEFAULT_BRANCH}}`, `{{CONVERSATION_LANGUAGE}}` normally
2. Remove the `<!-- MULTI-STACK ... -->` comment block
3. **Generate an `## Active Stacks` section** in CLAUDE.md after the Workflow section:

For each stack, generate a subsection:

```markdown
## Active Stacks

### <Role> — <Stack Name>
- **Source**: `<root>/<src_dir>`
- **Tests**: `<root>/<test_dir>`
- **Test command**: `cd <root> && <TEST_COMMAND>`
- **Format**: `cd <root> && <FORMAT_CHECK_COMMAND>`
- **Stack guide**: `.claude/stacks/<stack>.md`
```

4. Replace `{{TEST_COMMAND}}` in Workflow and TDD Rules with: `See Active Stacks section below`
5. Replace `{{FORMAT_COMMAND}}` in Quality Gate with: `See Active Stacks section below`
6. Replace `{{SRC_DIR}}` with the primary stack's source dir
7. Replace `{{TEST_DIR}}` with the primary stack's test dir

### Shared file replacements (both modes)

#### .claude/commands/tdd.md and .claude/skills/tdd/SKILL.md
- `{{TEST_COMMAND}}` → primary stack test command (single) or `See Active Stacks in CLAUDE.md` (multi)
- `{{TEST_COMMAND_SINGLE}}` → from primary stack
- `{{TEST_COMMAND_COVERAGE}}` → from primary stack

#### .claude/commands/commit.md and .claude/skills/commit/SKILL.md
- `{{FORMAT_CHECK_COMMAND}}` → from primary stack (single) or `See Active Stacks in CLAUDE.md` (multi)
- `{{FORMAT_FIX_COMMAND}}` → from primary stack (single) or note about Active Stacks (multi)
- `{{TEST_COMMAND}}` → from primary stack
- `{{DEFAULT_BRANCH}}` → default branch

#### memory/MEMORY.md
- `{{PROJECT_NAME}}` → project name
- `{{PROJECT_DESCRIPTION}}` → project description

#### memory/patterns.md
- `{{PROJECT_NAME}}` → project name

## Step 4: Adapt hooks

If the user chose non-standard source directories, update `tdd-guard.js`:
- Edit the `SRC_DIRS` array to include all stack source directory paths

## Step 5: Remove setup checklist

Remove the HTML comment block at the top of CLAUDE.md (the setup checklist).

## Step 6: Summary

Show the user a summary of all changes made:

```
Setup complete!

Project: {name}
Stack(s): {stack_list}
Default branch: {branch}

Per-stack configuration:
  {stack1} ({root1}/):
    Test: {test_command_1}
    Format: {format_command_1}
    Guide: .claude/stacks/{stack1}.md

Files modified:
- CLAUDE.md — project identity, commands, and Active Stacks configured
- .claude/commands/tdd.md — test commands configured
- .claude/commands/commit.md — format and test commands configured
- .claude/skills/tdd/SKILL.md — test commands configured
- .claude/skills/commit/SKILL.md — format and test commands configured
- memory/MEMORY.md — project identity filled in
- memory/patterns.md — project name filled in

Stack guides available (Claude reads these for language-specific patterns):
{list of .claude/stacks/<stack>.md files}

Next steps:
1. Fill in CLAUDE.local.md with your personal preferences
2. Add project-specific secret files to block-secrets.js BLOCKED_PATHS
3. Run: git add -A && git commit -m "chore: configure claude-code-starter-kit"
```
