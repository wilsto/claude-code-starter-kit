# Code Simplifier — Sub-agent Workflow

Analyze the codebase (or a specific file/directory) for simplification opportunities.

## Usage

`/simplify` — analyze recently changed files
`/simplify path/to/file.ts` — analyze a specific file

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
