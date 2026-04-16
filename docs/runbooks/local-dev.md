# Local Development

## Bootstrap

```bash
cp .env.example .env
docker compose up -d
npm run knex -- migrate:latest
```

This starts PostgreSQL and creates the development schema in `wallet_db` by default.

## Start the API

```bash
npm start
```

## Important Databases

- `wallet_db` for development
- `wallet_test_db` for tests

Both live in the same Postgres server by default, but Docker Compose only creates `wallet_db` automatically.

Create the test database once before running tests:

```bash
docker exec -it wallet-api-postgres-1 psql -U wallet -d postgres -c "CREATE DATABASE wallet_test_db;"
```

## Useful Database Commands

```bash
npm run knex -- migrate:latest
npm run knex -- migrate:rollback
npm run knex -- seed:run
```

## Useful Checks

```bash
npm run lint
npm test
```
