# Stack: Next.js

## Defaults

| Placeholder | Value |
|---|---|
| SRC_DIR | `src/` |
| TEST_DIR | `src/` |
| TEST_COMMAND | `npx vitest run` |
| TEST_COMMAND_SINGLE | `npx vitest run` |
| TEST_COMMAND_COVERAGE | `npx vitest run --coverage` |
| FORMAT_CHECK_COMMAND | `npx prettier --check . && npx eslint .` |
| FORMAT_FIX_COMMAND | `npx prettier --write . && npx eslint --fix .` |

## Project Structure

Use the Next.js App Router layout (Next.js 13+):

```text
project/
├── src/
│   ├── app/                   # App Router pages and layouts
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/            # Shared React components
│   │   ├── ui/                # Generic UI primitives (Button, Input)
│   │   └── features/          # Feature-specific components
│   ├── lib/                   # Utility functions, API clients
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── .prettierrc
├── eslint.config.mjs
└── package.json
```

- Co-locate tests next to components (`Button.tsx` + `Button.test.tsx`) OR use `src/__tests__/` — pick one, stay consistent
- Server Components are the default in App Router. Add `"use client"` only when needed
- Route handlers in `src/app/api/<route>/route.ts`
- Middleware in `src/middleware.ts`

## Testing

**Unit/Integration**: vitest + React Testing Library
**E2E**: Playwright

```bash
npx vitest run                              # all unit tests
npx vitest run src/components/Button.test.tsx # single file
npx vitest                                   # watch mode
npx vitest run --coverage                    # coverage
npx playwright test                          # E2E
npx playwright test tests/auth.spec.ts       # E2E single
npx playwright test --ui                     # E2E with UI
```

**vitest.config.ts:**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
    },
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
```

**Conventions:**
- File names: `*.test.tsx` for components, `*.test.ts` for utilities
- Use `describe` blocks for grouping, `it` for individual tests
- Test user behavior, not implementation: query by role, text, label — never by CSS class

**Component testing pattern:**

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

**Server Component testing**: Cannot use React Testing Library (no DOM). Test via Playwright E2E or test data-fetching logic as pure functions.

**Mocking:**
- `vi.mock()` for modules, `vi.fn()` for spies
- Mock `next/navigation` for components using `useRouter`, `usePathname`:

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/dashboard",
}));
```

## Formatting & Linting

**Formatter**: Prettier — **Linter**: ESLint (flat config + Next.js plugin)

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80
}
```

`eslint.config.mjs`:

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

```bash
npx prettier --check . && npx eslint .     # check
npx prettier --write . && npx eslint --fix . # fix
```

- Prettier owns formatting (spacing, semicolons, quotes)
- ESLint owns logic (unused vars, hook rules, accessibility)
- Never configure formatting rules in ESLint
- Add `.prettierignore`: `node_modules/`, `.next/`, `coverage/`

## Type Checking

**TypeScript strict mode** — non-negotiable.

`tsconfig.json` essentials:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- Enable `noUncheckedIndexedAccess` — prevents `array[0]` from being non-nullable
- Never use `any` — use `unknown` and narrow with type guards
- Never use `as` type assertions except for test setup — prefer type guards
- Use `satisfies` for type-safe object literals: `const config = { ... } satisfies Config`
- Define API response types explicitly, never rely on inferred types from fetch

## Idiomatic Patterns

**DO:**
- Use Server Components by default, `"use client"` only when needed
- Use `@/` path alias for imports from `src/`
- Use `loading.tsx` and `error.tsx` for route-level states
- Use `Suspense` boundaries for granular loading
- Use `next/image` for all images (optimization, lazy loading)
- Use `next/link` for all internal navigation
- Use Route Handlers (`app/api/`) for API endpoints
- Fetch data in Server Components directly (no `useEffect` for initial data)
- Use `"use server"` for Server Actions (form mutations, data writes)

**DON'T:**
- Never fetch data in `useEffect` for initial page load — use Server Components
- Never use `getServerSideProps` or `getStaticProps` — those are Pages Router (legacy)
- Never put `"use client"` at the top of every file — push client boundaries down
- Never store server state in React state — use Server Components or React Query
- Never use `<a>` for internal links — always `<Link>`
- Never use `<img>` — always `<Image>` from `next/image`
- Never import from `next/router` — use `next/navigation` (App Router)

## Common Pitfalls

- **Hydration mismatch**: Server and client render different HTML. Common cause: `Date.now()`, `Math.random()`, browser-only APIs during render. Use `useEffect` for client-only values.
- **"use client" creep**: Marking a component client makes ALL children client too. Keep `"use client"` components small and leaf-level. Pass Server Component content as `children` props.
- **Import aliases in tests**: vitest needs the same `@/` alias. Add `resolve.alias` in `vitest.config.ts` matching `tsconfig.json` paths.
- **Environment variables**: Client-side must be prefixed `NEXT_PUBLIC_`. Server-only vars must NOT have this prefix. Never expose server env vars to client.
- **Caching**: Next.js aggressively caches in production. Use `revalidatePath()` or `revalidateTag()` after mutations.
- **Middleware vs Server Actions**: Middleware for auth checks and redirects. Server Actions for data mutations. Never mix.

## Dependencies

```bash
npm install <package>        # production
npm install -D <package>     # dev only

# Base
npm install next react react-dom
npm install -D typescript @types/react @types/node

# Testing
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D playwright @playwright/test

# Formatting/Linting
npm install -D prettier eslint eslint-config-next
```

Use exact versions in production (`npm install --save-exact`) for reproducible builds.

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
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npx prettier --check .
      - run: npx eslint .
      - run: npx tsc --noEmit
      - run: npx vitest run --coverage
      - uses: codecov/codecov-action@v4

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Deploy

**Recommended**: Vercel (zero-config for Next.js)

For Docker (self-hosted):

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

Requires `output: "standalone"` in `next.config.ts`:

```typescript
const nextConfig = { output: "standalone" };
```

- Set `NEXT_TELEMETRY_DISABLED=1` in CI/CD
- Use Preview Deployments (Vercel) for PR reviews

## Reference

- **Next.js docs**: https://nextjs.org/docs
- **React docs**: https://react.dev/
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Vercel Platform**: https://vercel.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
