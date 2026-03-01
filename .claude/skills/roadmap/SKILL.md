---
name: roadmap
description: >
  Discuss roadmap, phases, and progress for the current project.
  Read/update GitHub Projects, migrate internal plans, review phase status.
  Triggers: "roadmap", "phases", "avancement", "progress", "migrate plans".
type: interactive
---

## Purpose

Provide a single entry point for all roadmap-related interactions on the current project: check progress, discuss phases, reprioritize, or migrate legacy Claude plans into GitHub Issues. Everything reads from and writes to the project's **GitHub Project V2** (source of truth).

This is not a planning workshop -- it's an operational tool for PO/Dev sync on where things stand and what's next.

## Key Concepts

### Source of Truth

- **Roadmap, phases, and tasks** live in GitHub Projects V2
- Claude's internal plans (`~/.claude/plans/`) are ephemeral implementation details
- TodoWrite tracks in-session subtask execution only -- the backlog lives in GitHub
- Phase transitions are **Level 3 decisions** (propose & wait for PO approval)

### Project Discovery

The skill reads the project number from `CLAUDE.md` (section "Project Tracking") or discovers it via:
```bash
gh project list --owner wilsto --format json
```

### Phase Model

Projects use a custom field "Phase" with values:
- `🔬 Discovery` -- exploring problem space, user research
- `🏗️ MVP` -- building minimum viable product
- `🚀 Beta` -- testing with real users, stabilizing
- `✅ Stable` -- production-ready, maintenance mode
- `🧹 Maintenance` -- bug fixes, dependency updates, minor improvements

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

It defines: session heads-up + entry mode, one-question turns, progress labels, interruption handling, numbered recommendations at decision points, quick-select options.

This file defines the domain-specific logic. If there is a conflict, follow this file's domain logic.

## Application

### Step 0: Mode Selection

On invocation, present 3 modes:

> "What do you want to do with the roadmap?"
> 1. **Status** -- See where things stand (phases, progress, blockers)
> 2. **Discuss** -- Talk about priorities, phase transitions, or new work
> 3. **Migrate** -- Import legacy Claude plans into GitHub Issues

### Mode 1: Status

1. Read the project number from CLAUDE.md or discover via `gh project list --owner wilsto`
2. Fetch all items: `gh project item-list <N> --owner wilsto --format json`
3. Fetch field definitions: `gh project field-list <N> --owner wilsto`
4. Synthesize and display:

```
## 📊 Project Status -- <project-name>

### By Phase
| Phase | Open | In Progress | Done | Total |
|-------|------|-------------|------|-------|
| 🏗️ MVP | 5 | 2 | 8 | 15 |
| 🚀 Beta | 3 | 0 | 1 | 4 |

### Current Focus (In Progress)
- #42 — Implement Stripe checkout [🔴 Critical, M]
- #45 — Fix auth redirect bug [🟠 High, S]

### Blockers
- #43 — Waiting on PO decision: pricing model

### Summary
15/19 items tracked. 42% complete. Active phase: 🏗️ MVP.
```

5. Ask: "Want to drill into a specific phase or issue?"

### Mode 2: Discuss

1. Run Status (above) first to establish context
2. Ask: "What would you like to discuss?"
   1. **Phase transition** -- propose moving to next phase (Level 3)
   2. **Reprioritize** -- change priority on specific issues
   3. **Add work** -- create new issues or epics
   4. **Review phase** -- retrospective on current phase

#### Phase Transition Flow

1. Show completion stats for current phase
2. List any open items that would block transition
3. Propose: "Ready to move from 🏗️ MVP to 🚀 Beta?"
4. **Wait for PO approval** (Level 3 decision)
5. If approved, update Phase field on remaining open items via `gh project item-edit`

#### Add Work Flow

1. Ask: title, description, phase, priority, size, type
2. Create issue: `gh issue create --repo wilsto/<REPO> --title "..." --body "..." --label "phase:..."`
3. If epic with sub-tasks, create parent issue then sub-issues via `mcp__github__sub_issue_write`
4. Confirm creation with issue numbers

### Mode 3: Migrate

1. Identify the current repo name from git remote or cwd
2. Scan `~/.claude/plans/*.md` for plans related to this project:
   - grep for repo name (e.g., `coachbywill-v2`, `bookmark-veille`)
   - grep for file paths matching the project directory
3. List matching plans with summary:

```
Found 2 plans related to this project:

1. ancient-floating-prism.md — "Phase 2 — Stripe + MBTI" (10 slices)
2. scalable-sauteeing-clock.md — "Admin Toggle Tier + Seed Accounts"

Which plans do you want to migrate? (1, 2, both, none)
```

4. For each selected plan:
   a. Read the full plan file
   b. Extract structured slices/phases/tasks
   c. Create an epic issue with the plan title
   d. Create sub-issues for each slice/task
   e. Set Phase, Priority, Size, Type fields where inferrable
   f. Link sub-issues to the epic via `mcp__github__sub_issue_write`
5. Show summary of created issues with links
6. Do NOT delete the plan files (keep as historical reference)

## Examples

### Example: Status Check

```
User: /roadmap
Claude: What do you want to do with the roadmap?
  1. Status  2. Discuss  3. Migrate
User: 1

Claude:
## 📊 Project Status — coachbywill-v2

### By Phase
| Phase | Open | In Progress | Done |
|-------|------|-------------|------|
| 🏗️ MVP | 3 | 1 | 12 |

### Current Focus (In Progress)
- #42 — Implement Stripe checkout [🔴 Critical, M]

### Summary
16 items tracked. 75% complete. Active phase: 🏗️ MVP.

Want to drill into a specific phase or issue?
```

### Example: Phase Transition

```
User: /roadmap → Discuss → Phase transition
Claude: Current phase: 🏗️ MVP (75% complete)

Open items blocking transition:
- #42 — Stripe checkout (In Progress)
- #50 — MBTI test flow (Todo)
- #51 — Freemium gating (Todo)

⚠️ 3 items still open. Proposal: close or defer these before moving to 🚀 Beta.
What do you want to do?
  1. Defer open items and transition anyway
  2. Keep working on MVP until these are done
  3. Let me review each item
```

### Example: Plan Migration

```
User: /roadmap → Migrate
Claude: Found 2 plans related to coachbywill-v2:

1. ancient-floating-prism.md — "Phase 2 — Stripe + MBTI" (10 slices)
2. scalable-sauteeing-clock.md — "Admin Toggle Tier" (2 tasks)

Which to migrate? (1, 2, both, none)
User: both

Claude: Migrating...
✅ Created epic #60 "Phase 2 — Stripe + MBTI" with 10 sub-issues (#61-#70)
✅ Created epic #71 "Admin Toggle Tier" with 2 sub-issues (#72-#73)
All items set to Phase: 🏗️ MVP, Status: Todo.
```

## Common Pitfalls

### Pitfall 1: No Project Number
**Symptom:** CLAUDE.md doesn't have a Project Tracking section yet.
**Fix:** Fall back to `gh project list --owner wilsto` and match by repo name. Suggest adding the section to CLAUDE.md.

### Pitfall 2: Stale Status
**Symptom:** GitHub Project has items but Claude shows old data.
**Fix:** Always fetch fresh data via `gh project item-list`. Never cache across sessions.

### Pitfall 3: Migrating Already-Migrated Plans
**Symptom:** Running Migrate twice creates duplicate issues.
**Fix:** Before creating, search for existing issues with matching titles. Warn if duplicates found.

### Pitfall 4: Phase Transition Without PO
**Symptom:** Claude transitions phase autonomously.
**Fix:** Phase transitions are Level 3 -- always propose and wait. Never auto-transition.

## References

### Related Skills
- [`workshop-facilitation`](../workshop-facilitation/SKILL.md) -- interaction protocol
- [`polaris`](../polaris/SKILL.md) -- strategic context (goals, values)
- [`commit`](../commit/SKILL.md) -- quality-gated commit workflow

### Tools Used
- `gh project list/item-list/field-list/item-edit` -- GitHub CLI project commands
- `gh issue create/list` -- issue management
- `mcp__github__issue_write` -- MCP issue creation
- `mcp__github__sub_issue_write` -- MCP sub-issue linking
