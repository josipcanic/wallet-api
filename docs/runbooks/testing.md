# Testing

## Test Database

Tests must use `wallet_test_db`.

The npm scripts already force `NODE_ENV=test`, so test commands should not touch `wallet_db`.
Create `wallet_test_db` manually before the first run if it does not exist yet.

## Main Commands

Run the full test suite:

```bash
npm test
```

Reset the test database, re-run migrations, then run the suite:

```bash
npm run db:reset
```

Run test migrations only:

```bash
npm run db:migrate:up
```

Roll back all test migrations:

```bash
npm run db:migrate:down
```

Run test seeds only:

```bash
npm run db:seed
```

## Notes

- `npm run db:migrate:up`, `npm run db:migrate:down`, and `npm run db:seed` all target the test database, not the development database.
- The test harness truncates `transfers`, `wallets`, and `users` before each test.
- Test scripts assume PostgreSQL is already running.
