# Stack: Go

## Defaults

| Placeholder | Value |
|---|---|
| SRC_DIR | `cmd/` |
| TEST_DIR | `cmd/` |
| TEST_COMMAND | `go test ./...` |
| TEST_COMMAND_SINGLE | `go test` |
| TEST_COMMAND_COVERAGE | `go test -cover ./...` |
| FORMAT_CHECK_COMMAND | `gofmt -l . && go vet ./...` |
| FORMAT_FIX_COMMAND | `gofmt -w .` |

## Project Structure

```text
project/
├── cmd/
│   └── app/
│       └── main.go           # entrypoint
├── internal/                  # private packages
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/                       # public reusable packages
├── go.mod
├── go.sum
├── Makefile
└── Dockerfile
```

- Tests co-located: `handler.go` + `handler_test.go` in same package
- Use `internal/` for private code, `pkg/` for reusable libraries
- `cmd/` for entrypoints (one per binary)

## Testing

**Framework**: `go test` (stdlib — no external framework needed)

```bash
go test ./...                          # all tests
go test ./internal/handler/            # single package
go test -run TestLoginSuccess ./...    # single test
go test -cover ./...                   # coverage
go test -race ./...                    # race detector
```

- Use table-driven tests with `t.Run()` subtests
- Use `testify/assert` for cleaner assertions (optional but recommended)
- Use `httptest` for HTTP handler testing
- Use `t.Parallel()` for independent tests

## Formatting & Linting

- **Formatter**: `gofmt` (built-in, non-negotiable)
- **Linter**: `golangci-lint` (aggregator — replaces dozens of individual linters)

```bash
gofmt -l .                   # check
gofmt -w .                   # fix
golangci-lint run ./...      # lint
go vet ./...                 # built-in static analysis
```

## Reference

- **Official docs**: https://go.dev/doc/
- **Effective Go**: https://go.dev/doc/effective_go
- **Go by Example**: https://gobyexample.com/
- **golangci-lint**: https://golangci-lint.run/
- **Standard library**: https://pkg.go.dev/std

<!-- TODO: Complete sections (Idiomatic Patterns, Common Pitfalls, CI/CD, Deploy) -->
