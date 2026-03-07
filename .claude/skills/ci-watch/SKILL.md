---
name: ci-watch
description: >
  Check GitHub Actions CI status for the current branch. Reports pass/fail/in-progress.
  Designed to be used standalone or with /loop: "/loop 2m ci-watch".
  Triggers: "check CI", "watch build", "is CI passing", "CI status", after any git push.
type: component
---

# CI Watch — GitHub Actions Status Check

## Purpose

Single-purpose skill: check the current CI run status and report it clearly.
Designed to be called once (standalone) or on a loop (`/loop 2m ci-watch`) after a `git push`.

## Application

### Step 1 — Get current branch

```bash
git branch --show-current
```

### Step 2 — Fetch CI run status

```bash
gh run list --limit 1 --json status,conclusion,name,headBranch,createdAt,url
```

### Step 3 — Interpret and report

| status | conclusion | Report |
| --- | --- | --- |
| `completed` | `success` | CI GREEN — all checks passed. |
| `completed` | `failure` | CI RED — run failed. Show URL + failing step. |
| `completed` | `cancelled` | CI CANCELLED — run was cancelled. |
| `in_progress` | — | CI IN PROGRESS — still running. |
| `queued` | — | CI QUEUED — waiting for runner. |

For failures, also run:

```bash
gh run view --log-failed
```

to show the specific failing step.

### Step 4 — Advise

- **Green**: "CI passed. Safe to continue."
- **Red**: "CI failed on [step]. Fix before moving on. Run `gh run view --log-failed` for details."
- **In progress**: "Still running. Run `/ci-watch` again in ~1 min, or use `/loop 2m ci-watch`."

## Loop Integration

To monitor continuously after a push:

```
/loop 2m ci-watch
```

The loop auto-stops when you cancel it (`Ctrl+C`). Suggest stopping once CI reaches a terminal state (success or failure).

## Common Pitfalls

### Pitfall 1: No runs found

**Symptom**: `gh run list` returns empty.
**Fix**: The push may not have triggered CI (no workflow file, or push to a branch with no triggers). Check `.github/workflows/`.

### Pitfall 2: Multiple concurrent runs

**Symptom**: `--limit 1` returns a run from a different branch.
**Fix**: Filter by branch: `gh run list --limit 1 --branch $(git branch --show-current)`

## References

- Related skill: `/commit` — suggests `/ci-watch` in step 9e post-push
- Related rule: `workflow.md` — Loop & Monitoring section
- Agent: `ci-monitor` — haiku agent that executes the gh CLI calls above
