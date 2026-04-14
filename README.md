# Wallet API

REST API for authenticated wallet management and transactional transfers, built with Node.js, Express, Knex, and PostgreSQL.

## What It Does

- Registers users and authenticates them with JWT.
- Lets authenticated users create and view their own wallets.
- Supports deposits into owned wallets.
- Supports transactional transfers between wallets with ownership and balance checks.
- Exposes Swagger UI at `/api-docs`.

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
  db/           Knex connection, migrations, seeds
  lib/          Shared application errors
  middlewares/  Auth, validation, error handling
  repo/         Database access
  routes/       HTTP routes
  services/     Business logic
```

The current design follows `routes -> services -> repos`.

## Local Setup

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Make sure the test database exists:

```bash
docker exec -it wallet-api-postgres-1 psql -U wallet -d postgres -c "CREATE DATABASE wallet_test_db;"
```

4. Run the API:

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

- Development commands use `wallet_db`.
- Test commands force `NODE_ENV=test` and use `wallet_test_db`.

This keeps test resets away from development data.

## Useful Commands

```bash
npm start
npm test
npm run db:migrate:up
npm run db:seed
npm run lint
npm run format:check
```

## Main API Endpoints

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
- Balance changes are no longer client-settable through a generic update route.
- Error handling is moving toward explicit domain errors with consistent HTTP status codes.
