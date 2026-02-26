# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), using [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/wilsto/claude-code-starter-kit/releases/tag/v1.0.0
