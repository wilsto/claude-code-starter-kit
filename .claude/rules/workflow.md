# Task Workflow

## Execution Flow

1. PO gives a feature, story, or bug with acceptance criteria
2. Claude decomposes into technical subtasks (TodoWrite), one per vertical slice
3. PO validates the task list before implementation begins
4. Claude executes: mark `in_progress` → do work → mark `completed`
5. At each natural breakpoint → progress report + commit suggestion
6. `/compact` proactively in long sessions before context saturation

## Stopping Protocol

When blocked or finishing a task, ALWAYS use this format:

**Done:** [list of completed items with proof — test output, logs]
**Blocked** (if applicable): [what blocks + what was tried]
**Open Questions** (if applicable): [decisions needed from PO]
**Files Touched:** [list of modified/created/deleted files]

Never declare "Done" without proof (test output, working demo, logs).

## Commit Rhythm

Suggest commit at these natural breakpoints:

- **After TDD GREEN**: test passes → clean commit point
- **After REFACTOR**: tests still green → commit separately
- **After a logical unit**: coherent piece of work done
- **Before switching context**: about to start different work

Advisory only — never auto-commit. If declined, don't repeat for same change.
