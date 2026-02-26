# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), using [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/wilsto/claude-code-starter-kit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/wilsto/claude-code-starter-kit/releases/tag/v1.0.0
