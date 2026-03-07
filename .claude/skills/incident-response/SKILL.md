---
name: incident-response
description: >
  Guided incident response workflow: triage, investigate, resolve, communicate, postmortem.
  Produces structured output files at each phase. Triggers: "incident", "outage", "postmortem",
  "on-call", "SEV-1", "SEV-2".
type: workflow
---

## Purpose

Guide the team through a structured incident response when a production issue occurs. This is a 5-phase workflow with checkpoints — not a passive reference. Each phase produces a file in `.incident-response/` that serves as the source of truth for the next phase.

Use this skill when:

- A production incident is declared (SEV-1 to SEV-3)
- You need to write a postmortem after an incident
- You want to generate or update runbooks
- You need an on-call handoff template

## Key Concepts

### Severity Classification

| Severity | Criteria | Response Time | Example |
| --- | --- | --- | --- |
| SEV-1 (Critical) | Service down, data loss, security breach | Immediate (page) | Payment system offline |
| SEV-2 (Major) | Significant degradation, partial outage | < 30 min | API latency 10x normal |
| SEV-3 (Minor) | Limited impact, workaround exists | < 4 hours | One endpoint returning 500s |
| SEV-4 (Low) | Cosmetic, non-urgent | Next business day | Dashboard chart broken |

### Behavioral Rules

1. Execute phases **in order** — never skip a phase
2. Write output files after each phase — they are the record of truth
3. **STOP at checkpoints** — wait for user confirmation before proceeding
4. **Halt on failure** — if a step fails, do not continue to the next phase
5. Use file-based context — read previous phase outputs rather than relying on conversation memory

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol.

## Application

### Entry Questions

**Question 1: What's happening?**

"Describe the incident in 1-2 sentences. What's broken and what's the user impact?"

**Question 2: Severity**

"What severity level?" (1: Critical, 2: Major, 3: Minor, 4: Low)

**Question 3: Mode**

1. **Full workflow** — All 5 phases (triage → postmortem)
2. **Postmortem only** — Incident is resolved, skip to Phase 5
3. **Runbook generation** — Generate a runbook template for a service

---

### Phase 1: Detection & Triage

**Output file**: `.incident-response/01-triage.md`

Steps:

1. **Classify severity** using table above
2. **Assess blast radius**: which services, how many users affected
3. **Identify immediate mitigation**: rollback, feature flag off, traffic redirect

Triage commands (adapt to your stack):

```bash
# K8s triage
kubectl get pods -A | grep -v Running
kubectl top pods --sort-by=memory
kubectl logs <pod-name> --tail=100 --since=10m

# Docker triage
docker ps --filter "status=exited"
docker logs <container> --tail=100 --since=10m

# Generic
curl -sf https://service/health | jq .
git log --oneline --since="2 hours ago"
```

Write triage findings to `.incident-response/01-triage.md`.

**CHECKPOINT**: Present triage summary. Wait for user to confirm before investigation.

---

### Phase 2: Investigation & Root Cause

**Output file**: `.incident-response/02-investigation.md`

Steps:

1. **Build timeline**: when did it start? What changed?
2. **Correlate signals**: metrics spike + deploy + error logs
3. **Hypothesis testing**: one theory at a time, verify each
4. **Root cause**: identify the underlying issue

```bash
# Git bisect for regression
git bisect start
git bisect bad HEAD
git bisect good <last-known-good>

# Check recent deploys
git log --oneline --since="24 hours ago"
```

If monitoring a live service during investigation, suggest: `/loop 1m check service logs` — advisory, PO activates.

Write findings to `.incident-response/02-investigation.md`.

**CHECKPOINT**: Present root cause hypothesis. Wait for user to confirm before fix.

---

### Phase 3: Resolution & Recovery

**Output file**: `.incident-response/03-resolution.md`

Steps:

1. **Apply fix**: hotfix branch → fast PR → deploy
2. **Verify**: health checks green, error rate back to baseline
3. **Monitor**: watch for 30 min post-fix

Write resolution details to `.incident-response/03-resolution.md`.

---

### Phase 4: Communication

**Output file**: `.incident-response/04-communication.md`

Generate two communications:

**Initial notification** (template):

```markdown
## Incident: [Title]
**Severity**: SEV-X
**Status**: Investigating / Mitigated / Resolved
**Impact**: [what users experience]
**Started**: HH:MM UTC
**Next update**: HH:MM UTC (30 min intervals for SEV-1/2)
```

**Resolution notification** (template):

```markdown
## Resolved: [Title]
**Duration**: X hours Y minutes
**Root cause**: [1-2 sentences]
**Fix applied**: [what was done]
**Postmortem**: [link, within 48h]
```

---

### Phase 5: Postmortem

**Output file**: `.incident-response/05-postmortem.md`

Generate a **blameless** postmortem:

```markdown
## Postmortem: [Incident Title]
**Date**: YYYY-MM-DD
**Duration**: X hours Y minutes
**Severity**: SEV-X
**Authors**: [names]

### Summary
[2-3 sentences: what happened, impact, resolution]

### Timeline
- HH:MM — First alert fired
- HH:MM — On-call acknowledged
- HH:MM — Root cause identified
- HH:MM — Fix deployed
- HH:MM — All clear confirmed

### Root Cause
[Technical explanation, no blame]

### Impact
- Users affected: N
- Revenue impact: $X (if applicable)
- Error budget consumed: X%

### What Went Well
- [item]

### What Went Wrong
- [item]

### Action Items
| Action | Owner | Due Date | Priority |
| --- | --- | --- | --- |
| [action] | @name | YYYY-MM-DD | P1/P2/P3 |
```

---

## Runbook Templates

### Service Outage

```markdown
## Runbook: [Service Name] Outage

### Quick Diagnosis (< 5 min)
1. Check health: `curl -s https://service/health | jq .`
2. Check pods: `kubectl get pods -l app=service-name`
3. Check deploys: `kubectl rollout history deployment/service-name`
4. Check logs: `kubectl logs -l app=service-name --tail=50 --since=5m`
5. Check metrics: [Grafana dashboard link]

### Common Fixes
- **OOM Kill**: Scale up replicas or increase memory limit
- **CrashLoopBackOff**: Check logs — config error or missing env var
- **ImagePullBackOff**: Check image tag, registry auth
- **Slow responses**: Check DB connections, external deps

### Rollback
kubectl rollout undo deployment/service-name

### Escalation
- L1 (on-call): [contact]
- L2 (team lead): [contact]
- L3 (infra): [contact]
```

### Database Incident

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Long-running queries (> 30s)
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '30 seconds'
ORDER BY duration DESC;

-- Kill stuck query
SELECT pg_terminate_backend(<pid>);
```

## On-Call Handoff Template

```markdown
## On-Call Handoff — [Date]

### Active Incidents
- [none or list with status]

### Ongoing Investigations
- [issue]: [status, what's been tried]

### Recent Changes (last 24h)
- [deploy/config]: [what, when, who]

### Known Issues
- [issue]: [workaround]

### Upcoming Events
- [maintenance window, traffic spike]
```

## Common Pitfalls

### Pitfall 1: Skipping Triage

**Symptom**: Jump straight to debugging without assessing severity and blast radius.
**Consequence**: Wrong priority — might fix a low-impact bug while a high-impact issue festers.
**Fix**: Always classify severity first. 2 minutes of triage saves hours of misguided investigation.

### Pitfall 2: Blame Culture

**Symptom**: Postmortem focuses on "who did it" instead of "why did the system allow it."
**Consequence**: People hide mistakes, incidents recur.
**Fix**: Blameless postmortems. Focus on systemic fixes (better monitoring, safer deploys, guardrails).

### Pitfall 3: No Action Items

**Symptom**: Postmortem written, filed, forgotten.
**Consequence**: Same incident happens again 3 months later.
**Fix**: Every postmortem must have concrete action items with owners and due dates. Track them.

### Pitfall 4: Communicating Too Late

**Symptom**: Users discover the outage before the team acknowledges it.
**Consequence**: Trust erosion, support ticket flood.
**Fix**: First communication within 15 min for SEV-1/2, even if it's "We're investigating."

## References

### External
- Google, *Site Reliability Engineering* — https://sre.google/sre-book/
- Google, *SRE Workbook* — https://sre.google/workbook/
- PagerDuty, *Incident Response Ops Guide* — https://response.pagerduty.com/

### Related Skills
- `/security-audit` — Security-specific incident investigation
- `/review` — Code review to prevent incidents
- `observability.md` stack guide — SLI/SLO/error budget context

### Credit
- Workflow structure and runbook templates extracted from `wshobson/agents` plugin `incident-response` (v1.3.0).
