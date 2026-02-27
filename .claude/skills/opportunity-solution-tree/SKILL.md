---
name: opportunity-solution-tree
description: >
  Guide PMs through creating an Opportunity Solution Tree: extract outcomes,
  generate opportunities, map solutions, and select best POC.
  Triggers: "OST", "opportunity solution tree", "discovery", "Teresa Torres".
type: interactive
---

## Purpose
Guide product managers through creating an Opportunity Solution Tree (OST) by extracting target outcomes from stakeholder requests, generating opportunities (problems to solve), mapping potential solutions, and selecting the best proof-of-concept (POC). Use this to move from vague product requests to structured discovery, ensuring teams solve the right problems before jumping to solutions.

This is not a roadmap generator -- it's a structured discovery process that outputs validated opportunities with testable solution hypotheses.

## Key Concepts

### What is an Opportunity Solution Tree?

An OST (Teresa Torres, *Continuous Discovery Habits*) connects:
1. **Desired Outcome** (business goal or product metric)
2. **Opportunities** (customer problems, needs, pain points)
3. **Solutions** (ways to address each opportunity)
4. **Experiments** (tests to validate solutions)

```
         Desired Outcome (1)
                |
    +-----------+-----------+
    |           |           |
Opportunity  Opportunity  Opportunity (3)
    |           |           |
  +-+-+       +-+-+       +-+-+
  | | |       | | |       | | |
 S1 S2 S3    S1 S2 S3    S1 S2 S3 (9 total)
```

### Anti-Patterns
- **Not a feature list:** Opportunities are problems, not "we need dark mode"
- **Not solution-first:** Don't start with "we should build X"
- **Not waterfall planning:** OST is a discovery tool, not a project plan
- **Not a one-time exercise:** OSTs evolve as you learn from experiments

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

## Application

Two-phase process:
- **Phase 1:** Generate OST (extract outcome, identify opportunities, map solutions)
- **Phase 2:** Select POC (evaluate solutions, recommend best starting point)

### Step 0: Gather Context

Before questions, suggest the user provide:
- Stakeholder request or product initiative description
- Existing materials: PRD drafts, OKR documents, strategy memos
- Problem statements, customer complaints, research findings
- Product context: positioning, competitors, usage data

### Phase 1: Generate Opportunity Solution Tree

#### Question 1: Extract Desired Outcome

"What's the desired outcome for this initiative?"

1. **Revenue growth** -- Increase ARR, expand revenue, new revenue streams
2. **Customer retention** -- Reduce churn, increase activation, improve engagement
3. **Customer acquisition** -- Increase sign-ups, trial conversions, new user growth
4. **Product efficiency** -- Reduce support costs, decrease time-to-value

Or describe a specific measurable outcome (e.g., "Increase trial-to-paid conversion from 15% to 25%").

#### Question 2: Identify Opportunities

Agent generates **3 opportunities** based on outcome and context. Each opportunity includes:
- Problem description
- Evidence (from provided context)

User selects which opportunity to explore first, or modifies/adds opportunities.

#### Question 3: Generate Solutions

Agent generates **3 solution ideas** for the selected opportunity, each with:
- Description
- Hypothesis
- Suggested experiment type

### Phase 2: Select Proof-of-Concept

#### Question 4: Evaluate Solutions

Agent generates evaluation table:

| Solution | Feasibility (1-5) | Impact (1-5) | Market Fit (1-5) | Total | Rationale |
|----------|-------------------|--------------|------------------|-------|-----------|

Scoring criteria:
- **Feasibility:** 1 = months of work, 5 = days/weeks
- **Impact:** 1 = minimal outcome movement, 5 = major shift
- **Market Fit:** 1 = customers don't care, 5 = customers actively request

Agent recommends a POC with rationale and alternative.

#### Question 5: Define Experiment

"How will you test this solution?"

1. **A/B test** -- Build MVP, compare with control (best for: quantitative validation)
2. **Prototype + usability test** -- Clickable prototype, 10 users (best for: early-stage validation)
3. **Manual concierge test** -- Run solution manually with 20 users (best for: learning fast, no dev)

### Output: OST + POC Plan

```markdown
# Opportunity Solution Tree + POC Plan

## Desired Outcome
[Specific, measurable outcome]

## Opportunity Map
### Opportunity 1-3: [Name, Problem, Evidence, Solutions]

## Selected POC
- **Opportunity:** [Selected]
- **Solution:** [Selected]
- **Hypothesis:** "If we [solution], then [metric] will [direction] from [X] to [Y] because [rationale]."
- **Experiment:** [Type, participants, duration, success criteria]

## Next Steps
1. Build experiment
2. Run experiment
3. Measure results
4. Decide: succeed -> scale; fail -> try next solution
```

## Examples

**Desired Outcome:** Increase trial-to-paid conversion from 15% to 25%
**Opportunity:** Users don't reach "aha" moment during trial
**Solution:** Guided onboarding checklist
**Hypothesis:** If we guide users through core workflows, activation rate increases from 40% to 60%
**Experiment:** A/B test checklist vs. no checklist for 2 weeks

## Common Pitfalls

### Pitfall 1: Opportunities Disguised as Solutions
**Symptom:** "Opportunity: We need a mobile app"
**Fix:** Reframe as customer problem: "Mobile-first users can't access product on the go."

### Pitfall 2: Skipping Divergence
**Symptom:** "We know the solution is [X], just need to build it"
**Fix:** Generate at least 3 solutions per opportunity. Force divergence before convergence.

### Pitfall 3: Outcome is Too Vague
**Symptom:** "Desired Outcome: Improve user experience"
**Fix:** Make outcomes measurable: "Increase NPS from 30 to 50."

### Pitfall 4: No Experiments
**Symptom:** Picking a solution and moving straight to roadmap
**Fix:** Every solution must map to an experiment. No experiments = no OST.

### Pitfall 5: Analysis Paralysis
**Symptom:** Generating 20 opportunities, 50 solutions, never picking one
**Fix:** Limit to 3 opportunities, 3 solutions each (9 total). Pick 1 POC, run experiment, iterate.

## References

### External Frameworks
- Teresa Torres, *Continuous Discovery Habits* (2021)
- Jeff Patton, *User Story Mapping* (2014)
- Ash Maurya, *Running Lean* (2012)

### Credit
- Adapted from Dean Peters, Product Manager Skills (CC BY-NC-SA 4.0).
