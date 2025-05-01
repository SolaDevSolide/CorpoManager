---
title: Role Service (Promotion & Change)
---
# Role Service

## Overview
The **Role Service** encapsulates business logic around user role changes, including issuing one-time promotion tokens, direct role changes by super-admins, and token redemption flows.

## Purpose
- Allow SUPER_ADMINs to grant ADMIN roles via time-limited tokens.
- Enable controlled role transitions with audit logging.
- Safeguard against unauthorized or invalid role changes.

## Architecture / Flow

### issuePromotionToken(actorId, nextRole)
1. Verify **actor** has `SUPER_ADMIN` role.
2. Disallow issuing tokens for roles other than `ADMIN`.
3. Generate secure random token (via `crypto.randomBytes`).
4. Persist in `promotionToken` table with `createdBy`, `nextRole`.

### changeUserRole(actorId, targetId, newRole)
1. Verify **actor** has `SUPER_ADMIN`.
2. Fetch target user; guard against demoting last super-admin or creating new super-admin.
3. Prevent no-op (same role).
4. Update target’s role and log change in `roleChange` table.

### redeemPromotionToken(token, userId)
1. Fetch token; ensure it exists and not already used.
2. Retrieve token creator (must be SUPER_ADMIN).
3. Call `changeUserRole(creator, userId, nextRole)`.
4. Mark token as used with timestamp.

## Key Files & Modules

- **`packages/backend/src/role/role.service.ts`**  
  Implements all three flows above.
- **Prisma models**
    - `promotionToken`
    - `roleChange`

## Testing Notes
- Tests in `packages/backend/test/auth/role.service.spec.ts`
    - Mocks `PrismaService.user`, `promotionToken`, and `roleChange` methods.
    - Covers permission errors, invalid states, and successful paths.

## How to Contribute or Extend
- **New roles**: expand allowed `nextRole` in `issuePromotionToken`.
- **Expiry**: add token TTL and check in `redeemPromotionToken`.
- **Webhooks/Audit**: integrate external audit/logging after each change.

## Related Links
- [Authentication](./authentication.md)
- [Roles Guard](./roles-guard.md)