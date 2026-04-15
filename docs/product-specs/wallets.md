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
- Wallet balances are not directly client-settable through a generic update route.
- Deposits increase wallet balance by a positive amount.
- Transfers are a separate domain and also affect balances.

## Main Endpoints

- `POST /wallets`
- `GET /wallets`
- `GET /wallets/:id`
- `POST /wallets/:id/deposits`
- `DELETE /wallets/:id`
