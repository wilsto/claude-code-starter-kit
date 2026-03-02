# Installed Plugins Reference

## feature-dev

- **`/feature-dev`** — Guided 7-phase feature development (discovery → explore → design → implement → review → summary)
- Agents: `code-explorer` (trace execution paths), `code-architect` (design blueprints), `code-reviewer` (quality review)
- Use when: building a new feature, exploring unfamiliar codebase areas, need structured architecture design

## pr-review-toolkit

- **`/review-pr`** — Comprehensive PR review with 6 specialized agents
- Agents: `comment-analyzer`, `pr-test-analyzer`, `silent-failure-hunter`, `type-design-analyzer`, `code-reviewer`, `code-simplifier`
- Use when: reviewing PRs, checking test coverage, finding silent failures, simplifying code

## hookify

- **`/hookify [instruction]`** — Create hook rules from natural language
- **`/hookify:list`** — List active rules | **`/hookify:configure`** — Enable/disable rules
- Use when: preventing recurring mistakes, enforcing patterns without editing hooks.json

## claude-md-management

- **`/revise-claude-md`** — Capture session learnings into CLAUDE.md
- **`claude-md-improver`** — Audit CLAUDE.md quality against codebase state
- Use when: end of session, CLAUDE.md maintenance, project memory optimization

## claude-code-setup

- **`claude-automation-recommender`** — Scan codebase and recommend Claude Code automations
- Use when: setting up Claude Code for a new project, optimizing workflows

## security-guidance

- Hook-only: PreToolUse warnings on Edit/Write for security patterns (injection, credentials, sensitive files)
- No commands — always active automatically
