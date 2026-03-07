# UX Principles — Web Projects

## Mandatory gates (apply to all UI work)

- **Never code UI without a wireframe approval** — use `/ux` for the 3-phase workflow
- **One primary CTA per screen** — two primary actions = zero primary actions
- **Handle all three states for every async view**: loading (skeleton), empty (CTA), error (recovery)
- **Mobile-first** — design at 375px, enhance for desktop

## Layout & Responsive

- Maximum content width: `max-w-2xl` for reading content, `max-w-5xl` for layouts
- Touch targets: minimum 44x44px for all interactive elements
- Responsive breakpoints: test at 375px (mobile), 768px (tablet), 1280px (desktop)

## Typographie & Contraste

- Typography scale: h1 → h2 → h3 → body → small — never skip levels
- Contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- Spacing: generous padding over dense layouts — breathing room aids comprehension

## Composants & Affordance

- Use design system primitives before building custom components
- Soft shadows + rounded corners for depth (never hard box shadows on cards)
- Micro-interactions on primary actions (hover states, focus rings, loading spinners)
- Disable buttons during async operations — never allow double-submit

## Flux multi-étapes

- Progress indicators for multi-step flows (step X of N)
- Never walls of text — one idea per screen, break cognitive load
- Empty states must have a call to action — never just "No results"
- Every dead end has an escape action — never abandon the user

## PWA

- Manifest with `theme_color`, `background_color`, icons 192px + 512px
- Service worker: Network First for API calls, Cache First for static assets
- Offline fallback page with in-tone message (not a generic browser error)
- Install prompt: not on first visit, snooze if dismissed (7-day minimum)
- Lighthouse PWA score target: >= 90
