# Commit — Quality Gate Workflow

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

```bash
# CUSTOMIZE: replace with your formatter
{{FORMAT_CHECK_COMMAND}}
```

If format issues found:
```bash
{{FORMAT_FIX_COMMAND}}
```
Then re-stage affected files.

## Step 5: Test Gate (BLOCKING)

```bash
{{TEST_COMMAND}}
```

If tests fail → **STOP**. Do not commit broken code. Show the failure output.

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

## Step 8: Push (if requested)

```bash
git push origin {{DEFAULT_BRANCH}}
```

After push, remind user to check CI status if applicable:
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
