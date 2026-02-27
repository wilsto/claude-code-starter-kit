---
name: prd-development
description: >
  Guide PMs through structured PRD creation: problem framing, user research synthesis,
  solution definition, success criteria, and user stories. 8 phases over 2-4 days.
  Triggers: "write a PRD", "PRD for", "product requirements", "requirements document".
type: workflow
---

## Purpose
Guide product managers through structured PRD (Product Requirements Document) creation by orchestrating problem framing, user research synthesis, solution definition, and success criteria into a cohesive document. Use this to move from scattered notes and Slack threads to a clear, comprehensive PRD that aligns stakeholders and serves as a source of truth.

This is not a waterfall spec -- it's a living document that captures strategic context, customer problems, proposed solutions, and success criteria, evolving as you learn through delivery.

## Key Concepts

### PRD Structure (Standard Template)

```markdown
# [Feature/Product Name] PRD

## 1. Executive Summary
## 2. Problem Statement
## 3. Target Users & Personas
## 4. Strategic Context
## 5. Solution Overview
## 6. Success Metrics (Primary / Secondary / Guardrail)
## 7. User Stories & Requirements
## 8. Out of Scope
## 9. Dependencies & Risks
## 10. Open Questions
```

### Key Concept: Guardrail Metrics
Beyond primary and secondary metrics, define **guardrail metrics** -- things that should NOT get worse:
- Example: "Sign-up conversion rate must not decrease" when adding onboarding friction
- Prevents tunnel vision on primary metric at the cost of other important metrics

### Anti-Patterns
- **Not a detailed spec:** PRDs frame the problem and solution; they don't specify UI pixel-by-pixel
- **Not waterfall:** PRDs evolve as you learn; not frozen contracts
- **Not a substitute for collaboration:** PRDs complement conversation, not replace it

### Facilitation Source of Truth

When running this workflow as a guided conversation, use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the interaction protocol.

## Application

This workflow orchestrates **8 phases** over **2-4 days**.

### Phase 1: Executive Summary (30 min)
- Format: "We're building [solution] for [persona] to solve [problem], which will result in [impact]."
- Write first (forces clarity), refine last (after other sections complete)

### Phase 2: Problem Statement (60 min)
- Frame the customer problem with evidence
- Include: Who has this problem? What is it? Why is it painful? Evidence (quotes, data, tickets)
- Use `discovery-interview-prep` skill output if available

### Phase 3: Target Users & Personas (30 min)
- Define primary and secondary personas
- Include: role, goals, pain points, behaviors, tech savviness

### Phase 4: Strategic Context (45 min)
- Link to business goals (OKRs)
- Market opportunity (TAM/SAM/SOM if applicable)
- Competitive landscape
- "Why now?" rationale

### Phase 5: Solution Overview (60 min)
- High-level description (2-3 paragraphs, not detailed spec)
- Key features list
- User flows or wireframes (optional)

### Phase 6: Success Metrics (30 min)
- **Primary metric:** The ONE metric this feature must move (e.g., "Activation rate: 40% -> 60%")
- **Secondary metrics:** Additional indicators (e.g., time-to-first-action, support ticket volume)
- **Guardrail metrics:** What should NOT get worse (e.g., "Sign-up conversion stays at 10%")

### Phase 7: User Stories & Requirements (90-120 min)
- Write epic hypothesis
- Break down epic into user stories (use `user-story` skill)
- Each story with acceptance criteria (Gherkin format)
- Document constraints and edge cases

### Phase 8: Out of Scope & Dependencies (30 min)
- What we're NOT building (and why not now)
- Technical and external dependencies
- Risks and mitigations
- Open questions requiring discovery

### Workflow Timeline

```
Day 1:
|- Phase 1: Executive Summary (30 min)
|- Phase 2: Problem Statement (60 min)
|- Phase 3: Target Users & Personas (30 min)
|- Phase 4: Strategic Context (45 min)

Day 2:
|- Phase 5: Solution Overview (60 min)
|- Phase 6: Success Metrics (30 min)
|- Phase 7: User Stories & Requirements (90-120 min)

Day 3:
|- Phase 8: Out of Scope & Dependencies (30 min)
|- Review & Refine (60 min)

Day 4 (Optional):
|- Stakeholder Review & Approval
```

**Time estimates:**
- Fast track: 1.5-2 days (straightforward feature, clear requirements)
- Typical: 2-3 days (includes discovery synthesis, stakeholder review)
- Complex: 3-4 days (major initiative, multiple personas)

## Examples

### Example: Problem Statement Section

```markdown
## 2. Problem Statement

### Who has this problem?
Non-technical small business owners who sign up for our SaaS product.

### What is the problem?
60% of users abandon onboarding within 24 hours because they see an empty
dashboard with no guidance.

### Evidence
- Interviews: 8/10 churned users said "I didn't know what to do first"
- Analytics: 60% of signups complete 0 actions within 24 hours
- Support: "How do I get started?" is #1 question (350 tickets/month)
- Quote: "I logged in, saw an empty dashboard, and thought 'now what?'"
```

### Example: Success Metrics Section

```markdown
## 6. Success Metrics

### Primary Metric
Activation rate (% users completing first action within 24h): 40% -> 60%

### Secondary Metrics
- Time-to-first-action: 3 days -> 1 day
- Checklist completion rate: 80%
- Support tickets "How to start?": 350/mo -> 175/mo

### Guardrail Metrics
- Sign-up conversion rate: maintain at 10% (don't add friction)
```

## Common Pitfalls

### Pitfall 1: PRD Written in Isolation
**Symptom:** PM writes PRD alone, presents finished doc
**Fix:** Collaborate with design + eng on Phase 7 (user stories). Review draft before finalizing.

### Pitfall 2: No Evidence in Problem Statement
**Symptom:** "We believe users have this problem" (no data, no quotes)
**Fix:** Include customer quotes, analytics, support tickets. Run discovery first if needed.

### Pitfall 3: Solution Too Prescriptive
**Symptom:** PRD specifies exact UI, pixel dimensions, button colors
**Fix:** Keep Phase 5 high-level; let design own UI details.

### Pitfall 4: No Success Metrics
**Symptom:** PRD defines problem + solution but no metrics
**Fix:** Always define primary metric (what you're optimizing for) + guardrail metrics.

### Pitfall 5: Out of Scope Not Documented
**Symptom:** No section on what's NOT being built
**Fix:** Explicitly document out of scope in Phase 8 to prevent scope creep.

## References

### Related Skills
- `user-story` -- User stories with acceptance criteria (Phase 7)
- `discovery-interview-prep` -- Validates problem statement (Phase 2)
- `prioritization-advisor` -- Helps prioritize features in roadmap context
- `opportunity-solution-tree` -- Generates solution hypotheses (pre-PRD)

### External Frameworks
- Martin Eriksson, "How to Write a Good PRD" (2012)
- Marty Cagan, *Inspired* (2017)
- Amazon, "Working Backwards" (PR/FAQ format)

### Credit
- Adapted from Dean Peters, Product Manager Skills (CC BY-NC-SA 4.0).
