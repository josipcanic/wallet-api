# Wallets Spec

## Purpose

The wallets domain manages wallets owned by authenticated users.

## Supported Behavior

- Users can create wallets for themselves.
- Users can list only their own wallets.
- Users can fetch only their own wallets by id.
- Users can deposit into only their own wallets.
- Users can delete only their own wallets.

## Rules

- Wallet ownership is enforced on read, deposit, and delete operations.
- Wallet creation always starts with `balance = 0`.
- Wallet balances are not directly client-settable through a generic update route.
- Deposits increase wallet balance by a positive amount.
- Deposit amounts use the shared positive decimal validation rule.
- Transfers are a separate domain and also affect balances.
- Unknown deposit body fields are stripped by validation middleware.
- Accessing another user's wallet returns `403` with `Forbidden`.
- Missing wallets return `404` with `Wallet not found`.

## Main Endpoints

- `POST /wallets`
- `GET /wallets`
- `GET /wallets/:id`
- `POST /wallets/:id/deposits`
- `DELETE /wallets/:id`
