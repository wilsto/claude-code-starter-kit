# Research Before Acting

**Principe : "Quand tu ne sais pas, cherche. Quand tu crois savoir, vérifie. Quand tu proposes une architecture, regarde ce que la communauté fait."**

## Quand chercher (obligatoire)

### 1. Plan mode / Design d'architecture
Avant de proposer une architecture ou un design :
- **WebSearch** : comment d'autres ont résolu le même problème, patterns existants, approches alternatives
- **context7** : doc officielle des frameworks/libs impliqués (`resolve-library-id` → `query-docs`)
- Ne pas se limiter au "comment" — chercher aussi le "quoi" (quelle approche, quel outil, quelle lib)

### 2. Brainstorm / Idéation
Quand on explore des solutions ou qu'on propose des options :
- **WebSearch** : idées, bonnes pratiques, retours d'expérience, solutions créatives dans la communauté
- Chercher sur forums (Stack Overflow, Reddit, Discord), blogs techniques, GitHub (issues, discussions, READMEs)
- Intelligence collective > hypothèses internes

### 3. Nouvelle techno / lib inconnue
Avant d'écrire du code utilisant une lib qu'on n'a pas encore vérifiée :
- **context7** : `resolve-library-id` → `query-docs` pour l'API actuelle
- Vérifier la version recommandée, les breaking changes récents

### 4. Configuration d'outil / service
Avant de configurer (docker-compose, CI/CD, linter, bundler, etc.) :
- **context7** ou **WebFetch** (doc officielle) : format de config actuel
- Ne jamais deviner un format de config — toujours vérifier

### 5. Erreur incomprise
Quand un message d'erreur n'est pas immédiatement clair :
- **WebSearch** : le message d'erreur exact (entre guillemets)
- Chercher des issues GitHub connues avant de tenter un fix
- Ne pas boucler sur le même fix — chercher d'abord

### 6. API externe
Avant d'appeler ou configurer une API tierce :
- **WebFetch** / **context7** : endpoint actuel, schema, auth method
- Ne jamais deviner un endpoint ou un format de payload

## Outils disponibles

| Outil | Usage principal |
|-------|----------------|
| **context7** (`resolve-library-id` → `query-docs`) | Doc officielle d'une lib/framework spécifique |
| **WebSearch** | Forums, blogs, GitHub issues, retours d'expérience, idées |
| **WebFetch** | Page de doc officielle spécifique (URL connue) |

## Anti-patterns

- Écrire du code basé uniquement sur la mémoire interne (cutoff mai 2025)
- Deviner un format de config ou une API sans vérifier
- Boucler sur une erreur sans chercher le message exact
- Proposer une architecture sans regarder ce qui se fait dans la communauté
- Se limiter au "comment" sans explorer le "quoi" (quel outil, quelle approche)
