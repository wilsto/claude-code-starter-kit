# MEMORY.md — {{PROJECT_NAME}}

> Auto-injected at every session start via session-context.js hook.
> Keep under 200 lines. Detailed notes go in topic files (read on demand).

## Project Identity

<!-- Replace with a 1-2 sentence project description -->
{{PROJECT_DESCRIPTION}}

## User Preferences

<!-- Things Claude should always remember about how you work -->
- Prefer clean solutions over workarounds
- TDD mandatory: RED (test fail) → GREEN (fix) → show output to user
- Ask before any destructive operation

## Platform Notes

<!-- OS/environment quirks that affect how Claude runs commands -->
<!-- Add platform-specific gotchas as you discover them -->

## Key Technical Decisions

<!-- Architectural decisions and WHY — prevents relitigating across sessions -->
<!-- Format: [DECISION] Short title → rationale -->

## Topic Files (Read on demand, NOT auto-injected)

- `memory/patterns.md` — technical patterns, debugging lessons, reusable solutions
- `memory/decisions.md` — architectural decision records (ADR-lite)

## Auto-injected Files

- `memory/active-context.md` — current work context ("Current Focus" + "Next Steps" sections only)
- `memory/scratchpad.md` — running work log, last 30 lines (survives /compact)

## Session Notes

(keep last 3 entries, most recent first)
