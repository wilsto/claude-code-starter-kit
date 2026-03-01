# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), using [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.12.1...HEAD
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
