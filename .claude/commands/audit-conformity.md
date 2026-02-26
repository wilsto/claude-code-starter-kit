# Audit Conformity — Project Compliance Check

Audit the current project against claude-code-starter-kit best practices.
Produces a scorecard with conformity status, then lets the user **cherry-pick** which items to fix, skip, or defer.

## Check Metadata

Each check has a kebab-case ID, impact level, estimated effort, and category.
Use this table throughout the audit for display and persistence.

| ID | # | Check | Impact | Effort | Category |
| ---- | --- | ------- | -------- | -------- | ---------- |
| `secret-protection` | 1 | Secret Protection | CRITICAL | ~5 min | Security |
| `tdd-guard` | 2 | TDD Guard | HIGH | ~10 min | Quality |
| `session-memory` | 3 | Session Memory | MEDIUM | ~5 min | Productivity |
| `deny-list` | 4 | Destructive Deny List | CRITICAL | ~2 min | Security |
| `claude-md-reconciliation` | 5 | CLAUDE.md Reconciliation | MEDIUM | ~15 min | Documentation |
| `context-optimization` | 6 | Context Optimization | LOW | ~5 min | Performance |
| `git-hygiene` | 7 | Git Hygiene | MEDIUM | ~2 min | Hygiene |
| `stack-guides` | 8 | Stack Guides | LOW | ~20 min | Documentation |

---

## Phase 1: Load Configuration + Run Checks

### 1a. Load audit config

Read `.claude/audit-config.json` if it exists. Schema:

```json
{
  "version": 1,
  "skipped": {
    "<check-id>": {
      "reason": "Why this check was skipped",
      "skippedAt": "YYYY-MM-DD",
      "alternative": "What the project uses instead (or null)"
    }
  },
  "lastAudit": {
    "date": "YYYY-MM-DD",
    "score": "X/Y",
    "results": { "<check-id>": "PASS|FAIL|SKIP" }
  }
}
```

If the file does not exist, treat all checks as active (no skips) and no previous audit.

### 1b. Run checks

For each check: if the check ID is in `skipped`, mark it **SKIP** immediately (do not run the check logic). Otherwise, run the check and mark **PASS** or **FAIL**.

---

## Check 1: Secret Protection

**ID**: `secret-protection`
**File**: `.claude/hooks/block-secrets.js`

- Does the file exist?
- Does `BLOCKED_PATHS` array cover secret files found in the project?
- Search for `.env*`, `secrets.*`, `*.key`, `*.pem` files in the project
- Are all found secret files covered by the hook?

**PASS**: Hook exists and covers all secret files found.
**FAIL**: Missing hook or uncovered secret files. List the gaps.

## Check 2: TDD Guard

**ID**: `tdd-guard`
**File**: `.claude/hooks/tdd-guard.js`

- Does the file exist?
- Does `SRC_DIRS` match actual source directories in the project?
- Use Glob to find actual source directories containing code files
- Compare with the configured `SRC_DIRS` array

**PASS**: Hook exists and SRC_DIRS matches reality.
**FAIL**: Missing hook or SRC_DIRS doesn't cover actual source dirs. List the gaps.

## Check 3: Session Memory

**ID**: `session-memory`
**Files**: `memory/MEMORY.md`, `.claude/hooks/session-context.js`

- Does `memory/MEMORY.md` exist?
- Is it non-empty (has actual content beyond template comments)?
- Does `session-context.js` exist?
- Does settings.json wire it to SessionStart (startup + compact)?

**PASS**: Memory file exists with content, hook wired for both startup and compact.
**FAIL**: Missing files or empty memory. List what's missing.

## Check 4: Destructive Command Deny List

**ID**: `deny-list`
**File**: `.claude/settings.json`

- Does the file exist?
- Does `permissions.deny` include at minimum:
  - `Bash(rm -rf /*)` or equivalent
  - `Bash(git push *--force*)` or equivalent
  - `Bash(git reset --hard *)`

**PASS**: All critical destructive commands are denied.
**FAIL**: Missing deny rules. List the gaps.

## Check 5: CLAUDE.md Reconciliation

**ID**: `claude-md-reconciliation`

This check goes beyond verifying sections — it performs a full **reconciliation audit** between the project's existing directives and the template's expected sections.

### Phase A — Inventory

1. Read the project's `CLAUDE.md` (if it exists)
2. Read all files in `.claude/rules/` (if any exist)
3. Read `CLAUDE.local.md` (if it exists)
4. Map out: what directives exist, where they live

### Phase B — Gap & Conflict Analysis

Check for these **required template sections** (search across CLAUDE.md AND .claude/rules/):

- TDD Rules (or equivalent TDD section)
- Quality Gate (or equivalent pre-commit checks)
- Conventions (commit format, secrets policy)
- Model Selection (or equivalent)

For each required section, classify:

- **MISSING** — not found anywhere (CLAUDE.md, rules/, local)
- **PRESENT** — found in CLAUDE.md or `.claude/rules/`
- **CONFLICT** — found but contradicts template expectation (e.g., project says "no TDD" vs template TDD rules)
- **EXISTING** — project has its own content in this area (not from template)

### Phase C — Reconciliation Proposals

For each finding, propose the appropriate action:

| Situation | Proposed action |
| --------- | --------------- |
| Template section absent, no conflict | Add the section to CLAUDE.md |
| Template section absent, project has different approach | Create `.claude/rules/<topic>.md` that overrides |
| Project directive in CLAUDE.md that should be modular | Propose migration to `.claude/rules/<topic>.md` |
| Direct contradiction (e.g., "no TDD" vs template TDD) | Flag conflict, propose 2 options: skip the check OR put project rule in `rules/` |
| Project already has everything in `.claude/rules/` | PASS — nothing to do |

### Output format

```text
=== Check 5: CLAUDE.md Reconciliation ===

Existing CLAUDE.md: X lines (sections: ...)
.claude/rules/: N files (list them)
Template sections: found M/4

Analysis:
  [MISSING]   TDD Rules — not found anywhere
  [PRESENT]   Quality Gate — found in CLAUDE.md line 45
  [CONFLICT]  Conventions — project says "tabs" vs template "spaces"
  [EXISTING]  Architecture (32 lines) — project-specific, keep as-is

Proposed reconciliation:
  1. Add TDD Rules section to CLAUDE.md (no conflict)
  2. Keep project's Conventions, add template extras → .claude/rules/template-conventions.md
  3. Move Architecture section → .claude/rules/architecture.md (declutter)
```

### Zero-loss guarantee

Strict rules:

- **NEVER overwrite** an existing project directive
- **NEVER delete** content from existing CLAUDE.md without moving it elsewhere first
- Every migration (CLAUDE.md → rules/) is a **move**, not a deletion
- Show a clear diff for each proposed change
- When in doubt → ask the user, never assume

**PASS**: All 4 required sections present (in CLAUDE.md or rules/), no unresolved conflicts.
**FAIL**: Missing sections or unresolved conflicts. List the gaps and proposals.

## Check 6: Context Optimization

**ID**: `context-optimization`
**File**: `.claudeignore`

- Does the file exist?
- Does it exclude common large directories?
  - Check if `node_modules/`, `dist/`, `build/`, `venv/`, `__pycache__/`, `coverage/` etc. are present (whichever are relevant to the project)
- Check for lock files exclusion (`package-lock.json`, `yarn.lock`, etc.)

**PASS**: .claudeignore exists and covers relevant exclusions.
**FAIL**: Missing file or uncovered directories. List the gaps.

## Check 7: Git Hygiene

**ID**: `git-hygiene`
**File**: `.gitignore`

- Does the file exist?
- Does it include `CLAUDE.local.md`?
- Does it exclude secret file patterns (`.env*`, `secrets.*`)?
- Does it exclude `memory/session-cache.json`?

**PASS**: All hygiene rules present.
**FAIL**: Missing entries. List the gaps.

## Check 8: Stack Guides

**ID**: `stack-guides`

Detect the language stacks in use and verify that matching stack guides are present.

### Detection via indicator files

Use Glob to search for these files at the project root:

| Indicator files | Stack detected |
| --- | --- |
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

---

## Phase 2: Display Enriched Scorecard

After all 8 checks, produce the scorecard with impact/effort metadata:

```text
=== Claude Code Conformity Audit ===

Score: X/Y applicable (Z skipped)

  [PASS] 1. Secret Protection        [CRITICAL | ~5 min]  — block-secrets.js covers N secret files
  [FAIL] 2. TDD Guard                [HIGH     | ~10 min] — SRC_DIRS missing: internal/, pkg/
  [PASS] 3. Session Memory            [MEDIUM   | ~5 min]  — MEMORY.md has content, hooks wired
  [PASS] 4. Deny List                 [CRITICAL | ~2 min]  — all critical patterns denied
  [FAIL] 5. CLAUDE.md Reconciliation  [MEDIUM   | ~15 min] — missing: TDD Rules, Model Selection
  [PASS] 6. Context Optimization      [LOW      | ~5 min]  — .claudeignore covers 5 directories
  [SKIP] 7. Git Hygiene               — "Pre-commit hooks instead" (2026-02-15)
  [SKIP] 8. Stack Guides              — "Custom mono-repo stack" (2026-02-20)

Legend: Impact [CRITICAL/HIGH/MEDIUM/LOW] | Estimated fix time
```

The score denominator is **applicable checks only** (total minus skipped).

### Delta report (if previous audit exists)

If `lastAudit` exists in `audit-config.json`, show what changed:

```text
=== Changes since last audit (YYYY-MM-DD) ===
  [IMPROVED]  Secret Protection: FAIL → PASS
  [REGRESSED] Context Optimization: PASS → FAIL
  [UNCHANGED] N checks still passing
```

### Stale skip nudge

If any skipped check was skipped more than 90 days ago, add a polite nudge:

```text
Note: 1 skipped check is older than 90 days:
  - Git Hygiene (skipped 2025-11-15): "Pre-commit hooks instead"
Consider reviewing whether this skip is still appropriate. Enter [R] to review.
```

---

## Phase 3: Interactive Selection Menu

If there are any FAIL items, present this menu using **AskUserQuestion** (one single prompt):

```text
=== What would you like to do? ===

Failed items:
  [1] Fix: TDD Guard — add internal/, pkg/ to SRC_DIRS              [HIGH | ~10 min]
  [2] Fix: CLAUDE.md Reconciliation — add TDD Rules, Model Selection [MEDIUM | ~15 min]

Options:
  [S] Skip a check permanently (mark as "not applicable" for this project)
  [R] Review previously skipped checks
  [A] Fix all failed items
  [Q] Done — exit audit without changes

Your choice (e.g., "1", "1,2", "A", "S"):
```

### Interpret user response

- **Numbers (e.g., "1" or "1,2")**: Proceed to Phase 4 with only the selected FAIL items.
- **"S"**: Enter skip flow (Phase 3b).
- **"R"**: Enter review flow (Phase 3c).
- **"A"**: Proceed to Phase 4 with all FAIL items.
- **"Q"**: Skip to Phase 6 (persist results only, no fixes).

### Phase 3b: Skip a check

Ask the user (AskUserQuestion):

1. Which check to skip? (by number or name)
2. Why? (reason — stored in audit-config.json)
3. What does the project use instead? (alternative — can be null)

Write the skip to `audit-config.json` under `skipped`. Remove the check from the FAIL list.

If there are remaining FAIL items, re-display the menu (Phase 3). Otherwise, skip to Phase 6.

### Phase 3c: Review skipped checks

Display all currently skipped checks:

```text
=== Currently Skipped Checks ===

  7. Git Hygiene — "Pre-commit hooks instead" (skipped 2026-02-15)
     Alternative: husky + lint-staged
  8. Stack Guides — "Custom mono-repo stack" (skipped 2026-02-20)
     Alternative: none
```

Ask the user if they want to **reactivate** any check. If yes, remove it from `skipped` in `audit-config.json` and re-run that check. Then return to Phase 3 main menu.

---

## Phase 4: Context Analysis (scoped to selection)

Before proposing fixes, analyze the project's existing setup — but **only for the selected FAIL items**.

### Detect existing patterns

- Read `CLAUDE.md`, `.claude/settings.json`, `.claude/settings.local.json` if they exist
- Read any existing hooks in `.claude/hooks/`
- Read any existing rules in `.claude/rules/`
- Check for existing CI/CD (`.github/workflows/`, `Makefile`, etc.)
- Check for existing linters/formatters (`.prettierrc`, `pyproject.toml`, `.eslintrc`, etc.)

### Identify conflicts (scoped)

For each selected FAIL item, check if the proposed fix would conflict with existing configuration:

- Would a new deny rule conflict with an existing allow rule in settings?
- Would new `BLOCKED_PATHS` entries block files the project legitimately edits?
- Would `SRC_DIRS` in tdd-guard overlap or conflict with existing hook logic?
- Would adding sections to CLAUDE.md duplicate or contradict existing content?
- Would creating files in `.claude/rules/` shadow existing directives?

### Identify complementarities (scoped)

Also report what the project already does well that complements the template:

- Existing hooks that cover different concerns
- Existing rules files that fill gaps
- CI/CD pipelines that already enforce some quality gates
- Existing memory files or documentation patterns

---

## Phase 5: Plan Mode + Approval + Fix

1. **Enter plan mode** (use EnterPlanMode tool) to propose the corrective actions
2. In the plan, organize into 3 sections:
   - **Conflicts** — things that need careful merging (e.g., "settings.json already has a deny list — need to merge, not replace")
   - **Complementarities** — things already in place that work well with the template
   - **Actions** — for each selected FAIL item only, the exact file and change to make, noting any merge considerations
3. Wait for user approval before making any changes
4. Only after approval: apply the corrective actions using Edit tool for each selected item
5. After all fixes, re-run only the fixed checks to confirm they now PASS

**Never apply fixes without user approval.** The audit is read-only until the user explicitly validates the plan.

---

## Phase 6: Persist Results

After the audit completes (whether fixes were applied or not), write or update `.claude/audit-config.json`:

- Set `lastAudit.date` to today's date
- Set `lastAudit.score` to the final score (e.g., "6/7")
- Set `lastAudit.results` with every check ID mapped to PASS, FAIL, or SKIP
- Preserve all existing `skipped` entries
- Add any new skips from this session

If the file does not exist yet, create it with `version: 1`.

**Important**: This file should be committed to git (it represents team-level policy decisions about which checks apply to this project).
