---
name: tech-debt-audit
description: >
  Audit the codebase for technical debt: complexity, duplication, dead code, outdated deps,
  and missing tests. Produces a prioritized remediation plan.
  Triggers: "tech debt", "audit technique", "dette technique", "code health", "assess technical debt".
type: interactive
---

## Purpose

Perform a comprehensive technical debt assessment across the entire codebase (or a specific module). Use this when you need a global health check -- not a per-commit review, but a bird's-eye view of accumulated debt. Outputs a scored health report with a prioritized remediation plan.

This is not a code review -- `/review` evaluates individual changes. This skill evaluates the codebase as a whole.

## Key Concepts

### The Technical Debt Quadrant (Martin Fowler)

| | Prudent | Reckless |
| --- | --- | --- |
| **Deliberate** | "We know we're cutting corners, and we'll fix it" | "We don't have time for design" |
| **Inadvertent** | "Now we know how we should have done it" | "What's layering?" |

### Debt Categories

- **Complexity debt** -- High cyclomatic complexity, deeply nested logic, god classes/functions
- **Duplication debt** -- Copy-pasted logic, near-identical functions, redundant patterns
- **Coupling debt** -- Tight dependencies between modules, circular imports, leaky abstractions
- **Test debt** -- Missing coverage, brittle tests, untested critical paths
- **Dependency debt** -- Outdated packages, known vulnerabilities, abandoned libraries
- **Dead code debt** -- Unused imports, unreachable branches, orphaned functions/exports

### Anti-Patterns

- **Not a one-time event:** Debt accumulates continuously -- reassess every quarter
- **Not a blame tool:** Debt is normal; the goal is informed prioritization, not finger-pointing
- **Not exhaustive:** Focus on actionable findings, not cataloging every imperfection

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

It defines: session heads-up + entry mode (Guided, Context dump, Best guess), one-question turns, progress labels, interruption handling, numbered recommendations at decision points, quick-select options.

This file defines the domain-specific assessment content. If there is a conflict, follow this file's domain logic.

## Application

This interactive skill asks **up to 4 adaptive questions**, then performs a deep codebase scan.

### Question 1: Audit Scope

"What scope should this audit cover?"

1. **Entire project** -- Full codebase health check
2. **Specific module/directory** -- Focus on a subsystem (specify path)
3. **Recently changed files** -- Last 30 days of git history
4. **Hot paths only** -- Files with most commits/changes (churn analysis)

### Question 2: Team Priorities

"What matters most to your team right now?"

1. **Maintainability** -- Code is hard to understand or modify
2. **Reliability** -- Bugs keep appearing in certain areas
3. **Performance** -- Slow paths or resource-heavy operations
4. **Testability** -- Hard to test, low confidence in changes

### Question 3: Constraints

"What constraints should the remediation plan respect?"

1. **Time-boxed** -- We have N sprints/days for refactoring
2. **Incremental only** -- No big rewrites, must be done alongside features
3. **No constraints** -- We can dedicate focused refactoring time
4. **Critical fixes only** -- Only address things that cause production issues

### Question 4: Severity Thresholds

"What thresholds should flag a file as problematic?"

1. **Strict** -- Flag anything above 10 cyclomatic complexity, 200 LOC, or 3+ levels of nesting
2. **Moderate** -- Flag above 20 complexity, 400 LOC, or 5+ nesting levels
3. **Lenient** -- Only flag extreme cases (50+ complexity, 800+ LOC)
4. **Auto-detect** -- Infer thresholds from the project's existing patterns

### Audit Process

After collecting answers, perform the audit:

1. **Scan the codebase** using Glob, Grep, and Read tools
2. **Analyze each debt category**: complexity, duplication, coupling, tests, dependencies, dead code
3. **Score each file** against the selected thresholds
4. **Cross-reference with git history** to identify high-churn + high-complexity hotspots

### Output: Technical Debt Report

Produce a structured report:

```markdown
## Technical Debt Report — [Project Name]

### Health Score: [A-F]

| Category | Score | Key Finding |
| --- | --- | --- |
| Complexity | B | 3 files above threshold |
| Duplication | C | ~15% near-duplicate logic |
| Coupling | A | Clean module boundaries |
| Test Coverage | D | 40% of critical paths untested |
| Dependencies | B | 2 outdated, 0 vulnerable |
| Dead Code | C | 12 unused exports |

### Top 10 Files at Risk

| # | File | Risk | Reason |
| --- | --- | --- | --- |
| 1 | path/to/file.ts | High | Complexity 35, 0% test coverage, 28 commits/month |
| ... | ... | ... | ... |

### Remediation Plan

#### Quick Wins (< 1 day each)
1. [action] — [file] — [expected impact]

#### Medium Effort (1-3 days)
1. [action] — [file] — [expected impact]

#### Strategic Refactors (1+ week)
1. [action] — [scope] — [expected impact]

### Reassess When
- [trigger 1]
- [trigger 2]
```

## Examples

### Example 1: Healthy Project with Test Debt

- **Context:** Well-structured codebase, clean modules, but only 30% test coverage on business logic
- **Score:** Overall B (Test Coverage: D, all others: A-B)
- **Recommendation:** Focus remediation on test debt. Quick wins: add tests for top-10 most-changed files. No structural refactoring needed.
- **Why NOT full refactor:** Code quality is high -- adding tests is higher ROI than restructuring

### Example 2: Legacy Monolith

- **Context:** 3-year-old codebase, several 1000+ LOC files, circular dependencies, outdated deps
- **Score:** Overall D (Complexity: F, Coupling: D, Dependencies: D)
- **Recommendation:** Start with dependency updates (security risk), then extract the 3 god files into modules. Time-box to 2 sprints.
- **Why NOT rewrite:** Incremental extraction preserves working behavior; rewrite risks regression

## Common Pitfalls

### Pitfall 1: Boiling the Ocean
**Symptom:** Audit produces 200 findings, team is paralyzed
**Consequence:** Nothing gets fixed; audit is shelved
**Fix:** Limit report to top 10 actionable items. Quick wins first. Re-audit after each batch.

### Pitfall 2: Ignoring Churn Data
**Symptom:** Audit flags a complex file that nobody touches
**Consequence:** Refactoring effort wasted on low-impact code
**Fix:** Cross-reference complexity with git churn. High complexity + high churn = priority. High complexity + zero churn = ignore.

### Pitfall 3: Scoring Without Context
**Symptom:** Applying the same thresholds to generated code, test fixtures, or config files
**Consequence:** False positives drown real issues
**Fix:** Exclude generated files, vendored code, and test fixtures from scoring.

### Pitfall 4: Audit Without Follow-Through
**Symptom:** Report is generated, shared, then forgotten
**Consequence:** Debt continues to accumulate
**Fix:** Convert top findings into backlog items with clear acceptance criteria. Schedule reassessment.

### Pitfall 5: Treating All Debt as Bad
**Symptom:** Team tries to eliminate all debt immediately
**Consequence:** Velocity drops, features stall
**Fix:** Some debt is intentional and acceptable. Focus on debt that slows the team down or causes bugs.

## References

### External Frameworks
- Martin Fowler, *Technical Debt Quadrant* (2009)
- Adam Tornhill, *Your Code as a Crime Scene* (2015) -- churn analysis
- Michael Feathers, *Working Effectively with Legacy Code* (2004)

### Related Skills
- `/review` -- Per-change code review (complementary, not overlapping)
- `/simplify` -- Post-change complexity reduction
- `/test-runner` -- Execute tests identified as missing

### Credit
- Inspired by Desktop Commander "Assess Technical Debt" prompt pattern.
