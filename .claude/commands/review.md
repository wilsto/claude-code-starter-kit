# Code Review — Sub-agent Workflow

Review the current changes for quality, correctness, and adherence to project conventions.

## Process

Use the Task tool to spawn a code-review sub-agent with the following instructions:

### Sub-agent prompt

You are a code reviewer for this project. Review ALL current changes.

1. Run `git diff` to see unstaged changes, and `git diff --cached` for staged changes
2. For each changed file, evaluate:
   - **Correctness**: Logic errors, edge cases, null/undefined checks, error handling
   - **Conventions**: Does the code follow patterns described in CLAUDE.md and the relevant stack guide in `.claude/stacks/`?
   - **Testing**: Are new behaviors covered by tests? Flag untested paths.
   - **Security**: Hardcoded secrets, SQL injection, XSS, auth bypasses, OWASP top 10
   - **Simplicity**: Unnecessary complexity, dead code, premature abstraction
3. Produce a review in this format:

```
## Review Summary
- Files reviewed: N
- Issues found: N (X critical, Y suggestions)

## Critical Issues (must fix)
- [file:line] description

## Suggestions (nice to have)
- [file:line] description

## Good Patterns Noticed
- description
```

Do NOT make changes. Report only.
