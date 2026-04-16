# Wallet API

REST API for authenticated wallet management and transactional transfers, built with Node.js, Express, Knex, and PostgreSQL.

## What It Does

- Registers users and authenticates them with JWT.
- Lets authenticated users create and view their own wallets.
- Supports deposits into owned wallets.
- Supports transactional transfers between wallets with ownership and balance checks.
- Exposes Swagger UI at `/api-docs`.
- Exposes simple system routes at `/` and `/health`.

## Stack

- Node.js
- Express
- PostgreSQL
- Knex
- Joi
- Mocha, Chai, Supertest
- Docker Compose

## Project Structure

```text
src/
  auth/         JWT and password helpers
  controllers/  HTTP controllers between routes and services
  db/           Knex connection, migrations, seeds
  lib/          Shared application errors
  middlewares/  Auth, validation, error handling
  repo/         Database access
  routes/       HTTP routes
  services/     Business logic
```

The current request flow follows `routes -> controllers -> services -> repos`.

## Local Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Run development migrations:

```bash
npm run knex -- migrate:latest
```

4. Make sure the test database exists:

```bash
docker exec -it wallet-api-postgres-1 psql -U wallet -d postgres -c "CREATE DATABASE wallet_test_db;"
```

5. Run the API:

```bash
npm start
```

## Environment Variables

The repo uses `.env` for local values and `.env.example` as the template. Both files should have the same keys.

Important variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_TEST_NAME`
- `JWT_SECRET`

## Database Usage

- `docker compose up -d` creates the development database configured by `DB_NAME` and exposes PostgreSQL on `DB_PORT`.
- Development commands use `wallet_db` unless you override `DB_NAME`.
- `npm test`, `npm run db:reset`, `npm run db:migrate:up`, `npm run db:migrate:down`, and `npm run db:seed` force `NODE_ENV=test` and use `wallet_test_db`.
- The repository does not currently define a dedicated development migrate/seed npm alias beyond `npm run knex -- ...`.

This keeps test resets away from development data.
Tests always run against the dedicated PostgreSQL test database (`wallet_test_db`) so local development data is not modified.

## Useful Commands

```bash
npm start
npm test
npm run knex -- migrate:latest
npm run knex -- seed:run
npm run db:migrate:up
npm run db:seed
npm run lint
npm run format:check
```

## Main API Endpoints

- `GET /`
- `GET /health`
- `POST /users/register`
- `POST /users/login`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
- `POST /wallets`
- `GET /wallets`
- `GET /wallets/:id`
- `POST /wallets/:id/deposits`
- `DELETE /wallets/:id`
- `POST /transfers`
- `GET /transfers`

## Notes

- Transfers run inside a database transaction.
- Wallet balances are only changed through deposits and transfers; there is no public generic wallet update route.
- Validation strips unknown body fields and returns `400` with a `details` array.
- Authenticated routes return `401` for missing, malformed, invalid, or expired bearer tokens.
- Self-only user mutations return `403` with `Forbidden: you can only modify your own account`.
- Wallet ownership violations return `403` with `Forbidden`.
