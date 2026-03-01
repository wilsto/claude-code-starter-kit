# Patterns — {{PROJECT_NAME}}

> Read this file when debugging or implementing new features.
> NOT auto-injected. Claude reads it on demand.

## Debugging Patterns

<!-- Add patterns as you discover them. Format: -->
<!-- ### Problem Title -->
<!-- **Symptom**: what you see -->
<!-- **Root Cause**: what actually happened -->
<!-- **Fix**: what solved it -->
<!-- **Prevention**: how to avoid it next time -->

## Reusable Solutions

<!-- Code snippets or approaches that worked and are worth repeating -->

## Anti-Patterns Discovered

### GitHub Issue Creation: 3 Steps, Not 1

**Symptom**: Issue created via `gh issue create` but invisible on the GitHub Project board.
**Root Cause**: `gh issue create` only creates the issue in the repo. It does NOT add it to the GitHub Project, and does NOT set project fields (Status, Phase, Priority, Size, Type, Start date). These are 3 separate API operations.
**Fix**: Always follow the 3-step procedure in `workflow.md` → Issue Creation Procedure:

1. `gh issue create` — creates the issue
2. `gh project item-add` — adds to project board (returns item ID)
3. GraphQL mutations — sets all project fields (Status, Phase, Priority, Size, Type, Start date)
**Prevention**: Field/option IDs cached in `CLAUDE.local.md`. Rule in workflow.md: "Never consider an issue created until all 3 steps are complete."

## Agent Orchestration Patterns (from wshobson/agents evaluation)

> Source: `agent-orchestration` plugin — evaluated 2026-02-28, not integrated (too theoretical/enterprise)

### Patterns worth remembering

1. **Failure mode classification** (6 categories for agent issues):
   - Instruction misunderstanding
   - Output format errors
   - Context loss (long conversations)
   - Tool misuse
   - Constraint violations
   - Edge case handling
   → Useful for improving skill prompts and debugging agent behavior.

2. **File-based context between steps** (also seen in incident-response):
   - Write intermediate outputs to files, read them back in next step
   - Survives `/compact` and context window limits
   - Pattern: `state.json` + numbered output files (`01-step.md`, `02-step.md`)
   → Already used in `/incident-response` skill. Consider for other long workflows.

3. **Agent versioning** (MAJOR.MINOR.PATCH for skill prompts):
   - Track skill prompt changes with semantic versioning
   - Rollback triggers: success rate drops >10%, critical errors >5%
   → Premature for now, but worth considering if skills grow complex.

### Not adopted (too complex for our use case)

- Vector databases / knowledge graphs for context (our `memory/` system is simpler and sufficient)
- Dynamic model selection per task complexity (our Model Selection table in CLAUDE.md is manual but adequate)
- A/B testing framework for agents (interesting but premature)
