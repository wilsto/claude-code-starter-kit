# CLAUDE.md — Rust Project

## Project Identity

<!-- Replace with your project description -->

## Structure

```text
project/
├── src/           → source code
├── tests/         → integration tests
├── docs/          → documentation
├── .claude/       → Claude Code config (hooks, skills)
└── memory/        → persistent cross-session memory
```

## Workflow

1. Edit code in this repo
2. Run tests: `cargo test`
3. `/commit` → conventional commit with quality gate
4. Push: `git push origin main`

## TDD Rules (mandatory)

1. Write ONE failing test (RED) → run `cargo test` → confirm FAIL
2. Write minimum code to pass (GREEN) → confirm PASS
3. Refactor only if obvious duplication → tests still green
- Skill `/tdd` available for the complete workflow
- Hook `tdd-guard.js` reminds automatically when editing `src/`
- Never write code before the test
- Always show the user RED output, then GREEN output
- 1 test → 1 fix → repeat (vertical slicing)

## Quality Gate (before every commit)

Pre-commit checks run by `/commit` skill:
- **Secret scan** (blocking): no api_key/token/password/bearer patterns in staged files
- **Slop scan** (advisory): no debug prints, no unnecessary comments restating code
- **Format check**: `cargo fmt --check`
- **Tests must be green**: `cargo test`

## Conventions

- **Language**: English for code and commits
- **Commit format**: `feat|fix|chore|docs|refactor|test|perf(scope): description`
- **Never add** `Co-Authored-By` in commit messages
- **Secrets**: never commit `.env*`, `secrets.*`, `config.json` — always maintain `.example` counterparts
- **If a plan goes off track**: stop and re-plan immediately
- **Verify before "Done"**: always prove it works (tests, logs)
- **`/compact` proactively** in long sessions

## Model Selection

| Task | Recommended model |
| --- | --- |
| Quick fixes (typo, rename, single-file) | Haiku (`/model haiku`) |
| Features, multi-file, debugging | Sonnet (default) |
| Refactoring, architecture, complex plans | Opus (`/model opus`) |

## Secrets

Never commit: `.env*`, `secrets.*`, `*.secret`, `*.key`, `*.pem`, `config.json`
Protected by `block-secrets.js` hook (hard deny).
