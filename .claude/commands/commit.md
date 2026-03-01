# Commit — Quality Gate Workflow

## Project Commands (auto-detected)

Before running tests or formatters, resolve commands for this project:

1. **Read CLAUDE.md** — look for explicit commands in "Workflow" or "Active Stacks" sections
2. **If not found, detect from project marker files:**

| Marker file | Test | Coverage | Format check | Format fix |
|---|---|---|---|---|
| `package.json` | `npm test` | `npm test -- --coverage` | `npx eslint .` | `npx eslint . --fix` |
| `pyproject.toml` | `pytest` | `pytest --cov` | `ruff check .` | `ruff check . --fix` |
| `go.mod` | `go test ./...` | `go test -cover ./...` | `gofmt -l .` | `gofmt -w .` |
| `Cargo.toml` | `cargo test` | `cargo tarpaulin` | `cargo fmt --check` | `cargo fmt` |
| `Makefile` (test target) | `make test` | `make coverage` | `make lint` | `make format` |

3. **Default branch**: `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'` → fallback `main`

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

Run the project's format check command (resolved above). If format issues found, run the format fix command, then re-stage affected files.

## Step 5: Test Gate (BLOCKING)

Run the project's test command (resolved above).

If tests fail → **STOP**. Do not commit broken code. Show the failure output.

## Step 5b: Coverage Report (advisory)

Run the project's coverage command (resolved above). Report %. Warn if coverage dropped compared to previous baseline. Advisory only — do not block the commit.

## Step 5c: Doc Completeness (advisory)

Grep staged source files for public symbols (functions/classes) without docstrings/JSDoc/godoc. List any undocumented public API and ask whether to document before committing. Skip test files and generated files. Advisory only.

## Step 6: Stage and Commit

- Stage specific files with `git add <file>` — **NEVER** `git add -A` or `git add .`
- Never stage: `.env*`, `secrets.*`, `config.json`, `*.key`, `*.pem`
- Compose conventional commit message:
  - Format: `type(scope): description`
  - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`
  - Imperative mood, present tense, under 72 chars
  - Example: `fix(auth): prevent session token from expiring on idle`
- Never add `Co-Authored-By` in commit messages

## Step 7: Update CHANGELOG.md

After a successful commit, update `CHANGELOG.md`:

1. Read the current CHANGELOG.md
2. Add the commit to the `## [Unreleased]` section under the appropriate category:
   - `feat` → **Added**
   - `fix` → **Fixed**
   - `refactor` → **Changed**
   - `perf` → **Changed**
   - `docs` → **Changed** (or skip if trivial)
   - `chore` → skip (unless significant infrastructure change)
   - `test` → skip (unless notable testing infrastructure change)
3. Write a human-readable one-liner (not the raw commit message — rephrase for a changelog audience)
4. Stage and amend the commit to include the changelog update:
   ```bash
   git add CHANGELOG.md
   git commit --amend --no-edit
   ```

If CHANGELOG.md does not exist, create it with the [Keep a Changelog](https://keepachangelog.com/) format.

## Step 8: Push and Release (if requested)

```bash
git push origin <default-branch>
```

After push, create an incremental release:

1. **Get the latest tag**:
   ```bash
   git describe --tags --abbrev=0
   ```

2. **Determine the next version** using semantic versioning:
   - Check all commits since the last tag: `git log <last_tag>..HEAD --oneline`
   - If any commit contains `BREAKING CHANGE` or `!:` → **major** bump (1.x.0 → 2.0.0)
   - If any commit starts with `feat` → **minor** bump (1.1.x → 1.2.0)
   - Otherwise (fix, refactor, docs, etc.) → **patch** bump (1.1.0 → 1.1.1)

3. **Convert [Unreleased] to versioned section** in CHANGELOG.md:
   - Rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD`
   - Add a new empty `## [Unreleased]` section above it
   - Update the comparison links at the bottom of the file
   - Amend the commit and re-push:
     ```bash
     git add CHANGELOG.md
     git commit --amend --no-edit
     git push origin <default-branch> --force-with-lease
     ```

4. **Create the tag and GitHub release**:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <(changelog section content)
   ```
   Use the content of the new versioned section from CHANGELOG.md as release notes.

After release, remind user to check CI status if applicable:
```bash
gh run list --limit 3
```

## Multi-stack projects

If CLAUDE.md has an `## Active Stacks` section, run format check and tests for **each stack** using its specific commands. A commit should only proceed if all stacks pass their respective gates. Read the corresponding `.claude/stacks/<stack>.md` for language-specific conventions.

## Rules
- Secret scan is always blocking — no exceptions
- If tests fail, the commit does not happen
- Slop and format are advisory — user decides
- Never amend a previous commit without explicit user request
- Never force push
