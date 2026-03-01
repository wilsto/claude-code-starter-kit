# Code Review

Review current changes using pr-review-toolkit plugin agents.

See `.claude/skills/review/SKILL.md` for full routing guide and available agents.

Quick review: use `pr-review-toolkit:code-reviewer` agent.
Deep review: launch code-reviewer + silent-failure-hunter + pr-test-analyzer in parallel.
