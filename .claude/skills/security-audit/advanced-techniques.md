# Security Audit — Advanced Techniques

> Extracted from `wshobson/agents` plugins `security-compliance` + `security-scanning` — 2026-02-28
> Loaded on demand by the security-auditor agent when needed.

## DevSecOps Pipeline Integration

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

> From `wshobson/agents` plugin `security-scanning` — stride-analysis-patterns + security-requirement-extraction skills

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

> From `wshobson/agents` plugin `security-scanning` — attack-tree-construction skill

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
