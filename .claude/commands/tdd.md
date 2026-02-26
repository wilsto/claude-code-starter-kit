# TDD Workflow — Red-Green-Refactor

## When to use
- Bug fixes: **always** (prove the bug exists with a failing test first)
- New features in source directories: **always**
- Config files, scripts, documentation: **skip**

## Cycle

### 1. RED — Write the failing test
- Write ONE test that describes the expected behavior
- Run: `{{TEST_COMMAND}}`
- **CONFIRM** the test FAILS (output must show FAIL/error)
- If the test passes immediately → the test is wrong OR the behavior already exists. Investigate.
- DO NOT proceed to GREEN until failure is confirmed and shown to the user

### 2. GREEN — Minimal implementation
- Write the MINIMUM code to make the failing test pass
- Run: `{{TEST_COMMAND}}`
- **CONFIRM** all tests pass
- Do NOT add extra logic "while you're at it"

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

## Test commands

```bash
# CUSTOMIZE: replace with your actual test commands

# Run all tests
{{TEST_COMMAND}}

# Run a single test file
{{TEST_COMMAND_SINGLE}} path/to/test

# Run with coverage
{{TEST_COMMAND_COVERAGE}}
```

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
