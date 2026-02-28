# Git Conventions

- **Commit format**: `feat|fix|chore|docs|refactor|test|perf(scope): description`
- **Never add** `Co-Authored-By` in commit messages
- **Never** `git push --force` or `git reset --hard` on shared branches
- **Never** bypass hooks with `--no-verify`
- **Always** commit + push BEFORE deploy (deploy scripts reference latest commit message)
