# MEMORY.md — {{PROJECT_NAME}}

> Auto-injected at every session start via session-context.js hook.
> Keep under 200 lines. Detailed notes go in topic files (read on demand).

## Project Identity

<!-- Replace with a 1-2 sentence project description -->
{{PROJECT_DESCRIPTION}}

## User Preferences

<!-- Things Claude should always remember about how you work -->
- Prefer clean solutions over workarounds
- TDD mandatory: RED (test fail) → GREEN (fix) → show output to user
- Ask before any destructive operation

## Platform Notes

<!-- OS/environment quirks that affect how Claude runs commands -->
<!-- Add platform-specific gotchas as you discover them -->

## Key Technical Decisions

<!-- Architectural decisions and WHY — prevents relitigating across sessions -->
<!-- Format: [DECISION] Short title → rationale -->

- [DECISION] Questions au PO = AskUserQuestion, pas du texte → quand le workflow /commit ou un skill a un doute, toujours utiliser AskUserQuestion pour poser la question au PO de manière interactive, jamais écrire la question dans le texte de sortie

## Topic Files (Read on demand, NOT auto-injected)

- `memory/patterns.md` — technical patterns, debugging lessons, reusable solutions
- `memory/decisions.md` — architectural decision records (ADR-lite)

## Auto-injected Files

- `memory/polaris.md` — north star: top of mind, goals, values (~100 tokens)
- `memory/active-context.md` — current work context ("Current Focus" + "Next Steps" sections only)
- `memory/scratchpad.md` — running work log, last 30 lines (survives /compact)

## Custom Agents (`.claude/agents/`)

| Agent | Model | Purpose |
| ----- | ----- | ------- |
| `test-runner` | haiku | Run tests and diagnose failures with root cause analysis |
| `security-auditor` | haiku | Deep security scan (OWASP Top 10, secrets, deps, auth) |
| `tech-debt-auditor` | haiku | Codebase health analysis (complexity, duplication, dead code) |

These agents run in their own context window (haiku) — only summaries return to the main thread.

## Available Agents (from plugins)

### pr-review-toolkit (6 agents)

| Agent | Use when |
| ----- | -------- |
| `pr-review-toolkit:code-reviewer` | General review (correctness, conventions) |
| `pr-review-toolkit:code-simplifier` | Post-feature cleanup, complexity reduction |
| `pr-review-toolkit:silent-failure-hunter` | Error handling, logging gaps |
| `pr-review-toolkit:pr-test-analyzer` | Test coverage gaps |
| `pr-review-toolkit:type-design-analyzer` | Type invariants, encapsulation |
| `pr-review-toolkit:comment-analyzer` | Comment accuracy vs code |

### feature-dev (3 agents)

| Agent | Use when |
| ----- | -------- |
| `feature-dev:code-architect` | Design architecture for new features |
| `feature-dev:code-explorer` | Deep codebase exploration |
| `feature-dev:code-reviewer` | Review oriented feature implementation |

### Built-in skills (v2.1.63+)

- `/simplify` — built-in, replaces custom skill
- `/batch` — parallelizable code migrations

### Dev Principles (YAGNI → KISS → DRY → SINE → SOLID → DoR/DoD)

Build only what's needed, keep it simple, don't repeat, invest effort in simplicity. SOLID for module design. DoR/DoD: nothing starts without clear requirements, nothing is "done" without proof. Complexity decisions → ask PO (Level 3).

## Plugin Watch

- Source: https://github.com/wshobson/agents
- Dernière revue: 2026-02-28
- Fréquence: mensuelle
- Agents évalués (9): python-development, cicd-automation, shell-scripting, security-compliance, observability-monitoring, cloud-infrastructure, security-scanning, incident-response, agent-orchestration
- Checker: (1) mises à jour des 9 agents existants, (2) nouveaux agents dans le repo

## Session Notes

(keep last 3 entries, most recent first)
