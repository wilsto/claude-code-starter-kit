---
paths: ["**/*.rs", "Cargo.toml", "Cargo.lock"]
---

# Rust Conventions

## Testing
- Framework: `cargo test` (built-in)
- Unit tests: `#[cfg(test)] mod tests` at bottom of source files
- Integration tests in `tests/` directory
- Use `assert!`, `assert_eq!`, `assert_ne!` macros
- Use `#[should_panic]` for expected panics
- Coverage: `cargo tarpaulin`

## Formatting & Linting
- **cargo fmt** (rustfmt — built-in, non-negotiable)
- **cargo clippy** for linting: `cargo clippy -- -D warnings`
- Check: `cargo fmt --check && cargo clippy -- -D warnings`
- Fix: `cargo fmt`

## Structure
- `src/main.rs` for binary entrypoint, `src/lib.rs` for library root
- Integration tests in `tests/`, benchmarks in `benches/`
