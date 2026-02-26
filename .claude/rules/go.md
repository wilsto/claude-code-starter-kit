---
paths: ["**/*.go", "go.mod", "go.sum"]
---

# Go Conventions

## Testing
- Framework: `go test` (stdlib — no external framework needed)
- Tests co-located: `handler.go` + `handler_test.go` in same package
- Use table-driven tests with `t.Run()` subtests
- Use `t.Parallel()` for independent tests
- Use `httptest` for HTTP handler testing
- Use `testify/assert` for cleaner assertions (optional)
- Run race detector: `go test -race ./...`

## Formatting & Linting
- **gofmt** for formatting (built-in, non-negotiable)
- **golangci-lint** for linting (aggregator)
- Check: `gofmt -l . && go vet ./...`
- Fix: `gofmt -w .`

## Structure
- `cmd/` for entrypoints (one per binary)
- `internal/` for private packages, `pkg/` for reusable libraries
- No `src/` directory — Go uses `cmd/` + `internal/` + `pkg/`
