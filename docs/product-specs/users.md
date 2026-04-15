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
- Passwords are stored as hashes, never plain text.
- Invalid login attempts return `401`.
- Duplicate usernames return `409`.
- Self-only mutations are enforced through authenticated user id checks.

## Main Endpoints

- `POST /users/register`
- `POST /users/login`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
