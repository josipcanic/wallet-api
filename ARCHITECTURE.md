# Architecture

## Layering

The application is structured as:

```text
routes -> services -> repos
```

### Routes

Routes translate HTTP requests into service calls.

Responsibilities:

- attach middleware
- validate request shape
- call services
- return HTTP responses

Routes should avoid owning business rules.

### Services

Services contain domain logic.

Responsibilities:

- enforce business rules
- coordinate transactions
- check ownership and visibility rules
- map repository results into application behavior
- throw explicit app errors

Current service modules:

- `src/services/users.js`
- `src/services/wallets.js`
- `src/services/transfers.js`

### Repositories

Repositories are for database access only.

Responsibilities:

- read and write rows
- expose query helpers
- avoid HTTP logic
- avoid authentication concerns

Current repo modules:

- `src/repo/users.js`
- `src/repo/wallets.js`
- `src/repo/transfers.js`

## Authentication

- JWT verification happens in `src/middlewares/auth.js`.
- JWT creation lives in `src/auth/jwt.js`.
- Password hashing and comparison live in `src/auth/passwords.js`.

This keeps auth concerns out of repositories.

## Error Handling

- Validation errors are handled in `src/middlewares/validation.js`.
- Domain and application errors are defined in `src/lib/errors.js`.
- Final HTTP error translation happens in `src/middlewares/errorHandler.js`.

Expected application failures should surface with explicit status codes.

## Wallet Rules

- Users can create wallets for themselves.
- Users can only view and delete their own wallets.
- Wallet balances are increased through explicit deposit operations.
- Transfers are the main cross-wallet balance-changing operation.

The API intentionally does not expose a generic public "set wallet balance" route anymore.

## Transfer Flow

`POST /transfers` goes through:

1. auth middleware
2. body validation
3. `transfers` service
4. transaction with row locks
5. wallet balance updates
6. transfer insert

Important transfer invariants:

- source and destination wallets must be different
- source wallet must exist
- destination wallet must exist
- source wallet must belong to the authenticated user
- source wallet must have enough balance

## Development and Testing

- Development DB: `wallet_db`
- Test DB: `wallet_test_db`

Test scripts explicitly run with `NODE_ENV=test`, and the test harness truncates test tables before each test for deterministic integration tests.
CI validates the backend by running lint and the full test suite against that isolated test database.
