# Claude Code Template — Starter Pack

Template de bonnes pratiques Claude Code : hooks, skills, memory, permissions.
Agnostique au langage. SOLID, TDD, DevOps.

## Structure

```
Template-claude/
├── README.md                    # Ce fichier
├── CLAUDE.md                    # Contrat projet (rules, workflow, conventions)
├── CLAUDE.local.md              # Preferences perso (gitignored)
├── .gitignore
├── .claudeignore                # Exclut build/deps du contexte Claude
├── .claude/
│   ├── settings.json            # Permissions + hooks wiring
│   ├── hooks/
│   │   ├── block-secrets.js     # Hard-deny sur fichiers secrets
│   │   ├── tdd-guard.js         # Rappel TDD soft sur source edits
│   │   └── session-context.js   # Injecte memory au startup/compact/resume
│   ├── rules/                   # Regles conditionnelles (auto-chargees par paths)
│   │   ├── python.md            # Charge quand on edite du Python
│   │   ├── nextjs.md            # Charge quand on edite du TS/TSX
│   │   ├── node.md              # Charge quand on edite du JS
│   │   ├── go.md                # Charge quand on edite du Go
│   │   └── rust.md              # Charge quand on edite du Rust
│   ├── stacks/                  # Language-specific guides (stackable)
│   │   ├── python.md
│   │   ├── nextjs.md
│   │   ├── node.md
│   │   ├── go.md
│   │   └── rust.md
│   └── skills/
│       ├── tdd/SKILL.md         # /tdd Red-Green-Refactor workflow
│       └── commit/SKILL.md      # /commit quality gate + conventional commit
└── memory/
    ├── MEMORY.md                # Index auto-injecte (<200 lignes)
    ├── active-context.md        # Contexte actif (focus + next steps injectes)
    ├── scratchpad.md            # Log de travail (30 dernieres lignes injectees)
    ├── decisions.md             # ADR-lite (on-demand)
    ├── patterns.md              # Topic file on-demand
    └── session-cache.json       # Handoff de session (auto-genere)
```

---

## Mode 1 : CREATE — Nouveau projet from scratch

1. Copier le template :
   ```bash
   cp -r Template-claude/ mon-projet/
   cd mon-projet && git init
   ```

2. Remplacer tous les `{{PLACEHOLDER}}` dans ces fichiers :

   | Placeholder | Ou | Exemple |
   |---|---|---|
   | `{{PROJECT_NAME}}` | CLAUDE.md, memory/MEMORY.md | `my-api` |
   | `{{PROJECT_DESCRIPTION}}` | memory/MEMORY.md | `REST API for user management` |
   | `{{SRC_DIR}}` | CLAUDE.md | `src/` |
   | `{{TEST_COMMAND}}` | CLAUDE.md, skills/tdd, skills/commit | `npx vitest run` / `pytest` / `go test ./...` |
   | `{{TEST_COMMAND_SINGLE}}` | skills/tdd | `npx vitest run` / `pytest` / `go test` |
   | `{{TEST_COMMAND_COVERAGE}}` | skills/tdd | `npx vitest run --coverage` / `pytest --cov` |
   | `{{FORMAT_COMMAND}}` | CLAUDE.md | `npx prettier --check .` / `ruff check . && ruff format --check .` |
   | `{{FORMAT_CHECK_COMMAND}}` | skills/commit | idem |
   | `{{FORMAT_FIX_COMMAND}}` | skills/commit | `npx prettier --write .` / `ruff check --fix . && ruff format .` |
   | `{{DEFAULT_BRANCH}}` | skills/commit | `main` |
   | `{{CONVERSATION_LANGUAGE}}` | CLAUDE.md | `francais` / `english` |

3. Adapter les hooks :
   - `block-secrets.js` : ajouter les noms de fichiers secrets specifiques au projet dans `BLOCKED_PATHS`
   - `tdd-guard.js` : ajuster `SRC_DIRS` et `SOURCE_EXTENSIONS` pour le layout du projet

4. Remplir `memory/MEMORY.md` : identite projet, preferences utilisateur

5. Personnaliser `CLAUDE.local.md` avec tes preferences perso

6. Optionnel : installer pro-workflow en scope local
   ```bash
   claude plugin install pro-workflow
   ```

7. Verifier : lancer Claude Code, les hooks doivent se charger automatiquement

8. Premier commit :
   ```bash
   git add -A && git commit -m "chore: init from claude-template"
   ```

---

## Mode 2 : CONFORMITE — Projet existant

Pour mettre un projet existant aux normes du template **sans perdre ses directives existantes**.

### Strategie 3 couches (reconciliation CLAUDE.md)

Claude Code charge les fichiers par precedence croissante. On exploite cette hierarchie :

```text
Couche 1 — CLAUDE.md (template, committe)
  TDD rules, quality gates, conventions, commit rhythm
  → Le socle commun du starter-kit

Couche 2 — .claude/rules/*.md (projet, committe)
  architecture.md, api-conventions.md, database.md...
  → Les directives specifiques du projet
  → SURCHARGE le template si contradiction

Couche 3 — CLAUDE.local.md (perso, gitignored)
  URLs sandbox, tokens locaux, preferences IDE
  → Jamais partage, jamais en conflit
```

**Principe** : le CLAUDE.md du template fournit le socle. Les directives existantes du projet vont dans `.claude/rules/` (precedence plus haute). Aucune perte.

### Etape 1 : Copier les fichiers manquants

```bash
# Depuis le projet existant :
cp -r Template-claude/.claude/ .claude/        # hooks + skills + settings
cp Template-claude/.claudeignore .claudeignore  # context exclusions
cp -r Template-claude/memory/ memory/           # memory system
```

### Etape 2 : Reconcilier CLAUDE.md (ne pas ecraser)

**Option A** — Automatique (recommande) :

```bash
/audit-conformity
```

L'audit detecte le CLAUDE.md existant, identifie les gaps et conflits, puis propose un plan de reconciliation interactif. Il ne modifie rien sans approbation.

**Option B** — Manuel :

1. **Garder le CLAUDE.md existant** comme base
2. **Ajouter** les sections template manquantes (TDD Rules, Quality Gate, Model Selection, Conventions)
3. **Deplacer** les directives projet-specifiques (architecture, API, DB) vers `.claude/rules/` :
   - `architecture.md` — decisions d'architecture
   - `api-conventions.md` — conventions API
   - `database.md` — schema, migrations
4. **En cas de contradiction** : la directive dans `.claude/rules/` gagne (precedence plus haute)
5. **Ne PAS ecraser** `CLAUDE.local.md` si deja present

### Etape 3 : Adapter

- `block-secrets.js` : verifier que `BLOCKED_PATHS` couvre les secrets du projet
- `tdd-guard.js` : ajuster `SRC_DIRS` pour le layout reel
- `settings.json` : fusionner deny list avec les permissions existantes
- `memory/MEMORY.md` : remplir les sections

### Checklist de conformite

- [ ] `block-secrets.js` protege tous les fichiers secrets du projet ?
- [ ] `tdd-guard.js` couvre les bons repertoires source ?
- [ ] `.claudeignore` exclut build artifacts et deps ?
- [ ] `CLAUDE.md` contient TDD Rules + Quality Gate + Conventions ?
- [ ] Directives projet-specifiques dans `.claude/rules/` (pas dans CLAUDE.md) ?
- [ ] `memory/MEMORY.md` existe avec Session Notes ?
- [ ] `settings.json` deny list inclut les destructives ?
- [ ] `.gitignore` inclut `CLAUDE.local.md` ?

> **Tip** : Relancez `/audit-conformity` apres les modifications pour valider le score. Les checks non applicables peuvent etre marques "skip" avec une raison.

### Test des hooks

```bash
# block-secrets (doit afficher deny)
echo '{"tool_input":{"file_path":".env.local"}}' | node .claude/hooks/block-secrets.js

# tdd-guard (doit afficher message TDD)
echo '{"tool_input":{"file_path":"src/app.ts"}}' | node .claude/hooks/tdd-guard.js

# session-context (pas d'erreur, exit 0)
node .claude/hooks/session-context.js
```

---

## Plugins recommandes

### Globaux (user-scope, deja installes)

| Plugin | Role |
|---|---|
| `security-guidance` | Alertes vulnerabilites a l'edition |
| `pr-review-toolkit` | 6 agents de review specialises |
| `hookify` | Creer des hooks depuis markdown |
| `feature-dev` | Cycle explore > design > implement > review |
| `claude-md-management` | Audit qualite CLAUDE.md |
| `claude-code-setup` | Recommandations d'automatisation |

### pro-workflow (scope local, opt-in par projet)

```bash
claude plugin install pro-workflow
```

**Utiliser du plugin** : `/deslop` (nettoyage slop AI), scout agent (confidence gate), `/insights` (analytics), reviewer agent

**Preferer les skills custom du template** :
- `/commit` > `/smart-commit` (plus de controle sur les gates)
- Stop hook > `/wrap-up` (automatique, pas besoin de penser a le lancer)
- `memory/MEMORY.md` > `/learn-rule` (format libre, plus flexible)

**Regle** : en cas de doublon, le skill custom gagne.

---

## Ce que le template inclut vs exclut

| Inclus | Exclu (projet-specifique) |
|---|---|
| Protection secrets (hook) | MCP server configs |
| TDD enforcement (hook + skill) | Deploy scripts |
| Session memory (hook + files) | Task manager integration |
| Quality-gated commits (skill) | Custom CI/CD pipelines |
| Destructive command deny list | Server-specific permissions |
| Context window optimization | — |
| Stack guides (`.claude/stacks/`) | — |

> **Tip** : Les valeurs par defaut des placeholders sont definies dans chaque fichier stack (`.claude/stacks/<stack>.md`, section `## Defaults`). Le wizard `/setup` les charge automatiquement.
