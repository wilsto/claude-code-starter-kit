---
name: polaris
description: >
  Guide the user through defining their north star: top of mind, goals, and values.
  Writes directly to memory/polaris.md.
  Triggers: "polaris", "north star", "fill polaris", "define my goals".
  Auto-invoke: when memory/polaris.md is empty or contains only template placeholders.
type: interactive
---

## Purpose

Guide users through defining their personal north star -- priorities, goals, and working values -- by asking adaptive questions. The output is written directly to `memory/polaris.md`, which is auto-injected at every session start (~100 tokens) to align Claude's recommendations with what matters most to the user.

This is not a life coaching session -- it's a focused 5-minute exercise to produce a concise, actionable reference document that Claude uses as a compass.

## Key Concepts

### What Makes a Good Polaris

A good north star is:
- **Concise:** 3-5 items per section, one line each
- **Actionable:** Claude can reference it to evaluate alignment of decisions
- **Current:** Refreshed every 1-2 weeks as priorities shift
- **Honest:** Includes what's actually top of mind, not what sounds impressive

### Anti-Patterns
- **Wish list:** Listing 15 goals defeats the purpose -- force prioritization
- **Vague aspirations:** "Be better at my job" is not actionable; "Ship v2.0 of the API by March" is
- **Static forever:** A Polaris that hasn't changed in 3 months is probably stale
- **Corporate speak:** Write like you think, not like a mission statement

### Auto-Invocation

This skill auto-triggers when Claude detects that `memory/polaris.md` is empty (contains only HTML comments / template placeholders). Claude proposes:

> "Your Polaris (north star) is empty. Want to fill it now? It takes ~5 minutes and helps me align my recommendations with your priorities."
> 1. Yes, let's go (Guided)
> 2. I'll paste my priorities (Context dump)
> 3. Skip for now

If the user skips, do not re-propose in the same session.

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

It defines: session heads-up + entry mode (Guided, Context dump, Best guess), one-question turns, progress labels, interruption handling, numbered recommendations at decision points, quick-select options.

This file defines the domain-specific question content. If there is a conflict, follow this file's domain logic.

## Application

This interactive skill asks **up to 8 adaptive questions**, offering **3-4 options** at each step, organized in **3 phases**.

### Step 0: Gather Context

Before questions, check if `memory/polaris.md` already has content:
- **Empty:** Start fresh with full question flow
- **Has content:** Show current content and ask whether to Update (selective), Rewrite (full), or Review (validate)

### Phase 1: Top of Mind (`Context Q1-3/8`)

#### Question 1: Current Focus

"What are you actively working on or thinking about right now? List everything that comes to mind."

(Open-ended -- capture raw input. No numbered options for this one.)

#### Question 2: Prioritization

"Looking at what you listed, which feel most critical right now?" (adapted from Q1 answers)

1. Present the items from Q1 as numbered options
2. Ask the user to pick their top 3-5
3. Offer: "All of these" / "Let me reorder"

#### Question 3: Hidden Priorities (optional)

"Is there anything you're avoiding or procrastinating on that probably should be on this list?"

1. **Yes, let me add it** -- user adds items
2. **No, the list is complete** -- move to Phase 2
3. **I'd rather not think about that right now** -- move on, no judgment

### Phase 2: Goals & Direction (`Context Q4-6/8`)

#### Question 4: Success Vision

"What does success look like for you in the next 3-6 months?"

1. **Shipping something specific** -- a product, feature, or project milestone
2. **Learning or growing** -- acquiring new skills, exploring a domain
3. **Building or establishing** -- a team, a community, a practice, a habit
4. **Simplifying or reducing** -- clearing debt (technical, organizational, personal)

Follow up based on choice to get concrete, one-line goal statements.

#### Question 5: The One Thing

"If you could only accomplish ONE thing from your goals, which would it be and why?"

(Forces clarity -- the answer often reveals the real priority.)

#### Question 6: Success Criteria (optional)

"What would need to be true for you to feel this period was a success?"

1. **Measurable outcome** -- specific metric or deliverable
2. **Feeling/state** -- confidence, calm, momentum
3. **External validation** -- feedback, adoption, recognition
4. **Progress, not perfection** -- meaningful movement on a long journey

### Phase 3: Values & Principles (`Context Q7-8/8`)

#### Question 7: Working Style

"How do you prefer to work? What matters most in how things get done?"

1. **Simplicity over cleverness** -- minimal, clean, straightforward
2. **Speed over perfection** -- ship fast, iterate, learn
3. **Craftsmanship over speed** -- quality, durability, attention to detail
4. **Autonomy over process** -- independence, minimal overhead

(User can pick multiple or write their own.)

#### Question 8: Hard-Won Wisdom

"What's a principle you've learned the hard way that you never want to forget?"

(Open-ended -- this produces the most personal and useful values.)

### Output: Write to polaris.md

After the final question:

1. **Show preview:** Display the synthesized content in the 3-section format
2. **Ask for confirmation:** "Does this capture your north star accurately? I can adjust before saving."
3. **Write to file:** Update `memory/polaris.md` preserving the header and description block
4. **Confirm injection:** Note that this will be auto-injected at every session start

Output format (written to `memory/polaris.md`):

```markdown
# Polaris -- North Star

> Strategic context that guides Claude's thinking and recommendations.
> Auto-injected at session start (~100 tokens). Update every few weeks.
> Keep concise -- this is a compass, not a journal.

## Top of Mind

- [Item 1 from Phase 1]
- [Item 2 from Phase 1]
- [Item 3 from Phase 1]

## Goals & Direction

- [Goal 1 from Phase 2]
- [Goal 2 from Phase 2]

## Values & Principles

- [Value 1 from Phase 3]
- [Value 2 from Phase 3]
- [Principle from Q8]
```

## Examples

### Example: Solo Developer Working on a SaaS

**Top of Mind:**
- Ship MVP of the billing module by end of month
- Fix the auth bug blocking 3 customers
- Prepare talk for local meetup

**Goals & Direction:**
- Q1: Launch paid tier with Stripe integration
- Build a repeatable deploy pipeline (currently manual)

**Values & Principles:**
- Ship small, ship often -- big PRs are where bugs hide
- Tests before code, always (learned after a production outage)
- Ask for help early -- stuck for 30 min = time to ask

### Example: Product Manager at a Scale-up

**Top of Mind:**
- Finalize Q2 roadmap with engineering leads
- Synthesize last sprint's user interviews
- Onboard new junior PM

**Goals & Direction:**
- Reduce churn by 15% through improved onboarding flow
- Establish continuous discovery habit (weekly interviews)

**Values & Principles:**
- Data informs, humans decide -- don't hide behind metrics
- One clear priority beats three vague ones
- Write things down -- if it's not written, it didn't happen

## Common Pitfalls

### Pitfall 1: The Everything List
**Symptom:** 12 items in Top of Mind, 8 goals, nothing feels prioritized.
**Fix:** Force rank. If everything is important, nothing is. Cap at 5 items per section.

### Pitfall 2: Corporate Mission Statement
**Symptom:** "Deliver value-driven solutions leveraging synergistic frameworks."
**Fix:** Write like you talk. "Ship the API. Stop breaking prod on Fridays."

### Pitfall 3: Set and Forget
**Symptom:** Polaris hasn't been updated in 2 months but priorities have shifted.
**Fix:** Review every 1-2 weeks. Run `/polaris` with "Review" mode to validate.

### Pitfall 4: Aspirational vs Actual
**Symptom:** Goals describe who you want to be, not what you're actually doing.
**Fix:** Q3 (hidden priorities) is designed to surface this gap. Be honest.

## References

### Inspiration
- @jameesy, "How I Structure Obsidian & Claude" (2026) -- Polaris / Top of Mind concept
- Steph Ango (@kepano), "File over app" -- durable plain-text knowledge
- Greg McKeown, *Essentialism* (2014) -- the disciplined pursuit of less

### Related Skills
- [`workshop-facilitation`](../workshop-facilitation/SKILL.md) -- interaction protocol
