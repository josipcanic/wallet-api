# Transfers Spec

## Purpose

The transfers domain moves funds between wallets with ownership and balance checks.

## Supported Behavior

- Authenticated users can create transfers from their own source wallet.
- Authenticated users can list transfers involving their wallets.

## Rules

- Source and destination wallets must be different.
- Source wallet must exist.
- Destination wallet must exist.
- Source wallet must belong to the authenticated user.
- Source wallet must have enough balance.
- Transfer creation runs inside a database transaction.
- Transfer listing returns both outgoing and incoming transfers for the authenticated user's wallets.
- Transfers are ordered by `created_at` descending.
- Amounts use the shared positive decimal validation rule.
- Ownership failures return `403` with `Forbidden`.
- Same-wallet transfers return `400` with `Cannot transfer to same wallet`.

## Main Endpoints

- `POST /transfers`
- `GET /transfers`
