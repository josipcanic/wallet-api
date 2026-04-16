# Users Spec

## Purpose

The users domain handles registration, authentication, and self-service account management.

## Supported Behavior

- Users can register with `username` and `password`.
- Users can log in and receive a JWT.
- Authenticated users can list users.
- Authenticated users can fetch a user by id.
- Users can update only their own account.
- Users can delete only their own account.

## Rules

- `username` must be unique.
- `username` is validated as a trimmed string with length `3..30`.
- `password` is validated with length `8..128`.
- Passwords are stored as hashes, never plain text.
- Invalid login attempts return `401`.
- Duplicate usernames return `409`.
- `GET /users` and `GET /users/:id` are authenticated but not self-scoped.
- Self-only mutations are enforced through authenticated user id checks.
- Self-only mutation failures return `403` with `Forbidden: you can only modify your own account`.
- Validation failures return `400` with `message: "Validation error"` and a `details` array.

## Main Endpoints

- `POST /users/register`
- `POST /users/login`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
