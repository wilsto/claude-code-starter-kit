# Task Workflow

## Execution Flow

1. PO gives a feature, story, or bug with acceptance criteria
2. Claude decomposes into technical subtasks (TodoWrite or Task tool), one per vertical slice
3. **DoR check**: PO validates the task list before implementation begins — each task must be clear, scoped, and testable
4. Claude executes: mark `in_progress` → do work → mark `completed`
5. At each natural breakpoint → progress report + commit suggestion
6. `/compact` proactively in long sessions before context saturation

## Stopping Protocol

When blocked or finishing a task, ALWAYS use this format:

**Done:** [list of completed items with proof — test output, logs]
**Blocked** (if applicable): [what blocks + what was tried]
**Open Questions** (if applicable): [decisions needed from PO]
**Files Touched:** [list of modified/created/deleted files]

**DoD check**: never declare "Done" without proof (test output, working demo, logs).

## Commit Rhythm

Suggest commit at these natural breakpoints:

- **After TDD GREEN**: test passes → clean commit point
- **After REFACTOR**: tests still green → commit separately
- **After a logical unit**: coherent piece of work done
- **Before switching context**: about to start different work

Advisory only — never auto-commit. If declined, don't repeat for same change.

## Project Tracking (source of truth)

- **Roadmap, phases, and tasks** live in GitHub Projects V2 — not in Claude's internal plans
- Before starting work on a project, read its GitHub Project:
  `gh project item-list <NUMBER> --owner wilsto --format json`
- Claude's internal plans (`~/.claude/plans/`) are ephemeral implementation details — not the roadmap
- TodoWrite tracks in-session subtask execution only — the backlog lives in GitHub
- Phase transitions are Level 3 decisions (propose & wait for PO approval)
- Use `/roadmap` to discuss phases, check progress, or migrate internal plans

## Definition of Ready / Done (DoR/DoD)

### DoR — An issue is Ready when:

- Title is clear and actionable
- Description includes acceptance criteria (what "done" looks like)
- Phase, Priority, Size are set in GitHub Project
- Dependencies are identified (no hidden blockers)

### DoD — An issue is Done when:

- All acceptance criteria are met with verifiable proof
- Tests pass AND coverage did not drop (advisory)
- Public symbols are documented
- Changes are committed via `/commit` (quality gate passed)
- Issue is closed by PO (never auto-closed by Claude)
