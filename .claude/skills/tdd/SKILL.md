---
name: tdd
description: >
  Enforce Test-Driven Development workflow for bug fixes and features.
  Red-Green-Refactor cycle: write failing test FIRST, confirm RED, then implement, confirm GREEN.
  Triggers: "tdd", "test first", "red green refactor".
type: workflow
---

# TDD Workflow — Red-Green-Refactor

## When to use
- Bug fixes: **always** (prove the bug exists with a failing test first)
- New features in source directories: **always**
- Config files, scripts, documentation: **skip**

## Project Commands (auto-detected)

Before running tests, resolve the actual commands for this project:

1. **Read CLAUDE.md** — look for explicit commands in "Workflow" or "Active Stacks" sections
2. **If not found, detect from project marker files:**

| Marker file | Test | Single test | Coverage |
|---|---|---|---|
| `package.json` | `npm test` | `npx jest <path>` / `npx vitest <path>` | `npm test -- --coverage` |
| `pyproject.toml` | `pytest` | `pytest <path>` | `pytest --cov` |
| `go.mod` | `go test ./...` | `go test <path>` | `go test -cover ./...` |
| `Cargo.toml` | `cargo test` | `cargo test <name>` | `cargo tarpaulin` |
| `Makefile` (test target) | `make test` | — | `make coverage` |

3. **Multi-stack**: if CLAUDE.md has "Active Stacks", resolve per-stack commands based on the file path being tested

Use the resolved commands throughout all steps below.

## Cycle

### 0. SPEC — Read the functional spec

Before writing any test, check if a functional spec exists for the domain:

1. Look in `docs/specs/` for a file matching the domain being modified
2. **Spec exists** → read User Stories / Behavior sections. Use acceptance criteria as test source. If spec conflicts with the requested change → flag to user before writing code.
3. **No spec exists** → flag to user. For new features, run `/spec-update` first (advisory — user can proceed without).
4. **Behavior not in spec** → spec gap. After GREEN, run `/spec-update` to document it.

> Skip for: pure bug fixes contradicting spec, pure refactors (no behavior change), config/docs files.

### 1. RED — Write the failing test
- Write ONE test that describes the expected behavior
- Run the project's test command (resolved in "Project Commands" above)
- **CONFIRM** the test FAILS (output must show FAIL/error)
- If the test passes immediately → the test is wrong OR the behavior already exists. Investigate.
- DO NOT proceed to GREEN until failure is confirmed and shown to the user

### 2. GREEN — Minimal implementation
- Write the MINIMUM code to make the failing test pass
- Run the project's test command (resolved in "Project Commands" above)
- **CONFIRM** all tests pass
- Do NOT add extra logic "while you're at it"
- **Coverage check**: after GREEN, run the project's coverage command and show coverage for the modified file. Informational only — confirms the new test covers the new code.

### 3. REFACTOR (optional)
- Only if there is clear duplication or code smell
- Run tests after refactor → must still be green
- Skip if the code is already clean

## Rules
- **1 test → 1 fix → repeat** (vertical slicing, never batch tests)
- Test PUBLIC behavior, not implementation details
- Tests must survive refactoring — if they break during refactor, they test internals
- Always show the user: RED output first, then GREEN output
- Never skip RED confirmation

## Multi-stack projects

If CLAUDE.md has an `## Active Stacks` section, determine which stack the current file belongs to based on its path, then use that stack's test command. Read the corresponding `.claude/stacks/<stack>.md` for language-specific testing conventions.

## Anti-patterns to avoid

| Anti-pattern | Why it's bad |
|---|---|
| Write fix first, add passing test after | NOT TDD — test doesn't prove anything |
| Batch 5 tests then implement all | Loses RED-GREEN signal per test |
| Mock internal methods | Tests break at refactor |
| Skip RED ("I know it will fail") | Always run and show the output |
| Test private methods/implementation | Couples tests to internals |
