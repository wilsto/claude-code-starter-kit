---
name: user-story
description: >
  Create clear user stories combining Mike Cohn format with Gherkin acceptance criteria.
  Translates user needs into actionable dev work with testable success criteria.
  Triggers: "write a user story", "user story for", "acceptance criteria".
type: component
---

## Purpose
Create clear, concise user stories that combine Mike Cohn's user story format with Gherkin-style acceptance criteria. Use this to translate user needs into actionable development work that focuses on outcomes, ensures shared understanding between product and engineering, and provides testable success criteria.

This is not a feature spec -- it's a conversation starter that captures *who* benefits, *what* they're trying to do, *why* it matters, and *how* you'll know it works.

## Key Concepts

### The Mike Cohn + Gherkin Format

**Use Case (Mike Cohn format):**
- **As a** [user persona/role]
- **I want to** [action to achieve outcome]
- **so that** [desired outcome]

**Acceptance Criteria (Gherkin format):**
- **Scenario:** [Brief description of the scenario]
- **Given:** [Initial context or preconditions]
- **and Given:** [Additional preconditions]
- **When:** [Event that triggers the action]
- **Then:** [Expected outcome]

### Why This Structure Works
- **User-centric:** Forces focus on who benefits and why
- **Outcome-focused:** "So that" emphasizes the value delivered, not just the action
- **Testable:** Gherkin acceptance criteria are concrete and verifiable
- **Conversational:** Story is the opening for discussion, not the final spec
- **Shared language:** Product, engineering, and QA all understand the format

### Anti-Patterns (What This Is NOT)
- **Not a task:** "As a developer, I want to refactor the database" (this is a tech task, not user value)
- **Not a feature list:** "I want dashboards, reports, and analytics" (this is too big -- needs splitting)
- **Not vague:** "I want a better experience" (unmeasurable, no clear outcome)
- **Not a contract:** Stories are placeholders for conversation, not locked-in specs

### When to Use This
- Translating user needs into development work
- Backlog grooming and sprint planning
- Communicating value to engineering and design
- Ensuring testable acceptance criteria exist before development

### When NOT to Use This
- For pure technical debt or refactoring (use engineering tasks instead)
- When stories are too large (split first using proven splitting patterns)
- Before understanding the user problem (write a problem statement first)

## Application

### Step 1: Gather Context
Before writing a story, ensure you have:
- **User persona:** Who is this for?
- **Problem understanding:** What need does this address?
- **Desired outcome:** What does success look like?
- **Constraints:** Technical, time, or scope limitations

**If missing context:** Run discovery interviews or problem validation work first.

### Step 2: Write the Use Case

```markdown
### User Story [ID]:

- **Summary:** [Brief, memorable title focused on value to the user]

#### Use Case:
- **As a** [user name if available, otherwise persona, otherwise role]
- **I want to** [action user takes to get to outcome]
- **so that** [desired outcome]
```

**Quality checks:**
- **"As a" specificity:** Is this a specific persona (e.g., "trial user") or generic ("user")?
- **"I want to" clarity:** Is this an action the user takes, or a feature you're building?
- **"So that" outcome:** Does this explain the user's motivation? Or is it just restating the action?

**Common mistakes:**
- "As a user, I want a login button, so that I can log in" (restating the action)
- "As a trial user, I want to log in with Google, so that I can access the app without creating a new password" (good)

### Step 3: Write the Acceptance Criteria

```markdown
#### Acceptance Criteria:

- **Scenario:** [Brief, human-readable scenario describing value]
- **Given:** [Initial context or precondition]
- **and Given:** [Additional context or preconditions]
- **When:** [Event that triggers the action -- aligns with 'I want to']
- **Then:** [Expected outcome -- aligns with 'so that']
```

**Quality checks:**
- **Multiple Givens are okay:** Preconditions stack up
- **Only one When:** If you need multiple "When" statements, you likely have multiple stories -- split them
- **Only one Then:** If you need multiple "Then" statements, you likely have multiple stories -- split them
- **Alignment:** Does "When" match "I want to"? Does "Then" match "so that"?

### Step 4: Add a Summary

Write a short, memorable summary that captures the story's value:
- "Enable Google login for trial users to reduce signup friction"
- "Bulk delete items to save time for power users"
- NOT "Add delete button" (feature-centric, not value-centric)

### Step 5: Validate and Refine

- **Read aloud to the team:** Does everyone understand who, what, why?
- **Test acceptance criteria:** Can QA write test cases from this?
- **Check for splitting:** If the story feels too big, split it
- **Ensure testability:** Can you prove "Then" happened?

## Examples

```markdown
### User Story 042:

- **Summary:** Enable Google login for trial users to reduce signup friction

#### Use Case:
- **As a** trial user visiting the app for the first time
- **I want to** log in using my Google account
- **so that** I can access the app without creating and remembering a new password

#### Acceptance Criteria:
- **Scenario:** First-time trial user logs in via Google OAuth
- **Given:** I am on the login page
- **and Given:** I have a Google account
- **When:** I click the "Sign in with Google" button and authorize the app
- **Then:** I am logged into the app and redirected to the onboarding flow
```

## Common Pitfalls

### Pitfall 1: Technical Tasks Disguised as User Stories
**Symptom:** "As a developer, I want to refactor the API, so that the code is cleaner"
**Consequence:** This is an engineering task, not a user story. No user value is delivered.
**Fix:** If there's no user outcome, it's not a user story -- use an engineering task instead.

### Pitfall 2: "As a User" (Too Generic)
**Symptom:** Every story starts with "As a user"
**Consequence:** No persona clarity. Different users have different needs.
**Fix:** Use specific personas: "As a trial user," "As a paid subscriber," "As an admin."

### Pitfall 3: "So That" Restates "I Want To"
**Symptom:** "I want to click the save button, so that I can save my work"
**Consequence:** No insight into *why* the user cares.
**Fix:** Dig into the motivation: "so that I don't lose my progress if the page crashes."

### Pitfall 4: Multiple When/Then Statements
**Symptom:** Acceptance criteria with 5 "When" and 5 "Then" statements
**Consequence:** Story is too big. Likely multiple features bundled.
**Fix:** Split the story. Each When/Then pair should be its own story.

### Pitfall 5: Untestable Acceptance Criteria
**Symptom:** "Then the user has a better experience" or "Then it's faster"
**Consequence:** QA can't verify success. Ambiguous definition of "done."
**Fix:** Make it measurable: "Then the page loads in under 2 seconds."

## References

### External Frameworks
- Mike Cohn, *User Stories Applied* (2004) -- Origin of the "As a / I want / so that" format
- Gherkin (Cucumber) -- "Given/When/Then" acceptance criteria format
- INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)

### Credit
- Adapted from Dean Peters, Product Manager Skills (CC BY-NC-SA 4.0).
