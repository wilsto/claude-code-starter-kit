---
name: prioritization-advisor
description: >
  Guide PMs in choosing the right prioritization framework by asking adaptive questions
  about product stage, team context, decision-making needs, and data availability.
  Triggers: "prioritize", "which framework", "RICE vs ICE", "how to prioritize".
type: interactive
---

## Purpose
Guide product managers in choosing the right prioritization framework by asking adaptive questions about product stage, team context, decision-making needs, and stakeholder dynamics. Use this to avoid "framework whiplash" (switching frameworks constantly) or applying the wrong framework (e.g., using RICE for strategic bets or ICE for data-driven decisions). Outputs a recommended framework with implementation guidance tailored to your context.

This is not a scoring calculator -- it's a decision guide that matches prioritization frameworks to your specific situation.

## Key Concepts

### The Prioritization Framework Landscape

**Scoring frameworks:**
- **RICE** (Reach, Impact, Confidence, Effort) -- Data-driven, requires metrics
- **ICE** (Impact, Confidence, Ease) -- Lightweight, gut-check scoring
- **Value vs. Effort** (2x2 matrix) -- Quick wins vs. strategic bets
- **Weighted Scoring** -- Custom criteria with stakeholder input

**Strategic frameworks:**
- **Kano Model** -- Classify features by customer delight (basic, performance, delight)
- **Opportunity Scoring** -- Rate importance vs. satisfaction gap
- **Buy-a-Feature** -- Customer budget allocation exercise
- **Moscow** (Must, Should, Could, Won't) -- Forcing function for hard choices

**Contextual frameworks:**
- **Cost of Delay** -- Urgency-based (time-sensitive features)
- **Impact Mapping** -- Goal-driven (tie features to outcomes)
- **Story Mapping** -- User journey-based (narrative flow)

### Anti-Patterns
- **Not a universal ranking:** Frameworks aren't "better" or "worse" -- they fit different contexts
- **Not a replacement for strategy:** Frameworks execute strategy; they don't create it
- **Not set-it-and-forget-it:** Reassess frameworks as your product matures

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

It defines: session heads-up + entry mode (Guided, Context dump, Best guess), one-question turns, progress labels, interruption handling, numbered recommendations at decision points, quick-select options.

This file defines the domain-specific assessment content. If there is a conflict, follow this file's domain logic.

## Application

This interactive skill asks **up to 4 adaptive questions**, offering **3-4 enumerated options** at each step.

### Question 1: Product Stage

"What stage is your product in?"

1. **Pre-product/market fit** -- Searching for PMF; experimenting rapidly; unclear what customers want
2. **Early PMF, scaling** -- Found initial PMF; growing fast; adding features to retain/expand
3. **Mature product, optimization** -- Established market; incremental improvements; competing on quality
4. **Multiple products/platform** -- Portfolio of products; cross-product dependencies

### Question 2: Team Context

"What's your team and stakeholder environment like?"

1. **Small team, limited resources** -- 3-5 engineers, 1 PM, need to focus ruthlessly
2. **Cross-functional team, aligned** -- Product, design, engineering aligned; clear goals
3. **Multiple stakeholders, misaligned** -- Execs, sales, customers all have opinions; need transparent process
4. **Large org, complex dependencies** -- Multiple teams, shared roadmap

### Question 3: Decision-Making Needs

"What's the primary challenge you're trying to solve with prioritization?"

1. **Too many ideas, unclear which to pursue** -- Backlog is 100+ items; need to narrow to top 10
2. **Stakeholders disagree on priorities** -- Sales wants features, execs want strategic bets
3. **Lack of data-driven decisions** -- Prioritizing by gut feel; want metrics-based process
4. **Hard tradeoffs between strategic bets vs. quick wins**

### Question 4: Data Availability

"How much data do you have to inform prioritization?"

1. **Minimal data** -- New product, no usage metrics, few customers to survey
2. **Some data** -- Basic analytics, customer feedback, but no rigorous data collection
3. **Rich data** -- Usage metrics, A/B tests, customer surveys, clear success metrics

### Output: Framework Recommendation

After collecting responses, recommend a framework with:
- **Rationale:** Why this framework fits (linked to Q1-Q4 answers)
- **Implementation steps:** Concrete how-to (4 steps)
- **Example scoring template:** Filled-in example table
- **Alternative framework:** Second choice with tradeoffs
- **Pitfalls:** Common mistakes with this framework
- **Reassess when:** Triggers to reconsider the framework choice

## Examples

### Example 1: Good Match (Early PMF + RICE)
- **Context:** Early PMF, aligned cross-functional team, some data, wants metrics-based decisions
- **Recommendation:** RICE -- has data for Reach/Impact, team can agree on scoring, structured without being heavy
- **Why NOT ICE:** Too subjective for a team that wants data-driven process

### Example 2: Bad Match (Pre-PMF + RICE = Wrong Fit)
- **Context:** Pre-PMF, small team, minimal data, too many ideas
- **Recommendation:** ICE or Value/Effort Matrix -- lightweight, fast, no data required
- **Why NOT RICE:** No usage data for Reach, overhead kills speed at pre-PMF stage

## Common Pitfalls

### Pitfall 1: Using the Wrong Framework for Your Stage
**Symptom:** Pre-PMF startup using weighted scoring with 10 criteria
**Fix:** Match framework to stage. Pre-PMF = ICE. Scaling = RICE. Mature = Opportunity Scoring or Kano.

### Pitfall 2: Framework Whiplash
**Symptom:** Switching frameworks every quarter
**Fix:** Stick with one framework for 6-12 months. Reassess only when stage/context changes.

### Pitfall 3: Treating Scores as Gospel
**Symptom:** "Feature A scored 8,000, Feature B scored 7,999, so A wins"
**Fix:** Use frameworks as input, not automation. PM judgment overrides scores when needed.

### Pitfall 4: Solo PM Scoring
**Symptom:** PM scores features alone, presents to team
**Fix:** Collaborative scoring sessions. PM, design, engineering score together.

### Pitfall 5: No Framework at All
**Symptom:** "We prioritize by who shouts loudest"
**Fix:** Pick *any* framework. Even imperfect structure beats chaos.

## References

### External Frameworks
- Intercom, *RICE Prioritization* (2016)
- Sean McBride, *ICE Scoring* (2012)
- Luke Hohmann, *Innovation Games* (2006) -- Buy-a-Feature
- Noriaki Kano, *Kano Model* (1984)

### Credit
- Adapted from Dean Peters, Product Manager Skills (CC BY-NC-SA 4.0).
