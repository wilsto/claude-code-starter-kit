# Security Rules

- **Never commit secrets**: `.env*`, `secrets.*`, `*.secret`, `*.key`, `*.pem`, `config.json`
- **Always maintain** `.example` counterparts for every secret file
- **Confirmation required** before destructive operations: `docker compose down`, `rm -rf`, service restart in prod, any non-reversible SSH command
- **Never deploy to production** without explicit PO request

## Secrets centralisés

- **Source de vérité** : `C:\Users\Will\.secrets.env` (sourcé par $PROFILE et ~/.bashrc)
- **Ne jamais dupliquer** ces secrets dans les `.env` de projets — utiliser les variables d'environnement héritées du shell
- Si un projet a besoin d'un secret déjà présent dans `.secrets.env`, ne pas le recopier dans un `.env` local
- **Gitignore global** (`~/.gitignore_global`) configuré pour exclure `.secrets.env` — ne pas le retirer
