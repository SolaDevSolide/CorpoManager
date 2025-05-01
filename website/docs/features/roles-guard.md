---
title: Role-Based Access Control (RolesGuard)
---
# Role-Based Access Control (RolesGuard)

## Overview
The **RolesGuard** enforces route-level permissions by checking that `req.user.role` matches the roles specified via metadata on your controllers or handlers.

## Purpose
- Provide fine-grained authorization beyond simple authentication.
- Ensure users only access endpoints appropriate to their role(s).

## Architecture / Flow

1. **Metadata Declaration**
    - Use a custom decorator (e.g. `@Roles('ADMIN')`) to tag handlers with required roles.
2. **Guard Invocation**
    - NestJS invokes `RolesGuard.canActivate()` for protected routes.
3. **Role Check**
    - Guard retrieves the `roles` metadata from the handler via `Reflector`.
    - Compares `req.user.role` against the required roles.
    - Throws `ForbiddenException` if no match.

## Key Files & Modules

- **`packages/backend/src/auth/roles.guard.ts`**  
  Implements `CanActivate`; uses `Reflector` + `PrismaService` (for future dynamic checks).
- **(Optional) `roles.decorator.ts`**  
  A decorator to set metadata (not shown here, but typically implemented).

## Usage Example

```ts
@Controller()
export class SomeController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-only')
  async getAdminData() {
    // Your implementation here
    return { message: 'Admin data' };
  }
}
```

## Testing Notes

-   Tests in `packages/backend/test/auth/roles.guard.spec.ts`

    -   Mocks `Reflector.get()` and simulates various `req.user.role` values.


## How to Contribute or Extend

-   **Dynamic policies**: inject `PrismaService` to fetch permissions at runtime.

-   **Multiple roles**: allow an array of roles, e.g. `@Roles('ADMIN', 'SUPER_ADMIN')`.


## Related Links

- [Authentication](./authentication)
- [JWT Strategy](./jwt-strategy)