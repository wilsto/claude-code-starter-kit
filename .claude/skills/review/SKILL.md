---
name: review
description: >
  Auto-invoke a code review sub-agent before committing or when significant changes accumulate.
  Evaluates correctness, conventions, testing coverage, security, and simplicity.
  Triggers: before /commit with 3+ files changed, after completing a feature, after refactoring,
  when the user asks for review, "review my code", "check my changes", "is this correct".
type: workflow
---

# Code Review — Sub-agent Workflow

## When to use (auto-trigger)

- **Before /commit** when 3+ files have been changed — catch issues before they're committed
- **After completing a feature** — verify the implementation before declaring "Done"
- **After a refactor** — ensure behavior is preserved
- **When unsure about correctness** — delegate the review to get a second opinion
- **Never** on trivial changes (typo fix, single-line config change)

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

## After the review

- **Critical issues**: Fix them before committing (Level 1 autonomy for obvious fixes)
- **Suggestions**: Present to the user for decision (Level 3)
- **Clean review**: Proceed to /commit
