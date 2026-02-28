# Stack: CI/CD & DevOps

> Extracted from `wshobson/agents` plugin `cicd-automation` (v1.2.1) — 2026-02-28

## Pipeline Architecture

Standard flow: Build → Test → Staging → Approve → Production → Verify → Rollback

### Best Practices

1. **Fail fast** — quick tests first (lint, type-check before integration tests)
2. **Parallel execution** — independent jobs run concurrently
3. **Cache dependencies** — between runs (`actions/cache`, `$CI_CACHE_KEY`)
4. **Artifact management** — pass build artifacts between stages, not rebuild
5. **Environment parity** — staging mirrors production
6. **Secrets via stores** — never hardcoded, use platform-native or Vault
7. **Deployment windows** — schedule prod deploys during low-traffic
8. **Monitoring integration** — health checks after deploy
9. **Rollback automation** — automatic rollback on health check failure
10. **Documentation** — every pipeline has a README explaining the flow

### Approval Patterns

| Pattern | Platform | Mechanism |
| --- | --- | --- |
| Manual gate | GitHub Actions | `environment:` with required reviewers |
| Time-based | GitLab CI | `start_in: 30 minutes` |
| Multi-approver | Azure Pipelines | Multiple required approvals on stage |

## Deployment Strategies

### Rolling Update

```yaml
strategy:
  rollingUpdate:
    maxUnavailable: 25%
    maxSurge: 25%
```

Best for: stateless services, simple deploys.

### Blue-Green

Two identical environments. Switch traffic atomically via load balancer or DNS.

```yaml
# Switch traffic
steps:
  - name: Switch traffic
    run: |
      kubectl patch service $SERVICE -p \
        '{"spec":{"selector":{"version":"$NEW_VERSION"}}}'
```

Best for: zero-downtime requirement, easy rollback.

### Canary

Route a percentage of traffic to new version, observe, increase gradually.

```yaml
# Argo Rollouts canary
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - setWeight: 30
        - pause: { duration: 10m }
        - setWeight: 60
        - pause: { duration: 10m }
```

Best for: high-risk changes, large user base.

### Feature Flags

Deploy code always, control activation via feature flag service (LaunchDarkly, Unleash, Flagsmith).

Best for: gradual rollout, A/B testing, kill switch.

## GitHub Actions Templates

### Test + Lint Workflow

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
```

### Docker Build + Push

```yaml
  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Deploy with Approval Gate

```yaml
  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://prod.example.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production ${{ github.sha }}
      - name: Health check
        run: |
          for i in $(seq 1 30); do
            curl -sf https://prod.example.com/health && exit 0
            sleep 10
          done
          exit 1
```

### Matrix Build (multi-version)

```yaml
  test:
    strategy:
      matrix:
        node-version: ['18', '20', '22']
        os: [ubuntu-latest, macos-latest]
      fail-fast: false
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci && npm test
```

### Reusable Workflow

```yaml
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - run: ./deploy.sh ${{ inputs.environment }} ${{ inputs.image-tag }}
```

## Secrets Management

### Hierarchy (simple → enterprise)

1. **Platform-native** — GitHub Secrets, GitLab CI Variables (for small teams)
2. **HashiCorp Vault** — Dynamic secrets, leasing, rotation (for enterprise)
3. **Cloud-native** — AWS Secrets Manager, Azure Key Vault, GCP Secret Manager
4. **External Secrets Operator** — Kubernetes: sync external secrets into K8s Secrets

### Pre-commit Secret Detection

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/trufflesecurity/trufflehog
    rev: v3.63.0
    hooks:
      - id: trufflehog
        entry: trufflehog git file://. --only-verified --fail
```

## DORA Metrics

Track these to measure CI/CD health:

| Metric | Elite | High | Medium | Low |
| --- | --- | --- | --- | --- |
| Deployment Frequency | On-demand (multiple/day) | Weekly-monthly | Monthly-6monthly | <1/6months |
| Lead Time for Changes | <1 hour | 1 day - 1 week | 1 week - 1 month | >1 month |
| Change Failure Rate | <5% | 5-10% | 10-15% | >15% |
| MTTR | <1 hour | <1 day | <1 week | >1 week |

## Dependency Update Automation

### Renovate (recommended)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "automerge": true,
  "automergeType": "pr",
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "matchDepTypes": ["devDependencies"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    }
  ]
}
```

## Reference

- **GitHub Actions docs**: https://docs.github.com/en/actions
- **Argo Rollouts**: https://argoproj.github.io/argo-rollouts/
- **DORA metrics**: https://dora.dev/
- **Renovate**: https://docs.renovatebot.com/
- **TruffleHog**: https://github.com/trufflesecurity/trufflehog
