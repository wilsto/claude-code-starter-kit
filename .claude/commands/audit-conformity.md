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

## Report

After all 7 checks, produce a scorecard:

```
=== Claude Code Conformity Audit ===

Score: X/7

  [PASS] 1. Secret Protection — block-secrets.js covers N secret files
  [FAIL] 2. TDD Guard — SRC_DIRS missing: internal/, pkg/
  [PASS] 3. Session Memory — MEMORY.md has content, hooks wired
  [FAIL] 4. Deny List — missing: git reset --hard
  [PASS] 5. CLAUDE.md Sections — all 4 required sections found
  [PASS] 6. Context Optimization — .claudeignore covers 5 directories
  [FAIL] 7. Git Hygiene — missing CLAUDE.local.md in .gitignore

=== Corrective Actions ===

Priority 1 (security):
  - Add `Bash(git reset --hard *)` to .claude/settings.json deny list

Priority 2 (quality):
  - Add 'internal/', 'pkg/' to SRC_DIRS in tdd-guard.js

Priority 3 (hygiene):
  - Add `CLAUDE.local.md` to .gitignore
```

## Offer to fix

After showing the report, ask the user: "Want me to fix the failing checks automatically?"

If yes, apply the corrective actions using Edit tool for each FAIL item.
