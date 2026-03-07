# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), using [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

## [1.23.0] - 2026-03-07

### Added

- **`/loop` integration**: `workflow.md` now has a "Loop & Monitoring" section with patterns for CI watch, incident health monitoring, and Docker builds; `/session-wrap` reference added to Stopping Protocol
- **`ci-watch` skill + command**: single-purpose CI status checker (`gh run list`), designed to run standalone or via `/loop 2m ci-watch`
- **`ci-monitor` agent** (haiku): lightweight agent that checks GitHub Actions status and reports pass/fail/in-progress with failing step details
- **`session-wrap` skill + command**: end-of-session protocol — captures `[LEARN]` items to `patterns.md`, updates scratchpad with next steps, checks for uncommitted changes, asks if polaris needs updating
- **`loop-suggest.js` hook**: PostToolUse advisory after `git push` — suggests `/loop 2m ci-watch` to monitor CI (non-blocking)
- **`commit` skill**: Step 9e now suggests `/ci-watch` or `/loop 2m ci-watch` after push
- **`incident-response` skill**: Phase 2 (Investigation) now suggests `/loop 1m check logs` for live service monitoring
- All new items registered in `sync-config.json` for `/sync-global` propagation

## [1.22.0] - 2026-03-07

## [1.22.0] - 2026-03-07

### Added

- **UX workflow**: `/ux` 3-phase skill (clarify → wireframe → implement), `ux-guard.js` advisory hook (reminds to run `/ux` before editing `.tsx`/`.jsx` UI files), `ux.md` rule (mandatory gates: wireframe approval, mobile-first, async states), `ux.md` command — full UX enforcement system
- **Commit flash audit** (Step 0): `/commit` now detects accumulated `[flash]` commits before running the quality gate, so the gate covers all changes since the last full commit
- **Smart stack detection** (Step 5): `/commit` now inspects staged files to run only the affected stack's tests (avoids running the full multi-stack suite for a single-stack change)
- **After-plan commit-flash rule**: `workflow.md` now specifies that after executing a plan, the final action is to run `/commit-flash`
- **Always-recommend convention**: `conventions.md` now mandates stating a recommendation (with "Ma reco:" or "(Recommended)") when asking the PO a question
- UX skill, command, hook, and rule added to `sync-config.json` for future `/sync-global` propagation

## [1.21.0] - 2026-03-03

### Added

- **"Research before acting" system**: rule + hook that forces Claude to check official docs (context7), forums (WebSearch), and community best practices before acting in high-risk situations — package installs, plan mode, error loops, brainstorming, new tech, API calls, and config changes
- `research-first.js` hook (PreToolUse Bash/Agent + PostToolUse Bash): detects package installs, Plan subagent entry, and consecutive error loops (threshold: 2) with stateful tracking via session temp files
- `research-first.md` rule: behavioral guidance covering 6 situations where Claude must research before acting, including brainstorm/ideation for collective intelligence

## [1.20.1] - 2026-03-02

### Fixed

- `block-secrets` hook now uses `ask` instead of `deny` for all sensitive files — no more silent blocks on `.env*`, `config.json`, etc.

## [1.20.0] - 2026-03-02

### Added

- Spec integration across workflow: TDD Step 0 (read spec before RED), DoR/DoD spec requirements, review spec pre-check, advisory spec-reminder hook
- Tech-debt audit expanded to 4 holistic dimensions: Code Health, Test & Reliability, Documentation & Specs, Dependencies & Infra — replacing the previous 6 flat categories
- New debt categories: spec coverage/freshness, config docs, error handling, build/CI health, with security delegating to existing security-auditor agent
- Code review and code-simplifier steps (3b/3c) in `/commit` workflow for 3+ file changes

## [1.19.1] - 2026-03-02

### Added

- Plugins reference in rules (`plugins.md`) listing all installed plugin capabilities, triggers, and agents

## [1.19.0] - 2026-03-02

### Added

- Multi-select team priorities in `/tech-debt-audit`: users can now select multiple dimensions (maintainability, reliability, performance, testability) instead of being limited to one

## [1.18.0] - 2026-03-02

### Added

- SDD (Spec-Driven Development) as principle #7 in development conventions
- Init mode for `/spec-update`: bootstrap functional specs for all domains on a new project via codebase scan with 4-pass heuristic

## [1.17.0] - 2026-03-02

### Added

- Check 11 `coverage-config` in `/audit-conformity`: audits coverage configuration quality (threshold, branch, source filtering, report output) across Python, Node.js, Go, and Rust stacks

### Removed

- `auto-format.js` PostToolUse hook: removed due to critical bug (formatter emptying files — 5/7 files corrupted in coachbywill)

## [1.16.0] - 2026-03-02

### Added

- `debug-warning.js` PostToolUse hook: warns when edits introduce debug artifacts (console.log, print, etc.)

### Fixed

- Corrected `deny` → `ask` terminology in audit-conformity, sync-global, and GUIDE.md to match actual permissions model

## [1.15.0] - 2026-03-01

### Changed

- Skills `/commit`, `/tdd`, `/test-runner` made stack-agnostic: replaced all `{{PLACEHOLDER}}` with dynamic command resolution (reads CLAUDE.md or auto-detects from project marker files)
- Skills moved from `projectOnly` to `syncable` in sync-config — now available globally in all projects
- Added `spec-update` to syncable skills (was missing from config)
- `/audit-conformity` Check 10 "Skill Prerequisites": verifies project has explicit or detectable test/format commands before skills can function

## [1.14.0] - 2026-03-01

### Added

- `/setup` now creates GitHub Project automatically from template via `copyProjectV2` GraphQL mutation (no manual steps for PO)
- `/setup` caches all project field/option IDs in `CLAUDE.local.md` for fast GraphQL mutations
- Date rules in issue creation: Start date auto-derived from status (today for In Progress/Done, empty for Todo), never asked to PO

### Changed

- `/roadmap` Add Work no longer asks PO for start date (auto-derived)
- `/roadmap` Migrate derives dates from commit/release history for historical issues

## [1.13.2] - 2026-03-01

### Changed

- Hooks config moved from project settings to global `~/.claude/settings.json` (all projects inherit hooks automatically)
- Permissions `deny` replaced with `ask` (destructive operations require confirmation instead of hard block)
- Added `enabledPlugins` to template as source of truth (6 official plugins)
- Extended `settingsSync` with `hooks` and `enabledPlugins` strategies (`template-is-source`)

## [1.13.1] - 2026-03-01

### Fixed

- Issue creation procedure now explicit 3-step process: `gh issue create` → `gh project item-add` → set all project fields via GraphQL (prevents orphan issues invisible on board)
- All project fields documented as mandatory: Status, Phase, Priority, Size, Type, Start date
- `/roadmap` Add Work and Migrate flows reference the 3-step procedure
- Anti-pattern documented in `memory/patterns.md` as lesson learned

## [1.13.0] - 2026-03-01

### Added

- **Coverage report** (advisory step 5b in `/commit`): runs `{{TEST_COMMAND_COVERAGE}}` after tests pass, reports %, warns if coverage dropped
- **Doc completeness check** (advisory step 5c in `/commit`): detects public symbols without docstrings/JSDoc/godoc in staged files
- **Definition of Ready / Done** in `workflow.md`: concrete DoR (5 criteria) and DoD (5 criteria) for GitHub Project issues
- **DoR check in `/roadmap`** Add Work flow: warns before creating issues missing acceptance criteria, phase, or priority
- **Coverage mode** in `test-runner` agent: optional "with coverage" invocation using `{{TEST_COMMAND_COVERAGE}}`
- **Real coverage metrics** in `tech-debt-auditor` agent: replaces qualitative estimation with actual coverage command output
- **Coverage after GREEN** in `/tdd` skill: shows coverage for modified file after test passes

### Changed

- Quality gate expanded from 4 to 6 items: added coverage report (advisory) and doc completeness (advisory)
- `/setup` now propagates `{{TEST_COMMAND_COVERAGE}}` to commit skill files alongside tdd files
- README updated with coverage and doc completeness in `/commit` description

## [1.12.1] - 2026-03-01

### Changed

- `/roadmap` skill Migrate mode: added detailed preview table (titles, phases, priorities, sizes) with PO confirmation before creating issues
- `sync-config.json`: added `roadmap` to syncable skills list
- GitHub Project #2 created for claude-code-starter-kit with 17 historical release issues (v1.0.0–v1.12.0)

## [1.12.0] - 2026-03-01

### Added

- `/roadmap` skill: interactive skill to check project status, discuss phases, and migrate legacy Claude plans into GitHub Issues (3 modes: Status, Discuss, Migrate)
- Project Tracking section in CLAUDE.md and workflow.md: GitHub Projects V2 as source of truth for roadmaps, phases, and tasks

## [1.11.2] - 2026-03-01

### Changed

- Explicit development principles in conventions: YAGNI → KISS → DRY → SINE → SOLID → DoR/DoD as ordered sequence with clear definitions
- DoR/DoD labels added to workflow execution flow and stopping protocol
- README Philosophy aligned with KISS: "Built-in/plugin first" replaces "Custom skills over plugins"

## [1.11.1] - 2026-03-01

### Changed

- Clarified centralized secrets rule: multi-project secrets (LLM keys, GitHub tokens, HA credentials) stay in `~/.secrets.env`, project-specific secrets (Stripe test key, local DB) are legitimate in local `.env` (gitignored)

## [1.11.0] - 2026-03-01

### Added

- **Custom agents** (`.claude/agents/`): 3 declarative agent definitions (test-runner, security-auditor, tech-debt-auditor) running on haiku with project memory — isolates heavy codebase scans from the main context window
- **Progressive disclosure**: security-audit advanced techniques (DevSecOps, STRIDE, attack trees, compliance) extracted to `advanced-techniques.md`, prd-development phases 5-8 extracted to `phases-5-8.md` — loaded on demand instead of all at once

### Changed

- Skills `test-runner`, `security-audit`, `tech-debt-audit` now delegate codebase scans to dedicated agents instead of inline prompts
- Task coordination: `roles.md` and `workflow.md` now reference Task tool alongside TodoWrite for multi-agent workflows
- CLAUDE.md updated with `agents/` directory and Task Coordination section
- README updated with 3 custom agents, corrected counts (6 commands, 14 skills), removed simplify residuals from v1.10.1

## [1.10.1] - 2026-03-01

### Changed

- README updated with `/spec-update` skill, 15 skills count, `docs/specs/` in project structure, and revised `/commit` description (9 steps)
- **KISS subagent modernization**: removed custom `/simplify` skill (replaced by built-in `/simplify` v2.1.63 + `pr-review-toolkit:code-simplifier` plugin), refactored `/review` to route to `pr-review-toolkit` agents instead of inline prompts, added KISS principle to conventions, documented 9 available plugin agents in MEMORY.md

## [1.10.0] - 2026-03-01

### Added

- **Stacks and skills sync**: `sync-config.json` now tracks 9 stacks and 13 skills as syncable categories, propagated to `~/.claude/` via `/sync-global`
- **`security.md` secrets centralisés**: centralized secrets management rule synced from global config
- **`/spec-update` skill**: post-change documentation workflow that generates/updates functional specs per domain in `docs/specs/<scope>.md`, proposes README updates, and evaluates lessons learned

### Changed

- **`/commit` workflow reorganized** (9 steps): documentation phase (step 6) now runs before commit (step 8) — single commit includes code + docs + changelog without amends. Push and release (step 9) is now systematic, no longer optional. PO questions rule added at every step.
- `post-commit-lessons.js` hook marked as superseded by `/commit` step 6c (kept as fallback for direct git commits)

## [1.9.0] - 2026-02-28

### Added

- **4 new stack guides** extracted from `wshobson/agents` plugins: CI/CD (GitHub Actions, deployment strategies, DORA metrics), Observability (SLI/SLO, PromQL golden signals, OpenTelemetry), Shell scripting (10 defensive patterns, Bats testing, ShellCheck), Terraform (module architecture, state management, cost optimization)
- **`/incident-response` skill + command**: 5-phase guided workflow (triage → investigate → resolve → communicate → postmortem) with file-based checkpoints, runbook templates, and on-call handoff
- **Plugin Watch** in MEMORY.md: monthly re-evaluation of `wshobson/agents` for updates to 9 evaluated plugins and new agents

### Changed

- `python.md` stack guide enriched with async patterns, background jobs (Celery), FastAPI/Pydantic V2, SQLAlchemy 2.0 async, performance profiling, and advanced anti-patterns (+252 lines)
- `security-audit` skill enriched with DevSecOps pipeline integration, SAST tooling, STRIDE→requirements→tests workflow, attack tree analysis, and compliance mapping (+137 lines)
- `patterns.md` updated with agent orchestration patterns (failure mode classification, file-based context between steps)

## [1.8.0] - 2026-02-28

### Added

- **Polaris north star** (`memory/polaris.md`): strategic context layer (top of mind, goals, values) auto-injected at session start (~100 tokens) to align Claude's recommendations with user priorities
- **`/polaris` command**: interactive fill/update with Update, Rewrite, and Review modes
- **Polaris skill** (interactive): 8-question guided flow across 3 phases, auto-proposed when polaris.md is empty
- **Audit check #9** (`polaris-memory`): informational check for Polaris presence and content
- **Bidirectional sync** (`/sync-global`): sync rules, commands, and hooks between template and `~/.claude/` global config with hash-based change detection and interactive conflict resolution
- **Config health check** (`config-health-check.js`): global SessionStart hook for all projects — detects contradictions between local and global rules, verifies hooks integrity, memory health, and permissions coherence
- **7 generic rule files** (`.claude/rules/`): conventions, git, quality, roles, security, workflow, python-uv — extracted from CLAUDE.md for sync with global config
- **Sync config** (`.claude/sync-config.json`): classification of syncable vs project-only files with name mapping support

### Changed

- `session-context.js`: injects Polaris between session notes and active context
- `CLAUDE.md`: lightened from ~269 to ~145 lines by delegating duplicated sections to rule files
- `block-secrets.js`: fixed basename matching — `includes()` replaced by exact `===` to prevent false positives (e.g. `sync-config.json` no longer blocked by `config.json` rule)

## [1.7.0] - 2026-02-27

### Added

- **9 new skills** expanding the starter kit from 5 to 14 skills across 3 tiers:
  - **PM skills (6)**: user-story, prd-development, prioritization-advisor, discovery-interview-prep, opportunity-solution-tree, workshop-facilitation
  - **Audit skills (2)**: tech-debt-audit (interactive codebase health with RICE-prioritized remediation), security-audit (OWASP Top 10 + dependency + secrets audit with severity-ranked findings)
  - **Documentation skill (1)**: doc-generate (workflow to generate architecture, API, or onboarding docs with Mermaid diagrams)
- **Skills Conventions** section in CLAUDE.md: taxonomy (component/interactive/workflow), required frontmatter, 6-section anatomy, interactive protocol
- `type: workflow` field added to existing skill frontmatters (commit, review, simplify, tdd, test-runner)

### Changed

- README updated with full Skills section (14 skills organized by tier) and expanded project structure tree

## [1.6.0] - 2026-02-26

### Changed

- **CLAUDE.md Reconciliation** (Check 5): expanded from 4 hardcoded sections to 14 template sections organized in 3 tiers (5 CRITICAL, 5 RECOMMENDED, 4 INFORMATIONAL) with flexible search patterns and PASS/WARN/FAIL criteria — impact raised to HIGH

## [1.5.0] - 2026-02-26

### Added

- **Selective audit conformity**: `/audit-conformity` now lets users cherry-pick which checks to fix, skip permanently (with reason), or defer — instead of all-or-nothing
- **CLAUDE.md reconciliation** (Check 5 rewrite): 3-phase inventory → gap/conflict analysis → reconciliation proposals with zero-loss guarantee — existing project directives are never overwritten
- **3-layer CLAUDE.md strategy**: template base (`CLAUDE.md`) → project overrides (`.claude/rules/`) → personal preferences (`CLAUDE.local.md`) — leverages Claude Code's native precedence hierarchy
- **Audit persistence** (`.claude/audit-config.json`): stores skip decisions and last audit results for delta reporting between runs, stale skip nudge after 90 days
- **Impact/effort metadata** per check: CRITICAL/HIGH/MEDIUM/LOW impact + estimated fix time displayed in scorecard
- **Interactive selection menu**: numbered fix selection, [S]kip, [R]eview skips, [A]ll, [Q]uit — single AskUserQuestion prompt
- **Delta report**: shows IMPROVED/REGRESSED/UNCHANGED between consecutive audit runs

### Changed

- `/audit-conformity` rewritten from 192 to ~390 lines with 6-phase workflow (load config → enriched scorecard → interactive menu → scoped context analysis → plan mode → persist results)
- Check 5 renamed from "CLAUDE.md Sections" to "CLAUDE.md Reconciliation" — now searches across CLAUDE.md AND `.claude/rules/` for required sections
- Score denominator changed to "applicable checks" (total minus skipped) instead of fixed 8
- CLAUDE.md Structure section updated with `rules/` and `audit-config.json`
- README Mode 2 section expanded with reconciliation workflow description
- GUIDE.md Mode 2 rewritten with "Strategie 3 couches" section and automatic (Option A) vs manual (Option B) reconciliation paths

## [1.4.0] - 2026-02-26

### Added

- **Conditional rules** (`.claude/rules/`): 5 stack-specific rule files with `paths:` frontmatter for auto-loading only when editing relevant file types (Python, Next.js, Node.js, Go, Rust) — reduces contextual noise by ~45%
- **Compact Instructions** section in CLAUDE.md: directs `/compact` to preserve modified files, task status, decisions, and blocking issues
- **Structured scratchpad format**: `### HH:MM — Task title` with Done/Next/Decision fields for cleaner context re-injection
- `memory/session-cache.json` pre-created with empty structure (enables session handoff from first use)

### Changed

- **Stop hook split into 2 focused prompts**: Prompt 1 (session handoff + active context) is quasi-deterministic; Prompt 2 (learning capture) is evaluative — improves reliability over single complex prompt
- **SessionStart hook** now also fires on `resume` event (previously only `startup` and `compact`)

## [1.3.0] - 2026-02-26

### Added

- **Skill evaluator hook** (`skill-evaluator.js`): PreToolUse on Bash detects raw `git commit`/`git add -A` and suggests `/commit` workflow (advisory, never blocks)
- **3 sub-agent skills + commands**: `/review` (code review), `/simplify` (complexity analysis), `/test-runner` (test diagnostics) — auto-invoked by Claude as Dev Team tools AND available as manual `/commands`
- **Extended memory bank**: `memory/decisions.md` (ADR-lite, on-demand), `memory/active-context.md` (auto-injected: focus + next steps, ~150 tokens)
- **Compact-resilient scratchpad** (`memory/scratchpad.md`): append-only work log, last 30 lines auto-injected after /compact (~500 tokens max)
- **Environment context injection**: session-context.js now injects cwd, branch, git status, and detected stack at session start and after /compact (~40 tokens)
- Scratchpad Protocol section in CLAUDE.md
- Active context update in Stop hook prompt
- Token budget documentation (~890 tokens max per SessionStart injection)

### Changed

- `session-context.js` enhanced with 4 new injection blocks (environment, active context, scratchpad, all with size limits)
- `settings.json` updated with skill-evaluator PreToolUse matcher and enriched Stop prompt
- CLAUDE.md Structure section expanded with full memory/ and .claude/ tree
- MEMORY.md updated with new topic files and auto-injected files sections

## [1.2.0] - 2026-02-26

### Added

- PO/DevTeam role separation: User decides WHY/WHAT, Claude brings expertise on HOW
- 4-level Decision Authority matrix (full autonomy → hard deny)
- Task Workflow with TodoWrite decomposition and PO validation gate
- Structured Stopping Protocol (done/blocked/questions/files touched)

### Changed

- Merged duplicate Secrets section into Conventions
- Condensed Commit Rhythm and TDD sections for conciseness

## [1.1.1] - 2026-02-26

### Fixed

- Stacks directory now correctly nested under `.claude/` in README project structure tree
- Added CHANGELOG.md to README project structure

## [1.1.0] - 2026-02-26

### Added

- **Stackable language complements** (`.claude/stacks/`): Python, Next.js (complete), Go, Rust, Node.js (stubs) — replaces old `examples/` with real value: opinionated tools, patterns, CI/CD, deploy, docs links
- Multi-stack support in `/setup` (multi-select), CLAUDE.md (Active Stacks section), and `/commit` + `/tdd` (per-stack commands)
- Stack detection in `/audit-conformity` (Check 8) via indicator files (`pyproject.toml`, `next.config.*`, `go.mod`, `Cargo.toml`)
- CHANGELOG.md with Keep a Changelog format
- Systematic changelog update step in `/commit` workflow (Step 7)
- Incremental release with semver in `/commit` workflow (Step 8)

### Changed

- Python tooling: ruff replaces black across all references
- `/setup` wizard reads defaults from stack files instead of hardcoded table

### Removed

- `examples/` directory (4 pre-filled CLAUDE.md that duplicated template without adding value)

## [1.0.0] - 2026-02-26

### Added

- **5 hooks**: block-secrets (hard deny), tdd-guard (soft reminder), session-context (memory injection), post-commit-lessons (lesson evaluation), commit-reminder (natural breakpoint detection)
- **4 slash commands**: `/tdd`, `/commit`, `/setup`, `/audit-conformity`
- **2 auto-skills**: tdd (triggers on bug fix/feature), commit (triggers on staging)
- **Memory system**: MEMORY.md (auto-injected), patterns.md (on-demand), session-cache.json (structured handoff)
- **Safety net**: destructive command deny list in settings.json
- **Quality gate**: secret scan, slop scan, format check, test gate, conventional commits
- Context analysis in `/audit-conformity` for conflicts and complementarities
- Plan mode approval required before audit applies fixes
- Language examples for Python, Node.js, Go, Rust (later replaced by stacks)

[Unreleased]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.21.0...HEAD
[1.21.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.20.1...v1.21.0
[1.15.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.13.0...v1.14.0
[1.13.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.12.1...v1.13.0
[1.12.1]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.11.2...v1.12.0
[1.11.2]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.10.1...v1.11.0
[1.10.1]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/wilsto/claude-code-starter-kit/releases/tag/v1.0.0
