# Audit Conformity — Project Compliance Check

Audit the current project against claude-code-starter-kit best practices.
Produces a scorecard with conformity status and corrective actions.

## Process

Analyze the current project against the starter kit standards. For each check, report PASS or FAIL with specific details.

## Check 1: Secret Protection

**File**: `.claude/hooks/block-secrets.js`

- Does the file exist?
- Does `BLOCKED_PATHS` array cover secret files found in the project?
- Search for `.env*`, `secrets.*`, `*.key`, `*.pem` files in the project
- Are all found secret files covered by the hook?

**PASS**: Hook exists and covers all secret files found.
**FAIL**: Missing hook or uncovered secret files. List the gaps.

## Check 2: TDD Guard

**File**: `.claude/hooks/tdd-guard.js`

- Does the file exist?
- Does `SRC_DIRS` match actual source directories in the project?
- Use Glob to find actual source directories containing code files
- Compare with the configured `SRC_DIRS` array

**PASS**: Hook exists and SRC_DIRS matches reality.
**FAIL**: Missing hook or SRC_DIRS doesn't cover actual source dirs. List the gaps.

## Check 3: Session Memory

**Files**: `memory/MEMORY.md`, `.claude/hooks/session-context.js`

- Does `memory/MEMORY.md` exist?
- Is it non-empty (has actual content beyond template comments)?
- Does `session-context.js` exist?
- Does settings.json wire it to SessionStart (startup + compact)?

**PASS**: Memory file exists with content, hook wired for both startup and compact.
**FAIL**: Missing files or empty memory. List what's missing.

## Check 4: Destructive Command Deny List

**File**: `.claude/settings.json`

- Does the file exist?
- Does `permissions.deny` include at minimum:
  - `Bash(rm -rf /*)` or equivalent
  - `Bash(git push *--force*)` or equivalent
  - `Bash(git reset --hard *)`

**PASS**: All critical destructive commands are denied.
**FAIL**: Missing deny rules. List the gaps.

## Check 5: CLAUDE.md Sections

**File**: `CLAUDE.md`

- Does the file exist?
- Check for these required sections (search for headers):
  - TDD Rules (or equivalent TDD section)
  - Quality Gate (or equivalent pre-commit checks)
  - Conventions (commit format, secrets policy)
  - Model Selection (or equivalent)

**PASS**: All required sections present.
**FAIL**: Missing sections. List which ones.

## Check 6: Context Optimization

**File**: `.claudeignore`

- Does the file exist?
- Does it exclude common large directories?
  - Check if `node_modules/`, `dist/`, `build/`, `venv/`, `__pycache__/`, `coverage/` etc. are present (whichever are relevant to the project)
- Check for lock files exclusion (`package-lock.json`, `yarn.lock`, etc.)

**PASS**: .claudeignore exists and covers relevant exclusions.
**FAIL**: Missing file or uncovered directories. List the gaps.

## Check 7: Git Hygiene

**File**: `.gitignore`

- Does the file exist?
- Does it include `CLAUDE.local.md`?
- Does it exclude secret file patterns (`.env*`, `secrets.*`)?
- Does it exclude `memory/session-cache.json`?

**PASS**: All hygiene rules present.
**FAIL**: Missing entries. List the gaps.

## Check 8: Stack Guides

Detect the language stacks in use and verify that matching stack guides are present.

### Detection via indicator files

Use Glob to search for these files at the project root:

| Indicator files | Stack detected |
|---|---|
| `pyproject.toml`, `requirements.txt`, `setup.py`, `Pipfile` | Python |
| `next.config.*` (`next.config.ts`, `next.config.mjs`, `next.config.js`) | Next.js |
| `package.json` (without any `next.config.*`) | Node.js |
| `go.mod` | Go |
| `Cargo.toml` | Rust |

### Verification

For each detected stack:
1. Check if `.claude/stacks/<stack>.md` exists in the project
2. If multi-stack (2+ detected): check if CLAUDE.md has an `## Active Stacks` section
3. If single-stack: check if CLAUDE.md has the stack's test/format commands filled in (not `{{PLACEHOLDER}}`)

**PASS**: All detected stacks have matching guide files, and CLAUDE.md references them correctly.
**FAIL**: Missing stack guide(s) or CLAUDE.md not configured for detected stacks. List the gaps.

## Report

After all 8 checks, produce a scorecard:

```
=== Claude Code Conformity Audit ===

Score: X/8

  [PASS] 1. Secret Protection — block-secrets.js covers N secret files
  [FAIL] 2. TDD Guard — SRC_DIRS missing: internal/, pkg/
  [PASS] 3. Session Memory — MEMORY.md has content, hooks wired
  [FAIL] 4. Deny List — missing: git reset --hard
  [PASS] 5. CLAUDE.md Sections — all 4 required sections found
  [PASS] 6. Context Optimization — .claudeignore covers 5 directories
  [FAIL] 7. Git Hygiene — missing CLAUDE.local.md in .gitignore
  [FAIL] 8. Stack Guides — Next.js detected (next.config.ts) but no .claude/stacks/nextjs.md

=== Corrective Actions ===

Priority 1 (security):
  - Add `Bash(git reset --hard *)` to .claude/settings.json deny list

Priority 2 (quality):
  - Add 'internal/', 'pkg/' to SRC_DIRS in tdd-guard.js

Priority 3 (hygiene):
  - Add `CLAUDE.local.md` to .gitignore
```

## Context Analysis

Before proposing fixes, analyze the project's existing setup to understand what's already in place:

### Detect existing patterns
- Read `CLAUDE.md`, `.claude/settings.json`, `.claude/settings.local.json` if they exist
- Read any existing hooks in `.claude/hooks/`
- Read any existing skills in `.claude/skills/` and commands in `.claude/commands/`
- Check for existing CI/CD (`.github/workflows/`, `Makefile`, etc.)
- Check for existing linters/formatters (`.prettierrc`, `pyproject.toml`, `.eslintrc`, etc.)

### Identify conflicts
For each FAIL item, check if the proposed fix would conflict with existing configuration:
- Would a new deny rule conflict with an existing allow rule in settings?
- Would new `BLOCKED_PATHS` entries block files the project legitimately edits?
- Would `SRC_DIRS` in tdd-guard overlap or conflict with existing hook logic?
- Would adding sections to CLAUDE.md duplicate or contradict existing content?

### Identify complementarities
Also report what the project already does well that complements the template:
- Existing hooks that cover different concerns (e.g., a lint hook, a deploy guard)
- Existing skills/commands that fill gaps the template doesn't cover
- CI/CD pipelines that already enforce some quality gates (making the `/commit` test gate redundant or complementary)
- Existing memory files or documentation patterns

## Offer to fix

After showing the scorecard, if there are any FAIL items:

1. **Enter plan mode** (use EnterPlanMode tool) to propose the corrective actions
2. In the plan, organize into 3 sections:
   - **Conflicts** — things that need careful merging (e.g., "settings.json already has a deny list — need to merge, not replace")
   - **Complementarities** — things already in place that work well with the template (e.g., "existing .prettierrc means /commit format check will work out of the box")
   - **Actions** — for each FAIL item, the exact file and change to make, noting any merge considerations
3. Wait for user approval before making any changes
4. Only after approval: apply the corrective actions using Edit tool for each FAIL item
5. After all fixes, re-run the audit to confirm the new score

**Never apply fixes without user approval.** The audit is read-only until the user explicitly validates the plan.
