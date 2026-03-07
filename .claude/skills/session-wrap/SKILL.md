---
name: session-wrap
description: >
  End-of-session structured wrap-up: capture learnings, update scratchpad with next steps,
  check for uncommitted changes, ask if polaris needs updating.
  Complements post-commit-lessons.js (per-commit) — this runs once at session end.
  Triggers: "end session", "wrap up", "closing session", "fin de session", "session terminée".
type: workflow
---

# Session Wrap — End-of-Session Protocol

## Purpose

Structured close of a working session. Ensures nothing is lost across `/compact` or session restart.
Runs **once per session** at the end — not per commit (that's handled by `post-commit-lessons.js`).

## Application

### Step 1 — Uncommitted changes check

```bash
git status --short
```

If any staged or unstaged changes exist → suggest `/commit` before wrapping:
> "You have uncommitted changes. Run `/commit` first to preserve this work?"

Wait for user response before continuing.

### Step 2 — Learnings capture

Scan the current session for any `[LEARN]` items:
- Look through the conversation for messages prefixed with `[LEARN]`
- Look in scratchpad for any `[LEARN]` entries added during the session

For each `[LEARN]` found:
1. Present it to the user: "Found a learning: [text]. Add to `memory/patterns.md`?"
2. On approval, append to [memory/patterns.md](../../../memory/patterns.md) under the Learnings section using the format:

```markdown
### [Category] Rule description
- **Mistake**: what went wrong
- **Correction**: what to do instead
- **Project**: [project name]
- **Date**: YYYY-MM-DD
```

Categories: Navigation, Editing, Testing, Git, Quality, Context, Architecture, Performance

### Step 3 — Scratchpad: next steps

Read current [memory/scratchpad.md](../../../memory/scratchpad.md).

Ask: "What's the next step for next session? I'll add it to the scratchpad."

Append to scratchpad (append-only, never overwrite):

```text
### HH:MM — Session wrap [YYYY-MM-DD]
- Done: [summary of what was completed this session]
- Next: [immediate next step for next session]
- Decision: [any key decision made, if applicable]
---
```

### Step 4 — Polaris check

Ask: "Did any priorities or goals shift today? Update polaris.md?" (1 line answer)

- If yes → run `/polaris` to update interactively
- If no → skip

### Step 5 — Spec check (conditional)

If any source files were modified this session and `/commit` step 6 (spec-update) wasn't already run:
> "Code changed but spec update may be missing. Run `/spec-update` now?"

Advisory — user decides.

### Step 6 — Closing summary

Output a brief session summary:

```
Session closed [YYYY-MM-DD HH:MM]
Done: [2-3 bullet points of what was accomplished]
Committed: [yes/no — last commit hash if yes]
Learnings captured: [N items]
Next: [one-liner from scratchpad]
```

## Common Pitfalls

### Pitfall 1: Skipping the wrap on short sessions

**Symptom**: "I'll remember." → next session starts with no context.
**Fix**: Run `/session-wrap` even for short sessions. The 2-minute investment prevents a 10-minute re-orientation.

### Pitfall 2: Running before committing

**Symptom**: Uncommitted changes exist at wrap time.
**Fix**: Step 1 always checks — it blocks until user commits or explicitly skips.

## References

- `memory/scratchpad.md` — running work log, last 30 lines re-injected by session-context.js
- `memory/patterns.md` — learnings storage (append only)
- `memory/polaris.md` — strategic context (north star, goals, values)
- `/polaris` skill — interactive polaris update
- `/spec-update` skill — post-change documentation
- `post-commit-lessons.js` hook — per-commit lesson reminder (complementary, not duplicate)
