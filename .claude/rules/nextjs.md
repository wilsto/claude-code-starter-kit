---
paths: ["**/*.tsx", "**/*.ts", "**/*.jsx", "next.config.*", "tailwind.config.*"]
---

# Next.js Conventions

## Testing
- Unit/Integration: **vitest** + React Testing Library
- E2E: **Playwright**
- Test user behavior, not implementation: query by role, text, label — never by CSS class
- Co-locate tests (`Button.tsx` + `Button.test.tsx`) or use `src/__tests__/` — stay consistent
- Mock `next/navigation` (not `next/router`) for components using `useRouter`

## Formatting & Linting
- **Prettier** for formatting, **ESLint** for logic (flat config + Next.js plugin)
- Check: `npx prettier --check . && npx eslint .`
- Never configure formatting rules in ESLint

## TypeScript
- **Strict mode** non-negotiable, enable `noUncheckedIndexedAccess`
- Never use `any` — use `unknown` + type guards
- Never use `as` assertions except test setup — prefer type guards
- Use `satisfies` for type-safe object literals
- Use `@/` path alias for imports from `src/`

## DO
- Server Components by default, `"use client"` only when needed
- `loading.tsx` and `error.tsx` for route-level states
- `next/image` for all images, `next/link` for all internal links
- Fetch data in Server Components directly (no `useEffect` for initial data)
- `"use server"` for Server Actions (form mutations, data writes)

## DON'T
- Never fetch data in `useEffect` for initial page load
- Never use `getServerSideProps`/`getStaticProps` (Pages Router = legacy)
- Never put `"use client"` at top of every file — push client boundaries down
- Never import from `next/router` — use `next/navigation` (App Router)
- Never use `<a>` for internal links or `<img>` — use Next.js components

## Pitfalls
- Hydration mismatch: avoid `Date.now()`, `Math.random()` during render
- `"use client"` creep: makes ALL children client — keep client components small
- Env vars: client-side must be prefixed `NEXT_PUBLIC_`
- Caching: use `revalidatePath()`/`revalidateTag()` after mutations
