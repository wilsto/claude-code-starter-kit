<!--
SETUP CHECKLIST — Run once, then delete this block:
[ ] 1. Search-replace all {{PLACEHOLDER}} values in this file
[ ] 2. Fill in CLAUDE.local.md with your personal preferences
[ ] 3. Edit .claude/hooks/tdd-guard.js: update SRC_DIRS for your project layout
[ ] 4. Edit .claude/hooks/block-secrets.js: add project-specific secret file names
[ ] 5. Edit skills/commit/SKILL.md: fill in FORMAT_CHECK_COMMAND and TEST_COMMAND
[ ] 6. Edit skills/tdd/SKILL.md: fill in TEST_COMMAND variants
[ ] 7. Update memory/MEMORY.md: fill in project description and user preferences
[ ] 8. Test hooks: see README.md "Test des hooks" section
[ ] 9. Delete this checklist block
-->

# CLAUDE.md — {{PROJECT_NAME}}

## Project Identity

{{PROJECT_DESCRIPTION}}

## Conventions & Rules

Rules are split into files for sync between template and global config:

- **Global rules** (`~/.claude/rules/`): roles, quality, workflow, git, security, conventions, python-uv
- **Project rules** (`.claude/rules/`): stack-specific (python, node, nextjs, go, rust)
- **Precedence**: `.claude/rules/` (project) > `CLAUDE.md` > `~/.claude/rules/` (global)

Run `/sync-global` to synchronize rules between this template and global config.

## Structure

```text
{{PROJECT_NAME}}/
├── {{SRC_DIR}}        → source code
├── {{TEST_DIR}}       → test files (mirror of src/)
├── docs/              → documentation
├── .claude/           → Claude Code config (hooks, skills, commands)
│   ├── hooks/         → automatic hooks (security, TDD, memory, skill eval)
│   ├── commands/      → slash commands (/commit, /tdd, /review, /simplify, /test-runner)
│   ├── rules/         → project + generic rules (synced with ~/.claude/rules/)
│   ├── stacks/        → language-specific guides (read on demand)
│   └── audit-config.json → audit skip decisions & last results (created by /audit-conformity)
└── memory/            → persistent cross-session memory
    ├── MEMORY.md          → project identity, session notes (auto-injected)
    ├── polaris.md         → north star: top of mind, goals, values (auto-injected)
    ├── patterns.md        → technical patterns, debugging lessons (on-demand)
    ├── decisions.md       → architectural decision records (on-demand)
    ├── active-context.md  → current work context (focus + next steps auto-injected)
    ├── scratchpad.md      → running work log (last 30 lines auto-injected)
    └── session-cache.json → session handoff (auto-generated)
```

## Skills Conventions

### Taxonomy (3 tiers)

| Type | Purpose | Duration | Example |
| ---- | ------- | -------- | ------- |
| **component** | Template for a specific deliverable | 10-30 min | `user-story`, `problem-statement` |
| **interactive** | Guided discovery with adaptive questions | 30-90 min | `prioritization-advisor`, `discovery-interview-prep` |
| **workflow** | End-to-end process orchestrating other skills | hours-weeks | `prd-development`, `commit`, `tdd` |

### Frontmatter (required)

Every `.claude/skills/<name>/SKILL.md` must start with:

```yaml
---
name: kebab-case-name        # must match folder name, max 64 chars
description: >               # max 200 chars, include trigger phrases
  What this skill does and when to invoke it.
  Triggers: "keyword1", "keyword2".
type: component|interactive|workflow
---
```

### Anatomy (6 sections, in order)

1. **Purpose** — What this skill does and when to use it
2. **Key Concepts** — Frameworks, definitions, anti-patterns
3. **Application** — Step-by-step instructions (templates for component, question flows for interactive)
4. **Examples** — Concrete cases showing good and bad usage
5. **Common Pitfalls** — Named failure modes with Symptom/Consequence/Fix format
6. **References** — Related skills, external sources, credit

### Interactive Skills Protocol

All interactive skills delegate facilitation behavior to `workshop-facilitation` skill:

- **3 entry modes:** Guided (question by question) / Context dump (paste everything) / Best guess (infer + label assumptions)
- **Progress labels:** Show `Context Qx/N` during collection, `Scoring Qx/N` during assessment
- **One question per turn:** Wait for answer before continuing
- **Decision points only:** Offer numbered recommendations only when a choice is needed

### Available PM Skills

- `/user-story` — Write user stories with Cohn format + Gherkin acceptance criteria
- `/prd-development` — Structured PRD in 8 phases (2-4 days)
- `/prioritization-advisor` — Choose the right prioritization framework (RICE, ICE, Kano...)
- `/discovery-interview-prep` — Prepare customer interviews (Mom Test style)
- `/opportunity-solution-tree` — OST: outcomes → opportunities → solutions → POC

## Workflow

1. Edit code in this repo
2. Run tests: `{{TEST_COMMAND}}`
3. `/commit` → conventional commit with quality gate
4. Push: `git push origin {{DEFAULT_BRANCH}}`

<!-- MULTI-STACK: If this project uses multiple stacks (e.g., Python backend + Next.js frontend),
     /setup will replace the single {{TEST_COMMAND}} references above with this section.
     Delete this comment block for single-stack projects.

## Active Stacks

### Backend — {{STACK_NAME}}
- **Source**: `{{STACK_SRC_DIR}}`
- **Tests**: `{{STACK_TEST_DIR}}`
- **Test command**: `{{STACK_TEST_COMMAND}}`
- **Format**: `{{STACK_FORMAT_CHECK_COMMAND}}`
- **Stack guide**: `.claude/stacks/{{STACK_FILE}}`

### Frontend — {{STACK_NAME}}
- **Source**: `{{STACK_SRC_DIR}}`
- **Tests**: `{{STACK_TEST_DIR}}`
- **Test command**: `{{STACK_TEST_COMMAND}}`
- **Format**: `{{STACK_FORMAT_CHECK_COMMAND}}`
- **Stack guide**: `.claude/stacks/{{STACK_FILE}}`
-->

## Project-Specific Config

- **TDD**: use `/tdd` skill — hook `tdd-guard.js` reminds automatically
- **Quality gate**: `/commit` runs secret scan, slop scan, format (`{{FORMAT_COMMAND}}`), tests (`{{TEST_COMMAND}}`)
- **Commit rhythm**: `commit-reminder.js` (auto-detect), `post-commit-lessons.js` (post-commit eval)
- **Environment awareness**: `session-context.js` injects cwd, branch, git status, stack at session start

## Scratchpad Protocol (compact-resilient)

Maintain `memory/scratchpad.md` as a running work log during active sessions:

- **When to write**: After completing each subtask, before switching context
- **Format**: Append-only, latest entry at the bottom, structured entries:

  ```text
  ### HH:MM — Task title
  - Done: what was completed
  - Next: immediate next step
  - Decision: key decision made (if any)
  ---
  ```

- **Content**: Current task, what was done, what's next, key decisions
- **Why**: Survives /compact — last 30 lines re-injected by session-context.js
- **Cleanup**: Clear at the start of each new feature/story

## Polaris Protocol (north star)

`memory/polaris.md` contains the user's strategic context: top of mind, goals, and values.

- **Auto-injected** at session start (~100 tokens) by session-context.js
- **Setup**: run `/polaris` to fill or update interactively with guided questions
- **Auto-proposed** when polaris.md is empty at session start
- **Update frequency**: every 1-2 weeks, or when priorities shift
- **Modification**: Level 3 (propose & wait for PO approval)
- **Usage**: reference Polaris when evaluating alignment of decisions, priorities, or new opportunities

## Compact Instructions

When /compact is triggered, always preserve in the summary:

- Full list of modified files and their purpose
- Current task status (what's done, what's in progress)
- Key decisions made and their rationale
- Active test commands and environment-specific details
- Any blocking issues or open questions for PO

## Model Selection

| Task | Recommended model |
| --- | --- |
| Quick fixes (typo, rename, single-file) | Haiku (`/model haiku`) |
| Features, multi-file, debugging | Sonnet (default) |
| Refactoring, architecture, complex plans | Opus (`/model opus`) |
