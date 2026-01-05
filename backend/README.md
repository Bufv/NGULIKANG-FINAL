# Ngulikang Backend (Phase 1: Auth + User Management)

## Setup

1) Create env file:

```
cp .env.example .env
```

2) Update `DATABASE_URL` and secrets in `.env`.

3) Install dependencies:

```
npm install
```

4) Run migrations and seed:

```
npm run prisma:migrate
npm run seed
```

5) Start the server:

```
npm run dev
```

API runs on `http://localhost:5000`.

## Docs

OpenAPI spec: `docs/openapi.yaml`.

## Auth Flow

- `POST /api/auth/register` returns `{ user, accessToken, refreshToken }`.
- `POST /api/auth/login` returns `{ user, accessToken, refreshToken }`.
- Send `Authorization: Bearer <accessToken>` for protected routes.
- `POST /api/auth/refresh` to rotate refresh tokens.
- `POST /api/auth/logout` to revoke refresh token.

## Admin User Management

All admin endpoints require role `admin`:

- `GET /api/admin/users`
- `GET /api/admin/tukang`
- `POST /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `PUT /api/admin/tukang/:id/verify`

## Seed Accounts

- Admin: `admin@ngulikang.id` / `Admin123!`
- User: `user@ngulikang.id` / `User123!`
- Tukang: `tukang@ngulikang.id` / `Tukang123!`
