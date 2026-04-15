# Local Development

## Start the Database

```bash
docker compose up -d
```

## Start the API

```bash
npm start
```

## Important Databases

- `wallet_db` for development
- `wallet_test_db` for tests

Both live in the same Postgres server by default.

## Useful Checks

```bash
npm run lint
npm test
```
