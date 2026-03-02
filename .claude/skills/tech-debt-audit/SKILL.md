---
name: tech-debt-audit
description: >
  Audit the codebase for technical debt across 4 dimensions: code health, test & reliability,
  documentation & specs, dependencies & infra. Produces a prioritized remediation plan.
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

### Debt Dimensions

| Dimension | Debt categories scanned |
| --- | --- |
| **Code Health** | Complexity (cyclomatic, nesting), Duplication (near-identical logic), Coupling (circular deps, leaky abstractions), Dead code (unused exports, unreachable branches) |
| **Test & Reliability** | Test coverage (missing/brittle tests), Error handling (silent failures, missing catch), Security (delegates to `security-auditor` agent if available) |
| **Documentation & Specs** | Spec coverage (domains without `docs/specs/<domain>.md`), Spec freshness (History entry vs recent commits), Spec completeness (missing User Stories/Behavior), Config docs (`.env.example` sync, undocumented settings), README alignment |
| **Dependencies & Infra** | Outdated packages, Known vulnerabilities, Build/CI health (slow pipelines, flaky tests), Migration debt (pending/irreversible migrations) |

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

### Question 2: Audit Dimensions (multi-select)

"Which dimensions should this audit cover? Select all that apply."

1. **Code Health** -- Complexity, duplication, coupling, dead code
2. **Test & Reliability** -- Test coverage, error handling, security patterns (delegates to security-auditor)
3. **Documentation & Specs** -- Spec coverage/freshness, config docs, README alignment
4. **Dependencies & Infra** -- Outdated deps, vulnerabilities, build/CI health, migration debt

> Default if none selected: all 4 dimensions.
> Security scan within "Test & Reliability" delegates to the `security-auditor` agent (`.claude/agents/security-auditor.md`) -- it does NOT duplicate `/security-audit`.

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

After collecting answers, delegate the codebase scan to the **tech-debt-auditor agent** (`.claude/agents/tech-debt-auditor.md`):

```text
Use the Agent tool with subagent_type="general-purpose" and model="haiku".
Pass the collected context (scope, priorities, constraints, thresholds) as the prompt.
The agent scans the codebase and returns a structured Technical Debt Report.
```

The agent handles: codebase scanning, dimension-based analysis, file scoring, git churn cross-referencing. It returns a health-scored report with a prioritized remediation plan. Pass the selected dimensions so the agent scans only what was requested.

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
