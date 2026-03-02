---
name: review
description: >
  Route code reviews to the appropriate pr-review-toolkit agent.
  Triggers: before /commit with 3+ files changed, after completing a feature, after refactoring,
  when the user asks for review, "review my code", "check my changes", "is this correct".
type: workflow
---

# Code Review — Plugin Routing

## When to use (auto-trigger)

- **Before /commit** when 3+ files have been changed
- **After completing a feature** — verify before declaring "Done"
- **After a refactor** — ensure behavior is preserved
- **Never** on trivial changes (typo fix, single-line config change)

## Available agents (pr-review-toolkit plugin)

| Agent | Use when |
| ----- | -------- |
| `pr-review-toolkit:code-reviewer` | General review (correctness, conventions, quality) |
| `pr-review-toolkit:code-simplifier` | Post-feature cleanup, complexity reduction |
| `pr-review-toolkit:silent-failure-hunter` | Error handling, logging, silent failures |
| `pr-review-toolkit:pr-test-analyzer` | Test coverage gaps, missing tests |
| `pr-review-toolkit:type-design-analyzer` | Type invariants, encapsulation quality |
| `pr-review-toolkit:comment-analyzer` | Comment accuracy, technical debt in docs |

## Spec consistency pre-check

Before routing to agents, check spec alignment:

1. `git diff --name-only` → list changed source files
2. For each, infer domain from parent directory (`src/<domain>/`, `app/<domain>/`)
3. If `docs/specs/<domain>.md` exists → pass its **User Stories** and **Behavior** sections as context to `code-reviewer`
4. If no spec exists and change is a new feature → flag that `/spec-update` should run

Advisory only — never blocks the review.

## Process

### Quick review (default)

Use the Agent tool with `subagent_type: "pr-review-toolkit:code-reviewer"` to review current changes.

### Deep review (3+ files or pre-release)

Launch multiple agents in parallel for comprehensive coverage:

1. `pr-review-toolkit:code-reviewer` — correctness and conventions
2. `pr-review-toolkit:silent-failure-hunter` — error handling gaps
3. `pr-review-toolkit:pr-test-analyzer` — test coverage
4. **Spec context** (when `docs/specs/<domain>.md` exists): pass relevant spec sections to `code-reviewer` to detect behavioral regressions

Synthesize results into a single verdict: **Ready to Merge**, **Needs Attention**, or **Needs Work**.

## After the review

- **Critical issues**: Fix them before committing (Level 1 autonomy for obvious fixes)
- **Suggestions**: Present to the user for decision (Level 3)
- **Clean review**: Proceed to /commit
