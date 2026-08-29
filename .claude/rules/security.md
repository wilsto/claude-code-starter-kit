# Security Rules

- **Never commit secrets**: `.env*`, `secrets.*`, `*.secret`, `*.key`, `*.pem`, `config.json`
- **Always maintain** `.example` counterparts for every secret file
- **Confirmation required** before destructive operations: `docker compose down`, `rm -rf`, service restart in prod, any non-reversible SSH command
- **Never deploy to production** without explicit PO request

## Secrets centralisés

- **Source de vérité pour les secrets multi-projets** : `~/.secrets.env` (sourcé par $PROFILE et ~/.bashrc)
  - Exemples : clés API LLM, tokens GitHub/Docker, credentials Home Assistant
- **Ne jamais dupliquer** un secret multi-projet dans un `.env` local — utiliser les variables d'environnement héritées du shell
- **Secrets spécifiques projet** (ex: clé Stripe test, DB locale) : légitimes dans `.env` local, toujours gitignored
- **Gitignore global** (`~/.gitignore_global`) configuré pour exclure `.secrets.env` — ne pas le retirer
