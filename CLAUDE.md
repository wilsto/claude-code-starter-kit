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

<!-- Replace with your project description -->
{{PROJECT_DESCRIPTION}}

## Structure

```text
{{PROJECT_NAME}}/
├── {{SRC_DIR}}        → source code
├── {{TEST_DIR}}       → test files (mirror of src/)
├── docs/              → documentation
├── .claude/           → Claude Code config (hooks, skills)
│   └── stacks/        → language-specific guides (read on demand)
└── memory/            → persistent cross-session memory
```

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

## TDD Rules (mandatory)

1. Write ONE failing test (RED) → run `{{TEST_COMMAND}}` → confirm FAIL
2. Write minimum code to pass (GREEN) → confirm PASS
3. Refactor only if obvious duplication → tests still green
- Skill `/tdd` available for the complete workflow
- Hook `tdd-guard.js` reminds automatically when editing `{{SRC_DIR}}`
- Never write code before the test
- Always show the user RED output, then GREEN output
- 1 test → 1 fix → repeat (vertical slicing)

## Commit Rhythm (proactive)

Suggest `/commit` at these natural breakpoints during feature development:
- **After TDD GREEN**: test passes after implementation — this is a clean commit point
- **After REFACTOR**: refactoring step complete, tests still green — commit the refactor separately
- **After a logical unit**: a coherent piece of work is done (new endpoint, new module, config change)
- **Before switching context**: about to start a different feature or fix

Rules:

- Advisory only — never auto-commit, always ask
- Do not suggest after every minor edit — only at meaningful breakpoints
- If the user declines, continue without repeating the suggestion for the same change
- One commit per logical unit keeps git history clean and reviewable
- Hook `commit-reminder.js` detects test-pass + uncommitted changes automatically
- Hook `post-commit-lessons.js` triggers lesson evaluation after each commit

## Quality Gate (before every commit)

Pre-commit checks run by `/commit` skill:
- **Secret scan** (blocking): no api_key/token/password/bearer patterns in staged files
- **Slop scan** (advisory): no debug prints, no unnecessary comments restating code
- **Format check**: `{{FORMAT_COMMAND}}`
- **Tests must be green**: `{{TEST_COMMAND}}`

## Conventions

- **Language**: {{CONVERSATION_LANGUAGE}} for conversation, English for code and commits
- **Commit format**: `feat|fix|chore|docs|refactor|test|perf(scope): description`
- **Never add** `Co-Authored-By` in commit messages
- **Secrets**: never commit `.env*`, `secrets.*`, `config.json` — always maintain `.example` counterparts
- **If a plan goes off track**: stop and re-plan immediately, do not push forward
- **Verify before "Done"**: always prove it works (tests, logs) before declaring complete
- **Autonomous bug fixing**: diagnose and fix without asking for step-by-step guidance
- **`/compact` proactively** in long sessions before context saturation

## Model Selection

| Task | Recommended model |
| --- | --- |
| Quick fixes (typo, rename, single-file) | Haiku (`/model haiku`) |
| Features, multi-file, debugging | Sonnet (default) |
| Refactoring, architecture, complex plans | Opus (`/model opus`) |

## Secrets

Never commit: `.env*`, `secrets.*`, `*.secret`, `*.key`, `*.pem`, `config.json`
Always maintain `.example` files for every secret file.
Protected by `block-secrets.js` hook (hard deny).
