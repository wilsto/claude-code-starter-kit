---
name: ux
description: >
  3-phase UX workflow: business clarification, textual wireframe validation,
  pixel-perfect implementation. Enforces WHAT/WHY first, design prototype before code.
  Triggers: "ux", "/ux", "design this page", "build a UI", "create a component",
  "redesign", "new screen", "landing page", "wireframe", "layout".
type: workflow
---

# UX Workflow — Clarify → Prototype → Implement

## When to use

- Any new page, screen, or significant UI component
- Redesigns of existing UI sections
- When the user says "build a form/layout/page"
- When the user describes a feature that will have a visible UI
- Never skip this workflow for UI work, even if the request sounds purely technical

## When NOT to use

- Pure backend work (API endpoints, DB migrations)
- Fixing a bug in existing UI (no layout change)
- Config files, scripts, documentation
- Adding a single line or small tweak to an existing component

## Integration points

- **Before `/tdd`**: UI components need UX validation before tests are written
- **Before `/spec-update`**: UX output (wireframe + decisions) feeds the spec's Behavior sections
- **After `/review`**: design review catches UX regressions in changed components

---

## Phase 1 — Clarification Métier (WHAT/WHY)

**Goal:** Understand WHAT and WHY before any visual thinking. Ask the PO, never assume.

### Step 1a — Read existing context

Before asking anything, read:

1. The functional spec for this domain: `docs/specs/<domain>.md` — check User Stories and Behavior
2. Project CLAUDE.md — routing conventions, component patterns
3. The app's CLAUDE.md if in a monorepo — styling conventions, shadcn list
4. The design system rule (`.claude/rules/design-system.md`) if it exists — project-specific tokens, palette, personas

### Step 1b — Identify the unknowns

From the spec and request, list what is NOT yet defined:

- **User goal**: what does the user want to accomplish on this screen?
- **Entry context**: where does the user come from? what state are they in?
- **Success state**: what does the screen look like when the task is done?
- **Empty/loading/error states**: what does the user see while waiting or on failure?
- **Constraints**: authenticated only? mobile-first? premium paywall? PWA offline?

### Step 1c — Ask targeted questions (WHAT/WHY only, never HOW)

Ask ALL unknowns in a single message. Maximum 5 questions. Format:

```
Phase 1/3 — Clarification

Before designing, I need to clarify:

1. [User goal question]
2. [Entry context question]
3. [Success state question]
4. [Edge case / constraint question]
5. [Priority / constraint question — optional]

(These are WHAT/WHY questions — I won't propose any layout until you answer.)
```

**STOP** — Wait for PO answers. Do NOT propose layout, components, or code at this stage.

### Step 1d — Validation gate

Declare answers understood. Summarize:

- User goal in one sentence
- Key states to handle (loading, empty, error, success)
- Constraints confirmed

Ask: "Is this understanding correct before I prototype?"

If PO confirms → proceed to Phase 2.

---

## Phase 2 — Prototypage Textuel

**Goal:** Validate layout and UX decisions BEFORE writing any code.

### Step 2a — Produce a textual wireframe

Use ASCII/text layout. Structure:

```
┌─────────────────────────────────────────────┐
│ [HEADER AREA — e.g., page title + subtitle] │
├─────────────────────────────────────────────┤
│ [PRIMARY CONTENT AREA]                      │
│   • [Element 1: type + purpose]             │
│   • [Element 2: type + purpose]             │
├─────────────────────────────────────────────┤
│ [SECONDARY CONTENT / SIDEBAR]               │
├─────────────────────────────────────────────┤
│ [CTA ZONE — primary action + secondary]     │
└─────────────────────────────────────────────┘

States:
- Loading: [describe skeleton/spinner behavior]
- Empty: [describe empty state copy + action]
- Error: [describe error message + recovery]

Mobile (<768px): [describe layout changes]
```

Rules for the wireframe:

- Every element must have a stated PURPOSE (why it's there)
- One and only one primary CTA per screen
- Never show more than 3 levels of visual hierarchy
- Call out any gamification elements (XP, badges, progress bars) explicitly
- Specify responsive behavior for mobile

### Step 2b — Justify UX decisions

For each significant design choice, state the rationale:

| Decision | Rationale | Alternative rejected |
|----------|-----------|----------------------|
| [choice] | [why this serves the user goal] | [what was considered] |

### Step 2c — Ask for PO validation

```
Phase 2/3 — Wireframe

[textual wireframe here]

UX Decisions:
[table above]

Questions before I code:
1. Is the hierarchy correct?
2. Are the states handled correctly?
3. Any copy/label feedback?

→ Approve to proceed to implementation, or request changes.
```

**STOP** — Do NOT write any React/Tailwind code until PO explicitly approves the wireframe.

---

## Phase 3 — Implémentation Pixel-Perfect

**Goal:** Translate the approved wireframe into production-ready code.

### Step 3a — Component decomposition

Before writing code, list components:

```
<PageName>
  ├── <HeaderSection>       — server or client?
  ├── <ContentArea>
  │   ├── <ItemCard>        — reusable?
  │   └── <EmptyState>      — when list is empty
  ├── <LoadingState>        — Suspense boundary
  └── <CTASection>          — primary action
```

### Step 3b — Design checklist

Check each component against the active design rules:

- [ ] Max-width constraint respected (max-w-2xl text, max-w-5xl layout)
- [ ] Typography scale used (h1/h2/h3/body/data) — no skipped levels
- [ ] Color tokens used (never raw hex values)
- [ ] Loading state present for async data (skeleton, not spinner)
- [ ] Empty state present for zero-data case (with CTA)
- [ ] Error state present for failure case (with recovery action)
- [ ] Single primary CTA identified
- [ ] Mobile-first (tested mentally at 375px)
- [ ] Touch targets >= 44x44px
- [ ] Dark mode tokens used (no raw white/black)
- [ ] WCAG AA contrast (4.5:1 body, 3:1 large)

### Step 3c — Implement

Follow the stack conventions (Server Components by default, shadcn primitives, project API client).

### Step 3d — Self-review

After implementation:

1. Compare output against the approved wireframe — does the code match?
2. Flag any deviations from the wireframe with explanation
3. Suggest `/tdd` for logic-bearing components
4. Suggest `/review` if 3+ files changed

### Step 3e — Report to PO

```
Phase 3/3 — Implementation complete

Files created/modified:
- [list]

Design checklist: [X passed / Y total]

Deviations from wireframe (if any):
- [or "None — implementation matches wireframe exactly"]

Next: /commit or /uat for full validation
```

---

## Rules

- Never skip Phase 1 even if the request seems obvious
- Never prototype before receiving PO answers to Phase 1 questions
- Never implement before PO approves the Phase 2 wireframe
- Phase 1 questions are WHAT/WHY only — never propose HOW
- One primary CTA per screen — hard rule
- Always handle loading, empty, and error states — no exceptions
- Use project color tokens and typography scale — never raw values
- Component decomposition must precede implementation
- Always state your recommendation when asking questions to the PO

## Anti-patterns

| Anti-pattern | Why it's wrong |
|---|---|
| Starting to code from a vague request | Solves the wrong problem — Phase 1 exists for this |
| Asking "how should I implement this?" in Phase 1 | Phase 1 is about WHAT/WHY, HOW is the dev's job |
| Skipping empty/error states | Breaks real user flows — users WILL hit these |
| Two primary CTAs on one screen | Splits user attention, decision paralysis |
| Using raw hex colors or pixel values | Breaks design system consistency and dark mode |
| Writing components before decomposing them | Leads to monolithic, untestable components |
| Skipping mobile consideration | Mobile-first means design for mobile FIRST |

## References

- `/spec-update` — update functional spec with UX decisions after Phase 3
- `/tdd` — write component tests after wireframe is approved
- `/review` — design review before committing UI changes
- `/uat` — full acceptance testing including UX validation scenarios
