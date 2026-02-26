# Test Runner — Sub-agent Workflow

Run the test suite, analyze failures, and report results with diagnostics.

## Usage

`/test-runner` — run all tests
`/test-runner path/to/test` — run a specific test file

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

Do NOT fix the tests. Diagnose and report only. The user will decide how to proceed.
