# Plugins Claude Code à évaluer

> Source : https://github.com/wshobson/agents
> Stratégie : extraction du delta utile dans nos fichiers (stacks/skills), pas d'installation permanente
> Revue initiale : 2026-02-28

## Priorité haute

- [x] `python-development` — Delta extrait dans `.claude/stacks/python.md` (async patterns, background jobs, FastAPI, Pydantic V2, SQLAlchemy 2.0 async, anti-patterns avancés, performance)
- [x] `cicd-automation` — Nouveau stack guide `.claude/stacks/cicd.md` (GitHub Actions templates, deployment strategies, DORA metrics, secrets management, Renovate)
- [x] `shell-scripting` — Nouveau stack guide `.claude/stacks/shell.md` (10 defensive patterns, Bats testing, ShellCheck, POSIX vs Bash, Bash 5.x features)
- [x] `security-compliance` — Delta extrait dans `.claude/skills/security-audit/SKILL.md` (DevSecOps pipeline, SAST, supply chain security, compliance mapping GDPR/SOC2/HIPAA/PCI-DSS)
- [x] `observability-monitoring` — Nouveau stack guide `.claude/stacks/observability.md` (golden signals PromQL, SLI/SLO/SLA, service tiers, error budget, OpenTelemetry, structured logging)

## Priorité moyenne

- [x] `cloud-infrastructure` — Nouveau stack guide `.claude/stacks/terraform.md` (module architecture, state management, cost optimization, service mesh, networking patterns)
- [x] `security-scanning` — Delta extrait dans `.claude/skills/security-audit/SKILL.md` (STRIDE workflow → requirements → tests, attack tree analysis)
- [x] `incident-response` — Nouveau skill `.claude/skills/incident-response/SKILL.md` + commande `/incident-response` (workflow 5 phases avec checkpoints, runbooks, postmortem template, on-call handoff)
- [x] `agent-orchestration` — Idées notées dans `memory/patterns.md` (failure mode classification, file-based context, agent versioning). Non intégré : trop théorique/enterprise.

## Veille périodique

Configurée dans `memory/MEMORY.md` section "Plugin Watch" :
- Fréquence : mensuelle
- Axe 1 : mises à jour des 9 agents évalués (ré-extraction du delta si évolution)
- Axe 2 : nouveaux agents dans le repo (évaluation + extraction si pertinent)
