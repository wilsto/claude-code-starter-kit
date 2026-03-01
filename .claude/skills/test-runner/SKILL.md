---
name: test-runner
description: >
  Auto-invoke a test runner sub-agent to run tests and diagnose failures.
  Use when tests need to be run, when debugging test failures, or to verify implementation.
  Triggers: "run tests", "run the test suite", "check if tests pass", "why is this test failing",
  after implementing a fix, after completing GREEN phase of TDD, "test this".
type: workflow
---

# Test Runner — Sub-agent Workflow

## When to use (auto-trigger)

- **After implementing code** — verify nothing is broken
- **When debugging a test failure** — delegate diagnosis to the sub-agent
- **Before /commit** — ensure all tests pass (also handled by /commit quality gate)
- **When switching context** — run full suite to check baseline
- **Never** as a substitute for TDD — use /tdd for the Red-Green-Refactor cycle

## Process

Delegate to the **test-runner agent** (`.claude/agents/test-runner.md`):

```
Use the Agent tool to spawn a test-runner sub-agent with subagent_type="general-purpose"
and model="haiku". The agent prompt is defined in .claude/agents/test-runner.md.
```

The agent runs tests, parses failures, reads source files, and returns a structured diagnosis. It does NOT fix tests — it reports only.

If a specific test file was mentioned, pass it as context to the agent.

## After the run

- **All green**: Proceed (suggest /commit if at a natural breakpoint)
- **Failures found**: Fix using TDD approach — the diagnosis guides the fix
