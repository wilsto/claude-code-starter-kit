---
name: discovery-interview-prep
description: >
  Guide PMs through preparing customer discovery interviews with adaptive questions
  about research goals, customer segments, constraints, and methodologies.
  Triggers: "prepare interview", "discovery interview", "customer interview", "mom test".
type: interactive
---

## Purpose
Guide product managers through preparing for customer discovery interviews by asking adaptive questions about research goals, customer segments, constraints, and methodologies. Use this to design effective interview plans, craft targeted questions, avoid common biases, and maximize learning from limited customer access.

This is not a script generator -- it's a strategic prep process that outputs a tailored interview plan with methodology, question framework, and success criteria.

## Key Concepts

### The Discovery Interview Prep Flow
1. Gather product/problem context
2. Define research goals (what you're trying to learn)
3. Identify target customer segment and access constraints
4. Recommend interview methodology (JTBD, problem validation, switch interviews, etc.)
5. Generate interview framework with questions, biases to avoid, and success metrics

### Anti-Patterns
- **Not a user testing script:** Discovery = learning problems; testing = validating solutions
- **Not a sales demo:** Don't pitch -- listen and learn
- **Not surveys at scale:** Deep qualitative interviews (5-10 people), not broad surveys (100+)

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

## Application

This interactive skill asks **up to 4 adaptive questions**, offering **3-4 enumerated options** at each step.

### Step 0: Gather Context

Before questions, suggest the user provide:
- Problem hypothesis or product concept description
- Target customer segment (if known)
- Existing research (support tickets, churn data, user feedback)
- Key assumptions to validate

### Question 1: Research Goal

"What's the primary goal of these discovery interviews?"

1. **Problem validation** -- Confirm that a problem exists and is painful enough to solve
2. **Jobs-to-be-Done discovery** -- Understand what customers are trying to accomplish
3. **Retention/churn investigation** -- Figure out why customers leave or don't activate
4. **Feature prioritization** -- Validate which problems/features matter most

### Question 2: Target Customer Segment

"Who are you interviewing?" (adapted based on Q1)

1. **People who experience the problem regularly**
2. **People who've tried to solve it** (tried 2+ competing solutions)
3. **People in the target segment** (regardless of problem awareness)
4. **People who've recently experienced the problem** (churned in last 30 days)

### Question 3: Constraints

"What constraints are you working with?"

1. **Limited access** -- Can only interview 5-10 customers, need results in 2 weeks
2. **Existing customer base** -- Have 100+ active customers, can recruit easily
3. **Cold outreach required** -- No existing customers; need to recruit from scratch
4. **Internal stakeholders only** -- Can interview sales/support teams who talk to customers daily

### Question 4: Interview Methodology

"Based on your context, here are recommended methodologies:" (context-aware based on Q1-Q3)

1. **Problem validation (Mom Test style)** -- Ask about past behavior, not hypotheticals
2. **Jobs-to-be-Done interviews** -- Focus on what customers are trying to accomplish
3. **Switch interviews** -- Interview customers who recently switched from a competitor
4. **Timeline/journey mapping interviews** -- Walk through experience chronologically

### Output: Interview Plan

Generate a tailored plan with:

**Opening (5 min):** Build rapport, set expectations, get consent

**Core Questions (30-40 min):** 5 questions using ask/follow-up/avoid structure:

Example (Mom Test style):
1. **"Tell me about the last time you [experienced this problem]."**
   - Follow-up: "What were you trying to accomplish? What made it hard?"
   - Avoid: "Would you use a tool that solves this?" (leading, hypothetical)

2. **"How do you currently handle [this problem]?"**
   - Follow-up: "How much time/money does that take?"
   - Avoid: "Don't you think that's inefficient?" (leading)

3. **"Can you walk me through what you did step-by-step?"**
   - Follow-up: "What happened next? Where did you get stuck?"
   - Avoid: "Was it hard?" (yes/no, not useful)

4. **"Have you tried other solutions for this?"**
   - Follow-up: "What did you like/dislike? Why did you stop using it?"
   - Avoid: "Would you pay for a better solution?" (hypothetical)

5. **"If you had a magic wand, what would change?"**
   - Follow-up: "Why does that matter to you? What would that enable?"
   - Avoid: Taking feature requests literally

**Closing (5 min):** Summarize, ask for referrals, thank them

**Biases to Avoid:** Confirmation bias, leading questions, hypothetical questions, pitching disguised as research, yes/no questions

**Success Criteria:**
- You hear specific stories, not generic complaints
- You uncover past behavior, not hypothetical wishes
- You identify patterns across 3+ interviews
- You're surprised by something (if not, you're asking leading questions)
- You can quote customers verbatim

**Logistics:**
- Reach out to 20-30 people for 5-10 interviews (33% response rate typical)
- 45-60 minutes per interview
- Schedule 2-3 per day max
- Synthesize insights immediately after each interview

## Examples

### Example: Problem Validation for Freelancer Invoicing
- **Context:** Hypothesis "Freelancers waste time chasing late payments manually"
- **Goal:** Problem validation
- **Segment:** Freelancers who invoice 5+ clients monthly
- **Constraints:** Cold outreach via LinkedIn/Reddit
- **Methodology:** Mom Test style
- **Result:** 5 questions focused on past behavior, not wishes

## Common Pitfalls

### Pitfall 1: Asking What Customers Want
**Symptom:** "What features do you want us to build?"
**Fix:** Ask about past behavior: "Tell me about the last time you struggled with X."

### Pitfall 2: Pitching Instead of Listening
**Symptom:** Spending 20 minutes explaining your product idea
**Fix:** Don't mention your solution until the last 5 minutes (if at all).

### Pitfall 3: Interviewing the Wrong People
**Symptom:** Interviewing friends or people who don't experience the problem
**Fix:** Interview people who experience the problem regularly and recently.

### Pitfall 4: Stopping at 1-2 Interviews
**Symptom:** "We talked to 2 people, they liked it, let's build!"
**Fix:** Interview 5-10 people minimum. Look for patterns, not one-off feedback.

### Pitfall 5: Not Recording Insights
**Symptom:** Relying on memory after interviews
**Fix:** Record (with consent) or take detailed notes. Synthesize immediately after.

## References

### External Frameworks
- Rob Fitzpatrick, *The Mom Test* (2013)
- Clayton Christensen, *Jobs to Be Done*
- Teresa Torres, *Continuous Discovery Habits* (2021)

### Credit
- Adapted from Dean Peters, Product Manager Skills (CC BY-NC-SA 4.0).
