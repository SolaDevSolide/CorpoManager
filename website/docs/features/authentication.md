---
title: Authentication
---
# Authentication

## Overview
The **Authentication** module manages user login, credential verification, and JWT issuance in the backend (NestJS + Prisma). It ensures only active users with valid passwords can obtain access tokens.

## Purpose
- Securely verify user identity via email/password.
- Hash passwords with Argon2 for storage and comparison.
- Issue signed JSON Web Tokens (JWTs) for stateless session management.

## Architecture / Flow

1. **Login Request**
    - Client POSTs to `/auth/login` with `{ email, password }`.
2. **User Lookup**
    - `AuthService.validateUser()` queries Prisma for user by email, selecting `password` and `isActive`.
3. **Password Verification**
    - Argon2’s `verify()` compares stored hash with provided password.
4. **JWT Issuance**
    - On success, `AuthService.login()` builds a payload (`sub`, `email`, `role`), signs it with `JwtService`, and returns `{ accessToken, expiresIn }`.
5. **Token Usage**
    - Client includes `Authorization: Bearer <token>` in subsequent requests.

## Key Files & Modules

- **`packages/backend/src/auth/auth.service.ts`**
    - `validateUser(email, pass): Promise<User>`
    - `login(user): { accessToken; expiresIn }`
- **`packages/backend/src/auth/jwt-payload.interface.ts`**
    - Defines the shape of the JWT payload:
      ```ts
      export interface JwtPayload {
        sub:   string;
        email: string;
        role:  Role;
      }
      ```

## API / Interface

### POST `/auth/login`
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "plaintextPassword"
}
```

**Response**

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 1615123456
}
```

## Testing Notes

-   Unit tests in `packages/backend/test/auth/auth.service.spec.ts`

    -   Mocks `PrismaService.user.findUnique`, `argon2.verify()`, and `JwtService`.


## How to Contribute or Extend

-   **Add MFA flow**: create a new strategy under `src/auth/` and hook it into `AuthModule`.

-   **Custom claims**: adjust the payload in `AuthService.login()` before signing.

-   **Change hashing**: swap Argon2 calls for another algorithm, updating both `validateUser()` and storage logic.


## Related Links

- [JWT Strategy](./jwt-strategy)
- [Roles Guard](./roles-guard)