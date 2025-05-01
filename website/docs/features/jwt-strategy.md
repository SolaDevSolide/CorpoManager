---
title: JWT Strategy & Payload Validation
---
# JWT Strategy

## Overview
The **JWT Strategy** integrates with NestJS’s Passport to validate incoming JWTs, ensure the user still exists and is active, and attach the payload to `req.user`.

## Purpose
- Decode and verify JWT signatures.
- Enforce that tokens belong to active users.
- Populate request context with authenticated user data.

## Architecture / Flow

1. **Token Extraction**
    - Passport extracts the token from `Authorization` header.
2. **Signature Verification**
    - Passport uses the configured secret to verify the signature.
3. **Payload Validation**
    - `JwtStrategy.validate(payload: JwtPayload)` is called.
    - It looks up the user by `payload.sub` (user ID) via Prisma.
    - If the user doesn’t exist or `isActive === false`, it throws `UnauthorizedException`.
4. **Attach to Request**
    - On success, returns the validated payload, which becomes `req.user`.

## Key Files & Modules

- **`packages/backend/src/auth/jwt.strategy.ts`**  
  Implements the Passport strategy using `@nestjs/jwt`.
- **`packages/backend/src/auth/jwt-payload.interface.ts`**  
  Shared payload interface between signing and validation.

## Testing Notes
- Tests in `packages/backend/test/auth/jwt.strategy.spec.ts`
    - Mocks `PrismaService.user.findUnique()`.
    - Verifies successful validate and exceptions for missing/inactive users.

## Related Links
- [Authentication](./authentication.md)
- [Roles Guard](./roles-guard.md)