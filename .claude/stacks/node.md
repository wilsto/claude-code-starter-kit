# Stack: Node.js

## Defaults

| Placeholder | Value |
|---|---|
| SRC_DIR | `src/` |
| TEST_DIR | `tests/` |
| TEST_COMMAND | `npx vitest run` |
| TEST_COMMAND_SINGLE | `npx vitest run` |
| TEST_COMMAND_COVERAGE | `npx vitest run --coverage` |
| FORMAT_CHECK_COMMAND | `npx prettier --check .` |
| FORMAT_FIX_COMMAND | `npx prettier --write .` |

## Project Structure

```text
project/
├── src/
│   ├── index.ts               # entrypoint
│   ├── routes/                # API routes
│   ├── services/              # business logic
│   ├── models/                # data models
│   └── utils/                 # shared utilities
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .prettierrc
└── Dockerfile
```

- Prefer TypeScript over plain JavaScript
- Tests in `tests/` mirroring `src/` structure
- Use `@/` path alias via tsconfig paths

## Testing

**Framework**: vitest

```bash
npx vitest run                         # all tests
npx vitest run tests/unit/auth.test.ts # single file
npx vitest                             # watch mode
npx vitest run --coverage              # coverage
```

- File names: `*.test.ts`
- Use `describe` + `it` blocks
- Use `vi.mock()` for module mocking, `vi.fn()` for spies
- Use `supertest` for HTTP endpoint testing

## Formatting & Linting

- **Formatter**: Prettier
- **Linter**: ESLint

```bash
npx prettier --check .          # check
npx prettier --write .          # fix
npx eslint .                    # lint
npx eslint --fix .              # lint fix
```

## Type Checking

**TypeScript strict mode**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Reference

- **Node.js docs**: https://nodejs.org/docs/latest/api/
- **TypeScript docs**: https://www.typescriptlang.org/docs/
- **Vitest**: https://vitest.dev/
- **Prettier**: https://prettier.io/docs/
- **Express** (if used): https://expressjs.com/
- **Fastify** (if used): https://fastify.dev/docs/latest/

<!-- TODO: Complete sections (Idiomatic Patterns, Common Pitfalls, CI/CD, Deploy) -->
