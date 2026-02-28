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

## Async Patterns

> Extracted from `wshobson/agents` plugin `python-development` — async-python-patterns skill

### When to use async

| Use async | Stay sync |
| --- | --- |
| I/O bound (HTTP, DB, files) | CPU bound (computation, ML) |
| Many concurrent connections | Simple sequential scripts |
| WebSocket servers | CLI tools with little I/O |
| API with high concurrency | Batch processing (use multiprocessing) |

### Core Patterns

```python
import asyncio

# Wrap blocking code for async context
result = await asyncio.to_thread(blocking_function, arg1, arg2)

# Concurrent tasks with gather
results = await asyncio.gather(fetch_users(), fetch_orders(), fetch_products())

# Rate limiting with semaphore
sem = asyncio.Semaphore(10)  # max 10 concurrent
async with sem:
    result = await api_call()

# Producer-consumer with Queue
queue: asyncio.Queue[str] = asyncio.Queue(maxsize=100)
# Producer: await queue.put(item)
# Consumer: item = await queue.get(); queue.task_done()
# Wait: await queue.join()
```

### Async Context Manager

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def db_connection(url: str):
    conn = await connect(url)
    try:
        yield conn
    finally:
        await conn.close()
```

## Background Jobs

> Extracted from `wshobson/agents` plugin `python-development` — python-background-jobs skill

### Celery (production config)

```python
# celery_config.py
broker_url = "redis://localhost:6379/0"
result_backend = "redis://localhost:6379/1"
task_acks_late = True          # ack after completion (crash-safe)
task_reject_on_worker_lost = True
worker_prefetch_multiplier = 1  # one task at a time per worker
task_time_limit = 300           # hard kill after 5 min
task_soft_time_limit = 240      # SoftTimeLimitExceeded after 4 min
```

### Idempotency Patterns

- **Check-before-write**: `if not already_processed(task_id): process()`
- **Idempotency keys**: store `task_id` in DB, skip if exists
- **Upsert**: `INSERT ... ON CONFLICT DO UPDATE`

### Alternatives

| Tool | Best for | Complexity |
| --- | --- | --- |
| Celery | Full-featured, multi-broker | High |
| RQ (Redis Queue) | Simple Redis-based jobs | Low |
| Dramatiq | Modern Celery alternative | Medium |
| Cloud-native (SQS, Cloud Tasks) | Serverless, managed | Low |

## Performance Optimization

> Extracted from `wshobson/agents` plugin `python-development` — python-performance-optimization skill

### Profiling

```bash
# CPU profiling
python -m cProfile -s cumulative script.py

# Line-by-line profiling
pip install line-profiler
kernprof -l -v script.py       # decorate functions with @profile

# Memory profiling
python -m tracemalloc           # builtin, for leak detection

# Production profiling (no restart needed)
pip install py-spy
py-spy top --pid <PID>          # live top-like view
py-spy record --pid <PID> -o profile.svg  # flamegraph
```

### Optimization Patterns

```python
# Use __slots__ for classes with many instances
class Point:
    __slots__ = ('x', 'y')
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# Use generators for large datasets (lazy evaluation)
def process_lines(path: Path):
    with path.open() as f:
        yield from (line.strip() for line in f if line.strip())

# Batch DB operations (not one-by-one)
cursor.executemany("INSERT INTO t (a, b) VALUES (%s, %s)", batch_data)

# Cache expensive computations
from functools import lru_cache
@lru_cache(maxsize=256)
def expensive_lookup(key: str) -> Result: ...
```

### Performance Testing

```bash
pip install pytest-benchmark
# In tests:
# def test_perf(benchmark):
#     result = benchmark(my_function, arg1, arg2)
```

## FastAPI Patterns

> Extracted from `wshobson/agents` plugin `python-development` — fastapi-pro agent

### Project Structure

```text
app/
├── api/
│   └── v1/
│       ├── endpoints/
│       │   ├── users.py
│       │   └── orders.py
│       └── router.py          # includes all endpoint routers
├── core/
│   ├── config.py              # Pydantic Settings
│   └── security.py            # auth dependencies
├── models/                     # SQLAlchemy models
├── schemas/                    # Pydantic request/response models
├── services/                   # business logic
└── main.py
```

### Pydantic V2 Conventions

```python
from pydantic import BaseModel, ConfigDict, Field

class UserCreate(BaseModel):
    model_config = ConfigDict(strict=True)
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ORM mode
    id: int
    name: str
    email: str
```

### Configuration with Pydantic Settings

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    debug: bool = False
```

### SQLAlchemy 2.0 Async

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("postgresql+asyncpg://...", pool_size=20)
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_user(user_id: int) -> User | None:
    async with async_session() as session:
        return await session.get(User, user_id)
```

## Anti-Patterns (Advanced)

> Extracted from `wshobson/agents` plugin `python-development` — python-anti-patterns skill

### Infrastructure Anti-Patterns

```python
# BAD: scattered timeout/retry logic
response = requests.get(url, timeout=30)

# GOOD: centralized retry with tenacity
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, max=10))
def fetch(url: str) -> Response:
    return requests.get(url, timeout=10)
```

### Architecture Anti-Patterns

```python
# BAD: ORM model leaked to API response (exposes internal fields)
@app.get("/users/{id}")
async def get_user(id: int) -> User:  # SQLAlchemy model directly
    return await db.get(User, id)

# GOOD: separate schema (Pydantic) from model (SQLAlchemy)
@app.get("/users/{id}")
async def get_user(id: int) -> UserResponse:  # Pydantic response model
    user = await db.get(User, id)
    return UserResponse.model_validate(user)
```

### Batch Error Handling

```python
from dataclasses import dataclass, field

@dataclass
class BatchResult[T]:
    successes: list[T] = field(default_factory=list)
    failures: list[tuple[T, Exception]] = field(default_factory=list)

    @property
    def success_rate(self) -> float:
        total = len(self.successes) + len(self.failures)
        return len(self.successes) / total if total else 0.0
```

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
