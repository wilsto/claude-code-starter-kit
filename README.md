<h1 align="center">
  Claude Code Starter Kit
</h1>

<p align="center">
  <strong>Battle-tested Claude Code template with TDD, security hooks, auto-learning memory, and quality-gated commits.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#whats-included">What's Included</a> &bull;
  <a href="#two-modes">Two Modes</a> &bull;
  <a href="#examples">Examples</a> &bull;
  <a href="#skills">Skills</a> &bull;
  <a href="#plugins">Plugins</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-ready-blueviolet?style=flat-square" alt="Claude Code Ready">
  <img src="https://img.shields.io/badge/language-agnostic-blue?style=flat-square" alt="Language Agnostic">
  <img src="https://img.shields.io/badge/TDD-enforced-green?style=flat-square" alt="TDD Enforced">
  <img src="https://img.shields.io/badge/secrets-protected-red?style=flat-square" alt="Secrets Protected">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square" alt="MIT License">
</p>

---

## Why This Exists

Claude Code is powerful out of the box. But without guardrails, it will:

- Edit your `.env` files and leak secrets into commits
- Write implementation code before tests
- Lose context across sessions and after `/compact`
- Create inconsistent commits with no quality checks
- Forget lessons learned in previous sessions

This starter kit solves all of that with **3 hooks**, **4 skills**, and a **persistent memory system** — all language-agnostic, all battle-tested in production.

---

## Quick Start

### Option A: Use as GitHub Template (recommended)

Click **"Use this template"** above, then:

```bash
git clone https://github.com/YOUR_USERNAME/your-new-repo.git
cd your-new-repo
```

Open Claude Code and run `/setup` — the interactive wizard fills in all placeholders for you.

### Option B: Clone directly

```bash
git clone https://github.com/wilsto/claude-code-starter-kit.git my-project
cd my-project
rm -rf .git && git init
```

Then run `/setup` or manually replace the `{{PLACEHOLDER}}` values ([see guide](docs/GUIDE.md)).

---

## What's Included

### 3 Hooks (automatic, zero effort)

| Hook | Type | What it does |
|------|------|-------------|
| **block-secrets** | `PreToolUse` (hard deny) | Blocks Claude from editing `.env*`, `secrets.*`, `config.json`. Zero tolerance. |
| **tdd-guard** | `PreToolUse` (soft reminder) | Reminds you to write a failing test before editing source files. Non-blocking. |
| **session-context** | `SessionStart` | Injects memory + session handoff at startup and after `/compact`. Prevents context amnesia. |

### 4 Skills (invoke when needed)

| Skill | Command | What it does |
|-------|---------|-------------|
| **TDD** | `/tdd` | Red-Green-Refactor workflow. Write failing test, confirm RED, implement, confirm GREEN. |
| **Commit** | `/commit` | Quality gate: secret scan (blocking) + slop scan + format check + test gate + conventional commit. |
| **Setup** | `/setup` | Interactive wizard. Asks your stack, fills all placeholders, configures hooks automatically. |
| **Audit** | `/audit-conformity` | Analyzes an existing project against the template. Produces a scorecard with corrective actions. |

### Memory System (cross-session persistence)

| File | Auto-injected? | Purpose |
|------|---------------|---------|
| `memory/MEMORY.md` | Yes (every session) | Index file: project identity, preferences, session notes. Under 200 lines. |
| `memory/patterns.md` | No (on demand) | Technical patterns, debugging lessons, reusable solutions. |
| `memory/session-cache.json` | Yes (via hook) | Structured handoff: done/decisions/next/gotchas. Written by Stop hook. |

### Safety Net (permissions)

Hard-denied commands (cannot be overridden):
- `rm -rf /*`, `rm -rf ~*` — filesystem destruction
- `dd *`, `mkfs*` — disk destruction
- `git push --force`, `git push -f` — history destruction
- `git reset --hard` — uncommitted work destruction

---

## Two Modes

### Mode 1: Create — New project from scratch

Use the GitHub template button or clone, then run `/setup`.

The wizard asks for your stack (Node, Python, Go, Rust, or custom) and configures everything automatically. ~2 minutes.

For manual setup, see the [detailed guide](docs/GUIDE.md#mode-1--create--nouveau-projet-from-scratch).

### Mode 2: Conformity — Existing project

Run `/audit-conformity` in your existing project to get a scorecard of what's missing.

Then copy the missing pieces from this template and merge them in. The skill tells you exactly what to do.

For step-by-step instructions, see the [detailed guide](docs/GUIDE.md#mode-2--conformite--projet-existant).

---

## Examples

Pre-filled configurations for popular stacks. Copy the relevant `CLAUDE.md` to replace the template version.

| Stack | Test Runner | Formatter | Example |
|-------|------------|-----------|---------|
| **Node.js** | Vitest | Prettier | [`examples/node-vitest/`](examples/node-vitest/) |
| **Python** | pytest | Black | [`examples/python-pytest/`](examples/python-pytest/) |
| **Go** | go test | gofmt | [`examples/go/`](examples/go/) |
| **Rust** | cargo test | cargo fmt | [`examples/rust/`](examples/rust/) |

---

## Project Structure

```
claude-code-starter-kit/
├── README.md                    # This file
├── CLAUDE.md                    # Project contract (TDD rules, quality gate, conventions)
├── CLAUDE.local.md              # Personal preferences (gitignored)
├── .gitignore                   # Secrets, build artifacts, dependencies
├── .claudeignore                # Keeps build/deps out of Claude's context window
├── LICENSE                      # MIT
├── docs/
│   └── GUIDE.md                 # Detailed setup guide (2 modes, placeholder table, hook tests)
├── examples/                    # Pre-filled configs per language stack
├── .claude/
│   ├── settings.json            # Permissions + hook wiring
│   ├── hooks/
│   │   ├── block-secrets.js     # Hard-deny on secret files
│   │   ├── tdd-guard.js         # Soft TDD reminder on source edits
│   │   └── session-context.js   # Memory injection at startup + compact
│   └── skills/
│       ├── tdd/SKILL.md         # /tdd — Red-Green-Refactor
│       ├── commit/SKILL.md      # /commit — Quality-gated conventional commits
│       ├── setup/SKILL.md       # /setup — Interactive configuration wizard
│       └── audit-conformity/SKILL.md  # /audit-conformity — Project compliance check
└── memory/
    ├── MEMORY.md                # Auto-injected index (< 200 lines)
    └── patterns.md              # On-demand technical patterns
```

---

## Plugins

These official Anthropic plugins complement the starter kit. Install them globally (user-scope):

| Plugin | What it adds |
|--------|-------------|
| `security-guidance` | Alerts on code vulnerabilities (XSS, injection) at edit time |
| `pr-review-toolkit` | 6 specialized review agents for PRs |
| `feature-dev` | Explore > Design > Implement > Review workflow |
| `claude-md-management` | Audit CLAUDE.md quality |

### pro-workflow (optional, per-project)

```bash
claude plugin install pro-workflow
```

Use from the plugin: `/deslop` (clean AI slop), scout agent (confidence gate), `/insights` (analytics).

Prefer the starter kit's custom skills over overlapping plugin features:
- `/commit` > `/smart-commit`
- Stop hook > `/wrap-up`
- `memory/MEMORY.md` > `/learn-rule`

---

## Customization

Every configurable value is clearly marked in the source:

- **`block-secrets.js`** — `BLOCKED_PATHS` array at the top
- **`tdd-guard.js`** — `SRC_DIRS`, `EXCLUDED_PATTERNS`, `SOURCE_EXTENSIONS` arrays at the top
- **`CLAUDE.md`** — `{{PLACEHOLDER}}` values throughout
- **Skills** — `{{TEST_COMMAND}}`, `{{FORMAT_COMMAND}}` etc.

Or just run `/setup` and answer the questions.

---

## Philosophy

This kit follows three principles:

1. **Hooks enforce, CLAUDE.md guides.** Hooks run regardless of what Claude decides. CLAUDE.md is advice that Claude can (and sometimes does) ignore. Critical rules go in hooks.

2. **Custom skills over plugins.** Plugins are convenient but opaque. Custom skills are readable, debuggable, and version-controlled. When both exist for the same task, the custom skill wins.

3. **Memory is a system, not a feature.** Three layers work together: MEMORY.md (always loaded, index-level), topic files (loaded on demand, detailed), session-cache.json (structured handoff between sessions). The Stop hook writes, the SessionStart hook reads. Zero manual effort.

---

## Contributing

Contributions welcome! Areas where help is appreciated:

- New language examples in `examples/`
- Hook improvements (new guards, better patterns)
- Skill enhancements (more quality gates, better wizards)
- Documentation and translations

Please open an issue first to discuss significant changes.

---

## License

[MIT](LICENSE) — use it, fork it, build on it.
