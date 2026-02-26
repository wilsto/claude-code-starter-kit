# Stack: Python

## Defaults

| Placeholder | Value |
|---|---|
| SRC_DIR | `src/` |
| TEST_DIR | `tests/` |
| TEST_COMMAND | `pytest` |
| TEST_COMMAND_SINGLE | `pytest` |
| TEST_COMMAND_COVERAGE | `pytest --cov` |
| FORMAT_CHECK_COMMAND | `ruff check . && ruff format --check .` |
| FORMAT_FIX_COMMAND | `ruff check --fix . && ruff format .` |

## Project Structure

Use this idiomatic Python layout:

```text
project/
├── src/
│   └── package_name/
│       ├── __init__.py
│       ├── module.py
│       └── py.typed          # PEP 561 marker
├── tests/
│   ├── conftest.py           # shared fixtures
│   ├── test_module.py        # mirrors src/ structure
│   └── integration/          # slower tests, separate from unit
├── pyproject.toml             # single config file for all tools
├── requirements.txt           # or use pyproject.toml [project.dependencies]
└── .python-version            # pin Python version (pyenv)
```

- Test files mirror source: `src/package_name/auth.py` → `tests/test_auth.py`
- Use `conftest.py` for shared fixtures, never import fixtures from test files
- Integration tests in `tests/integration/`, run separately with `pytest tests/integration/`

## Testing

**Framework**: pytest (never unittest, never nose)

```bash
pytest                                    # all tests
pytest tests/test_auth.py                 # single file
pytest tests/test_auth.py::test_login     # single test
pytest --cov=src --cov-report=term-missing # with coverage
pytest -m "not integration"               # exclude slow tests
```

**Conventions:**
- File names: `test_*.py` (never `*_test.py`)
- Function names: `test_<what>_<when>_<expected>` (e.g., `test_login_with_invalid_token_raises_401`)
- Use `pytest.raises` for exceptions, never try/except in tests
- Use `pytest.mark.parametrize` for data-driven tests, not loops

**Fixtures:**
- Define in `conftest.py` at the appropriate directory level
- Use `yield` fixtures for setup/teardown, not `setUp`/`tearDown`
- Scope: default `function`, use `session` only for expensive resources (DB connections)
- Never use mutable default values in fixtures

**Mocking:**
- Use `pytest-mock` (`mocker` fixture) over `unittest.mock` directly
- Patch where the object is USED, not where defined: `mocker.patch("myapp.auth.requests.get")` not `mocker.patch("requests.get")`
- Prefer dependency injection over mocking when possible

**Assertions:**
- Use plain `assert` (pytest rewrites them for clear output)
- Never use `self.assertEqual` or unittest assertion methods
- For floats: `assert value == pytest.approx(3.14, abs=0.01)`

## Formatting & Linting

**Tool**: ruff (replaces black, isort, flake8, pyflakes — single tool for everything)

Configure in `pyproject.toml`:

```toml
[tool.ruff]
target-version = "py312"
line-length = 88

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort
    "N",    # pep8-naming
    "UP",   # pyupgrade
    "B",    # flake8-bugbear
    "SIM",  # flake8-simplify
    "RUF",  # ruff-specific rules
]

[tool.ruff.lint.isort]
known-first-party = ["package_name"]
```

```bash
ruff check . && ruff format --check .   # check (CI / pre-commit)
ruff check --fix . && ruff format .     # fix
```

- Never use black separately — ruff format is a drop-in replacement
- Never use isort separately — ruff handles import sorting
- Never use flake8 — ruff covers all its rules and more

## Type Checking

**Tool**: mypy (strict mode)

```toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

```bash
mypy src/
```

- Add type hints to ALL function signatures (parameters and return types)
- Use `from __future__ import annotations` at top of every file for modern syntax
- Prefer `X | None` over `Optional[X]`
- Prefer `list[str]` over `List[str]` (Python 3.9+)
- Use `TypeAlias` for complex types: `UserMap: TypeAlias = dict[str, User]`

## Idiomatic Patterns

**DO:**
- Use dataclasses or Pydantic models for structured data, never raw dicts for domain objects
- Use `pathlib.Path` instead of `os.path`
- Use f-strings for formatting (never `%` or `.format()`)
- Use context managers (`with`) for resource management
- Use `enum.Enum` for finite sets of values, not string constants
- Use list/dict/set comprehensions when they improve readability
- Use `typing.Protocol` for structural subtyping instead of ABC when possible

**DON'T:**
- Never use mutable default arguments (`def f(items=[])`) — use `None` and assign inside
- Never use bare `except:` — always catch specific exceptions
- Never use `type()` for type checking — use `isinstance()`
- Never use global variables for state — use dependency injection
- Never use `import *` — always import specific names
- Never write `== True` or `== False` or `== None` — use `is`

## Common Pitfalls

- **Import paths**: If imports fail with pytest, add `[tool.pytest.ini_options] pythonpath = ["src"]` to `pyproject.toml`
- **Circular imports**: Move shared types to `types.py` or `models.py`. Use `TYPE_CHECKING` guard for type-only imports
- **Async tests**: Use `pytest-asyncio` with `@pytest.mark.asyncio`. Set `asyncio_mode = "auto"` in pytest config
- **Virtual environments**: Always work inside a venv. Check with `which python` — should point inside the project

## Dependencies

```bash
python -m venv .venv
source .venv/bin/activate    # Linux/Mac
.venv\Scripts\activate       # Windows

pip install -e ".[dev]"      # install with dev deps (preferred)
pip install -r requirements.txt  # alternative
```

Prefer `pyproject.toml` for dependency management:

```toml
[project]
dependencies = [
    "fastapi>=0.100",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov",
    "pytest-asyncio",
    "pytest-mock",
    "ruff",
    "mypy",
]
```

## CI/CD

Recommended GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -e ".[dev]"
      - run: ruff check .
      - run: ruff format --check .
      - run: mypy src/
      - run: pytest --cov=src --cov-report=xml
      - uses: codecov/codecov-action@v4
        if: matrix.python-version == '3.12'
```

## Deploy

**Docker pattern** (multi-stage):

```dockerfile
FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS production
COPY src/ src/
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- Use `python:3.12-slim` not `python:3.12` (500MB smaller)
- Never install dev dependencies in production image
- Use `--no-cache-dir` with pip to reduce image size
- Pin base image versions in production

## Reference

- **Official docs**: https://docs.python.org/3/
- **pytest**: https://docs.pytest.org/
- **ruff**: https://docs.astral.sh/ruff/
- **mypy**: https://mypy.readthedocs.io/
- **Real Python** (tutorials): https://realpython.com/
- **Python Packaging Guide**: https://packaging.python.org/
- **PEP Index**: https://peps.python.org/
