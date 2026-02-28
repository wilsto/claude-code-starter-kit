# Quality & TDD

## TDD Rules (mandatory)

1. Write ONE failing test (RED) → run tests → confirm FAIL
2. Write minimum code to pass (GREEN) → confirm PASS
3. Refactor only if obvious duplication → tests still green

- Never write code before the test
- Always show RED output, then GREEN output
- 1 test → 1 fix → repeat (vertical slicing)

## Quality Gate (before every commit)

- **Secret scan** (blocking): no api_key/token/password/bearer in staged files
- **Slop scan** (advisory): no debug prints, no comments restating code
- **Format check**: run project formatter
- **Tests must be green**
