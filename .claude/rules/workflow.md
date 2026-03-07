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
- **After plan execution**: when a plan (plan mode) has been fully executed, run `/commit-flash` as the final action

Advisory only — never auto-commit. If declined, don't repeat for same change.

## Project Tracking (source of truth)

- **Roadmap, phases, and tasks** live in GitHub Projects V2 — not in Claude's internal plans
- Before starting work on a project, read its GitHub Project:
  `gh project item-list <NUMBER> --owner wilsto --format json`
- Claude's internal plans (`~/.claude/plans/`) are ephemeral implementation details — not the roadmap
- TodoWrite tracks in-session subtask execution only — the backlog lives in GitHub
- Phase transitions are Level 3 decisions (propose & wait for PO approval)
- Use `/roadmap` to discuss phases, check progress, or migrate internal plans
- **Project Template**: a GitHub Project named "Project Template" exists with all standard fields pre-configured. New projects are created by copying it via the `copyProjectV2` GraphQL mutation (see `/setup` Step 1c). Never ask the PO to create projects manually.

### Issue Creation Procedure (mandatory)

Creating a GitHub issue is a **3-step process**. An issue that exists only in the repo but not in the project is invisible on the board.

**Step 1 — Create the issue:**
```bash
gh issue create --repo wilsto/<REPO> --title "type: description" --body "..."
```

**Step 2 — Add to the GitHub Project:**
```bash
gh project item-add <PROJECT_NUMBER> --owner wilsto --url <ISSUE_URL>
```
This returns an item ID (`PVTI_...`). Without this step, the issue will NOT appear on the project board.

**Step 3 — Set ALL project fields** via GraphQL (labels on the issue are NOT project fields):
```bash
# Get the item ID from step 2, then set each field:
gh api graphql -f query='mutation { updateProjectV2ItemFieldValue(input: {
  projectId: "<PROJECT_ID>",
  itemId: "<ITEM_ID>",
  fieldId: "<FIELD_ID>",
  value: { singleSelectOptionId: "<OPTION_ID>" }
}) { projectV2Item { id } } }'
```

Fields to set (all required for DoR):

| Field | Description | How to get IDs |
| --- | --- | --- |
| **Status** | Todo / In Progress / Done | `gh project field-list <N> --owner wilsto` |
| **Phase** | Discovery / MVP / Beta / Stable / Maintenance | same |
| **Priority** | Critical / High / Medium / Low | same |
| **Size** | XS / S / M / L / XL | same |
| **Type** | Feature / Bug / Chore / Docs / Infra | same |
| **Start date** | Auto: today if In Progress/Done, empty if Todo | `value: { date: "YYYY-MM-DD" }` |

**Date rules** (never ask the PO for dates — derive them automatically):

- **Start date**: set to today when Status = In Progress or Done. Leave empty for Todo (work hasn't started). For historical/migrated issues, use the earliest known date (first commit, release date).
- **Target date**: leave empty unless the PO spontaneously provides a deadline. Never invent deadlines.

**Shortcut**: cache field/option IDs in `CLAUDE.local.md` after first lookup to avoid repeated queries.

> **Rule**: Never consider an issue "created" until all 3 steps are complete. If any step fails, fix it before moving on.

## Definition of Ready / Done (DoR/DoD)

### DoR — An issue is Ready when:

- Title is clear and actionable
- Description includes acceptance criteria (what "done" looks like)
- Phase, Priority, Size are set in GitHub Project
- Dependencies are identified (no hidden blockers)
- Functional spec exists in `docs/specs/<domain>.md` OR explicitly waived by PO (advisory for bug fixes, expected for new features)

### DoD — An issue is Done when:

- All acceptance criteria are met with verifiable proof
- Tests pass AND coverage did not drop (advisory)
- Functional spec updated if user-visible behavior changed (automated by `/commit` step 6, verify if skipped)
- Public symbols are documented
- Changes are committed via `/commit` (quality gate passed)
- Issue is closed by PO (never auto-closed by Claude)
