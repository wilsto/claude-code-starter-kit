# Security Rules

- **Never commit secrets**: `.env*`, `secrets.*`, `*.secret`, `*.key`, `*.pem`, `config.json`
- **Always maintain** `.example` counterparts for every secret file
- **Confirmation required** before destructive operations: `docker compose down`, `rm -rf`, service restart in prod, any non-reversible SSH command
- **Never deploy to production** without explicit PO request
