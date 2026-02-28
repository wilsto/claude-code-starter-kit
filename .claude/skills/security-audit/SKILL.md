---
name: security-audit
description: >
  Audit the codebase for security vulnerabilities: OWASP Top 10, dependency risks, exposed secrets,
  auth patterns, and input validation. Produces a severity-ranked findings report.
  Triggers: "security audit", "audit sécurité", "vulnerabilities", "OWASP", "security check".
type: interactive
---

## Purpose

Perform a comprehensive security review of the entire codebase. Use this when you need to assess your project's security posture beyond what `block-secrets.js` catches at commit time. Outputs a findings report ranked by severity with actionable remediation steps.

This is not a penetration test -- it's a static analysis and pattern review. It catches code-level vulnerabilities, not infrastructure or runtime issues.

## Key Concepts

### OWASP Top 10 (2021)

1. **A01: Broken Access Control** -- Missing auth checks, IDOR, privilege escalation
2. **A02: Cryptographic Failures** -- Weak hashing, plaintext secrets, insecure TLS config
3. **A03: Injection** -- SQL injection, XSS, command injection, template injection
4. **A04: Insecure Design** -- Missing threat model, insecure business logic
5. **A05: Security Misconfiguration** -- Debug mode in prod, default credentials, verbose errors
6. **A06: Vulnerable Components** -- Outdated deps with known CVEs
7. **A07: Auth Failures** -- Weak passwords, missing MFA, broken session management
8. **A08: Data Integrity Failures** -- Unsigned updates, deserialization attacks
9. **A09: Logging Failures** -- Missing audit logs, logging sensitive data
10. **A10: SSRF** -- Server-side request forgery via user-controlled URLs

### STRIDE Threat Model

- **S**poofing -- Can someone impersonate a user or service?
- **T**ampering -- Can data be modified in transit or at rest?
- **R**epudiation -- Can actions be denied without audit trail?
- **I**nformation Disclosure -- Can sensitive data leak?
- **D**enial of Service -- Can the system be overwhelmed?
- **E**levation of Privilege -- Can a user gain unauthorized access?

### Anti-Patterns

- **Not a compliance checklist:** This is a practical code review, not SOC 2 or ISO 27001 certification
- **Not a runtime test:** No fuzzing, no pentesting -- static analysis and pattern matching only
- **Not a replacement for security tooling:** Use this alongside (not instead of) SAST/DAST tools

### Facilitation Source of Truth

Use [`workshop-facilitation`](../workshop-facilitation/SKILL.md) as the default interaction protocol for this skill.

It defines: session heads-up + entry mode (Guided, Context dump, Best guess), one-question turns, progress labels, interruption handling, numbered recommendations at decision points, quick-select options.

This file defines the domain-specific assessment content. If there is a conflict, follow this file's domain logic.

## Application

This interactive skill asks **up to 4 adaptive questions**, then performs a deep security scan.

### Question 1: Application Type

"What type of application is this?"

1. **Web application** -- Browser-facing, handles user sessions, renders HTML/JS
2. **API service** -- REST/GraphQL backend, consumed by clients
3. **CLI tool / library** -- No network surface, but processes user input
4. **Full-stack** -- Both frontend and backend in this repo

### Question 2: Attack Surface

"Which attack surfaces are present? (select all that apply)"

1. **User authentication** -- Login, sessions, tokens, OAuth
2. **User input processing** -- Forms, file uploads, search, comments
3. **External API calls** -- Third-party services, webhooks, payment providers
4. **Database operations** -- SQL/NoSQL queries, ORM usage
5. **File system access** -- Reading/writing files based on user input

### Question 3: Sensitive Data

"What types of sensitive data does this application handle?"

1. **PII** -- Names, emails, addresses, phone numbers
2. **Financial** -- Payment cards, bank details, transactions
3. **Credentials** -- Passwords, API keys, tokens (stored or processed)
4. **None / minimal** -- Public data only, no user accounts

### Question 4: Deployment Context

"Where is this application deployed?"

1. **Cloud (managed)** -- AWS, GCP, Azure with managed services
2. **Containers** -- Docker/Kubernetes
3. **On-premise / VPS** -- Self-managed servers
4. **Not deployed yet** -- Development phase only

### Audit Process

After collecting answers, perform the security audit:

1. **Scan for secrets** -- API keys, tokens, passwords, connection strings in code (beyond block-secrets.js patterns)
2. **Check dependencies** -- Analyze package manifests for known vulnerabilities
3. **Review auth patterns** -- Session management, token validation, access control checks
4. **Analyze input handling** -- SQL queries, HTML rendering, command execution, file paths
5. **Check configuration** -- Debug flags, CORS settings, error verbosity, TLS usage
6. **Review logging** -- Sensitive data in logs, missing audit trails

### Output: Security Audit Report

Produce a structured report:

```markdown
## Security Audit Report — [Project Name]

### Risk Level: [Critical / High / Medium / Low]

### Findings Summary

| Severity | Count | Top Category |
| --- | --- | --- |
| Critical | 0 | — |
| High | 2 | A03: Injection |
| Medium | 5 | A05: Misconfiguration |
| Low | 3 | A09: Logging |

### Critical Findings (fix immediately)

#### [CRIT-001] [Title]
- **File:** `path/to/file.ts:42`
- **Category:** OWASP A03 — Injection
- **Description:** User input passed directly to SQL query without parameterization
- **Impact:** Full database compromise via SQL injection
- **Fix:**
  ```typescript
  // Before (vulnerable)
  db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);

  // After (safe)
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  ```

### High Findings (fix before next release)
[Same format]

### Medium Findings (fix within sprint)
[Same format]

### Low Findings (backlog)
[Same format]

### Positive Patterns Observed
- [security practice already in place]

### Recommendations
1. [actionable next step]
2. [actionable next step]
```

## Examples

### Example 1: API with SQL Injection Risk

- **Context:** Express.js API, PostgreSQL, user auth with JWT
- **Finding:** 3 endpoints use string concatenation for SQL queries
- **Severity:** Critical (A03: Injection)
- **Fix:** Replace string interpolation with parameterized queries
- **Why this matters:** A single injection point can compromise the entire database

### Example 2: Clean Project with Dependency Risk

- **Context:** Well-coded React + Node app, no code-level vulnerabilities
- **Finding:** 2 dependencies with known CVEs (lodash < 4.17.21, express < 4.18.0)
- **Severity:** Medium (A06: Vulnerable Components)
- **Fix:** `npm update lodash express` -- no breaking changes expected
- **Why NOT critical:** The vulnerable functions aren't used in the codebase, but update anyway

## Common Pitfalls

### Pitfall 1: False Sense of Security
**Symptom:** "Zero findings" report accepted without question
**Consequence:** Real vulnerabilities missed because the audit scope was too narrow
**Fix:** Always state what was NOT checked. Acknowledge limitations of static analysis.

### Pitfall 2: Severity Inflation
**Symptom:** Every finding marked as "Critical"
**Consequence:** Team ignores the report due to alert fatigue
**Fix:** Use strict severity criteria. Critical = exploitable remotely with high impact. Most findings are Medium.

### Pitfall 3: Fix Symptoms, Not Causes
**Symptom:** Add input validation at one endpoint but miss the same pattern elsewhere
**Consequence:** Same vulnerability in 5 other endpoints
**Fix:** Identify the root pattern (e.g., no query builder). Fix systemically, not per-instance.

### Pitfall 4: Auditing Without Context
**Symptom:** Flagging internal-only admin tools with the same severity as public APIs
**Consequence:** Wasted effort on low-risk surfaces
**Fix:** Adjust severity based on exposure. Internal tool + VPN = lower risk than public endpoint.

### Pitfall 5: One-Time Audit
**Symptom:** Security audit done once at launch, never again
**Consequence:** New vulnerabilities introduced over months go undetected
**Fix:** Schedule quarterly audits. Add security checks to `/review` for ongoing coverage.

## DevSecOps Pipeline Integration

> Extracted from `wshobson/agents` plugins `security-compliance` + `security-scanning` — 2026-02-28

### Shift-Left Security in CI/CD

| Stage | Tool | What it catches |
| --- | --- | --- |
| Pre-commit | TruffleHog, gitleaks | Secrets before they enter history |
| SAST | Semgrep, CodeQL, SonarQube | Code-level vulnerabilities (injection, XSS) |
| Dependency scan | `npm audit`, `pip-audit`, Trivy | Known CVEs in packages |
| Container scan | Trivy, Anchore | Vulnerable base images, misconfigurations |
| DAST | OWASP ZAP (in staging) | Runtime vulnerabilities (headers, CORS) |

### SAST Quick Start (Semgrep)

```yaml
# .github/workflows/security.yml
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/python
```

### Multi-Ecosystem Dependency Scanning

Detect ecosystem by file presence:

| File | Ecosystem | Scan command |
| --- | --- | --- |
| `package.json` | npm | `npm audit --json` |
| `pyproject.toml` / `requirements.txt` | Python | `pip-audit --format json` |
| `go.mod` | Go | `govulncheck ./...` |
| `Cargo.toml` | Rust | `cargo audit --json` |

### Supply Chain Security

- **SBOM** (Software Bill of Materials): generate with CycloneDX or Syft
- **SLSA** framework: provenance attestation for build artifacts
- **Signed commits**: require GPG/SSH signing on protected branches

## STRIDE Workflow: Threats → Requirements → Tests

> Extracted from `wshobson/agents` plugin `security-scanning` — stride-analysis-patterns + security-requirement-extraction skills

For each system component, systematically evaluate all 6 STRIDE categories:

### Step 1: Identify Threats per Component

| Component | S | T | R | I | D | E |
| --- | --- | --- | --- | --- | --- | --- |
| Auth endpoint | Session hijack | Token tamper | No audit log | Credential leak | Brute force | Privilege escalation |
| API gateway | IP spoof | Request tamper | Missing logs | Data exposure | DDoS | Bypass auth |
| Database | — | SQL injection | — | Backup leak | Connection exhaustion | Direct access |

### Step 2: Generate Security Requirements

For each identified threat, generate a requirement with acceptance criteria:

```markdown
**REQ-SEC-001**: Authentication tokens must be tamper-proof
- Acceptance: JWT signed with RS256, validated on every request
- Test: Modify token payload → expect 401
- OWASP: A02 (Cryptographic Failures)
- Compliance: PCI-DSS 8.1
```

### Step 3: Write Security Test Cases

```python
def test_tampered_jwt_is_rejected(client):
    """STRIDE: Tampering — token modification must be detected."""
    token = create_valid_token(user_id=1)
    tampered = token[:-5] + "XXXXX"  # corrupt signature
    response = client.get("/api/me", headers={"Authorization": f"Bearer {tampered}"})
    assert response.status_code == 401
```

## Attack Tree Analysis

> Extracted from `wshobson/agents` plugin `security-scanning` — attack-tree-construction skill

For high-value targets, build an attack tree to prioritize mitigations:

```
Goal: Steal user credentials
├── OR: Phish credentials (cost: low, skill: low)
├── OR: SQL injection on login (cost: low, skill: medium)
│   └── AND: Find unparameterized query
│   └── AND: Exfiltrate users table
├── OR: Compromise session store (cost: medium, skill: high)
└── OR: Man-in-the-middle (cost: high, skill: high)
    └── AND: No TLS or weak TLS config
```

**Prioritization**: mitigate cheapest/easiest attack paths first (highest ROI).

## Compliance Mapping (when applicable)

Only relevant for regulated projects. Not a replacement for legal counsel.

| Regulation | Key Code-Level Requirements |
| --- | --- |
| **GDPR** | Consent management, right to erasure, data minimization, pseudonymization |
| **SOC 2** | MFA enforcement, RBAC, encryption at rest + transit, audit logging |
| **HIPAA** | PHI access control (minimum necessary), FIPS 140-2 encryption |
| **PCI-DSS** | Card tokenization, network segmentation, vulnerability remediation timelines |

### Audit Logging for Compliance

```python
# Tamper-evident logging: chain log entries with checksums
import hashlib

def log_audit_event(event: dict, previous_hash: str) -> str:
    event["previous_hash"] = previous_hash
    payload = json.dumps(event, sort_keys=True)
    event["hash"] = hashlib.sha256(payload.encode()).hexdigest()
    logger.info("audit_event", **event)
    return event["hash"]
```

## References

### External Frameworks
- OWASP, *Top 10 Web Application Security Risks* (2021)
- Microsoft, *STRIDE Threat Model* (1999)
- NIST, *Secure Software Development Framework* (SP 800-218)
- SLSA, *Supply-chain Levels for Software Artifacts* — https://slsa.dev/

### Tools
- Semgrep: https://semgrep.dev/
- CodeQL: https://codeql.github.com/
- Trivy: https://trivy.dev/
- TruffleHog: https://github.com/trufflesecurity/trufflehog
- CycloneDX (SBOM): https://cyclonedx.org/

### Related Skills
- `/review` -- Per-change review includes basic security checks
- `/tech-debt-audit` -- Overlapping on dependency health
- `block-secrets.js` hook -- Commit-time secret detection (complementary)

### Credit
- Inspired by Desktop Commander "Assess Project's Security" prompt pattern.
- DevSecOps, STRIDE workflow, and compliance sections extracted from `wshobson/agents` plugins `security-compliance` (v1.3.0) and `security-scanning` (v1.3.0).
