# Architecture

## Layering

The application is structured as:

```text
routes -> controllers -> services -> repos
```

### Routes

Routes translate HTTP requests into controller calls.

Responsibilities:

- attach middleware
- validate request shape
- delegate to controllers

Routes should avoid owning business rules.

Current route modules:

- `src/routes/users.js`
- `src/routes/wallets.js`
- `src/routes/transfers.js`

System routes (`/`, `/health`, `/api-docs`) are attached directly in `src/app.js`.

### Controllers

Controllers translate Express request state into service calls and HTTP responses.

Responsibilities:

- read validated params, body, and authenticated user data
- call services
- choose response status codes for success paths
- pass failures to the error middleware

Current controller modules:

- `src/controllers/users.js`
- `src/controllers/wallets.js`
- `src/controllers/transfers.js`

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
- Authentication failures are handled in `src/middlewares/auth.js`.
- Self-only user mutation checks are handled in `src/middlewares/authorizeSelf.js`.
- Domain and application errors are defined in `src/lib/errors.js`.
- Final HTTP error translation happens in `src/middlewares/errorHandler.js`.

Expected application failures should surface with explicit status codes.

Current API conventions:

- validation errors return `400` with `message` plus a `details` array
- missing bearer token returns `401` with `Missing Authorization header!`
- malformed bearer header returns `401` with `Malformed authorization header`
- invalid or expired token returns `401` with `Invalid or expired token`
- ownership failures return `403`
- missing resources return `404`
- unique username violations return `409`

## Wallet Rules

- Users can create wallets for themselves.
- Users can only view and delete their own wallets.
- Wallet balances are increased through explicit deposit operations.
- Transfers are the main cross-wallet balance-changing operation.
- Wallet creation always starts with a zero balance.

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

- The Docker Compose setup creates the development database only; create `wallet_test_db` separately before running tests.
- Test scripts explicitly run with `NODE_ENV=test`.
- The test harness truncates `transfers`, `wallets`, and `users` before each test for deterministic integration tests.
- Development migrations are usually run through `npm run knex -- migrate:latest`.
