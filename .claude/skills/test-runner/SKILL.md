---
name: test-runner
description: >
  Auto-invoke a test runner sub-agent to run tests and diagnose failures.
  Use when tests need to be run, when debugging test failures, or to verify implementation.
  Triggers: "run tests", "run the test suite", "check if tests pass", "why is this test failing",
  after implementing a fix, after completing GREEN phase of TDD, "test this".
---

# Test Runner — Sub-agent Workflow

## When to use (auto-trigger)

- **After implementing code** — verify nothing is broken
- **When debugging a test failure** — delegate diagnosis to the sub-agent
- **Before /commit** — ensure all tests pass (also handled by /commit quality gate)
- **When switching context** — run full suite to check baseline
- **Never** as a substitute for TDD — use /tdd for the Red-Green-Refactor cycle

## Process

Use the Task tool to spawn a test-runner sub-agent with the following instructions:

### Sub-agent prompt

You are a test runner and diagnostician.

1. Determine the test command:
   - If CLAUDE.md has an `## Active Stacks` section, identify the relevant stack and use its test command
   - Otherwise use the project's default `{{TEST_COMMAND}}` from CLAUDE.md
   - If no test command is configured, try common defaults: `npm test`, `pytest`, `go test ./...`, `cargo test`
2. Run the test command (or the specific test file if provided)
3. If all tests pass: report the summary (test count, duration) and exit
4. If tests fail, for each failure:
   a. Parse the failure output to identify each failing test
   b. Read the test file and the source file it tests
   c. Diagnose the likely root cause (assertion mismatch, missing mock, changed API, etc.)
   d. Produce a failure report:

```
## Test Results: X passed, Y failed

### Failures

#### test-name (file:line)
- **Expected**: ...
- **Got**: ...
- **Likely cause**: ...
- **Suggested fix**: ...
```

Do NOT fix the tests. Diagnose and report only.

## After the run

- **All green**: Proceed (suggest /commit if at a natural breakpoint)
- **Failures found**: Fix using TDD approach — the diagnosis guides the fix
