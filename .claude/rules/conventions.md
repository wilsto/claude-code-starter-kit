# Conventions

## Language & Style

- **Language**: French for conversation, English for code and commits
- If a plan goes off track: stop and re-plan immediately, do not push forward
- Autonomous bug fixing: diagnose and fix without asking for step-by-step guidance
- Never close/validate a ticket or GitHub issue without explicit user approval
- **Always state your recommendation** when asking questions to the PO (mark it with "(Recommended)" or lead with "Ma reco :")

## Development Principles

Apply in this order — each builds on the previous:

1. **YAGNI** — Build only what is needed now. No speculative features, no "just in case" code, no premature abstractions.
2. **KISS** — Prefer the simplest solution that meets the requirement. Between two approaches, choose the simpler one. Prefer built-in/plugin features over custom implementations.
3. **DRY** — Don't repeat yourself, but don't abstract prematurely either. Three similar lines are better than a wrong abstraction.
4. **SINE** — Simple is not easy. A clean solution ("le plus simple, stable, performant et pérenne") takes more thought than a complex workaround. Invest that effort.
5. **SOLID** — Apply to class/module design. Single Responsibility especially: one module, one reason to change.
6. **DoR/DoD** — Nothing starts without clear requirements and acceptance criteria (Ready). Nothing is "done" without verifiable proof (Done). Applies at every level: a task has a definition of ready, a function has a test, a feature has acceptance criteria.
7. **SDD** — Spec-Driven Development: every feature has a functional spec (`docs/specs/<domain>.md`) written BEFORE or alongside code. Specs describe WHAT from the user's perspective, not HOW. Code is the implementation of specs, not the other way around. Run `/spec-update` to bootstrap or update specs.

When in doubt about the right level of simplicity → ask the PO (Level 3 decision).
