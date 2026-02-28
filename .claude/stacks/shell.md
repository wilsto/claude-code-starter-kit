# Stack: Shell Scripting

> Extracted from `wshobson/agents` plugin `shell-scripting` (v1.2.1) — 2026-02-28

## Defaults

| Placeholder | Value |
| --- | --- |
| TEST_COMMAND | `bats tests/` |
| FORMAT_CHECK_COMMAND | `shellcheck scripts/*.sh && shfmt -d scripts/` |
| FORMAT_FIX_COMMAND | `shfmt -w scripts/` |

## Strict Mode (mandatory)

Every script starts with:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail
# -E: inherit ERR trap in functions
# -e: exit on error
# -u: exit on undefined variable
# -o pipefail: pipe fails if any command fails
```

## 10 Defensive Patterns

### 1. Script Directory Detection

```bash
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
```

### 2. Error Trapping + Cleanup

```bash
cleanup() { rm -rf -- "$TMPDIR"; }
trap cleanup EXIT
trap 'echo "Error on line $LINENO" >&2' ERR
TMPDIR=$(mktemp -d)
```

### 3. Required Variable Validation

```bash
: "${REQUIRED_VAR:?REQUIRED_VAR is not set}"
```

### 4. Safe File Iteration (NUL-delimited)

```bash
while IFS= read -r -d '' file; do
    echo "Processing: $file"
done < <(find "$input_dir" -type f -print0)
```

### 5. Robust Argument Parsing

```bash
while [[ $# -gt 0 ]]; do
    case "$1" in
        -v|--verbose) VERBOSE=true; shift ;;
        -o|--output) OUTPUT_FILE="$2"; shift 2 ;;
        -h|--help) usage 0 ;;
        --) shift; break ;;
        -*) echo "ERROR: Unknown option: $1" >&2; usage 1 ;;
        *) ARGS+=("$1"); shift ;;
    esac
done
```

### 6. Structured Logging

```bash
log_info()  { echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO:  $*" >&2; }
log_warn()  { echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARN:  $*" >&2; }
log_error() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; }
```

### 7. Dependency Checking

```bash
check_dependencies() {
    local -a missing=()
    for cmd in "jq" "curl" "git"; do
        command -v "$cmd" &>/dev/null || missing+=("$cmd")
    done
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        return 1
    fi
}
```

### 8. Idempotent Design

```bash
ensure_directory() { [[ -d "$1" ]] || mkdir -p "$1"; }
ensure_symlink() { [[ -L "$2" ]] || ln -s "$1" "$2"; }
```

### 9. Dry-Run Support

```bash
DRY_RUN="${DRY_RUN:-false}"
run_cmd() {
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "[DRY RUN] $*" >&2
        return 0
    fi
    "$@"
}
```

### 10. Signal Handling + Process Orchestration

```bash
PIDS=()
cleanup_procs() {
    for pid in "${PIDS[@]}"; do
        kill -TERM "$pid" 2>/dev/null || true
    done
}
trap cleanup_procs SIGTERM SIGINT
```

## POSIX vs Bash

Use POSIX sh only when targeting Alpine/BusyBox/minimal containers. Otherwise prefer Bash.

| Feature | Bash | POSIX sh |
| --- | --- | --- |
| Arrays | `declare -a arr=()` | Positional params `set --` |
| Conditionals | `[[ ]]` | `[ ]` |
| Local vars | `local var` | Prefixed naming (`_fn_var`) |
| String replace | `${var//old/new}` | `echo "$var" \| sed` |
| Regex match | `[[ =~ ]]` | `case` statement |
| Pipe fail | `set -o pipefail` | Not available |
| Source | `source` or `.` | `.` only |
| String compare | `==` | `=` only |

## Testing with Bats

**Framework**: [Bats-core](https://github.com/bats-core/bats-core)

```bash
# tests/test_deploy.bats
setup() {
    TMPDIR=$(mktemp -d)
    export PATH="$BATS_TEST_DIRNAME/../scripts:$PATH"
}

teardown() {
    rm -rf "$TMPDIR"
}

@test "deploy script requires environment argument" {
    run deploy.sh
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Usage:" ]]
}

@test "deploy script creates release directory" {
    run deploy.sh staging
    [ "$status" -eq 0 ]
    [ -d "$TMPDIR/releases/staging" ]
}
```

### Mocking External Commands

```bash
# Create a stub directory
setup() {
    STUBS_DIR=$(mktemp -d)
    # Stub 'kubectl' to return fake output
    echo '#!/bin/bash
echo "pod/my-app-abc123 1/1 Running"' > "$STUBS_DIR/kubectl"
    chmod +x "$STUBS_DIR/kubectl"
    export PATH="$STUBS_DIR:$PATH"
}
```

## ShellCheck Configuration

```ini
# .shellcheckrc
shell=bash
enable=avoid-nullary-conditions,require-variable-braces
disable=SC1091
external-sources=true
```

### Common Error Codes

| Code | Issue | Fix |
| --- | --- | --- |
| SC2086 | Unquoted variable | `"$var"` not `$var` |
| SC2046 | Unquoted command sub | `"$(cmd)"` not `$(cmd)` |
| SC2155 | Declare + assign | `local var; var=$(cmd)` |
| SC2164 | `cd` without `\|\|` | `cd "$dir" \|\| exit 1` |
| SC2034 | Unused variable | Remove or export |

## Modern Bash 5.x Features

```bash
# Case transformation
name="hello world"
echo "${name@U}"    # HELLO WORLD (uppercase)
echo "${name@L}"    # hello world (lowercase)
echo "${name@u}"    # Hello world (capitalize first)

# Safe quoting for eval
echo "${name@Q}"    # 'hello world'

# Wait for any background job
wait -n

# Read into array with delimiter
mapfile -d ',' -t items <<< "a,b,c"
```

## Quality Checklist (before commit)

- [ ] ShellCheck passes with zero errors
- [ ] shfmt formatting consistent
- [ ] Bats tests pass
- [ ] All variable expansions quoted (`"$var"`)
- [ ] Temp resources cleaned up with EXIT trap
- [ ] `--help` flag implemented
- [ ] Input validation prevents injection
- [ ] Strict mode enabled (`set -Eeuo pipefail`)

## Reference

- **Bash manual**: https://www.gnu.org/software/bash/manual/
- **ShellCheck**: https://www.shellcheck.net/
- **shfmt**: https://github.com/mvdan/sh
- **Bats-core**: https://github.com/bats-core/bats-core
- **Google Shell Style Guide**: https://google.github.io/styleguide/shellguide.html
- **Pure Bash Bible**: https://github.com/dylanaraps/pure-bash-bible
