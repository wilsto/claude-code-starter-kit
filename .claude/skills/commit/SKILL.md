---
name: commit
description: >
  Quality-gated commit workflow: secret scan, slop scan, format check, test gate,
  post-change documentation, changelog, conventional commit, push and release.
  Use /commit instead of raw git commands.
  Triggers: "commit", "git commit", "push changes".
type: workflow
---

# Commit — Quality Gate Workflow

## Transversal Rule: Questions to PO

At **every step**, if there is doubt or ambiguity (unclear scope, uncertain impact, decision to make) → ask the PO via `AskUserQuestion` before continuing. Never guess the PO's intent.

## Project Commands (auto-detected)

Before running tests or formatters, resolve the actual commands for this project:

1. **Read CLAUDE.md** — look for explicit commands in "Workflow" or "Active Stacks" sections
2. **If not found, detect from project marker files:**

| Marker file | Test | Coverage | Format check | Format fix |
|---|---|---|---|---|
| `package.json` | `npm test` | `npm test -- --coverage` | `npx eslint .` | `npx eslint . --fix` |
| `pyproject.toml` | `pytest` | `pytest --cov` | `ruff check .` | `ruff check . --fix` |
| `go.mod` | `go test ./...` | `go test -cover ./...` | `gofmt -l .` | `gofmt -w .` |
| `Cargo.toml` | `cargo test` | `cargo tarpaulin` | `cargo fmt --check` | `cargo fmt` |
| `Makefile` (test target) | `make test` | `make coverage` | `make lint` | `make format` |

3. **Default branch**: run `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'` — fallback to `main`
4. **Multi-stack**: if CLAUDE.md has "Active Stacks", resolve per-stack commands based on the file path being modified

Use the resolved commands throughout all steps below.

## Step 1: Check what changed

```bash
git status
git diff --stat
```

If nothing staged or modified: inform the user, stop.

## Step 2: Secret Scan (BLOCKING)

Run `git diff --cached` (or `git diff` for unstaged) and scan for these patterns:

- Keywords: `api_key`, `api_secret`, `token`, `password`, `bearer`, `secret`
- Key prefixes: `sk-`, `ghp_`, `glpat-`, `AKIA`, `tk_`
- Generic: any line matching a long alphanumeric value after a key-like label

If any match found → **STOP**. Do not commit. Show the match and warn the user.

## Step 3: Slop Scan (advisory)

Check staged diff for:

- Debug print statements: `console.log(`, `print(`, `fmt.Println(`, `logger.debug(`, `dbg!(`, `System.out.println(`
- Comments that restate the code
- Code added beyond the scope of the current task
- Leftover TODO/FIXME in new code

If slop found: list items and ask the user whether to fix them first.

## Step 4: Format Check (advisory)

Run the project's format check command (resolved in "Project Commands" above).

If format issues found, run the format fix command, then re-stage affected files.

## Step 5: Test Gate (BLOCKING)

Run the project's test command (resolved in "Project Commands" above).

If tests fail → **STOP**. Do not commit broken code. Show the failure output.

## Step 5b: Coverage Report (advisory)

Run the project's coverage command (resolved in "Project Commands" above).

Report the overall coverage percentage.

- If coverage data was previously noted in `memory/scratchpad.md`, compare and warn if it dropped:
  > Coverage: X% (↓ from Y% — consider adding tests before committing)
- If no baseline exists, just report the current value
- For multi-stack projects, run each stack's coverage command separately
- This step is **advisory** — do not block the commit

## Step 5c: Doc Completeness Check (advisory)

Check staged files for public symbols (functions, classes, methods) that lack documentation.

```bash
git diff --cached --name-only | grep -E '\.(py|ts|tsx|js|go|rs)$'
```

For each staged source file, scan for undocumented public symbols:

| Stack | Public symbol pattern | Missing doc indicator |
| ----- | -------------------- | -------------------- |
| Python | `def ` / `class ` (not `_`-prefixed) | No docstring on next line |
| TypeScript/JS | `export function` / `export class` / `export const` | No `/** ... */` JSDoc above |
| Go | `^func [A-Z]` (exported) | No `// FunctionName` comment above |
| Rust | `^pub fn` / `^pub struct` | No `/// doc comment` above |

- If undocumented symbols found: list them and ask whether to document before committing
- Skip test files (`*_test.*`, `test_*`, `*.test.*`, `*.spec.*`), config files, and generated files
- This step is **advisory** — do not block the commit

## Step 6: Post-change Documentation (advisory)

Follow the `/spec-update` skill to handle documentation updates. This step has 3 sub-tasks:

### 6a — Functional Spec

Based on the commit type and scope, create or update `docs/specs/<scope>.md`:

| Type | Action |
| ---- | ------ |
| `feat` | Create or update the domain spec |
| `fix` | Update existing spec (corrected behavior + History entry) |
| `refactor` | Update only if user-visible behavior changes |
| `docs`, `chore`, `test`, `perf` | Skip |

### 6b — README

If the change impacts installation, configuration, or user-facing usage → propose updating `README.md`.

### 6c — Lessons Learned

If the commit reveals a non-obvious pattern, platform quirk, or key technical decision → update `memory/MEMORY.md` or `memory/patterns.md`.

Present all proposed documentation changes to the user for validation before proceeding.

## Step 7: Update CHANGELOG.md

Read the current `CHANGELOG.md` and add the commit to the `## [Unreleased]` section under the appropriate category:

- `feat` → **Added**
- `fix` → **Fixed**
- `refactor` → **Changed**
- `perf` → **Changed**
- `docs` → **Changed** (or skip if trivial)
- `chore` → skip (unless significant infrastructure change)
- `test` → skip (unless notable testing infrastructure change)

Write a human-readable one-liner (not the raw commit message — rephrase for a changelog audience).

If CHANGELOG.md does not exist, create it with the [Keep a Changelog](https://keepachangelog.com/) format.

## Step 8: Stage and Commit

Stage all relevant files in a single operation:

- Source files modified by the user
- `docs/specs/<scope>.md` (if created/modified in step 6a)
- `README.md` (if modified in step 6b)
- `memory/MEMORY.md` or `memory/patterns.md` (if modified in step 6c)
- `CHANGELOG.md` (modified in step 7)

Use `git add <file>` for each file — **NEVER** `git add -A` or `git add .`

Never stage: `.env*`, `secrets.*`, `config.json`, `*.key`, `*.pem`

Compose conventional commit message:

- Format: `type(scope): description`
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`
- Imperative mood, present tense, under 72 chars
- Example: `fix(auth): prevent session token from expiring on idle`
- Never add `Co-Authored-By` in commit messages

One single `git commit` — no amend needed since docs and changelog are already staged.

## Step 9: Push and Release

This step always executes — it is not optional.

### 9a — Push

```bash
git push origin <default-branch>  # resolved in "Project Commands" above
```

### 9b — Semantic Versioning

Get the latest tag and determine the next version:

```bash
git describe --tags --abbrev=0
git log <last_tag>..HEAD --oneline
```

- If any commit contains `BREAKING CHANGE` or `!:` → **major** bump (1.x.0 → 2.0.0)
- If any commit starts with `feat` → **minor** bump (1.1.x → 1.2.0)
- Otherwise (fix, refactor, docs, etc.) → **patch** bump (1.1.0 → 1.1.1)

### 9c — Finalize CHANGELOG

Convert `[Unreleased]` to a versioned section in CHANGELOG.md:

- Rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD`
- Add a new empty `## [Unreleased]` section above it
- Update the comparison links at the bottom of the file
- Amend the commit and re-push:

  ```bash
  git add CHANGELOG.md
  git commit --amend --no-edit
  git push origin <default-branch> --force-with-lease  # resolved in "Project Commands" above
  ```

### 9d — Create Tag and GitHub Release

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <(changelog section content)
```

Use the content of the new versioned section from CHANGELOG.md as release notes.

### 9e — Post-release

Check CI status:

```bash
gh run list --limit 3
```

## Multi-stack projects

If CLAUDE.md has an `## Active Stacks` section, run format check and tests for **each stack** using its specific commands. A commit should only proceed if all stacks pass their respective gates. Read the corresponding `.claude/stacks/<stack>.md` for language-specific conventions.

## Rules

- Secret scan is always blocking — no exceptions
- If tests fail, the commit does not happen
- Slop, format, and documentation are advisory — user decides
- Never amend a previous commit without explicit user request
- Never force push (except `--force-with-lease` for changelog finalization in step 9c)
- At every step, ask the PO if in doubt — never guess intent
