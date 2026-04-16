# Route Map

## System

- `GET /` - returns `{ "message": "Wallet API is running" }`
- `GET /health` - returns `{ "ok": true }`
- `GET /api-docs` - serves Swagger UI

## Users

- `POST /users/register` - validates `username` and `password`, returns `201` or `409`
- `POST /users/login` - validates credentials, returns `{ jwtToken }`
- `GET /users` - requires bearer auth
- `GET /users/:id` - requires bearer auth and numeric positive `id`
- `PUT /users/:id` - requires bearer auth, numeric positive `id`, and self ownership
- `DELETE /users/:id` - requires bearer auth, numeric positive `id`, and self ownership

## Wallets

- `POST /wallets` - requires bearer auth, creates a zero-balance wallet
- `GET /wallets` - requires bearer auth, lists only owned wallets
- `GET /wallets/:id` - requires bearer auth and owned wallet access
- `POST /wallets/:id/deposits` - requires bearer auth, owned wallet access, and positive `amount`
- `DELETE /wallets/:id` - requires bearer auth and owned wallet access

## Transfers

- `POST /transfers` - requires bearer auth plus positive `amount`, positive wallet ids, and different source/destination wallets
- `GET /transfers` - requires bearer auth, lists incoming and outgoing transfers for the user's wallets
