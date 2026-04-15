# AGENTS

This repository is structured for agent and human legibility.

## Project Overview

- Backend API for users, wallets, deposits, and transfers.
- Stack: Node.js, Express, Knex, PostgreSQL.
- Swagger docs are served from `/api-docs`.

## Repo Map

- `src/routes/`: HTTP routes
- `src/services/`: business logic
- `src/repo/`: database access
- `src/auth/`: JWT and password helpers
- `src/middlewares/`: auth, validation, error handling
- `src/db/`: migrations, seeds, DB bootstrap
- `tests/`: integration tests
- `docs/`: repository knowledge base

## Architecture Rules

- Routes handle HTTP concerns only.
- Services own business logic and orchestration.
- Repositories own database access only.
- JWT signing and password hashing do not belong in repos.
- Public clients must not directly set wallet balances.
- Tests must run against `wallet_test_db`, never `wallet_db`.

## Main Commands

```bash
docker compose up -d
npm start
npm run lint
npm test
```

## Documentation Index

- `ARCHITECTURE.md`
- `docs/index.md`
- `docs/product-specs/users.md`
- `docs/product-specs/wallets.md`
- `docs/product-specs/transfers.md`
- `docs/runbooks/local-dev.md`
- `docs/runbooks/testing.md`
- `docs/generated/route-map.md`

## Working Norms

- Prefer changing services before routes when behavior changes.
- Prefer changing repos only when query/data access behavior changes.
- Keep docs aligned with real API behavior.
- When adding a new rule, document it in the relevant product spec.
- When changing commands or environment assumptions, update the runbooks.
