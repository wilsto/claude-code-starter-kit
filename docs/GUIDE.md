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
│   │   └── session-context.js   # Injecte memory au startup + apres /compact
│   └── skills/
│       ├── tdd/SKILL.md         # /tdd Red-Green-Refactor workflow
│       └── commit/SKILL.md      # /commit quality gate + conventional commit
└── memory/
    ├── MEMORY.md                # Index auto-injecte (<200 lignes)
    └── patterns.md              # Topic file on-demand
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
   | `{{FORMAT_COMMAND}}` | CLAUDE.md | `npx prettier --check .` / `black --check .` |
   | `{{FORMAT_CHECK_COMMAND}}` | skills/commit | idem |
   | `{{FORMAT_FIX_COMMAND}}` | skills/commit | `npx prettier --write .` / `black .` |
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

Pour mettre un projet existant aux normes du template.

### Etape 1 : Copier les fichiers manquants

```bash
# Depuis le projet existant :
cp -r Template-claude/.claude/ .claude/        # hooks + skills + settings
cp Template-claude/.claudeignore .claudeignore  # context exclusions
cp -r Template-claude/memory/ memory/           # memory system
```

### Etape 2 : Fusionner (ne pas ecraser)

- **`.gitignore`** : ajouter les entrees manquantes (secrets, CLAUDE.local.md), ne pas ecraser
- **`CLAUDE.md`** : garder le contenu existant, ajouter les sections manquantes :
  - TDD Rules
  - Quality Gate
  - Model Selection
  - Secrets
  - Conventions (commit format)
- **`CLAUDE.local.md`** : ne PAS ecraser si deja present

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
- [ ] `memory/MEMORY.md` existe avec Session Notes ?
- [ ] `settings.json` deny list inclut les destructives ?
- [ ] `.gitignore` inclut `CLAUDE.local.md` ?

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
| Quality-gated commits (skill) | CI/CD pipelines |
| Destructive command deny list | Server-specific permissions |
| Context window optimization | Language-specific linters |
