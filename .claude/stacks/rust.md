# Stack: Rust

## Defaults

| Placeholder | Value |
|---|---|
| SRC_DIR | `src/` |
| TEST_DIR | `src/` |
| TEST_COMMAND | `cargo test` |
| TEST_COMMAND_SINGLE | `cargo test` |
| TEST_COMMAND_COVERAGE | `cargo tarpaulin` |
| FORMAT_CHECK_COMMAND | `cargo fmt --check && cargo clippy -- -D warnings` |
| FORMAT_FIX_COMMAND | `cargo fmt` |

## Project Structure

```text
project/
├── src/
│   ├── main.rs               # binary entrypoint
│   ├── lib.rs                 # library root
│   └── modules/
├── tests/                     # integration tests
│   └── integration_test.rs
├── benches/                   # benchmarks
├── Cargo.toml
├── Cargo.lock
└── Dockerfile
```

- Unit tests co-located in `#[cfg(test)] mod tests` at bottom of each file
- Integration tests in `tests/` directory
- Benchmarks in `benches/`

## Testing

**Framework**: `cargo test` (built-in)

```bash
cargo test                             # all tests
cargo test test_name                   # single test
cargo test -- --nocapture              # show println output
cargo tarpaulin                        # coverage (install: cargo install cargo-tarpaulin)
```

- Use `#[cfg(test)]` module at bottom of source files for unit tests
- Use `assert!`, `assert_eq!`, `assert_ne!` macros
- Use `#[should_panic]` for expected panics
- Use `proptest` or `quickcheck` for property-based testing

## Formatting & Linting

- **Formatter**: `cargo fmt` (rustfmt — built-in, non-negotiable)
- **Linter**: `cargo clippy` (official lint tool)

```bash
cargo fmt --check              # check
cargo fmt                      # fix
cargo clippy -- -D warnings    # lint (treat warnings as errors)
```

## Reference

- **The Rust Book**: https://doc.rust-lang.org/book/
- **Rust by Example**: https://doc.rust-lang.org/rust-by-example/
- **std docs**: https://doc.rust-lang.org/std/
- **crates.io**: https://crates.io/
- **Clippy lints**: https://rust-lang.github.io/rust-clippy/

<!-- TODO: Complete sections (Idiomatic Patterns, Common Pitfalls, CI/CD, Deploy) -->
