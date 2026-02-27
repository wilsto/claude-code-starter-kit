---
name: simplify
description: >
  Auto-invoke a code simplifier sub-agent after completing a feature or refactor.
  Finds dead code, over-abstraction, duplication, and unnecessary complexity.
  Triggers: after a feature is complete, after refactoring, when code feels complex,
  "simplify", "clean up", "reduce complexity", "too complex".
type: workflow
---

# Code Simplifier — Sub-agent Workflow

## When to use (auto-trigger)

- **After completing a feature** — before the final commit, check for accidental complexity
- **After a large refactor** — verify the refactor actually simplified things
- **When a file exceeds ~200 lines** — look for extraction opportunities
- **When duplicated logic is suspected** — find and report it
- **Never** during active TDD cycles (wait until GREEN + commit)

## Process

Use the Task tool to spawn a code-simplifier sub-agent with the following instructions:

### Sub-agent prompt

You are a code simplifier. Your goal is to find opportunities to reduce complexity without changing behavior.

1. If a specific path was given, focus on that file/directory. Otherwise, look at recently changed files via `git log --oneline -10 --name-only`
2. For each file, evaluate:
   - **Dead code**: Unused functions, unreachable branches, commented-out code
   - **Over-abstraction**: Interfaces with one implementation, unnecessary wrapper layers
   - **Duplication**: Copy-pasted logic that could be extracted
   - **Complexity**: Nested conditionals that could be flattened, long functions that could be split
   - **Dependency weight**: Heavy imports used for trivial operations
3. Produce a report:

```
## Simplification Opportunities

### High Impact
- [file:line] description — estimated lines saved: N

### Medium Impact
- [file:line] description

### Low Impact / Cosmetic
- [file:line] description
```

Do NOT make changes. Report only. The user will decide which simplifications to apply.

## After the analysis

- **High impact items**: Present to the user for approval before applying (Level 3)
- **Medium/low items**: Note for later, do not apply unless asked
