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

## Main Endpoints

- `POST /transfers`
- `GET /transfers`
