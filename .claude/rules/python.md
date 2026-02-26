---
paths: ["**/*.py", "pyproject.toml", "requirements*.txt", "setup.py", "setup.cfg"]
---

# Python Conventions

## Testing
- Framework: **pytest** (never unittest, never nose)
- File names: `test_*.py`, function names: `test_<what>_<when>_<expected>`
- Use `pytest.raises` for exceptions, `pytest.mark.parametrize` for data-driven tests
- Fixtures in `conftest.py`, use `yield` for setup/teardown
- Mock with `pytest-mock` (`mocker` fixture), patch where the object is USED

## Formatting & Linting
- **ruff** for everything (replaces black, isort, flake8)
- Check: `ruff check . && ruff format --check .`
- Fix: `ruff check --fix . && ruff format .`

## Type Checking
- **mypy** strict mode on all function signatures
- Use `X | None` over `Optional[X]`, `list[str]` over `List[str]`
- Add `from __future__ import annotations` at top of every file

## DO
- Dataclasses/Pydantic for structured data, never raw dicts for domain objects
- `pathlib.Path` over `os.path`, f-strings over `.format()`
- Context managers (`with`) for resource management
- `enum.Enum` for finite value sets

## DON'T
- Never use mutable default arguments (`def f(items=[])`)
- Never use bare `except:` — catch specific exceptions
- Never use `import *`, never write `== True/False/None` (use `is`)
- Never use global variables for state — use dependency injection
