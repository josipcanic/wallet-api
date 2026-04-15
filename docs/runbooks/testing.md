# Testing

## Test Database

Tests must use `wallet_test_db`.

The npm scripts already force `NODE_ENV=test`, so test commands should not touch `wallet_db`.

## Main Commands

Run the full test suite:

```bash
npm test
```

Run test migrations only:

```bash
npm run db:migrate:up
```

Run test seeds only:

```bash
npm run db:seed
```

## Notes

- The test harness truncates test tables before each test.
- Test scripts assume PostgreSQL is already running.
