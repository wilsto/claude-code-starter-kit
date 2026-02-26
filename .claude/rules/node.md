---
paths: ["**/*.js", "**/*.mjs", "**/*.cjs", "package.json"]
---

# Node.js Conventions

## Testing
- Framework: **vitest**
- File names: `*.test.ts`
- Use `describe` + `it` blocks, `vi.mock()` for modules, `vi.fn()` for spies
- Use `supertest` for HTTP endpoint testing

## Formatting & Linting
- **Prettier** for formatting, **ESLint** for logic
- Check: `npx prettier --check .`
- Fix: `npx prettier --write .`

## TypeScript
- Prefer TypeScript over plain JavaScript
- Strict mode with `noUncheckedIndexedAccess`
- Use `@/` path alias via tsconfig paths
- Never use `any` — use `unknown` + type guards

## Structure
- Tests in `tests/` mirroring `src/` structure
- `src/routes/` for API routes, `src/services/` for business logic
- `src/models/` for data models, `src/utils/` for shared utilities
